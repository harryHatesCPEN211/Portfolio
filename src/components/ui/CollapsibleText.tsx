"use client";

import { useState } from "react";

export function CollapsibleText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      <p
        className={`text-lg text-gray-200 leading-relaxed transition-all duration-300 ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {text}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-xs font-mono text-accent-light hover:text-cream tracking-wide transition-colors duration-150"
      >
        {expanded ? "↑ Show less" : "↓ Read more"}
      </button>
    </div>
  );
}
