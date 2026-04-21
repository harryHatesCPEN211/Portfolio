"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface PCBModelProps {
  modelPath: string;
  autoRotate?: boolean;
}

export function PCBModel({ modelPath, autoRotate = true }: PCBModelProps) {
  const spinRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(modelPath);
  const { camera } = useThree();

  const { cloned, boundingSphere } = useMemo(() => {
    const clone = scene.clone(true);

    // ── 1. Centre at origin ───────────────────────────────────────────────
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);

    // Compute bounding sphere so we can position the camera correctly
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    sphere.center.set(0, 0, 0); // center is now at origin after the sub above

    // ── 2. Upgrade materials to MeshStandardMaterial ──────────────────────
    // VRML-derived GLBs come in with MeshPhongMaterial (no PBR). Promote each
    // mesh to MeshStandardMaterial while preserving its original diffuse color.
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      const upgrade = (mat: THREE.Material): THREE.MeshStandardMaterial => {
        if (mat instanceof THREE.MeshStandardMaterial) return mat;

        const color = (mat as THREE.MeshPhongMaterial).color?.clone()
          ?? new THREE.Color(0x888888);

        // Heuristic PBR values based on apparent color brightness
        const lum = color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
        const metalness = lum > 0.55 ? 0.8 : 0.05;
        const roughness  = lum > 0.55 ? 0.25 : lum < 0.15 ? 0.85 : 0.6;

        return new THREE.MeshStandardMaterial({
          color,
          metalness,
          roughness,
          side: THREE.DoubleSide,
        });
      };

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map(upgrade);
      } else {
        mesh.material = upgrade(mesh.material);
      }
    });

    return { cloned: clone, boundingSphere: sphere };
  }, [scene]);

  // ── 3. Fit camera to bounding sphere ─────────────────────────────────
  // Run once after the model loads. Positions the perspective camera so the
  // whole model fills ~70% of the viewport regardless of model scale.
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (!cam.isPerspectiveCamera) return;

    const r = boundingSphere.radius;
    const fovRad = (cam.fov * Math.PI) / 180;
    // Distance to fit radius in viewport at 80% fill
    const dist = (r / Math.tan(fovRad / 2)) * 1.25;

    // Lift camera slightly above center so we see the tilted board face
    cam.position.set(0, r * 0.4, dist);
    cam.near = dist * 0.005;
    cam.far  = dist * 10;
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }, [boundingSphere, camera]);

  // ── 4. Auto-rotation ──────────────────────────────────────────────────
  // Spin on the outer group (world Y). The inner group pre-tilts the board
  // ~50° toward the viewer so the face is visible, not just the edge.
  useFrame((_, delta) => {
    if (autoRotate && spinRef.current) {
      spinRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={spinRef}>
      {/* Tilt ~50° toward viewer so we see the board face, not the edge */}
      <group rotation={[-Math.PI * 0.28, 0, 0]}>
        <primitive object={cloned} />
      </group>
    </group>
  );
}

export function preloadModel(path: string) {
  useGLTF.preload(path);
}
