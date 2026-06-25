import type { MetadataRoute } from "next";

const baseUrl = "https://www.almsprime.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const rotas = [
    "",
    "/sobre",
    "/solucoes",
    "/sistemas",
    "/contato",
    "/cripto",
    "/fiscalizacao",
  ];

  return rotas.map((rota) => ({
    url: `${baseUrl}${rota}`,
    lastModified: new Date(),
    changeFrequency: rota === "" ? "weekly" : "monthly",
    priority: rota === "" ? 1 : 0.8,
  }));
}
