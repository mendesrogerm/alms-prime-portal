import type { Metadata } from "next";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Sistema de Gestão de Clientes",
  description:
    "Sistema ALMS Prime para controlar clientes, testes, planos, vencimentos, renovações, financeiro simples, servidores e mensagens comerciais.",
};

const dores = [
  "Clientes espalhados no WhatsApp, caderno ou planilha.",
  "Testes criados, mas sem controle claro de quem ainda está avaliando.",
  "Vencimentos esquecidos e renovações perdidas.",
  "Dificuldade para saber quem pagou, quem venceu e quem precisa de atenção.",
  "Mensagens comerciais repetidas digitadas manualmente todos os dias.",
  "Falta de visão clara sobre planos, servidores, receitas e operação.",
];

const modulos = [
  {
    titulo: "Clientes",
    descricao:
      "Cadastre clientes, contatos, observações, plano contratado, servidor e situação comercial.",
  },
  {
    titulo: "Testes",
    descricao:
      "Organize testes enviados, acompanhe prazos e identifique oportunidades de conversão.",
  },
  {
    titulo: "Vencimentos",
    descricao:
      "Veja clientes vencidos, vencendo hoje e próximos vencimentos para agir no momento certo.",
  },
  {
    titulo: "Planos",
    descricao:
      "Controle planos mensais, trimestrais, anuais e valores da operação.",
  },
  {
    titulo: "Financeiro simples",
    descricao:
      "Acompanhe entradas, renovações, pagamentos e visão básica de receita.",
  },
  {
    titulo: "Mensagens prontas",
    descricao:
      "Use textos comerciais padronizados para atendimento, teste, cobrança e renovação.",
  },
  {
    titulo: "Servidores",
    descricao:
      "Organize informações dos servidores utilizados e relacione cada cliente à estrutura correta.",
  },
  {
    titulo: "Painel WhatsApp",
    descricao:
      "Acompanhe solicitações, conversas e leads recebidos pelos fluxos comerciais.",
  },
];

const perdas = [
  {
    titulo: "Renovações esquecidas",
    descricao:
      "Quando o vencimento não aparece com clareza, o cliente pode vencer, parar de usar e não renovar.",
  },
  {
    titulo: "Testes sem follow-up",
    descricao:
      "Um teste enviado sem acompanhamento vira oportunidade perdida, mesmo quando o cliente tinha interesse.",
  },
  {
    titulo: "Atendimento repetitivo",
    descricao:
      "Digitar as mesmas mensagens todos os dias consome tempo e aumenta o risco de respostas incompletas.",
  },
  {
    titulo: "Falta de visão do negócio",
    descricao:
      "Sem painel, fica difícil saber quantos clientes estão ativos, vencidos, em teste ou próximos de renovar.",
  },
];

const beneficios = [
  "Menos esquecimento de vencimentos.",
  "Mais controle sobre testes e renovações.",
  "Atendimento mais rápido e padronizado.",
  "Visão clara de clientes ativos, vencidos e em teste.",
  "Organização comercial sem depender apenas de planilhas.",
  "Base preparada para evoluir com novos módulos.",
];

const publico = [
  "Revendedores e prestadores de serviços recorrentes.",
  "Operações que trabalham com clientes mensais.",
  "Quem envia testes antes de fechar assinatura.",
  "Quem precisa controlar pagamentos e vencimentos.",
  "Pequenos negócios que querem sair do improviso.",
  "Equipes que atendem pelo WhatsApp e precisam organizar leads.",
];

const comparativos = [
  {
    antes: "Clientes espalhados em conversas de WhatsApp, anotações e planilhas.",
    depois: "Clientes organizados em uma base central, com dados, plano, status e observações.",
  },
  {
    antes: "Testes enviados sem acompanhamento claro de prazo e retorno.",
    depois: "Testes controlados com visão de quem está avaliando e quem precisa de contato.",
  },
  {
    antes: "Vencimentos esquecidos e renovações perdidas por falta de alerta visual.",
    depois: "Vencimentos visíveis por período, facilitando cobrança, renovação e follow-up.",
  },
  {
    antes: "Pagamentos anotados manualmente, sem visão simples da receita.",
    depois: "Controle financeiro básico para acompanhar entradas, planos e renovações.",
  },
  {
    antes: "Mensagens digitadas do zero em cada atendimento.",
    depois: "Mensagens prontas para agilizar teste, venda, cobrança e renovação.",
  },
  {
    antes: "Operação dependente da memória e do improviso.",
    depois: "Rotina mais profissional, organizada e preparada para crescer.",
  },
];

