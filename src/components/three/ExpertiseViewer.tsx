"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import type { ModelKind } from "@/lib/content";
import { seeded } from "@/lib/random";
import type { SceneProps } from "./LazyScene";
import { SceneCanvas } from "./SceneCanvas";

const UP = new THREE.Vector3(0, 1, 0);

/** Place a unit-height cylinder between two points. */
function Stick({ a, b, r = 0.06, color = "#e9f6fb" }: { a: THREE.Vector3; b: THREE.Vector3; r?: number; color?: string }) {
  const { pos, quat, len } = useMemo(() => {
    const dir = b.clone().sub(a);
    return {
      pos: a.clone().add(b).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize()),
      len: dir.length(),
    };
  }, [a, b]);
  return (
    <mesh position={pos} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, 12]} />
      <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.6} />
    </mesh>
  );
}

function Glossy({ color, ...rest }: { color: string } & Partial<THREE.MeshPhysicalMaterialParameters>) {
  return <meshPhysicalMaterial color={color} roughness={0.2} clearcoat={1} clearcoatRoughness={0.15} {...rest} />;
}

/* ---------------- DNA: right-handed B-form double helix ---------------- */

function Dna({ low }: { low: boolean }) {
  // ~10.5 base pairs per turn; strands offset by ~150° so major/minor grooves read.
  const bp = low ? 20 : 26;
  const rise = 0.27;
  const radius = 0.9;
  const perTurn = 10.5;
  const groove = (150 * Math.PI) / 180;
  const data = useMemo(() => {
    const rand = seeded(3);
    return Array.from({ length: bp }, (_, i) => {
      const t = (i / perTurn) * Math.PI * 2;
      const y = (i - (bp - 1) / 2) * rise;
      // right-handed helix about Y: (r·sin t, c·t, r·cos t)
      const s1 = new THREE.Vector3(radius * Math.sin(t), y, radius * Math.cos(t));
      const s2 = new THREE.Vector3(radius * Math.sin(t + groove), y, radius * Math.cos(t + groove));
      const gc = rand() > 0.5; // G–C vs A–T pair (purely decorative colouring)
      const flip = rand() > 0.5;
      return { s1, s2, mid: s1.clone().lerp(s2, 0.5), colors: (flip ? [0, 1] : [1, 0]).map((k) => (gc ? ["#2788B9", "#BFE6F5"] : ["#70C9E8", "#ffffff"])[k]) };
    });
  }, [bp]);

  return (
    <group scale={0.68}>
      {data.map((d, i) => (
        <group key={i}>
          <mesh position={d.s1}>
            <sphereGeometry args={[0.15, 20, 16]} />
            <Glossy color="#2788B9" />
          </mesh>
          <mesh position={d.s2}>
            <sphereGeometry args={[0.15, 20, 16]} />
            <Glossy color="#70C9E8" />
          </mesh>
          <Stick a={d.s1} b={d.mid} r={0.055} color={d.colors[0]} />
          <Stick a={d.mid} b={d.s2} r={0.055} color={d.colors[1]} />
          {i > 0 && <Stick a={data[i - 1].s1} b={d.s1} r={0.045} color="#dbeef6" />}
          {i > 0 && <Stick a={data[i - 1].s2} b={d.s2} r={0.045} color="#dbeef6" />}
        </group>
      ))}
    </group>
  );
}

/* ---------------- Small molecule (generic ball-and-stick) ---------------- */

