"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Quote } from "lucide-react";
import { about } from "@/lib/content";
import { LazyScene } from "../three/LazyScene";
import { AboutGlassScene } from "../three/scenes";
import { GlassArt } from "../three/StaticArt";
import { Kicker, Reveal, RevealItem } from "../ui/Reveal";

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const panelY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const glassY = useTransform(scrollYProgress, [0, 1], [-40, 80]);

  return (
    <section id="about" ref={ref} className="sky-band relative overflow-hidden px-4 py-24 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-12 lg:gap-8">
        {/* left: oversized editorial title, glass forms floating behind */}
        <div className="relative lg:col-span-5">
          <motion.div style={{ y: glassY }} className="pointer-events-none absolute -left-28 top-40 h-[340px] w-[340px] opacity-80 md:-left-40 md:top-44 md:h-[500px] md:w-[500px]">
            <LazyScene scene={AboutGlassScene} fallback={<GlassArt />} className="h-full w-full" />
          </motion.div>
          <Reveal className="relative">
            <RevealItem>
              <Kicker>{about.kicker}</Kicker>
            </RevealItem>
            <RevealItem as="h2" className="display-bn mt-6 text-[clamp(2.3rem,5vw,4.4rem)] text-ink">
              {about.title.map((l, i) => (
                <span key={i} className={`block ${i === 1 ? "text-primary" : ""}`}>
                  {l}
                </span>
              ))}
            </RevealItem>
          </Reveal>
        </div>

        {/* right: overlapping panels */}
        <div className="relative lg:col-span-7 lg:pt-28">
          <div className="absolute -right-6 top-6 hidden h-[86%] w-[64%] rounded-[var(--radius-panel)] bg-[linear-gradient(160deg,#cfe8f6,#eaf7fd)] lg:block" />
          <motion.div style={{ y: panelY }} className="relative">
            <Reveal className="glass relative rounded-[var(--radius-panel)] p-7 md:p-11 lg:mr-24">
              {about.body.map((p, i) => (
                <RevealItem as="p" key={i} className={`text-[17px] leading-[1.9] text-ink-soft ${i ? "mt-5" : ""}`}>
                  {p}
                </RevealItem>
              ))}
              <RevealItem className="mt-9 grid gap-3 sm:grid-cols-3">
                {about.facts.map((f) => (
                  <div key={f.label} className="rounded-2xl border border-white/80 bg-white/55 px-4 py-4">
                    <p className="text-xs text-ink-soft">{f.label}</p>
                    <p className="mt-1 font-semibold text-ink">{f.value}</p>
                  </div>
                ))}
              </RevealItem>
            </Reveal>

            <Reveal delay={0.3} className="relative -mt-8 ml-auto w-[88%] max-w-[420px] md:-mt-10 lg:-mr-2">
              <RevealItem className="glass rounded-3xl p-6">
                <Quote className="h-6 w-6 text-accent" />
                <p className="mt-3 text-lg font-medium leading-relaxed text-ink">{about.quote}</p>
              </RevealItem>
            </Reveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
