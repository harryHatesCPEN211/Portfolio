import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Vercel / any CDN
  // output: "export",  // Uncomment when ready to deploy statically

  // Allow images from any domain if needed later
  images: {
    remotePatterns: [],
  },

  // Required for React Three Fiber
  transpilePackages: ["three"],
};

export default nextConfig;