function Molecule() {
  const { atoms, bonds } = useMemo(() => {
    const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
    const ring = Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      return v(Math.cos(a) * 0.95, Math.sin(a) * 0.95);
    });
    const C = "#4d6b80", H = "#ffffff", O = "#70C9E8", N = "#2788B9";
    const list: { p: THREE.Vector3; c: string; r: number }[] = ring.map((p) => ({ p, c: C, r: 0.26 }));
    const b: { a: number; b: number; double?: boolean }[] = ring.map((_, i) => ({ a: i, b: (i + 1) % 6, double: i % 2 === 0 }));
    const add = (p: THREE.Vector3, c: string, r: number, from: number, double = false) => {
      list.push({ p, c, r });
      b.push({ a: from, b: list.length - 1, double });
      return list.length - 1;
    };
    const out = (i: number, d: number) => ring[i].clone().multiplyScalar(1 + d / 0.95);
    // substituents
    const n = add(out(1, 1.0), N, 0.25, 1);
    const c2 = add(v(ring[1].x - 0.2, ring[1].y + 1.9, 0.35), C, 0.26, n);
    add(v(ring[1].x - 1.1, ring[1].y + 2.35, 0.5), O, 0.25, c2, true);
    const c3 = add(v(ring[1].x + 0.7, ring[1].y + 2.6, 0.2), C, 0.26, c2);
    add(v(ring[1].x + 1.5, ring[1].y + 2.2, -0.2), H, 0.15, c3);
    add(v(ring[1].x + 0.8, ring[1].y + 3.45, 0.5), H, 0.15, c3);
    const o = add(out(4, 1.0), O, 0.25, 4);
    add(v(ring[4].x - 0.25, ring[4].y - 1.85, -0.3), H, 0.15, o);
    add(out(1, 0.6).add(v(0.6, -0.2, -0.3)), H, 0.15, n);
    [0, 2, 3, 5].forEach((i) => add(out(i, 0.75), H, 0.15, i));
    return { atoms: list, bonds: b };
  }, []);

  return (
    <group position={[0, -0.45, 0]} scale={0.6} rotation={[0.35, -0.5, 0]}>
      {atoms.map((a, i) => (
        <mesh key={i} position={a.p}>
          <sphereGeometry args={[a.r, 28, 20]} />
          <Glossy color={a.c} />
        </mesh>
      ))}
      {bonds.map((bd, i) => {
        const A = atoms[bd.a].p, B = atoms[bd.b].p;
        if (!bd.double) return <Stick key={i} a={A} b={B} r={0.07} />;
        const off = new THREE.Vector3().crossVectors(B.clone().sub(A), new THREE.Vector3(0, 0, 1)).normalize().multiplyScalar(0.07);
        return (
          <group key={i}>
            <Stick a={A.clone().add(off)} b={B.clone().add(off)} r={0.045} />
            <Stick a={A.clone().sub(off)} b={B.clone().sub(off)} r={0.045} />
          </group>
        );
      })}
    </group>
  );
}

/* ---------------- Antibody (IgG): 12 Ig domains in a Y ---------------- */

function Domain({ p, c, rot = 0 }: { p: [number, number, number]; c: string; rot?: number }) {
  return (
    <mesh position={p} rotation={[0, 0, rot]} scale={[0.27, 0.38, 0.27]}>
      <sphereGeometry args={[1, 32, 24]} />
      <Glossy color={c} />
    </mesh>
  );
}

function Antibody() {
  const heavyC = "#2788B9", heavyV = "#4AA6D3", lightC = "#70C9E8", lightV = "#A9DFF2";
  const arm = (side: 1 | -1) => {
    // Fab arm leaning ~50° from the Fc axis; heavy chain (VH, CH1) on the inner lane,
    // light chain (VL, CL) paired alongside on the outer lane.
    const a = 0.87;
    const d = new THREE.Vector2(side * Math.sin(a), Math.cos(a));
    const out = new THREE.Vector2(side * Math.cos(a), -Math.sin(a));
    const at = (k: number, lane: number): [number, number, number] => [
      side * 0.3 + d.x * k + out.x * lane,
      0.6 + d.y * k + out.y * lane,
      0,
    ];
    const rot = -side * a;
    return (
      <group key={side}>
        <Domain p={at(0.42, -0.14)} c={heavyC} rot={rot} />
        <Domain p={at(1.2, -0.14)} c={heavyV} rot={rot} />
        <Domain p={at(0.42, 0.42)} c={lightC} rot={rot} />
        <Domain p={at(1.2, 0.42)} c={lightV} rot={rot} />
      </group>
    );
  };
  return (
    <group position={[0, -0.15, 0]} scale={0.95}>
      {/* Fc: CH2 + CH3 of both heavy chains */}
      <Domain p={[-0.29, -0.25, 0]} c={heavyC} />
      <Domain p={[0.29, -0.25, 0]} c={heavyC} />
      <Domain p={[-0.29, -1.05, 0]} c={heavyC} />
      <Domain p={[0.29, -1.05, 0]} c={heavyC} />
      {/* hinge with disulfide links */}
      <Stick a={new THREE.Vector3(-0.22, 0.1, 0)} b={new THREE.Vector3(-0.32, 0.62, 0)} r={0.05} color="#BFE6F5" />
      <Stick a={new THREE.Vector3(0.22, 0.1, 0)} b={new THREE.Vector3(0.32, 0.62, 0)} r={0.05} color="#BFE6F5" />
      <Stick a={new THREE.Vector3(-0.25, 0.3, 0)} b={new THREE.Vector3(0.25, 0.3, 0)} r={0.03} color="#ffffff" />
      <Stick a={new THREE.Vector3(-0.27, 0.42, 0)} b={new THREE.Vector3(0.27, 0.42, 0)} r={0.03} color="#ffffff" />
      {arm(-1)}
      {arm(1)}
    </group>
  );
}

