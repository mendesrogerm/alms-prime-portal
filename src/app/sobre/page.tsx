import { PageHero } from "../../components/PageHero";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

const valores = [
  "Organização de processos",
  "Soluções digitais sob medida",
  "Simplicidade para o usuário final",
  "Dados claros para tomada de decisão",
  "Evolução contínua dos projetos",
  "Integração entre operação e tecnologia",
];

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="relative overflow-hidden bg-[#071b2d] px-6 py-6 text-white sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.20),transparent_34%),linear-gradient(135deg,#020617_0%,#07111f_52%,#020617_100%)]" />

        <SiteHeader />

        <PageHero
          eyebrow="Sobre a ALMS Prime"
          title="Tecnologia aplicada à gestão, operação e crescimento."
          description="A marca ALMS Prime nasceu para transformar ideias, processos e necessidades operacionais em soluções digitais práticas. O portal institucional será a central do ecossistema ALMS Prime, reunindo projetos próprios, sistemas comerciais, módulos internos e novas soluções."
        />
      </section>

      <section className="-mt-6 px-6 pb-20 pt-12 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              O que guia nossos projetos
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              O foco é criar sistemas que ajudem negócios a organizar
              informações, acompanhar resultados, automatizar rotinas e tomar
              decisões com mais segurança.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {valores.map((valor) => (
              <div
                key={valor}
                className="rounded-3xl border border-slate-200 bg-white p-6"
              >
                <p className="font-bold text-slate-900">{valor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}






