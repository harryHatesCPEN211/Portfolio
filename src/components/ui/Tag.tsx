"use client";

import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent";
}

export function Tag({ children, className, variant = "default" }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-0.5 text-xs font-mono tracking-wide rounded border",
        variant === "default" &&
          "border-border text-gray-400 bg-surface",
        variant === "accent" &&
          "border-accent-light/40 text-accent-light bg-accent/20",
        className
      )}
    >
      {children}
    </span>
  );
}
