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
  ativo: boolean;
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

type LinhaAtivo = AtivoCripto & {
  quantidadeTransacoes: number;
  valorMovimentado: number;
  compras: number;
  vendas: number;
};

export default function ConfiguracoesCriptoPage() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [salvandoId, setSalvandoId] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  const [ativos, setAtivos] = useState<AtivoCripto[]>([]);
  const [transacoes, setTransacoes] = useState<TransacaoCripto[]>([]);

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
      setErro("Erro ao carregar transações: " + transacoesError.message);
      return;
    }

    setAtivos((ativosData || []) as AtivoCripto[]);
    setTransacoes((transacoesData || []) as TransacaoCripto[]);
  }

  const linhas = useMemo<LinhaAtivo[]>(() => {
    return ativos.map((ativo) => {
      const transacoesDoAtivo = transacoes.filter(
        (transacao) => transacao.ativo_id === ativo.id
      );

      const valorMovimentado = transacoesDoAtivo.reduce((total, transacao) => {
        return (
          total +
          Number(transacao.quantidade || 0) *
            Number(transacao.preco_unitario || 0)
        );
      }, 0);

      const compras = transacoesDoAtivo.filter(
        (transacao) => transacao.tipo === "COMPRA"
      ).length;

      const vendas = transacoesDoAtivo.filter(
        (transacao) => transacao.tipo === "VENDA"
      ).length;

      return {
        ...ativo,
        quantidadeTransacoes: transacoesDoAtivo.length,
        valorMovimentado,
        compras,
        vendas,
      };
    });
  }, [ativos, transacoes]);

  const ativosAtivos = linhas.filter((linha) => linha.ativo).length;
  const ativosInativos = linhas.filter((linha) => !linha.ativo).length;
  const totalTransacoes = transacoes.length;
  const totalMovimentado = linhas.reduce(
    (total, linha) => total + linha.valorMovimentado,
    0
  );

  async function alternarStatusAtivo(ativo: LinhaAtivo) {
    if (ativo.quantidadeTransacoes > 0 && ativo.ativo) {
      const confirmar = confirm(
        `O ativo ${ativo.simbolo} possui ${ativo.quantidadeTransacoes} transação(ões). Deseja apenas desativá-lo para novos lançamentos?`
      );

      if (!confirmar) return;
    }

    setSalvandoId(ativo.id);
    setErro("");

    const { error } = await supabase
      .from("cripto_ativos")
      .update({ ativo: !ativo.ativo })
      .eq("id", ativo.id);

    setSalvandoId(null);

    if (error) {
      setErro(
        "Erro ao alterar status do ativo. Verifique se a policy de update foi criada no Supabase. Detalhe: " +
          error.message
      );
      return;
    }

    if (usuarioId) {
      await carregarDados(usuarioId);
    }
  }

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm font-semibold text-cyan-300">
          Carregando configurações do Cripto...
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
              Configurações do Cripto
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Gerencie os ativos cadastrados, acompanhe uso por transações e
              ative ou desative moedas para novos lançamentos.
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
          <strong>Aviso:</strong> nesta primeira versão, a configuração permite
          ativar ou desativar ativos. Não excluímos moedas para evitar perda de
          histórico em transações já registradas.
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <CardResumo titulo="Ativos cadastrados" valor={String(linhas.length)} />
          <CardResumo titulo="Ativos ativos" valor={String(ativosAtivos)} />
          <CardResumo titulo="Ativos inativos" valor={String(ativosInativos)} />
          <CardResumo
            titulo="Movimentado"
            valor={formatarMoedaBRL(totalMovimentado)}
          />
        </div>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold">⚙️ Ativos cadastrados</h2>
              <p className="mt-1 text-sm text-slate-400">
                Total de transações encontradas: {totalTransacoes}
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-3 py-2">Símbolo</th>
                  <th className="px-3 py-2">Nome</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Transações</th>
                  <th className="px-3 py-2">Compras</th>
                  <th className="px-3 py-2">Vendas</th>
                  <th className="px-3 py-2">Movimentado</th>
                  <th className="px-3 py-2 text-right">Ação</th>
                </tr>
              </thead>

              <tbody>
                {linhas.map((linha) => (
                  <tr key={linha.id} className="border-t border-slate-800">
                    <td className="px-3 py-2 font-black text-white">
                      {linha.simbolo}
                    </td>

                    <td className="px-3 py-2 text-slate-300">{linha.nome}</td>

                    <td className="px-3 py-2">
                      <span
                        className={
                          linha.ativo
                            ? "rounded-full border border-emerald-500/40 bg-emerald-950/30 px-3 py-1 text-xs font-bold text-emerald-300"
                            : "rounded-full border border-slate-600 bg-slate-950 px-3 py-1 text-xs font-bold text-slate-400"
                        }
                      >
                        {linha.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>

                    <td className="px-3 py-2">{linha.quantidadeTransacoes}</td>
                    <td className="px-3 py-2">{linha.compras}</td>
                    <td className="px-3 py-2">{linha.vendas}</td>

                    <td className="px-3 py-2">
                      {formatarMoedaBRL(linha.valorMovimentado)}
                    </td>

                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => alternarStatusAtivo(linha)}
                        disabled={salvandoId === linha.id}
                        className={
                          linha.ativo
                            ? "rounded-lg border border-red-500/50 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                            : "rounded-lg border border-emerald-500/50 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-50"
                        }
                      >
                        {salvandoId === linha.id
                          ? "Salvando..."
                          : linha.ativo
                            ? "Desativar"
                            : "Ativar"}
                      </button>
                    </td>
                  </tr>
                ))}

                {linhas.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-6 text-center text-slate-400"
                    >
                      Nenhum ativo cadastrado.
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