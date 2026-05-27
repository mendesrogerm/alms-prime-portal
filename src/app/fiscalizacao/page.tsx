"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function FiscalizacaoPage() {
  const router = useRouter();

  const [processos, setProcessos] = useState<Processo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    verificarLoginECarregarProcessos();
  }, []);

  async function verificarLoginECarregarProcessos() {
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
      setErro("Erro ao carregar processos: " + error.message);
      setCarregando(false);
      return;
    }

    setProcessos(data || []);
    setCarregando(false);
  }

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-blue-900 px-6 py-6 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link href="/" className="text-sm font-semibold text-blue-200 hover:text-white">
                ← Voltar ao portal
              </Link>

              <h1 className="mt-4 text-3xl font-bold">
                Fiscalização SisGep
              </h1>

              <p className="mt-2 text-blue-100">
                Sistema de controle de processos, mapas, anexos, dashboard e relatórios.
              </p>
            </div>

            <button
              onClick={sair}
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-blue-900 hover:bg-blue-100"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">
              Total
            </p>
            <p className="mt-2 text-3xl font-black text-slate-800">
              {processos.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">
              Pendentes
            </p>
            <p className="mt-2 text-3xl font-black text-yellow-600">
              {processos.filter((p) => !p.concluido).length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">
              Concluídos
            </p>
            <p className="mt-2 text-3xl font-black text-green-600">
              {processos.filter((p) => p.concluido).length}
            </p>
          </div>
        </div>

        {carregando && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Carregando processos...
          </div>
        )}

        {erro && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 font-semibold text-red-700 shadow-sm">
            {erro}
          </div>
        )}

        {!carregando && !erro && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {processos.map((processo) => (
              <div
                key={processo.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">
                      SisGep
                    </p>
                    <h2 className="mt-1 font-bold text-slate-800">
                      {processo.sisgep}
                    </h2>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      processo.concluido
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {processo.concluido ? "Concluído" : "Pendente"}
                  </span>
                </div>

                <p className="mt-4 text-sm font-semibold text-blue-700">
                  {processo.assunto || "Sem assunto"}
                </p>

                <div className="mt-4 space-y-1 text-sm text-slate-600">
                  <p>
                    <b>Aberto por:</b> {processo.aberto_por || "---"}
                  </p>
                  <p>
                    <b>Endereço:</b> {processo.rua || "---"}, nº{" "}
                    {processo.numero_rua || "---"}
                  </p>
                  <p>
                    <b>Bairro:</b> {processo.bairro || "---"}
                  </p>
                  <p>
                    <b>Setor:</b> {processo.setor || "---"}
                  </p>
                  <p>
                    <b>SLA:</b> {processo.sla} dias
                  </p>
                </div>

                {processo.observacao && (
                  <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                    {processo.observacao}
                  </p>
                )}
              </div>
            ))}

            {processos.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
                Nenhum processo encontrado.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}