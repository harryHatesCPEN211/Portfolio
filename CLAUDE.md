# CLAUDE.md — Portfolio Project Living Spec

> Last updated: 2026-04-12
> This file is the single source of truth for project goals, architecture, decisions, and environment setup.
> Update after every major change.

---

## 1. Project Goals

Rebuild Harry Nguyen's personal portfolio from a monolithic 4.8 MB HTML file into a modern, maintainable, performant static site.

**Primary goals:**
- Fast load time (sub 2s on average connection)
- Easy content updates (text, projects, images, 3D models)
- Professional, polished design
- First-class 3D model viewer
- Functional contact form
- SEO + accessibility compliant

---

## 2. Constraints

- One person maintains this (Harry)
- Projects, images, and 3D models will change frequently
- No unnecessary complexity — practical over clever
- Must work as a static site (no server required)

---

## 3. Global Dev Environment

### Status

| Tool | Status | Version | Notes |
|------|--------|---------|-------|
| Node.js | INSTALLED | v24.14.1 | Current release (not LTS v22) — fine for this project |
| npm | INSTALLED | 11.12.1 | Comes with Node, updated to latest |
| Python | INSTALLED | 3.11.9 | Microsoft Store install — see warning below |
| pip | INSTALLED | 24.0 | Works, tied to Python 3.11 |
| Git | INSTALLED | 2.53.0 | Located at C:\Program Files\Git\ |
| pnpm | INSTALLED | 10.33.0 | Installed globally via npm |
| yarn | SKIP | — | Not needed, pnpm preferred |

### Python Warning
Python is installed via **Microsoft Store** (`C:\Users\nguye\AppData\Local\Microsoft\WindowsApps\python.exe`).
This sometimes causes PATH conflicts. It works for now but prefer the official python.org installer for full control.
No action needed unless issues arise.

### Git Location
`C:\Program Files\Git\mingw64\bin\git.exe` — standard Git for Windows install. Good.

---

