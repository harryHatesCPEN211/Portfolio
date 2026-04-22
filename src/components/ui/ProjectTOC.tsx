"use client";

import { useState, useEffect } from "react";

export interface TocItem {
  id: string;
  label: string;
}

export function ProjectTOC({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observers = items.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-10% 0px -60% 0px" }
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [items]);

  return (
    <nav aria-label="On this page">
      <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-600 mb-4">
        On this page
      </p>
      <ul className="space-y-2.5">
        {items.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block text-xs font-mono leading-snug transition-colors duration-150 ${
                active === id
                  ? "text-accent-light"
                  : "text-gray-500 hover:text-cream"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
