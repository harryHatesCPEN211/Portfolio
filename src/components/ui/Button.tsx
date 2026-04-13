"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "fill" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

const base =
  "inline-flex items-center justify-center gap-2 font-mono tracking-wide transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  fill: "bg-accent text-cream border border-accent hover:bg-accent-light hover:border-accent-light active:scale-[0.98]",
  outline:
    "bg-transparent text-cream border border-border hover:border-accent-light hover:text-accent-light active:scale-[0.98]",
  ghost:
    "bg-transparent text-gray-400 hover:text-cream border border-transparent active:scale-[0.98]",
};

const sizes = {
  sm: "text-xs px-4 py-2 rounded",
  md: "text-sm px-6 py-3 rounded",
  lg: "text-sm px-8 py-4 rounded",
};

export function Button({
  children,
  className,
  variant = "fill",
  size = "md",
  href,
  external,
  disabled,
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
