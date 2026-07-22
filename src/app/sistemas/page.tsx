import type { Metadata } from "next";
import { PageHero } from "../../components/PageHero";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";


export const metadata: Metadata = {
  title: "Sistemas ALMS Prime",
  description:
    "Conheça os sistemas, módulos e projetos digitais da ALMS Prime para gestão, operação, controle e crescimento.",
};
const sistemas = [
  {
    nome: "Gestão de Clientes",
    categoria: "Sistema comercial",
    status: "Em produção",
    descricao:
      "Sistema para organizar clientes, testes, planos, vencimentos, servidores, financeiro e mensagens comerciais.",
    recursos: [
      "Cadastro de clientes",
      "Controle de testes",
      "Planos e assinaturas",
      "Financeiro simples",
      "Mensagens prontas",
    ],
    href: "/gestao-de-clientes",
    cta: "Conhecer solução",
    externo: false,
    destaque: true,
  },
  {
    nome: "Bolão Copa",
    categoria: "Projeto esportivo",
    status: "Em produção",
    descricao:
      "Plataforma para bolões, participantes, pagamentos, palpites, resultados, auditoria e gestão administrativa.",
    recursos: [
      "Cadastro de bolões",
      "Participantes",
      "Pagamentos",
      "Resultados",
      "Painel administrativo",
    ],
    href: "https://bolao.almsprime.com.br",
    cta: "Acessar projeto",
    externo: false,
    destaque: true,
  },
  {
    nome: "ALMS Prime Cripto",
    categoria: "Dashboard financeiro",
    status: "Disponível no portal",
    descricao:
      "Área experimental para acompanhamento de informações, ativos e funcionalidades relacionadas ao ambiente cripto.",
    recursos: [
      "Painel interno",
      "Dados organizados",
      "Acesso pelo portal",
      "Base para evolução",
    ],
    href: "/cripto",
    cta: "Ver módulo",
    externo: false,
    destaque: false,
  },
  {
    nome: "Fiscalização SisGep",
    categoria: "Ferramenta operacional",
    status: "Disponível no portal",
    descricao:
      "Módulo voltado para consulta, organização e apoio operacional em rotinas de fiscalização e controle.",
    recursos: [
      "Consulta estruturada",
      "Apoio operacional",
      "Tela dedicada",
      "Integração ao portal",
    ],
    href: "/fiscalizacao",
    cta: "Ver módulo",
    externo: false,
    destaque: false,
  },
  {
    nome: "Gestão Comercial Simples",
    categoria: "Sistema de gestão",
    status: "Em preparação",
    descricao:
      "Sistema para gestão comercial, financeiro simples, auditoria, relatórios e módulos opcionais conforme necessidade do cliente.",
    recursos: [
      "Gestão comercial",
      "Financeiro simples",
      "Auditoria",
      "Relatórios",
      "Módulos opcionais",
    ],
    href: "https://wa.me/5511964073364?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20sistema%20Gest%C3%A3o%20Comercial%20Simples.",
    cta: "Consultar disponibilidade",
    externo: false,
    destaque: false,
  },
  {
    nome: "Projetos sob medida",
    categoria: "Desenvolvimento personalizado",
    status: "Sob demanda",
    descricao:
      "Criação de portais, sistemas, automações e painéis personalizados para empresas que precisam organizar processos específicos.",
    recursos: [
      "Portais digitais",
      "Sistemas internos",
      "Automações",
      "Dashboards",
      "Projetos personalizados",
    ],
    href: "https://wa.me/5511964073364?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20um%20projeto%20sob%20medida%20com%20a%20ALMS%20Prime.",
    cta: "Solicitar projeto",
    externo: false,
    destaque: false,
  },
];

const indicadores = [
  {
    numero: "2+",
    texto: "sistemas em produção",
  },
  {
    numero: "4+",
    texto: "módulos e projetos no ecossistema",
  },
  {
    numero: "100%",
    texto: "foco em organização e operação",
  },
];

export default function SistemasPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="relative overflow-hidden bg-[#071b2d] px-6 py-6 text-white sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.26),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_32%),linear-gradient(135deg,#082033_0%,#0d3148_52%,#061728_100%)]" />

        <div className="relative">
          <SiteHeader />

          <PageHero
            eyebrow="Sistemas"
            title="Produtos digitais da ALMS Prime"
            description="Conheça os sistemas, módulos e projetos digitais que fazem parte do ecossistema ALMS Prime para gestão, operação, controle e crescimento."
          />
        </div>
      </section>

      <section className="-mt-6 px-6 pb-20 pt-12 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          {indicadores.map((item) => (
            <div
              key={item.texto}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/30"
            >
              <p className="text-4xl font-black text-cyan-700">{item.numero}</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-slate-600">
                {item.texto}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-6 lg:grid-cols-2">
          {sistemas.map((sistema) => (
            <a
              key={sistema.nome}
              href={sistema.href}
              target={sistema.externo ? "_blank" : undefined}
              rel={sistema.externo ? "noopener noreferrer" : undefined}
              className={`group rounded-[2rem] border bg-white p-7 shadow-xl shadow-slate-300/30 transition hover:-translate-y-1 hover:shadow-2xl ${
                sistema.destaque
                  ? "border-cyan-300/60"
                  : "border-slate-200 hover:border-cyan-300/60"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-700">
                      {sistema.categoria}
                    </span>

                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                      {sistema.status}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    {sistema.nome}
                  </h2>
                </div>

                {sistema.destaque ? (
                  <span className="w-fit rounded-full bg-slate-950 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-200">
                    Destaque
                  </span>
                ) : null}
              </div>

              <p className="mt-5 leading-8 text-slate-700">
                {sistema.descricao}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {sistema.recursos.map((recurso) => (
                  <div
                    key={recurso}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    {recurso}
                  </div>
                ))}
              </div>

              <div className="mt-7 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition group-hover:bg-cyan-500 group-hover:text-slate-950">
                {sistema.cta}
              </div>
            </a>
          ))}
        </div>

        <div className="mx-auto mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-300/30">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-10">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-700">
                Solução personalizada
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Precisa de um sistema específico para sua operação?
              </h2>

              <p className="mt-5 max-w-3xl leading-8 text-slate-700">
                A ALMS Prime pode estruturar um projeto sob medida para organizar
                processos, automatizar etapas comerciais, controlar informações e
                criar uma base digital mais profissional para o seu negócio.
              </p>

              <a
                href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20gostaria%20de%20criar%20um%20sistema%20sob%20medida%20com%20a%20ALMS%20Prime."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-full bg-emerald-400 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
              >
                Conversar pelo WhatsApp
              </a>
            </div>

            <div className="bg-[#071b2d] p-8 text-white sm:p-10">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300">
                Áreas atendidas
              </p>

              <div className="mt-6 space-y-4">
                {[
                  "Gestão de clientes e recorrências",
                  "Portais institucionais",
                  "Painéis administrativos",
                  "Controle financeiro simples",
                  "Automações comerciais",
                  "Dashboards e relatórios",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-sm font-semibold text-slate-100"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}


