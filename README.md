# Cloudflare Image Optimization — Demo Frontend

A React + TypeScript SPA that demonstrates Cloudflare Image Optimization via a side-by-side comparison of an optimized image (served through a Cloudflare Worker) vs. the original.

## Features

- **Side-by-side comparison** — Optimized (Cloudflare Worker) vs. original image
- **URL input** — Paste any allowed image URL and load it instantly
- **"Try it out" demo** — One-click demo using sample NASA images
- **Cloudflare Worker integration** — Passes image URLs to a worker that applies resizing, quality reduction, and WebP conversion

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript (strict) |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 + shadcn/ui (radix-luma, neutral) |
| Icons | lucide-react |
| Font | Inter Variable (@fontsource-variable/inter) |
| Optimization | Cloudflare Worker (see `docs/worker_code.js`) |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `example.env` to `.env` and fill in your Cloudflare Worker URL:

```bash
cp example.env .env
```

```env
VITE_CLOUDFLARE_WORKER_BASE_URL="https://your-worker.your-subdomain.workers.dev"
```

### 3. Deploy the Cloudflare Worker

Use the reference implementation in `docs/worker_code.js` as your Worker script. It handles:
- Fetching images from allowed origins
- Applying Cloudflare Image Resizing (width, height, quality, WebP format)
- Caching optimized responses

Update the `ALLOWED_ORIGINS` list in the worker to match the domains you want to support.

### 4. Run the dev server

```bash
npm run dev
```

## Scripts

```bash
npm run dev       # Start dev server (HMR)
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_CLOUDFLARE_WORKER_BASE_URL` | Base URL of your deployed Cloudflare Worker |

## How It Works

1. User enters an image URL (must be from an allowed origin)
2. The app builds two URLs:
   - **Optimized:** `<WORKER_URL>?image=<url>&quality=90&width=400&height=300`
   - **Original:** the raw image URL
3. Both are displayed side-by-side using the `ImagePanel` component

## Project Structure

```
src/
  components/
    ImagePanel.tsx    # Image display with label and placeholder fallback
    ui/               # shadcn/ui components (do not hand-edit — use CLI)
  lib/
    utils.ts          # cn() + buildCfUrl() utilities
  App.tsx             # Main UI: URL input, comparison panels, demo button
docs/
  worker_code.js      # Reference Cloudflare Worker script
example.env           # Environment variable template
```

## Notes

- No backend — purely frontend
- shadcn/ui components are managed via the CLI: `npx shadcn@latest add <component>`
- Never hand-edit files in `src/components/ui/`
- Follows [SpaceDev](https://spacedev.io) internal standards
