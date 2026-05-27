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
type Anexo = {
  id: string;
  processo_id: string;
  processo_sisgep: string | null;
  nome_arquivo: string | null;
  url: string;
  mime_type: string | null;
  tamanho_bytes: number | null;
  created_at: string;
};

type FiltroStatus = "todos" | "pendentes" | "concluidos";

type NovoProcessoForm = {
  sisgep: string;
  data_entrada: string;
  aberto_por: string;
  assunto: string;
  rua: string;
  numero_rua: string;
  observacao: string;
};

export default function FiscalizacaoPage() {
  const router = useRouter();

  const [processos, setProcessos] = useState<Processo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [anexosPorProcesso, setAnexosPorProcesso] = useState<Record<string, Anexo[]>>({});
const [enviandoAnexoProcessoId, setEnviandoAnexoProcessoId] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("pendentes");
const [processosSelecionados, setProcessosSelecionados] = useState<string[]>([]);
const [baixandoEmLote, setBaixandoEmLote] = useState(false);
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [salvandoNovo, setSalvandoNovo] = useState(false);
const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
const [salvandoEdicao, setSalvandoEdicao] = useState(false);
const [processoEditando, setProcessoEditando] = useState<Processo | null>(null);

const [processoEdicao, setProcessoEdicao] = useState<NovoProcessoForm>({
  sisgep: "",
  data_entrada: dataAtualInput(),
  aberto_por: "",
  assunto: "",
  rua: "",
  numero_rua: "",
  observacao: "",
});
  const [novoProcesso, setNovoProcesso] = useState<NovoProcessoForm>({
    sisgep: "",
    data_entrada: dataAtualInput(),
    aberto_por: "",
    assunto: "",
    rua: "",
    numero_rua: "",
    observacao: "",
  });

  useEffect(() => {
    verificarLoginECarregarProcessos();
  }, []);
async function carregarAnexos(listaProcessos: Processo[]) {
  if (listaProcessos.length === 0) {
    setAnexosPorProcesso({});
    return;
  }

  const ids = listaProcessos.map((processo) => processo.id);

  const { data, error } = await supabase
    .from("anexos")
    .select("*")
    .in("processo_id", ids)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar anexos:", error.message);
    return;
  }

  const agrupados: Record<string, Anexo[]> = {};

  (data || []).forEach((anexo) => {
    if (!agrupados[anexo.processo_id]) {
      agrupados[anexo.processo_id] = [];
    }

    agrupados[anexo.processo_id].push(anexo);
  });

  setAnexosPorProcesso(agrupados);
}
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

    const processosCarregados = data || [];

setProcessos(processosCarregados);
await carregarAnexos(processosCarregados);
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
    return dataAtualInput();
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

  function obterDiasDoProcesso(processo: Processo) {
    if (processo.concluido) {
      return processo.sla || calcularDiasEntreDatas(
        processo.data_entrada,
        processo.data_conclusao
      );
    }

    return calcularDiasEntreDatas(processo.data_entrada);
  }
function normalizarTexto(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}
async function buscarDadosAutomaticos(rua: string, numero: string) {
  const dadosPadrao = {
    bairro: null as string | null,
    setor: null as string | null,
    latitude: null as number | null,
    longitude: null as number | null,
  };

  if (!rua.trim() || !numero.trim()) {
    return dadosPadrao;
  }

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

    if (!resposta.ok) {
      return dadosPadrao;
    }

    const dados = await resposta.json();

    const bairroEncontrado = dados.bairro || null;
    const latitudeEncontrada =
      typeof dados.latitude === "number" ? dados.latitude : null;
    const longitudeEncontrada =
      typeof dados.longitude === "number" ? dados.longitude : null;

    let setorEncontrado: string | null = null;

    if (bairroEncontrado) {
      const bairroNormalizado = normalizarTexto(bairroEncontrado);

      const { data } = await supabase
        .from("bairros_setores")
        .select("setor")
        .eq("bairro_normalizado", bairroNormalizado)
        .maybeSingle();

      setorEncontrado = data?.setor || null;
    }

    return {
      bairro: bairroEncontrado,
      setor: setorEncontrado,
      latitude: latitudeEncontrada,
      longitude: longitudeEncontrada,
    };
  } catch {
    return dadosPadrao;
  }
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
function atualizarCampoEdicaoProcesso(
  campo: keyof NovoProcessoForm,
  valor: string
) {
  setProcessoEdicao((dadosAtuais) => ({
    ...dadosAtuais,
    [campo]: valor,
  }));
}

