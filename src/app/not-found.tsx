import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="relative min-h-[80vh] overflow-hidden bg-[#071b2d] px-6 py-6 text-white sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.28),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.24),transparent_32%),linear-gradient(135deg,#082033_0%,#0d3148_52%,#061728_100%)]" />

        <div className="relative">
          <SiteHeader />

          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center py-24 text-center sm:py-32">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-300">
              Erro 404
            </p>

            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Página não encontrada
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              O endereço acessado não existe, foi removido ou está temporariamente indisponível.
              Você pode voltar para a página inicial, acessar os sistemas ou falar com a ALMS Prime.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/"
                className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-200"
              >
                Voltar ao início
              </a>

              <a
                href="/sistemas"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-cyan-300/10"
              >
                Ver sistemas
              </a>

              <a
                href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20acessei%20uma%20p%C3%A1gina%20do%20site%20da%20ALMS%20Prime%20e%20preciso%20de%20ajuda."
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
