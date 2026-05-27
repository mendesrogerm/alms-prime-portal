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

type TipoMarcador = "pendente" | "concluido" | "concluido_dia" | "oportunidade";
type FiltroMapa = "pendentes" | "todos" | "concluidos";
type ModoMapa = "geral" | "rota";

type Processo = {
  id: string;
  sisgep: string;
  concluido: boolean;
  data_entrada: string | null;
  data_conclusao: string | null;
  assunto: string | null;
  rua: string | null;
  numero_rua: string | null;
  bairro: string | null;
  setor: string | null;
  latitude: number | null;
  longitude: number | null;
  mapa_link: string | null;
  tipo_marcador?: TipoMarcador;
};

function dataAtualInput() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function normalizarTexto(texto: string | null) {
  if (!texto) return "";

  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function dataMenorOuIgual(dataEntrada: string | null, dataAlvo: string) {
  if (!dataEntrada) return false;

  const entrada = new Date(`${dataEntrada}T12:00:00`);
  const alvo = new Date(`${dataAlvo}T12:00:00`);

  if (Number.isNaN(entrada.getTime()) || Number.isNaN(alvo.getTime())) {
    return false;
  }

  return entrada <= alvo;
}

export default function MapaPage() {
  const router = useRouter();

  const [processos, setProcessos] = useState<Processo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState<FiltroMapa>("pendentes");
  const [modoMapa, setModoMapa] = useState<ModoMapa>("geral");
  const [dataRota, setDataRota] = useState(dataAtualInput());

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
        "id, sisgep, concluido, data_entrada, data_conclusao, assunto, rua, numero_rua, bairro, setor, latitude, longitude, mapa_link"
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

  const dadosMapa = useMemo(() => {
    const processosGeral = processos
      .filter((processo) => {
        if (filtro === "todos") return true;
        if (filtro === "pendentes") return !processo.concluido;
        if (filtro === "concluidos") return processo.concluido;

        return true;
      })
      .map((processo) => ({
        ...processo,
        tipo_marcador: processo.concluido ? "concluido" : "pendente",
      })) as Processo[];

    const concluidosNoDia = processos
      .filter(
        (processo) =>
          processo.concluido && processo.data_conclusao === dataRota
      )
      .map((processo) => ({
        ...processo,
        tipo_marcador: "concluido_dia" as TipoMarcador,
      }));

    const bairrosVisitadosNormalizados = new Set(
      concluidosNoDia
        .map((processo) => normalizarTexto(processo.bairro))
        .filter(Boolean)
    );

    const bairrosVisitados = Array.from(
      new Set(
        concluidosNoDia
          .map((processo) => processo.bairro)
          .filter((bairro): bairro is string => Boolean(bairro))
      )
    );

    const oportunidadesPerdidas = processos
      .filter((processo) => {
        if (processo.concluido) return false;
        if (!dataMenorOuIgual(processo.data_entrada, dataRota)) return false;

        const bairroNormalizado = normalizarTexto(processo.bairro);

        return bairrosVisitadosNormalizados.has(bairroNormalizado);
      })
      .map((processo) => ({
        ...processo,
        tipo_marcador: "oportunidade" as TipoMarcador,
      }));

    const processosRota = [...concluidosNoDia, ...oportunidadesPerdidas];

    return {
      processosGeral,
      concluidosNoDia,
      oportunidadesPerdidas,
      bairrosVisitados,
      processosRota,
    };
  }, [processos, filtro, dataRota]);

  const processosExibidos =
    modoMapa === "geral" ? dadosMapa.processosGeral : dadosMapa.processosRota;

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
            Visualização geográfica dos processos e análise de rota.
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
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Modo de visualização
              </h2>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setModoMapa("geral")}
                  className={`rounded-lg px-4 py-2 text-sm font-bold ${
                    modoMapa === "geral"
                      ? "bg-blue-800 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Geral
                </button>

                <button
                  onClick={() => setModoMapa("rota")}
                  className={`rounded-lg px-4 py-2 text-sm font-bold ${
                    modoMapa === "rota"
                      ? "bg-purple-700 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Rota eficiente
                </button>
              </div>
            </div>

            {modoMapa === "geral" && (
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Filtro do mapa
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Exibindo {processosExibidos.length} processo(s) no mapa.
                </p>

                <div className="mt-3 grid grid-cols-3 gap-2">
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
            )}

            {modoMapa === "rota" && (
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Data da rota
                </h2>

                <input
                  type="date"
                  value={dataRota}
                  onChange={(event) => setDataRota(event.target.value)}
                  className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                />

                <p className="mt-2 text-sm text-slate-600">
                  {dadosMapa.concluidosNoDia.length} concluído(s) no dia •{" "}
                  {dadosMapa.oportunidadesPerdidas.length} oportunidade(s) perdida(s)
                </p>
              </div>
            )}
          </div>
        </div>

        {modoMapa === "rota" && (
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-green-700">
                Concluídos no dia
              </p>
              <p className="mt-2 text-3xl font-black text-green-700">
                {dadosMapa.concluidosNoDia.length}
              </p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-red-700">
                Oportunidades perdidas
              </p>
              <p className="mt-2 text-3xl font-black text-red-700">
                {dadosMapa.oportunidadesPerdidas.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-slate-500">
                Bairros visitados
              </p>
              <p className="mt-2 text-3xl font-black text-slate-800">
                {dadosMapa.bairrosVisitados.length}
              </p>
            </div>
          </div>
        )}

        {modoMapa === "rota" && dadosMapa.bairrosVisitados.length > 0 && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">
              Bairros visitados na data
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {dadosMapa.bairrosVisitados.map((bairro) => (
                <span
                  key={bairro}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                >
                  {bairro}
                </span>
              ))}
            </div>
          </div>
        )}

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
              {modoMapa === "geral" && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                    <span className="text-slate-600">Pendente</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-600"></span>
                    <span className="text-slate-600">Concluído</span>
                  </div>
                </>
              )}

              {modoMapa === "rota" && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-600"></span>
                    <span className="text-slate-600">Concluído no dia</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-600"></span>
                    <span className="text-slate-600">Oportunidade perdida</span>
                  </div>
                </>
              )}
            </div>

            <MapaProcessos processos={processosExibidos} />

            {processosExibidos.length === 0 && (
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