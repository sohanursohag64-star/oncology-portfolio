"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { approach } from "@/lib/content";
import { Kicker, Reveal, RevealItem } from "../ui/Reveal";

export function Approach() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section id="approach" className="relative px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1360px] rounded-[var(--radius-panel)] bg-white px-6 py-14 shadow-float sm:px-10 lg:px-14 lg:py-20">
        <Reveal className="max-w-2xl">
          <RevealItem>
            <Kicker>{approach.kicker}</Kicker>
          </RevealItem>
          <RevealItem as="h2" className="display-bn mt-6 text-[clamp(2.2rem,4.6vw,4rem)] text-ink">
            {approach.title}
          </RevealItem>
        </Reveal>

        <div ref={ref} className="relative mt-16">
          {/* progress line drawn with scroll */}
          <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-line md:block" />
          <motion.div style={{ scaleX: progress }} className="absolute left-0 right-0 top-[22px] hidden h-px origin-left bg-primary md:block" />

          <Reveal as="ol" stagger={0.14} className="grid gap-10 md:grid-cols-4 md:gap-6">
            {approach.steps.map((s, i) => (
              <RevealItem as="li" key={s.n} className={`relative ${i % 2 ? "md:mt-16" : ""}`}>
                <span className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-sm font-semibold text-primary shadow-sm">
                  {s.n}
                </span>
                <h3 className="mt-6 text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.85] text-ink-soft">{s.text}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
