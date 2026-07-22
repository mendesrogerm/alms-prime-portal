import Image from "next/image";
import Link from "next/link";

const navigationLinks = [
  { label: "Início", href: "/" },
  { label: "Soluções", href: "/#categorias" },
  { label: "Projetos", href: "/#projetos" },
  { label: "ALMS Academy", href: "/#academy" },
  { label: "Produtos digitais", href: "/#produtos" },
  { label: "Novidades", href: "/#novidades" },
];

const institutionalLinks = [
  { label: "Sobre a ALMS", href: "/sobre" },
  { label: "Sistemas", href: "/sistemas" },
  { label: "Contato", href: "/contato" },
  { label: "Política de privacidade", href: "/politica-de-privacidade" },
  { label: "Termos de uso", href: "/termos-de-uso" },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#071F42] px-6 py-14 text-white sm:px-10 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1fr]">
        <div>
          <Link
            href="/"
            aria-label="Ir para a página inicial da ALMS PRIME"
            className="inline-flex items-center gap-4"
          >
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-300/40 bg-[#06182C] shadow-xl shadow-black/20">
              <Image
                src="/logo-alms-prime-oficial.png"
                alt="Logo oficial da ALMS PRIME"
                width={1200}
                height={1200}
                sizes="80px"
                className="h-full w-full scale-[1.74] object-cover object-center"
              />
            </div>

            <div>
              <p className="text-sm font-black tracking-[0.22em]">
                ALMS PRIME
              </p>
              <p className="mt-1 text-xs font-semibold text-blue-200">
                Tecnologia, gestão e conhecimento
              </p>
            </div>
          </Link>

          <p className="mt-6 max-w-md leading-7 text-blue-100/80">
            Um ecossistema de sistemas, projetos, conteúdos e produtos digitais
            criado para transformar necessidades em soluções práticas.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
            Navegação
          </h3>

          <nav
            aria-label="Navegação do rodapé"
            className="mt-5 flex flex-col gap-3"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-blue-100/80 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
            Institucional
          </h3>

          <nav
            aria-label="Links institucionais"
            className="mt-5 flex flex-col gap-3"
          >
            {institutionalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-blue-100/80 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
            Atendimento
          </h3>

          <p className="mt-5 leading-7 text-blue-100/80">
            Fale com a equipe para conhecer sistemas, produtos digitais ou
            apresentar um novo projeto.
          </p>

          <a
            href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20vim%20pelo%20Portal%20ALMS%20PRIME%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-green-400 px-5 py-3 text-sm font-black text-[#092A56] transition hover:-translate-y-0.5 hover:bg-green-300"
          >
            Fale com nossa equipe
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-7 text-sm font-semibold text-blue-100/60 sm:flex-row sm:items-center sm:justify-between">
        <p>© {currentYear} ALMS PRIME. Todos os direitos reservados.</p>
        <p>Sistemas, conhecimento e soluções digitais.</p>
      </div>
    </footer>
  );
}
