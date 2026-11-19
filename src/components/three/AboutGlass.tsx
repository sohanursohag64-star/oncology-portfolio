"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { SceneProps } from "./LazyScene";
import { SceneCanvas } from "./SceneCanvas";

/**
 * Soft glass forms drifting behind the About copy. On "low" tier the costly
 * transmission pass is swapped for a translucent clearcoat material.
 */
function GlassMaterial({ low, tint }: { low: boolean; tint: string }) {
  return low ? (
    <meshPhysicalMaterial color={tint} roughness={0.12} clearcoat={1} transparent opacity={0.72} envMapIntensity={1.2} />
  ) : (
    <meshPhysicalMaterial
      color={tint}
      transmission={1}
      thickness={0.9}
      roughness={0.08}
      ior={1.35}
      clearcoat={1}
      attenuationColor="#70C9E8"
      attenuationDistance={2.5}
      envMapIntensity={1.3}
    />
  );
}

function Forms({ animated, low }: { animated: boolean; low: boolean }) {
  const group = useRef<THREE.Group>(null);
  const scroll = useRef(0);

  useEffect(() => {
    if (!animated) return;
    const onScroll = () => (scroll.current = window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [animated]);

  // A small scroll-linked turn — controlled, never more than a fraction of a revolution.
  useFrame((_, delta) => {
    if (!group.current) return;
    const target = (scroll.current % 4000) * 0.00025;
    group.current.rotation.y += (target - group.current.rotation.y) * Math.min(delta * 2, 1);
  });

  const speed = animated ? 1 : 0;
  return (
    <group ref={group}>
      <Float speed={speed * 1.1} rotationIntensity={0.5} floatIntensity={0.7}>
        <mesh position={[-1.6, 0.9, 0]} rotation={[0.6, 0.3, 0]}>
          <torusGeometry args={[0.85, 0.32, low ? 24 : 48, low ? 48 : 96]} />
          <GlassMaterial low={low} tint="#DFF4FC" />
        </mesh>
      </Float>
      <Float speed={speed * 0.8} rotationIntensity={0.6} floatIntensity={0.9}>
        <mesh position={[1.7, -0.6, -0.6]}>
          <icosahedronGeometry args={[0.9, low ? 2 : 5]} />
          <GlassMaterial low={low} tint="#ffffff" />
        </mesh>
      </Float>
      <Float speed={speed * 1.3} rotationIntensity={0.8} floatIntensity={0.6}>
        <mesh position={[0.4, 1.5, -1.2]} rotation={[0, 0, 0.9]}>
          <capsuleGeometry args={[0.28, 0.9, 8, low ? 16 : 32]} />
          <GlassMaterial low={low} tint="#70C9E8" />
        </mesh>
      </Float>
      <Float speed={speed * 0.9} rotationIntensity={0.4} floatIntensity={0.5}>
        <RoundedBox args={[0.9, 0.9, 0.9]} radius={0.25} smoothness={low ? 3 : 6} position={[-0.6, -1.4, 0.4]} rotation={[0.5, 0.7, 0]}>
          <GlassMaterial low={low} tint="#DFF4FC" />
        </RoundedBox>
      </Float>
    </group>
  );
}

export default function AboutGlassScene({ active, motion, tier, onReady }: SceneProps) {
  return (
    <SceneCanvas active={active} animated={motion} tier={tier} onReady={onReady} camera={{ position: [0, 0, 7], fov: 40 }}>
      <Forms animated={motion} low={tier === "low"} />
    </SceneCanvas>
  );
}
