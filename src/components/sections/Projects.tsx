"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { projects } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const isFeatured = project.featured;

  return (
    <motion.article
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
      className="group w-72 sm:w-80 flex-shrink-0 snap-start bg-surface border border-border rounded-card overflow-hidden hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_32px_rgba(26,58,42,0.2)] transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-surface-2 overflow-hidden flex-shrink-0">
        {project.imageRight ? (
          <>
            {/* Mobile: main image full-width */}
            {project.image && (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className={`sm:hidden ${project.imageFit === "contain" ? "object-contain" : "object-cover group-hover:scale-[1.03]"} transition-transform duration-300`}
                sizes="288px"
                priority={isFeatured}
              />
            )}
            {/* sm+: split layout */}
            <div className="absolute inset-0 hidden sm:flex">
              <div className="relative w-1/2 h-full">
                {project.image && (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={`${project.imageFit === "contain" ? "object-contain p-1" : "object-cover group-hover:scale-[1.03]"} transition-transform duration-300`}
                    sizes="160px"
                    priority={isFeatured}
                  />
                )}
              </div>
              <div className={`relative w-1/2 h-full border-l border-border ${project.imageRightFit === "cover" ? "" : "bg-white"}`}>
                <Image
                  src={project.imageRight}
                  alt=""
                  fill
                  className={`${project.imageRightFit === "cover" ? "object-cover group-hover:scale-[1.03]" : "object-contain p-4"} transition-transform duration-300`}
                  sizes="160px"
                />
              </div>
            </div>
          </>
        ) : project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className={`${project.imageFit === "contain" ? "object-contain" : "object-cover group-hover:scale-[1.03]"} transition-transform duration-300`}
            sizes="320px"
            priority={isFeatured}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-2 to-[#0d1f14]">
            <span className="text-xs font-mono text-gray-600 tracking-widest uppercase">
              Photo coming soon
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {isFeatured && (
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-accent-light bg-accent/20 border border-accent/50 px-2.5 py-1 rounded backdrop-blur-sm">
              Featured
            </span>
          )}
        </div>
        <span className="absolute top-3 right-3 text-[10px] font-mono tracking-widest text-gray-300 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
          {project.year}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-xl text-cream leading-snug mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2 flex-1">
          {project.shortDesc}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="text-xs font-mono text-accent-light hover:text-cream tracking-wide transition-colors duration-150 inline-flex items-center gap-1.5 group/link"
        >
          View case study
          <span className="group-hover/link:translate-x-1 transition-transform duration-150">→</span>
        </Link>
      </div>
    </motion.article>
  );
}

function MoreToComePlaceholder() {
  return (
    <div className="w-56 flex-shrink-0 snap-start bg-surface border border-dashed border-border rounded-card flex flex-col items-center justify-center gap-3 opacity-40">
      <div className="w-9 h-9 rounded-full border border-dashed border-gray-600 flex items-center justify-center">
        <span className="text-gray-500 text-lg leading-none">+</span>
      </div>
      <p className="font-serif italic text-gray-500 text-base">More to come</p>
      <p className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">In progress</p>
    </div>
  );
}

export function Projects() {
  return (
    <motion.section
      id="projects"
      className="py-32 border-t border-border"
      aria-label="Projects"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader label="Work" title="Selected projects" number="03" />
      </div>

      {/* Horizontal scroll track — centered, scrollable on small screens */}
      <div className="relative overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-5 snap-x snap-mandatory pb-4 px-6 lg:px-12 justify-center min-w-fit mx-auto">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
          <MoreToComePlaceholder />
        </div>
        {/* Right-edge fade hint — mobile only */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0f0f0f] to-transparent pointer-events-none sm:hidden" />
      </div>

      {/* Swipe indicator — mobile only */}
      <motion.p
        className="sm:hidden flex items-center justify-center gap-2 mt-3 text-[10px] font-mono tracking-[0.2em] uppercase text-gray-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Swipe to explore
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
        >
          →
        </motion.span>
      </motion.p>
    </motion.section>
  );
}
