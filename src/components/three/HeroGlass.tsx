"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { seeded } from "@/lib/random";
import type { SceneProps } from "./LazyScene";
import { SceneCanvas } from "./SceneCanvas";

/* ------------------------------------------------------------------ */
/* Sky backdrop: soft gradient, distant hazy hills, a horizon glow.     */
/* Rendered inside the scene so the glass refracts a real background.   */
/* ------------------------------------------------------------------ */

const skyVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const skyFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uHorizon;
  void main() {
    vec3 top = vec3(0.71, 0.86, 0.95);
    vec3 mid = vec3(0.93, 0.97, 0.99);
    vec3 hill = vec3(0.80, 0.90, 0.96);
    vec3 hill2 = vec3(0.86, 0.93, 0.97);
    vec3 water = vec3(0.84, 0.93, 0.97);
    float y = vUv.y;
    vec3 col = mix(mid, top, smoothstep(uHorizon, 1.0, y));
    float x = vUv.x;
    float h1 = uHorizon + 0.07 + 0.05 * sin(x * 5.0 + 0.6) + 0.025 * sin(x * 13.0 + 2.1) + 0.01 * sin(x * 31.0);
    float h2 = uHorizon + 0.035 + 0.03 * sin(x * 7.0 + 2.4) + 0.015 * sin(x * 19.0 + 0.3);
    col = mix(col, hill2, smoothstep(h1 + 0.006, h1 - 0.006, y) * 0.9);
    col = mix(col, hill, smoothstep(h2 + 0.005, h2 - 0.005, y) * 0.9);
    if (y < uHorizon) col = mix(water, mid, smoothstep(0.0, uHorizon, y) * 0.6);
    col += vec3(1.0) * 0.22 * exp(-distance(vUv * vec2(1.6, 1.0), vec2(1.0, uHorizon + 0.12)) * 5.0);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const SKY_Z = -8;

function Sky({ camZ }: { camZ: number }) {
  const { viewport } = useThree();
  const v = viewport.getCurrentViewport(undefined, new THREE.Vector3(0, 0, SKY_Z));
  const scale = 1.3;
  // put the backdrop's water line where the 3D water line projects on screen
  const yAtSky = WATER_Y * ((camZ - SKY_Z) / camZ);
  const horizon = 0.5 + yAtSky / (v.height * scale);
  const uniforms = useMemo(() => ({ uHorizon: { value: horizon } }), [horizon]);
  return (
    <mesh position={[0, 0, SKY_Z]} scale={[v.width * scale, v.height * scale, 1]}>
      <planeGeometry />
      <shaderMaterial vertexShader={skyVertex} fragmentShader={skyFragment} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}

/** Vertical veil in front of the reflection: transparent at the water line, denser below. */
const waterFragment = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vec3 col = vec3(0.86, 0.94, 0.98);
    float a = mix(0.92, 0.45, smoothstep(0.0, 1.0, vUv.y));
    gl_FragColor = vec4(col, a);
  }
`;

/* ------------------------------------------------------------------ */
/* Glass DNA: right-handed B-form proportions (pitch ≈ 1.7 × diameter,  */
/* ~10.5 base pairs per turn, strands ~150° apart for the grooves).     */
/* ------------------------------------------------------------------ */

class HelixCurve extends THREE.Curve<THREE.Vector3> {
  constructor(private turns: number, private height: number, private radius: number, private phase: number) {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const a = t * this.turns * Math.PI * 2 + this.phase;
    return target.set(this.radius * Math.sin(a), (t - 0.5) * this.height, this.radius * Math.cos(a));
  }
}

const TURNS = 2;
const RADIUS = 1;
const HEIGHT = TURNS * 3.4 * RADIUS; // pitch 3.4 for diameter 2
const GROOVE = (150 * Math.PI) / 180;
const UP = new THREE.Vector3(0, 1, 0);

function GlassMat({ low, tint = "#ffffff" }: { low: boolean; tint?: string }) {
  return low ? (
    <meshPhysicalMaterial color="#cfeaf7" roughness={0.08} clearcoat={1} iridescence={0.6} transparent opacity={0.88} envMapIntensity={1.4} />
  ) : (
    <meshPhysicalMaterial
      color={tint}
      transmission={1}
      thickness={0.7}
      roughness={0.04}
      ior={1.48}
      iridescence={1}
      iridescenceIOR={1.3}
      iridescenceThicknessRange={[120, 420]}
      clearcoat={1}
      clearcoatRoughness={0.05}
      attenuationColor="#5fb8e0"
      attenuationDistance={1.4}
      envMapIntensity={1.5}
    />
  );
}

function Helix({ low, reflection = false }: { low: boolean; reflection?: boolean }) {
  const rungs = useRef<THREE.InstancedMesh>(null);
  const { tube1, tube2, rungMatrices } = useMemo(() => {
    const c1 = new HelixCurve(TURNS, HEIGHT, RADIUS, 0);
    const c2 = new HelixCurve(TURNS, HEIGHT, RADIUS, GROOVE);
    const seg = low ? 160 : 320;
    const rad = low ? 10 : 20;
    const count = Math.round(TURNS * 10.5);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const mats: THREE.Matrix4[] = [];
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const a = c1.getPoint(t);
      const b = c2.getPoint(t);
      const dir = b.clone().sub(a);
      q.setFromUnitVectors(UP, dir.clone().normalize());
      // shorten a little so rungs meet the backbone surface rather than its centre
      m.compose(a.clone().add(b).multiplyScalar(0.5), q, new THREE.Vector3(1, dir.length() * 0.86, 1));
      mats.push(m.clone());
    }
    return {
      tube1: new THREE.TubeGeometry(c1, seg, 0.14, rad, false),
      tube2: new THREE.TubeGeometry(c2, seg, 0.14, rad, false),
      rungMatrices: mats,
    };
  }, [low]);

  useEffect(() => {
    rungMatrices.forEach((m, i) => rungs.current!.setMatrixAt(i, m));
    rungs.current!.instanceMatrix.needsUpdate = true;
  }, [rungMatrices]);

  useEffect(() => () => {
    tube1.dispose();
    tube2.dispose();
  }, [tube1, tube2]);

  const mat = reflection ? (
    <meshStandardMaterial color="#a9d8ee" transparent opacity={0.35} roughness={0.3} side={THREE.DoubleSide} depthWrite={false} />
  ) : null;

  return (
    <group>
      <mesh geometry={tube1}>{mat ?? <GlassMat low={low} />}</mesh>
      <mesh geometry={tube2}>{mat ?? <GlassMat low={low} tint="#eaf7fd" />}</mesh>
      <instancedMesh ref={rungs} args={[undefined, undefined, rungMatrices.length]}>
        <cylinderGeometry args={[0.055, 0.055, 1, low ? 8 : 14, 1]} />
        {mat ?? <GlassMat low={low} tint="#d6effa" />}
      </instancedMesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Small glossy molecule resting near the water (bottom-left accent).   */
/* ------------------------------------------------------------------ */

function MoleculeCluster({ low }: { low: boolean }) {
  const atoms = useMemo(() => {
    const r = seeded(5);
    const pts: { p: THREE.Vector3; s: number }[] = [{ p: new THREE.Vector3(), s: 0.42 }];
    while (pts.length < (low ? 7 : 11)) {
      const parent = pts[Math.floor(r() * pts.length)];
      const dir = new THREE.Vector3(r() - 0.5, (r() - 0.5) * 0.8, r() - 0.5).normalize();
      const p = parent.p.clone().addScaledVector(dir, 0.75 + r() * 0.15);
      if (pts.some((q) => q.p.distanceTo(p) < 0.6)) continue;
      pts.push({ p, s: 0.22 + r() * 0.16 });
    }
    return pts;
  }, [low]);
  return (
    <group>
      {atoms.map((a, i) => (
        <mesh key={i} position={a.p} scale={a.s}>
          <sphereGeometry args={[1, low ? 24 : 40, low ? 18 : 30]} />
          <meshPhysicalMaterial color={i % 3 ? "#4aa6d3" : "#2788B9"} roughness={0.12} clearcoat={1} clearcoatRoughness={0.08} iridescence={0.35} envMapIntensity={1.4} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Water: translucent sheet + expanding ripples under the helix.        */
/* ------------------------------------------------------------------ */

const WATER_Y = -2.15;

function Ripples({ x, animated }: { x: number; animated: boolean }) {
  const rings = useRef<THREE.Mesh[]>([]);
  useFrame((s) => {
    if (!animated) return;
    rings.current.forEach((m, i) => {
      if (!m) return;
      const k = (s.clock.elapsedTime * 0.22 + i / 3) % 1;
      m.scale.setScalar(0.6 + k * 3.2);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.35;
    });
  });
  return (
    <group position={[x, WATER_Y + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => void (rings.current[i] = m!)} scale={1 + i}>
          <ringGeometry args={[0.98, 1, 96]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.25} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */

function Scene({ animated, low }: { animated: boolean; low: boolean }) {
  const { size, camera } = useThree();
  const portrait = size.width / size.height < 0.9;
  const helix = useRef<THREE.Group>(null);
  const mirror = useRef<THREE.Group>(null);
  const cluster = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  // layout adapts to the panel's aspect ratio
  const L = portrait
    ? { hx: 0.9, hy: -1.6, hs: 0.5, mx: -2.3, camZ: 13 }
    : { hx: 1.0, hy: 0.55, hs: 0.6, mx: -6.2, camZ: 11 };
  const helixBottom = L.hy - (HEIGHT / 2) * L.hs;

  useEffect(() => {
    if (!animated) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [animated]);

  useEffect(() => {
    camera.position.set(0, 0.3, L.camZ);
    camera.lookAt(0, 0, 0);
  }, [camera, L.camZ]);

  useFrame((s, delta) => {
    if (!animated) return;
    const d = Math.min(delta, 0.05);
    const t = s.clock.elapsedTime;
    const spin = (helix.current?.rotation.y ?? 0) + d * 0.16;
    const bob = Math.sin(t * 0.6) * 0.08;
    if (helix.current) {
      helix.current.rotation.y = spin;
      helix.current.position.y = L.hy + bob;
    }
    if (mirror.current) {
      mirror.current.rotation.y = -spin;
      mirror.current.position.y = 2 * WATER_Y - (L.hy + bob);
    }
    if (cluster.current) {
      cluster.current.rotation.y += d * 0.12;
      cluster.current.position.y = WATER_Y + 0.55 + Math.sin(t * 0.8 + 1) * 0.06;
    }
    // gentle camera parallax toward the pointer
    camera.position.x += (pointer.current.x * 0.5 - camera.position.x) * d * 1.5;
    camera.position.y += (0.3 - pointer.current.y * 0.25 - camera.position.y) * d * 1.5;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <Sky camZ={L.camZ} />
      <group position={[L.hx, 0, 0]} rotation={[0, 0, -0.18]}>
        <group ref={helix} position={[0, L.hy, 0]} scale={L.hs}>
          <Helix low={low} />
        </group>
      </group>
      {/* mirrored copy beneath the water reads as a soft reflection */}
      <group position={[L.hx, 0, 0]} rotation={[0, 0, 0.18]}>
        <group ref={mirror} position={[0, 2 * WATER_Y - L.hy, 0]} scale={[L.hs, -L.hs, L.hs]}>
          <Helix low reflection />
        </group>
      </group>
      <mesh position={[0, WATER_Y - 4, 0.6]}>
        <planeGeometry args={[60, 8]} />
        <shaderMaterial vertexShader={skyVertex} fragmentShader={waterFragment} transparent depthWrite={false} />
      </mesh>
      <Ripples x={L.hx + Math.sin(-0.18) * (helixBottom - L.hy)} animated={animated} />
      <group ref={cluster} position={[L.mx, WATER_Y + 0.75, 1.2]} scale={portrait ? 0.38 : 0.62}>
        <MoleculeCluster low={low} />
      </group>
    </>
  );
}

export default function HeroGlassScene({ active, motion, tier, onReady }: SceneProps) {
  return (
    <SceneCanvas active={active} animated={motion} tier={tier} onReady={onReady} camera={{ position: [0, 0.3, 11], fov: 35 }}>
      <Scene animated={motion} low={tier === "low"} />
    </SceneCanvas>
  );
}
