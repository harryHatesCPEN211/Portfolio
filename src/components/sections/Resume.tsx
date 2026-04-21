"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export function Resume() {
  return (
    <section
      id="resume"
      className="py-32 px-6 lg:px-12 border-t border-border"
      aria-label="Resume"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="Resume" title="My background" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — info + buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <div className="space-y-8 mb-10 text-center lg:text-left">
              <div>
                <p className="text-xs font-mono tracking-[0.2em] uppercase text-gray-500 mb-3">Education</p>
                <p className="text-sm font-mono text-cream">University of British Columbia</p>
                <p className="text-sm font-mono text-gray-400">BASc Electrical Engineering</p>
                <p className="text-xs font-mono text-gray-600 mt-1">2023 – 2027</p>
              </div>

              <div>
                <p className="text-xs font-mono tracking-[0.2em] uppercase text-gray-500 mb-3">Focus Areas</p>
                <ul className="space-y-1 text-sm font-mono text-gray-400">
                  <li>PCB Design</li>
                  <li>Circuit Analysis</li>
                  <li>Power Electronics</li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-mono tracking-[0.2em] uppercase text-gray-500 mb-3">Status</p>
                <span className="inline-flex items-center gap-2 text-sm font-mono text-accent-light">
                  <span className="w-2 h-2 rounded-full bg-accent-light animate-pulse" />
                  Open to opportunities
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button href="/resume.pdf" external variant="fill" size="lg">
                Download PDF
              </Button>
              <Button href="/resume.pdf" external variant="outline" size="lg">
                View in browser
              </Button>
            </div>
          </motion.div>

          {/* Right — UBC logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative w-72 h-72 lg:w-96 lg:h-96">
              <Image
                src="/images/ubc-logo-transparent.png"
                alt="University of British Columbia"
                fill
                className="object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
                sizes="288px"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
