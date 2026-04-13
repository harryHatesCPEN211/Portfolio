"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";

const facts = [
  { value: "4", label: "Projects shipped" },
  { value: "3+", label: "Years in EDA" },
  { value: "SFU", label: "Mechatronics Eng." },
  { value: "2026", label: "Graduating" },
];

export function About() {
  return (
    <section
      id="about"
      className="py-32 px-6 lg:px-12 border-t border-border"
      aria-label="About"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — header + quote */}
          <div>
            <SectionHeader label="About" title="Who I am" />

            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="border-l-2 border-accent-light pl-6 mb-8"
            >
              <p className="text-2xl font-serif italic text-cream leading-snug">
                &ldquo;Hardware is where software meets physics — and physics
                always wins.&rdquo;
              </p>
            </motion.blockquote>

            {/* Fast facts */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="grid grid-cols-2 gap-4"
            >
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="bg-surface border border-border rounded-card p-4"
                >
                  <p className="text-2xl font-serif italic text-cream mb-0.5">
                    {f.value}
                  </p>
                  <p className="text-xs font-mono text-gray-500 tracking-wide">
                    {f.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — bio */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="space-y-5 text-gray-300 leading-relaxed"
          >
            <p>
              I&apos;m a fourth-year Mechatronics Engineering student at Simon
              Fraser University with a focus on embedded systems and PCB design.
              My work sits at the intersection of hardware and software — where
              a well-routed board and tight firmware loop are both essential.
            </p>
            <p>
              I&apos;ve spent the last three years designing boards in Altium,
              simulating circuits in LTspice, and writing firmware in C for
              microcontrollers ranging from the ATMEGA328P to the ESP32. Every
              project I take on starts with understanding the physics before
              touching a schematic.
            </p>
            <p>
              Outside of engineering, I&apos;m drawn to systems thinking — how
              small design decisions at the component level ripple up into
              system-level behaviour. I document my failures as carefully as my
              successes, because that&apos;s where the real learning is.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
