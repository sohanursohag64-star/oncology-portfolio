"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { doctor, nav } from "@/lib/content";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // highlight the section currently in view
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nav.forEach((n) => {
      const el = document.querySelector(n.href);
      if (el) obs.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 md:px-8 md:pt-4">
      <div
        className={`mx-auto flex max-w-[1360px] items-center justify-between rounded-full px-3 py-2 transition-all duration-500 md:px-4 ${
          scrolled ? "glass" : "border border-transparent"
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5 pl-1" aria-label="প্রথম পাতা">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white shadow-soft">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="2.6" fill="currentColor" />
              <circle cx="5" cy="7" r="1.6" />
              <circle cx="19" cy="7" r="1.6" />
              <circle cx="12" cy="20" r="1.6" />
              <path d="M6.4 7.9 10 10.6M17.6 7.9 14 10.6M12 14.6v3.8" />
            </svg>
          </span>
          <span className="font-en text-[15px] font-semibold tracking-tight text-ink">{doctor.nameEn}</span>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-line/80 bg-white/70 p-1 lg:flex" aria-label="মূল মেনু">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`relative rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors ${
                active === n.href ? "text-white" : "text-ink-soft hover:text-ink"
              }`}
            >
              {active === n.href && (
                <motion.span layoutId="nav-pill" className="absolute inset-0 -z-0 rounded-full bg-primary shadow-soft" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              <span className="relative">{n.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white transition hover:bg-primary-deep sm:inline-flex"
          >
            অ্যাপয়েন্টমেন্ট
          </a>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white/80 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass mx-auto mt-2 max-w-[1360px] rounded-3xl p-3 lg:hidden"
            aria-label="মোবাইল মেনু"
          >
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-medium text-ink hover:bg-secondary">
                {n.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
