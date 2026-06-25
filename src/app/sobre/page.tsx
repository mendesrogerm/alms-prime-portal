const valores = [
  "Organização de processos",
  "Soluções digitais sob medida",
  "Simplicidade para o usuário final",
  "Dados claros para tomada de decisão",
  "Evolução contínua dos projetos",
  "Integração entre operação e tecnologia",
];

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.20),transparent_34%),linear-gradient(135deg,#020617_0%,#07111f_52%,#020617_100%)]" />

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
            <a href="/solucoes" className="transition hover:text-cyan-200">
              Soluções
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

        <div className="mx-auto grid max-w-7xl gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
              Sobre a ALMS Prime
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
              Tecnologia aplicada à gestão, operação e crescimento.
            </h1>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-7">
            <p className="text-lg leading-8 text-slate-300">
              A ALMS Prime nasceu para transformar ideias, processos e
              necessidades operacionais em soluções digitais práticas. O foco é
              criar sistemas que ajudem negócios a organizar informações,
              acompanhar resultados, automatizar rotinas e tomar decisões com
              mais segurança.
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              O portal institucional será a central do ecossistema ALMS Prime,
              reunindo projetos próprios, sistemas comerciais, módulos internos
              e novas soluções que serão desenvolvidas ao longo do tempo.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            O que guia nossos projetos
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {valores.map((valor) => (
              <div
                key={valor}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="font-bold text-slate-100">{valor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
