"use client";

import { useState, useEffect } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
}

export function CollapsibleSection({ title, children, defaultOpen = false, id }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!id) return;
    const check = () => {
      if (window.location.hash === `#${id}`) setOpen(true);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [id]);

  return (
    <div id={id} className="border border-border rounded-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-surface hover:bg-surface-2/60 transition-colors duration-150 group"
        aria-expanded={open}
      >
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-gray-400 group-hover:text-cream transition-colors duration-150">
          {title}
        </span>
        <span className={`text-gray-500 text-sm transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ↓
        </span>
      </button>

      {open && (
        <div className="px-5 py-5 border-t border-border text-gray-300 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
