export type PortalAccent =
  | "blue"
  | "green"
  | "cyan"
  | "violet"
  | "orange";

export type PortalCategory = {
  code: string;
  title: string;
  description: string;
  href: string;
  accent: PortalAccent;
};

export type PortalProject = {
  name: string;
  category: string;
  description: string;
  href: string;
  status: string;
  accent: PortalAccent;
  external?: boolean;
  features: string[];
};

export type PortalEditorialItem = {
  category: string;
  title: string;
  description: string;
  status: string;
  accent: PortalAccent;
};

export const portalCategories: PortalCategory[] = [
  {
    code: "01",
    title: "Sistemas e soluções",
    description:
      "Ferramentas digitais para organizar clientes, processos, dados e operações.",
    href: "#projetos",
    accent: "blue",
  },
  {
    code: "02",
    title: "Projetos ALMS",
    description:
      "Conheça plataformas próprias, iniciativas em evolução e soluções aplicadas.",
    href: "#projetos",
    accent: "green",
  },
  {
    code: "03",
    title: "ALMS Academy",
    description:
      "Conteúdos práticos sobre tecnologia, inteligência artificial e produtividade.",
    href: "#academy",
    accent: "violet",
  },
  {
    code: "04",
    title: "Produtos digitais",
    description:
      "Cursos, e-books, guias e materiais desenvolvidos para aplicação prática.",
    href: "#produtos",
    accent: "orange",
  },
  {
    code: "05",
    title: "Conteúdo e novidades",
    description:
      "Publicações sobre tecnologia aplicada, gestão e evolução dos projetos.",
    href: "#novidades",
    accent: "cyan",
  },
  {
    code: "06",
    title: "Atendimento",
    description:
      "Fale com a equipe para conhecer uma solução ou apresentar uma necessidade.",
    href: "#contato",
    accent: "blue",
  },
];

export const portalProjects: PortalProject[] = [
  {
    name: "Gestão de Clientes",
    category: "Gestão comercial",
    description:
      "Sistema para controlar clientes, testes, assinaturas, vencimentos, planos, servidores, financeiro e atendimento.",
    href: "/gestao-de-clientes",
    status: "Solução disponível",
    accent: "blue",
    features: [
      "Controle comercial",
      "Financeiro integrado",
      "Histórico de atendimento",
    ],
  },
  {
    name: "Observatório ODS",
    category: "Dados e políticas públicas",
    description:
      "Portal para indicadores, fontes, séries históricas, análises e acompanhamento dos Objetivos de Desenvolvimento Sustentável.",
    href: "https://observatorio-ods-santana.vercel.app",
    status: "Projeto publicado",
    accent: "green",
    external: true,
    features: [
      "Indicadores por ODS",
      "Catálogo de fontes",
      "Painel executivo",
    ],
  },
  {
    name: "Bolão ALMS Prime",
    category: "Eventos e comunidades",
    description:
      "Plataforma para criação e gestão de bolões, participantes, pagamentos, rankings, resultados e repasses.",
    href: "https://bolao.almsprime.com.br",
    status: "Projeto em evolução",
    accent: "orange",
    external: true,
    features: [
      "Gestão de participantes",
      "Classificação automática",
      "Controle financeiro",
    ],
  },
  {
    name: "Fiscalização SisGep",
    category: "Operação e controle",
    description:
      "Ferramenta interna para acompanhamento de processos, mapas, setores, usuários e atividades de fiscalização.",
    href: "/fiscalizacao",
    status: "Módulo interno",
    accent: "cyan",
    features: [
      "Painel operacional",
      "Mapas e setores",
      "Relatórios de processos",
    ],
  },
  {
    name: "ALMS Prime Cripto",
    category: "Dados e investimentos",
    description:
      "Painel interno para acompanhamento de carteira, ciclos, transações, gráficos, notícias e sentimento de mercado.",
    href: "/cripto",
    status: "Módulo interno",
    accent: "violet",
    features: [
      "Carteira consolidada",
      "Análise de ciclos",
      "Notícias e sentimento",
    ],
  },
];

export const portalEditorialItems: PortalEditorialItem[] = [
  {
    category: "Tecnologia aplicada",
    title: "Inteligência artificial com foco em uso real",
    description:
      "Conteúdos sobre ferramentas, automações e formas práticas de incorporar IA ao trabalho e aos negócios.",
    status: "Conteúdo em preparação",
    accent: "blue",
  },
  {
    category: "Gestão e produtividade",
    title: "Processos mais claros e operações mais organizadas",
    description:
      "Materiais sobre organização, controle, indicadores, atendimento e evolução de processos.",
    status: "Conteúdo em preparação",
    accent: "green",
  },
  {
    category: "Bastidores dos projetos",
    title: "Como as soluções da ALMS PRIME são construídas",
    description:
      "Atualizações sobre desenvolvimento, decisões de produto, melhorias e novas funcionalidades.",
    status: "Conteúdo em preparação",
    accent: "violet",
  },
];