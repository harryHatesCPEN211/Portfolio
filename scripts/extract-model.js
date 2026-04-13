/**
 * Extracts the base64-encoded PCB geometry from the original HTML file
 * and converts it to a valid GLB (binary GLTF) file.
 *
 * Usage:
 *   node scripts/extract-model.js
 *
 * Output:
 *   public/models/motor-driver-pcb.glb
 */

const fs = require("fs");
const path = require("path");

const HTML_PATH = path.join(__dirname, "../portfolio (1).html");
const OUT_PATH = path.join(__dirname, "../public/models/motor-driver-pcb.glb");

console.log("Reading HTML file...");
const html = fs.readFileSync(HTML_PATH, "utf8");

// Extract constants
const nvMatch = html.match(/const NV\s*=\s*(\d+)/);
const b64Match = html.match(/const B64\s*=\s*"([A-Za-z0-9+/=]+)"/);

if (!nvMatch || !b64Match) {
  console.error("Could not find NV or B64 constants in HTML. Check the file.");
  process.exit(1);
}

const NV = parseInt(nvMatch[1], 10);
const b64 = b64Match[1];

console.log(`Found NV=${NV} vertices, B64 length=${b64.length}`);

// Decode binary
const bin = Buffer.from(b64, "base64");
const ab = bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength);
const raw = new Float32Array(ab);

// Separate position and normal arrays
// Format: [x0,y0,z0, x1,y1,z1, ...] for NV vertices, then same for normals
const pos = new Float32Array(NV * 3);
const nor = new Float32Array(NV * 3);

for (let i = 0; i < NV * 3; i++) {
  pos[i] = raw[i];
  nor[i] = raw[NV * 3 + i];
}

console.log("Building GLB...");

// ── Build GLB ─────────────────────────────────────────────────────────────
// GLB = 12-byte header + JSON chunk + BIN chunk
// Each chunk: 4-byte length + 4-byte type + data (padded to 4-byte boundary)

const posBytes = Buffer.from(pos.buffer);
const norBytes = Buffer.from(nor.buffer);
const binBuffer = Buffer.concat([posBytes, norBytes]);

// Pad binary to 4-byte boundary
const binPad = (4 - (binBuffer.length % 4)) % 4;
const binChunkData = Buffer.concat([binBuffer, Buffer.alloc(binPad, 0x00)]);

// Compute bounding box for position accessor
let minX = Infinity, minY = Infinity, minZ = Infinity;
let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
for (let i = 0; i < NV; i++) {
  const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
  if (x < minX) minX = x; if (x > maxX) maxX = x;
  if (y < minY) minY = y; if (y > maxY) maxY = y;
  if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
}

const json = {
  asset: { version: "2.0", generator: "extract-model.js" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0 }],
  meshes: [{
    primitives: [{
      attributes: { POSITION: 0, NORMAL: 1 },
      mode: 4, // TRIANGLES
    }],
  }],
  accessors: [
    {
      bufferView: 0,
      componentType: 5126, // FLOAT
      count: NV,
      type: "VEC3",
      min: [minX, minY, minZ],
      max: [maxX, maxY, maxZ],
    },
    {
      bufferView: 1,
      componentType: 5126, // FLOAT
      count: NV,
      type: "VEC3",
    },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: NV * 3 * 4 },
    { buffer: 0, byteOffset: NV * 3 * 4, byteLength: NV * 3 * 4 },
  ],
  buffers: [{ byteLength: binBuffer.length }],
};

const jsonStr = JSON.stringify(json);
// Pad JSON to 4-byte boundary with spaces
const jsonPad = (4 - (jsonStr.length % 4)) % 4;
const jsonChunkData = Buffer.from(jsonStr + " ".repeat(jsonPad), "utf8");

// Chunk headers
const jsonChunkHeader = Buffer.alloc(8);
jsonChunkHeader.writeUInt32LE(jsonChunkData.length, 0);
jsonChunkHeader.writeUInt32LE(0x4E4F534A, 4); // "JSON"

const binChunkHeader = Buffer.alloc(8);
binChunkHeader.writeUInt32LE(binChunkData.length, 0);
binChunkHeader.writeUInt32LE(0x004E4942, 4); // "BIN\0"

// GLB header
const totalLength =
  12 +
  8 + jsonChunkData.length +
  8 + binChunkData.length;

const glbHeader = Buffer.alloc(12);
glbHeader.writeUInt32LE(0x46546C67, 0); // magic "glTF"
glbHeader.writeUInt32LE(2, 4);           // version
glbHeader.writeUInt32LE(totalLength, 8); // total length

const glb = Buffer.concat([
  glbHeader,
  jsonChunkHeader, jsonChunkData,
  binChunkHeader, binChunkData,
]);

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, glb);

const sizeMB = (glb.length / 1024 / 1024).toFixed(2);
console.log(`✓ Written to ${OUT_PATH} (${sizeMB} MB)`);
