import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/paths";

const config: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  images: { unoptimized: true },
  // basePath also prefixes Next's JS/CSS/font bundles. No CDN assetPrefix needed.
};
export default config;
