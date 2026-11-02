"use client";

import { useState } from "react";
import Picture from "./Picture";
import type { Img } from "@/lib/types";

// Big picture + clickable thumbnails. Client component because of the "which one is selected" state.
export default function ProductGallery({ images }: { images: Img[] }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="gallery">
      <div className="gallery__main">
        <Picture image={images[selected]} sizes="(max-width: 900px) 100vw, 50vw" priority />
      </div>
      {images.length > 1 && (
        <div className="gallery__thumbs">
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              className={i === selected ? "is-active" : ""}
              onClick={() => setSelected(i)}
              aria-label={`Show picture ${i + 1}`}
            >
              <Picture image={image} sizes="100px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
