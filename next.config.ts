import type { NextConfig } from "next";

// PAGES_BASE_PATH is set only by the GitHub Pages workflow, because the site
// is served from /Ankit-s-Multi-step-form there. Locally it is empty.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
};

export default nextConfig;
