"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
});

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-dvh flex items-center pt-16 px-6 lg:px-12 overflow-hidden"
      aria-label="Introduction"
    >
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-cream) 1px, transparent 1px), linear-gradient(90deg, var(--color-cream) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Accent glow */}
      <div
        className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-16 py-20">
        {/* Text */}
        <div className="flex-1 min-w-0">
          <motion.p
            {...fadeUp(0.1)}
            className="text-xs font-mono tracking-[0.25em] uppercase text-accent-light mb-6"
          >
            Mechatronics Engineer
          </motion.p>

          <motion.h1
            {...fadeUp(0.2)}
            className="font-serif italic text-cream mb-6 leading-[1.05]"
          >
            Harry
            <br />
            Nguyen
          </motion.h1>

          <motion.p
            {...fadeUp(0.35)}
            className="text-gray-300 max-w-md leading-relaxed mb-10 text-base"
          >
            I design circuits that don&apos;t fail and robots that move precisely.
            Embedded systems, PCB design, and motor control — from schematic to
            soldered board.
          </motion.p>

          <motion.div
            {...fadeUp(0.45)}
            className="flex flex-wrap gap-4"
          >
            <Button href="#projects" variant="fill" size="lg">
              View Projects
            </Button>
            <Button
              href="/resume.pdf"
              variant="outline"
              size="lg"
              external
            >
              Download Resume
            </Button>
          </motion.div>
        </div>

        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 hidden sm:block"
        >
          <div className="relative w-56 h-72 md:w-64 md:h-80">
            {/* Teal border frame */}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-accent-light/60 to-accent/30" />
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src="/images/profile.jpg"
                alt="Harry Nguyen"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 768px) 0px, 256px"
              />
            </div>
            {/* Corner accent */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 border-accent-light rounded-br-xl" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gray-600">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-gray-600 to-transparent"
        />
      </motion.div>
    </section>
  );
}
