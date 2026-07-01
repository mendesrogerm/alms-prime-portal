import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/redefinir-senha", "/api"],
    },
    sitemap: "https://www.almsprime.com.br/sitemap.xml",
  };
}
