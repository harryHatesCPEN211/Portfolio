"use client";

import { Suspense, useRef, useState, Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PCBModel } from "./PCBModel";
import { ViewerOverlay } from "./ViewerOverlay";

// Catches errors thrown by GLTFLoader or PCBModel and shows a visible fallback
class ModelErrorBoundary extends Component<
  { children: ReactNode; modelPath: string },
  { error: string | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  render() {
    if (this.state.error) {
      console.error("[ModelViewer] Failed to load", this.props.modelPath, this.state.error);
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#1a3a2a" wireframe />
        </mesh>
      );
    }
    return this.props.children;
  }
}

interface ModelViewerProps {
  modelPath: string;
  className?: string;
}

export function ModelViewer({ modelPath, className }: ModelViewerProps) {
  const [userInteracting, setUserInteracting] = useState(false);
  const controlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null);

  return (
    <div
      className={`relative w-full h-full rounded-card overflow-hidden bg-[#0a0f0b] ${className ?? ""}`}
      style={{ minHeight: "inherit" }}
    >
      <Canvas
        dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
        // Camera starts back far enough; PCBModel repositions it after measuring the model
        camera={{ fov: 45, position: [0, 0, 10], near: 0.01, far: 1000 }}
        gl={{ antialias: true, alpha: false }}
        style={{ display: "block", width: "100%", height: "100%", touchAction: "none" }}
      >
        <color attach="background" args={["#0a0f0b"]} />

        {/* Soft fill — base visibility without washing out colors */}
        <ambientLight intensity={0.5} color="#ddeee5" />
        {/* Key light — front top, main illumination */}
        <directionalLight position={[2, 4, 3]}  intensity={1.2} color="#ffffff" />
        {/* Fill light — opposite side, soften shadows */}
        <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#c8e0d0" />
        {/* Rim light — back edge definition */}
        <directionalLight position={[0, -2, -4]} intensity={0.3} color="#ffffff" />

        <Suspense fallback={null}>
          <ModelErrorBoundary modelPath={modelPath}>
            <PCBModel
              modelPath={modelPath}
              autoRotate={!userInteracting}
            />
          </ModelErrorBoundary>
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
          rotateSpeed={0.8}
          onStart={() => setUserInteracting(true)}
          onEnd={() => {
            setTimeout(() => setUserInteracting(false), 2000);
          }}
        />
      </Canvas>

      <ViewerOverlay />
    </div>
  );
}
