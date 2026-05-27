"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Processo = {
  id: string;
  sisgep: string;
  concluido: boolean;
  data_entrada: string | null;
  data_conclusao: string | null;
  sla: number;
  aberto_por: string | null;
  assunto: string | null;
  rua: string | null;
  numero_rua: string | null;
  observacao: string | null;
  bairro: string | null;
  setor: string | null;
};

type GrupoContagem = {
  nome: string;
  total: number;
};

const meses = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function dataAtualInput() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function calcularDiasEntreDatas(dataInicial: string | null, dataFinal?: string | null) {
  if (!dataInicial) return 0;

  const inicio = new Date(`${dataInicial}T12:00:00`);
  const fim = dataFinal
    ? new Date(`${dataFinal}T12:00:00`)
    : new Date(`${dataAtualInput()}T12:00:00`);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
    return 0;
  }

  const diferencaMs = fim.getTime() - inicio.getTime();
  const dias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

  return Math.max(dias, 0);
}

function pegarMes(data: string | null) {
  if (!data) return null;

  const partes = data.split("-");
  if (partes.length < 2) return null;

  const mes = Number(partes[1]) - 1;

  if (mes < 0 || mes > 11) return null;

  return mes;
}

function agruparPorCampo(
  processos: Processo[],
  campo: "assunto" | "setor" | "bairro"
): GrupoContagem[] {
  const mapa = new Map<string, number>();

  processos.forEach((processo) => {
    const valor = processo[campo] || "Não informado";
    mapa.set(valor, (mapa.get(valor) || 0) + 1);
  });

  return Array.from(mapa.entries())
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total);
}

