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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      className={`group bg-surface border border-border rounded-card overflow-hidden hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_32px_rgba(26,58,42,0.2)] transition-all duration-200 flex flex-col ${
        isFeatured ? "sm:col-span-2" : ""
      }`}
    >
      {/* Image */}
      <div className={`relative bg-surface-2 overflow-hidden flex-shrink-0 ${isFeatured && project.imageRight ? "h-96 sm:h-96" : isFeatured ? "h-72 sm:h-96" : project.imageRight ? "h-64 sm:h-52" : "h-52"}`}>
        {project.imageRight ? (
          /* Split layout — stacks vertically on mobile, side by side on sm+ */
          <div className="absolute inset-0 flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-1/2 h-1/2 sm:h-full border-b sm:border-b-0 sm:border-r border-border">
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className={`${project.imageFit === "contain" ? "object-contain p-1" : "object-cover group-hover:scale-[1.03]"} transition-transform duration-300`}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  priority={isFeatured}
                />
              )}
            </div>
            <div className={`relative w-full sm:w-1/2 h-1/2 sm:h-full ${project.imageRightFit === "cover" ? "" : "bg-surface-2"}`}>
              <Image
                src={project.imageRight}
                alt=""
                fill
                className={`${project.imageRightFit === "cover" ? "object-cover group-hover:scale-[1.03]" : "object-contain p-6"} transition-transform duration-300`}
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>
        ) : project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className={`${project.imageFit === "contain" ? "object-contain" : "object-cover group-hover:scale-[1.03]"} transition-transform duration-300`}
            sizes={isFeatured ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
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
      <div className="p-6 flex flex-col flex-1">
        <h3 className={`font-serif text-cream leading-snug mb-2 ${isFeatured ? "text-2xl" : "text-xl"}`}>
          {project.title}
        </h3>
        <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2 flex-1">
          {project.shortDesc}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.slice(0, isFeatured ? 6 : 4).map((tag) => (
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

function MoreToComePlaceholder({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      className="bg-surface border border-dashed border-border rounded-card overflow-hidden flex flex-col items-center justify-center min-h-[340px] gap-4 opacity-50 sm:col-span-2"
      aria-label="More projects coming soon"
    >
      <div className="w-10 h-10 rounded-full border border-dashed border-gray-600 flex items-center justify-center">
        <span className="text-gray-500 text-lg leading-none">+</span>
      </div>
      <p className="font-serif italic text-gray-500 text-lg">More to come</p>
      <p className="text-xs font-mono text-gray-600 tracking-widest uppercase">In progress</p>
    </motion.div>
  );
}

export function Projects() {
  return (
    <motion.section
      id="projects"
      className="py-32 px-6 lg:px-12 border-t border-border"
      aria-label="Projects"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="Work" title="Selected projects" number="03" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
          <MoreToComePlaceholder index={projects.length} />
        </div>
      </div>
    </motion.section>
  );
}
