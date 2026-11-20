"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, CalendarDays, Sparkles } from "lucide-react";
import { doctor, hero } from "@/lib/content";
import { LazyScene } from "../three/LazyScene";
import { HeroGlassScene } from "../three/scenes";

const ease = [0.22, 1, 0.36, 1] as const;

/** CSS twin of the WebGL sky, shown before 3D loads and on static-tier devices. */
function SkyFallback() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#b5dbf2_0%,#d9effa_38%,#eef8fd_62%,#d6edf8_64%,#e3f3fb_100%)]">
      <svg className="absolute inset-x-0 top-[50%] h-[16%] w-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
        <path d="M0 70 C120 20 220 40 330 55 S560 10 700 45 S900 30 1000 50 V100 H0Z" fill="#dcedf7" />
        <path d="M0 85 C160 60 300 80 450 70 S760 55 1000 75 V100 H0Z" fill="#cfe6f4" />
      </svg>
      <svg className="absolute left-[50%] top-[10%] h-[62%] -translate-x-1/2 opacity-80" viewBox="0 0 200 400">
        {Array.from({ length: 21 }, (_, i) => {
          const y = 10 + i * 18;
          const t = (i / 10.5) * Math.PI * 2;
          return (
            <g key={i}>
              <line x1={100 + Math.sin(t) * 60} y1={y} x2={100 + Math.sin(t + 2.6) * 60} y2={y} stroke="#ffffff" strokeOpacity="0.7" strokeWidth="5" />
              <circle cx={100 + Math.sin(t) * 60} cy={y} r="9" fill="#ffffff" fillOpacity="0.75" stroke="#9fd3ec" />
              <circle cx={100 + Math.sin(t + 2.6) * 60} cy={y} r="9" fill="#e7f6fc" fillOpacity="0.75" stroke="#9fd3ec" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function Hero() {
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 800], [0, -60]);
  const portraitY = useTransform(scrollY, [0, 800], [0, 50]);

  // subtle pointer depth for the portrait (disabled on touch / reduced motion)
  const px = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 50, damping: 18 });
  const portraitX = useTransform(sx, (v) => v * 14);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const onMove = (e: PointerEvent) => px.set(e.clientX / window.innerWidth - 0.5);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px]);

  return (
    <section id="top" className="relative p-2 sm:p-3">
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col overflow-hidden rounded-[2rem] border border-white/80 shadow-float sm:rounded-[2.5rem] lg:block lg:h-[max(700px,min(100svh,980px))] lg:min-h-0">
        {/* 3D sky, glass helix, water */}
        <LazyScene scene={HeroGlassScene} fallback={<SkyFallback />} preload="0px" className="absolute inset-0" />
        {/* readability veil on the copy side */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(248_252_254/0.78)_0%,rgb(248_252_254/0.35)_34%,transparent_52%)] max-lg:bg-[linear-gradient(180deg,rgb(248_252_254/0.85)_0%,rgb(248_252_254/0.4)_40%,transparent_58%)]" />

        {/* portrait: cut-out, standing in the scene */}
        {doctor.portrait && (
          <motion.div
            style={{ x: portraitX, y: portraitY }}
            className="pointer-events-none relative order-2 mx-auto mt-6 w-[84%] max-w-[420px] lg:absolute lg:bottom-0 lg:right-[5%] lg:mx-0 lg:mt-0 lg:w-[34%] lg:max-w-[520px]"
          >
            <motion.div
              initial={{ opacity: 0, y: 80, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.5, delay: 0.35, ease }}
              className="relative aspect-[960/1243] [mask-composite:intersect] [mask-image:linear-gradient(to_left,transparent,black_16%),linear-gradient(to_top,transparent,black_20%)] [-webkit-mask-composite:source-in]"
            >
              <div className="absolute inset-x-[8%] bottom-0 top-[12%] rounded-t-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.75),transparent)] blur-2xl" />
              <Image
                src={doctor.portrait}
                alt={doctor.name}
                fill
                priority
                sizes="(min-width: 1024px) 34vw, 78vw"
                className="object-contain object-bottom drop-shadow-[0_30px_40px_rgba(24,59,82,0.18)]"
              />
            </motion.div>
          </motion.div>
        )}

        {/* copy */}
        <motion.div style={{ y: contentY }} className="relative z-10 order-1 flex flex-col px-6 pt-28 sm:px-12 lg:h-full lg:justify-center lg:px-16 lg:pt-10 xl:px-24">
          <div className="max-w-[640px]">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-en">{hero.eyebrow}</span>
            </motion.span>

            <h1 className="display-bn mt-6 text-[clamp(2.6rem,6.4vw,5.9rem)] text-ink">
              {hero.titleLines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.1em]">
                  <motion.span
                    className={`block ${i === 2 ? "bg-gradient-to-r from-primary via-[#3aa0d0] to-accent bg-clip-text text-transparent" : ""}`}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.12, ease }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.65, ease }}
              className="mt-5 max-w-[30rem] text-[16px] leading-[1.85] text-ink-soft md:text-[18px]"
            >
              {hero.lede}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-white shadow-soft transition hover:bg-primary-deep">
                <CalendarDays className="h-4.5 w-4.5" />
                {hero.primaryCta}
              </a>
              <a href="#approach" className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium text-ink transition hover:bg-white">
                {hero.secondaryCta}
                <ArrowDown className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* floating glass cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.1, ease }}
          className="glass absolute bottom-8 right-[calc(340px+4.5rem)] z-20 hidden w-[260px] rounded-3xl p-5 xl:block"
        >
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-accent to-primary text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <p className="mt-3 text-[16px] font-semibold text-ink">{hero.principle.title}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{hero.principle.text}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.25, ease }}
          className="glass absolute bottom-4 left-4 right-4 z-20 flex items-center gap-4 rounded-3xl px-5 py-4 sm:left-auto sm:right-6 sm:w-[340px] lg:bottom-8 lg:right-10"
        >
          <div className="min-w-0">
            <p className="truncate text-[17px] font-semibold text-ink">{doctor.name}</p>
            <p className="truncate text-[13px] text-ink-soft">
              <span className="font-en">{doctor.title}</span> · {doctor.degrees}
            </p>
          </div>
          <a href="#about" className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white" aria-label="পরিচিতি দেখুন">
            <ArrowDown className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
