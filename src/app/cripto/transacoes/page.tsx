"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { formatarMoedaBRL, formatarNumeroCripto } from "@/lib/cripto/calcularPortfolio";

type AtivoCripto = {
  id: string;
  simbolo: string;
  nome: string;
  ativo?: boolean;
  created_at?: string;
};

type TransacaoCripto = {
  id: string;
  user_id: string;
  ativo_id: string;
  tipo: "COMPRA" | "VENDA";
  quantidade: number;
  preco_unitario: number;
  moeda_preco?: "BRL" | "USD";
  created_at: string;
};

type LinhaTransacao = TransacaoCripto & {
  simbolo: string;
  nome: string;
  valor_total: number;
};

export default function TransacoesCriptoPage() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  const [ativos, setAtivos] = useState<AtivoCripto[]>([]);
  const [transacoes, setTransacoes] = useState<TransacaoCripto[]>([]);

  const [filtroAtivo, setFiltroAtivo] = useState("TODOS");
  const [filtroTipo, setFiltroTipo] = useState("TODOS");

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
    setErro("");

    const { data: ativosData, error: ativosError } = await supabase
      .from("cripto_ativos")
      .select("*")
      .order("simbolo");

    if (ativosError) {
      setErro("Erro ao carregar ativos: " + ativosError.message);
      return;
    }

    const { data: transacoesData, error: transacoesError } = await supabase
      .from("cripto_transacoes")
      .select("*")
      .eq("user_id", idUsuario)
      .order("created_at", { ascending: false });

    if (transacoesError) {
      setErro("Erro ao carregar transacoes: " + transacoesError.message);
      return;
    }

    setAtivos((ativosData || []) as AtivoCripto[]);
    setTransacoes((transacoesData || []) as TransacaoCripto[]);
  }

  const linhas = useMemo<LinhaTransacao[]>(() => {
    return transacoes.map((transacao) => {
      const ativo = ativos.find((item) => item.id === transacao.ativo_id);

      return {
        ...transacao,
        simbolo: ativo?.simbolo || "N/A",
        nome: ativo?.nome || "Ativo nao encontrado",
        valor_total:
          Number(transacao.quantidade || 0) *
          Number(transacao.preco_unitario || 0),
      };
    });
  }, [ativos, transacoes]);

  const linhasFiltradas = useMemo(() => {
    return linhas.filter((linha) => {
      const passaAtivo =
        filtroAtivo === "TODOS" || linha.ativo_id === filtroAtivo;

      const passaTipo =
        filtroTipo === "TODOS" || linha.tipo === filtroTipo;

      return passaAtivo && passaTipo;
    });
  }, [linhas, filtroAtivo, filtroTipo]);

  const resumo = useMemo(() => {
    const compras = linhasFiltradas.filter((linha) => linha.tipo === "COMPRA");
    const vendas = linhasFiltradas.filter((linha) => linha.tipo === "VENDA");

    const totalCompras = compras.reduce(
      (total, linha) => total + linha.valor_total,
      0
    );

    const totalVendas = vendas.reduce(
      (total, linha) => total + linha.valor_total,
      0
    );

    return {
      totalOperacoes: linhasFiltradas.length,
      compras: compras.length,
      vendas: vendas.length,
      totalCompras,
      totalVendas,
      movimentado: totalCompras + totalVendas,
    };
  }, [linhasFiltradas]);

  async function excluirTransacao(transacao: LinhaTransacao) {
    const confirmar = confirm(
      `Deseja excluir definitivamente esta transacao?\n\n${transacao.tipo} de ${formatarNumeroCripto(
        transacao.quantidade
      )} ${transacao.simbolo}\nValor: ${formatarMoedaBRL(
        transacao.valor_total
      )}\n\nEssa acao recalcula sua carteira.`
    );

    if (!confirmar) return;

    setExcluindoId(transacao.id);
    setErro("");

    const { error } = await supabase
      .from("cripto_transacoes")
      .delete()
      .eq("id", transacao.id)
      .eq("user_id", transacao.user_id);

    setExcluindoId(null);

    if (error) {
      setErro(
        "Erro ao excluir transacao. Verifique se a policy de delete foi criada no Supabase. Detalhe: " +
          error.message
      );
      return;
    }

    if (usuarioId) {
      await carregarDados(usuarioId);
    }
  }

  function formatarData(valor: string) {
    if (!valor) return "-";

    try {
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(valor));
    } catch {
      return valor;
    }
  }

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm font-semibold text-cyan-300">
          Carregando historico de transacoes...
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
              Historico de Transacoes
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Consulte, filtre e gerencie os lancamentos da sua carteira cripto.
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

        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-100">
          <strong>Aviso:</strong> excluir uma transacao altera os calculos da
          carteira, incluindo investimento, preco medio, lucro/prejuizo e
          rentabilidade.
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <CardResumo titulo="Operacoes" valor={String(resumo.totalOperacoes)} />
          <CardResumo titulo="Compras" valor={String(resumo.compras)} />
          <CardResumo titulo="Vendas" valor={String(resumo.vendas)} />
          <CardResumo
            titulo="Total compras"
            valor={formatarMoedaBRL(resumo.totalCompras)}
          />
          <CardResumo
            titulo="Movimentado"
            valor={formatarMoedaBRL(resumo.movimentado)}
          />
        </div>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-bold">Filtros</h2>
              <p className="mt-1 text-sm text-slate-400">
                Use os filtros para localizar operacoes especificas.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3 lg:min-w-[680px]">
              <label className="text-sm">
                <span className="mb-1 block text-xs font-bold uppercase text-slate-400">
                  Ativo
                </span>
                <select
                  value={filtroAtivo}
                  onChange={(event) => setFiltroAtivo(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                >
                  <option value="TODOS">Todos</option>
                  {ativos.map((ativo) => (
                    <option key={ativo.id} value={ativo.id}>
                      {ativo.simbolo} - {ativo.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs font-bold uppercase text-slate-400">
                  Tipo
                </span>
                <select
                  value={filtroTipo}
                  onChange={(event) => setFiltroTipo(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                >
                  <option value="TODOS">Todos</option>
                  <option value="COMPRA">Compra</option>
                  <option value="VENDA">Venda</option>
                </select>
              </label>

              <button
                onClick={() => {
                  setFiltroAtivo("TODOS");
                  setFiltroTipo("TODOS");
                }}
                className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-bold text-slate-200 hover:border-cyan-400 hover:text-cyan-300 md:mt-5"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold">Lancamentos registrados</h2>
              <p className="mt-1 text-sm text-slate-400">
                {linhasFiltradas.length} registro(s) encontrado(s).
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-3 py-2">Data</th>
                  <th className="px-3 py-2">Ativo</th>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2">Quantidade</th>
                  <th className="px-3 py-2">Preco unitario</th>
                  <th className="px-3 py-2">Moeda</th>
                  <th className="px-3 py-2">Valor total</th>
                  <th className="px-3 py-2 text-right">Acao</th>
                </tr>
              </thead>

              <tbody>
                {linhasFiltradas.map((linha) => (
                  <tr key={linha.id} className="border-t border-slate-800">
                    <td className="px-3 py-2 text-slate-300">
                      {formatarData(linha.created_at)}
                    </td>

                    <td className="px-3 py-2">
                      <span className="font-black text-white">
                        {linha.simbolo}
                      </span>
                      <span className="ml-2 text-slate-400">{linha.nome}</span>
                    </td>

                    <td className="px-3 py-2">
                      <span
                        className={
                          linha.tipo === "COMPRA"
                            ? "rounded-full border border-emerald-500/40 bg-emerald-950/30 px-3 py-1 text-xs font-bold text-emerald-300"
                            : "rounded-full border border-red-500/40 bg-red-950/30 px-3 py-1 text-xs font-bold text-red-300"
                        }
                      >
                        {linha.tipo}
                      </span>
                    </td>

                    <td className="px-3 py-2">
                      {formatarNumeroCripto(linha.quantidade)}
                    </td>

                    <td className="px-3 py-2">
                      {formatarMoedaBRL(linha.preco_unitario)}
                    </td>

                    <td className="px-3 py-2">
                      {linha.moeda_preco || "BRL"}
                    </td>

                    <td className="px-3 py-2 font-bold">
                      {formatarMoedaBRL(linha.valor_total)}
                    </td>

                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => excluirTransacao(linha)}
                        disabled={excluindoId === linha.id}
                        className="rounded-lg border border-red-500/50 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {excluindoId === linha.id ? "Excluindo..." : "Excluir"}
                      </button>
                    </td>
                  </tr>
                ))}

                {linhasFiltradas.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-6 text-center text-slate-400"
                    >
                      Nenhuma transacao encontrada.
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