"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
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

type TipoMarcador =
  | "pendente"
  | "concluido"
  | "concluido_dia"
  | "oportunidade";
type FiltroMapa = "pendentes" | "todos" | "concluidos";
type ModoMapa = "geral" | "rota";
type TipoMensagem = "sucesso" | "erro" | "";

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

type FormLocalizacao = {
  rua: string;
  numero: string;
  bairro: string;
  latitude: string;
  longitude: string;
};

const CAMPOS_PROCESSO =
  "id, sisgep, concluido, data_entrada, data_conclusao, assunto, rua, numero_rua, bairro, setor, latitude, longitude, mapa_link";

const ITENS_POR_PAGINA = 10;

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

function temCoordenadas(processo: Processo) {
  return (
    processo.latitude !== null &&
    processo.longitude !== null &&
    Number.isFinite(processo.latitude) &&
    Number.isFinite(processo.longitude)
  );
}

function descreverPendenciaCoordenadas(processo: Processo) {
  const semLatitude =
    processo.latitude === null || !Number.isFinite(processo.latitude);
  const semLongitude =
    processo.longitude === null || !Number.isFinite(processo.longitude);

  if (semLatitude && semLongitude) {
    return "Latitude e longitude ausentes";
  }

  if (semLatitude) {
    return "Latitude ausente";
  }

  return "Longitude ausente";
}

