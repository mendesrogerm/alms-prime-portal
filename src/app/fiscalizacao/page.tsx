import Link from "next/link";

export default function FiscalizacaoPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-blue-900 px-6 py-6 text-white">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm font-semibold text-blue-200 hover:text-white">
            ← Voltar ao portal
          </Link>

          <h1 className="mt-4 text-3xl font-bold">
            Fiscalização SisGep
          </h1>

          <p className="mt-2 text-blue-100">
            Sistema de controle de processos, mapas, anexos, dashboard e relatórios.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Sistema em implantação
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            O banco de dados já foi criado. O próximo passo será listar os processos
            cadastrados na tabela do Supabase.
          </p>
        </div>
      </section>
    </main>
  );
}