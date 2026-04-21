/**
 * convert-wrl-to-glb.mjs
 *
 * Parses VRML V2.0 (.wrl) from OpenCASCADE/Altium, including:
 *   - DEF/USE for geometry (IndexedFaceSet reuse across transforms)
 *   - DEF/USE for appearances (material reuse)
 *   - Per-Transform matrix (translation + axis-angle rotation)
 *
 * Usage:  node scripts/convert-wrl-to-glb.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Document, NodeIO, Primitive } from "@gltf-transform/core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ─── Matrix helpers ───────────────────────────────────────────────────────────

function makeMatrix(tx, ty, tz, ax, ay, az, angle) {
  const len = Math.sqrt(ax*ax + ay*ay + az*az);
  if (len < 1e-10) return { r00:1,r01:0,r02:0, r10:0,r11:1,r12:0, r20:0,r21:0,r22:1, tx,ty,tz };
  const nx=ax/len, ny=ay/len, nz=az/len;
  const c=Math.cos(angle), s=Math.sin(angle), t=1-c;
  return {
    r00: t*nx*nx+c,     r01: t*nx*ny-s*nz, r02: t*nx*nz+s*ny,
    r10: t*nx*ny+s*nz,  r11: t*ny*ny+c,    r12: t*ny*nz-s*nx,
    r20: t*nx*nz-s*ny,  r21: t*ny*nz+s*nx, r22: t*nz*nz+c,
    tx, ty, tz,
  };
}

function applyMatrix(m, arr, includeTranslation) {
  const out = new Float32Array(arr.length);
  for (let i = 0; i < arr.length; i += 3) {
    const x=arr[i], y=arr[i+1], z=arr[i+2];
    out[i]   = m.r00*x + m.r01*y + m.r02*z + (includeTranslation ? m.tx : 0);
    out[i+1] = m.r10*x + m.r11*y + m.r12*z + (includeTranslation ? m.ty : 0);
    out[i+2] = m.r20*x + m.r21*y + m.r22*z + (includeTranslation ? m.tz : 0);
  }
  return out;
}

// ─── VRML block extractor ─────────────────────────────────────────────────────

// Finds the { ... } block starting at or after `pos`, returns {content, end}
function extractBlock(text, pos) {
  // Advance to the opening brace
  while (pos < text.length && text[pos] !== "{") pos++;
  if (pos >= text.length) return null;
  const open = pos + 1;
  let depth = 1, i = open;
  while (i < text.length && depth > 0) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") depth--;
    i++;
  }
  if (depth !== 0) return null;
  return { content: text.slice(open, i - 1), end: i };
}

// ─── Pre-pass: collect all DEF geometry and appearance definitions ─────────────

function collectDefs(text) {
  const geomDefs = {};   // name → { localPositions, localNormals, indices }
  const colorDefs = {};  // name → [r, g, b]   (both Material & Appearance names)

  // ── Geometry DEFs ───────────────────────────────────────────────────────────
  const geomRe = /\bgeometry\s+DEF\s+(\S+)\s+IndexedFaceSet\s*\{/g;
  let gm;
  while ((gm = geomRe.exec(text)) !== null) {
    const blk = extractBlock(text, gm.index + gm[0].length - 1);
    if (!blk) continue;
    const ifs = blk.content;

    const coordMatch = /Coordinate\s*\{[^]*?point\s*\[([^\]]*)\]/.exec(ifs);
    if (!coordMatch) continue;
    const rawPts = coordMatch[1].trim().split(/,\s*/).filter(Boolean);
    const localPositions = new Float32Array(rawPts.length * 3);
    for (let i = 0; i < rawPts.length; i++) {
      const parts = rawPts[i].trim().split(/\s+/);
      localPositions[i*3]   = parseFloat(parts[0]||"0");
      localPositions[i*3+1] = parseFloat(parts[1]||"0");
      localPositions[i*3+2] = parseFloat(parts[2]||"0");
    }

    const idxMatch = /coordIndex\s*\[([^\]]*)\]/.exec(ifs);
    if (!idxMatch) continue;
    const rawIdx = idxMatch[1].trim().split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    const tris = [];
    let face = [];
    for (const idx of rawIdx) {
      if (idx === -1) {
        for (let i = 1; i+1 < face.length; i++) tris.push(face[0], face[i], face[i+1]);
        face = [];
      } else face.push(idx);
    }
    if (tris.length === 0) continue;
    const indices = new Uint32Array(tris);

    let localNormals = null;
    const normMatch = /Normal\s*\{[^]*?vector\s*\[([^\]]*)\]/.exec(ifs);
    if (normMatch) {
      const rawNorm = normMatch[1].trim().split(/,\s*/).filter(Boolean);
      localNormals = new Float32Array(rawNorm.length * 3);
      for (let i = 0; i < rawNorm.length; i++) {
        const parts = rawNorm[i].trim().split(/\s+/);
        localNormals[i*3]   = parseFloat(parts[0]||"0");
        localNormals[i*3+1] = parseFloat(parts[1]||"0");
        localNormals[i*3+2] = parseFloat(parts[2]||"0");
      }
    }

    geomDefs[gm[1]] = { localPositions, localNormals, indices };
  }

  // ── Appearance/Material DEFs ─────────────────────────────────────────────────
  // Match: DEF <AppName> Appearance { ... DEF <MatName> Material { diffuseColor r g b } ... }
  // We store color under BOTH the Appearance name and the Material name.
  const appRe = /\bDEF\s+(\S+)\s+Appearance\s*\{/g;
  let am;
  while ((am = appRe.exec(text)) !== null) {
    const appName = am[1];
    const blk = extractBlock(text, am.index + am[0].length - 1);
    if (!blk) continue;

    // Look for Material node inside Appearance block
    const matMatch = /(?:DEF\s+(\S+)\s+)?Material\s*\{([^}]*)\}/.exec(blk.content);
    if (!matMatch) continue;
    const matName = matMatch[1];
    const matBody = matMatch[2];

    // Extract diffuseColor (prefer) or emissiveColor (fallback)
    const diffuse = /diffuseColor\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)/.exec(matBody);
    const emissive = /emissiveColor\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)/.exec(matBody);
    const src = diffuse || emissive;
    if (!src) continue;
    const color = [parseFloat(src[1]), parseFloat(src[2]), parseFloat(src[3])];

    colorDefs[appName] = color;
    if (matName) colorDefs[matName] = color;
  }

  return { geomDefs, colorDefs };
}

