import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ALMS Prime",
    short_name: "ALMS Prime",
    description:
      "Portal institucional da ALMS Prime para tecnologia, gestão, sistemas e soluções digitais.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#071b2d",
    theme_color: "#071b2d",
    icons: [
      {
        src: "/logo-alms-prime.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo-alms-prime.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
