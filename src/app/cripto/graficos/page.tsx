"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  calcularPortfolio,
  formatarMoedaBRL,
  formatarNumeroCripto,
  type AtivoCripto,
  type PrecosPorSimbolo,
  type TransacaoCripto,
} from "@/lib/cripto/calcularPortfolio";

type LinhaGrafico = {
  ativo_id: string;
  nome: string;
  simbolo: string;
  quantidade: number;
  valor_atual: number;
  custo_total: number;
  lucro: number;
  lucro_pct: number;
  percentualCarteira: number;
};

export default function GraficosCriptoPage() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  const [ativos, setAtivos] = useState<AtivoCripto[]>([]);
  const [transacoes, setTransacoes] = useState<TransacaoCripto[]>([]);
  const [precos, setPrecos] = useState<PrecosPorSimbolo>({});

  useEffect(() => {
    verificarLoginECarregar();
  }, []);

  async function verificarLoginECarregar() {
    setCarregando(true);
    setErro("");

    const { data: sessao } = await supabase.auth.getSession();

    if (!sessao.session?.user) {
      router.push("/login");
      return;
    }

    setUsuarioId(sessao.session.user.id);
    await carregarDados(sessao.session.user.id);
    setCarregando(false);
  }

  async function carregarDados(idUsuario: string) {
    const { data: ativosData, error: ativosError } = await supabase
      .from("cripto_ativos")
      .select("*")
      .eq("ativo", true)
      .order("simbolo");

    if (ativosError) {
      setErro("Erro ao carregar ativos: " + ativosError.message);
      return;
    }

    const ativosCarregados = (ativosData || []) as AtivoCripto[];
    setAtivos(ativosCarregados);

    const { data: transacoesData, error: transacoesError } = await supabase
      .from("cripto_transacoes")
      .select("*")
      .eq("user_id", idUsuario)
      .order("created_at", { ascending: false });

    if (transacoesError) {
      setErro("Erro ao carregar transações: " + transacoesError.message);
      return;
    }

    setTransacoes((transacoesData || []) as TransacaoCripto[]);
    await carregarPrecos(ativosCarregados);
  }

  async function carregarPrecos(listaAtivos: AtivoCripto[]) {
    const resultado: PrecosPorSimbolo = {};

    await Promise.all(
      listaAtivos.map(async (ativo) => {
        resultado[ativo.simbolo] = await buscarPrecoBRL(ativo.simbolo);
      })
    );

    setPrecos(resultado);
  }

  async function buscarPrecoBRL(simbolo: string) {
    try {
      const respostaBRL = await fetch(
        `https://data-api.binance.vision/api/v3/ticker/price?symbol=${simbolo}BRL`
      );

      if (respostaBRL.ok) {
        const dados = await respostaBRL.json();
        return Number(dados.price || 0);
      }

      const [respostaUSDT, respostaDolar] = await Promise.all([
        fetch(
          `https://data-api.binance.vision/api/v3/ticker/price?symbol=${simbolo}USDT`
        ),
        fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL"),
      ]);

      if (!respostaUSDT.ok || !respostaDolar.ok) {
        return 0;
      }

      const dadosUSDT = await respostaUSDT.json();
      const dadosDolar = await respostaDolar.json();

      return Number(dadosUSDT.price || 0) * Number(dadosDolar.USDBRL.bid || 0);
    } catch {
      return 0;
    }
  }

  const portfolio = useMemo(
    () => calcularPortfolio(transacoes, ativos, precos),
    [transacoes, ativos, precos]
  );

  const linhas: LinhaGrafico[] = useMemo(() => {
    return portfolio.posicoes.map((posicao) => ({
      ativo_id: posicao.ativo_id,
      nome: posicao.nome,
      simbolo: posicao.simbolo,
      quantidade: posicao.quantidade,
      valor_atual: posicao.valor_atual,
      custo_total: posicao.custo_total,
      lucro: posicao.lucro,
      lucro_pct: posicao.lucro_pct,
      percentualCarteira:
        portfolio.patrimonio > 0
          ? (posicao.valor_atual / portfolio.patrimonio) * 100
          : 0,
    }));
  }, [portfolio]);

  const maiorValorCarteira = Math.max(
    ...linhas.map((linha) => linha.valor_atual),
    1
  );

  const maiorLucroAbsoluto = Math.max(
    ...linhas.map((linha) => Math.abs(linha.lucro)),
    1
  );

  const ativoMaisPesado = linhas[0];
  const melhorRentabilidade = [...linhas].sort(
    (a, b) => b.lucro_pct - a.lucro_pct
  )[0];
  const piorRentabilidade = [...linhas].sort(
    (a, b) => a.lucro_pct - b.lucro_pct
  )[0];

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm font-semibold text-cyan-300">
          Carregando gráficos da carteira...
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
              Gráficos da Carteira
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Análise visual da composição da carteira, distribuição por ativo e
              lucro/prejuízo por moeda.
            </p>
          </div>

          <button
            onClick={() => usuarioId && carregarDados(usuarioId)}
            className="rounded-lg border border-cyan-400 px-4 py-2 text-sm font-bold text-cyan-300 hover:bg-cyan-400 hover:text-slate-950"
          >
            Atualizar dados
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6">
        {erro && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm font-semibold text-red-200">
            {erro}
          </div>
        )}

        {linhas.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
            Nenhuma posição em carteira para gerar gráficos. Registre uma compra
            no painel principal do Cripto.
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <CardResumo
                titulo="Patrimônio"
                valor={formatarMoedaBRL(portfolio.patrimonio)}
              />
              <CardResumo
                titulo="Ativos em carteira"
                valor={String(linhas.length)}
              />
              <CardResumo
                titulo="Maior posição"
                valor={ativoMaisPesado ? ativoMaisPesado.simbolo : "-"}
                detalhe={
                  ativoMaisPesado
                    ? `${ativoMaisPesado.percentualCarteira.toFixed(2)}% da carteira`
                    : ""
                }
              />
              <CardResumo
                titulo="Rentabilidade global"
                valor={`${portfolio.rentabilidade >= 0 ? "+" : ""}${portfolio.rentabilidade.toFixed(2)}%`}
                destaque={portfolio.rentabilidade >= 0 ? "positivo" : "negativo"}
              />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="text-lg font-bold">🍕 Composição da Carteira</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Percentual de cada ativo no patrimônio total.
                </p>

                <div className="mt-5 space-y-4">
                  {linhas.map((linha) => (
                    <div key={linha.ativo_id}>
                      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                        <div>
                          <span className="font-bold">{linha.simbolo}</span>
                          <span className="ml-2 text-slate-400">{linha.nome}</span>
                        </div>
                        <span className="font-bold text-cyan-300">
                          {linha.percentualCarteira.toFixed(2)}%
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-950">
                        <div
                          className="h-full rounded-full bg-cyan-400"
                          style={{ width: `${linha.percentualCarteira}%` }}
                        />
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatarMoedaBRL(linha.valor_atual)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="text-lg font-bold">📊 Valor por Ativo</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Comparação do valor atual de cada posição.
                </p>

                <div className="mt-5 space-y-4">
                  {linhas.map((linha) => {
                    const largura = (linha.valor_atual / maiorValorCarteira) * 100;

                    return (
                      <div key={linha.ativo_id}>
                        <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                          <span className="font-bold">{linha.simbolo}</span>
                          <span className="font-bold">
                            {formatarMoedaBRL(linha.valor_atual)}
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-950">
                          <div
                            className="h-full rounded-full bg-emerald-400"
                            style={{ width: `${largura}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="text-lg font-bold">💹 Lucro/Prejuízo por Moeda</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Resultado financeiro por ativo em reais.
                </p>

                <div className="mt-5 space-y-4">
                  {linhas.map((linha) => {
                    const largura =
                      (Math.abs(linha.lucro) / maiorLucroAbsoluto) * 100;

                    return (
                      <div key={linha.ativo_id}>
                        <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                          <span className="font-bold">{linha.simbolo}</span>
                          <span
                            className={
                              linha.lucro >= 0
                                ? "font-bold text-emerald-400"
                                : "font-bold text-red-400"
                            }
                          >
                            {linha.lucro >= 0 ? "+" : ""}
                            {formatarMoedaBRL(linha.lucro)}
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-950">
                          <div
                            className={
                              linha.lucro >= 0
                                ? "h-full rounded-full bg-emerald-400"
                                : "h-full rounded-full bg-red-400"
                            }
                            style={{ width: `${largura}%` }}
                          />
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {linha.lucro >= 0 ? "+" : ""}
                          {linha.lucro_pct.toFixed(2)}%
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="text-lg font-bold">🏆 Destaques da Carteira</h2>

                <div className="mt-5 grid gap-3">
                  <Destaque
                    titulo="Maior posição"
                    valor={ativoMaisPesado ? ativoMaisPesado.simbolo : "-"}
                    detalhe={
                      ativoMaisPesado
                        ? `${formatarMoedaBRL(ativoMaisPesado.valor_atual)} — ${ativoMaisPesado.percentualCarteira.toFixed(2)}%`
                        : ""
                    }
                  />

                  <Destaque
                    titulo="Melhor rentabilidade"
                    valor={
                      melhorRentabilidade ? melhorRentabilidade.simbolo : "-"
                    }
                    detalhe={
                      melhorRentabilidade
                        ? `${melhorRentabilidade.lucro_pct >= 0 ? "+" : ""}${melhorRentabilidade.lucro_pct.toFixed(2)}%`
                        : ""
                    }
                    positivo
                  />

                  <Destaque
                    titulo="Pior rentabilidade"
                    valor={piorRentabilidade ? piorRentabilidade.simbolo : "-"}
                    detalhe={
                      piorRentabilidade
                        ? `${piorRentabilidade.lucro_pct >= 0 ? "+" : ""}${piorRentabilidade.lucro_pct.toFixed(2)}%`
                        : ""
                    }
                    negativo={Boolean(piorRentabilidade && piorRentabilidade.lucro_pct < 0)}
                  />
                </div>
              </section>
            </div>

            <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-bold">📋 Tabela de Desempenho</h2>

              <div className="mt-4 overflow-auto rounded-xl border border-slate-800">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-950 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-3 py-2">Ativo</th>
                      <th className="px-3 py-2">Qtd</th>
                      <th className="px-3 py-2">Valor atual</th>
                      <th className="px-3 py-2">% carteira</th>
                      <th className="px-3 py-2">Custo</th>
                      <th className="px-3 py-2">Lucro/Prejuízo</th>
                      <th className="px-3 py-2">Rentabilidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map((linha) => (
                      <tr key={linha.ativo_id} className="border-t border-slate-800">
                        <td className="px-3 py-2 font-bold">
                          {linha.simbolo}
                          <span className="ml-2 font-normal text-slate-400">
                            {linha.nome}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {formatarNumeroCripto(linha.quantidade)}
                        </td>
                        <td className="px-3 py-2">
                          {formatarMoedaBRL(linha.valor_atual)}
                        </td>
                        <td className="px-3 py-2">
                          {linha.percentualCarteira.toFixed(2)}%
                        </td>
                        <td className="px-3 py-2">
                          {formatarMoedaBRL(linha.custo_total)}
                        </td>
                        <td
                          className={
                            linha.lucro >= 0
                              ? "px-3 py-2 font-bold text-emerald-400"
                              : "px-3 py-2 font-bold text-red-400"
                          }
                        >
                          {linha.lucro >= 0 ? "+" : ""}
                          {formatarMoedaBRL(linha.lucro)}
                        </td>
                        <td
                          className={
                            linha.lucro_pct >= 0
                              ? "px-3 py-2 font-bold text-emerald-400"
                              : "px-3 py-2 font-bold text-red-400"
                          }
                        >
                          {linha.lucro_pct >= 0 ? "+" : ""}
                          {linha.lucro_pct.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function CardResumo({
  titulo,
  valor,
  detalhe,
  destaque,
}: {
  titulo: string;
  valor: string;
  detalhe?: string;
  destaque?: "positivo" | "negativo";
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {titulo}
      </p>
      <p
        className={
          destaque === "positivo"
            ? "mt-2 text-2xl font-black text-emerald-400"
            : destaque === "negativo"
              ? "mt-2 text-2xl font-black text-red-400"
              : "mt-2 text-2xl font-black text-white"
        }
      >
        {valor}
      </p>
      {detalhe && <p className="mt-1 text-xs text-slate-400">{detalhe}</p>}
    </div>
  );
}

function Destaque({
  titulo,
  valor,
  detalhe,
  positivo,
  negativo,
}: {
  titulo: string;
  valor: string;
  detalhe: string;
  positivo?: boolean;
  negativo?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {titulo}
      </p>
      <p
        className={
          positivo
            ? "mt-2 text-2xl font-black text-emerald-400"
            : negativo
              ? "mt-2 text-2xl font-black text-red-400"
              : "mt-2 text-2xl font-black text-white"
        }
      >
        {valor}
      </p>
      <p className="mt-1 text-sm text-slate-400">{detalhe}</p>
    </div>
  );
}