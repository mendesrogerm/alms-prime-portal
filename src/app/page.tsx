import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

const sistemas = [
  {
    nome: "Gestão de Clientes",
    descricao:
      "Controle de clientes, testes, assinaturas, vencimentos, planos, servidores, financeiro e atendimento comercial.",
    status: "Sistema operacional",
    href: "https://clientes.almsprime.com.br",
    destaque: "Gestão comercial",
  },
  {
    nome: "Bolão Copa",
    descricao:
      "Plataforma para criação, organização e gestão de bolões, pagamentos, rankings e repasses.",
    status: "Projeto em evolução",
    href: "https://bolao.almsprime.com.br",
    destaque: "Eventos e comunidades",
  },
  {
    nome: "ALMS Prime Cripto",
    descricao:
      "Painel de acompanhamento de carteira, ciclos, transações, gráficos, notícias e sentimento de mercado.",
    status: "Módulo interno",
    href: "/cripto",
    destaque: "Dados e investimentos",
  },
  {
    nome: "Fiscalização SisGep",
    descricao:
      "Ferramenta de apoio para acompanhamento, mapas, setores, usuários e processos de fiscalização.",
    status: "Módulo interno",
    href: "/fiscalizacao",
    destaque: "Operação e controle",
  },
];

const pilares = [
  "Sistemas próprios",
  "Gestão de processos",
  "Automação comercial",
  "Relatórios e dados",
  "Portais digitais",
  "Projetos sob medida",
];

const etapas = [
  {
    titulo: "Diagnóstico",
    texto:
      "Entendemos o processo, os gargalos e o que precisa ser organizado para gerar resultado real.",
  },
  {
    titulo: "Construção",
    texto:
      "Criamos soluções digitais com foco em clareza, controle, produtividade e crescimento.",
  },
  {
    titulo: "Evolução",
    texto:
      "Acompanhamos melhorias, novas funcionalidades e integrações conforme o negócio avança.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#071b2d] text-white">
      <section className="relative isolate px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.34),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.26),transparent_32%),linear-gradient(135deg,#082033_0%,#0d3148_48%,#061728_100%)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <SiteHeader />

        <div className="mx-auto grid max-w-7xl items-center gap-12 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-28">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              Ecossistema digital para negócios modernos
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Tecnologia, gestão e sistemas para a sua operação crescer.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A ALMS Prime desenvolve e organiza soluções digitais para controle
              comercial, automação, gestão de dados, portais internos e projetos
              personalizados. Um ecossistema para centralizar processos e dar
              mais clareza à tomada de decisão.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="/sistemas"
                className="rounded-full bg-cyan-300 px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:bg-cyan-200"
              >
                Conhecer sistemas
              </a>
              <a
                href="/contato"
                className="rounded-full border border-white/15 px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white transition hover:border-emerald-300/70 hover:bg-emerald-300/10"
              >
                Falar com a ALMS Prime
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
              {pilares.map((pilar) => (
                <div
                  key={pilar}
                  className="rounded-2xl border border-cyan-200/15 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-slate-200"
                >
                  {pilar}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-cyan-400/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-cyan-200/15 bg-white/[0.09] p-5 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="rounded-[1.5rem] border border-cyan-200/15 bg-slate-900/80 p-6">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm font-bold text-cyan-200">
                      Painel ALMS Prime
                    </p>
                    <p className="text-xs text-slate-400">
                      Sistemas, dados e operação
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200">
                    Online
                  </div>
                </div>

                <div className="space-y-4">
                  {sistemas.map((sistema) => (
                    <a
                      key={sistema.nome}
                      href={sistema.href}
                      className="block rounded-2xl border border-cyan-200/15 bg-white/[0.08] p-4 transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-white">
                            {sistema.nome}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {sistema.destaque}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-cyan-200">
                          Acessar
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solucoes" className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
              Soluções
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Uma base digital para organizar, vender, acompanhar e evoluir.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              O objetivo da ALMS Prime é transformar processos soltos em sistemas
              claros, com dados acessíveis, rotinas mais simples e visão de
              crescimento.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {etapas.map((item, index) => (
              <div
                key={item.titulo}
                className="rounded-[2rem] border border-cyan-200/15 bg-white/[0.08] p-7"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-lg font-black text-cyan-200">
                  {index + 1}
                </div>
                <h3 className="text-xl font-black">{item.titulo}</h3>
                <p className="mt-4 leading-7 text-slate-300">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sistemas" className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300">
                Ecossistema
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Projetos e sistemas ALMS Prime
              </h2>
            </div>
            <p className="max-w-xl text-slate-300">
              Centralize aqui os principais projetos da ALMS Prime. Conforme
              novos sistemas forem criados, eles entram neste portal.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {sistemas.map((sistema) => (
              <a
                key={sistema.nome}
                href={sistema.href}
                className="group rounded-[2rem] border border-cyan-200/15 bg-white/[0.08] p-7 transition hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-cyan-300/10"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-4 inline-flex rounded-full border border-cyan-200/15 px-3 py-1 text-xs font-bold text-cyan-200">
                      {sistema.destaque}
                    </div>
                    <h3 className="text-2xl font-black text-white">
                      {sistema.nome}
                    </h3>
                    <p className="mt-4 leading-7 text-slate-300">
                      {sistema.descricao}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-slate-200">
                    {sistema.status}
                  </span>
                </div>
                <div className="mt-7 text-sm font-black uppercase tracking-wide text-cyan-200">
                  Acessar projeto →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        id="metodo"
        className="border-y border-white/10 bg-white/[0.03] px-6 py-20 sm:px-10 lg:px-16"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
              Método ALMS
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Menos improviso. Mais controle.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              "Mapeamento dos processos e necessidades reais.",
              "Criação de sistemas simples de usar e fáceis de evoluir.",
              "Organização de dados para relatórios e tomada de decisão.",
              "Melhorias contínuas conforme o negócio cresce.",
            ].map((texto) => (
              <div
                key={texto}
                className="rounded-3xl border border-cyan-200/15 bg-slate-950/50 p-6"
              >
                <p className="leading-7 text-slate-300">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 via-white/[0.04] to-emerald-300/10 p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-200">
                Vamos construir
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Transforme ideias, processos e projetos em sistemas reais.
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                Este portal será a central da ALMS Prime: institucional,
                comercial e operacional. A partir daqui, cada novo projeto pode
                ganhar seu espaço dentro do ecossistema.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <a
                href="https://wa.me/5511964073364"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-emerald-300 px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-slate-950 transition hover:bg-emerald-200"
              >
                Chamar no WhatsApp
              </a>
              <a
                href="/login"
                className="rounded-full border border-white/15 px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white transition hover:border-cyan-300/70 hover:bg-cyan-300/10"
              >
                Acessar área interna
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}



