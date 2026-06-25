import Image from "next/image";

const links = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Soluções", href: "/solucoes" },
  { label: "Sistemas", href: "/sistemas" },
  { label: "Contato", href: "/contato" },
  { label: "Privacidade", href: "/politica-de-privacidade" },
];

const solucoes = [
  "Sistemas de gestão",
  "Portais institucionais",
  "Automações comerciais",
  "Dashboards e relatórios",
  "Projetos sob medida",
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-12 text-slate-950 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <a href="/" className="inline-flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-cyan-200 bg-[#071b2d] p-1.5 shadow-lg shadow-slate-300/40">
              <Image
                src="/logo-alms-prime.png"
                alt="Logo ALMS Prime"
                width={96}
                height={96}
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-slate-950">
                ALMS Prime
              </p>
              <p className="text-xs font-semibold text-slate-500">
                Tecnologia • Gestão • Soluções digitais
              </p>
            </div>
          </a>

          <p className="mt-5 max-w-md leading-7 text-slate-600">
            Soluções digitais para organizar processos, estruturar operações,
            criar sistemas, portais, automações e projetos sob medida.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.22em] text-slate-950">
            Navegação
          </h3>

          <nav className="mt-5 flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-600 transition hover:text-cyan-700"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.22em] text-slate-950">
            Soluções
          </h3>

          <div className="mt-5 flex flex-col gap-3">
            {solucoes.map((item) => (
              <span key={item} className="text-sm font-semibold text-slate-600">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.22em] text-slate-950">
            Contato
          </h3>

          <p className="mt-5 leading-7 text-slate-600">
            Fale com a ALMS Prime para conhecer sistemas, solicitar uma
            demonstração ou iniciar um projeto digital.
          </p>

          <a
            href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20vim%20pelo%20rodap%C3%A9%20do%20site%20da%20ALMS%20Prime%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full bg-emerald-400 px-5 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-slate-200 pt-6 text-sm font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 ALMS Prime. Todos os direitos reservados.</p>

        <p>Tecnologia, gestão e soluções digitais.</p>
      </div>
    </footer>
  );
}
