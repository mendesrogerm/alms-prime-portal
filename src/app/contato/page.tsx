import type { Metadata } from "next";
import { PageHero } from "../../components/PageHero";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";


export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a ALMS Prime pelo WhatsApp, conheça os sistemas disponíveis, acesse a área interna ou solicite um projeto digital sob medida.",
};
const canais = [
  {
    titulo: "Falar pelo WhatsApp",
    descricao:
      "Canal direto para dúvidas, solicitações comerciais, demonstrações e projetos sob medida.",
    href: "https://wa.me/5511964073364?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20ALMS%20Prime%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.",
    cta: "Chamar no WhatsApp",
    destaque: "Atendimento direto",
  },
  {
    titulo: "Conhecer os sistemas",
    descricao:
      "Veja os projetos digitais, sistemas de gestão e portais já disponíveis no ecossistema ALMS Prime.",
    href: "/sistemas",
    cta: "Ver sistemas",
    destaque: "Ecossistema ALMS",
  },
  {
    titulo: "Área interna",
    descricao:
      "Acesse a área restrita do portal para autenticação e entrada nos sistemas conectados.",
    href: "/login",
    cta: "Acessar área interna",
    destaque: "Login",
  },
];

const motivos = [
  "Criar um sistema para organizar clientes, testes, planos e vencimentos.",
  "Desenvolver um portal institucional para apresentar serviços e projetos.",
  "Automatizar etapas comerciais, atendimento e rotinas operacionais.",
  "Construir dashboards, relatórios e painéis de controle para tomada de decisão.",
];

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="relative overflow-hidden bg-[#071b2d] px-6 py-6 text-white sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.26),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_32%),linear-gradient(135deg,#082033_0%,#0d3148_52%,#061728_100%)]" />

        <div className="relative">
          <SiteHeader />

          <PageHero
            eyebrow="Contato"
            title="Fale com a ALMS Prime"
            description="Entre em contato para conhecer soluções digitais, acessar sistemas, solicitar demonstrações ou iniciar um projeto sob medida para sua operação."
          />
        </div>
      </section>

      <section className="-mt-6 px-6 pb-20 pt-12 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {canais.map((canal) => (
            <a
              key={canal.titulo}
              href={canal.href}
              target={canal.href.startsWith("http") ? "_blank" : undefined}
              rel={canal.href.startsWith("http") ? "noreferrer" : undefined}
              className="group rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-300/30 transition hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-2xl hover:shadow-cyan-900/10"
            >
              <div className="mb-5 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-700">
                {canal.destaque}
              </div>

              <h2 className="text-2xl font-black text-slate-950">
                {canal.titulo}
              </h2>

              <p className="mt-4 leading-7 text-slate-700">
                {canal.descricao}
              </p>

              <div className="mt-7 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition group-hover:bg-cyan-500 group-hover:text-slate-950">
                {canal.cta}
              </div>
            </a>
          ))}
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/30">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-700">
              Projetos sob medida
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Precisa de uma solução específica para sua operação?
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              A ALMS Prime pode estruturar soluções digitais para organizar
              processos, centralizar informações, automatizar rotinas e melhorar
              a gestão comercial da sua empresa.
            </p>

            <a
              href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20um%20projeto%20sob%20medida%20com%20a%20ALMS%20Prime."
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full bg-emerald-400 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
            >
              Solicitar projeto
            </a>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/30">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-700">
              Como podemos ajudar
            </p>

            <div className="mt-6 space-y-4">
              {motivos.map((motivo) => (
                <div
                  key={motivo}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="leading-7 text-slate-700">{motivo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

