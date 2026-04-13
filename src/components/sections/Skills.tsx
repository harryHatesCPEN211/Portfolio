"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { skillCategories } from "@/data/skills";
import { cn } from "@/lib/utils";

function ProficiencyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1" aria-label={`Proficiency: ${level} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "block w-1.5 h-1.5 rounded-full transition-colors",
            i < level ? "bg-accent-light" : "bg-surface-2 border border-border"
          )}
        />
      ))}
    </div>
  );
}

export function Skills() {
  return (
    <section
      id="skills"
      className="py-32 px-6 lg:px-12 border-t border-border"
      aria-label="Skills"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="Skills" title="What I work with" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category, ci) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: ci * 0.1,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
              className="bg-surface border border-border rounded-card p-6"
            >
              <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-accent-light mb-6">
                {category.name}
              </h3>

              <ul className="space-y-4" role="list">
                {category.skills.map((skill, si) => (
                  <motion.li
                    key={skill.name}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: ci * 0.1 + si * 0.05,
                      ease: "easeOut",
                    }}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-sm font-mono text-gray-300">
                      {skill.name}
                    </span>
                    <ProficiencyDots level={skill.level} />
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xs font-mono text-gray-600 text-center mt-8"
        >
          Dots indicate relative proficiency — 5 = primary tool, 1 = familiar
        </motion.p>
      </div>
    </section>
  );
}