function criarLinkMapa(latitude: number, longitude: number) {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

function converterCoordenada(valor: string) {
  return Number(valor.trim().replace(",", "."));
}

export default function MapaPage() {
  const router = useRouter();

  const [processos, setProcessos] = useState<Processo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [filtro, setFiltro] = useState<FiltroMapa>("pendentes");
  const [modoMapa, setModoMapa] = useState<ModoMapa>("geral");
  const [dataRota, setDataRota] = useState(dataAtualInput());

  const [buscaSemCoordenadas, setBuscaSemCoordenadas] = useState("");
  const [paginaSemCoordenadas, setPaginaSemCoordenadas] = useState(1);

  const [processoEditando, setProcessoEditando] =
    useState<Processo | null>(null);
  const [formLocalizacao, setFormLocalizacao] = useState<FormLocalizacao>({
    rua: "",
    numero: "",
    bairro: "",
    latitude: "",
    longitude: "",
  });
  const [buscandoCoordenadas, setBuscandoCoordenadas] = useState(false);
  const [salvandoLocalizacao, setSalvandoLocalizacao] = useState(false);
  const [mensagemLocalizacao, setMensagemLocalizacao] = useState("");
  const [tipoMensagemLocalizacao, setTipoMensagemLocalizacao] =
    useState<TipoMensagem>("");

  const carregarTodosProcessos = useCallback(async (): Promise<Processo[]> => {
    const tamanhoLote = 1000;
    const todosOsProcessos: Processo[] = [];
    let inicio = 0;

    while (true) {
      const fim = inicio + tamanhoLote - 1;

      const { data, error } = await supabase
        .from("processos")
        .select(CAMPOS_PROCESSO)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(inicio, fim);

      if (error) {
        throw new Error(error.message);
      }

      const lote = (data ?? []) as Processo[];
      todosOsProcessos.push(...lote);

      if (lote.length < tamanhoLote) {
        break;
      }

      inicio += tamanhoLote;
    }

    return todosOsProcessos;
  }, []);

  const carregarProcessos = useCallback(async () => {
    setCarregando(true);
    setErro("");

    const { data: sessao } = await supabase.auth.getSession();

    if (!sessao.session) {
      router.push("/login");
      return;
    }

    try {
      const processosCarregados = await carregarTodosProcessos();
      setProcessos(processosCarregados);
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar os processos.";

      setErro("Erro ao carregar processos no mapa: " + mensagem);
    } finally {
      setCarregando(false);
    }
  }, [carregarTodosProcessos, router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void carregarProcessos();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [carregarProcessos]);

  const processosComCoordenadas = useMemo(
    () => processos.filter(temCoordenadas),
    [processos]
  );

  const processosSemCoordenadas = useMemo(
    () => processos.filter((processo) => !temCoordenadas(processo)),
    [processos]
  );

  const dadosMapa = useMemo(() => {
    const processosGeral = processosComCoordenadas
      .filter((processo) => {
        if (filtro === "todos") return true;
        if (filtro === "pendentes") return !processo.concluido;
        if (filtro === "concluidos") return processo.concluido;

        return true;
      })
      .map((processo) => ({
        ...processo,
        tipo_marcador: undefined,
      })) as Processo[];

    const concluidosNoDia = processosComCoordenadas
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

    const oportunidadesPerdidas = processosComCoordenadas
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
  }, [processosComCoordenadas, filtro, dataRota]);

  const processosExibidos =
    modoMapa === "geral" ? dadosMapa.processosGeral : dadosMapa.processosRota;

  const totalGeral = processos.length;
  const totalComCoordenadas = processosComCoordenadas.length;
  const totalSemCoordenadas = processosSemCoordenadas.length;
  const pendentesComCoordenadas = processosComCoordenadas.filter(
    (processo) => !processo.concluido
  ).length;
  const concluidosComCoordenadas = processosComCoordenadas.filter(
    (processo) => processo.concluido
  ).length;

  const processosSemCoordenadasFiltrados = useMemo(() => {
    const termo = normalizarTexto(buscaSemCoordenadas);

    if (!termo) {
      return processosSemCoordenadas;
    }

    return processosSemCoordenadas.filter((processo) => {
      const textoPesquisa = [
        processo.sisgep,
        processo.rua,
        processo.numero_rua,
        processo.bairro,
        processo.setor,
        processo.assunto,
      ]
        .map((valor) => normalizarTexto(valor))
        .join(" ");

      return textoPesquisa.includes(termo);
    });
  }, [buscaSemCoordenadas, processosSemCoordenadas]);

  const totalPaginasSemCoordenadas = Math.max(
    1,
    Math.ceil(
      processosSemCoordenadasFiltrados.length / ITENS_POR_PAGINA
    )
  );

  const paginaSemCoordenadasSegura = Math.min(
    paginaSemCoordenadas,
    totalPaginasSemCoordenadas
  );

  const processosSemCoordenadasPaginados = useMemo(() => {
    const inicio =
      (paginaSemCoordenadasSegura - 1) * ITENS_POR_PAGINA;

    return processosSemCoordenadasFiltrados.slice(
      inicio,
      inicio + ITENS_POR_PAGINA
    );
  }, [
    paginaSemCoordenadasSegura,
    processosSemCoordenadasFiltrados,
  ]);

  function abrirCorrecaoLocalizacao(processo: Processo) {
    setProcessoEditando(processo);
    setFormLocalizacao({
      rua: processo.rua || "",
      numero: processo.numero_rua || "",
      bairro: processo.bairro || "",
      latitude:
        processo.latitude !== null ? String(processo.latitude) : "",
      longitude:
        processo.longitude !== null ? String(processo.longitude) : "",
    });
    setMensagemLocalizacao("");
    setTipoMensagemLocalizacao("");
  }

  function fecharCorrecaoLocalizacao() {
    if (salvandoLocalizacao || buscandoCoordenadas) return;

    setProcessoEditando(null);
    setMensagemLocalizacao("");
    setTipoMensagemLocalizacao("");
  }

  async function buscarCoordenadasAutomaticamente() {
    const rua = formLocalizacao.rua.trim();
    const numero = formLocalizacao.numero.trim();

    if (!rua || !numero) {
      setTipoMensagemLocalizacao("erro");
      setMensagemLocalizacao(
        "Informe a rua e o número antes de buscar as coordenadas."
      );
      return;
    }

    setBuscandoCoordenadas(true);
    setTipoMensagemLocalizacao("");
    setMensagemLocalizacao("");

    try {
      const resposta = await fetch("/api/geocodificar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rua,
          numero,
        }),
      });

      const dados = (await resposta.json()) as {
        erro?: string;
        bairro?: string | null;
        latitude?: number | null;
        longitude?: number | null;
      };

      if (!resposta.ok) {
        throw new Error(dados.erro || "Não foi possível consultar o endereço.");
      }

      if (
        typeof dados.latitude !== "number" ||
        typeof dados.longitude !== "number"
      ) {
        setTipoMensagemLocalizacao("erro");
        setMensagemLocalizacao(
          "O endereço não foi localizado automaticamente. Informe as coordenadas manualmente."
        );
        return;
      }

      setFormLocalizacao((formAtual) => ({
        ...formAtual,
        bairro: dados.bairro || formAtual.bairro,
        latitude: String(dados.latitude),
        longitude: String(dados.longitude),
      }));

      setTipoMensagemLocalizacao("sucesso");
      setMensagemLocalizacao(
        "Coordenadas encontradas. Confira os dados e clique em Salvar localização."
      );
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao buscar as coordenadas.";

      setTipoMensagemLocalizacao("erro");
      setMensagemLocalizacao(mensagem);
    } finally {
      setBuscandoCoordenadas(false);
    }
  }

  async function salvarLocalizacao() {
    if (!processoEditando) return;

    const latitude = converterCoordenada(formLocalizacao.latitude);
    const longitude = converterCoordenada(formLocalizacao.longitude);

    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      setTipoMensagemLocalizacao("erro");
      setMensagemLocalizacao(
        "Informe uma latitude válida, entre -90 e 90."
      );
      return;
    }

    if (
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      setTipoMensagemLocalizacao("erro");
      setMensagemLocalizacao(
        "Informe uma longitude válida, entre -180 e 180."
      );
      return;
    }

    setSalvandoLocalizacao(true);
    setTipoMensagemLocalizacao("");
    setMensagemLocalizacao("");

    const dadosAtualizados = {
      rua: formLocalizacao.rua.trim() || null,
      numero_rua: formLocalizacao.numero.trim() || null,
      bairro: formLocalizacao.bairro.trim() || null,
      latitude,
      longitude,
      mapa_link: criarLinkMapa(latitude, longitude),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("processos")
      .update(dadosAtualizados)
      .eq("id", processoEditando.id)
      .select(CAMPOS_PROCESSO)
      .single();

    setSalvandoLocalizacao(false);

    if (error) {
      setTipoMensagemLocalizacao("erro");
      setMensagemLocalizacao(
        "Erro ao salvar a localização: " + error.message
      );
      return;
    }

    const processoAtualizado = data as Processo;

    setProcessos((listaAtual) =>
      listaAtual.map((processo) =>
        processo.id === processoAtualizado.id
          ? processoAtualizado
          : processo
      )
    );

    setMensagemSucesso(
      `Localização do processo ${processoAtualizado.sisgep} atualizada com sucesso.`
    );
    setProcessoEditando(null);
    setMensagemLocalizacao("");
    setTipoMensagemLocalizacao("");
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

          <h1 className="mt-4 text-3xl font-bold">Mapa Tático</h1>

          <p className="mt-2 text-blue-100">
            Visualização geográfica dos processos, conciliação de coordenadas e
            análise de rota.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {mensagemSucesso && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800 shadow-sm">
            <span>{mensagemSucesso}</span>
            <button
              type="button"
              onClick={() => setMensagemSucesso("")}
              className="rounded-lg px-2 py-1 text-green-900 hover:bg-green-100"
              aria-label="Fechar mensagem"
            >
              ×
            </button>
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">
              Total geral
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {totalGeral}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-blue-700">
              Com coordenadas
            </p>
            <p className="mt-2 text-3xl font-black text-blue-800">
              {totalComCoordenadas}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-amber-700">
              Sem coordenadas
            </p>
            <p className="mt-2 text-3xl font-black text-amber-700">
              {totalSemCoordenadas}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-red-700">
              Pendentes no mapa
            </p>
            <p className="mt-2 text-3xl font-black text-red-600">
              {pendentesComCoordenadas}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-green-700">
              Concluídos no mapa
            </p>
            <p className="mt-2 text-3xl font-black text-green-600">
              {concluidosComCoordenadas}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
          <strong>Conferência:</strong> {totalComCoordenadas} com coordenadas +{" "}
          {totalSemCoordenadas} sem coordenadas = {totalGeral} processos.
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Modo de visualização
              </h2>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
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
                  type="button"
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
                    type="button"
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
                    type="button"
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
                    type="button"
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
                  {dadosMapa.oportunidadesPerdidas.length} oportunidade(s)
                  perdida(s)
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
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: "#dc2626" }}
                    ></span>
                    <span className="text-slate-600">Ouvidoria/Denúncia</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: "#2563eb" }}
                    ></span>
                    <span className="text-slate-600">
                      Inscrição/Alteração
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: "#16a34a" }}
                    ></span>
                    <span className="text-slate-600">IPTU</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: "#ca8a04" }}
                    ></span>
                    <span className="text-slate-600">DRM/ISS</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: "#0891b2" }}
                    ></span>
                    <span className="text-slate-600">Revisão de Taxa</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: "#ea580c" }}
                    ></span>
                    <span className="text-slate-600">Feiras/Ambulantes</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: "#9333ea" }}
                    ></span>
                    <span className="text-slate-600">
                      Ministério Público
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: "#64748b" }}
                    ></span>
                    <span className="text-slate-600">Outros</span>
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
                    <span className="text-slate-600">
                      Oportunidade perdida
                    </span>
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

            <div className="mt-8 rounded-2xl border border-amber-200 bg-white shadow-sm">
              <div className="border-b border-amber-100 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Processos sem coordenadas
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Corrija o endereço, busque automaticamente ou informe
                      latitude e longitude manualmente.
                    </p>
                  </div>

                  <div className="w-full lg:max-w-md">
                    <label
                      htmlFor="busca-sem-coordenadas"
                      className="text-xs font-bold uppercase text-slate-500"
                    >
                      Pesquisar
                    </label>
                    <input
                      id="busca-sem-coordenadas"
                      type="search"
                      value={buscaSemCoordenadas}
                      onChange={(event) => {
                        setBuscaSemCoordenadas(event.target.value);
                        setPaginaSemCoordenadas(1);
                      }}
                      placeholder="SisGep, rua, bairro, setor ou assunto"
                      className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                    />
                  </div>
                </div>
              </div>

              {processosSemCoordenadasFiltrados.length === 0 ? (
                <div className="p-6 text-sm font-semibold text-green-700">
                  {totalSemCoordenadas === 0
                    ? "Todos os processos possuem coordenadas."
                    : "Nenhum processo sem coordenadas corresponde à pesquisa."}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
                        <tr>
                          <th className="px-4 py-3">SisGep</th>
                          <th className="px-4 py-3">Endereço</th>
                          <th className="px-4 py-3">Bairro / setor</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Pendência</th>
                          <th className="px-4 py-3 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {processosSemCoordenadasPaginados.map((processo) => (
                          <tr key={processo.id} className="align-top">
                            <td className="px-4 py-4 font-bold text-slate-900">
                              {processo.sisgep}
                            </td>
                            <td className="px-4 py-4 text-slate-700">
                              <div>{processo.rua || "Rua não informada"}</div>
                              <div className="text-xs text-slate-500">
                                Número: {processo.numero_rua || "não informado"}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-slate-700">
                              <div>{processo.bairro || "Bairro não informado"}</div>
                              <div className="text-xs text-slate-500">
                                {processo.setor || "Setor não informado"}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                                  processo.concluido
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {processo.concluido
                                  ? "Concluído"
                                  : "Pendente"}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-xs font-semibold text-amber-700">
                              {descreverPendenciaCoordenadas(processo)}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  abrirCorrecaoLocalizacao(processo)
                                }
                                className="rounded-lg bg-blue-800 px-3 py-2 text-xs font-bold text-white hover:bg-blue-900"
                              >
                                Corrigir localização
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-600">
                      Exibindo{" "}
                      <strong>
                        {processosSemCoordenadasPaginados.length}
                      </strong>{" "}
                      de{" "}
                      <strong>
                        {processosSemCoordenadasFiltrados.length}
                      </strong>{" "}
                      processo(s).
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPaginaSemCoordenadas((paginaAtual) =>
                            Math.max(1, paginaAtual - 1)
                          )
                        }
                        disabled={paginaSemCoordenadasSegura === 1}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Anterior
                      </button>

                      <span className="text-sm font-semibold text-slate-600">
                        Página {paginaSemCoordenadasSegura} de{" "}
                        {totalPaginasSemCoordenadas}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setPaginaSemCoordenadas((paginaAtual) =>
                            Math.min(
                              totalPaginasSemCoordenadas,
                              paginaAtual + 1
                            )
                          )
                        }
                        disabled={
                          paginaSemCoordenadasSegura ===
                          totalPaginasSemCoordenadas
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </section>

      {processoEditando && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Corrigir localização
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Processo {processoEditando.sisgep}
                </p>
              </div>

              <button
                type="button"
                onClick={fecharCorrecaoLocalizacao}
                disabled={salvandoLocalizacao || buscandoCoordenadas}
                className="rounded-lg px-3 py-2 text-xl font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
                <div>
                  <label
                    htmlFor="localizacao-rua"
                    className="text-sm font-bold text-slate-700"
                  >
                    Rua
                  </label>
                  <input
                    id="localizacao-rua"
                    value={formLocalizacao.rua}
                    onChange={(event) =>
                      setFormLocalizacao((formAtual) => ({
                        ...formAtual,
                        rua: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="localizacao-numero"
                    className="text-sm font-bold text-slate-700"
                  >
                    Número
                  </label>
                  <input
                    id="localizacao-numero"
                    value={formLocalizacao.numero}
                    onChange={(event) =>
                      setFormLocalizacao((formAtual) => ({
                        ...formAtual,
                        numero: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="localizacao-bairro"
                  className="text-sm font-bold text-slate-700"
                >
                  Bairro
                </label>
                <input
                  id="localizacao-bairro"
                  value={formLocalizacao.bairro}
                  onChange={(event) =>
                    setFormLocalizacao((formAtual) => ({
                      ...formAtual,
                      bairro: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-700"
                />
              </div>

              <button
                type="button"
                onClick={buscarCoordenadasAutomaticamente}
                disabled={buscandoCoordenadas || salvandoLocalizacao}
                className="w-full rounded-lg border border-blue-700 px-4 py-3 text-sm font-bold text-blue-800 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {buscandoCoordenadas
                  ? "Buscando coordenadas..."
                  : "Buscar coordenadas pelo endereço"}
              </button>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-800">
                  Coordenadas manuais
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Use ponto ou vírgula como separador decimal. Exemplo:
                  latitude -23.4431 e longitude -46.9123.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="localizacao-latitude"
                      className="text-sm font-bold text-slate-700"
                    >
                      Latitude
                    </label>
                    <input
                      id="localizacao-latitude"
                      inputMode="decimal"
                      value={formLocalizacao.latitude}
                      onChange={(event) =>
                        setFormLocalizacao((formAtual) => ({
                          ...formAtual,
                          latitude: event.target.value,
                        }))
                      }
                      placeholder="-23.4431"
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-700"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="localizacao-longitude"
                      className="text-sm font-bold text-slate-700"
                    >
                      Longitude
                    </label>
                    <input
                      id="localizacao-longitude"
                      inputMode="decimal"
                      value={formLocalizacao.longitude}
                      onChange={(event) =>
                        setFormLocalizacao((formAtual) => ({
                          ...formAtual,
                          longitude: event.target.value,
                        }))
                      }
                      placeholder="-46.9123"
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-700"
                    />
                  </div>
                </div>
              </div>

              {mensagemLocalizacao && (
                <div
                  className={`rounded-xl border p-4 text-sm font-semibold ${
                    tipoMensagemLocalizacao === "sucesso"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {mensagemLocalizacao}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={fecharCorrecaoLocalizacao}
                disabled={salvandoLocalizacao || buscandoCoordenadas}
                className="rounded-lg border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={salvarLocalizacao}
                disabled={salvandoLocalizacao || buscandoCoordenadas}
                className="rounded-lg bg-blue-800 px-4 py-2 font-bold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {salvandoLocalizacao
                  ? "Salvando..."
                  : "Salvar localização"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
