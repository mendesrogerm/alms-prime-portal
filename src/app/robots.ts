import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api",
        "/login",
        "/redefinir-senha",
        "/cripto",
        "/fiscalizacao",
      ],
    },
    sitemap: "https://www.almsprime.com.br/sitemap.xml",
  };
}