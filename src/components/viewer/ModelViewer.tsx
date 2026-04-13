"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { PCBModel } from "./PCBModel";
import { ViewerSkeleton } from "./ViewerSkeleton";
import { ViewerOverlay } from "./ViewerOverlay";

interface ModelViewerProps {
  modelPath: string;
  className?: string;
}

export function ModelViewer({ modelPath, className }: ModelViewerProps) {
  const [userInteracting, setUserInteracting] = useState(false);
  const controlsRef = useRef(null);

  return (
    <div className={`relative w-full h-full min-h-[400px] rounded-card overflow-hidden bg-[#0a0f0b] ${className ?? ""}`}>
      <Canvas
        dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
        camera={{ position: [0, 20, 120], fov: 45, near: 0.1, far: 1600 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Lighting — matches original aesthetic */}
        <color attach="background" args={["#0a0f0b"]} />
        <ambientLight intensity={2.0} color="#1a2e1e" />
        <directionalLight position={[5, 10, 5]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[-3, 5, -3]} intensity={0.4} color="#aaddbb" />

        <Suspense fallback={null}>
          <PCBModel
            modelPath={modelPath}
            autoRotate={!userInteracting}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          enablePan
          minDistance={30}
          maxDistance={400}
          onStart={() => setUserInteracting(true)}
          onEnd={() => {
            // Resume auto-rotate after 2s of no interaction
            setTimeout(() => setUserInteracting(false), 2000);
          }}
        />
      </Canvas>

      <ViewerOverlay />

      {/* Fallback shown while Canvas hydrates */}
      <noscript>
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0f0b]">
          <p className="text-xs font-mono text-gray-500">3D viewer requires JavaScript</p>
        </div>
      </noscript>
    </div>
  );
}
