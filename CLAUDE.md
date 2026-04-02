# cloudflare-image-optimization — Project Claude Configuration

## Project Overview

A React + TypeScript frontend project for demonstrating and working with Cloudflare Image Optimization (Cloudflare Images / Image Resizing). Built with Vite.

## Tech Stack

- **Framework:** React 19 + TypeScript (strict mode)
- **Build tool:** Vite 8
- **Styling:** Tailwind CSS (via `src/index.css`) + shadcn/ui (`radix-luma` style)
- **UI components:** shadcn/ui — `@/components/ui/`
- **Icons:** lucide-react
- **Utilities:** clsx + tailwind-merge via `cn()` in `@/lib/utils`
- **State:** TBD

## Project Structure

```
src/
  assets/             # Static assets
  components/
    ui/               # shadcn/ui components (auto-generated, do not hand-edit)
  lib/
    utils.ts          # cn() utility (clsx + tailwind-merge)
  App.tsx             # Root component
  App.css             # App-level styles
  index.css           # Global CSS + Tailwind + shadcn CSS variables
  main.tsx            # Entry point
public/               # Static public assets
components.json       # shadcn/ui config (style: radix-luma, baseColor: neutral)
```

## shadcn/ui

- **Style:** `radix-luma`, base color: `neutral`
- **RSC:** `false` (Vite SPA — no `"use client"` directives needed)
- **Aliases:** `@/components`, `@/components/ui`, `@/lib`, `@/hooks`
- **CSS variables:** enabled — customize in `src/index.css`
- Add components: `npx shadcn@latest add <component>`
- Never hand-edit files in `src/components/ui/` — use the CLI to update

## Local Development

```bash
npm run dev       # Start dev server
npm run build     # TypeScript check + Vite build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Notes

- Follows SpaceDev global standards (see global CLAUDE.md)
- No backend — frontend only
- shadcn skill is available at `.agents/skills/shadcn/` — use it when working with UI components
