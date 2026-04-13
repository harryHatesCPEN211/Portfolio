"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { ModelViewer } from "@/components/viewer/ModelViewer";
import { ViewerSkeleton } from "@/components/viewer/ViewerSkeleton";
import { featuredProject, gridProjects } from "@/data/projects";

function ProjectCard({ project, index }: { project: typeof gridProjects[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="group bg-surface border border-border rounded-card overflow-hidden hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_32px_rgba(26,58,42,0.2)] transition-all duration-200"
    >
      {/* Image */}
      <div className="relative h-44 bg-surface-2 overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-mono text-gray-600 tracking-widest">No image</span>
          </div>
        )}
        {/* Year badge */}
        <span className="absolute top-3 right-3 text-[10px] font-mono tracking-widest text-gray-400 bg-black/70 px-2 py-1 rounded">
          {project.year}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif text-cream text-lg mb-2 leading-snug">
          {project.title}
        </h3>
        <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2">
          {project.shortDesc}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-5">
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

export function Projects() {
  return (
    <section
      id="projects"
      className="py-32 px-6 lg:px-12 border-t border-border"
      aria-label="Projects"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="Work" title="Selected projects" />

        {/* Featured project */}
        <motion.article
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mb-16 bg-surface border border-border rounded-card overflow-hidden"
          aria-label={`Featured: ${featuredProject.title}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* 3D Viewer */}
            <div className="relative h-72 lg:h-auto min-h-[400px] bg-[#0a0f0b]">
              {featuredProject.modelPath ? (
                <Suspense fallback={<ViewerSkeleton />}>
                  <ModelViewer
                    modelPath={featuredProject.modelPath}
                    className="absolute inset-0 rounded-none"
                  />
                </Suspense>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-mono text-gray-600">No model</span>
                </div>
              )}

              {/* Featured label */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-accent-light bg-accent/30 border border-accent/40 px-2.5 py-1 rounded">
                  Featured
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <p className="text-xs font-mono text-gray-500 tracking-widest mb-4">
                {featuredProject.year}
              </p>
              <h3 className="font-serif italic text-cream text-2xl lg:text-3xl mb-4 leading-snug">
                {featuredProject.title}
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                {featuredProject.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {featuredProject.tags.map((tag) => (
                  <Tag key={tag} variant="accent">{tag}</Tag>
                ))}
              </div>
              <Button href={`/projects/${featuredProject.slug}`} variant="fill">
                View full case study
              </Button>
            </div>
          </div>
        </motion.article>

        {/* Project grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridProjects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
