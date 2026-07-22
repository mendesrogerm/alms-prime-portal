import Link from "next/link";
import {
  portalProjects,
  type PortalAccent,
  type PortalProject,
} from "../../data/portal-content";

const accentStyles: Record<
  PortalAccent,
  {
    badge: string;
    line: string;
    button: string;
  }
> = {
  blue: {
    badge: "bg-blue-50 text-blue-700",
    line: "bg-blue-500",
    button: "text-blue-700",
  },
  green: {
    badge: "bg-emerald-50 text-emerald-700",
    line: "bg-emerald-500",
    button: "text-emerald-700",
  },
  cyan: {
    badge: "bg-cyan-50 text-cyan-700",
    line: "bg-cyan-500",
    button: "text-cyan-700",
  },
  violet: {
    badge: "bg-violet-50 text-violet-700",
    line: "bg-violet-500",
    button: "text-violet-700",
  },
  orange: {
    badge: "bg-orange-50 text-orange-700",
    line: "bg-orange-500",
    button: "text-orange-700",
  },
};

function ProjectAction({ project }: { project: PortalProject }) {
  const className =
    "inline-flex items-center gap-2 text-sm font-black transition hover:gap-3";

  if (project.external) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} ${accentStyles[project.accent].button}`}
      >
        Conhecer projeto
        <span aria-hidden="true">↗</span>
      </a>
    );
  }

  return (
    <Link
      href={project.href}
      className={`${className} ${accentStyles[project.accent].button}`}
    >
      Acessar projeto
      <span aria-hidden="true">→</span>
    </Link>
  );
}

export function PortalProjects() {
  return (
    <section
      id="projetos"
      className="scroll-mt-24 bg-white px-6 py-16 sm:px-10 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#075BC7]">
              Ecossistema ALMS PRIME
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-[#092A56] sm:text-4xl">
              Projetos criados para transformar processos em soluções.
            </h2>
          </div>

          <p className="max-w-3xl text-lg leading-8 text-slate-600 lg:justify-self-end">
            Cada projeto nasce de uma necessidade concreta e evolui com foco em
            clareza, controle, produtividade e melhor tomada de decisão.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-6">
          {portalProjects.map((project, index) => {
            const styles = accentStyles[project.accent];

            return (
              <article
                key={project.name}
                className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
  index < 2 ? "xl:col-span-3" : "xl:col-span-2"
}`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${styles.line}`}
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${styles.badge}`}
                  >
                    {project.status}
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    {project.category}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-black text-[#092A56]">
                  {project.name}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {project.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-8">
                  <ProjectAction project={project} />
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/sistemas"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-black text-[#075BC7] transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100"
          >
            Ver todos os sistemas
          </Link>
        </div>
      </div>
    </section>
  );
}