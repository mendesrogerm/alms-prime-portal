import type { Metadata } from "next";
import { PageHero } from "../../components/PageHero";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";


export const metadata: Metadata = {
  title: "Soluções Digitais",
  description:
    "Soluções digitais da ALMS Prime para sistemas de gestão, portais institucionais, automações comerciais, dashboards e projetos sob medida.",
};
const solucoes = [
  {
    titulo: "Sistemas de gestão",
    subtitulo: "Organização operacional",
    descricao:
      "Criação de sistemas para centralizar clientes, planos, vencimentos, financeiro, relatórios e rotinas comerciais em um único ambiente.",
    itens: [
      "Cadastro de clientes",
      "Controle de planos e assinaturas",
      "Gestão de vencimentos",
      "Financeiro simples",
      "Relatórios operacionais",
    ],
  },
  {
    titulo: "Portais institucionais",
    subtitulo: "Presença digital",
    descricao:
      "Desenvolvimento de sites e portais para apresentar negócios, organizar acessos, exibir sistemas e fortalecer a presença digital da marca.",
    itens: [
      "Site institucional",
      "Páginas comerciais",
      "Central de sistemas",
      "Área de login",
      "Integração com domínio próprio",
    ],
  },
  {
    titulo: "Automações comerciais",
    subtitulo: "Atendimento e processos",
    descricao:
      "Estruturação de fluxos para reduzir trabalho manual, organizar atendimento, padronizar respostas e melhorar o acompanhamento comercial.",
    itens: [
      "Fluxos de atendimento",
      "Mensagens comerciais",
      "Triagem de leads",
      "Organização de solicitações",
      "Apoio ao time comercial",
    ],
  },
  {
    titulo: "Dashboards e relatórios",
    subtitulo: "Dados para decisão",
    descricao:
      "Construção de painéis e relatórios para acompanhar indicadores, entender resultados e tomar decisões com mais segurança.",
    itens: [
      "Indicadores comerciais",
      "Relatórios financeiros",
      "Visão de clientes",
      "Acompanhamento de desempenho",
      "Painéis administrativos",
    ],
  },
  {
    titulo: "Projetos sob medida",
    subtitulo: "Solução personalizada",
    descricao:
      "Planejamento e desenvolvimento de soluções digitais específicas para empresas que precisam organizar processos próprios.",
    itens: [
      "Levantamento da necessidade",
      "Estruturação do fluxo",
      "Desenvolvimento do sistema",
      "Publicação em produção",
      "Evolução por etapas",
    ],
  },
  {
    titulo: "Integrações e evolução",
    subtitulo: "Crescimento modular",
    descricao:
      "Criação de bases digitais que podem evoluir com novos módulos, novas telas, novos relatórios e novas funcionalidades.",
    itens: [
      "Módulos adicionais",
      "Integrações futuras",
      "Melhorias contínuas",
      "Escalabilidade",
      "Base preparada para expansão",
    ],
  },
];

const processo = [
  {
    etapa: "01",
    titulo: "Diagnóstico",
    descricao:
      "Entendemos o problema, o fluxo atual e os pontos que precisam de organização ou automação.",
  },
  {
    etapa: "02",
    titulo: "Planejamento",
    descricao:
      "Definimos as telas, funcionalidades, prioridades e o caminho mais simples para entregar valor rápido.",
  },
  {
    etapa: "03",
    titulo: "Desenvolvimento",
    descricao:
      "Construímos a solução digital com foco em usabilidade, clareza operacional e estrutura preparada para evolução.",
  },
  {
    etapa: "04",
    titulo: "Publicação",
    descricao:
      "Colocamos o projeto no ar, com domínio, deploy e ajustes finais para uso real.",
  },
];

export default function SolucoesPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="relative overflow-hidden bg-[#071b2d] px-6 py-6 text-white sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.26),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_32%),linear-gradient(135deg,#082033_0%,#0d3148_52%,#061728_100%)]" />

        <div className="relative">
          <SiteHeader />

          <PageHero
            eyebrow="Soluções"
            title="Soluções digitais para organizar, vender e crescer"
            description="A ALMS Prime desenvolve sistemas, portais, automações e painéis para transformar processos soltos em uma operação mais organizada, profissional e escalável."
          />
        </div>
      </section>

      <section className="-mt-6 px-6 pb-20 pt-12 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {solucoes.map((solucao) => (
            <article
              key={solucao.titulo}
              className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-300/30 transition hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-2xl hover:shadow-cyan-900/10"
            >
              <div className="mb-5 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-700">
                {solucao.subtitulo}
              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                {solucao.titulo}
              </h2>

              <p className="mt-4 leading-7 text-slate-700">
                {solucao.descricao}
              </p>

              <div className="mt-6 space-y-3">
                {solucao.itens.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-300/30">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-[#071b2d] p-8 text-white sm:p-10">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
                Método ALMS
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Do problema ao sistema publicado
              </h2>

              <p className="mt-5 leading-8 text-slate-200">
                O foco é construir soluções práticas, com etapas claras e
                evolução controlada. Primeiro organizamos o essencial. Depois,
                adicionamos módulos conforme a operação amadurece.
              </p>

              <a
                href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20vim%20pela%20p%C3%A1gina%20de%20solu%C3%A7%C3%B5es%20da%20ALMS%20Prime%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-full bg-emerald-400 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
              >
                Conversar sobre projeto
              </a>
            </div>

            <div className="grid gap-4 p-8 sm:p-10 md:grid-cols-2">
              {processo.map((item) => (
                <div
                  key={item.etapa}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-sm font-black text-cyan-700">
                    {item.etapa}
                  </div>

                  <h3 className="text-xl font-black text-slate-950">
                    {item.titulo}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-700">
                    {item.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-300/30 sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-700">
            Próximo passo
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Quer transformar uma rotina manual em uma solução digital?
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-700">
            Chame a ALMS Prime e explique sua necessidade. A partir disso,
            podemos estruturar o melhor caminho para criar uma solução simples,
            útil e preparada para crescer.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20gostaria%20de%20criar%20uma%20solu%C3%A7%C3%A3o%20digital%20com%20a%20ALMS%20Prime."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
            >
              Chamar no WhatsApp
            </a>

            <a
              href="/sistemas"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-50"
            >
              Ver sistemas
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

