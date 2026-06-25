import { PageHero } from "../../components/PageHero";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

const canais = [
  {
    titulo: "WhatsApp",
    texto: "Canal principal para conversar com a equipe ALMS Prime.",
    href: "https://wa.me/5511964073364",
    botao: "Chamar no WhatsApp",
  },
  {
    titulo: "Área interna",
    texto: "Acesso reservado aos módulos e sistemas internos do portal.",
    href: "/login",
    botao: "Acessar área interna",
  },
  {
    titulo: "Sistemas",
    texto: "Veja os projetos e sistemas disponíveis no ecossistema ALMS Prime.",
    href: "/sistemas",
    botao: "Ver sistemas",
  },
];

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="relative overflow-hidden bg-[#071b2d] px-6 py-8 text-white sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.20),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_34%),linear-gradient(135deg,#020617_0%,#07111f_52%,#020617_100%)]" />

        <SiteHeader />

        <PageHero
          eyebrow="Contato"
          title="Fale com a ALMS Prime e avance seu próximo projeto digital."
          description="Use esta área para acessar os canais principais da ALMS Prime, conversar sobre novas soluções, acessar sistemas ou conhecer os projetos disponíveis."
        />
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {canais.map((canal) => (
            <a
              key={canal.titulo}
              href={canal.href}
              target={canal.href.startsWith("http") ? "_blank" : undefined}
              rel={canal.href.startsWith("http") ? "noreferrer" : undefined}
              className="rounded-[2rem] border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-emerald-300/10"
            >
              <h2 className="text-2xl font-black">{canal.titulo}</h2>
              <p className="mt-4 leading-7 text-slate-700">{canal.texto}</p>
              <div className="mt-7 text-sm font-black uppercase tracking-wide text-emerald-200">
                {canal.botao} →
              </div>
            </a>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}



