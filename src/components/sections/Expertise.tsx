"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Hand } from "lucide-react";
import { expertise } from "@/lib/content";
import { LazyScene } from "../three/LazyScene";
import { ExpertiseViewerScene } from "../three/scenes";
import { ModelArt } from "../three/StaticArt";
import { Kicker, Reveal, RevealItem } from "../ui/Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

export function Expertise() {
  const [index, setIndex] = useState(0);
  const item = expertise[index];

  return (
    <section id="expertise" className="relative px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1360px]">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <RevealItem>
              <Kicker>Oncology Expertise</Kicker>
            </RevealItem>
            <RevealItem as="h2" className="display-bn mt-6 text-[clamp(2.2rem,4.6vw,4rem)] text-ink">
              ক্যান্সার চিকিৎসার <span className="text-primary">আধুনিক দিকগুলো</span>
            </RevealItem>
          </div>
          <RevealItem as="p" className="text-[16px] leading-[1.85] text-ink-soft lg:col-span-5 lg:pb-2">
            প্রতিটি বিষয়ের বৈজ্ঞানিক মডেল ঘুরিয়ে দেখুন। মডেলগুলো শিক্ষার জন্য সরলীকৃত — প্রকৃত আকার ও অনুপাত ভিন্ন হতে পারে।
          </RevealItem>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {/* topic list */}
          <div role="tablist" aria-label="Expertise topics" className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 lg:col-span-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {expertise.map((e, i) => {
              const on = i === index;
              return (
                <button
                  key={e.id}
                  role="tab"
                  aria-selected={on}
                  aria-controls="expertise-panel"
                  onClick={() => setIndex(i)}
                  className={`group relative flex min-w-[220px] items-center gap-4 rounded-3xl border px-5 py-4 text-left transition-all duration-500 lg:min-w-0 ${
                    on ? "glass border-white" : "border-transparent hover:bg-white/50"
                  }`}
                >
                  <span className={`font-en text-sm font-semibold tabular-nums ${on ? "text-primary" : "text-ink-soft/60"}`}>0{i + 1}</span>
                  <span>
                    <span className={`font-en block text-[17px] font-semibold ${on ? "text-ink" : "text-ink-soft"}`}>{e.tag}</span>
                    <span className="block text-sm text-ink-soft">{e.title}</span>
                  </span>
                  {on && <motion.span layoutId="exp-dot" className="ml-auto hidden h-2 w-2 rounded-full bg-primary lg:block" />}
                </button>
              );
            })}
          </div>

          {/* viewer + overlapping detail card */}
          <div id="expertise-panel" role="tabpanel" className="relative lg:col-span-8">
            <div className="relative overflow-hidden rounded-[var(--radius-panel)] border border-white/80 bg-[linear-gradient(180deg,#bfe1f3_0%,#e2f3fb_55%,#d3ebf7_56%,#eaf7fd_100%)] shadow-float">
              <div className="grain pointer-events-none absolute inset-0 opacity-50" />
              <div className="relative aspect-[4/3.4] sm:aspect-[16/11] lg:aspect-[16/12] lg:w-[78%]">
                <LazyScene
                  scene={ExpertiseViewerScene}
                  sceneProps={{ model: item.model }}
                  fallback={<ModelArt model={item.model} />}
                  className="h-full w-full"
                />
              </div>
              <p className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs text-ink-soft">
                <Hand className="h-3.5 w-3.5" /> ঘুরিয়ে দেখুন
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease }}
                className="glass relative z-10 mx-3 -mt-16 rounded-[1.75rem] p-6 sm:mx-6 md:p-8 lg:absolute lg:-right-4 lg:top-1/2 lg:mx-0 lg:mt-0 lg:w-[400px] lg:-translate-y-1/2"
              >
                <p className="font-en text-xs font-semibold uppercase tracking-[0.18em] text-primary">{item.tag}</p>
                <h3 className="mt-2 text-2xl font-bold leading-snug text-ink">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.85] text-ink-soft">{item.summary}</p>
                <ul className="mt-5 space-y-2">
                  {item.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-[15px] text-ink">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-secondary text-primary">
                        <Check className="h-3 w-3" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-ink-soft">{item.caption}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
