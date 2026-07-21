import Link from "next/link";

const beneficiosCurso = [
  "Fundamentos essenciais do ChatGPT",
  "Aplicações práticas para trabalho e negócios",
  "Técnicas para criação de comandos mais eficientes",
  "Conteúdo organizado do nível inicial ao avançado",
];

const produtos = [
  {
    title: "Cursos digitais",
    description:
      "Treinamentos organizados para desenvolver conhecimentos aplicáveis.",
    code: "CUR",
  },
  {
    title: "E-books e guias",
    description:
      "Materiais de consulta sobre tecnologia, gestão e produtividade.",
    code: "EBK",
  },
  {
    title: "Materiais práticos",
    description:
      "Modelos, checklists e recursos para apoiar a execução de atividades.",
    code: "MAT",
  },
];

export function PortalAcademy() {
  return (
    <section
      id="academy"
      className="scroll-mt-24 bg-[#EEF4FB] px-6 py-16 sm:px-10 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-black text-violet-700">
              ALMS Academy
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-[-0.03em] text-[#092A56] sm:text-4xl">
              Conhecimento para aprender, aplicar e evoluir.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              A ALMS Academy reúne conteúdos digitais voltados ao uso prático da
              tecnologia, da inteligência artificial, da gestão e da
              produtividade.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Conteúdo direto e organizado",
                "Aplicações voltadas a situações reais",
                "Materiais digitais de consulta",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-black text-violet-700">
                    ✓
                  </span>
                  <span className="font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="#produtos"
              className="mt-9 inline-flex min-h-12 items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-900/15 transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              Conhecer produtos digitais
            </Link>
          </div>

          <article className="overflow-hidden rounded-[2rem] border border-violet-200 bg-white shadow-xl shadow-blue-950/10">
            <div className="bg-[#092A56] p-7 text-white sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-violet-400/20 px-3 py-1 text-xs font-black text-violet-100">
                  Produto em destaque
                </span>

                <span className="rounded-full bg-green-400/15 px-3 py-1 text-xs font-black text-green-200">
                  Disponível
                </span>
              </div>

              <p className="mt-7 text-sm font-black uppercase tracking-[0.2em] text-blue-200">
                Curso digital
              </p>

              <h3 className="mt-3 text-3xl font-black tracking-[-0.03em]">
                ChatGPT do Zero ao Avançado
              </h3>

              <p className="mt-5 max-w-2xl leading-7 text-blue-100">
                Um conteúdo estruturado para compreender o ChatGPT e avançar
                para aplicações práticas no trabalho, nos estudos e nos
                negócios.
              </p>
            </div>

            <div className="p-7 sm:p-9">
              <div className="grid gap-3 sm:grid-cols-2">
                {beneficiosCurso.map((beneficio) => (
                  <div
                    key={beneficio}
                    className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <span className="mt-0.5 text-sm font-black text-green-600">
                      ✓
                    </span>
                    <span className="text-sm font-bold leading-6 text-slate-700">
                      {beneficio}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20curso%20ChatGPT%20do%20Zero%20ao%20Avan%C3%A7ado."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-[#075BC7] px-6 py-3 text-center text-sm font-black text-white transition hover:bg-[#064da8]"
                >
                  Quero conhecer o curso
                </a>

                <Link
                  href="/contato"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-black text-[#092A56] transition hover:bg-slate-50"
                >
                  Falar com a ALMS
                </Link>
              </div>
            </div>
          </article>
        </div>

        <div id="produtos" className="scroll-mt-24 pt-16">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-orange-600">
              Loja digital
            </p>

            <h3 className="mt-4 text-3xl font-black tracking-[-0.03em] text-[#092A56]">
              Uma estrutura preparada para novos produtos.
            </h3>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              O portal poderá reunir cursos, e-books, guias, modelos e outros
              materiais desenvolvidos pela ALMS PRIME.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {produtos.map((produto) => (
              <article
                key={produto.code}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="inline-flex rounded-xl bg-orange-50 px-3 py-2 text-xs font-black text-orange-700">
                  {produto.code}
                </div>

                <h4 className="mt-5 text-xl font-black text-[#092A56]">
                  {produto.title}
                </h4>

                <p className="mt-3 leading-7 text-slate-600">
                  {produto.description}
                </p>

                <span className="mt-5 inline-flex text-sm font-black text-orange-700">
                  Novidades em breve
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}