"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight, CalendarDays } from "lucide-react";
import { doctor, hero } from "@/lib/content";
import { LazyScene } from "../three/LazyScene";
import { HeroMoleculeScene } from "../three/scenes";
import { MoleculeArt } from "../three/StaticArt";
import { Portrait } from "../Portrait";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 700], [0, -40]);
  const cardY = useTransform(scrollY, [0, 700], [0, -90]);
  const sceneY = useTransform(scrollY, [0, 700], [0, 50]);

  return (
    <section id="top" ref={ref} className="relative px-3 pt-20 md:px-8 md:pt-24">
      <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[var(--radius-panel)] border border-white bg-gradient-to-br from-white via-[#f2fbfe] to-secondary shadow-float">
        <div className="grain pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-accent/20 blur-3xl" />

        <div className="relative grid gap-6 px-6 pb-10 pt-12 sm:px-10 lg:grid-cols-12 lg:gap-0 lg:px-14 lg:pb-16 lg:pt-16">
          {/* ---- editorial copy ---- */}
          <motion.div style={{ y: textY }} className="relative z-20 lg:col-span-6 lg:pt-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="font-en text-sm font-medium uppercase tracking-[0.22em] text-primary"
            >
              {hero.eyebrow}
            </motion.p>

            <h1 className="display-bn mt-5 text-[clamp(2.5rem,6.2vw,5.4rem)] text-ink">
              {hero.titleLines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className={`block ${i === 2 ? "text-primary" : ""}`}
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease }}
              className="mt-6 max-w-[34rem] text-[17px] leading-[1.85] text-ink-soft md:text-lg"
            >
              {hero.lede}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.75, ease }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[15px] font-semibold text-white shadow-soft transition hover:bg-primary-deep"
              >
                <CalendarDays className="h-4.5 w-4.5" />
                {hero.primaryCta}
              </a>
              <a
                href="#approach"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-6 py-3.5 text-[15px] font-medium text-ink transition hover:border-primary/40"
              >
                {hero.secondaryCta}
                <ArrowDown className="h-4 w-4" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-10 flex items-center gap-4 border-t border-line/80 pt-6"
            >
              <div>
                <p className="text-lg font-semibold text-ink">{doctor.name}</p>
                <p className="text-sm text-ink-soft">
                  <span className="font-en">{doctor.title}</span> · {doctor.degrees}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ---- layered visual: molecule behind portrait, floating cards in front ---- */}
          <div className="relative z-10 mx-auto w-full max-w-[520px] lg:col-span-6 lg:max-w-none">
            <div className="relative mx-auto h-[500px] sm:h-[540px] lg:h-[600px]">
              <motion.div style={{ y: sceneY }} className="absolute inset-[-12%] lg:inset-[-6%_-8%_-6%_-6%]">
                <LazyScene scene={HeroMoleculeScene} fallback={<MoleculeArt className="opacity-70" />} preload="0px" className="h-full w-full" />
              </motion.div>

              <div className="absolute left-1/2 top-[2%] w-[68%] max-w-[360px] -translate-x-1/2 lg:left-[52%] lg:top-[6%] lg:w-[62%]">
                <Portrait scrollY={scrollY} />
              </div>

              {/* specialty chip */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 1.0, ease }}
                className="glass absolute left-0 top-[44%] z-20 rounded-2xl px-4 py-3 lg:left-[2%] lg:top-[18%]"
              >
                <p className="font-en text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Specialty</p>
                <p className="font-en mt-0.5 text-[15px] font-semibold text-ink">Medical Oncology</p>
              </motion.div>

              {/* patient-education card, overlapping the portrait like the reference */}
              <motion.a
                href="#approach"
                style={{ y: cardY }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.15, ease }}
                className="glass group absolute bottom-0 right-0 z-20 w-[min(270px,66%)] rounded-3xl p-4 sm:p-5 lg:bottom-[8%] lg:right-[-2%]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-primary">{hero.card.kicker}</span>
                  <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <p className="mt-3 text-[15px] font-semibold leading-snug text-ink sm:text-[16px]">{hero.card.title}</p>
                <p className="mt-2 text-xs text-ink-soft">{hero.card.meta}</p>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