// ─── Main parse pass ──────────────────────────────────────────────────────────

function parseVRML(text) {
  const { geomDefs, colorDefs } = collectDefs(text);

  console.log(`  DEF geometry: ${Object.keys(geomDefs).length}`);
  console.log(`  DEF colors:   ${Object.keys(colorDefs).length}`);

  const shapes = [];
  const IDENTITY = makeMatrix(0,0,0, 0,0,1, 0);

  const transformRe = /\bTransform\s*\{/g;
  let tm;
  while ((tm = transformRe.exec(text)) !== null) {
    const blk = extractBlock(text, tm.index + tm[0].length - 1);
    if (!blk) continue;
    const tb = blk.content;

    // Parse transform
    const tM = /translation\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)/.exec(tb);
    const rM = /rotation\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)/.exec(tb);
    const matrix = makeMatrix(
      tM ? parseFloat(tM[1]) : 0, tM ? parseFloat(tM[2]) : 0, tM ? parseFloat(tM[3]) : 0,
      rM ? parseFloat(rM[1]) : 0, rM ? parseFloat(rM[2]) : 0, rM ? parseFloat(rM[3]) : 1,
      rM ? parseFloat(rM[4]) : 0,
    );

    // Find all Shape nodes within this Transform
    const shapeRe = /\bShape\s*\{/g;
    let sm;
    while ((sm = shapeRe.exec(tb)) !== null) {
      const sBlk = extractBlock(tb, sm.index + sm[0].length - 1);
      if (!sBlk) continue;
      const sb = sBlk.content;

      // Resolve color
      let color = [0.5, 0.5, 0.5];
      const appUse = /\bappearance\s+USE\s+(\S+)/.exec(sb);
      const appDef = /\bDEF\s+(\S+)\s+Appearance/.exec(sb);
      if (appUse && colorDefs[appUse[1]]) {
        color = colorDefs[appUse[1]];
      } else if (appDef && colorDefs[appDef[1]]) {
        color = colorDefs[appDef[1]];
      } else {
        // Inline material
        const matBody = /Material\s*\{([^}]*)\}/.exec(sb);
        if (matBody) {
          const d = /diffuseColor\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)/.exec(matBody[1]);
          const e = /emissiveColor\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)/.exec(matBody[1]);
          const src = d || e;
          if (src) color = [parseFloat(src[1]), parseFloat(src[2]), parseFloat(src[3])];
        }
      }

      // Resolve geometry (DEF inline or USE reference)
      const geoUse = /\bgeometry\s+USE\s+(\S+)/.exec(sb);
      const geoDef = /\bgeometry\s+DEF\s+(\S+)\s+IndexedFaceSet/.exec(sb);

      let localPositions, localNormals, indices;

      if (geoUse && geomDefs[geoUse[1]]) {
        // USE: retrieve stored geometry
        ({ localPositions, localNormals, indices } = geomDefs[geoUse[1]]);
      } else if (geoDef && geomDefs[geoDef[1]]) {
        // DEF inline — already stored in collectDefs pass
        ({ localPositions, localNormals, indices } = geomDefs[geoDef[1]]);
      } else {
        // Inline geometry without DEF name
        const ifsMatch = /\bIndexedFaceSet\s*\{/.exec(sb);
        if (!ifsMatch) continue;
        const ifsBlk = extractBlock(sb, ifsMatch.index + ifsMatch[0].length - 1);
        if (!ifsBlk) continue;
        const ifs = ifsBlk.content;

        const coordMatch = /Coordinate\s*\{[^]*?point\s*\[([^\]]*)\]/.exec(ifs);
        if (!coordMatch) continue;
        const rawPts = coordMatch[1].trim().split(/,\s*/).filter(Boolean);
        localPositions = new Float32Array(rawPts.length * 3);
        for (let i = 0; i < rawPts.length; i++) {
          const parts = rawPts[i].trim().split(/\s+/);
          localPositions[i*3]   = parseFloat(parts[0]||"0");
          localPositions[i*3+1] = parseFloat(parts[1]||"0");
          localPositions[i*3+2] = parseFloat(parts[2]||"0");
        }

        const idxMatch = /coordIndex\s*\[([^\]]*)\]/.exec(ifs);
        if (!idxMatch) continue;
        const rawIdx = idxMatch[1].trim().split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
        const tris = [];
        let face = [];
        for (const idx of rawIdx) {
          if (idx === -1) {
            for (let i = 1; i+1 < face.length; i++) tris.push(face[0], face[i], face[i+1]);
            face = [];
          } else face.push(idx);
        }
        if (tris.length === 0) continue;
        indices = new Uint32Array(tris);
        localNormals = null;
        const normMatch = /Normal\s*\{[^]*?vector\s*\[([^\]]*)\]/.exec(ifs);
        if (normMatch) {
          const rawNorm = normMatch[1].trim().split(/,\s*/).filter(Boolean);
          localNormals = new Float32Array(rawNorm.length * 3);
          for (let i = 0; i < rawNorm.length; i++) {
            const parts = rawNorm[i].trim().split(/\s+/);
            localNormals[i*3]   = parseFloat(parts[0]||"0");
            localNormals[i*3+1] = parseFloat(parts[1]||"0");
            localNormals[i*3+2] = parseFloat(parts[2]||"0");
          }
        }
      }

      if (!localPositions || localPositions.length === 0 || !indices || indices.length === 0) continue;

      // Apply transform matrix to positions and normals
      const positions = applyMatrix(matrix, localPositions, true);
      const normals = localNormals ? applyMatrix(matrix, localNormals, false) : null;

      shapes.push({ color, positions, normals, indices });
    }
  }

  return shapes;
}

