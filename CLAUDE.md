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
  assets/             # Static assets (hero.png, react.svg, vite.svg)
  components/
    ImagePanel.tsx    # Side-by-side image display component (label + image or placeholder)
    ui/               # shadcn/ui components (auto-generated, do not hand-edit)
      badge.tsx
      button.tsx
      input.tsx
  lib/
    utils.ts          # cn() utility (clsx + tailwind-merge) + buildCfUrl() helper
  App.tsx             # Root component — URL input, image comparison UI, demo button
  App.css             # App-level styles (layout sections)
  index.css           # Global CSS + Tailwind + shadcn CSS variables
  main.tsx            # Entry point
docs/
  worker_code.js      # Example Cloudflare Worker script (reference only, not imported)
public/               # Static public assets
example.env           # Example environment variables
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

## Cloudflare Worker Integration

- The app expects a `VITE_CLOUDFLARE_WORKER_BASE_URL` env var pointing to a deployed Cloudflare Worker
- `buildCfUrl(workerBase, imageUrl)` in `src/lib/utils.ts` constructs the optimized image URL with query params: `image`, `quality=90`, `width=400`, `height=300`
- The Worker reference implementation lives in `docs/worker_code.js` — it is not imported by the frontend, it is a standalone Cloudflare Worker script
- Allowed image origins are enforced in the Worker (not the frontend): `images.pexels.com`, `stsaiintdev.blob.core.windows.net`, `svs.gsfc.nasa.gov`

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_CLOUDFLARE_WORKER_BASE_URL` | Base URL of the deployed Cloudflare Worker |

Copy `example.env` → `.env` to get started.

## Notes

- Follows SpaceDev global standards (see global CLAUDE.md)
- No backend — frontend only
- shadcn skill is available at `.agents/skills/shadcn/` — use it when working with UI components
