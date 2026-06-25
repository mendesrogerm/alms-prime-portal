const navItems = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Soluções", href: "/solucoes" },
  { label: "Sistemas", href: "/sistemas" },
  { label: "Contato", href: "/contato" },
];

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-6">
      <a href="/" className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-lg shadow-cyan-500/10">
          <span className="text-sm font-black tracking-tight text-cyan-200">
            AP
          </span>
        </div>
        <div>
          <p className="text-sm font-black tracking-[0.28em] text-white">
            ALMS PRIME
          </p>
          <p className="text-xs text-slate-400">
            Tecnologia • Gestão • Soluções digitais
          </p>
        </div>
      </a>

      <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
        {navItems.map((item) => (
          <a key={item.href} className="transition hover:text-cyan-200" href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a
        href="/login"
        className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
      >
        Área interna
      </a>
    </header>
  );
}
