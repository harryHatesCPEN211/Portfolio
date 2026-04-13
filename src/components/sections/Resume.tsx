"use client";

import { motion } from "framer-motion";
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
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
          <SectionHeader label="Resume" title="My background" className="mb-0" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="flex flex-col sm:flex-row gap-4 flex-shrink-0"
          >
            <Button href="/resume.pdf" external variant="fill" size="lg">
              Download PDF
            </Button>
            <Button href="/resume.pdf" external variant="outline" size="lg">
              View in browser
            </Button>
          </motion.div>
        </div>

        {/* Preview card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mt-16 bg-surface border border-border rounded-card p-8 lg:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-mono tracking-[0.2em] uppercase text-gray-500 mb-3">Education</p>
              <p className="text-sm font-mono text-cream">Simon Fraser University</p>
              <p className="text-sm font-mono text-gray-400">BASc Mechatronics Engineering</p>
              <p className="text-xs font-mono text-gray-600 mt-1">2022 – 2026</p>
            </div>
            <div>
              <p className="text-xs font-mono tracking-[0.2em] uppercase text-gray-500 mb-3">Focus Areas</p>
              <ul className="space-y-1 text-sm font-mono text-gray-400">
                <li>Embedded Systems</li>
                <li>PCB Design</li>
                <li>Motor Control</li>
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
        </motion.div>
      </div>
    </section>
  );
}
