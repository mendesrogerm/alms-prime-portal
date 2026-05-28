"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { formatarMoedaBRL } from "@/lib/cripto/calcularPortfolio";

type AtivoCripto = {
  id: string;
  simbolo: string;
  nome: string;
  ativo?: boolean;
  created_at?: string;
};

type HistoricoPreco = {
  id?: string;
  ativo_id: string;
  preco_fechamento: number;
  data_registro: string;
  created_at?: string;
};

type LinhaHistorico = HistoricoPreco & {
  media7: number | null;
  media21: number | null;
  variacaoDia: number | null;
};

function calcularMediaMovel(valores: number[], indice: number, janela: number) {
  if (indice + 1 < janela) return null;

  const inicio = indice + 1 - janela;
  const fatia = valores.slice(inicio, indice + 1);
  const soma = fatia.reduce((total, valor) => total + valor, 0);

  return soma / janela;
}

function formatarData(valor: string) {
  if (!valor) return "-";

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
    }).format(new Date(valor));
  } catch {
    return valor;
  }
}

function formatarPercentual(valor: number | null) {
  if (valor === null || Number.isNaN(valor)) return "-";
  const sinal = valor >= 0 ? "+" : "";
  return `${sinal}${valor.toFixed(2)}%`;
}

export default function CiclosCriptoPage() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  const [ativos, setAtivos] = useState<AtivoCripto[]>([]);
  const [historico, setHistorico] = useState<HistoricoPreco[]>([]);
  const [ativoSelecionado, setAtivoSelecionado] = useState("");

  useEffect(() => {
    verificarLoginECarregar();
  }, []);

  useEffect(() => {
    if (ativoSelecionado) {
      carregarHistorico(ativoSelecionado);
    }
  }, [ativoSelecionado]);

  async function verificarLoginECarregar() {
    setCarregando(true);
    setErro("");

    const { data: sessao } = await supabase.auth.getSession();

    if (!sessao.session?.user) {
      router.push("/login");
      return;
    }

    setUsuarioId(sessao.session.user.id);

    const { data: ativosData, error: ativosError } = await supabase
      .from("cripto_ativos")
      .select("*")
      .eq("ativo", true)
      .order("simbolo");

    if (ativosError) {
      setErro("Erro ao carregar ativos: " + ativosError.message);
      setCarregando(false);
      return;
    }

    const listaAtivos = (ativosData || []) as AtivoCripto[];
    setAtivos(listaAtivos);

    if (listaAtivos.length > 0) {
      setAtivoSelecionado(listaAtivos[0].id);
      await carregarHistorico(listaAtivos[0].id);
    }

    setCarregando(false);
  }

  async function carregarHistorico(idAtivo: string) {
    setErro("");

    const { data, error } = await supabase
      .from("cripto_historico_precos")
      .select("*")
      .eq("ativo_id", idAtivo)
      .order("data_registro", { ascending: true });

    if (error) {
      setErro(
        "Erro ao carregar historico de precos. Verifique se a tabela cripto_historico_precos existe e possui dados. Detalhe: " +
          error.message
      );
      setHistorico([]);
      return;
    }

    setHistorico((data || []) as HistoricoPreco[]);
  }

  const ativoAtual = useMemo(() => {
    return ativos.find((ativo) => ativo.id === ativoSelecionado) || null;
  }, [ativos, ativoSelecionado]);

  const linhas = useMemo<LinhaHistorico[]>(() => {
    const precos = historico.map((item) => Number(item.preco_fechamento || 0));

    return historico.map((item, indice) => {
      const precoAtual = Number(item.preco_fechamento || 0);
      const precoAnterior =
        indice > 0 ? Number(historico[indice - 1].preco_fechamento || 0) : null;

      const variacaoDia =
        precoAnterior && precoAnterior > 0
          ? ((precoAtual - precoAnterior) / precoAnterior) * 100
          : null;

      return {
        ...item,
        media7: calcularMediaMovel(precos, indice, 7),
        media21: calcularMediaMovel(precos, indice, 21),
        variacaoDia,
      };
    });
  }, [historico]);

  const leitura = useMemo(() => {
    if (linhas.length === 0) {
      return {
        status: "Sem dados",
        cor: "slate",
        texto:
          "Ainda nao ha historico de precos suficiente para gerar leitura de ciclo.",
      };
    }

    const ultima = linhas[linhas.length - 1];

    if (ultima.media7 === null || ultima.media21 === null) {
      return {
        status: "Coletando dados",
        cor: "amber",
        texto:
          "Ainda sao necessarios mais registros historicos para comparar media curta e media longa.",
      };
    }

    const diferencaPct =
      ultima.media21 > 0
        ? ((ultima.media7 - ultima.media21) / ultima.media21) * 100
        : 0;

    if (diferencaPct > 1) {
      return {
        status: "Ciclo de alta",
        cor: "emerald",
        texto:
          "A media curta esta acima da media longa. O ativo mostra tendencia positiva no periodo analisado.",
      };
    }

    if (diferencaPct < -1) {
      return {
        status: "Ciclo de baixa",
        cor: "red",
        texto:
          "A media curta esta abaixo da media longa. O ativo mostra tendencia negativa no periodo analisado.",
      };
    }

    return {
      status: "Zona neutra",
      cor: "cyan",
      texto:
        "As medias estao proximas. O mercado esta sem direcao forte neste momento.",
    };
  }, [linhas]);

  const resumo = useMemo(() => {
    if (linhas.length === 0) {
      return {
        precoAtual: 0,
        media7: null as number | null,
        media21: null as number | null,
        variacaoDia: null as number | null,
        registros: 0,
      };
    }

    const ultima = linhas[linhas.length - 1];

    return {
      precoAtual: Number(ultima.preco_fechamento || 0),
      media7: ultima.media7,
      media21: ultima.media21,
      variacaoDia: ultima.variacaoDia,
      registros: linhas.length,
    };
  }, [linhas]);

  const ultimosRegistros = useMemo(() => {
    return [...linhas].reverse().slice(0, 30);
  }, [linhas]);

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm font-semibold text-cyan-300">
          Carregando analise de ciclos...
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
              Analise de Ciclos
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Acompanhe tendencia por ativo usando medias moveis de 7 e 21
              registros.
            </p>
          </div>

          <button
            onClick={() => ativoSelecionado && carregarHistorico(ativoSelecionado)}
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

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-bold">Selecionar ativo</h2>
              <p className="mt-1 text-sm text-slate-400">
                Escolha uma moeda para visualizar o ciclo de mercado.
              </p>
            </div>

            <label className="w-full text-sm md:max-w-md">
              <span className="mb-1 block text-xs font-bold uppercase text-slate-400">
                Ativo
              </span>
              <select
                value={ativoSelecionado}
                onChange={(event) => setAtivoSelecionado(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              >
                {ativos.map((ativo) => (
                  <option key={ativo.id} value={ativo.id}>
                    {ativo.simbolo} - {ativo.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          <CardResumo titulo="Ativo" valor={ativoAtual?.simbolo || "-"} />
          <CardResumo
            titulo="Preco atual"
            valor={formatarMoedaBRL(resumo.precoAtual)}
          />
          <CardResumo
            titulo="Media 7"
            valor={resumo.media7 === null ? "-" : formatarMoedaBRL(resumo.media7)}
          />
          <CardResumo
            titulo="Media 21"
            valor={
              resumo.media21 === null ? "-" : formatarMoedaBRL(resumo.media21)
            }
          />
          <CardResumo titulo="Registros" valor={String(resumo.registros)} />
        </div>

        <section
          className={
            leitura.cor === "emerald"
              ? "mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-5"
              : leitura.cor === "red"
                ? "mt-6 rounded-2xl border border-red-500/40 bg-red-950/20 p-5"
                : leitura.cor === "amber"
                  ? "mt-6 rounded-2xl border border-amber-500/40 bg-amber-950/20 p-5"
                  : "mt-6 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-5"
          }
        >
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Leitura atual
          </p>

          <h2 className="mt-2 text-2xl font-black">{leitura.status}</h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            {leitura.texto}
          </p>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
            <strong>Variacao do ultimo registro:</strong>{" "}
            <span
              className={
                resumo.variacaoDia !== null && resumo.variacaoDia >= 0
                  ? "font-bold text-emerald-300"
                  : "font-bold text-red-300"
              }
            >
              {formatarPercentual(resumo.variacaoDia)}
            </span>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div>
            <h2 className="text-lg font-bold">Historico recente</h2>
            <p className="mt-1 text-sm text-slate-400">
              Ultimos 30 registros do historico de precos.
            </p>
          </div>

          <div className="mt-4 overflow-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-3 py-2">Data</th>
                  <th className="px-3 py-2">Preco fechamento</th>
                  <th className="px-3 py-2">Media 7</th>
                  <th className="px-3 py-2">Media 21</th>
                  <th className="px-3 py-2">Variacao</th>
                </tr>
              </thead>

              <tbody>
                {ultimosRegistros.map((linha, index) => (
                  <tr
                    key={`${linha.ativo_id}-${linha.data_registro}-${index}`}
                    className="border-t border-slate-800"
                  >
                    <td className="px-3 py-2 text-slate-300">
                      {formatarData(linha.data_registro)}
                    </td>

                    <td className="px-3 py-2 font-bold">
                      {formatarMoedaBRL(Number(linha.preco_fechamento || 0))}
                    </td>

                    <td className="px-3 py-2">
                      {linha.media7 === null
                        ? "-"
                        : formatarMoedaBRL(linha.media7)}
                    </td>

                    <td className="px-3 py-2">
                      {linha.media21 === null
                        ? "-"
                        : formatarMoedaBRL(linha.media21)}
                    </td>

                    <td
                      className={
                        linha.variacaoDia !== null && linha.variacaoDia >= 0
                          ? "px-3 py-2 font-bold text-emerald-300"
                          : "px-3 py-2 font-bold text-red-300"
                      }
                    >
                      {formatarPercentual(linha.variacaoDia)}
                    </td>
                  </tr>
                ))}

                {ultimosRegistros.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-6 text-center text-slate-400"
                    >
                      Nenhum historico encontrado para este ativo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

function CardResumo({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {titulo}
      </p>
      <p className="mt-2 text-2xl font-black text-white">{valor}</p>
    </div>
  );
}