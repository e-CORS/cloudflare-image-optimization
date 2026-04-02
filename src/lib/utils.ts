import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildCfUrl(imageUrl: string) {
  const encodedImageUrl = encodeURIComponent(imageUrl);
  return `${import.meta.env.VITE_CLOUDFLARE_WORKER_BASE_URL}/?image=${encodedImageUrl}&quality=90&width=400&height=300`;
}

export function buildCfUrlPassthrough(imageUrl: string) {
  const base = "https://image-optimizer.ecorrales.workers.dev/";
  const params = new URLSearchParams({ image: imageUrl });
  return `${base}?${params.toString()}`;
}
