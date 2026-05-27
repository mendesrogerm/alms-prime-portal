import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <section className="bg-blue-900 px-6 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold text-blue-200">ALMS PRIME</p>

          <h1 className="mt-2 text-3xl font-bold">
            Portal de Sistemas
          </h1>

          <p className="mt-2 max-w-2xl text-blue-100">
            Central para acessar o sistema de fiscalização SisGep e futuros aplicativos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-xl font-bold text-slate-800">
          Aplicações disponíveis
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl">🛡️</div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              Fiscalização SisGep
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Controle de processos, mapas, anexos, dashboard e relatórios.
            </p>

            <Link
              href="/fiscalizacao"
              className="mt-5 inline-block rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              Acessar sistema
            </Link>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 opacity-80 shadow-sm">
            <div className="text-3xl">➕</div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              Próximo sistema
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Espaço reservado para novos projetos.
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 opacity-80 shadow-sm">
            <div className="text-3xl">📊</div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              Relatórios
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Futuramente, relatórios gerais dos sistemas.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}