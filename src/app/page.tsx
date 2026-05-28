import Link from "next/link";

const sistemas = [
  {
    icone: "💠",
    titulo: "ALMS Prime Cripto",
    descricao:
      "Dashboard de carteira, operações, lucro/prejuízo, simulações e relatório fiscal.",
    href: "/cripto",
    destaque: true,
    botao: "Acessar Cripto",
  },
  {
    icone: "🛡️",
    titulo: "Fiscalização SisGep",
    descricao: "Controle de processos, mapas, anexos, dashboard e relatórios.",
    href: "/fiscalizacao",
    destaque: false,
    botao: "Acessar sistema",
  },
  {
    icone: "📊",
    titulo: "Relatórios",
    descricao: "Futuramente, relatórios gerais dos sistemas ALMS Prime.",
    href: null,
    destaque: false,
    botao: "Em breve",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <section className="bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
            ALMS PRIME
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Portal de Sistemas
          </h1>

          <p className="mt-3 max-w-3xl text-slate-300">
            Central para acessar o ALMS Prime Cripto, Fiscalização SisGep e os
            próximos aplicativos do ecossistema.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Aplicações disponíveis
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Escolha o sistema que deseja acessar.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {sistemas.map((sistema) => (
            <div
              key={sistema.titulo}
              className={
                sistema.destaque
                  ? "rounded-2xl border border-cyan-300 bg-slate-950 p-6 text-white shadow-lg shadow-cyan-950/20"
                  : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              }
            >
              <div className="text-3xl">{sistema.icone}</div>

              <h3
                className={
                  sistema.destaque
                    ? "mt-4 text-lg font-bold text-white"
                    : "mt-4 text-lg font-bold text-slate-800"
                }
              >
                {sistema.titulo}
              </h3>

              <p
                className={
                  sistema.destaque
                    ? "mt-2 text-sm text-slate-300"
                    : "mt-2 text-sm text-slate-600"
                }
              >
                {sistema.descricao}
              </p>

              {sistema.href ? (
                <Link
                  href={sistema.href}
                  className={
                    sistema.destaque
                      ? "mt-5 inline-block rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300"
                      : "mt-5 inline-block rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                  }
                >
                  {sistema.botao}
                </Link>
              ) : (
                <span className="mt-5 inline-block rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-400">
                  {sistema.botao}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
