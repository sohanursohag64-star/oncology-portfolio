import type { Metadata, Viewport } from "next";
import { MotionConfig } from "motion/react";
import { doctor } from "@/lib/content";
import { hind, inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: `${doctor.name} — ${doctor.title}`,
  description:
    "Medical Oncologist — বিজ্ঞানভিত্তিক ও মানবিক ক্যান্সার চিকিৎসা। Chemotherapy, Immunotherapy, Targeted Therapy ও Precision Oncology সম্পর্কে জানুন।",
};

export const viewport: Viewport = {
  themeColor: "#F8FCFE",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${hind.variable} ${inter.variable}`}>
      <body>
        {/* reducedMotion="user" makes every Motion animation honour prefers-reduced-motion */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