const comparativoPlanilha = [
  {
    planilha: "Depende de preenchimento manual e disciplina diária.",
    sistema: "Centraliza a rotina em telas próprias para clientes, testes e vencimentos.",
  },
  {
    planilha: "Fácil de esquecer datas, retornos e renovações.",
    sistema: "Mostra vencimentos, testes e situações importantes com mais clareza.",
  },
  {
    planilha: "Não foi feita para atendimento comercial recorrente.",
    sistema: "Foi pensado para acompanhar clientes, planos, mensagens e renovações.",
  },
  {
    planilha: "Fica confusa conforme a base de clientes cresce.",
    sistema: "Mantém a operação mais organizada mesmo com mais clientes e informações.",
  },
];

const passosDemo = [
  {
    numero: "01",
    titulo: "Você chama no WhatsApp",
    descricao:
      "Explique como controla clientes hoje: planilha, WhatsApp, caderno ou outro sistema.",
  },
  {
    numero: "02",
    titulo: "Entendemos sua operação",
    descricao:
      "Avaliamos se o sistema faz sentido para sua rotina de clientes, testes, vencimentos e renovações.",
  },
  {
    numero: "03",
    titulo: "Apresentamos a solução",
    descricao:
      "Mostramos os módulos principais e como eles podem ajudar a organizar sua operação comercial.",
  },
  {
    numero: "04",
    titulo: "Definimos o melhor caminho",
    descricao:
      "Caso faça sentido, alinhamos próximos passos, acesso, ajustes necessários e evolução por etapas.",
  },
];

const perguntas = [
  {
    pergunta: "Esse sistema substitui minha planilha?",
    resposta:
      "Sim. A ideia é tirar o controle principal da planilha e centralizar clientes, testes, planos, vencimentos e financeiro simples em um ambiente mais organizado.",
  },
  {
    pergunta: "Serve apenas para IPTV?",
    resposta:
      "Não. A estrutura foi pensada para operações recorrentes, clientes mensais, testes, renovações e controle comercial. Pode ser adaptada para outros serviços recorrentes.",
  },
  {
    pergunta: "Tem controle financeiro completo?",
    resposta:
      "O foco inicial é financeiro simples: entradas, planos, pagamentos, renovações e visão operacional. Módulos financeiros mais avançados podem ser evoluídos por etapa.",
  },
  {
    pergunta: "Funciona pelo celular?",
    resposta:
      "Sim. O sistema é web e pode ser acessado pelo navegador em computador, notebook, tablet ou celular.",
  },
];

