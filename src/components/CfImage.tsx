import Image from "next/image";
import { assetUrl } from "@/lib/contentful";
import type { CfAsset } from "@/lib/types";

// Shows a Contentful image with next/image, using the real size stored in Contentful.
export default function CfImage({
  asset,
  className,
  sizes,
  priority,
}: {
  asset?: CfAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const src = assetUrl(asset);
  if (!src) return null;
  const size = asset?.fields.file?.details?.image;

  return (
    <Image
      src={src}
      alt={asset?.fields.title ?? ""}
      width={size?.width ?? 1200}
      height={size?.height ?? 600}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
