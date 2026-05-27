"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const MapaProcessos = dynamic(() => import("@/components/MapaProcessos"), {
  ssr: false,
  loading: () => (
    <div className="h-[75vh] rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
      Carregando mapa...
    </div>
  ),
});

type Processo = {
  id: string;
  sisgep: string;
  concluido: boolean;
  assunto: string | null;
  rua: string | null;
  numero_rua: string | null;
  bairro: string | null;
  setor: string | null;
  latitude: number | null;
  longitude: number | null;
  mapa_link: string | null;
};

type FiltroMapa = "pendentes" | "todos" | "concluidos";

export default function MapaPage() {
  const router = useRouter();

  const [processos, setProcessos] = useState<Processo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState<FiltroMapa>("pendentes");

  useEffect(() => {
    carregarProcessos();
  }, []);

  async function carregarProcessos() {
    setCarregando(true);
    setErro("");

    const { data: sessao } = await supabase.auth.getSession();

    if (!sessao.session) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("processos")
      .select(
        "id, sisgep, concluido, assunto, rua, numero_rua, bairro, setor, latitude, longitude, mapa_link"
      )
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("created_at", { ascending: false });

    if (error) {
      setErro("Erro ao carregar processos no mapa: " + error.message);
      setCarregando(false);
      return;
    }

    setProcessos(data || []);
    setCarregando(false);
  }

  const processosFiltrados = useMemo(() => {
    return processos.filter((processo) => {
      if (filtro === "todos") return true;
      if (filtro === "pendentes") return !processo.concluido;
      if (filtro === "concluidos") return processo.concluido;

      return true;
    });
  }, [processos, filtro]);

  const totalComCoordenadas = processos.length;
  const pendentesComCoordenadas = processos.filter((p) => !p.concluido).length;
  const concluidosComCoordenadas = processos.filter((p) => p.concluido).length;

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

          <h1 className="mt-4 text-3xl font-bold">Mapa Tático</h1>

          <p className="mt-2 text-blue-100">
            Visualização geográfica dos processos com latitude e longitude.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">
              Com coordenadas
            </p>
            <p className="mt-2 text-3xl font-black text-slate-800">
              {totalComCoordenadas}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">
              Pendentes
            </p>
            <p className="mt-2 text-3xl font-black text-red-600">
              {pendentesComCoordenadas}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">
              Concluídos
            </p>
            <p className="mt-2 text-3xl font-black text-green-600">
              {concluidosComCoordenadas}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Filtro do mapa
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Exibindo {processosFiltrados.length} processo(s) no mapa.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFiltro("pendentes")}
                className={`rounded-lg px-4 py-2 text-sm font-bold ${
                  filtro === "pendentes"
                    ? "bg-red-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Pendentes
              </button>

              <button
                onClick={() => setFiltro("todos")}
                className={`rounded-lg px-4 py-2 text-sm font-bold ${
                  filtro === "todos"
                    ? "bg-blue-800 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Todos
              </button>

              <button
                onClick={() => setFiltro("concluidos")}
                className={`rounded-lg px-4 py-2 text-sm font-bold ${
                  filtro === "concluidos"
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Concluídos
              </button>
            </div>
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
          <>
            <div className="mb-4 flex flex-wrap gap-3 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-600"></span>
                <span className="text-slate-600">Pendente</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-600"></span>
                <span className="text-slate-600">Concluído</span>
              </div>
            </div>

            <MapaProcessos processos={processosFiltrados} />

            {processosFiltrados.length === 0 && (
              <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm font-semibold text-yellow-800">
                Nenhum processo com coordenadas encontrado para esse filtro.
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}