function abrirModalEdicao(processo: Processo) {
  setProcessoEditando(processo);

  setProcessoEdicao({
    sisgep: processo.sisgep || "",
    data_entrada: processo.data_entrada || dataAtualInput(),
    aberto_por: processo.aberto_por || "",
    assunto: processo.assunto || "",
    rua: processo.rua || "",
    numero_rua: processo.numero_rua || "",
    observacao: processo.observacao || "",
  });

  setModalEdicaoAberto(true);
}

function fecharModalEdicao() {
  setModalEdicaoAberto(false);
  setProcessoEditando(null);
}

async function salvarEdicaoProcesso(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!processoEditando) {
    return;
  }

  if (!processoEdicao.sisgep.trim()) {
    alert("Informe o número SisGep.");
    return;
  }

  if (!processoEdicao.data_entrada) {
    alert("Informe a data de entrada.");
    return;
  }

  setSalvandoEdicao(true);

  const ruaAnterior = processoEditando.rua || "";
  const numeroAnterior = processoEditando.numero_rua || "";

  const enderecoMudou =
    processoEdicao.rua.trim() !== ruaAnterior.trim() ||
    processoEdicao.numero_rua.trim() !== numeroAnterior.trim();

  const endereco = `${processoEdicao.rua}, ${processoEdicao.numero_rua}, Santana de Parnaíba, SP`;

  const dadosAutomaticos = await buscarDadosAutomaticos(
    processoEdicao.rua,
    processoEdicao.numero_rua
  );

  const bairroFinal =
    dadosAutomaticos.bairro ?? (enderecoMudou ? null : processoEditando.bairro);

  const setorFinal =
    dadosAutomaticos.setor ?? (enderecoMudou ? null : processoEditando.setor);

  const latitudeFinal =
    dadosAutomaticos.latitude ?? (enderecoMudou ? null : processoEditando.latitude);

  const longitudeFinal =
    dadosAutomaticos.longitude ?? (enderecoMudou ? null : processoEditando.longitude);

  const mapaLink =
    latitudeFinal && longitudeFinal
      ? `https://www.google.com/maps/search/?api=1&query=${latitudeFinal},${longitudeFinal}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          endereco
        )}`;

  const dataConclusao = processoEditando.concluido
    ? processoEditando.data_conclusao || dataAtualFormatoBanco()
    : null;

  const diasCalculados = processoEditando.concluido
    ? calcularDiasEntreDatas(processoEdicao.data_entrada, dataConclusao)
    : calcularDiasEntreDatas(processoEdicao.data_entrada);

  const { data, error } = await supabase
    .from("processos")
    .update({
      sisgep: processoEdicao.sisgep.trim(),
      data_entrada: processoEdicao.data_entrada,
      data_conclusao: dataConclusao,
      sla: diasCalculados,
      aberto_por: processoEdicao.aberto_por.trim() || null,
      assunto: processoEdicao.assunto.trim() || null,
      rua: processoEdicao.rua.trim() || null,
      numero_rua: processoEdicao.numero_rua.trim() || null,
      observacao: processoEdicao.observacao.trim() || null,
      bairro: bairroFinal,
      setor: setorFinal,
      latitude: latitudeFinal,
      longitude: longitudeFinal,
      mapa_link: mapaLink,
      updated_at: new Date().toISOString(),
    })
    .eq("id", processoEditando.id)
    .select()
    .single();

  setSalvandoEdicao(false);

  if (error) {
    alert("Erro ao editar processo: " + error.message);
    return;
  }

  if (data) {
    setProcessos((listaAtual) =>
      listaAtual.map((item) =>
        item.id === processoEditando.id ? data : item
      )
    );
  }

  fecharModalEdicao();
}
  async function cadastrarNovoProcesso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!novoProcesso.sisgep.trim()) {
      alert("Informe o número SisGep.");
      return;
    }

    if (!novoProcesso.data_entrada) {
      alert("Informe a data de entrada.");
      return;
    }

    setSalvandoNovo(true);

   const endereco = `${novoProcesso.rua}, ${novoProcesso.numero_rua}, Santana de Parnaíba, SP`;

