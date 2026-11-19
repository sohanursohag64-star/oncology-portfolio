"use client";

import { useEffect, useState, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { publications } from "@/lib/content";
import { Kicker, Reveal, RevealItem } from "../ui/Reveal";

type Pub = (typeof publications)[number];

/** Generated cover artwork — abstract scientific motifs, no imagery that implies results. */
function Cover({ kind }: { kind: Pub["cover"] }) {
  return (
    <svg viewBox="0 0 260 200" className="h-full w-full" role="presentation">
      <rect width="260" height="200" fill="url(#cv-bg)" />
      <defs>
        <linearGradient id="cv-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DFF4FC" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      {kind === "helix" &&
        Array.from({ length: 14 }, (_, i) => {
          const x = 20 + i * 17;
          const t = i * 0.6;
          return (
            <g key={i}>
              <line x1={x} y1={100 + Math.sin(t) * 55} x2={x} y2={100 - Math.sin(t) * 55} stroke="#BFE6F5" strokeWidth="3" />
              <circle cx={x} cy={100 + Math.sin(t) * 55} r="6" fill="#2788B9" />
              <circle cx={x} cy={100 - Math.sin(t) * 55} r="6" fill="#70C9E8" />
            </g>
          );
        })}
      {kind === "cells" &&
        [[70, 80, 48], [170, 120, 60], [210, 50, 26], [60, 160, 30]].map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill="#ffffff" stroke="#70C9E8" strokeWidth="3" />
            <circle cx={x + r * 0.1} cy={y - r * 0.05} r={r * 0.38} fill="#2788B9" opacity="0.85" />
          </g>
        ))}
      {kind === "network" &&
        (() => {
          const p = [[40, 60], [100, 40], [150, 90], [210, 50], [90, 140], [180, 160], [230, 120]];
          const e = [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [5, 6], [3, 6], [2, 5]];
          return (
            <g>
              {e.map(([a, b], i) => (
                <line key={i} x1={p[a][0]} y1={p[a][1]} x2={p[b][0]} y2={p[b][1]} stroke="#BFE6F5" strokeWidth="3" />
              ))}
              {p.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i % 3 ? 8 : 12} fill={i % 2 ? "#70C9E8" : "#2788B9"} />
              ))}
            </g>
          );
        })()}
      {kind === "waves" &&
        Array.from({ length: 6 }, (_, i) => (
          <path
            key={i}
            d={`M0 ${60 + i * 18} C 70 ${20 + i * 18}, 150 ${110 + i * 18}, 260 ${50 + i * 18}`}
            fill="none"
            stroke={i % 2 ? "#70C9E8" : "#2788B9"}
            strokeOpacity={0.35 + i * 0.1}
            strokeWidth="3"
          />
        ))}
    </svg>
  );
}

function useIsDesktop() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const u = () => setV(mq.matches);
    u();
    mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);
  return v;
}

function PubCard({ pub, i, total, desktop }: { pub: Pub; i: number; total: number; desktop: boolean }) {
  // hover tilt toward the pointer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const c = i - (total - 1) / 2; // -1.5 … 1.5
  const fan = desktop
    ? { x: c * 292, rotateY: c * -9, z: -Math.abs(c) * 50, y: Math.abs(c) * 16, opacity: 1 }
    : { x: 0, rotateY: 0, z: 0, y: 0, opacity: 1 };
  const stacked = desktop ? { x: c * 30, rotateY: 0, z: -i * 20, y: 40, opacity: 0 } : { x: 0, rotateY: 0, z: 0, y: 40, opacity: 0 };

  const Tag = pub.href ? motion.a : motion.article;

  return (
    <motion.div
      className={desktop ? "absolute left-1/2 top-6 -ml-[135px]" : "shrink-0 snap-center"}
      style={{ transformStyle: "preserve-3d" }}
      variants={{ hidden: stacked, show: { ...fan, transition: { duration: 1.1, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] } } }}
    >
      <Tag
        {...(pub.href ? { href: pub.href, target: "_blank", rel: "noreferrer" } : {})}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        whileHover={{ z: 60, y: -10 }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group block w-[270px] overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-float"
      >
        <div className="relative h-[190px] overflow-hidden">
          <Cover kind={pub.cover} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {pub.placeholder && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink-soft">যোগ করুন</span>
          )}
        </div>
        <div className="p-5" style={{ transform: "translateZ(30px)" }}>
          <p className="font-en text-xs font-medium text-primary">
            {pub.journal} · {pub.year}
          </p>
          <h3 className="mt-2 min-h-[3.2em] text-[17px] font-semibold leading-snug text-ink">{pub.title}</h3>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft group-hover:text-primary">
            {pub.href ? "পড়ুন" : "শীঘ্রই"} <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Tag>
    </motion.div>
  );
}

export function Publications() {
  const desktop = useIsDesktop();
  const empty = publications.every((p) => p.placeholder);

  return (
    <section id="publications" className="relative overflow-hidden px-4 py-24 md:px-8 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-[420px] bg-gradient-to-b from-secondary/0 via-secondary/70 to-secondary/0" />
      <div className="relative mx-auto max-w-[1360px]">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <RevealItem>
              <Kicker>Publications &amp; Research</Kicker>
            </RevealItem>
            <RevealItem as="h2" className="display-bn mt-6 text-[clamp(2.2rem,4.6vw,4rem)] text-ink">
              গবেষণা ও <span className="text-primary">প্রকাশনা</span>
            </RevealItem>
          </div>
          <RevealItem as="p" className="flex items-start gap-3 text-[16px] leading-[1.85] text-ink-soft lg:col-span-5 lg:pb-2">
            <BookOpen className="mt-1 h-5 w-5 shrink-0 text-accent" />
            {empty
              ? "প্রকাশিত গবেষণাপত্রগুলো এখানে যুক্ত করা হবে — শিরোনাম, জার্নাল ও DOI লিংকসহ।"
              : "নির্বাচিত গবেষণাপত্র — বিস্তারিত পড়তে কার্ডে ক্লিক করুন।"}
          </RevealItem>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          className={
            desktop
              ? "relative mt-14 h-[460px]"
              : "-mx-4 mt-12 flex h-[460px] snap-x snap-mandatory items-start gap-5 overflow-x-auto px-6 pt-4"
          }
          style={desktop ? { perspective: 1600, transformStyle: "preserve-3d" } : undefined}
        >
          {publications.map((p, i) => (
            <PubCard key={i} pub={p} i={i} total={publications.length} desktop={desktop} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
