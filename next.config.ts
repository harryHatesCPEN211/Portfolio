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

  // CORS headers so viewer.diagrams.net can fetch .drawio files from both localhost and production
  async headers() {
    return [
      {
        source: "/models/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
};

export default nextConfig;
