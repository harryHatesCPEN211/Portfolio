"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  className?: string;
}

export function SectionHeader({ label, title, className }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={cn("mb-16 text-center md:text-left", className)}
    >
      <p className="text-xs font-mono tracking-[0.2em] uppercase text-accent-light mb-3">
        {label}
      </p>
      <h2 className="font-serif italic text-cream">{title}</h2>
    </motion.div>
  );
}
