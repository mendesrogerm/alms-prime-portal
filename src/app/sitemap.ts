import type { MetadataRoute } from "next";

const baseUrl = "https://www.almsprime.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const rotas = [
    "",
    "/sobre",
    "/solucoes",
    "/sistemas",
    "/gestao-de-clientes",
    "/gestao",
    "/contato",
    "/politica-de-privacidade",
    "/termos-de-uso",
    "/cripto",
    "/fiscalizacao",
  ];

  return rotas.map((rota) => ({
    url: `${baseUrl}${rota}`,
    lastModified: new Date(),
    changeFrequency: rota === "" ? "weekly" : "monthly",
    priority:
      rota === "" ? 1 : rota === "/gestao-de-clientes" ? 0.9 : rota === "/gestao" ? 0.7 : 0.8,
  }));
}