/* ---------------- Cell cross-section ---------------- */

function Cell({ low }: { low: boolean }) {
  // remove a wedge facing the camera to reveal the interior
  const phiStart = (3 * Math.PI) / 4;
  const phiLen = Math.PI * 1.5;
  const seg = low ? 40 : 72;
  const organelles = useMemo(() => {
    const rand = seeded(11);
    const out: { p: THREE.Vector3; r: THREE.Euler; kind: "mito" | "ves" }[] = [];
    while (out.length < (low ? 14 : 26)) {
      const p = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).multiplyScalar(1.45);
      const l = p.length();
      if (l < 0.95 || l > 1.4) continue;
      out.push({ p, r: new THREE.Euler(rand() * 3, rand() * 3, rand() * 3), kind: rand() > 0.55 ? "mito" : "ves" });
    }
    return out;
  }, [low]);

  return (
    <group rotation={[0.35, -0.25, 0]}>
      {/* plasma membrane: outer surface + inner (cytoplasm) face */}
      <mesh>
        <sphereGeometry args={[1.75, seg, seg / 2, phiStart, phiLen]} />
        <Glossy color="#bfe8f7" side={THREE.FrontSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.62, seg, seg / 2, phiStart, phiLen]} />
        <meshStandardMaterial color="#eaf7fc" roughness={0.7} side={THREE.BackSide} />
      </mesh>
      {/* nucleus with its own cutaway, nucleolus inside */}
      <mesh>
        <sphereGeometry args={[0.72, seg, seg / 2, phiStart, phiLen]} />
        <Glossy color="#2788B9" side={THREE.FrontSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.66, seg, seg / 2, phiStart, phiLen]} />
        <meshStandardMaterial color="#9fd6ec" roughness={0.6} side={THREE.BackSide} />
      </mesh>
      <mesh position={[0.08, 0.05, 0.12]}>
        <sphereGeometry args={[0.3, 32, 24]} />
        <Glossy color="#1d6d96" />
      </mesh>
      {organelles.map((o, i) =>
        o.kind === "mito" ? (
          <mesh key={i} position={o.p} rotation={o.r}>
            <capsuleGeometry args={[0.07, 0.22, 6, 12]} />
            <Glossy color="#70C9E8" />
          </mesh>
        ) : (
          <mesh key={i} position={o.p}>
            <sphereGeometry args={[0.07, 14, 10]} />
            <Glossy color="#ffffff" />
          </mesh>
        ),
      )}
    </group>
  );
}

/* ---------------- stage ---------------- */

function Stage({ model, animated, low }: { model: ModelKind; animated: boolean; low: boolean }) {
  const spin = useRef<THREE.Group>(null);
  const grow = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    if (grow.current) grow.current.scale.setScalar(animated ? 0.72 : 1);
    if (spin.current) spin.current.rotation.y = 0;
    invalidate();
  }, [model, animated, invalidate]);

  useFrame((state, delta) => {
    if (!animated) return;
    const d = Math.min(delta, 0.05);
    if (spin.current) {
      // the cell keeps its cutaway toward the viewer; everything else turns slowly
      if (model === "cell") spin.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.45;
      else spin.current.rotation.y += d * 0.22;
    }
    if (grow.current) {
      const s = grow.current.scale.x;
      grow.current.scale.setScalar(s + (1 - s) * d * 4);
    }
  });

  const content =
    model === "dna" ? <Dna low={low} /> : model === "cell" ? <Cell low={low} /> : model === "antibody" ? <Antibody /> : <Molecule />;

  return (
    <PresentationControls
      enabled={animated}
      global={false}
      cursor
      snap
      speed={1.4}
      polar={[-0.4, 0.4]}
      azimuth={[-0.8, 0.8]}
    >
      <group ref={grow} rotation={[0, 0, model === "dna" ? 0.32 : 0]}>
        <group ref={spin}>{content}</group>
      </group>
    </PresentationControls>
  );
}

export default function ExpertiseViewerScene({ active, motion, tier, onReady, model }: SceneProps & { model: ModelKind }) {
  return (
    <SceneCanvas active={active} animated={motion} tier={tier} onReady={onReady} camera={{ position: [0, 0, 8.5], fov: 36 }}>
      <Stage model={model} animated={motion} low={tier === "low"} />
    </SceneCanvas>
  );
}
