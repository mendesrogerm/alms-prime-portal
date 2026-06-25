const canais = [
  {
    titulo: "WhatsApp",
    texto: "Canal principal para conversar com a equipe ALMS Prime.",
    href: "https://wa.me/5511964073364",
    botao: "Chamar no WhatsApp",
  },
  {
    titulo: "Área interna",
    texto: "Acesso reservado aos módulos e sistemas internos do portal.",
    href: "/login",
    botao: "Acessar área interna",
  },
  {
    titulo: "Sistemas",
    texto: "Veja os projetos e sistemas disponíveis no ecossistema ALMS Prime.",
    href: "/sistemas",
    botao: "Ver sistemas",
  },
];

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.20),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_34%),linear-gradient(135deg,#020617_0%,#07111f_52%,#020617_100%)]" />

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
            <a href="/sistemas" className="transition hover:text-cyan-200">
              Sistemas
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
            Contato
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Fale com a ALMS Prime e avance seu próximo projeto digital.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Use esta área para acessar os canais principais da ALMS Prime,
            conversar sobre novas soluções, acessar sistemas ou conhecer os
            projetos disponíveis.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {canais.map((canal) => (
            <a
              key={canal.titulo}
              href={canal.href}
              target={canal.href.startsWith("http") ? "_blank" : undefined}
              rel={canal.href.startsWith("http") ? "noreferrer" : undefined}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-emerald-300/10"
            >
              <h2 className="text-2xl font-black">{canal.titulo}</h2>
              <p className="mt-4 leading-7 text-slate-300">{canal.texto}</p>
              <div className="mt-7 text-sm font-black uppercase tracking-wide text-emerald-200">
                {canal.botao} →
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
