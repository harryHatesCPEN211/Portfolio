import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { projects } from "@/data/projects";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ModelViewer } from "@/components/viewer/ModelViewer";
import { ViewerSkeleton } from "@/components/viewer/ViewerSkeleton";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  return {
    title: `${project.title} — Harry Nguyen`,
    description: project.shortDesc,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
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

          {/* 3D Viewer or image */}
          {project.modelPath && (
            <div className="mb-12 h-[400px] lg:h-[500px] rounded-card overflow-hidden">
              <Suspense fallback={<ViewerSkeleton />}>
                <ModelViewer modelPath={project.modelPath} />
              </Suspense>
            </div>
          )}

          {/* Case study */}
          <div className="space-y-12 text-gray-300 leading-relaxed">
            <p className="text-lg text-gray-200">{project.description}</p>

            {project.problem && (
              <section aria-labelledby="problem-heading">
                <h2
                  id="problem-heading"
                  className="font-mono text-xs tracking-[0.2em] uppercase text-gray-500 mb-4"
                >
                  The Problem
                </h2>
                <p>{project.problem}</p>
              </section>
            )}

            {project.approach && (
              <section aria-labelledby="approach-heading">
                <h2
                  id="approach-heading"
                  className="font-mono text-xs tracking-[0.2em] uppercase text-gray-500 mb-4"
                >
                  My Approach
                </h2>
                <p>{project.approach}</p>
              </section>
            )}

            {project.outcome && (
              <section aria-labelledby="outcome-heading">
                <h2
                  id="outcome-heading"
                  className="font-mono text-xs tracking-[0.2em] uppercase text-gray-500 mb-4"
                >
                  Outcome
                </h2>
                <p className="text-cream">{project.outcome}</p>
              </section>
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
