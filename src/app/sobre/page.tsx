import type { Metadata } from "next";
import { PageHero } from "../../components/PageHero";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";


export const metadata: Metadata = {
  title: "Sobre a ALMS Prime",
  description:
    "Conheça a ALMS Prime, marca de tecnologia, gestão e soluções digitais criada para transformar processos em sistemas, portais e automações.",
};
const pilares = [
  {
    titulo: "Tecnologia aplicada",
    descricao:
      "A ALMS Prime transforma necessidades reais em soluções digitais práticas, com foco em uso diário, organização e evolução contínua.",
  },
  {
    titulo: "Gestão simplificada",
    descricao:
      "O objetivo é tirar processos do improviso e levar informações importantes para sistemas, painéis e fluxos mais organizados.",
  },
  {
    titulo: "Soluções sob medida",
    descricao:
      "Cada projeto pode ser estruturado conforme o momento da operação: começando pelo essencial e evoluindo com novos módulos.",
  },
];

const diferenciais = [
  "Visão prática de operação, não apenas visual de site.",
  "Foco em sistemas úteis, simples de usar e preparados para crescer.",
  "Organização de processos comerciais, financeiros e administrativos.",
  "Integração entre presença digital, sistemas internos e atendimento.",
  "Construção por etapas, reduzindo complexidade e acelerando entregas.",
  "Atenção à clareza das telas, navegação e experiência do usuário.",
];

const principios = [
  {
    numero: "01",
    titulo: "Clareza antes de complexidade",
    descricao:
      "Antes de adicionar funcionalidades, entendemos o fluxo real e organizamos o essencial para evitar sistemas confusos.",
  },
  {
    numero: "02",
    titulo: "Entrega com utilidade real",
    descricao:
      "Cada tela precisa ter função prática: organizar, vender, controlar, acompanhar ou facilitar uma rotina.",
  },
  {
    numero: "03",
    titulo: "Evolução por módulos",
    descricao:
      "A base digital pode começar simples e receber novas áreas conforme o negócio cresce e novas necessidades aparecem.",
  },
  {
    numero: "04",
    titulo: "Operação mais profissional",
    descricao:
      "O foco final é ajudar empresas e projetos a trabalharem com mais controle, previsibilidade e imagem profissional.",
  },
];

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="relative overflow-hidden bg-[#071b2d] px-6 py-6 text-white sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.26),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_32%),linear-gradient(135deg,#082033_0%,#0d3148_52%,#061728_100%)]" />

        <div className="relative">
          <SiteHeader />

          <PageHero
            eyebrow="Sobre"
            title="Uma marca criada para transformar processos em soluções digitais"
            description="A ALMS Prime une tecnologia, gestão e visão operacional para criar sistemas, portais, automações e projetos digitais que ajudam negócios a se organizarem melhor."
          />
        </div>
      </section>

      <section className="-mt-6 px-6 pb-20 pt-12 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/30 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-700">
              Quem somos
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              A ALMS Prime nasceu para organizar ideias, operações e negócios em ambiente digital.
            </h2>

            <div className="mt-6 space-y-5 leading-8 text-slate-700">
              <p>
                A marca ALMS Prime atua no desenvolvimento de soluções digitais
                com foco em gestão, automação, presença online e organização
                operacional.
              </p>

              <p>
                O propósito é simples: transformar rotinas manuais, informações
                espalhadas e processos improvisados em sistemas, portais e
                painéis mais claros, acessíveis e profissionais.
              </p>

              <p>
                Mais do que criar telas bonitas, a ALMS Prime busca construir
                ferramentas que ajudem na operação real do negócio: clientes,
                vendas, vencimentos, financeiro, relatórios, atendimento e
                acompanhamento de resultados.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/solucoes"
                className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-black uppercase tracking-wide text-white transition hover:-translate-y-1 hover:bg-cyan-500 hover:text-slate-950"
              >
                Conhecer soluções
              </a>

              <a
                href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20vim%20pela%20p%C3%A1gina%20sobre%20da%20ALMS%20Prime%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-50"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="grid gap-6">
            {pilares.map((pilar) => (
              <div
                key={pilar.titulo}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-300/30"
              >
                <h3 className="text-2xl font-black text-slate-950">
                  {pilar.titulo}
                </h3>

                <p className="mt-4 leading-7 text-slate-700">
                  {pilar.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/30 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-700">
              Diferenciais
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              O que diferencia a ALMS Prime
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              A construção dos projetos combina visão técnica com entendimento
              prático de operação, gestão e comunicação comercial.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {diferenciais.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <p className="leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-300/30">
          <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-[#071b2d] p-8 text-white sm:p-10">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
                Como trabalhamos
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Menos improviso. Mais estrutura.
              </h2>

              <p className="mt-5 leading-8 text-slate-200">
                A ALMS Prime trabalha com uma visão progressiva: primeiro
                organiza o que é essencial, depois evolui o projeto com novas
                funcionalidades, relatórios, integrações e melhorias.
              </p>

              <a
                href="/sistemas"
                className="mt-8 inline-flex rounded-full bg-cyan-300 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-200"
              >
                Ver ecossistema
              </a>
            </div>

            <div className="grid gap-4 p-8 sm:p-10 md:grid-cols-2">
              {principios.map((item) => (
                <div
                  key={item.numero}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-sm font-black text-cyan-700">
                    {item.numero}
                  </div>

                  <h3 className="text-xl font-black text-slate-950">
                    {item.titulo}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-700">
                    {item.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-300/30 sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-700">
            Próximo passo
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Quer tirar uma ideia do papel ou organizar melhor sua operação?
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-700">
            Converse com a ALMS Prime para avaliar possibilidades, entender
            prioridades e estruturar uma solução digital adequada ao momento do
            seu negócio.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20com%20a%20ALMS%20Prime%20sobre%20uma%20solu%C3%A7%C3%A3o%20digital."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
            >
              Chamar no WhatsApp
            </a>

            <a
              href="/contato"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-50"
            >
              Ir para contato
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

