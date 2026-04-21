import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import { projects } from "@/data/projects";
import type { GalleryItem } from "@/types";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { CollapsibleText } from "@/components/ui/CollapsibleText";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ModelViewer } from "@/components/viewer/ModelViewer";
import { ViewerSkeleton } from "@/components/viewer/ViewerSkeleton";
import { DiagramViewer } from "@/components/viewer/DiagramViewer";

// ── Gallery ───────────────────────────────────────────────────────────────────

function GallerySection({ items }: { items: GalleryItem[] }) {
  const videos = items.filter((i) => i.type === "video" || i.type === "youtube");

  // Group non-video items by their group field, preserving insertion order
  const groups: Record<string, GalleryItem[]> = {};
  for (const item of items) {
    if (item.type === "video" || item.type === "youtube") continue;
    if (!groups[item.group]) groups[item.group] = [];
    groups[item.group].push(item);
  }

  return (
    <section aria-labelledby="gallery-heading" className="mb-12">
      <h2
        id="gallery-heading"
        className="font-mono text-xs tracking-[0.2em] uppercase text-gray-500 mb-5"
      >
        Gallery
      </h2>

      {/* Videos — stacked full width */}
      {videos.length > 0 && (
        <div className="mb-6 space-y-5">
          {videos.map((video) => (
            <div key={video.src}>
              <p className="font-mono text-sm font-medium text-accent-light mb-2 tracking-wide">
                {video.caption}
              </p>
              <div className="relative w-full rounded-card overflow-hidden bg-black border border-border aspect-video">
                {video.type === "youtube" ? (
                  <iframe
                    src={video.src}
                    title={video.caption}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <video
                    src={video.src}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image groups */}
      {Object.entries(groups).map(([groupName, groupItems]) => (
        <div key={groupName} className="mb-6">
          <p className="font-mono text-sm font-medium text-accent-light mb-2 tracking-wide">
            {groupName}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {groupItems.map((item) =>
              item.natural ? (
                <a
                  key={item.src}
                  href={item.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block relative rounded-card overflow-hidden border border-border bg-surface-2 hover:border-accent/40 transition-colors duration-150 ${item.wide ? "sm:col-span-2" : ""}`}
                  title="Open full size"
                >
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 left-2 right-2 flex justify-center">
                    <span className="bg-black/75 backdrop-blur-sm text-white text-[10px] font-mono tracking-wide px-2.5 py-1 rounded-full">
                      {item.caption}
                    </span>
                  </span>
                </a>
              ) : (
              <a
                key={item.src}
                href={item.src}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block relative rounded-card overflow-hidden border border-border bg-surface-2 hover:border-accent/40 transition-colors duration-150 ${item.wide ? "sm:col-span-2 aspect-[2.5/1]" : item.objectFit === "contain" ? "aspect-[4/3]" : "aspect-video"}`}
                title="Open full size"
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  className={`${item.objectFit === "contain" ? "object-contain p-3" : "object-cover group-hover:scale-[1.02]"} transition-transform duration-300`}
                  sizes={item.wide ? "100vw" : "(max-width: 640px) 100vw, 50vw"}
                />
                <span className="absolute bottom-2 left-2 right-2 flex justify-center">
                  <span className="bg-black/75 backdrop-blur-sm text-white text-[10px] font-mono tracking-wide px-2.5 py-1 rounded-full">
                    {item.caption}
                  </span>
                </span>
              </a>
              )
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Harry Nguyen`,
    description: project.shortDesc,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <Nav />
      <main className="pt-24 pb-32 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Back */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-cream transition-colors duration-150 mb-12 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-150">←</span>
            All projects
          </Link>

          {/* Header */}
          <div className="mb-10">
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-accent-light mb-4">
              {project.year}
            </p>
            <h1 className="font-serif italic text-cream mb-6 leading-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Tag key={tag} variant="accent">{tag}</Tag>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <CollapsibleText text={project.description} />
          </div>

          {/* Table of contents */}
          <nav aria-label="Page sections" className="mb-12 flex flex-wrap gap-2">
            {project.problem    && <a href="#problem"    className="text-[11px] font-mono tracking-wide text-gray-400 hover:text-accent-light border border-border hover:border-accent/40 rounded px-3 py-1.5 transition-colors duration-150">Problem</a>}
            {project.approach   && <a href="#approach"   className="text-[11px] font-mono tracking-wide text-gray-400 hover:text-accent-light border border-border hover:border-accent/40 rounded px-3 py-1.5 transition-colors duration-150">Approach</a>}
            {project.outcome    && <a href="#outcome"    className="text-[11px] font-mono tracking-wide text-gray-400 hover:text-accent-light border border-border hover:border-accent/40 rounded px-3 py-1.5 transition-colors duration-150">Outcome</a>}
            {project.challenges && <a href="#challenges" className="text-[11px] font-mono tracking-wide text-gray-400 hover:text-accent-light border border-border hover:border-accent/40 rounded px-3 py-1.5 transition-colors duration-150">Challenges</a>}
            {project.gallery    && <a href="#gallery"    className="text-[11px] font-mono tracking-wide text-gray-400 hover:text-accent-light border border-border hover:border-accent/40 rounded px-3 py-1.5 transition-colors duration-150">Gallery</a>}
            {project.techSpecs  && <a href="#specs"      className="text-[11px] font-mono tracking-wide text-gray-400 hover:text-accent-light border border-border hover:border-accent/40 rounded px-3 py-1.5 transition-colors duration-150">Specs</a>}
            {(project.pcbBoards || project.pcbDetails) && <a href="#pcb" className="text-[11px] font-mono tracking-wide text-gray-400 hover:text-accent-light border border-border hover:border-accent/40 rounded px-3 py-1.5 transition-colors duration-150">PCB Details</a>}
          </nav>

          {/* 3D Viewers */}
          {project.models && project.models.length > 0 ? (
            <div className={`mb-12 grid gap-4 ${project.models.length > 1 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
              {project.models.map((model) => (
                <div key={model.path} className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded">
                      {model.label}
                    </span>
                  </div>
                  <div className="h-[360px] w-full rounded-card overflow-hidden">
                    <Suspense fallback={<ViewerSkeleton />}>
                      <ModelViewer modelPath={model.path} className="w-full h-full rounded-none" />
                    </Suspense>
                  </div>
                </div>
              ))}
            </div>
          ) : project.modelPath ? (
            <div className="mb-12 h-[400px] lg:h-[500px] rounded-card overflow-hidden">
              <Suspense fallback={<ViewerSkeleton />}>
                <ModelViewer modelPath={project.modelPath} />
              </Suspense>
            </div>
          ) : null}


          {/* Case study — all sections as dropdowns */}
          <div className="space-y-3 text-gray-300">

            {project.problem && (
              <CollapsibleSection title="The Problem" defaultOpen>
                <p>{project.problem}</p>
              </CollapsibleSection>
            )}

            {project.approach && (
              <CollapsibleSection title="My Approach">
                <p>{project.approach}</p>
              </CollapsibleSection>
            )}

            {project.outcome && (
              <CollapsibleSection title="Outcome">
                <p className="text-cream">{project.outcome}</p>
              </CollapsibleSection>
            )}

            {project.challenges && project.challenges.length > 0 && (
              <CollapsibleSection title="Engineering Challenges Solved">
                <div className="space-y-4">
                  {project.challenges.map((c) => (
                    <div key={c.title} className="border border-border rounded-card p-4 bg-surface-2/40">
                      <p className="font-mono text-xs text-accent-light tracking-wide mb-2">{c.title}</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{c.detail}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {project.youtubeUrl && (
              <CollapsibleSection title="Demo">
                <div className="relative w-full aspect-video rounded-card overflow-hidden border border-border">
                  <iframe
                    src={project.youtubeUrl}
                    title="Project demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </CollapsibleSection>
            )}

            {project.gallery && project.gallery.length > 0 && (
              <CollapsibleSection title="Gallery">
                <GallerySection items={project.gallery} />
              </CollapsibleSection>
            )}

            {project.teamPhoto && (
              <CollapsibleSection title="Team">
                <figure className="space-y-3">
                  <div className="relative w-full rounded-card overflow-hidden border border-border">
                    <Image src={project.teamPhoto} alt="Project team" width={1200} height={800} className="w-full h-auto object-cover" />
                  </div>
                  {project.teamCaption && (
                    <figcaption className="text-xs font-mono text-gray-500 leading-relaxed">{project.teamCaption}</figcaption>
                  )}
                </figure>
              </CollapsibleSection>
            )}

            {(project.systemArchitecture || project.diagram) && (
              <CollapsibleSection title="System Architecture">
                {project.diagram && <DiagramViewer filePath={project.diagram} title="Full System Block Diagram" />}
                {project.systemArchitecture && <p className="mt-4 text-sm text-gray-300 leading-relaxed">{project.systemArchitecture}</p>}
              </CollapsibleSection>
            )}

            {project.techSpecs && project.techSpecs.length > 0 && (
              <CollapsibleSection title="Technical Specifications">
                <div className="border border-border rounded-card overflow-hidden">
                  {project.techSpecs.map((spec, i) => (
                    <div key={spec.label} className={`grid grid-cols-[auto_1fr] gap-6 px-5 py-3 ${i % 2 === 0 ? "bg-surface" : "bg-surface-2/40"}`}>
                      <span className="font-mono text-xs text-gray-500 whitespace-nowrap pt-0.5">{spec.label}</span>
                      <span className="text-sm text-gray-200">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {(project.pcbBoards || project.pcbDetails) && (
              <CollapsibleSection title="PCB Details">
                {project.pcbBoards ? (
                  <div className="space-y-4">
                    {project.pcbBoards.map((board) => (
                      <div key={board.label} className="border border-border rounded-card p-4 bg-surface-2/40">
                        <p className="font-mono text-xs text-accent-light tracking-wide mb-3">{board.label}</p>
                        <ul className="space-y-2">
                          {board.details.map((item, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-accent-light flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {project.pcbDetails!.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-accent-light flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </CollapsibleSection>
            )}
          </div>

          {/* Footer CTA */}
          <div className="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row gap-4">
            <Button href="/#projects" variant="outline">
              ← Back to projects
            </Button>
            <Button href="/#contact" variant="fill">
              Get in touch
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
