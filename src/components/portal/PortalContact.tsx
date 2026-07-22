import Link from "next/link";

export function PortalContact() {
  return (
    <section
      id="contato"
      className="scroll-mt-24 bg-[#F6F8FC] px-6 py-16 sm:px-10 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#092A56] shadow-2xl shadow-blue-950/15">
        <div className="grid gap-8 px-7 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-center lg:px-14">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">
              Fale com a ALMS PRIME
            </p>

            <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
              Tem uma ideia, um processo ou um projeto que precisa evoluir?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">
              Apresente sua necessidade e conheça as possibilidades de sistemas,
              automações, páginas, portais e produtos digitais.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20vim%20pelo%20Portal%20ALMS%20PRIME%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-green-400 px-6 py-3 text-center text-sm font-black text-[#092A56] transition hover:-translate-y-0.5 hover:bg-green-300"
            >
              Chamar no WhatsApp
            </a>

            <Link
              href="/contato"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Página de contato
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}