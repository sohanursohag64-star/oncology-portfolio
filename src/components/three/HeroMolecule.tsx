"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { seeded } from "@/lib/random";
import type { SceneProps } from "./LazyScene";
import { SceneCanvas } from "./SceneCanvas";

/* ---------- geometry generation (deterministic) ---------- */

type Atom = { p: THREE.Vector3; r: number; c: string };

/** A branched ball-and-stick network: random walk with near-tetrahedral bond angles. */
function buildMolecule(count: number) {
  const rand = seeded(7);
  const atoms: Atom[] = [{ p: new THREE.Vector3(0, 0, 0), r: 0.34, c: "#2788B9" }];
  const bonds: [number, number][] = [];
  const palette = ["#2788B9", "#70C9E8", "#70C9E8", "#BFE6F5", "#ffffff"];
  while (atoms.length < count) {
    const parent = Math.floor(rand() * atoms.length);
    const dir = new THREE.Vector3(rand() - 0.5, rand() - 0.5, (rand() - 0.5) * 0.7).normalize();
    const pos = atoms[parent].p.clone().addScaledVector(dir, 0.95 + rand() * 0.25);
    if (atoms.some((a) => a.p.distanceTo(pos) < 0.72)) continue; // avoid overlaps
    if (pos.length() > 2.6) continue; // keep it compact
    const small = rand() > 0.62;
    atoms.push({ p: pos, r: small ? 0.17 : 0.26 + rand() * 0.06, c: small ? "#ffffff" : palette[Math.floor(rand() * palette.length)] });
    bonds.push([parent, atoms.length - 1]);
  }
  return { atoms, bonds };
}

/** Ambient particle shell plus thin "network" lines between near neighbours. */
function buildParticles(count: number) {
  const rand = seeded(21);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const u = rand() * 2 - 1;
    const t = rand() * Math.PI * 2;
    const rad = 3 + rand() * 2.4;
    const s = Math.sqrt(1 - u * u);
    pts.push(new THREE.Vector3(s * Math.cos(t) * rad * 1.25, u * rad * 0.9, s * Math.sin(t) * rad * 0.7));
  }
  const positions = new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z]));
  const line: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    let links = 0;
    for (let j = i + 1; j < pts.length && links < 2; j++) {
      if (pts[i].distanceTo(pts[j]) < 1.05) {
        line.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        links++;
      }
    }
  }
  return { positions, lines: new Float32Array(line) };
}

/* ---------- scene ---------- */

const up = new THREE.Vector3(0, 1, 0);

function Molecule({ animated, low }: { animated: boolean; low: boolean }) {
  const group = useRef<THREE.Group>(null);
  const atomsRef = useRef<THREE.InstancedMesh>(null);
  const bondsRef = useRef<THREE.InstancedMesh>(null);
  const { atoms, bonds } = useMemo(() => buildMolecule(low ? 18 : 26), [low]);
  const { positions, lines } = useMemo(() => buildParticles(low ? 70 : 220), [low]);
  const pointer = useRef({ x: 0, y: 0 });
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const color = new THREE.Color();
    atoms.forEach((a, i) => {
      m.compose(a.p, q.identity(), new THREE.Vector3(a.r, a.r, a.r));
      atomsRef.current!.setMatrixAt(i, m);
      atomsRef.current!.setColorAt(i, color.set(a.c));
    });
    bonds.forEach(([i, j], k) => {
      const a = atoms[i].p;
      const b = atoms[j].p;
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const dir = b.clone().sub(a);
      q.setFromUnitVectors(up, dir.clone().normalize());
      m.compose(mid, q, new THREE.Vector3(1, dir.length(), 1));
      bondsRef.current!.setMatrixAt(k, m);
    });
    atomsRef.current!.instanceMatrix.needsUpdate = true;
    if (atomsRef.current!.instanceColor) atomsRef.current!.instanceColor.needsUpdate = true;
    bondsRef.current!.instanceMatrix.needsUpdate = true;
    invalidate();
  }, [atoms, bonds, invalidate]);

  // Pointer tracked on window so the scene can sit behind content without blocking clicks.
  useEffect(() => {
    if (!animated) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [animated]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || !animated) return;
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 0.05);
    // slow organic rotation + gentle breathing, eased toward the pointer
    const targetX = Math.sin(t * 0.17) * 0.18 + pointer.current.y * 0.22;
    g.rotation.y += d * 0.09;
    g.rotation.x += (targetX - g.rotation.x) * d * 1.6;
    g.position.x += (pointer.current.x * 0.25 - g.position.x) * d * 1.2;
    g.position.y = Math.sin(t * 0.5) * 0.08;
  });

  return (
    <group position={[-0.7, 0.75, 0]} scale={0.98}>
    <group ref={group} rotation={[0.2, 0.4, 0]}>
      <instancedMesh ref={atomsRef} args={[undefined, undefined, atoms.length]}>
        <sphereGeometry args={[1, low ? 20 : 32, low ? 16 : 24]} />
        <meshPhysicalMaterial roughness={0.18} metalness={0.05} clearcoat={1} clearcoatRoughness={0.12} envMapIntensity={1.1} />
      </instancedMesh>
      <instancedMesh ref={bondsRef} args={[undefined, undefined, bonds.length]}>
        <cylinderGeometry args={[0.065, 0.065, 1, 10, 1]} />
        <meshPhysicalMaterial color="#e9f6fb" roughness={0.3} clearcoat={0.6} />
      </instancedMesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#2788B9" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#70C9E8" transparent opacity={0.28} depthWrite={false} />
      </lineSegments>
    </group>
    </group>
  );
}

export default function HeroMoleculeScene({ active, motion, tier, onReady }: SceneProps) {
  return (
    <SceneCanvas active={active} animated={motion} tier={tier} onReady={onReady} camera={{ position: [0, 0, 9.5], fov: 38 }}>
      <Molecule animated={motion} low={tier === "low"} />
    </SceneCanvas>
  );
}
