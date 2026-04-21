"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function About() {
  return (
    <section
      id="about"
      className="relative py-32 px-6 lg:px-12 border-t border-border overflow-hidden"
      aria-label="About"
    >
      {/* Background — flipped so Harry is on the left, open vista on the right */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/mountain.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            transform: "scaleX(-1)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/70" />
        {/* Location tag */}
        <div className="absolute bottom-6 right-6 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-accent-light flex-shrink-0">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8 8 0 10-16 0c0 3.63 1.556 6.324 3.5 8.327a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.144.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-mono text-gray-300">Salzkammergut, Upper Austria</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <SectionHeader label="About" title="Who I am" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — quote, education, stats */}
          <div className="space-y-6">

            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="border-l-2 border-accent-light pl-6"
            >
              <p className="text-2xl font-serif italic text-cream leading-snug">
                &ldquo;I trust the first version of my PCBs the same way I trust
                my sister. I don&apos;t trust my sister.&rdquo;
              </p>
            </motion.blockquote>

            {/* Education card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-card p-4 flex items-center gap-4"
            >
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/images/ubc-logo-transparent.png"
                  alt="UBC"
                  fill
                  className="object-contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                  sizes="40px"
                />
              </div>
              <div>
                <p className="text-sm font-mono text-cream leading-snug">
                  University of British Columbia
                </p>
                <p className="text-xs font-mono text-gray-400 mt-0.5">
                  BASc Electrical Engineering · 2023–2027
                </p>
              </div>
            </motion.div>

            {/* Stat pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "4", label: "Hardware projects" },
                { value: "2+", label: "Years in Altium" },
                { value: "Too many", label: "Hours staring at datasheets" },
                { value: "*sigh*", label: "Money spent at DigiKey" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-card p-4"
                >
                  <p className="text-2xl font-serif italic text-cream mb-0.5">{f.value}</p>
                  <p className="text-xs font-mono text-gray-400 tracking-wide">{f.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — bio, focus, status, download */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="space-y-6"
          >
            <div className="space-y-4 text-gray-200 leading-relaxed">
              <p>
                If I&apos;m being honest, I didn&apos;t even know what a PCB was before starting my second year of Electrical Engineering. But once I designed my first one, I could never look at a messy breadboard the same way again.
              </p>
              <p>
                What started as a steep learning curve quickly turned into a passion for hardware design. My sweet spot is owning the entire circuit lifecycle: taking a concept from LTspice and Altium layouts all the way to a fully tested, multi-layer board. I don&apos;t just route traces—I engineer around physical limits. Whether I&apos;m isolating a noisy power rail, tuning gate driver dead-time to prevent shoot-through, or packaging it all into a tight form factor, solving complex problems within physical constraints is what I do best.
              </p>
            </div>

            {/* Focus + status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-card px-4 py-3">
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 mb-2">Focus</p>
                <ul className="space-y-1 text-xs font-mono text-gray-300">
                  <li>PCB Design</li>
                  <li>Circuit Analysis</li>
                  <li>Power Electronics</li>
                </ul>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-card px-4 py-3">
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 mb-2">Status</p>
                <span className="inline-flex items-center gap-2 text-xs font-mono text-accent-light">
                  <span className="w-2 h-2 rounded-full bg-accent-light animate-pulse flex-shrink-0" />
                  Open to opportunities
                </span>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
