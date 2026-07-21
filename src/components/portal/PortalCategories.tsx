import Link from "next/link";
import {
  portalCategories,
  type PortalAccent,
} from "../../data/portal-content";

const accentStyles: Record<
  PortalAccent,
  {
    badge: string;
    border: string;
    link: string;
  }
> = {
  blue: {
    badge: "bg-blue-50 text-blue-700",
    border: "hover:border-blue-300",
    link: "text-blue-700",
  },
  green: {
    badge: "bg-emerald-50 text-emerald-700",
    border: "hover:border-emerald-300",
    link: "text-emerald-700",
  },
  cyan: {
    badge: "bg-cyan-50 text-cyan-700",
    border: "hover:border-cyan-300",
    link: "text-cyan-700",
  },
  violet: {
    badge: "bg-violet-50 text-violet-700",
    border: "hover:border-violet-300",
    link: "text-violet-700",
  },
  orange: {
    badge: "bg-orange-50 text-orange-700",
    border: "hover:border-orange-300",
    link: "text-orange-700",
  },
};

export function PortalCategories() {
  return (
    <section
      id="categorias"
      className="scroll-mt-24 bg-[#F6F8FC] px-6 py-16 sm:px-10 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#075BC7]">
            Acesso rápido
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-[#092A56] sm:text-4xl">
            Encontre o que precisa dentro do ecossistema ALMS PRIME.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Navegue por sistemas, projetos, materiais de conhecimento, produtos
            digitais e atualizações da marca.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {portalCategories.map((category) => {
            const styles = accentStyles[category.accent];

            return (
              <Link
                key={category.code}
                href={category.href}
                className={`group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${styles.border}`}
              >
                <div
                  className={`inline-flex h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-black ${styles.badge}`}
                >
                  {category.code}
                </div>

                <h3 className="mt-6 text-xl font-black text-[#092A56]">
                  {category.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {category.description}
                </p>

                <div
                  className={`mt-6 inline-flex items-center gap-2 text-sm font-black ${styles.link}`}
                >
                  Acessar
                  <span
                    aria-hidden="true"
                    className="transition group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}