"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { SceneProps } from "./LazyScene";

type Props = Omit<SceneProps, "motion"> & Omit<CanvasProps, "frameloop" | "dpr"> & { animated: boolean };

/**
 * Shared Canvas setup:
 *  - stops the render loop entirely while off screen (frameloop "never")
 *  - renders on demand only when motion is disabled
 *  - caps device pixel ratio per tier
 *  - a tiny procedural studio environment (no HDR download) for soft glassy reflections
 */
export function SceneCanvas({ active, animated, tier, onReady, children, ...rest }: Props) {
  return (
    <Canvas
      frameloop={!active ? "never" : animated ? "always" : "demand"}
      dpr={tier === "high" ? [1, 1.75] : [1, 1.25]}
      gl={{ antialias: tier === "high", alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 8], fov: 35 }}
      onCreated={() => requestAnimationFrame(onReady)}
      {...rest}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#70C9E8" />
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={2.2} position={[0, 4, 4]} scale={[8, 3, 1]} color="#ffffff" />
        <Lightformer intensity={1.2} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} color="#DFF4FC" />
        <Lightformer intensity={0.9} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} color="#70C9E8" />
      </Environment>
      {children}
    </Canvas>
  );
}
