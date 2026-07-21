import {
  portalEditorialItems,
  type PortalAccent,
} from "../../data/portal-content";

const accentStyles: Record<
  PortalAccent,
  {
    badge: string;
    line: string;
  }
> = {
  blue: {
    badge: "bg-blue-50 text-blue-700",
    line: "bg-blue-500",
  },
  green: {
    badge: "bg-emerald-50 text-emerald-700",
    line: "bg-emerald-500",
  },
  cyan: {
    badge: "bg-cyan-50 text-cyan-700",
    line: "bg-cyan-500",
  },
  violet: {
    badge: "bg-violet-50 text-violet-700",
    line: "bg-violet-500",
  },
  orange: {
    badge: "bg-orange-50 text-orange-700",
    line: "bg-orange-500",
  },
};

export function PortalNews() {
  return (
    <section
      id="novidades"
      className="scroll-mt-24 bg-white px-6 py-16 sm:px-10 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#075BC7]">
              Conteúdo e novidades
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-[#092A56] sm:text-4xl">
              Informação para acompanhar tecnologia, gestão e projetos.
            </h2>
          </div>

          <p className="text-lg leading-8 text-slate-600">
            A área editorial será utilizada para publicar orientações, análises,
            atualizações e conteúdos relacionados ao ecossistema ALMS PRIME.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {portalEditorialItems.map((item) => {
            const styles = accentStyles[item.accent];

            return (
              <article
                key={item.title}
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${styles.line}`}
                />

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${styles.badge}`}
                >
                  {item.category}
                </span>

                <h3 className="mt-6 text-xl font-black leading-8 text-[#092A56]">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {item.description}
                </p>

                <p className="mt-6 text-sm font-black text-slate-400">
                  {item.status}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}