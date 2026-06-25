const sistemas = [
  {
    nome: "Gestão de Clientes",
    categoria: "Gestão comercial",
    descricao:
      "Sistema para controlar clientes, testes, assinaturas, vencimentos, planos, servidores, financeiro e atendimento comercial.",
    href: "https://clientes.almsprime.com.br",
    status: "Operacional",
  },
  {
    nome: "Bolão Copa",
    categoria: "Eventos e comunidades",
    descricao:
      "Plataforma para criação e administração de bolões, participantes, pagamentos, rankings, perguntas e repasses.",
    href: "https://bolao.almsprime.com.br",
    status: "Em evolução",
  },
  {
    nome: "ALMS Prime Cripto",
    categoria: "Dados e investimentos",
    descricao:
      "Painel para acompanhar carteira, ciclos, transações, gráficos, notícias, sentimento de mercado e indicadores.",
    href: "/cripto",
    status: "Módulo interno",
  },
  {
    nome: "Fiscalização SisGep",
    categoria: "Operação e controle",
    descricao:
      "Ferramenta para acompanhamento de processos, mapas, setores, usuários, anexos, relatórios e dados operacionais.",
    href: "/fiscalizacao",
    status: "Módulo interno",
  },
  {
    nome: "Gestão Comercial Simples",
    categoria: "Sistema de gestão",
    descricao:
      "Projeto voltado para empresas que precisam organizar clientes, financeiro, relatórios, processos e rotina comercial.",
    href: "#",
    status: "Em preparação",
  },
  {
    nome: "Novos Projetos ALMS",
    categoria: "Expansão",
    descricao:
      "Área reservada para futuros sistemas, ferramentas internas, portais de clientes e soluções digitais sob medida.",
    href: "#",
    status: "Em breve",
  },
];

export default function SistemasPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.20),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_34%),linear-gradient(135deg,#020617_0%,#07111f_52%,#020617_100%)]" />

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
            <a href="/solucoes" className="transition hover:text-cyan-200">
              Soluções
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
          <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
            Sistemas ALMS Prime
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Um ecossistema de projetos digitais conectados à operação.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Esta área reúne os sistemas, módulos e projetos da ALMS Prime. A
            ideia é centralizar tudo em um único portal institucional, deixando
            cada solução organizada, acessível e pronta para evolução.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          {sistemas.map((sistema) => (
            <a
              key={sistema.nome}
              href={sistema.href}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-cyan-300/10"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-cyan-200">
                    {sistema.categoria}
                  </div>
                  <h2 className="text-2xl font-black">{sistema.nome}</h2>
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
      </section>
    </main>
  );
}
