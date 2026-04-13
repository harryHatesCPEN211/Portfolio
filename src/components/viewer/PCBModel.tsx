"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface PCBModelProps {
  modelPath: string;
  autoRotate?: boolean;
}

export function PCBModel({ modelPath, autoRotate = true }: PCBModelProps) {
  const ref = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(modelPath);

  useFrame((_, delta) => {
    if (autoRotate && ref.current) {
      ref.current.rotation.y += delta * 0.3;
    }
  });

  return <primitive ref={ref} object={scene} />;
}

// Preload hint
export function preloadModel(path: string) {
  useGLTF.preload(path);
}
