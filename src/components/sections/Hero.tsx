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

      {/* UBC logo background */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src="/images/ubc-logo-transparent.png"
          alt=""
          fill
          className="object-contain object-center"
          style={{ filter: "brightness(0) invert(1)" }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/88" />
      </div>

      {/* Accent glow */}
      <div
        className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center md:items-start gap-16 py-20">
        {/* Text */}
        <div className="flex-1 min-w-0 text-center md:text-left">
          {/* UBC logo — mobile only, above the subtitle */}
          <motion.div
            {...fadeUp(0.05)}
            className="flex justify-center mb-5 md:hidden"
          >
            <div className="relative w-14 h-14">
              <Image
                src="/images/ubc-logo-transparent.png"
                alt="UBC"
                fill
                className="object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
                sizes="56px"
              />
            </div>
          </motion.div>

          <motion.p
            {...fadeUp(0.1)}
            className="text-xs font-mono tracking-[0.25em] uppercase text-accent-light mb-6"
          >
            3rd-year Electrical Engineering Student
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
            Hey, I&apos;m Harry, a third-year EE student at UBC. I&apos;m super into hardware and PCB design, and I love taking projects from the &ldquo;staring at datasheets for hours&rdquo; phase all the way to building electronics that actually work.
            <br /><br />
            I can also change your light-bulb too, if you asked me nicely.
          </motion.p>

          <motion.div
            {...fadeUp(0.45)}
            className="flex flex-wrap gap-4 justify-center md:justify-start"
          >
            <Button href="#projects" variant="fill" size="lg">
              View Projects
            </Button>
            <Button
              href="/resume.pdf"
              variant="fill"
              size="lg"
              external
              className="bg-accent-light text-black border-accent-light hover:bg-accent-light/80 hover:border-accent-light/80"
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
          className="flex-shrink-0 flex justify-center mt-2 md:mt-1 md:ml-auto md:mr-8"
        >
          <div className="relative w-52 h-64 sm:w-64 sm:h-80 md:w-80 md:h-[420px]">
            {/* Teal border frame */}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-accent-light/60 to-accent/30" />
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src="/images/projects/new_pfp.JPG"
                alt="Harry Nguyen"
                fill
                className="object-cover"
                style={{ objectPosition: "50% 70%" }}
                priority
                sizes="(max-width: 640px) 208px, (max-width: 768px) 256px, 320px"
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
