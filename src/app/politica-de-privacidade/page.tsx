import type { Metadata } from "next";
import { PageHero } from "../../components/PageHero";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de Privacidade da ALMS Prime sobre coleta, uso e proteção de informações em seus canais digitais.",
};

const secoes = [
  {
    titulo: "1. Informações coletadas",
    texto:
      "A ALMS Prime pode coletar informações fornecidas voluntariamente pelo usuário ao entrar em contato pelo WhatsApp, acessar páginas do portal, solicitar informações, demonstrações ou projetos digitais.",
  },
  {
    titulo: "2. Uso das informações",
    texto:
      "As informações podem ser utilizadas para responder solicitações, prestar atendimento, apresentar soluções, organizar contatos comerciais, melhorar serviços e dar continuidade a conversas iniciadas pelo próprio usuário.",
  },
  {
    titulo: "3. Compartilhamento de dados",
    texto:
      "A ALMS Prime não comercializa dados pessoais. Informações poderão ser compartilhadas apenas quando necessário para operação técnica, cumprimento de obrigações legais ou execução de serviços solicitados pelo usuário.",
  },
  {
    titulo: "4. WhatsApp e canais externos",
    texto:
      "Ao clicar em links de WhatsApp ou acessar sistemas externos conectados ao ecossistema ALMS Prime, o usuário também estará sujeito às políticas e termos das respectivas plataformas utilizadas.",
  },
  {
    titulo: "5. Segurança",
    texto:
      "A ALMS Prime adota boas práticas para proteger informações, mas nenhum ambiente digital é totalmente isento de riscos. O usuário deve evitar enviar senhas, dados sensíveis ou informações desnecessárias pelos canais de contato.",
  },
  {
    titulo: "6. Cookies e tecnologias similares",
    texto:
      "O portal pode utilizar recursos técnicos necessários para funcionamento, análise de acesso, desempenho, segurança e melhoria da experiência de navegação.",
  },
  {
    titulo: "7. Direitos do usuário",
    texto:
      "O usuário pode solicitar informações, atualização ou remoção de dados fornecidos nos canais da ALMS Prime, respeitando obrigações legais, registros operacionais e necessidades legítimas de atendimento.",
  },
  {
    titulo: "8. Alterações nesta política",
    texto:
      "Esta política pode ser atualizada periodicamente para refletir mudanças nos serviços, sistemas, tecnologias ou requisitos legais aplicáveis.",
  },
];

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="relative overflow-hidden bg-[#071b2d] px-6 py-6 text-white sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.26),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_32%),linear-gradient(135deg,#082033_0%,#0d3148_52%,#061728_100%)]" />

        <div className="relative">
          <SiteHeader />

          <PageHero
            eyebrow="Privacidade"
            title="Política de Privacidade"
            description="Entenda como a ALMS Prime trata informações fornecidas por usuários em seus canais digitais, páginas institucionais, sistemas e contatos comerciais."
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
              Compromisso com transparência
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              Esta política apresenta, de forma simples, como informações podem
              ser utilizadas nos canais digitais da ALMS Prime.
            </p>

            <div className="mt-6 rounded-3xl border border-cyan-200 bg-cyan-50 p-5">
              <p className="text-sm font-bold leading-7 text-cyan-900">
                Última atualização: junho de 2026.
              </p>
            </div>

            <a
              href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20a%20Pol%C3%ADtica%20de%20Privacidade%20da%20ALMS%20Prime."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full bg-emerald-400 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
            >
              Tirar dúvida
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
                Canal de contato
              </h2>

              <p className="mt-3 leading-8 text-slate-700">
                Para dúvidas relacionadas a esta política ou ao tratamento de
                informações nos canais da ALMS Prime, entre em contato pelo
                WhatsApp oficial.
              </p>

              <a
                href="https://wa.me/5511964073364"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:-translate-y-1 hover:bg-cyan-500 hover:text-slate-950"
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
