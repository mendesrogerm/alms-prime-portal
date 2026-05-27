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
  latitude: number | null;
  longitude: number | null;
  mapa_link: string | null;
};

type FiltroStatus = "todos" | "pendentes" | "concluidos";
type NovoProcessoForm = {
  sisgep: string;
  data_entrada: string;
  sla: string;
  aberto_por: string;
  assunto: string;
  rua: string;
  numero_rua: string;
  observacao: string;
  bairro: string;
  setor: string;
};
export default function FiscalizacaoPage() {
  const router = useRouter();

  const [processos, setProcessos] = useState<Processo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("pendentes");
const [modalNovoAberto, setModalNovoAberto] = useState(false);
const [salvandoNovo, setSalvandoNovo] = useState(false);

const [novoProcesso, setNovoProcesso] = useState<NovoProcessoForm>({
  sisgep: "",
  data_entrada: dataAtualInput(),
  sla: "0",
  aberto_por: "",
  assunto: "",
  rua: "",
  numero_rua: "",
  observacao: "",
  bairro: "",
  setor: "",
});
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
function dataAtualInput() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}
  function dataAtualFormatoBanco() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }
function atualizarCampoNovoProcesso(
  campo: keyof NovoProcessoForm,
  valor: string
) {
  setNovoProcesso((dadosAtuais) => ({
    ...dadosAtuais,
    [campo]: valor,
  }));
}
async function cadastrarNovoProcesso(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!novoProcesso.sisgep.trim()) {
    alert("Informe o número SisGep.");
    return;
  }

  setSalvandoNovo(true);

  const endereco = `${novoProcesso.rua}, ${novoProcesso.numero_rua}, ${novoProcesso.bairro}`;
  const mapaLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    endereco
  )}`;

  const { data, error } = await supabase
    .from("processos")
    .insert({
      sisgep: novoProcesso.sisgep.trim(),
      concluido: false,
      data_entrada: novoProcesso.data_entrada || null,
      sla: Number(novoProcesso.sla) || 0,
      aberto_por: novoProcesso.aberto_por.trim() || null,
      assunto: novoProcesso.assunto.trim() || null,
      rua: novoProcesso.rua.trim() || null,
      numero_rua: novoProcesso.numero_rua.trim() || null,
      observacao: novoProcesso.observacao.trim() || null,
      bairro: novoProcesso.bairro.trim() || null,
      setor: novoProcesso.setor.trim() || null,
      mapa_link: mapaLink,
    })
    .select()
    .single();

  setSalvandoNovo(false);

  if (error) {
    alert("Erro ao cadastrar processo: " + error.message);
    return;
  }

  if (data) {
    setProcessos((listaAtual) => [data, ...listaAtual]);
  }

  setNovoProcesso({
    sisgep: "",
    data_entrada: dataAtualInput(),
    sla: "0",
    aberto_por: "",
    assunto: "",
    rua: "",
    numero_rua: "",
    observacao: "",
    bairro: "",
    setor: "",
  });

  setModalNovoAberto(false);
}
  async function alterarStatusProcesso(processo: Processo) {
    const novoStatus = !processo.concluido;

    const { error } = await supabase
      .from("processos")
      .update({
        concluido: novoStatus,
        data_conclusao: novoStatus ? dataAtualFormatoBanco() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", processo.id);

    if (error) {
      alert("Erro ao atualizar processo: " + error.message);
      return;
    }

    setProcessos((listaAtual) =>
      listaAtual.map((item) =>
        item.id === processo.id
          ? {
              ...item,
              concluido: novoStatus,
              data_conclusao: novoStatus ? dataAtualFormatoBanco() : null,
            }
          : item
      )
    );
  }

  function formatarData(data: string | null) {
    if (!data) return "---";

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function getLinkMapa(processo: Processo) {
    if (processo.mapa_link) {
      return processo.mapa_link;
    }

    const endereco = `${processo.rua || ""}, ${processo.numero_rua || ""}, ${
      processo.bairro || ""
    }`;

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      endereco
    )}`;
  }

  function getEstiloSla(processo: Processo) {
    if (processo.concluido) {
      return {
        fundo: "bg-white",
        borda: "border-slate-300",
        badge: "bg-slate-100 text-slate-700",
      };
    }

    if (processo.sla >= 15) {
      return {
        fundo: "bg-red-50",
        borda: "border-red-500",
        badge: "bg-red-100 text-red-700",
      };
    }

    if (processo.sla >= 10) {
      return {
        fundo: "bg-yellow-50",
        borda: "border-yellow-500",
        badge: "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      fundo: "bg-green-50",
      borda: "border-green-500",
      badge: "bg-green-100 text-green-700",
    };
  }

  const processosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return processos.filter((processo) => {
      const combinaStatus =
        filtroStatus === "todos" ||
        (filtroStatus === "pendentes" && !processo.concluido) ||
        (filtroStatus === "concluidos" && processo.concluido);

      const textoBusca = [
        processo.sisgep,
        processo.assunto,
        processo.aberto_por,
        processo.rua,
        processo.numero_rua,
        processo.bairro,
        processo.setor,
        processo.observacao,
      ]
        .join(" ")
        .toLowerCase();

      const combinaBusca = termo === "" || textoBusca.includes(termo);

      return combinaStatus && combinaBusca;
    });
  }, [processos, busca, filtroStatus]);

  const total = processos.length;
  const pendentes = processos.filter((p) => !p.concluido).length;
  const concluidos = processos.filter((p) => p.concluido).length;

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

            <div className="flex gap-2">
  <button
    onClick={() => setModalNovoAberto(true)}
    className="rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-400"
  >
    Novo processo
  </button>

  <button
    onClick={sair}
    className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-blue-900 hover:bg-blue-100"
  >
    Sair
  </button>