## 4. Chosen Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14 (App Router, static export) | Image optimization, routing, zero backend needed |
| Styling | Tailwind CSS v4 | Utility-first, no naming overhead, excellent for solo projects |
| 3D Viewer | React Three Fiber + @react-three/drei | Declarative Three.js in React, built-in controls & loaders |
| Model Format | GLB (binary GLTF) | Single binary, swappable, loaded from /public/models/ |
| Animations | Framer Motion | Scroll fade-ins, hover states, page transitions |
| Content | Local TypeScript data files (/data/*.ts) | No CMS needed for 4 projects — typed and easy to edit |
| Contact Form | Resend (API route) | Real email delivery, free tier, clean API |
| Package Manager | pnpm | Faster than npm, disk-efficient |
| Deployment | Vercel (free tier) | Zero-config for Next.js, CDN, HTTPS |

---

## 5. Architecture Decisions

### Decision Log

| # | Decision | Reasoning |
|---|----------|-----------|
| 1 | Next.js over plain React | Static export + image optimization worth the 0 extra complexity |
| 2 | Tailwind v4 over CSS Modules | Less maintenance overhead for a one-person project |
| 3 | Local TS data files over CMS | 4 projects = no CMS justification. Types provide all validation needed |
| 4 | React Three Fiber over raw Three.js | Declarative, composable, @react-three/drei covers 80% of use cases |
| 5 | Resend over Formspree | More control, cleaner API, real email delivery |
| 6 | Remove base64 embedding | 3D model → public/models/motor-driver-pcb.glb; photo → public/images/profile.jpg |
| 7 | Keep Skills section | Redesign as visual proficiency grid (not a bullet list) |
| 8 | Add individual project pages | /projects/[slug] — full case study: problem → approach → outcome |

---

## 6. UI/UX Principles

1. **Confident minimalism** — every element earns its place
2. **Typography first** — DM Serif Display (headings) + DM Mono (body) — non-negotiable
3. **Color discipline** — dark teal (#1a3a2a) accent, cream (#f9f7f3) bg, near-black (#0f0f0f) base
4. **Scroll-driven reveals** — sections animate in, never static on load
5. **3D as hero** — the PCB viewer is a differentiator; it gets visual prominence
6. **Mobile-first interactions** — hamburger nav, touch-ready 3D controls, reduced pixel ratio on mobile
7. **Context over claims** — skills shown as tags on project cards, not standalone lists

---

## 7. 3D Viewer Plan

- **Library:** React Three Fiber + @react-three/drei
- **Model file:** GLB in `/public/models/`
- **Loading:** `useGLTF` with React `<Suspense>` + skeleton fallback
- **Controls:** `<OrbitControls>` with auto-rotate when idle, damping enabled
- **Lighting:** Green ambient + white key + greenish fill (matches current aesthetic)
- **Background:** `#0a0f0b` (dark PCB environment)
- **Mobile:** `Math.min(devicePixelRatio, 1)` pixel ratio cap
- **Swappability:** Add new model = drop `.glb` in `/public/models/`, reference in `projects.ts`

---

## 8. Folder Structure (target)

```
C:\Portfolio\
├── public/
│   ├── models/motor-driver-pcb.glb
│   ├── images/profile.jpg
│   ├── images/projects/[project-name].jpg
│   └── resume.pdf
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── projects/[slug]/page.tsx
│   ├── components/
│   │   ├── layout/Nav.tsx, Footer.tsx
│   │   ├── sections/Hero.tsx, About.tsx, Projects.tsx, Skills.tsx, Resume.tsx, Contact.tsx
│   │   ├── ui/Button.tsx, Tag.tsx, ProjectCard.tsx, SectionHeader.tsx
│   │   └── viewer/ModelViewer.tsx, PCBModel.tsx, ViewerControls.tsx, ViewerOverlay.tsx
│   ├── data/projects.ts, skills.ts
│   ├── lib/utils.ts
│   └── types/index.ts
├── CLAUDE.md
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 9. Migration Progress

| Milestone | Status | Notes |
|-----------|--------|-------|
| Environment setup | DONE | Node v24.14.1, npm 11.12.1, pnpm 10.33.0 |
| CLAUDE.md created | DONE | This file |
| Scaffold Next.js project | DONE | Next.js 16, Tailwind v4, TypeScript, App Router |
| Extract assets from HTML | DONE | GLB at public/models/motor-driver-pcb.glb (3.08 MB). Profile photo still needed at public/images/profile.jpg |
| Build layout + nav | DONE | Nav.tsx with mobile hamburger + active section tracking, Footer.tsx |
| Build all sections | DONE | Hero, About, Projects, Skills, Resume, Contact |
| Build 3D viewer components | DONE | ModelViewer, PCBModel, ViewerOverlay, ViewerSkeleton |
| Build project pages | DONE | /projects/[slug] — full case study layout |
| Wire up contact form (Resend) | PARTIAL | API route done. Needs RESEND_API_KEY + CONTACT_EMAIL in .env.local |
| QA + accessibility | PENDING | — |
| Deploy to Vercel | PENDING | Push to GitHub → connect Vercel |

## 10. Remaining Tasks

1. **Add profile photo** → save to `public/images/profile.jpg`
2. **Add project images** → save to `public/images/projects/[name].jpg`
3. **Add resume PDF** → save to `public/resume.pdf`
4. **Set up Resend** → copy `.env.local.example` to `.env.local`, add real API key
5. **Update contact email** → edit `src/components/sections/Contact.tsx` socials array
6. **Deploy** → push to GitHub, connect to Vercel, add env vars in Vercel dashboard

---

## 10. Environment Setup Commands

```bash
# Verify Node after install
node --version     # expect: v22.x.x

# Verify npm after install
npm --version      # expect: 10.x.x

# Install pnpm globally (after Node)
npm install -g pnpm

# Verify pnpm
pnpm --version     # expect: 9.x.x or 10.x.x

# Verify Git (already installed)
git --version      # expect: 2.53.0

# Verify Python (already installed)
python --version   # expect: 3.11.9
```

---

## 11. Key Tradeoffs

| Tradeoff | Decision | Why |
|----------|----------|-----|
| Next.js complexity vs Vite simplicity | Next.js | Image optimization + static export ergonomics outweigh the tiny overhead |
| CMS vs local files | Local TS files | Harry updates content directly — typed files are as good as a CMS for this scale |
| GLB via fetch vs embedded base64 | GLB file | 4.4 MB base64 is a cardinal sin — a GLB loads over HTTP with proper caching |
| Resend (API key) vs Formspree (no setup) | Resend | One-time setup for permanent control over email delivery |
