"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Sentimento = {
  valor: number;
  classificacao_original: string;
  classificacao: string;
  atualizado_em: string;
  proxima_atualizacao_segundos: string | null;
  analise: {
    nivel: string;
    cor: string;
    resumo: string;
    estrategia: string;
  };
};

const faixas = [
  {
    nome: "Medo Extremo",
    intervalo: "0–24",
    leitura:
      "Mercado com forte aversão ao risco. Pode haver pânico, liquidações e oportunidades seletivas.",
  },
  {
    nome: "Medo",
    intervalo: "25–44",
    leitura:
      "Mercado cauteloso. Investidores evitam risco e reagem com força a notícias negativas.",
  },
  {
    nome: "Neutro",
    intervalo: "45–55",
    leitura:
      "Mercado sem emoção dominante. Melhor aguardar confirmação de tendência.",
  },
  {
    nome: "Ganância",
    intervalo: "56–74",
    leitura:
      "Mercado otimista. Pode haver continuidade de alta, mas o risco de euforia aumenta.",
  },
  {
    nome: "Ganância Extrema",
    intervalo: "75–100",
    leitura:
      "Mercado eufórico. Tendência pode seguir forte, mas correções bruscas ficam mais prováveis.",
  },
];

function classeDoIndicador(cor: string) {
  if (cor === "red") return "border-red-500/50 bg-red-950/30 text-red-200";
  if (cor === "orange") return "border-orange-500/50 bg-orange-950/30 text-orange-200";
  if (cor === "emerald") return "border-emerald-500/50 bg-emerald-950/30 text-emerald-200";
  if (cor === "cyan") return "border-cyan-500/50 bg-cyan-950/30 text-cyan-200";

  return "border-slate-600 bg-slate-900 text-slate-200";
}

function classeDoNumero(cor: string) {
  if (cor === "red") return "text-red-400";
  if (cor === "orange") return "text-orange-400";
  if (cor === "emerald") return "text-emerald-400";
  if (cor === "cyan") return "text-cyan-300";

  return "text-slate-200";
}

export default function SentimentoCriptoPage() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sentimento, setSentimento] = useState<Sentimento | null>(null);

  useEffect(() => {
    verificarLoginECarregarSentimento();
  }, []);

  async function verificarLoginECarregarSentimento() {
    setCarregando(true);
    setErro("");

    const { data: sessao } = await supabase.auth.getSession();

    if (!sessao.session?.user) {
      router.push("/login");
      return;
    }

    await carregarSentimento();
    setCarregando(false);
  }

  async function carregarSentimento() {
    try {
      setErro("");

      const resposta = await fetch("/api/cripto/sentimento");

      if (!resposta.ok) {
        setErro("Não foi possível carregar o sentimento do mercado.");
        return;
      }

      const dados = await resposta.json();
      setSentimento(dados);
    } catch {
      setErro("Erro inesperado ao buscar sentimento do mercado.");
    }
  }

  const larguraBarra = useMemo(() => {
    if (!sentimento?.valor) return "0%";
    return `${Math.max(0, Math.min(100, sentimento.valor))}%`;
  }, [sentimento]);

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm font-semibold text-cyan-300">
          Carregando sentimento do mercado...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-slate-950 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/cripto" className="text-sm font-semibold text-cyan-300">
              ← Voltar ao Cripto
            </Link>

            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Sentimento do Mercado
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Leitura do Fear & Greed Index para apoiar a análise emocional do
              mercado cripto.
            </p>

            {sentimento?.atualizado_em && (
              <p className="mt-2 text-xs text-slate-500">
                Última atualização: {sentimento.atualizado_em}
              </p>
            )}
          </div>

          <button
            onClick={carregarSentimento}
            className="rounded-lg border border-cyan-400 px-4 py-2 text-sm font-bold text-cyan-300 hover:bg-cyan-400 hover:text-slate-950"
          >
            Atualizar sentimento
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6">
        {erro && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm font-semibold text-red-200">
            {erro}
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-100">
          <strong>Aviso:</strong> este painel é informativo e não representa
          recomendação de compra, venda ou investimento.
        </div>

        {sentimento ? (
          <>
            <div
              className={`rounded-3xl border p-6 ${classeDoIndicador(
                sentimento.analise.cor
              )}`}
            >
              <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] opacity-80">
                    Fear & Greed Index
                  </p>

                  <p
                    className={`mt-4 text-7xl font-black leading-none ${classeDoNumero(
                      sentimento.analise.cor
                    )}`}
                  >
                    {sentimento.valor}
                  </p>

                  <p className="mt-3 text-2xl font-black">
                    {sentimento.classificacao}
                  </p>

                  <p className="mt-1 text-xs opacity-70">
                    Classificação original: {sentimento.classificacao_original}
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    {sentimento.analise.nivel}
                  </h2>

                  <p className="mt-3 text-sm leading-6 opacity-90">
                    {sentimento.analise.resumo}
                  </p>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-black uppercase tracking-wider opacity-70">
                      Estratégia sugerida
                    </p>
                    <p className="mt-2 text-sm leading-6">
                      {sentimento.analise.estrategia}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="h-3 overflow-hidden rounded-full bg-black/30">
                  <div
                    className="h-full rounded-full bg-current transition-all"
                    style={{ width: larguraBarra }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs opacity-70">
                  <span>0 — Medo Extremo</span>
                  <span>100 — Ganância Extrema</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-5">
              {faixas.map((faixa) => (
                <div
                  key={faixa.nome}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                >
                  <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
                    {faixa.intervalo}
                  </p>

                  <h3 className="mt-2 font-black">{faixa.nome}</h3>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {faixa.leitura}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
            Nenhum dado de sentimento encontrado no momento.
          </div>
        )}
      </section>
    </main>
  );
}