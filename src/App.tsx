import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import ImagePanel from "./components/ImagePanel";
import { buildCfUrl } from "./lib/utils";

const moreImages = [
  "https://svs.gsfc.nasa.gov/vis/a020000/a020200/a020255/frames/3840x2160_16x9_60p/Shot53/Shot53_FINAL.00001.png",
  "https://svs.gsfc.nasa.gov/vis/a020000/a020200/a020255/frames/3840x2160_16x9_60p/Shot48/Shot48Frames/Shot48.00000.png",
  "https://svs.gsfc.nasa.gov/vis/a020000/a020200/a020255/frames/3840x2160_16x9_60p/Shot48/Shot48Frames/Shot48.00145.png",
  "https://svs.gsfc.nasa.gov/vis/a020000/a020200/a020255/frames/3840x2160_16x9_60p/Shot48/Shot48Frames/Shot48.00200.png",
  "https://svs.gsfc.nasa.gov/vis/a020000/a020200/a020255/frames/3840x2160_16x9_60p/Shot48/Shot48Frames/Shot48.00300.png",
  "https://svs.gsfc.nasa.gov/vis/a020000/a020200/a020255/frames/3840x2160_16x9_60p/Shot48/Shot48Frames/Shot48.00400.png",
  "https://svs.gsfc.nasa.gov/vis/a020000/a020200/a020255/frames/3840x2160_16x9_60p/Shot48/Shot48Frames/Shot48.00499.png",
];

const ALLOWED_ORIGINS = [
  "images.pexels.com",
  "stsaiintdev.blob.core.windows.net",
  "svs.gsfc.nasa.gov",
];

export default function App() {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [loadKey, setLoadKey] = useState(0);

  const handleLoad = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    setActiveUrl(trimmed);
    setLoadKey((k) => k + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLoad();
  };

  const handleTryItOut = () => {
    const randomImage =
      moreImages[Math.floor(Math.random() * moreImages.length)];
    setInputUrl(randomImage);
    setActiveUrl(randomImage);
    setLoadKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="border rounded-xl p-6 flex flex-col gap-4 bg-card shadow-sm">
          <div className="flex gap-0 flex-1 min-h-[380px]">
            <ImagePanel
              key={`optimized-${loadKey}`}
              label="with optimization"
              src={activeUrl ? buildCfUrl(activeUrl) : null}
              side="left"
            />
            <div className="w-px bg-border self-stretch mx-1" />
            <ImagePanel
              key={`original-${loadKey}`}
              label="without optimization"
              src={activeUrl}
              side="right"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Enter image URL"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-mono text-sm pr-9"
              />
            </div>
            <Button onClick={handleLoad} disabled={!inputUrl.trim()}>
              Load
            </Button>
          </div>
          <Button
            variant="ghost"
            className="text-xs text-muted-foreground text-left"
            onClick={handleTryItOut}
          >
            Try it out
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground text-center">
            Optimización de imágenes con Cloudflare atraves de un worker.
          </p>
          <p className="text-xs text-muted-foreground text-center">
            La request optimizada ocurre en el worker de Cloudflare, alojado en:
          </p>
          <p className="text-xs text-muted-foreground text-center">
            <code className="font-mono ">
              {import.meta.env.VITE_CLOUDFLARE_WORKER_BASE_URL}
            </code>
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Los hosts permitidos son:
            <br />
            <ul>
              {ALLOWED_ORIGINS.map((origin) => (
                <li key={origin}>{origin}</li>
              ))}
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
}
