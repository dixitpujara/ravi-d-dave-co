import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "./config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Chartered Accountants`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#16294a",
    theme_color: "#16294a",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
