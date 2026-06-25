import { PageHero } from "../../components/PageHero";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

const solucoes = [
  {
    titulo: "Sistemas de gestão",
    texto:
      "Criação de sistemas para organizar clientes, planos, vencimentos, financeiro, relatórios e operação comercial.",
  },
  {
    titulo: "Portais institucionais",
    texto:
      "Construção de sites e portais para centralizar informações, projetos, sistemas e canais de contato.",
  },
  {
    titulo: "Automação comercial",
    texto:
      "Fluxos para atendimento, captação, registro de leads, testes, renovações e acompanhamento comercial.",
  },
  {
    titulo: "Dashboards e relatórios",
    texto:
      "Painéis para visualizar dados importantes, indicadores, resultados financeiros e informações operacionais.",
  },
  {
    titulo: "Projetos digitais sob medida",
    texto:
      "Soluções específicas para necessidades reais, com foco em simplicidade, controle e evolução contínua.",
  },
  {
    titulo: "Integração de ferramentas",
    texto:
      "Organização de sistemas, APIs, bancos de dados, páginas internas e recursos que conectam a operação.",
  },
];

export default function SolucoesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_34%),linear-gradient(135deg,#020617_0%,#07111f_52%,#020617_100%)]" />

        <SiteHeader />

        <PageHero
          eyebrow="Soluções"
          title="Soluções digitais para organizar processos e acelerar decisões."
          description="A ALMS Prime atua na criação de sistemas, portais, dashboards e automações pensados para tornar a operação mais simples, clara e controlável."
          accent="emerald"
        />
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {solucoes.map((solucao) => (
            <div
              key={solucao.titulo}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7"
            >
              <h2 className="text-2xl font-black">{solucao.titulo}</h2>
              <p className="mt-4 leading-7 text-slate-300">{solucao.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
