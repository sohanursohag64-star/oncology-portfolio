"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { SceneErrorBoundary, usePrefersReducedMotion, useTier, type Tier } from "./capability";

export type SceneProps = {
  /** Whether the scene is on screen — off-screen scenes stop rendering entirely. */
  active: boolean;
  /** Animate (false when the user prefers reduced motion → one still frame). */
  motion: boolean;
  tier: Exclude<Tier, "pending" | "static">;
  /** Called once the first frame has rendered, so the static fallback can fade out. */
  onReady: () => void;
};

type Props<P> = {
  /** A dynamic() import of the Canvas component. Only fetched once the slot nears the viewport. */
  scene: ComponentType<SceneProps & P>;
  sceneProps?: P;
  fallback: ReactNode;
  className?: string;
  /** How early to start loading, as an IntersectionObserver rootMargin. */
  preload?: string;
};

/**
 * Reserves layout space (via className — always give it a fixed size or aspect
 * ratio so there is no layout shift), shows a static illustration, and swaps in
 * the WebGL scene only when (a) the device can handle it and (b) the slot is near
 * the viewport. Rendering pauses whenever the slot scrolls out of view.
 */
export function LazyScene<P extends object>({ scene: Scene, sceneProps, fallback, className, preload = "300px" }: Props<P>) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useTier();
  const reduced = usePrefersReducedMotion();
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nearObs = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: preload });
    const visObs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    nearObs.observe(el);
    visObs.observe(el);
    return () => {
      nearObs.disconnect();
      visObs.disconnect();
    };
  }, [preload]);

  const use3D = near && (tier === "high" || tier === "low");

  return (
    <div ref={ref} className={/\b(absolute|fixed)\b/.test(className ?? "") ? className : `relative ${className ?? ""}`} aria-hidden="true">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: use3D && ready ? 0 : 1 }}
      >
        {fallback}
      </div>
      {use3D && (
        <SceneErrorBoundary fallback={null}>
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: ready ? 1 : 0 }}
          >
            <Scene
              active={visible}
              motion={!reduced}
              tier={tier}
              onReady={() => setReady(true)}
              {...(sceneProps as P)}
            />
          </div>
        </SceneErrorBoundary>
      )}
    </div>
  );
}
