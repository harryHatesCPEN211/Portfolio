"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  number?: string;
  className?: string;
}

export function SectionHeader({ label, title, number, className }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={cn("mb-16 text-center md:text-left", className)}
    >
      <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
        {number && (
          <span className="text-[10px] font-mono text-gray-600 tracking-widest">{number}</span>
        )}
        <span className="flex-1 h-px bg-border max-w-[40px] hidden md:block" />
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-accent-light">
          {label}
        </p>
      </div>
      <h2 className="font-serif italic text-cream">{title}</h2>
    </motion.div>
  );
}
