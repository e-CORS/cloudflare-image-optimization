import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClipboardIcon } from "lucide-react";

import ImagePanel from "./components/ImagePanel";
import { buildCfUrl } from "./lib/utils";

export default function App() {
  const [inputUrl, setInputUrl] = useState("");
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
              <button
                type="button"
                title="Paste from clipboard"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => {
                  void navigator.clipboard.readText().then(setInputUrl);
                }}
              >
                <ClipboardIcon className="size-4" />
              </button>
            </div>
            <Button onClick={handleLoad} disabled={!inputUrl.trim()}>
              Load
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Cloudflare image optimization requires deployment behind a Cloudflare
          zone with Image Resizing enabled.
        </p>
        <p className="text-xs text-muted-foreground text-center">
          The optimized request is routed through{" "}
          <code className="font-mono">{buildCfUrl("")}</code>.
        </p>
      </div>
    </div>
  );
}