export default function GestaoDeClientesPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="relative overflow-hidden bg-[#071b2d] px-6 py-6 text-white sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.30),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.24),transparent_32%),linear-gradient(135deg,#082033_0%,#0d3148_52%,#061728_100%)]" />

        <div className="relative">
          <SiteHeader />

          <div className="mx-auto grid max-w-7xl items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
            <div>
              <div className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-300/10 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
                Sistema de gestão comercial
              </div>

              <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Controle clientes, testes, vencimentos e renovações em um só lugar.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
                O sistema ALMS Prime Gestão de Clientes foi criado para quem
                vende serviços recorrentes e precisa parar de perder informações
                no WhatsApp, caderno ou planilha.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20quero%20conhecer%20o%20sistema%20ALMS%20Prime%20Gest%C3%A3o%20de%20Clientes."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-400 px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-slate-950 shadow-2xl shadow-emerald-950/20 transition hover:-translate-y-1 hover:bg-emerald-300"
                >
                  Solicitar demonstração
                </a>

                <a
                  href="#modulos"
                  className="rounded-full border border-white/20 px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white transition hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-cyan-300/10"
                >
                  Ver módulos
                </a>
              </div>

              <div className="mt-9 grid max-w-3xl gap-4 sm:grid-cols-3">
                {[
                  ["Clientes", "organizados"],
                  ["Testes", "controlados"],
                  ["Renovações", "no prazo"],
                ].map(([numero, texto]) => (
                  <div
                    key={numero}
                    className="rounded-3xl border border-white/10 bg-white/[0.07] p-5"
                  >
                    <p className="text-2xl font-black text-cyan-200">
                      {numero}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-300">
                      {texto}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-cyan-400/10 blur-3xl" />

              <div className="relative rounded-[2rem] border border-cyan-200/15 bg-white/[0.09] p-5 shadow-2xl shadow-black/40 backdrop-blur">
                <div className="rounded-[1.5rem] border border-cyan-200/15 bg-slate-900/80 p-6">
                  <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <p className="text-sm font-bold text-cyan-200">
                        Painel comercial
                      </p>
                      <p className="text-sm text-slate-400">
                        Clientes, testes e vencimentos
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">
                      Online
                    </span>
                  </div>

                  <div className="grid gap-4">
                    {[
                      ["Clientes ativos", "128"],
                      ["Testes em andamento", "17"],
                      ["Vencem hoje", "06"],
                      ["Renovações próximas", "24"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                      >
                        <span className="font-semibold text-slate-200">
                          {label}
                        </span>
                        <span className="text-2xl font-black text-cyan-200">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                    <p className="text-sm font-bold text-emerald-200">
                      Operação mais clara, atendimento mais rápido e menos
                      renovações esquecidas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-700">
              Dor do negócio
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Você ainda controla sua operação no improviso?
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              Quando clientes, testes, vencimentos e pagamentos ficam espalhados,
              a operação começa a perder vendas, tempo e previsibilidade.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {dores.map((dor) => (
              <div
                key={dor}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-300/30"
              >
                <p className="leading-7 text-slate-700">{dor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-700">
              Antes x Depois
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Saia do improviso e leve sua operação para um controle profissional.
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              O sistema não serve apenas para cadastrar clientes. Ele ajuda a
              mudar a forma como você acompanha testes, vencimentos, pagamentos,
              mensagens e renovações.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {comparativos.map((item) => (
              <div
                key={item.antes}
                className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-300/30 md:grid-cols-2"
              >
                <div className="border-b border-slate-200 bg-slate-50 p-6 md:border-b-0 md:border-r">
                  <div className="mb-4 inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-rose-700">
                    Antes
                  </div>

                  <p className="leading-7 text-slate-700">{item.antes}</p>
                </div>

                <div className="bg-cyan-50 p-6">
                  <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-700">
                    Depois
                  </div>

                  <p className="leading-7 text-slate-800">{item.depois}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] border border-cyan-200 bg-white p-8 text-center shadow-xl shadow-slate-300/30">
            <h3 className="text-3xl font-black tracking-tight text-slate-950">
              Sua operação não precisa depender da memória.
            </h3>

            <p className="mx-auto mt-4 max-w-3xl leading-8 text-slate-700">
              Com uma base organizada, você ganha clareza para vender melhor,
              acompanhar clientes e agir antes de perder uma renovação.
            </p>

            <a
              href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20quero%20sair%20da%20planilha%20e%20conhecer%20o%20sistema%20ALMS%20Prime%20Gest%C3%A3o%20de%20Clientes."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex rounded-full bg-emerald-400 px-7 py-4 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
            >
              Quero organizar minha operação
            </a>
          </div>
        </div>
      </section>

      <section
        id="modulos"
        className="bg-white px-6 py-20 sm:px-10 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-700">
              Módulos
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Tudo que você precisa para organizar a gestão comercial.
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              A plataforma reúne os principais controles da operação em telas
              simples, diretas e preparadas para uso diário.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {modulos.map((modulo) => (
              <article
                key={modulo.titulo}
                className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-cyan-50"
              >
                <h3 className="text-xl font-black text-slate-950">
                  {modulo.titulo}
                </h3>

                <p className="mt-4 leading-7 text-slate-700">
                  {modulo.descricao}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-300/30">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-[#071b2d] p-8 text-white sm:p-10">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300">
                Custo do improviso
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Quanto custa não controlar sua operação?
              </h2>

              <p className="mt-5 leading-8 text-slate-200">
                O problema nem sempre é falta de cliente. Muitas vezes, a perda
                está na falta de controle: teste sem retorno, renovação esquecida,
                vencimento perdido e atendimento sem padrão.
              </p>

              <a
                href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20quero%20entender%20como%20o%20sistema%20ALMS%20Prime%20pode%20ajudar%20a%20reduzir%20perdas%20na%20minha%20opera%C3%A7%C3%A3o."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-full bg-emerald-400 px-7 py-4 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
              >
                Reduzir perdas agora
              </a>
            </div>

            <div className="grid gap-4 p-8 sm:p-10 md:grid-cols-2">
              {perdas.map((perda) => (
                <div
                  key={perda.titulo}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <h3 className="text-xl font-black text-slate-950">
                    {perda.titulo}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-700">
                    {perda.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/30 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-700">
              Benefícios
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              O que muda na operação
            </h2>

            <div className="mt-8 grid gap-4">
              {beneficios.map((beneficio) => (
                <div
                  key={beneficio}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-700"
                >
                  {beneficio}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/30 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-700">
              Para quem é
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Ideal para quem trabalha com recorrência
            </h2>

            <div className="mt-8 grid gap-4">
              {publico.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-700">
              Planilha x Sistema
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Planilha ajuda no começo. Sistema ajuda a operação crescer.
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              A planilha pode funcionar quando há poucos clientes. Mas, quando
              entram testes, vencimentos, planos, pagamentos e mensagens, o
              controle manual começa a custar tempo e oportunidades.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-300/30">
            <div className="grid bg-slate-950 text-white md:grid-cols-2">
              <div className="p-5 text-sm font-black uppercase tracking-wide text-rose-200">
                Controle em planilha
              </div>

              <div className="border-t border-white/10 p-5 text-sm font-black uppercase tracking-wide text-cyan-200 md:border-l md:border-t-0">
                Controle em sistema
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {comparativoPlanilha.map((item) => (
                <div key={item.planilha} className="grid md:grid-cols-2">
                  <div className="bg-rose-50 p-6">
                    <p className="leading-7 text-slate-700">{item.planilha}</p>
                  </div>

                  <div className="border-t border-slate-200 bg-cyan-50 p-6 md:border-l md:border-t-0">
                    <p className="font-semibold leading-7 text-slate-800">
                      {item.sistema}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-300/30">
            <h3 className="text-3xl font-black tracking-tight text-slate-950">
              A planilha guarda dados. O sistema ajuda a agir.
            </h3>

            <p className="mx-auto mt-4 max-w-3xl leading-8 text-slate-700">
              O objetivo é transformar informação em rotina: acompanhar,
              cobrar, renovar, atender e vender com mais organização.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-700">
                Demonstração
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Como funciona a demonstração?
              </h2>

              <p className="mt-5 leading-8 text-slate-700">
                O objetivo não é empurrar um sistema. É entender sua operação e
                mostrar se a solução realmente ajuda a organizar sua rotina.
              </p>
            </div>

            <a
              href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20quero%20agendar%20uma%20demonstra%C3%A7%C3%A3o%20do%20sistema%20ALMS%20Prime%20Gest%C3%A3o%20de%20Clientes."
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit rounded-full bg-emerald-400 px-7 py-4 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
            >
              Agendar demonstração
            </a>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {passosDemo.map((passo) => (
              <div
                key={passo.numero}
                className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-cyan-50"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-sm font-black text-cyan-700">
                  {passo.numero}
                </div>

                <h3 className="text-xl font-black text-slate-950">
                  {passo.titulo}
                </h3>

                <p className="mt-4 leading-7 text-slate-700">
                  {passo.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#071b2d] px-6 py-20 text-white sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
              Demonstração
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Veja se o sistema faz sentido para sua operação.
            </h2>

            <p className="mt-5 leading-8 text-slate-200">
              Chame no WhatsApp, explique como você controla clientes hoje e
              veja como a ALMS Prime pode ajudar a organizar sua rotina comercial.
            </p>

            <a
              href="https://wa.me/5511964073364?text=Ol%C3%A1%2C%20quero%20uma%20demonstra%C3%A7%C3%A3o%20do%20sistema%20ALMS%20Prime%20Gest%C3%A3o%20de%20Clientes."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-emerald-400 px-7 py-4 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
            >
              Chamar no WhatsApp
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {perguntas.map((item) => (
              <div
                key={item.pergunta}
                className="rounded-3xl border border-white/10 bg-white/[0.07] p-6"
              >
                <h3 className="text-lg font-black text-white">
                  {item.pergunta}
                </h3>

                <p className="mt-3 leading-7 text-slate-300">
                  {item.resposta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}








