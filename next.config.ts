import type { NextConfig } from "next";

const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  output: isPages ? "export" : undefined,
  basePath: isPages ? "/cindy-ml" : "",
  assetPrefix: isPages ? "/cindy-ml" : undefined,
  trailingSlash: isPages,
  images: { unoptimized: true },
};

export default nextConfig;
