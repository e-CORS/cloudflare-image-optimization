const cache = caches.default;

const DEBUG = false;
const log = (...args) => DEBUG && console.log(...args);

const ALLOWED_ORIGINS = [
  "images.pexels.com",
  "stsaiintdev.blob.core.windows.net",
  "svs.gsfc.nasa.gov",
];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

function generateCacheKey(workerRequestUrl, imageURL, cfOptions) {
  const img = new URL(imageURL);
  const keyUrl = new URL(workerRequestUrl);
  keyUrl.searchParams.set("image", img.toString());
  if (cfOptions.width)
    keyUrl.searchParams.set("width", String(cfOptions.width));
  if (cfOptions.height)
    keyUrl.searchParams.set("height", String(cfOptions.height));
  if (cfOptions.format) keyUrl.searchParams.set("format", cfOptions.format);
  keyUrl.searchParams.set("quality", String(cfOptions.quality ?? 85));
  return keyUrl.toString();
}

function parsePositiveInt(value, fieldName) {
  const n = parseInt(value, 10);
  if (isNaN(n) || n <= 0)
    throw new RangeError(`Invalid ${fieldName}: must be a positive integer`);
  return n;
}

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);

      // Extract and validate image URL param
      const imageURL = url.searchParams.get("image");
      if (!imageURL) {
        return new Response('Missing "image" query parameter.', {
          status: 400,
        });
      }

      // Decode and sanitize the image URL
      let decodedImageURL;
      try {
        decodedImageURL = decodeURIComponent(imageURL).replace(
          /^['"]|['"]$/g,
          "",
        );
      } catch {
        return new Response("Malformed image URL.", { status: 400 });
      }

      log("Decoded image URL:", decodedImageURL);

      // Validate origin against allowlist
      let parsedImage;
      try {
        parsedImage = new URL(decodedImageURL);
      } catch {
        return new Response("Invalid image URL.", { status: 400 });
      }

      if (
        !ALLOWED_ORIGINS.some(
          (o) =>
            parsedImage.hostname === o ||
            parsedImage.hostname.endsWith(`.${o}`),
        )
      ) {
        return new Response("Forbidden image origin.", { status: 403 });
      }

      // Parse and validate transformation params
      let cfImageOptions;
      try {
        cfImageOptions = {
          width: url.searchParams.has("width")
            ? parsePositiveInt(url.searchParams.get("width"), "width")
            : undefined,
          height: url.searchParams.has("height")
            ? parsePositiveInt(url.searchParams.get("height"), "height")
            : undefined,
          quality: url.searchParams.has("quality")
            ? parsePositiveInt(url.searchParams.get("quality"), "quality")
            : 85,
        };
      } catch (e) {
        return new Response(e.message, { status: 400 });
      }

      // Check cache
      const cacheKeyUrl = generateCacheKey(
        request.url,
        decodedImageURL,
        cfImageOptions,
      );
      const cacheKey = new Request(cacheKeyUrl, { method: "GET" });

      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        log("Serving from cache");
        return new Response(cachedResponse.body, {
          headers: {
            ...Object.fromEntries(cachedResponse.headers),
            ...CORS_HEADERS,
          },
        });
      }

      log("Cache miss, fetching image...");

      // Fetch with Cloudflare Image Resizing
      const originalImageResponse = await fetch(decodedImageURL, {
        cf: {
          image: { ...cfImageOptions, format: "webp" },
        },
      });

      if (!originalImageResponse.ok) {
        throw new Error(
          `Failed to fetch image: ${originalImageResponse.status} ${originalImageResponse.statusText}`,
        );
      }

      // Build response with correct Content-Type and cache headers
      const contentType =
        originalImageResponse.headers.get("Content-Type") || "image/jpeg";
      const response = new Response(originalImageResponse.body, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000",
          ...CORS_HEADERS,
        },
      });

      // Store in cache
      await cache.put(cacheKey, response.clone());
      log("Image cached successfully");

      return response;
    } catch (error) {
      console.error("Unhandled error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
