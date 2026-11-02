import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Contentful serves uploaded images from this host.
    remotePatterns: [{ protocol: "https", hostname: "images.ctfassets.net" }],
  },
};

export default nextConfig;
