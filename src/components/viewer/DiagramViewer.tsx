"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface DiagramViewerProps {
  filePath: string;
  title?: string;
}

export function DiagramViewer({ filePath, title = "Full System Block Diagram" }: DiagramViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [xml, setXml] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Fetch the .drawio file, then strip it down to only the first diagram page
  useEffect(() => {
    fetch(filePath)
      .then((r) => r.text())
      .then((raw) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(raw, "text/xml");
        const diagrams = doc.querySelectorAll("diagram");
        // Remove all pages except the first
        diagrams.forEach((d, i) => { if (i > 0) d.remove(); });
        setXml(new XMLSerializer().serializeToString(doc));
      })
      .catch(() => setXml(null));
  }, [filePath]);

  // Listen for the draw.io iframe "init" event, then send XML via postMessage
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (!iframeRef.current) return;
      if (e.origin !== "https://embed.diagrams.net") return;

      try {
        const msg = JSON.parse(e.data);

        if (msg.event === "init" && xml) {
          iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ action: "load", xml, page: 0 }),
            "https://embed.diagrams.net"
          );
          setReady(true);
        }

        if (msg.event === "load") {
          setLoaded(true);
          // Zoom in enough that the diagram always overflows the viewport, enabling panning
          iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ action: "zoom", scale: 3 }),
            "https://embed.diagrams.net"
          );
        }
      } catch {
        // ignore non-JSON messages
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [xml]);

  return (
    <section aria-labelledby="diagram-heading" className="mb-12">
      <div className="flex items-center justify-end mb-3">
        {loaded && (
          <span className="text-[10px] font-mono text-gray-600 tracking-wide mr-3">
            scroll to zoom · drag to pan
          </span>
        )}
        <button
          onClick={toggleFullscreen}
          className="text-[10px] font-mono text-accent-light hover:text-cream transition-colors duration-150 tracking-wide border border-accent/30 hover:border-accent-light/50 px-2.5 py-1 rounded"
        >
          {isFullscreen ? "↙ Exit" : "↗ Fullscreen"}
        </button>
      </div>

      <div
        ref={containerRef}
        className={`relative rounded-card overflow-hidden border border-border bg-surface ${
          isFullscreen ? "w-full h-full" : "w-full h-[600px]"
        }`}
      >
        {/* Loading state */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <span className="text-xs font-mono text-gray-600 animate-pulse">
              {!xml ? "Fetching diagram…" : !ready ? "Initialising viewer…" : "Rendering…"}
            </span>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src="https://embed.diagrams.net/?embed=1&spin=0&proto=json&ui=dark&noSaveBtn=1&noExitBtn=1&chrome=0&toolbar=0&nav=0&border=20"
          className={`w-full h-full transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          title={title}
          allow="fullscreen"
        />

      </div>
    </section>
  );
}
