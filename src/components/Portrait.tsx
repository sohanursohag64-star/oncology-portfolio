"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect } from "react";
import { doctor } from "@/lib/content";

/** Illustrated stand-in until a real portrait is added (set doctor.portrait). */
function PortraitPlaceholder() {
  return (
    <svg viewBox="0 0 400 500" className="h-full w-full" role="img" aria-label="ডাক্তারের ছবির স্থান">
      <defs>
        <linearGradient id="pp-coat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e3f1f7" />
        </linearGradient>
        <linearGradient id="pp-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9e6f2" />
          <stop offset="100%" stopColor="#a9d6e8" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="168" rx="70" ry="84" fill="url(#pp-skin)" />
      <rect x="172" y="236" width="56" height="44" rx="20" fill="#a9d6e8" />
      <path d="M40 500c0-120 60-200 160-214 100 14 160 94 160 214z" fill="url(#pp-coat)" />
      <path d="M170 288l30 92 30-92c-10-4-20-6-30-6s-20 2-30 6z" fill="#183B52" opacity="0.85" />
      <path d="M150 292l50 150-80-120zM250 292l-50 150 80-120z" fill="#f4fafd" stroke="#d6e9f2" />
      <path d="M140 310c-16 60-6 110 34 130" fill="none" stroke="#2788B9" strokeWidth="6" strokeLinecap="round" />
      <circle cx="176" cy="442" r="11" fill="#2788B9" />
      <rect x="258" y="360" width="56" height="10" rx="5" fill="#70C9E8" opacity="0.7" />
    </svg>
  );
}

/**
 * Layered portrait: pastel organic backdrop → arch-framed portrait → soft
 * foreground ring. Each layer follows the pointer by a different amount for
 * subtle depth (springs keep it calm; disabled automatically for reduced motion
 * via MotionConfig).
 */
export function Portrait({ scrollY }: { scrollY: MotionValue<number> }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const onMove = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py]);

  const backX = useTransform(sx, (v) => v * -18);
  const backY = useTransform(sy, (v) => v * -14);
  const midX = useTransform(sx, (v) => v * 8);
  const midY = useTransform(sy, (v) => v * 6);
  const frontX = useTransform(sx, (v) => v * 22);
  const frontY = useTransform(sy, (v) => v * 16);
  const scrollBack = useTransform(scrollY, [0, 600], [0, 60]);
  const scrollMid = useTransform(scrollY, [0, 600], [0, -30]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="relative aspect-[4/5] w-full">
      {/* back layer: organic pastel shape */}
      <motion.div style={{ x: backX, y: backY, translateY: scrollBack }} className="absolute -inset-[8%]">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease }}
          className="h-full w-full rounded-[46%_54%_42%_58%/55%_45%_55%_45%] bg-gradient-to-br from-secondary via-[#c6eaf8] to-accent/60"
        />
      </motion.div>

      {/* mid layer: arch-framed portrait */}
      <motion.div style={{ x: midX, y: midY, translateY: scrollMid }} className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, y: 60, clipPath: "inset(100% 0% 0% 0% round 999px 999px 40px 40px)" }}
          animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 999px 999px 40px 40px)" }}
          transition={{ duration: 1.3, delay: 0.25, ease }}
          className="relative h-full w-full overflow-hidden rounded-t-[999px] rounded-b-[40px] border-[6px] border-white bg-gradient-to-b from-[#eaf7fc] to-[#d3eef9] shadow-float"
        >
          {doctor.portrait ? (
            <Image src={doctor.portrait} alt={doctor.name} fill priority sizes="(min-width: 1024px) 420px, 80vw" className="object-cover object-top" />
          ) : (
            <>
              <PortraitPlaceholder />
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/85 px-3 py-1 text-xs text-ink-soft">
                [ডাক্তারের ছবি]
              </span>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* front layer: thin orbit ring */}
      <motion.div style={{ x: frontX, y: frontY }} className="pointer-events-none absolute -inset-[4%]">
        <motion.svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          initial={{ opacity: 0, rotate: -20 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 1.6, delay: 0.5, ease }}
        >
          <ellipse cx="50" cy="52" rx="49" ry="46" fill="none" stroke="#70C9E8" strokeWidth="0.35" strokeDasharray="0.6 2.2" />
          <circle cx="94" cy="34" r="1.6" fill="#2788B9" />
          <circle cx="6" cy="68" r="1.1" fill="#70C9E8" />
        </motion.svg>
      </motion.div>
    </div>
  );
}
