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

        <header className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10">
              <span className="text-sm font-black text-cyan-200">AP</span>
            </div>
            <div>
              <p className="text-sm font-black tracking-[0.28em]">
                ALMS PRIME
              </p>
              <p className="text-xs text-slate-400">Portal institucional</p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="/" className="transition hover:text-cyan-200">
              Início
            </a>
            <a href="/sobre" className="transition hover:text-cyan-200">
              Sobre
            </a>
            <a href="/sistemas" className="transition hover:text-cyan-200">
              Sistemas
            </a>
            <a href="/contato" className="transition hover:text-cyan-200">
              Contato
            </a>
          </nav>

          <a
            href="/login"
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
          >
            Área interna
          </a>
        </header>

        <div className="mx-auto max-w-7xl py-20">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300">
            Soluções
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Soluções digitais para organizar processos e acelerar decisões.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            A ALMS Prime atua na criação de sistemas, portais, dashboards e
            automações pensados para tornar a operação mais simples, clara e
            controlável.
          </p>
        </div>
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
    </main>
  );
}
