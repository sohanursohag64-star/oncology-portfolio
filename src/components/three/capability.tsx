"use client";

import { Component, useEffect, useState, type ReactNode } from "react";

/**
 * Rendering tier for a device:
 *  - "high":   full WebGL scenes
 *  - "low":    WebGL with fewer particles, no transmission, capped DPR (phones, weak GPUs)
 *  - "static": no WebGL at all — SVG fallback (no WebGL, Save-Data, very weak device)
 */
export type Tier = "pending" | "high" | "low" | "static";

export function detectTier(): Exclude<Tier, "pending"> {
  try {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData) return "static";
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 2) return "static";
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "static";
    gl.getExtension("WEBGL_lose_context")?.loseContext();

    const cores = nav.hardwareConcurrency ?? 4;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 768;
    if (cores < 4) return "static";
    if (coarse || narrow || cores < 6 || (nav.deviceMemory ?? 8) < 4) return "low";
    return "high";
  } catch {
    return "static";
  }
}

let cached: Exclude<Tier, "pending"> | null = null;

export function useTier(): Tier {
  const [tier, setTier] = useState<Tier>("pending");
  useEffect(() => {
    cached ??= detectTier();
    setTier(cached);
  }, []);
  return tier;
}

/** True when the user asked the OS to reduce motion. Live-updates. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export class SceneErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
