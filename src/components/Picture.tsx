import Image from "next/image";
import type { Img } from "@/lib/types";

// Same idea as CfImage, but for images that came from the GraphQL API
// (GraphQL gives { url, width, height, title } instead of a full asset object).
export default function Picture({
  image,
  className,
  sizes,
  priority,
}: {
  image?: Img;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!image) return <div className={`picture-placeholder ${className ?? ""}`} aria-hidden />;
  return (
    <Image
      src={image.url}
      alt={image.title ?? ""}
      width={image.width}
      height={image.height}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