// ─── GLB builder — merge geometry by color ────────────────────────────────────
// Instead of one mesh node per shape (thousands of draw calls), we merge all
// shapes sharing the same color into a single merged mesh. Result: N_colors
// draw calls instead of N_shapes draw calls — much faster to render and load.

async function convertWrlToGlb(inputPath, outputPath) {
  console.log(`\nConverting: ${inputPath}`);
  const text = readFileSync(inputPath, "utf8");

  const shapes = parseVRML(text);
  console.log(`  Total shapes: ${shapes.length}`);
  if (shapes.length === 0) { console.error("  ERROR: no shapes"); return; }

  // Group shapes by color key
  const groups = new Map(); // key → { color, posArrays, normArrays, idxArrays, vertexCount }
  for (const { color, positions, normals, indices } of shapes) {
    const [r, g, b] = color;
    const key = `${r.toFixed(3)},${g.toFixed(3)},${b.toFixed(3)}`;
    if (!groups.has(key)) groups.set(key, { color, posArrays: [], normArrays: [], idxArrays: [], vertexCount: 0 });
    const grp = groups.get(key);
    // Offset indices by the current accumulated vertex count
    const offset = grp.vertexCount;
    const shifted = new Uint32Array(indices.length);
    for (let i = 0; i < indices.length; i++) shifted[i] = indices[i] + offset;
    grp.posArrays.push(positions);
    grp.normArrays.push(normals);
    grp.idxArrays.push(shifted);
    grp.vertexCount += positions.length / 3;
  }

  // Concatenate arrays per group
  function concat(arrays) {
    const total = arrays.reduce((s, a) => s + (a ? a.length : 0), 0);
    const out = new Float32Array(total);
    let off = 0;
    for (const a of arrays) { if (a) { out.set(a, off); off += a.length; } }
    return out;
  }
  function concatU32(arrays) {
    const total = arrays.reduce((s, a) => s + a.length, 0);
    const out = new Uint32Array(total);
    let off = 0;
    for (const a of arrays) { out.set(a, off); off += a.length; }
    return out;
  }

  const doc   = new Document();
  const buf   = doc.createBuffer();
  const scene = doc.createScene();
  const rootNode = doc.createNode("root");
  scene.addChild(rootNode);

  let meshIdx = 0;
  for (const [key, { color, posArrays, normArrays, idxArrays, vertexCount }] of groups) {
    const [r, g, b] = color;
    const lum = r * 0.299 + g * 0.587 + b * 0.114;
    const metalness = lum > 0.6 ? 0.7 : 0.02;
    const roughness  = lum > 0.6 ? 0.3 : lum < 0.15 ? 0.9 : 0.65;

    const mat = doc.createMaterial(`mat_${meshIdx}`)
      .setBaseColorFactor([r, g, b, 1])
      .setMetallicFactor(metalness)
      .setRoughnessFactor(roughness)
      .setDoubleSided(true);

    const mergedPos = concat(posArrays);
    const mergedIdx = concatU32(idxArrays);

    const posAcc = doc.createAccessor().setBuffer(buf).setType("VEC3").setArray(mergedPos);
    const idxAcc = doc.createAccessor().setBuffer(buf).setType("SCALAR").setArray(mergedIdx);

    const prim = doc.createPrimitive()
      .setAttribute("POSITION", posAcc)
      .setIndices(idxAcc)
      .setMaterial(mat)
      .setMode(Primitive.Mode.TRIANGLES);

    // Merge normals only if ALL shapes in this group have normals
    const hasAllNormals = normArrays.every(n => n !== null);
    if (hasAllNormals) {
      prim.setAttribute("NORMAL",
        doc.createAccessor().setBuffer(buf).setType("VEC3").setArray(concat(normArrays)));
    }

    rootNode.addChild(
      doc.createNode(`n${meshIdx}`).setMesh(
        doc.createMesh(`m${meshIdx}`).addPrimitive(prim)
      )
    );
    meshIdx++;
  }

  const io  = new NodeIO();
  const glb = await io.writeBinary(doc);
  writeFileSync(outputPath, glb);
  console.log(`  Written: ${outputPath} (${(glb.length/1024).toFixed(0)} KB, ${groups.size} merged meshes from ${shapes.length} shapes)`);
}

// ─── Run ─────────────────────────────────────────────────────────────────────

const models = [
  { input: resolve(root, "public/models/Motor_driver.wrl"),  output: resolve(root, "public/models/motor-driver.glb") },
  { input: resolve(root, "public/models/motherboard.wrl"),   output: resolve(root, "public/models/motherboard.glb")  },
  { input: resolve(root, "public/models/PCB_Rev1.wrl"),      output: resolve(root, "public/models/haptic-knob.glb")  },
];

(async () => {
  for (const { input, output } of models) await convertWrlToGlb(input, output);
  console.log("\nAll done.");
})().catch(err => { console.error(err); process.exit(1); });
