"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

const socials = [
  {
    label: "Email",
    value: "harry@example.com",
    href: "mailto:harry@example.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/harrynguyen",
    href: "https://linkedin.com/in/harrynguyen",
  },
];

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputBase =
    "w-full bg-surface border border-border rounded px-4 py-3 text-sm font-mono text-cream placeholder:text-gray-600 focus:outline-none focus:border-accent-light transition-colors duration-150";

  return (
    <section
      id="contact"
      className="py-32 px-6 lg:px-12 border-t border-border"
      aria-label="Contact"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left */}
          <div>
            <SectionHeader label="Contact" title="Let's work together" />

            <p className="text-gray-300 leading-relaxed mb-10 -mt-4">
              I&apos;m currently open to co-op and full-time roles in embedded
              systems, hardware engineering, and robotics. If you have a project
              or opportunity, I&apos;d love to hear about it.
            </p>

            <ul className="space-y-6" role="list">
              {socials.map((s) => (
                <li key={s.label}>
                  <p className="text-xs font-mono tracking-[0.2em] uppercase text-gray-500 mb-1">
                    {s.label}
                  </p>
                  <a
                    href={s.href}
                    className="text-sm font-mono text-cream hover:text-accent-light transition-colors duration-150"
                    {...(s.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {s.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
              aria-label="Contact form"
            >
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-mono tracking-wide text-gray-400 mb-2"
                >
                  Name <span aria-hidden="true" className="text-accent-light">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={inputBase}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-mono tracking-wide text-gray-400 mb-2"
                >
                  Email <span aria-hidden="true" className="text-accent-light">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputBase}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-mono tracking-wide text-gray-400 mb-2"
                >
                  Message <span aria-hidden="true" className="text-accent-light">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="What's on your mind?"
                  className={cn(inputBase, "resize-none")}
                />
              </div>

              <Button
                type="submit"
                variant="fill"
                size="lg"
                disabled={status === "loading"}
                className="w-full"
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border border-cream/40 border-t-cream rounded-full animate-spin" />
                    Sending…
                  </span>
                ) : (
                  "Send message"
                )}
              </Button>

              {/* Feedback */}
              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-mono text-accent-light text-center"
                  role="status"
                >
                  Message sent — I&apos;ll get back to you soon.
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-mono text-red-400 text-center"
                  role="alert"
                >
                  Something went wrong. Try emailing directly instead.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