export default function DashboardPage() {
  const router = useRouter();

  const [processos, setProcessos] = useState<Processo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarDashboard();
  }, []);

  async function carregarDashboard() {
    setCarregando(true);
    setErro("");

    const { data: sessao } = await supabase.auth.getSession();

    if (!sessao.session) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("processos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErro("Erro ao carregar dashboard: " + error.message);
      setCarregando(false);
      return;
    }

    setProcessos(data || []);
    setCarregando(false);
  }

  const dados = useMemo(() => {
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    const total = processos.length;
    const pendentes = processos.filter((p) => !p.concluido).length;
    const concluidos = processos.filter((p) => p.concluido).length;

    const entradasMes = processos.filter((p) => {
      if (!p.data_entrada) return false;
      const data = new Date(`${p.data_entrada}T12:00:00`);
      return data.getFullYear() === anoAtual && data.getMonth() === mesAtual;
    }).length;

    const concluidosMes = processos.filter((p) => {
      if (!p.concluido || !p.data_conclusao) return false;
      const data = new Date(`${p.data_conclusao}T12:00:00`);
      return data.getFullYear() === anoAtual && data.getMonth() === mesAtual;
    }).length;

    const processosConcluidos = processos.filter((p) => p.concluido);

    const somaDiasConcluidos = processosConcluidos.reduce((soma, processo) => {
      const dias = processo.sla || calcularDiasEntreDatas(
        processo.data_entrada,
        processo.data_conclusao
      );

      return soma + dias;
    }, 0);

    const mediaDiasConcluidos =
      processosConcluidos.length > 0
        ? somaDiasConcluidos / processosConcluidos.length
        : 0;

    const porAssunto = agruparPorCampo(processos, "assunto").slice(0, 8);
    const porSetor = agruparPorCampo(processos, "setor").slice(0, 8);
    const porBairro = agruparPorCampo(processos, "bairro").slice(0, 8);

    const evolucaoMensal = meses.map((mes, indice) => {
      const entradas = processos.filter((p) => {
        if (!p.data_entrada) return false;
        const data = new Date(`${p.data_entrada}T12:00:00`);
        return data.getFullYear() === anoAtual && data.getMonth() === indice;
      }).length;

      const finalizados = processos.filter((p) => {
        if (!p.concluido || !p.data_conclusao) return false;
        const data = new Date(`${p.data_conclusao}T12:00:00`);
        return data.getFullYear() === anoAtual && data.getMonth() === indice;
      }).length;

      return {
        mes,
        entradas,
        finalizados,
      };
    });

    return {
      total,
      pendentes,
      concluidos,
      entradasMes,
      concluidosMes,
      mediaDiasConcluidos,
      porAssunto,
      porSetor,
      porBairro,
      evolucaoMensal,
    };
  }, [processos]);

  function maiorValor(lista: GrupoContagem[]) {
    return Math.max(...lista.map((item) => item.total), 1);
  }

  function maiorValorEvolucao() {
    return Math.max(
      ...dados.evolucaoMensal.map((item) =>
        Math.max(item.entradas, item.finalizados)
      ),
      1
    );
  }

  function ListaComBarra({
    titulo,
    itens,
  }: {
    titulo: string;
    itens: GrupoContagem[];
  }) {
    const maior = maiorValor(itens);

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">{titulo}</h2>

        <div className="mt-4 space-y-3">
          {itens.map((item) => (
            <div key={item.nome}>
              <div className="mb-1 flex justify-between gap-3 text-sm">
                <span className="truncate font-semibold text-slate-700">
                  {item.nome}
                </span>
                <span className="font-bold text-slate-800">{item.total}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-700"
                  style={{ width: `${(item.total / maior) * 100}%` }}
                />
              </div>
            </div>
          ))}

          {itens.length === 0 && (
            <p className="text-sm text-slate-500">Nenhum dado encontrado.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-blue-900 px-6 py-6 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/fiscalizacao"
            className="text-sm font-semibold text-blue-200 hover:text-white"
          >
            ← Voltar para Fiscalização
          </Link>

          <h1 className="mt-4 text-3xl font-bold">Dashboard</h1>

          <p className="mt-2 text-blue-100">
            Visão geral dos processos, pendências, conclusões, setores e assuntos.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {carregando && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Carregando dashboard...
          </div>
        )}

        {erro && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 font-semibold text-red-700 shadow-sm">
            {erro}
          </div>
        )}

        {!carregando && !erro && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Total
                </p>
                <p className="mt-2 text-3xl font-black text-slate-800">
                  {dados.total}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Pendentes
                </p>
                <p className="mt-2 text-3xl font-black text-yellow-600">
                  {dados.pendentes}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Concluídos
                </p>
                <p className="mt-2 text-3xl font-black text-green-600">
                  {dados.concluidos}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Entradas do mês
                </p>
                <p className="mt-2 text-3xl font-black text-blue-700">
                  {dados.entradasMes}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Concluídos mês
                </p>
                <p className="mt-2 text-3xl font-black text-emerald-700">
                  {dados.concluidosMes}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Média dias
                </p>
                <p className="mt-2 text-3xl font-black text-slate-800">
                  {dados.mediaDiasConcluidos.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <ListaComBarra titulo="Processos por assunto" itens={dados.porAssunto} />
              <ListaComBarra titulo="Processos por setor" itens={dados.porSetor} />
              <ListaComBarra titulo="Processos por bairro" itens={dados.porBairro} />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800">
                Evolução mensal do ano atual
              </h2>

              <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {dados.evolucaoMensal.map((item) => {
                  const maior = maiorValorEvolucao();

                  return (
                    <div key={item.mes} className="rounded-xl border border-slate-100 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-800">{item.mes}</p>
                        <p className="text-xs font-semibold text-slate-500">
                          {item.entradas + item.finalizados} mov.
                        </p>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="font-semibold text-blue-700">
                              Entradas
                            </span>
                            <span className="font-bold">{item.entradas}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-blue-700"
                              style={{ width: `${(item.entradas / maior) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="font-semibold text-green-700">
                              Concluídos
                            </span>
                            <span className="font-bold">{item.finalizados}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-green-600"
                              style={{ width: `${(item.finalizados / maior) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}