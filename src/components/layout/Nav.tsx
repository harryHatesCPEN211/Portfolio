"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Active section tracking
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-black/90 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        )}
      >
        <nav
          className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-serif italic text-lg text-cream hover:text-accent-light transition-colors duration-150"
          >
            HN
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "text-sm font-mono tracking-wide transition-colors duration-150 relative group",
                    active === link.href.slice(1)
                      ? "text-cream"
                      : "text-gray-400 hover:text-cream"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px bg-accent-light transition-all duration-200",
                      active === link.href.slice(1)
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 cursor-pointer"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className={cn(
                "block h-px bg-cream transition-all duration-200 origin-center",
                menuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"
              )}
            />
            <span
              className={cn(
                "block h-px bg-cream transition-all duration-200",
                menuOpen ? "opacity-0 w-0" : "w-4 opacity-100"
              )}
            />
            <span
              className={cn(
                "block h-px bg-cream transition-all duration-200 origin-center",
                menuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-6"
              )}
            />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-md flex flex-col items-center justify-center md:hidden"
          >
            <ul className="flex flex-col items-center gap-8" role="list">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                >
                  <a
                    href={link.href}
                    className="text-3xl font-serif italic text-cream hover:text-accent-light transition-colors duration-150"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
