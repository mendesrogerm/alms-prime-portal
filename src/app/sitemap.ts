import type { MetadataRoute } from "next";

const baseUrl = "https://www.almsprime.com.br";

const rotas = [
  {
    path: "",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/sobre",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/solucoes",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/sistemas",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/gestao-de-clientes",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/gestao",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/contato",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/politica-de-privacidade",
    changeFrequency: "yearly",
    priority: 0.4,
  },
  {
    path: "/termos-de-uso",
    changeFrequency: "yearly",
    priority: 0.4,
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return rotas.map((rota) => ({
    url: `${baseUrl}${rota.path}`,
    changeFrequency: rota.changeFrequency,
    priority: rota.priority,
  }));
}