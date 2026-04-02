import { cn } from "@/lib/utils";

interface ImagePanelProps {
  label: string;
  src: string | null;
  side: "left" | "right";
}

export default function ImagePanel({ label, src, side }: ImagePanelProps) {
  return (
    <div className="flex flex-col flex-1 min-w-0">
      <span className="text-xs text-muted-foreground text-center mb-2 font-mono tracking-wide">
        {label}
      </span>
      <div
        className={cn(
          "flex-1 flex items-center justify-center overflow-hidden bg-muted/30 relative",
          side === "left" ? "rounded-l-lg" : "rounded-r-lg",
        )}
      >
        {!src && (
          <span className="text-xs text-muted-foreground">No image loaded</span>
        )}
        {src && (
          <img src={src} alt={label} className="w-full h-full object-contain" />
        )}
      </div>
    </div>
  );
}