const dadosAutomaticos = await buscarDadosAutomaticos(
  novoProcesso.rua,
  novoProcesso.numero_rua
);

const mapaLink =
  dadosAutomaticos.latitude && dadosAutomaticos.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${dadosAutomaticos.latitude},${dadosAutomaticos.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        endereco
      )}`;
 

    const diasCalculados = calcularDiasEntreDatas(novoProcesso.data_entrada);

    const { data, error } = await supabase
      .from("processos")
      .insert({
        sisgep: novoProcesso.sisgep.trim(),
        concluido: false,
        data_entrada: novoProcesso.data_entrada,
        data_conclusao: null,
        sla: diasCalculados,
        aberto_por: novoProcesso.aberto_por.trim() || null,
        assunto: novoProcesso.assunto.trim() || null,
        rua: novoProcesso.rua.trim() || null,
        numero_rua: novoProcesso.numero_rua.trim() || null,
        observacao: novoProcesso.observacao.trim() || null,

        // Estes campos serão gerados automaticamente na próxima etapa.
        bairro: dadosAutomaticos.bairro,
setor: dadosAutomaticos.setor,
latitude: dadosAutomaticos.latitude,
longitude: dadosAutomaticos.longitude,

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
      aberto_por: "",
      assunto: "",
      rua: "",
      numero_rua: "",
      observacao: "",
    });

    setModalNovoAberto(false);
  }
  function limparNomeArquivo(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

async function enviarAnexo(processo: Processo, arquivo: File) {
  if (!arquivo) return;

  const tamanhoMaximoMb = 10;
  const tamanhoMaximoBytes = tamanhoMaximoMb * 1024 * 1024;

  if (arquivo.size > tamanhoMaximoBytes) {
    alert(`O arquivo deve ter no máximo ${tamanhoMaximoMb} MB.`);
    return;
  }

  setEnviandoAnexoProcessoId(processo.id);

  const nomeSeguro = limparNomeArquivo(arquivo.name);
  const caminhoArquivo = `${processo.id}/${Date.now()}-${nomeSeguro}`;

  const { error: erroUpload } = await supabase.storage
    .from("anexos-processos")
    .upload(caminhoArquivo, arquivo, {
      cacheControl: "3600",
      upsert: false,
    });

  if (erroUpload) {
    setEnviandoAnexoProcessoId(null);
    alert("Erro ao enviar anexo: " + erroUpload.message);
    return;
  }

  const { data, error: erroBanco } = await supabase
    .from("anexos")
    .insert({
      processo_id: processo.id,
      processo_sisgep: processo.sisgep,
      nome_arquivo: arquivo.name,
      url: caminhoArquivo,
      mime_type: arquivo.type || null,
      tamanho_bytes: arquivo.size,
    })
    .select()
    .single();

  setEnviandoAnexoProcessoId(null);

  if (erroBanco) {
    alert("Arquivo enviado, mas erro ao salvar vínculo: " + erroBanco.message);
    return;
  }

  if (data) {
    setAnexosPorProcesso((atual) => ({
      ...atual,
      [processo.id]: [data, ...(atual[processo.id] || [])],
    }));
  }
}

async function abrirAnexo(anexo: Anexo) {
  const { data, error } = await supabase.storage
    .from("anexos-processos")
    .createSignedUrl(anexo.url, 60 * 5);

  if (error || !data?.signedUrl) {
    alert("Erro ao abrir anexo: " + (error?.message || "link não gerado"));
    return;
  }

  window.open(data.signedUrl, "_blank");
}

async function excluirAnexo(anexo: Anexo) {
  const confirmar = window.confirm(
    `Deseja excluir o anexo "${anexo.nome_arquivo || "arquivo"}"?`
  );

  if (!confirmar) return;

  const { error: erroStorage } = await supabase.storage
    .from("anexos-processos")
    .remove([anexo.url]);

  if (erroStorage) {
    alert("Erro ao excluir arquivo: " + erroStorage.message);
    return;
  }

  const { error: erroBanco } = await supabase
    .from("anexos")
    .delete()
    .eq("id", anexo.id);

  if (erroBanco) {
    alert("Arquivo excluído, mas erro ao remover registro: " + erroBanco.message);
    return;
  }

  setAnexosPorProcesso((atual) => {
    const listaAtual = atual[anexo.processo_id] || [];

    return {
      ...atual,
      [anexo.processo_id]: listaAtual.filter((item) => item.id !== anexo.id),
    };
  });
}
async function excluirProcesso(processo: Processo) {
  const confirmar = window.confirm(
    `Tem certeza que deseja excluir o processo ${processo.sisgep}? Essa ação não poderá ser desfeita.`
  );

  if (!confirmar) {
    return;
  }

  const { error } = await supabase
    .from("processos")
    .delete()
    .eq("id", processo.id);

  if (error) {
    alert("Erro ao excluir processo: " + error.message);
    return;
  }

  setProcessos((listaAtual) =>
    listaAtual.filter((item) => item.id !== processo.id)
  );
}
function alternarSelecaoProcesso(processoId: string) {
  setProcessosSelecionados((selecionadosAtuais) =>
    selecionadosAtuais.includes(processoId)
      ? selecionadosAtuais.filter((id) => id !== processoId)
      : [...selecionadosAtuais, processoId]
  );
}

function limparSelecaoProcessos() {
  setProcessosSelecionados([]);
}

function alternarSelecionarTodosFiltrados() {
  const idsPendentesFiltrados = processosFiltrados
    .filter((processo) => !processo.concluido)
    .map((processo) => processo.id);

  if (idsPendentesFiltrados.length === 0) {
    alert("Não há processos pendentes na lista filtrada.");
    return;
  }

  const todosJaSelecionados = idsPendentesFiltrados.every((id) =>
    processosSelecionados.includes(id)
  );

  if (todosJaSelecionados) {
    setProcessosSelecionados((selecionadosAtuais) =>
      selecionadosAtuais.filter((id) => !idsPendentesFiltrados.includes(id))
    );
    return;
  }

  setProcessosSelecionados((selecionadosAtuais) =>
    Array.from(new Set([...selecionadosAtuais, ...idsPendentesFiltrados]))
  );
}

async function concluirSelecionadosEmLote() {
  const processosParaConcluir = processos.filter(
    (processo) =>
      processosSelecionados.includes(processo.id) && !processo.concluido
  );

  if (processosParaConcluir.length === 0) {
    alert("Selecione pelo menos um processo pendente.");
    return;
  }

  const confirmar = window.confirm(
    `Deseja concluir ${processosParaConcluir.length} processo(s) selecionado(s)?`
  );

  if (!confirmar) {
    return;
  }

  setBaixandoEmLote(true);

  const dataConclusao = dataAtualFormatoBanco();

  const resultados = await Promise.all(
    processosParaConcluir.map(async (processo) => {
      const diasCalculados = calcularDiasEntreDatas(
        processo.data_entrada,
        dataConclusao
      );

      const { error } = await supabase
        .from("processos")
        .update({
          concluido: true,
          data_conclusao: dataConclusao,
          sla: diasCalculados,
          updated_at: new Date().toISOString(),
        })
        .eq("id", processo.id);

      return {
        id: processo.id,
        erro: error,
        diasCalculados,
      };
    })
  );

  setBaixandoEmLote(false);

  const erros = resultados.filter((resultado) => resultado.erro);

  if (erros.length > 0) {
    alert(`Alguns processos não foram concluídos. Erros: ${erros.length}`);
  }

  const idsConcluidos = resultados
    .filter((resultado) => !resultado.erro)
    .map((resultado) => resultado.id);

  setProcessos((listaAtual) =>
    listaAtual.map((processo) => {
      const resultado = resultados.find((item) => item.id === processo.id);

      if (!resultado || resultado.erro) {
        return processo;
      }

      return {
        ...processo,
        concluido: true,
        data_conclusao: dataConclusao,
        sla: resultado.diasCalculados,
      };
    })
  );

  setProcessosSelecionados((selecionadosAtuais) =>
    selecionadosAtuais.filter((id) => !idsConcluidos.includes(id))
  );
}
  async function alterarStatusProcesso(processo: Processo) {
    const novoStatus = !processo.concluido;
    const dataConclusao = novoStatus ? dataAtualFormatoBanco() : null;

    const diasCalculados = novoStatus
      ? calcularDiasEntreDatas(processo.data_entrada, dataConclusao)
      : calcularDiasEntreDatas(processo.data_entrada);

    const { error } = await supabase
      .from("processos")
      .update({
        concluido: novoStatus,
        data_conclusao: dataConclusao,
        sla: diasCalculados,
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
              data_conclusao: dataConclusao,
              sla: diasCalculados,
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

    const endereco = `${processo.rua || ""}, ${processo.numero_rua || ""}, Santana de Parnaíba, SP`;

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      endereco
    )}`;
  }

  function getEstiloDias(processo: Processo) {
    const dias = obterDiasDoProcesso(processo);

    if (processo.concluido) {
      return {
        fundo: "bg-white",
        borda: "border-slate-300",
        badge: "bg-slate-100 text-slate-700",
      };
    }

    if (dias >= 15) {
      return {
        fundo: "bg-red-50",
        borda: "border-red-500",
        badge: "bg-red-100 text-red-700",
      };
    }

    if (dias >= 10) {
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
                <Link
  href="/fiscalizacao/mapa"
  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500"
>
  Mapa
</Link>
                <Link
  href="/fiscalizacao/dashboard"
  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500"
>
  Dashboard
</Link>
                <Link
  href="/fiscalizacao/configuracoes"
  className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600"
>
  Configurações
</Link>
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
<div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h2 className="text-lg font-bold text-slate-800">
        Baixa em lote
      </h2>

      <p className="mt-1 text-sm text-slate-600">
        Selecione processos pendentes e conclua todos de uma vez.
      </p>

      <p className="mt-2 text-sm font-bold text-blue-800">
        {processosSelecionados.length} processo(s) selecionado(s)
      </p>
    </div>

    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        onClick={alternarSelecionarTodosFiltrados}
        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
      >
        Selecionar pendentes filtrados
      </button>

      <button
        onClick={limparSelecaoProcessos}
        disabled={processosSelecionados.length === 0}
        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Limpar seleção
      </button>

      <button
        onClick={concluirSelecionadosEmLote}
        disabled={baixandoEmLote || processosSelecionados.length === 0}
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {baixandoEmLote ? "Concluindo..." : "Concluir selecionados"}
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {processosFiltrados.map((processo) => {
              const estilo = getEstiloDias(processo);
              const dias = obterDiasDoProcesso(processo);

              return (
                <div
                  key={processo.id}
                  className={`rounded-2xl border-l-4 ${estilo.borda} ${estilo.fundo} p-5 shadow-sm`}
                >
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2">
  <input
    type="checkbox"
    checked={processosSelecionados.includes(processo.id)}
    disabled={processo.concluido}
    onChange={() => alternarSelecaoProcesso(processo.id)}
    className="h-4 w-4"
  />

  <span className="text-xs font-bold text-slate-600">
    {processo.concluido
      ? "Processo já concluído"
      : "Selecionar para baixa em lote"}
  </span>
</div>
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
                      <b>Bairro:</b> {processo.bairro || "Será gerado automaticamente"}
                    </p>

                    <p>
                      <b>Setor:</b> {processo.setor || "Será gerado automaticamente"}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${estilo.badge}`}>
                      {processo.concluido
                        ? `Tempo no setor: ${dias} dias`
                        : `Dias da entrada: ${dias}`}
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
                  <div className="mt-4 rounded-xl bg-white/80 p-3">
  <div className="flex items-center justify-between gap-3">
    <p className="text-sm font-bold text-slate-700">
      📎 Anexos
    </p>

    <span className="text-xs font-semibold text-slate-500">
      {(anexosPorProcesso[processo.id] || []).length} arquivo(s)
    </span>
  </div>

  <label className="mt-3 block cursor-pointer rounded-lg border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-center text-xs font-bold text-blue-700 hover:bg-blue-100">
    {enviandoAnexoProcessoId === processo.id
      ? "Enviando..."
      : "Anexar foto/PDF"}

    <input
      type="file"
      accept="image/*,application/pdf"
      className="hidden"
      disabled={enviandoAnexoProcessoId === processo.id}
      onChange={(event) => {
        const arquivo = event.target.files?.[0];

        if (arquivo) {
          enviarAnexo(processo, arquivo);
        }

        event.currentTarget.value = "";
      }}
    />
  </label>

  <div className="mt-3 space-y-2">
    {(anexosPorProcesso[processo.id] || []).map((anexo) => (
      <div
        key={anexo.id}
        className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2"
      >
        <button
          onClick={() => abrirAnexo(anexo)}
          className="min-w-0 flex-1 truncate text-left text-xs font-semibold text-blue-700 hover:underline"
          title={anexo.nome_arquivo || "Ver anexo"}
        >
          👁️ {anexo.nome_arquivo || "Ver anexo"}
        </button>

        <button
          onClick={() => excluirAnexo(anexo)}
          className="rounded bg-red-100 px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-200"
        >
          Excluir
        </button>
      </div>
    ))}

    {(anexosPorProcesso[processo.id] || []).length === 0 && (
      <p className="text-xs text-slate-500">
        Nenhum anexo enviado.
      </p>
    )}
  </div>
</div>
<button
  onClick={() => abrirModalEdicao(processo)}
  className="mt-4 w-full rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600"
  
>
  Editar processo
</button>
<button
  onClick={() => excluirProcesso(processo)}
  className="mt-3 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
>
  Excluir processo
</button>
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
                  Informe apenas os dados de entrada. Bairro, setor, Maps e dias serão gerados pelo sistema.
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
                  Data de entrada *
                </label>
                <input
                  type="date"
                  value={novoProcesso.data_entrada}
                  onChange={(event) =>
                    atualizarCampoNovoProcesso("data_entrada", event.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Nº SisGep *
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
      {modalEdicaoAberto && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Editar processo
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Altere os dados do processo. Ao salvar, bairro, setor, coordenadas, Maps e dias serão recalculados.
          </p>
        </div>

        <button
          onClick={fecharModalEdicao}
          className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
        >
          Fechar
        </button>
      </div>

      <form onSubmit={salvarEdicaoProcesso} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Data de entrada *
          </label>
          <input
            type="date"
            value={processoEdicao.data_entrada}
            onChange={(event) =>
              atualizarCampoEdicaoProcesso("data_entrada", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Nº SisGep *
          </label>
          <input
            value={processoEdicao.sisgep}
            onChange={(event) =>
              atualizarCampoEdicaoProcesso("sisgep", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
            placeholder="000.000.000.000.001"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Aberto por
          </label>
          <input
            value={processoEdicao.aberto_por}
            onChange={(event) =>
              atualizarCampoEdicaoProcesso("aberto_por", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Assunto
          </label>
          <select
            value={processoEdicao.assunto}
            onChange={(event) =>
              atualizarCampoEdicaoProcesso("assunto", event.target.value)
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
            Rua
          </label>
          <input
            value={processoEdicao.rua}
            onChange={(event) =>
              atualizarCampoEdicaoProcesso("rua", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Número
          </label>
          <input
            value={processoEdicao.numero_rua}
            onChange={(event) =>
              atualizarCampoEdicaoProcesso("numero_rua", event.target.value)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">
            Observação
          </label>
          <textarea
            value={processoEdicao.observacao}
            onChange={(event) =>
              atualizarCampoEdicaoProcesso("observacao", event.target.value)
            }
            className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={fecharModalEdicao}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={salvandoEdicao}
            className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {salvandoEdicao ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </main>
  );
}