</div>
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
              {total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">
              Pendentes
            </p>
            <p className="mt-2 text-3xl font-black text-yellow-600">
              {pendentes}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">
              Concluídos
            </p>
            <p className="mt-2 text-3xl font-black text-green-600">
              {concluidos}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por SisGep, assunto, bairro, setor ou endereço..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
            />

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFiltroStatus("todos")}
                className={`rounded-lg px-3 py-2 text-sm font-bold ${
                  filtroStatus === "todos"
                    ? "bg-blue-800 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Todos
              </button>

              <button
                onClick={() => setFiltroStatus("pendentes")}
                className={`rounded-lg px-3 py-2 text-sm font-bold ${
                  filtroStatus === "pendentes"
                    ? "bg-yellow-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Pendentes
              </button>

              <button
                onClick={() => setFiltroStatus("concluidos")}
                className={`rounded-lg px-3 py-2 text-sm font-bold ${
                  filtroStatus === "concluidos"
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Concluídos
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs font-semibold text-slate-500">
            Exibindo {processosFiltrados.length} de {total} processos.
          </p>
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
            {processosFiltrados.map((processo) => {
              const estilo = getEstiloSla(processo);

              return (
                <div
                  key={processo.id}
                  className={`rounded-2xl border-l-4 ${estilo.borda} ${estilo.fundo} p-5 shadow-sm`}
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

                  <div className="mt-4 rounded-xl bg-white/80 p-3 text-sm text-slate-600">
                    <p>
                      <b>Entrada:</b> {formatarData(processo.data_entrada)}
                    </p>

                    {processo.concluido && (
                      <p>
                        <b>Conclusão:</b>{" "}
                        {formatarData(processo.data_conclusao)}
                      </p>
                    )}

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
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${estilo.badge}`}>
                      SLA: {processo.sla} dias
                    </span>

                    <a
                      href={getLinkMapa(processo)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold text-blue-700 hover:underline"
                    >
                      📍 Maps
                    </a>
                  </div>

                  {processo.observacao && (
                    <p className="mt-4 rounded-lg bg-white/80 p-3 text-xs text-slate-600">
                      {processo.observacao}
                    </p>
                  )}

                  <button
                    onClick={() => alterarStatusProcesso(processo)}
                    className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-bold text-white ${
                      processo.concluido
                        ? "bg-slate-600 hover:bg-slate-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {processo.concluido ? "Reabrir processo" : "Concluir processo"}
                  </button>
                </div>
              );
            })}

            {processosFiltrados.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
                Nenhum processo encontrado.
              </div>
            )}
          </div>
        )}
      </section>
      {modalNovoAberto && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Novo processo
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Cadastre um processo diretamente no banco de dados.
          </p>
        </div>

        <button
          onClick={() => setModalNovoAberto(false)}
          className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
        >
          Fechar
        </button>
      </div>

      <form onSubmit={cadastrarNovoProcesso} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            SisGep *
          </label>
          <input
            value={novoProcesso.sisgep}
            onChange={(event) =>
              atualizarCampoNovoProcesso("sisgep", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
            placeholder="000.000.000.000.001"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Data de entrada
          </label>
          <input
            type="date"
            value={novoProcesso.data_entrada}
            onChange={(event) =>
              atualizarCampoNovoProcesso("data_entrada", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            SLA em dias
          </label>
          <input
            type="number"
            value={novoProcesso.sla}
            onChange={(event) =>
              atualizarCampoNovoProcesso("sla", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
            min="0"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Aberto por
          </label>
          <input
            value={novoProcesso.aberto_por}
            onChange={(event) =>
              atualizarCampoNovoProcesso("aberto_por", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Assunto
          </label>
          <select
            value={novoProcesso.assunto}
            onChange={(event) =>
              atualizarCampoNovoProcesso("assunto", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
          >
            <option value="">Selecione...</option>
            <option value="Ouvidoria/Denúncia">Ouvidoria/Denúncia</option>
            <option value="Inscrição Municipal/Alteração Contratual">
              Inscrição Municipal/Alteração Contratual
            </option>
            <option value="Encerramento/Cancelamento">
              Encerramento/Cancelamento
            </option>
            <option value="Processo Físico/Encerramento">
              Processo Físico/Encerramento
            </option>
            <option value="IPTU">IPTU</option>
            <option value="Outros/ Conferir no Processo">
              Outros/ Conferir no Processo
            </option>
            <option value="DRM/ISS">DRM/ISS</option>
            <option value="Revisão de Taxa">Revisão de Taxa</option>
            <option value="Pedidos de Feiras/Ambulantes">
              Pedidos de Feiras/Ambulantes
            </option>
            <option value="Horário Especial">Horário Especial</option>
            <option value="Feiras Livres">Feiras Livres</option>
            <option value="Ministério Público">Ministério Público</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Setor
          </label>
          <input
            value={novoProcesso.setor}
            onChange={(event) =>
              atualizarCampoNovoProcesso("setor", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Rua
          </label>
          <input
            value={novoProcesso.rua}
            onChange={(event) =>
              atualizarCampoNovoProcesso("rua", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Número
          </label>
          <input
            value={novoProcesso.numero_rua}
            onChange={(event) =>
              atualizarCampoNovoProcesso("numero_rua", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Bairro
          </label>
          <input
            value={novoProcesso.bairro}
            onChange={(event) =>
              atualizarCampoNovoProcesso("bairro", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">
            Observação
          </label>
          <textarea
            value={novoProcesso.observacao}
            onChange={(event) =>
              atualizarCampoNovoProcesso("observacao", event.target.value)
            }
            className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => setModalNovoAberto(false)}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={salvandoNovo}
            className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {salvandoNovo ? "Salvando..." : "Salvar processo"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </main>
  );
}