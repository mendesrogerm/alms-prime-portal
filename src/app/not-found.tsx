import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main className="portal-grid relative min-h-[72vh] overflow-hidden bg-white px-6 py-16 text-slate-950 sm:px-10 sm:py-20 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -right-24 bottom-8 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl"
        />

        <section className="relative mx-auto flex max-w-5xl flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-black text-blue-800">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-orange-500"
            />
            Erro 404
          </div>

          <p
            aria-hidden="true"
            className="mt-8 text-8xl font-black tracking-[-0.08em] text-blue-100 sm:text-9xl"
          >
            404
          </p>

          <h1 className="-mt-3 max-w-3xl text-4xl font-black tracking-[-0.04em] text-[#092A56] sm:text-5xl">
            Página não encontrada
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            O endereço acessado não existe, foi removido ou está
            temporariamente indisponível. Utilize uma das opções abaixo para
            continuar navegando.
          </p>

          <div className="mt-9 flex w-full max-w-3xl flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#075BC7] px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:bg-[#064da8]"
            >
              Voltar ao início
            </Link>

            <Link
              href="/sistemas"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-black text-[#092A56] transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50"
            >
              Ver sistemas
            </Link>

            <a
              href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20acessei%20uma%20p%C3%A1gina%20do%20site%20da%20ALMS%20PRIME%20e%20preciso%20de%20ajuda."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#25D366] px-6 py-3 text-sm font-black text-[#092A56] transition hover:-translate-y-0.5 hover:bg-[#20bd5a]"
            >
              Falar no WhatsApp
            </a>
          </div>

          <div className="mt-12 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <p className="font-black text-[#092A56]">Projetos</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Conheça as soluções desenvolvidas pela ALMS PRIME.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <p className="font-black text-[#092A56]">Academy</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Explore conteúdos e produtos digitais.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <p className="font-black text-[#092A56]">Atendimento</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Fale com a equipe para receber orientação.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}