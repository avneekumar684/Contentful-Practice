"use client";

// Tells next/image to use Contentful's own Images API instead of Next's image optimizer.
// Contentful resizes and converts the picture on its CDN when we add query parameters:
//   w = width in pixels, q = quality, fm = format (webp is much smaller than jpg)
export default function contentfulLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return `${src}?w=${width}&q=${quality ?? 80}&fm=webp`;
}
