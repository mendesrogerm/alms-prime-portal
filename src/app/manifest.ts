import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ALMS PRIME",
    short_name: "ALMS PRIME",
    description:
      "Portal de sistemas, projetos, tecnologia, gestão, conhecimento e produtos digitais da ALMS PRIME.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/logo-alms-prime-oficial.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo-alms-prime-oficial.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}