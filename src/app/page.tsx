import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Expertise } from "@/components/sections/Expertise";
import { Approach } from "@/components/sections/Approach";
import { Publications } from "@/components/sections/Publications";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        মূল বিষয়বস্তুতে যান
      </a>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Approach />
        <Publications />
        <Contact />
      </main>
    </>
  );
}
