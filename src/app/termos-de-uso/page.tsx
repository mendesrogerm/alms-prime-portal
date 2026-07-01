import type { Metadata } from "next";
import { PageHero } from "../../components/PageHero";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de Uso do portal ALMS Prime, incluindo regras gerais de navegação, acesso, sistemas, links externos e contato comercial.",
};

const secoes = [
  {
    titulo: "1. Aceitação dos termos",
    texto:
      "Ao acessar o portal da ALMS Prime, o usuário declara estar ciente destes Termos de Uso e concorda com as condições gerais de navegação, acesso às páginas, utilização de links e contato pelos canais disponibilizados.",
  },
  {
    titulo: "2. Finalidade do portal",
    texto:
      "O portal ALMS Prime tem finalidade institucional e comercial, apresentando soluções digitais, sistemas, portais, automações, dashboards, projetos sob medida e canais de contato relacionados ao ecossistema ALMS Prime.",
  },
  {
    titulo: "3. Acesso a sistemas e área interna",
    texto:
      "Algumas áreas, sistemas ou módulos podem exigir autenticação, autorização prévia ou credenciais específicas. O usuário é responsável por manter seus dados de acesso protegidos e não compartilhar credenciais com terceiros.",
  },
  {
    titulo: "4. Uso adequado",
    texto:
      "O usuário se compromete a utilizar o portal de forma adequada, sem tentar comprometer a segurança, explorar falhas, acessar áreas não autorizadas, prejudicar o funcionamento dos sistemas ou utilizar as informações para finalidades indevidas.",
  },
  {
    titulo: "5. Informações apresentadas",
    texto:
      "As informações do portal podem ser atualizadas, ajustadas ou removidas a qualquer momento. A ALMS Prime busca manter os conteúdos claros e corretos, mas não garante que todas as informações estejam permanentemente livres de erros, indisponibilidades ou alterações.",
  },
  {
    titulo: "6. Links externos",
    texto:
      "O portal pode conter links para WhatsApp, sistemas externos, subdomínios, plataformas de terceiros ou serviços conectados. Ao acessar esses ambientes, o usuário também estará sujeito às regras, políticas e termos das respectivas plataformas.",
  },
  {
    titulo: "7. Propriedade intelectual",
    texto:
      "Textos, identidade visual, estrutura das páginas, componentes, sistemas, fluxos, layouts e demais elementos do portal pertencem à ALMS Prime ou são utilizados de forma autorizada, não podendo ser copiados, reproduzidos ou explorados sem autorização.",
  },
  {
    titulo: "8. Projetos e propostas comerciais",
    texto:
      "Informações sobre soluções, sistemas ou projetos sob medida apresentadas no portal têm caráter informativo. Condições comerciais, prazos, escopo, valores e entregas devem ser definidos em conversa específica, proposta ou acordo entre as partes.",
  },
  {
    titulo: "9. Limitação de responsabilidade",
    texto:
      "A ALMS Prime não se responsabiliza por danos decorrentes de uso indevido do portal, falhas de conexão, indisponibilidades temporárias, uso incorreto de informações, ações de terceiros ou acessos realizados fora dos canais oficiais.",
  },
  {
    titulo: "10. Alterações dos termos",
    texto:
      "Estes Termos de Uso podem ser atualizados periodicamente para refletir mudanças no portal, nos sistemas, nos serviços oferecidos ou em necessidades operacionais da ALMS Prime.",
  },
];

export default function TermosDeUsoPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="relative overflow-hidden bg-[#071b2d] px-6 py-6 text-white sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.26),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_32%),linear-gradient(135deg,#082033_0%,#0d3148_52%,#061728_100%)]" />

        <div className="relative">
          <SiteHeader />

          <PageHero
            eyebrow="Termos"
            title="Termos de Uso"
            description="Confira as condições gerais de navegação, acesso, uso de sistemas, links externos e canais digitais do portal ALMS Prime."
          />
        </div>
      </section>

      <section className="-mt-6 px-6 pb-20 pt-12 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/30">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-700">
              ALMS Prime
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Uso responsável dos canais digitais
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              Estes termos organizam as condições gerais de uso do portal,
              páginas institucionais, sistemas conectados e canais comerciais da
              ALMS Prime.
            </p>

            <div className="mt-6 rounded-3xl border border-cyan-200 bg-cyan-50 p-5">
              <p className="text-sm font-bold leading-7 text-cyan-900">
                Última atualização: junho de 2026.
              </p>
            </div>

            <a
              href="/politica-de-privacidade"
              className="mt-6 inline-flex rounded-full border border-slate-300 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-50"
            >
              Ver privacidade
            </a>
          </aside>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/30 sm:p-10">
            <div className="space-y-8">
              {secoes.map((secao) => (
                <section key={secao.titulo}>
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">
                    {secao.titulo}
                  </h2>

                  <p className="mt-3 leading-8 text-slate-700">{secao.texto}</p>
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-2xl font-black text-slate-950">
                Dúvidas sobre estes termos
              </h2>

              <p className="mt-3 leading-8 text-slate-700">
                Para dúvidas sobre estes Termos de Uso, canais digitais ou
                sistemas da ALMS Prime, entre em contato pelo WhatsApp oficial.
              </p>

              <a
                href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20os%20Termos%20de%20Uso%20da%20ALMS%20Prime."
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-full bg-emerald-400 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
              >
                Falar com a ALMS Prime
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
