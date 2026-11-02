import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Use Contentful's Images API (see src/lib/contentful-image-loader.ts).
    loader: "custom",
    loaderFile: "./src/lib/contentful-image-loader.ts",
  },
};

export default nextConfig;
