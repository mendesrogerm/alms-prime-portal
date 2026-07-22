import Image from "next/image";
import Link from "next/link";

const indicadores = [
  {
    value: "Sistemas",
    label: "Soluções próprias e projetos aplicados",
  },
  {
    value: "Gestão",
    label: "Processos, dados e produtividade",
  },
  {
    value: "Conhecimento",
    label: "Cursos, guias e conteúdos práticos",
  },
];

export function PortalHero() {
  return (
    <section
      aria-labelledby="portal-hero-title"
      className="portal-grid relative overflow-hidden border-b border-slate-200 bg-white"
    >
      <div
        aria-hidden="true"
        className="absolute -left-32 top-12 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:px-8 lg:py-16 xl:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-green-500"
            />
            Portal ALMS PRIME
          </div>

          <h1
            id="portal-hero-title"
            className="mt-7 max-w-3xl text-4xl font-black leading-[1.03] tracking-[-0.04em] text-[#092A56] sm:text-5xl lg:text-[3.35rem] xl:text-6xl"
          >
            Tecnologia, gestão e conhecimento em um só ecossistema.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Conheça sistemas, projetos, produtos digitais e conteúdos criados
            para organizar operações, ampliar conhecimento e transformar ideias
            em soluções reais.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#projetos"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#075BC7] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:bg-[#064da8]"
            >
              Conhecer projetos
            </Link>

            <Link
              href="#academy"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-extrabold text-[#092A56] transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50"
            >
              Explorar ALMS Academy
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {indicadores.map((indicador) => (
              <div
                key={indicador.value}
                className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"
              >
                <p className="text-sm font-black text-[#075BC7]">
                  {indicador.value}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {indicador.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-5 rounded-[2.5rem] bg-blue-200/40 blur-3xl"
          />

          <div className="relative overflow-hidden rounded-[2rem] border border-blue-900/10 bg-[#092A56] p-5 shadow-2xl shadow-blue-950/20 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-300/40 bg-[#06182C] shadow-xl shadow-black/20">
                  <Image
                    src="/logo-alms-prime-oficial.png"
                    alt="Logo oficial da ALMS PRIME"
                    width={1200}
                    height={1200}
                    sizes="80px"
                    priority
                    className="h-full w-full scale-[1.74] object-cover object-center"
                  />
                </div>

                <div>
                  <p className="text-sm font-black tracking-[0.18em] text-white">
                    ALMS PRIME
                  </p>
                  <p className="mt-1 text-xs text-blue-100">
                    Portal de sistemas e conhecimento
                  </p>
                </div>
              </div>

              <div className="rounded-full border border-green-300/20 bg-green-400/10 px-3 py-1 text-xs font-bold text-green-200">
                Online
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                  Soluções
                </p>
                <p className="mt-3 text-xl font-black text-white">
                  Sistemas para operações reais
                </p>
                <p className="mt-3 text-sm leading-6 text-blue-100/80">
                  Gestão comercial, indicadores, processos e automação.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-200">
                  Conhecimento
                </p>
                <p className="mt-3 text-xl font-black text-white">
                  Aprendizado com aplicação prática
                </p>
                <p className="mt-3 text-sm leading-6 text-blue-100/80">
                  Cursos, e-books, guias e conteúdos sobre tecnologia.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-5 text-[#092A56]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#075BC7]">
                    Ecossistema em evolução
                  </p>
                  <p className="mt-2 text-lg font-black">
                    Um portal preparado para novos projetos.
                  </p>
                </div>

                <div
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl font-black text-[#075BC7]"
                >
                  +
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 text-sm text-blue-100">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-green-400/15 text-green-200"
              >
                ✓
              </span>
              Projetos, produtos e conteúdos centralizados.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
