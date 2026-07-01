"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type {
  Processo,
  Anexo,
  AuditoriaProcesso,
  FiltroStatus,
  ModoVisualizacao,
  OrdenacaoProcessos,
  TipoFiltroPeriodo,
  ModoConclusao,
  NovoProcessoForm,
  GrupoResumo,
} from "./types";
import { useAnexos } from "./hooks/useAnexos";
import { usePerfilUsuario } from "./hooks/usePerfilUsuario";
import { opcoesAssunto } from "./constants";
import {
  aplicarMascaraSisgep,
  calcularDiasEntreDatas,
  dataAtualFormatoBanco,
  dataAtualInput,
  dataConclusaoValida,
  escaparCsv,
  escaparHtml,
  extrairSisgepsDigitados,
  formatarData,
  formatarDataHora,
  normalizarTexto,
  rotuloAcaoAuditoria,
  somenteNumeros,
} from "./utils";

type BairroSetorOpcao = {
  bairro: string;
  setor: string;
};

export default function FiscalizacaoPage() {
  const router = useRouter();

  const [processos, setProcessos] = useState<Processo[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] =
    useState<FiltroStatus>("pendentes");
  const [filtroAssunto, setFiltroAssunto] = useState("todos");
  const [filtroSetor, setFiltroSetor] = useState("todos");
  const [filtroLocalizacaoIncompleta, setFiltroLocalizacaoIncompleta] =
    useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(24);
  const [modoVisualizacao, setModoVisualizacao] =
    useState<ModoVisualizacao>("cards");
  const [ordenacao, setOrdenacao] =
    useState<OrdenacaoProcessos>("dias_desc");

  const [tipoFiltroPeriodo, setTipoFiltroPeriodo] =
    useState<TipoFiltroPeriodo>("todos");
  const [dataInicialFiltro, setDataInicialFiltro] = useState("");
  const [dataFinalFiltro, setDataFinalFiltro] = useState("");

  const [processosSelecionados, setProcessosSelecionados] = useState<string[]>(
    []
  );

  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [salvandoNovo, setSalvandoNovo] = useState(false);
  const [mensagemSucessoNovo, setMensagemSucessoNovo] = useState("");
  const [buscandoLocalizacaoNovo, setBuscandoLocalizacaoNovo] = useState(false);
  const [mensagemLocalizacaoNovo, setMensagemLocalizacaoNovo] = useState("");

  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [buscandoLocalizacaoEdicao, setBuscandoLocalizacaoEdicao] = useState(false);
  const [mensagemLocalizacaoEdicao, setMensagemLocalizacaoEdicao] = useState("");
  const [processoEditando, setProcessoEditando] =
    useState<Processo | null>(null);

  const [modalConclusaoAberto, setModalConclusaoAberto] = useState(false);
  const [modoConclusao, setModoConclusao] =
    useState<ModoConclusao>("individual");
  const [processoConclusao, setProcessoConclusao] = useState<Processo | null>(
    null
  );
  const [dataConclusaoSelecionada, setDataConclusaoSelecionada] = useState(
    dataAtualInput()
  );
  const [salvandoConclusao, setSalvandoConclusao] = useState(false);

  const [modalCorrecaoDataAberto, setModalCorrecaoDataAberto] =
    useState(false);
  const [sisgepsCorrecaoData, setSisgepsCorrecaoData] = useState("");
  const [novaDataConclusaoCorrecao, setNovaDataConclusaoCorrecao] = useState(
    dataAtualInput()
  );
  const [salvandoCorrecaoData, setSalvandoCorrecaoData] = useState(false);
  const [mensagemCorrecaoData, setMensagemCorrecaoData] = useState("");

  const [modalCorrecaoLocalizacaoAberto, setModalCorrecaoLocalizacaoAberto] =
    useState(false);
  const [processoLocalizacaoEditando, setProcessoLocalizacaoEditando] =
    useState<Processo | null>(null);
  const [bairroCorrecaoLocalizacao, setBairroCorrecaoLocalizacao] = useState("");
  const [setorCorrecaoLocalizacao, setSetorCorrecaoLocalizacao] = useState("");
  const [mensagemCorrecaoLocalizacao, setMensagemCorrecaoLocalizacao] = useState("");
  const [opcoesBairrosSetores, setOpcoesBairrosSetores] = useState<BairroSetorOpcao[]>([]);
  const [carregandoBairrosSetores, setCarregandoBairrosSetores] = useState(false);
  const [salvandoCorrecaoLocalizacao, setSalvandoCorrecaoLocalizacao] = useState(false);

  const [modalHistoricoAberto, setModalHistoricoAberto] = useState(false);
  const [processoHistorico, setProcessoHistorico] = useState<Processo | null>(
    null
  );
  const [historicoProcesso, setHistoricoProcesso] = useState<
    AuditoriaProcesso[]
  >([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [erroHistorico, setErroHistorico] = useState("");

  const [processoEdicao, setProcessoEdicao] = useState<NovoProcessoForm>({
    sisgep: "",
    data_entrada: dataAtualInput(),
    aberto_por: "",
    assunto: "",
    rua: "",
    numero_rua: "",
    bairro: "",
    setor: "",
    observacao: "",
  });

  const [novoProcesso, setNovoProcesso] = useState<NovoProcessoForm>({
    sisgep: "",
    data_entrada: dataAtualInput(),
    aberto_por: "",
    assunto: "",
    rua: "",
    numero_rua: "",
    bairro: "",
    setor: "",
    observacao: "",
  });

  // --- ESTADOS DO RELATÓRIO PERSONALIZADO DE PENDÊNCIAS ---
  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);
  const [relSetoresSelecionados, setRelSetoresSelecionados] = useState<string[]>([]);
  const [relAssuntosSelecionados, setRelAssuntosSelecionados] = useState<string[]>([]);
  const [relBairrosSelecionados, setRelBairrosSelecionados] = useState<string[]>([]);
  const [relFiltroSla, setRelFiltroSla] = useState("todos");

  const {
    perfilUsuario,
    carregarPerfilUsuario,
    limparPerfilUsuario,
    podeGerenciarProcessos,
    podeExcluirProcessos,
    podeAdministrarUsuarios,
  } = usePerfilUsuario();

  async function registrarAuditoriaProcesso({
    processo,
    acao,
    descricao,
    dadosAnteriores,
    dadosNovos,
  }: {
    processo?: Processo | null;
    acao: string;
    descricao?: string;
    dadosAnteriores?: unknown;
    dadosNovos?: unknown;
  }) {
    try {
      const { data: sessao } = await supabase.auth.getSession();
      const usuario = sessao.session?.user;

      await supabase.from("auditoria_processos").insert({
        processo_id: processo?.id || null,
        processo_sisgep: processo?.sisgep || null,
        user_id: usuario?.id || null,
        usuario_email: perfilUsuario?.email || usuario?.email || null,
        usuario_nome:
          perfilUsuario?.nome || perfilUsuario?.email || usuario?.email || null,
        acao,
        descricao: descricao || null,
        dados_anteriores: dadosAnteriores || null,
        dados_novos: dadosNovos || null,
      });
    } catch (error) {
      console.error("Erro ao registrar auditoria:", error);
    }
  }

  useEffect(() => {
    verificarLoginECarregarProcessos();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [
    busca,
    filtroStatus,
    filtroAssunto,
    filtroSetor,
    itensPorPagina,
    ordenacao,
    tipoFiltroPeriodo,
    dataInicialFiltro,
    dataFinalFiltro,
  ]);

  const {
    anexosPorProcesso,
    enviandoAnexoProcessoId,
    carregarAnexos,
    enviarAnexo,
    excluirAnexo,
  } = useAnexos({
    podeGerenciarProcessos,
    registrarAuditoriaProcesso,
  });

  async function verificarLoginECarregarProcessos() {
    setCarregando(true);
    setErro("");

    const { data: sessao } = await supabase.auth.getSession();

    if (!sessao.session) {
      router.push("/login");
      return;
    }

    const { perfil, erro: erroPerfil } = await carregarPerfilUsuario(
      sessao.session.user.id,
      sessao.session.user.email
    );

    if (erroPerfil) {
      setErro(erroPerfil);
      setCarregando(false);
      return;
    }

    if (!perfil) {
      setErro("Erro ao carregar perfil do usuário.");
      setCarregando(false);
      return;
    }

    if (!perfil.ativo) {
      await supabase.auth.signOut();
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
    limparPerfilUsuario();
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function abrirHistoricoProcesso(processo: Processo) {
    setProcessoHistorico(processo);
    setHistoricoProcesso([]);
    setErroHistorico("");
    setModalHistoricoAberto(true);
    setCarregandoHistorico(true);

    const { data, error } = await supabase
      .from("auditoria_processos")
      .select("*")
      .eq("processo_id", processo.id)
      .order("created_at", { ascending: false });

    setCarregandoHistorico(false);

    if (error) {
      setErroHistorico("Erro ao carregar histórico: " + error.message);
      return;
    }

    setHistoricoProcesso((data || []) as AuditoriaProcesso[]);
  }

  function fecharHistoricoProcesso() {
    setModalHistoricoAberto(false);
    setProcessoHistorico(null);
    setHistoricoProcesso([]);
    setErroHistorico("");
    setCarregandoHistorico(false);
  }

  function alterarTipoFiltroPeriodo(valor: TipoFiltroPeriodo) {
    setTipoFiltroPeriodo(valor);

    if (valor === "conclusao") {
      setFiltroStatus("concluidos");
    }
  }

  function abrirModalConclusaoIndividual(processo: Processo) {
    if (!podeGerenciarProcessos) {
      alert("Acesso restrito para concluir processos.");
      return;
    }

    setModoConclusao("individual");
    setProcessoConclusao(processo);
    setDataConclusaoSelecionada(processo.data_conclusao || dataAtualInput());
    setModalConclusaoAberto(true);
  }

  function abrirModalConclusaoLote() {
    if (!podeGerenciarProcessos) {
      alert("Acesso restrito para conclusão de processos.");
      return;
    }

    const processosParaConcluir = processos.filter(
      (processo) =>
        processosSelecionados.includes(processo.id) && !processo.concluido
    );

    if (processosParaConcluir.length === 0) {
      alert("Selecione pelo menos um processo pendente.");
      return;
    }

    setModoConclusao("lote");
    setProcessoConclusao(null);
    setDataConclusaoSelecionada(dataAtualInput());
    setModalConclusaoAberto(true);
  }

  function fecharModalConclusao() {
    if (salvandoConclusao) return;

    setModalConclusaoAberto(false);
    setProcessoConclusao(null);
    setDataConclusaoSelecionada(dataAtualInput());
  }

  function abrirModalCorrecaoData() {
    if (!podeGerenciarProcessos) {
      alert("Acesso restrito para correção de datas.");
      return;
    }

    setSisgepsCorrecaoData("");
    setNovaDataConclusaoCorrecao(dataAtualInput());
    setMensagemCorrecaoData("");
    setModalCorrecaoDataAberto(true);
  }

  function abrirModalCorrecaoLocalizacao() {
    if (!podeGerenciarProcessos) {
      alert("Acesso restrito para corrigir localização.");
      return;
    }

    setModalCorrecaoLocalizacaoAberto(true);
    setProcessoLocalizacaoEditando(null);
    setBairroCorrecaoLocalizacao("");
    setSetorCorrecaoLocalizacao("");
    setMensagemCorrecaoLocalizacao("");
    void carregarOpcoesBairrosSetores();
  }

  function fecharModalCorrecaoLocalizacao() {
    if (salvandoCorrecaoLocalizacao) return;

    setModalCorrecaoLocalizacaoAberto(false);
    setProcessoLocalizacaoEditando(null);
    setBairroCorrecaoLocalizacao("");
    setSetorCorrecaoLocalizacao("");
    setMensagemCorrecaoLocalizacao("");
  }

  function selecionarProcessoParaCorrigirLocalizacao(processo: Processo) {
    setProcessoLocalizacaoEditando(processo);
    setBairroCorrecaoLocalizacao(processo.bairro || "");
    setSetorCorrecaoLocalizacao(processo.setor || "");
    setMensagemCorrecaoLocalizacao("");
  }

  function fecharModalCorrecaoData() {
    if (salvandoCorrecaoData) return;

    setModalCorrecaoDataAberto(false);
    setSisgepsCorrecaoData("");
    setNovaDataConclusaoCorrecao(dataAtualInput());
    setMensagemCorrecaoData("");
  }

  function obterDiasDoProcesso(processo: Processo) {
    if (processo.concluido) {
      return (
        processo.sla ||
        calcularDiasEntreDatas(processo.data_entrada, processo.data_conclusao)
      );
    }

    return calcularDiasEntreDatas(processo.data_entrada);
  }
  function isLocalizacaoIncompleta(processo: Processo) {
  return !processo.bairro?.trim() || !processo.setor?.trim();
}

  async function buscarSetorPorBairro(bairro: string) {
    const bairroNormalizado = normalizarTexto(bairro);

    if (!bairroNormalizado) {
      return null;
    }

    const { data, error } = await supabase
      .from("bairros_setores")
      .select("setor")
      .eq("bairro_normalizado", bairroNormalizado)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar setor pelo bairro:", error);
      return null;
    }

    return data?.setor || null;
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

  async function carregarOpcoesBairrosSetores() {
    setCarregandoBairrosSetores(true);

    const { data, error } = await supabase
      .from("bairros_setores")
      .select("bairro,setor")
      .order("bairro", { ascending: true });

    setCarregandoBairrosSetores(false);

    if (error) {
      setMensagemCorrecaoLocalizacao("Erro ao carregar bairros/setores: " + error.message);
      return;
    }

    setOpcoesBairrosSetores((data || []) as BairroSetorOpcao[]);
  }

  async function salvarCorrecaoLocalizacao() {
    if (!podeGerenciarProcessos) {
      alert("Acesso restrito para corrigir localização.");
      return;
    }

    if (!processoLocalizacaoEditando) {
      setMensagemCorrecaoLocalizacao("Selecione um processo.");
      return;
    }

    const bairroFinal = bairroCorrecaoLocalizacao.trim();
    const setorFinal = setorCorrecaoLocalizacao.trim();

    if (!bairroFinal || !setorFinal) {
      setMensagemCorrecaoLocalizacao("Selecione um bairro válido para preencher bairro e setor.");
      return;
    }

    setSalvandoCorrecaoLocalizacao(true);
    setMensagemCorrecaoLocalizacao("");

    const { data, error } = await supabase
      .from("processos")
      .update({
        bairro: bairroFinal,
        setor: setorFinal,
        updated_at: new Date().toISOString(),
      })
      .eq("id", processoLocalizacaoEditando.id)
      .select()
      .single();

    setSalvandoCorrecaoLocalizacao(false);

    if (error) {
      setMensagemCorrecaoLocalizacao("Erro ao corrigir localização: " + error.message);
      return;
    }

    if (data) {
      setProcessos((listaAtual) =>
        listaAtual.map((item) => (item.id === processoLocalizacaoEditando.id ? data : item))
      );

      await registrarAuditoriaProcesso({
        processo: processoLocalizacaoEditando,
        acao: "localizacao_corrigida",
        descricao: `Localização do processo ${processoLocalizacaoEditando.sisgep} corrigida.`,
        dadosAnteriores: processoLocalizacaoEditando,
        dadosNovos: data,
      });
    }

    setMensagemCorrecaoLocalizacao("Localização corrigida com sucesso.");
    setProcessoLocalizacaoEditando(null);
    setBairroCorrecaoLocalizacao("");
    setSetorCorrecaoLocalizacao("");
  }

  function atualizarCampoNovoProcesso(
    campo: keyof NovoProcessoForm,
    valor: string
  ) {
    setMensagemSucessoNovo("");
    setMensagemLocalizacaoNovo("");
    setNovoProcesso((dadosAtuais) => ({
      ...dadosAtuais,
      [campo]: valor,
    }));
  }

  function atualizarCampoEdicaoProcesso(
    campo: keyof NovoProcessoForm,
    valor: string
  ) {
    setMensagemLocalizacaoEdicao("");
    setProcessoEdicao((dadosAtuais) => ({
      ...dadosAtuais,
      [campo]: valor,
    }));
  }

  async function preencherLocalizacaoNovo() {
    const rua = novoProcesso.rua.trim();
    const numero = novoProcesso.numero_rua.trim();

    setMensagemLocalizacaoNovo("");

    if (!rua || !numero) {
      setMensagemLocalizacaoNovo(
        "Informe rua e número para buscar bairro automaticamente."
      );
      return;
    }

    setBuscandoLocalizacaoNovo(true);

    const dados = await buscarDadosAutomaticos(rua, numero);

    setBuscandoLocalizacaoNovo(false);

    if (!dados.bairro) {
      setMensagemLocalizacaoNovo(
        "Não foi possível encontrar o bairro automaticamente. Digite o bairro manualmente."
      );
      return;
    }

    const setorEncontrado = dados.setor || (await buscarSetorPorBairro(dados.bairro));

    setNovoProcesso((atual) => ({
      ...atual,
      bairro: dados.bairro || atual.bairro,
      setor: setorEncontrado || atual.setor,
    }));

    if (!setorEncontrado) {
      setMensagemLocalizacaoNovo(
        "Bairro encontrado, mas o setor não foi localizado. Digite o setor manualmente."
      );
      return;
    }

    setMensagemLocalizacaoNovo("Bairro e setor preenchidos automaticamente.");
  }

  async function preencherLocalizacaoEdicao() {
    const rua = processoEdicao.rua.trim();
    const numero = processoEdicao.numero_rua.trim();

    setMensagemLocalizacaoEdicao("");

    if (!rua || !numero) {
      setMensagemLocalizacaoEdicao(
        "Informe rua e número para buscar bairro automaticamente."
      );
      return;
    }

    setBuscandoLocalizacaoEdicao(true);

    const dados = await buscarDadosAutomaticos(rua, numero);

    setBuscandoLocalizacaoEdicao(false);

    if (!dados.bairro) {
      setMensagemLocalizacaoEdicao(
        "Não foi possível encontrar o bairro automaticamente. Digite o bairro manualmente."
      );
      return;
    }

    const setorEncontrado = dados.setor || (await buscarSetorPorBairro(dados.bairro));

    setProcessoEdicao((atual) => ({
      ...atual,
      bairro: dados.bairro || atual.bairro,
      setor: setorEncontrado || atual.setor,
    }));

    if (!setorEncontrado) {
      setMensagemLocalizacaoEdicao(
        "Bairro encontrado, mas o setor não foi localizado. Digite o setor manualmente."
      );
      return;
    }

    setMensagemLocalizacaoEdicao("Bairro e setor preenchidos automaticamente.");
  }

  async function atualizarBairroNovo(valor: string) {
    atualizarCampoNovoProcesso("bairro", valor);

    const setorEncontrado = await buscarSetorPorBairro(valor);

    if (setorEncontrado) {
      setNovoProcesso((atual) => ({
        ...atual,
        bairro: valor,
        setor: setorEncontrado,
      }));

      setMensagemLocalizacaoNovo("Setor preenchido automaticamente pelo bairro.");
    }
  }

  async function atualizarBairroEdicao(valor: string) {
    atualizarCampoEdicaoProcesso("bairro", valor);

    const setorEncontrado = await buscarSetorPorBairro(valor);

    if (setorEncontrado) {
      setProcessoEdicao((atual) => ({
        ...atual,
        bairro: valor,
        setor: setorEncontrado,
      }));

      setMensagemLocalizacaoEdicao("Setor preenchido automaticamente pelo bairro.");
    }
  }

  function abrirModalEdicao(processo: Processo) {
    if (!podeGerenciarProcessos) {
      alert("Acesso restrito para editar processos.");
      return;
    }

    setProcessoEditando(processo);
    setMensagemLocalizacaoEdicao("");
    setBuscandoLocalizacaoEdicao(false);

    setProcessoEdicao({
      sisgep: processo.sisgep || "",
      data_entrada: processo.data_entrada || dataAtualInput(),
      aberto_por: processo.aberto_por || "",
      assunto: processo.assunto || "",
      rua: processo.rua || "",
      numero_rua: processo.numero_rua || "",
      bairro: processo.bairro || "",
      setor: processo.setor || "",
      observacao: processo.observacao || "",
    });

    setModalEdicaoAberto(true);
  }

  function fecharModalNovo() {
    setModalNovoAberto(false);
    setMensagemSucessoNovo("");
    setMensagemLocalizacaoNovo("");
    setBuscandoLocalizacaoNovo(false);
  }

  function fecharModalEdicao() {
    setModalEdicaoAberto(false);
    setMensagemLocalizacaoEdicao("");
    setBuscandoLocalizacaoEdicao(false);
    setProcessoEditando(null);
  }

  async function salvarEdicaoProcesso(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!podeGerenciarProcessos) {
      alert("Acesso restrito para editar processos.");
      return;
    }

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

    setProcessoEdicao((estadoAtual) => ({
      ...estadoAtual,
      bairro: dadosAutomaticos.bairro || estadoAtual.bairro,
      setor: dadosAutomaticos.setor || estadoAtual.setor,
    }));

    const bairroFinal =
      processoEdicao.bairro.trim() ||
      dadosAutomaticos.bairro ||
      (enderecoMudou ? null : processoEditando.bairro);

    const setorFinal =
      processoEdicao.setor.trim() ||
      dadosAutomaticos.setor ||
      (enderecoMudou ? null : processoEditando.setor);

    const latitudeFinal =
      dadosAutomaticos.latitude ??
      (enderecoMudou ? null : processoEditando.latitude);

    const longitudeFinal =
      dadosAutomaticos.longitude ??
      (enderecoMudou ? null : processoEditando.longitude);

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

      void registrarAuditoriaProcesso({
        processo: data,
        acao: "processo_editado",
        descricao: `Processo ${data.sisgep} editado.`,
        dadosAnteriores: processoEditando,
        dadosNovos: data,
      });
    }

    fecharModalEdicao();
  }

  async function cadastrarNovoProcesso(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!podeGerenciarProcessos) {
      alert("Acesso restrito para cadastrar processos.");
      return;
    }

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

    setNovoProcesso((estadoAtual) => ({
      ...estadoAtual,
      bairro: dadosAutomaticos.bairro || estadoAtual.bairro,
      setor: dadosAutomaticos.setor || estadoAtual.setor,
    }));

    const bairroFinal = novoProcesso.bairro.trim() || dadosAutomaticos.bairro || null;
    const setorFinal = novoProcesso.setor.trim() || dadosAutomaticos.setor || null;

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
        bairro: bairroFinal,
        setor: setorFinal,
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
      setPaginaAtual(1);

      void registrarAuditoriaProcesso({
        processo: data,
        acao: "processo_criado",
        descricao: `Processo ${data.sisgep} cadastrado.`,
        dadosNovos: data,
      });
    }

    setNovoProcesso({
      sisgep: "",
      data_entrada: dataAtualInput(),
      aberto_por: "",
      assunto: "",
      rua: "",
      numero_rua: "",
      bairro: "",
      setor: "",
      observacao: "",
    });

    setMensagemSucessoNovo("Processo cadastrado com sucesso. Você já pode lançar outro.");
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

  async function excluirProcesso(processo: Processo) {
    if (!podeExcluirProcessos) {
      alert("Acesso restrito para excluir processos.");
      return;
    }

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o processo ${processo.sisgep}? Essa ação não poderá ser desfeita.`
    );

    if (!confirmar) return;

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

    void registrarAuditoriaProcesso({
      processo,
      acao: "processo_excluido",
      descricao: `Processo ${processo.sisgep} excluído.`,
      dadosAnteriores: processo,
    });

    setProcessosSelecionados((selecionadosAtuais) =>
      selecionadosAtuais.filter((id) => id !== processo.id)
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
    const idsPendentesFiltrados = processosPaginados
      .filter((processo) => !processo.concluido)
      .map((processo) => processo.id);

    if (idsPendentesFiltrados.length === 0) {
      alert("Não há processos pendentes na página atual.");
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

  async function confirmarConclusao() {
    if (!podeGerenciarProcessos) {
      alert("Acesso restrito para concluir processos.");
      return;
    }

    if (!dataConclusaoValida(dataConclusaoSelecionada)) {
      alert("A data de conclusão não pode ser maior que hoje.");
      return;
    }

    setSalvandoConclusao(true);

    if (modoConclusao === "individual") {
      if (!processoConclusao) {
        setSalvandoConclusao(false);
        return;
      }

      const novoStatus = !processoConclusao.concluido;
      const dataConclusao = novoStatus ? dataConclusaoSelecionada : null;

      const diasCalculados = novoStatus
        ? calcularDiasEntreDatas(processoConclusao.data_entrada, dataConclusao)
        : calcularDiasEntreDatas(processoConclusao.data_entrada);

      const { error } = await supabase
        .from("processos")
        .update({
          concluido: novoStatus,
          data_conclusao: dataConclusao,
          sla: diasCalculados,
          updated_at: new Date().toISOString(),
        })
        .eq("id", processoConclusao.id);

      setSalvandoConclusao(false);

      if (error) {
        alert("Erro ao atualizar processo: " + error.message);
        return;
      }

      const processoAtualizado = {
        ...processoConclusao,
        concluido: novoStatus,
        data_conclusao: dataConclusao,
        sla: diasCalculados,
      };

      setProcessos((listaAtual) =>
        listaAtual.map((item) =>
          item.id === processoConclusao.id ? processoAtualizado : item
        )
      );

      void registrarAuditoriaProcesso({
        processo: processoAtualizado,
        acao: novoStatus ? "processo_concluido" : "processo_reaberto",
        descricao: novoStatus
          ? `Processo ${processoConclusao.sisgep} concluído.`
          : `Processo ${processoConclusao.sisgep} reaberto.`,
        dadosAnteriores: processoConclusao,
        dadosNovos: processoAtualizado,
      });

      if (novoStatus) {
        setProcessosSelecionados((selecionadosAtuais) =>
          selecionadosAtuais.filter((id) => id !== processoConclusao.id)
        );
      }

      await verificarLoginECarregarProcessos();
      fecharModalConclusao();
      return;
    }

    const processosParaConcluir = processos.filter(
      (processo) =>
        processosSelecionados.includes(processo.id) && !processo.concluido
    );

    const resultados = await Promise.all(
      processosParaConcluir.map(async (processo) => {
        const diasCalculados = calcularDiasEntreDatas(
          processo.data_entrada,
          dataConclusaoSelecionada
        );

        const { error } = await supabase
          .from("processos")
          .update({
            concluido: true,
            data_conclusao: dataConclusaoSelecionada,
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

    setSalvandoConclusao(false);

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

        if (!resultado || resultado.erro) return processo;

        const processoAtualizado = {
          ...processo,
          concluido: true,
          data_conclusao: dataConclusaoSelecionada,
          sla: resultado.diasCalculados,
        };

        void registrarAuditoriaProcesso({
          processo: processoAtualizado,
          acao: "processo_concluido_lote",
          descricao: `Processo ${processo.sisgep} concluído em lote.`,
          dadosAnteriores: processo,
          dadosNovos: processoAtualizado,
        });

        return processoAtualizado;
      })
    );

    setProcessosSelecionados((selecionadosAtuais) =>
      selecionadosAtuais.filter((id) => !idsConcluidos.includes(id))
    );

    await verificarLoginECarregarProcessos();
    fecharModalConclusao();
  }

  async function corrigirDataConclusaoEmLote() {
    if (!podeGerenciarProcessos) {
      alert("Acesso restrito para corrigir datas.");
      return;
    }

    setMensagemCorrecaoData("");

    if (!novaDataConclusaoCorrecao) {
      setMensagemCorrecaoData("Informe a nova data de conclusão.");
      return;
    }

    if (novaDataConclusaoCorrecao > dataAtualInput()) {
      setMensagemCorrecaoData("A data de conclusão não pode ser maior que hoje.");
      return;
    }

    const sisgepsDigitados = extrairSisgepsDigitados(sisgepsCorrecaoData);

    if (sisgepsDigitados.length === 0) {
      setMensagemCorrecaoData("Informe pelo menos um número de SisGep.");
      return;
    }

    const processosEncontrados = processos.filter((processo) =>
      sisgepsDigitados.includes(somenteNumeros(processo.sisgep || ""))
    );

    if (processosEncontrados.length === 0) {
      setMensagemCorrecaoData(
        "Nenhum processo encontrado para os SisGeps informados."
      );
      return;
    }

    setSalvandoCorrecaoData(true);

    const resultados = await Promise.all(
      processosEncontrados.map(async (processo) => {
        const diasCalculados = calcularDiasEntreDatas(
          processo.data_entrada,
          novaDataConclusaoCorrecao
        );

        const { error } = await supabase
          .from("processos")
          .update({
            concluido: true,
            data_conclusao: novaDataConclusaoCorrecao,
            sla: diasCalculados,
            updated_at: new Date().toISOString(),
          })
          .eq("id", processo.id);

        return {
          id: processo.id,
          sisgep: processo.sisgep,
          erro: error,
          diasCalculados,
        };
      })
    );

    setSalvandoCorrecaoData(false);

    const erros = resultados.filter((resultado) => resultado.erro);
    const sucessos = resultados.filter((resultado) => !resultado.erro);

    if (sucessos.length > 0) {
      setProcessos((listaAtual) =>
        listaAtual.map((processo) => {
          const resultado = sucessos.find((item) => item.id === processo.id);

          if (!resultado) return processo;

          const processoAtualizado = {
            ...processo,
            concluido: true,
            data_conclusao: novaDataConclusaoCorrecao,
            sla: resultado.diasCalculados,
          };

          void registrarAuditoriaProcesso({
            processo: processoAtualizado,
            acao: "data_conclusao_corrigida",
            descricao: `Data de conclusão do processo ${processo.sisgep} corrigida para ${novaDataConclusaoCorrecao}.`,
            dadosAnteriores: processo,
            dadosNovos: processoAtualizado,
          });

          return processoAtualizado;
        })
      );
    }

    const encontradosNumeros = processosEncontrados.map((processo) =>
      somenteNumeros(processo.sisgep || "")
    );

    const naoEncontrados = sisgepsDigitados.filter(
      (sisgep) => !encontradosNumeros.includes(sisgep)
    );

    setMensagemCorrecaoData(
      `Atualização concluída. Sucesso: ${sucessos.length}. Erros: ${erros.length}. Não encontrados: ${naoEncontrados.length}.`
    );

    if (erros.length > 0) {
      console.error("Erros ao corrigir data de conclusão:", erros);
    }

    await verificarLoginECarregarProcessos();
  }

  async function alterarStatusProcesso(processo: Processo) {
    if (!podeGerenciarProcessos) {
      alert("Acesso restrito para alterar status de processos.");
      return;
    }

    if (!processo.concluido) {
      abrirModalConclusaoIndividual(processo);
      return;
    }

    const novoStatus = false;
    const dataConclusao = null;
    const diasCalculados = calcularDiasEntreDatas(processo.data_entrada);

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

    const processoAtualizado = {
      ...processo,
      concluido: novoStatus,
      data_conclusao: dataConclusao,
      sla: diasCalculados,
    };

    setProcessos((listaAtual) =>
      listaAtual.map((item) =>
        item.id === processo.id ? processoAtualizado : item
      )
    );

    void registrarAuditoriaProcesso({
      processo: processoAtualizado,
      acao: novoStatus ? "processo_concluido" : "processo_reaberto",
      descricao: novoStatus
        ? `Processo ${processo.sisgep} concluído.`
        : `Processo ${processo.sisgep} reaberto.`,
      dadosAnteriores: processo,
      dadosNovos: processoAtualizado,
    });
  }

  function getLinkMapa(processo: Processo) {
    if (processo.mapa_link) return processo.mapa_link;

    const endereco = `${processo.rua || ""}, ${
      processo.numero_rua || ""
    }, Santana de Parnaíba, SP`;

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

  function dataDentroDoPeriodo(data: string | null) {
    if (tipoFiltroPeriodo === "todos") return true;
    if (!data) return false;

    if (dataInicialFiltro && data < dataInicialFiltro) return false;
    if (dataFinalFiltro && data > dataFinalFiltro) return false;

    return true;
  }

  function limparFiltroPeriodo() {
    setTipoFiltroPeriodo("todos");
    setDataInicialFiltro("");
    setDataFinalFiltro("");
  }

  function limparTodosFiltros() {
    setBusca("");
    setFiltroStatus("pendentes");
    setFiltroAssunto("todos");
    setFiltroSetor("todos");
    setTipoFiltroPeriodo("todos");
    setDataInicialFiltro("");
    setDataFinalFiltro("");
    setOrdenacao("dias_desc");
    setPaginaAtual(1);
  }

  function agruparPorCampo(
    lista: Processo[],
    campo: "assunto" | "setor" | "bairro"
  ) {
    const mapa = new Map<string, number>();

    lista.forEach((processo) => {
      const valor = processo[campo]?.trim() || "Não informado";
      mapa.set(valor, (mapa.get(valor) || 0) + 1);
    });

    return Array.from(mapa.entries())
      .map(([nome, total]) => ({ nome, total }))
      .sort((a, b) => b.total - a.total);
  }

  const assuntosDisponiveis = useMemo(() => {
    return Array.from(
      new Set(
        processos
          .map((processo) => processo.assunto?.trim())
          .filter((assunto): assunto is string => Boolean(assunto))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [processos]);

  const setoresDisponiveis = useMemo(() => {
    return Array.from(
      new Set(
        processos
          .map((processo) => processo.setor?.trim())
          .filter((setor): setor is string => Boolean(setor))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [processos]);

  const processosComLocalizacaoIncompleta = useMemo(
    () => processos.filter((processo) => isLocalizacaoIncompleta(processo)),
    [processos]
  );

  const processosFiltrados = useMemo(() => {
  const termo = busca.trim().toLowerCase();

  const listaFiltrada = processos.filter((processo) => {
    const combinaStatus =
      filtroStatus === "todos" ||
      (filtroStatus === "pendentes" && !processo.concluido) ||
      (filtroStatus === "concluidos" && processo.concluido);

    const combinaAssunto =
      filtroAssunto === "todos" || processo.assunto === filtroAssunto;

    const combinaSetor =
      filtroSetor === "todos" || processo.setor === filtroSetor;

    const combinaLocalizacao =
      !filtroLocalizacaoIncompleta || isLocalizacaoIncompleta(processo);

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

    const dataParaFiltro =
      tipoFiltroPeriodo === "entrada"
        ? processo.data_entrada
        : tipoFiltroPeriodo === "conclusao"
          ? processo.data_conclusao
          : null;

    const combinaPeriodo =
      tipoFiltroPeriodo === "todos" || dataDentroDoPeriodo(dataParaFiltro);

    return (
      combinaStatus &&
      combinaAssunto &&
      combinaSetor &&
      combinaLocalizacao &&
      combinaBusca &&
      combinaPeriodo
    );
  });

    return [...listaFiltrada].sort((a, b) => {
      if (ordenacao === "dias_desc") {
        if (a.concluido !== b.concluido) return a.concluido ? 1 : -1;
        return obterDiasDoProcesso(b) - obterDiasDoProcesso(a);
      }

      if (ordenacao === "dias_asc") {
        if (a.concluido !== b.concluido) return a.concluido ? 1 : -1;
        return obterDiasDoProcesso(a) - obterDiasDoProcesso(b);
      }

      if (ordenacao === "entrada_recente") {
        return (b.data_entrada || "").localeCompare(a.data_entrada || "");
      }

      if (ordenacao === "entrada_antiga") {
        return (a.data_entrada || "").localeCompare(b.data_entrada || "");
      }

      return 0;
    });
  }, [
    processos,
  busca,
  filtroStatus,
  filtroAssunto,
  filtroSetor,
  filtroLocalizacaoIncompleta,
  tipoFiltroPeriodo,
  dataInicialFiltro,
  dataFinalFiltro,
  ordenacao,
  ]);

  const total = processos.length;
  const pendentes = processos.filter((p) => !p.concluido).length;
  const concluidos = processos.filter((p) => p.concluido).length;
  const totalLocalizacaoIncompleta = processos.filter(
    (processo) => !processo.bairro?.trim() || !processo.setor?.trim()
  ).length;
  const pendentesFiltrados = processosFiltrados.filter(
    (p) => !p.concluido
  ).length;
  const concluidosFiltrados = processosFiltrados.filter(
    (p) => p.concluido
  ).length;

  const relatorioResumido = useMemo(() => {
    const pendentesFiltradosLista = processosFiltrados.filter(
      (processo) => !processo.concluido
    );

    const concluidosFiltradosLista = processosFiltrados.filter(
      (processo) => processo.concluido
    );

    const somaDias = processosFiltrados.reduce(
      (soma, processo) => soma + obterDiasDoProcesso(processo),
      0
    );

    const mediaDias =
      processosFiltrados.length > 0 ? somaDias / processosFiltrados.length : 0;

    const somaDiasConcluidos = concluidosFiltradosLista.reduce(
      (soma, processo) => soma + obterDiasDoProcesso(processo),
      0
    );

    const mediaDiasConcluidos =
      concluidosFiltradosLista.length > 0
        ? somaDiasConcluidos / concluidosFiltradosLista.length
        : 0;

    const pendentesAtencao = pendentesFiltradosLista.filter(
      (processo) => obterDiasDoProcesso(processo) >= 10
    ).length;

    const pendentesCriticos = pendentesFiltradosLista.filter(
      (processo) => obterDiasDoProcesso(processo) >= 15
    ).length;

    return {
      mediaDias,
      mediaDiasConcluidos,
      pendentesAtencao,
      pendentesCriticos,
      porAssunto: agruparPorCampo(processosFiltrados, "assunto").slice(0, 5),
      porSetor: agruparPorCampo(processosFiltrados, "setor").slice(0, 5),
      bairrosPendentes: agruparPorCampo(
        pendentesFiltradosLista,
        "bairro"
      ).slice(0, 5),
    };
  }, [processosFiltrados]);

  // --- LÓGICA DO RELATÓRIO PERSONALIZADO ---
  const processosPendentesRelatorio = useMemo(() => processos.filter((p) => !p.concluido), [processos]);

  const relSetoresDisponiveis = useMemo(() => Array.from(new Set(processosPendentesRelatorio.map((p) => p.setor?.trim()).filter((s): s is string => Boolean(s)))).sort((a, b) => a.localeCompare(b)), [processosPendentesRelatorio]);
  const relAssuntosDisponiveis = useMemo(() => Array.from(new Set(processosPendentesRelatorio.map((p) => p.assunto?.trim()).filter((a): a is string => Boolean(a)))).sort((a, b) => a.localeCompare(b)), [processosPendentesRelatorio]);
  const relBairrosDisponiveis = useMemo(() => Array.from(new Set(processosPendentesRelatorio.map((p) => p.bairro?.trim()).filter((b): b is string => Boolean(b)))).sort((a, b) => a.localeCompare(b)), [processosPendentesRelatorio]);

  const preRelatorioFiltrados = useMemo(() => {
    return processosPendentesRelatorio.filter((p) => {
      const combinaSetor = relSetoresSelecionados.length === 0 || relSetoresSelecionados.includes(p.setor?.trim() || "");
      const combinaAssunto = relAssuntosSelecionados.length === 0 || relAssuntosSelecionados.includes(p.assunto?.trim() || "");
      const combinaBairro = relBairrosSelecionados.length === 0 || relBairrosSelecionados.includes(p.bairro?.trim() || "");
      
      const dias = obterDiasDoProcesso(p);
      let combinaSla = true;
      if (relFiltroSla === "critico") combinaSla = dias >= 15;
      if (relFiltroSla === "atencao") combinaSla = dias >= 10 && dias < 15;
      if (relFiltroSla === "normal") combinaSla = dias < 10;

      return combinaSetor && combinaAssunto && combinaBairro && combinaSla;
    }).sort((a, b) => obterDiasDoProcesso(b) - obterDiasDoProcesso(a));
  }, [processosPendentesRelatorio, relSetoresSelecionados, relAssuntosSelecionados, relBairrosSelecionados, relFiltroSla]);

  function alternarCheckboxRelatorio(valor: string, lista: string[], setLista: React.Dispatch<React.SetStateAction<string[]>>) {
    setLista(lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor]);
  }

  function limparFiltrosRelatorio() {
    setRelSetoresSelecionados([]);
    setRelAssuntosSelecionados([]);
    setRelBairrosSelecionados([]);
    setRelFiltroSla("todos");
  }

  const totalPaginas = Math.max(
    1,
    Math.ceil(processosFiltrados.length / itensPorPagina)
  );

  const paginaAtualSegura = Math.min(paginaAtual, totalPaginas);
  const indiceInicial = (paginaAtualSegura - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;

  const processosPaginados = processosFiltrados.slice(
    indiceInicial,
    indiceFinal
  );

  const primeiroItemExibido =
    processosFiltrados.length === 0 ? 0 : indiceInicial + 1;

  const ultimoItemExibido = Math.min(indiceFinal, processosFiltrados.length);

  function irParaPaginaAnterior() {
    setPaginaAtual((pagina) => Math.max(1, pagina - 1));
  }

  function irParaProximaPagina() {
    setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1));
  }

  function exportarProcessosCsv() {
    if (processosFiltrados.length === 0) {
      alert("Não há processos para exportar com os filtros atuais.");
      return;
    }

    const cabecalho = [
      "Status",
      "SisGep",
      "Data de Entrada",
      "Data de Conclusão",
      "Dias",
      "Aberto Por",
      "Assunto",
      "Rua",
      "Número",
      "Bairro",
      "Setor",
      "Latitude",
      "Longitude",
      "Link Maps",
      "Observação",
    ];

    const linhas = processosFiltrados.map((processo) => {
      const dias = obterDiasDoProcesso(processo);

      return [
        processo.concluido ? "Concluído" : "Pendente",
        processo.sisgep,
        formatarData(processo.data_entrada),
        formatarData(processo.data_conclusao),
        dias,
        processo.aberto_por || "",
        processo.assunto || "",
        processo.rua || "",
        processo.numero_rua || "",
        processo.bairro || "",
        processo.setor || "",
        processo.latitude ?? "",
        processo.longitude ?? "",
        getLinkMapa(processo),
        processo.observacao || "",
      ];
    });

  const conteudoCsv = [
  cabecalho.map(escaparCsv).join(";"),
  ...linhas.map((linha) => linha.map(escaparCsv).join(";")),
].join("\n");

const arquivo = new Blob(["\uFEFF" + conteudoCsv], {
  type: "text/csv;charset=utf-8;",
});

    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    const dataHoje = dataAtualInput();

    link.href = url;
    link.download = `relatorio-processos-${dataHoje}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function descricaoFiltroPeriodo() {
    if (tipoFiltroPeriodo === "todos") {
      return "Sem filtro de período";
    }

    const tipo =
      tipoFiltroPeriodo === "entrada" ? "Data de entrada" : "Data de conclusão";

    const inicio = dataInicialFiltro ? formatarData(dataInicialFiltro) : "início";
    const fim = dataFinalFiltro ? formatarData(dataFinalFiltro) : "hoje";

    return `${tipo}: ${inicio} até ${fim}`;
  }

  function abrirRelatorioImpressao() {
    if (processosFiltrados.length === 0) {
      alert("Não há processos para gerar relatório com os filtros atuais.");
      return;
    }

    const dataGeracao = new Date().toLocaleString("pt-BR");

    const linhasTabela = processosFiltrados
      .map((processo) => {
        const dias = obterDiasDoProcesso(processo);
        const endereco = `${processo.rua || "---"}, nº ${
          processo.numero_rua || "---"
        }`;

        return `
          <tr>
            <td>${escaparHtml(processo.sisgep)}</td>
            <td>${escaparHtml(processo.concluido ? "Concluído" : "Pendente")}</td>
            <td>${escaparHtml(formatarData(processo.data_entrada))}</td>
            <td>${escaparHtml(String(dias))}</td>
            <td>${escaparHtml(processo.assunto || "---")}</td>
            <td>${escaparHtml(processo.aberto_por || "---")}</td>
            <td>${escaparHtml(endereco)}</td>
            <td>${escaparHtml(processo.bairro || "---")}</td>
            <td>${escaparHtml(processo.setor || "---")}</td>
          </tr>
        `;
      })
      .join("");

    const html = `
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Relatório Fiscalização SisGep</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: Arial, Helvetica, sans-serif;
              color: #0f172a;
              margin: 32px;
              background: #ffffff;
            }
            header {
              border-bottom: 3px solid #1e3a8a;
              padding-bottom: 16px;
              margin-bottom: 20px;
            }
            h1 {
              margin: 0;
              color: #1e3a8a;
              font-size: 26px;
            }
            .subtitulo {
              margin-top: 6px;
              color: #475569;
              font-size: 13px;
            }
            .filtros {
              margin: 18px 0;
              padding: 14px;
              border: 1px solid #cbd5e1;
              border-radius: 12px;
              background: #f8fafc;
              font-size: 12px;
              line-height: 1.5;
            }
            .cards {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 12px;
              margin: 18px 0;
            }
            .card {
              border: 1px solid #cbd5e1;
              border-radius: 12px;
              padding: 12px;
              background: #ffffff;
            }
            .card p {
              margin: 0;
              font-size: 11px;
              color: #64748b;
              font-weight: bold;
              text-transform: uppercase;
            }
            .card strong {
              display: block;
              margin-top: 6px;
              font-size: 24px;
              color: #0f172a;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 10px;
            }
            th {
              background: #1e3a8a;
              color: #ffffff;
              padding: 8px;
              text-align: left;
              border: 1px solid #1e3a8a;
            }
            td {
              padding: 7px;
              border: 1px solid #cbd5e1;
              vertical-align: top;
            }
            tr:nth-child(even) td {
              background: #f8fafc;
            }
            .rodape {
              margin-top: 20px;
              font-size: 11px;
              color: #64748b;
              text-align: center;
            }
            @media print {
              body { margin: 14mm; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
            }
          </style>
        </head>
        <body>
          <header>
            <h1>Relatório Fiscalização SisGep</h1>
            <div class="subtitulo">Gerado em ${escaparHtml(dataGeracao)} pelo ALMS PRIME</div>
          </header>

          <section class="filtros">
            <strong>Filtros aplicados:</strong><br />
            Busca: ${escaparHtml(busca || "Sem busca")}<br />
            Status: ${escaparHtml(filtroStatus)}<br />
            Assunto: ${escaparHtml(filtroAssunto === "todos" ? "Todos" : filtroAssunto)}<br />
            Setor: ${escaparHtml(filtroSetor === "todos" ? "Todos" : filtroSetor)}<br />
            Período: ${escaparHtml(descricaoFiltroPeriodo())}<br />
            Ordenação: ${escaparHtml(ordenacao)}
          </section>

          <section class="cards">
            <div class="card"><p>Total filtrado</p><strong>${processosFiltrados.length}</strong></div>
            <div class="card"><p>Pendentes</p><strong>${pendentesFiltrados}</strong></div>
            <div class="card"><p>Concluídos</p><strong>${concluidosFiltrados}</strong></div>
            <div class="card"><p>Críticos +15 dias</p><strong>${relatorioResumido.pendentesCriticos}</strong></div>
          </section>

          <section class="cards">
            <div class="card"><p>Atenção +10 dias</p><strong>${relatorioResumido.pendentesAtencao}</strong></div>
            <div class="card"><p>Média dias filtrados</p><strong>${relatorioResumido.mediaDias.toFixed(1)}</strong></div>
            <div class="card"><p>Média concluídos</p><strong>${relatorioResumido.mediaDiasConcluidos.toFixed(1)}</strong></div>
            <div class="card"><p>Total geral</p><strong>${total}</strong></div>
          </section>

          <table>
            <thead>
              <tr>
                <th>SisGep</th>
                <th>Status</th>
                <th>Entrada</th>
                <th>Dias</th>
                <th>Assunto</th>
                <th>Aberto por</th>
                <th>Endereço</th>
                <th>Bairro</th>
                <th>Setor</th>
              </tr>
            </thead>
            <tbody>${linhasTabela}</tbody>
          </table>

          <div class="rodape">ALMS PRIME — Relatório gerado a partir dos filtros atuais.</div>

          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    const janela = window.open("", "_blank", "width=1200,height=800");

    if (!janela) {
      alert("Permita pop-ups para gerar o relatório de impressão/PDF.");
      return;
    }

    janela.document.open();
    janela.document.write(html);
    janela.document.close();
  }

  function gerarRelatorioPendenciasPersonalizado() {
    if (preRelatorioFiltrados.length === 0) {
      alert("Nenhum processo pendente encontrado com os filtros selecionados.");
      return;
    }

    const dataGeracao = new Date().toLocaleString("pt-BR");
    const linhasTabela = preRelatorioFiltrados.map((processo) => {
      const dias = obterDiasDoProcesso(processo);
      const endereco = `${processo.rua || "---"}, nº ${processo.numero_rua || "---"}`;

      return `
        <tr>
          <td>${escaparHtml(processo.sisgep)}</td>
          <td>${escaparHtml(formatarData(processo.data_entrada))}</td>
          <td style="color: ${dias >= 15 ? '#b91c1c' : dias >= 10 ? '#b45309' : '#15803d'}; font-weight: bold;">
            ${escaparHtml(String(dias))}
          </td>
          <td>${escaparHtml(processo.assunto || "---")}</td>
          <td>${escaparHtml(processo.aberto_por || "---")}</td>
          <td>${escaparHtml(endereco)}</td>
          <td>${escaparHtml(processo.bairro || "---")}</td>
          <td>${escaparHtml(processo.setor || "---")}</td>
        </tr>
      `;
    }).join("");

    const html = `
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Relatório de Pendências SisGep</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; margin: 32px; background: #fff; color: #0f172a; }
            header { border-bottom: 3px solid #b91c1c; padding-bottom: 16px; margin-bottom: 20px; }
            h1 { margin: 0; color: #b91c1c; font-size: 26px; }
            .subtitulo { margin-top: 6px; color: #475569; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 10px; }
            th { background: #b91c1c; color: #ffffff; padding: 8px; text-align: left; border: 1px solid #b91c1c; }
            td { padding: 7px; border: 1px solid #cbd5e1; vertical-align: top; }
            tr:nth-child(even) td { background: #f8fafc; }
            .resumo { margin-top: 15px; font-size: 14px; font-weight: bold; background: #fee2e2; padding: 10px; border-radius: 8px; border: 1px solid #f87171; color: #991b1b; }
            @media print { body { margin: 14mm; } table { page-break-inside: auto; } tr { page-break-inside: avoid; page-break-after: auto; } }
          </style>
        </head>
        <body>
          <header>
            <h1>Relatório de Pendências SisGep</h1>
            <div class="subtitulo">Gerado em ${escaparHtml(dataGeracao)} pelo ALMS PRIME</div>
          </header>
          <div class="resumo">Total de processos pendentes no relatório: ${preRelatorioFiltrados.length}</div>
          <table>
            <thead>
              <tr>
                <th>SisGep</th>
                <th>Entrada</th>
                <th>Dias Atraso</th>
                <th>Assunto</th>
                <th>Aberto por</th>
                <th>Endereço</th>
                <th>Bairro</th>
                <th>Setor</th>
              </tr>
            </thead>
            <tbody>${linhasTabela}</tbody>
          </table>
          <script>
            window.onload = function() { window.focus(); window.print(); };
          </script>
        </body>
      </html>
    `;

    const janela = window.open("", "_blank", "width=1200,height=800");
    if (!janela) { alert("Permita pop-ups para gerar o relatório."); return; }
    janela.document.open(); janela.document.write(html); janela.document.close();
  }

  function maiorValor(lista: GrupoResumo[]) {
    return Math.max(...lista.map((item) => item.total), 1);
  }

  function ListaResumo({
    titulo,
    itens,
  }: {
    titulo: string;
    itens: GrupoResumo[];
  }) {
    const maior = maiorValor(itens);

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-800">{titulo}</h3>

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
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/"
                className="text-sm font-semibold text-blue-200 hover:text-white"
              >
                ← Voltar ao portal
              </Link>

              <h1 className="mt-4 text-3xl font-bold">Fiscalização SisGep</h1>

              <p className="mt-2 text-blue-100">
                Sistema de controle de processos, mapas, anexos, dashboard e relatórios.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/fiscalizacao/dashboard"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500"
              >
                Dashboard
              </Link>

              <Link
                href="/fiscalizacao/mapa"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500"
              >
                Mapa
              </Link>

              {podeAdministrarUsuarios && (
                <Link
                  href="/fiscalizacao/usuarios"
                  className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-bold text-white hover:bg-violet-600"
                >
                  Usuários
                </Link>
              )}

              {podeAdministrarUsuarios && (
                <Link
                  href="/fiscalizacao/configuracoes"
                  className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600"
                >
                  Configurações
                </Link>
              )}

              {podeGerenciarProcessos && (
                <button
                  onClick={() => {
                    setMensagemSucessoNovo("");
                    setMensagemLocalizacaoNovo("");
                    setBuscandoLocalizacaoNovo(false);
                    setModalNovoAberto(true);
                  }}
                  className="rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-400"
                >
                  Novo processo
                </button>
              )}

              {podeGerenciarProcessos && (
                <button
                  onClick={abrirModalCorrecaoData}
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-400"
                >
                  Corrigir datas
                </button>
              )}

              {podeGerenciarProcessos && (
                <button
                  onClick={abrirModalCorrecaoLocalizacao}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-400"
                >
                  Corrigir localização
                </button>
              )}

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

      <section className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">Total</p>
            <p className="mt-2 text-3xl font-black text-slate-800">{total}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">Pendentes</p>
            <p className="mt-2 text-3xl font-black text-yellow-600">{pendentes}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">Concluídos</p>
            <p className="mt-2 text-3xl font-black text-green-600">{concluidos}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-amber-50 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-amber-700">
              Sem bairro/setor
            </p>
            <p className="mt-2 text-3xl font-black text-amber-700">
              {totalLocalizacaoIncompleta}
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

            <div className="grid grid-cols-4 gap-2">
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

              <button
                onClick={() => setFiltroLocalizacaoIncompleta((ativo) => !ativo)}
                className={`rounded-lg px-3 py-2 text-sm font-bold ${
                  filtroLocalizacaoIncompleta
                    ? "bg-amber-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Sem bairro/setor
              </button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-semibold text-slate-600">
                Processos por página
              </label>

              <select
                value={itensPorPagina}
                onChange={(event) => setItensPorPagina(Number(event.target.value))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
              >
                <option value={12}>12 por página</option>
                <option value={24}>24 por página</option>
                <option value={48}>48 por página</option>
                <option value={96}>96 por página</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-semibold text-slate-600">
                Visualização
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setModoVisualizacao("cards")}
                  className={`rounded-lg px-4 py-2 text-sm font-bold ${
                    modoVisualizacao === "cards"
                      ? "bg-blue-800 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Cards
                </button>

                <button
                  onClick={() => setModoVisualizacao("tabela")}
                  className={`rounded-lg px-4 py-2 text-sm font-bold ${
                    modoVisualizacao === "tabela"
                      ? "bg-blue-800 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Tabela
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600">
                Assunto
              </label>

              <select
                value={filtroAssunto}
                onChange={(event) => setFiltroAssunto(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
              >
                <option value="todos">Todos os assuntos</option>
                {assuntosDisponiveis.map((assunto) => (
                  <option key={assunto} value={assunto}>
                    {assunto}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600">
                Setor
              </label>

              <select
                value={filtroSetor}
                onChange={(event) => setFiltroSetor(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
              >
                <option value="todos">Todos os setores</option>
                {setoresDisponiveis.map((setor) => (
                  <option key={setor} value={setor}>
                    {setor}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-semibold text-slate-600">
                Ordenar processos
              </label>

              <select
                value={ordenacao}
                onChange={(event) =>
                  setOrdenacao(event.target.value as OrdenacaoProcessos)
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
              >
                <option value="dias_desc">Mais atrasados primeiro</option>
                <option value="dias_asc">Menos atrasados primeiro</option>
                <option value="entrada_recente">Entrada mais recente</option>
                <option value="entrada_antiga">Entrada mais antiga</option>
              </select>
            </div>

            <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600">
                    Filtrar por período
                  </label>

                  <select
                    value={tipoFiltroPeriodo}
                    onChange={(event) =>
                      alterarTipoFiltroPeriodo(
                        event.target.value as TipoFiltroPeriodo
                      )
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                  >
                    <option value="todos">Sem filtro de período</option>
                    <option value="entrada">Data de entrada</option>
                    <option value="conclusao">Data de conclusão</option>
                  </select>

                  {tipoFiltroPeriodo === "conclusao" && (
                    <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
                      Filtro por data de conclusão exibe apenas processos concluídos.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-600">
                    Data inicial
                  </label>

                  <input
                    type="date"
                    value={dataInicialFiltro}
                    onChange={(event) => setDataInicialFiltro(event.target.value)}
                    disabled={tipoFiltroPeriodo === "todos"}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-600">
                    Data final
                  </label>

                  <input
                    type="date"
                    value={dataFinalFiltro}
                    onChange={(event) => setDataFinalFiltro(event.target.value)}
                    disabled={tipoFiltroPeriodo === "todos"}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={limparFiltroPeriodo}
                    className="w-full rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-300"
                  >
                    Limpar período
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                O filtro por período também será aplicado na exportação CSV.
              </p>
            </div>

            <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">Relatório</p>
                <p className="text-xs text-slate-500">
                  Exporta todos os processos filtrados na tela.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => { limparFiltrosRelatorio(); setModalRelatorioAberto(true); }}
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-500"
                >
                  Relatório Personalizado
                </button>

                <button
                  onClick={limparTodosFiltros}
                  className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-300"
                >
                  Limpar filtros
                </button>

                <button
                  onClick={abrirRelatorioImpressao}
                  className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Relatório PDF
                </button>

                <button
                  onClick={exportarProcessosCsv}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500"
                >
                  Exportar CSV
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase text-slate-500">
                Filtrados
              </p>
              <p className="text-2xl font-black text-slate-800">
                {processosFiltrados.length}
              </p>
            </div>

            <div className="rounded-xl bg-yellow-50 p-3">
              <p className="text-xs font-bold uppercase text-yellow-700">
                Pendentes filtrados
              </p>
              <p className="text-2xl font-black text-yellow-700">
                {pendentesFiltrados}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3">
              <p className="text-xs font-bold uppercase text-green-700">
                Concluídos filtrados
              </p>
              <p className="text-2xl font-black text-green-700">
                {concluidosFiltrados}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs font-semibold text-slate-500">
            Exibindo {primeiroItemExibido} a {ultimoItemExibido} de{" "}
            {processosFiltrados.length} processo(s) filtrado(s). Total geral:{" "}
            {total}.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Relatório resumido dos filtros
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Resumo calculado com base nos processos filtrados na tela.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-xs font-bold uppercase text-red-700">
                  Críticos +15 dias
                </p>
                <p className="text-2xl font-black text-red-700">
                  {relatorioResumido.pendentesCriticos}
                </p>
              </div>

              <div className="rounded-xl bg-yellow-50 p-4">
                <p className="text-xs font-bold uppercase text-yellow-700">
                  Atenção +10 dias
                </p>
                <p className="text-2xl font-black text-yellow-700">
                  {relatorioResumido.pendentesAtencao}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Média dias filtrados
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {relatorioResumido.mediaDias.toFixed(1)}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs font-bold uppercase text-green-700">
                  Média concluídos
                </p>
                <p className="text-2xl font-black text-green-700">
                  {relatorioResumido.mediaDiasConcluidos.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <ListaResumo
              titulo="Top assuntos filtrados"
              itens={relatorioResumido.porAssunto}
            />

            <ListaResumo
              titulo="Top setores filtrados"
              itens={relatorioResumido.porSetor}
            />

            <ListaResumo
              titulo="Bairros com mais pendências"
              itens={relatorioResumido.bairrosPendentes}
            />
          </div>
        </div>

        {podeGerenciarProcessos && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Baixa em lote</h2>

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
                  Selecionar pendentes da página
                </button>

                <button
                  onClick={limparSelecaoProcessos}
                  disabled={processosSelecionados.length === 0}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Limpar seleção
                </button>

                <button
                  onClick={abrirModalConclusaoLote}
                  disabled={processosSelecionados.length === 0 || salvandoConclusao}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Concluir selecionados
                </button>
              </div>
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
            {modoVisualizacao === "cards" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {processosPaginados.map((processo) => {
                  const estilo = getEstiloDias(processo);
                  const dias = obterDiasDoProcesso(processo);

                  return (
                    <div
                      key={processo.id}
                      className={`rounded-2xl border-l-4 ${estilo.borda} ${estilo.fundo} p-5 shadow-sm`}
                    >
                      {podeGerenciarProcessos && (
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
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase text-slate-500">
                            SisGep
                          </p>
                          <h2 className="mt-1 font-bold text-slate-800">
                            {processo.sisgep}
                          </h2>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {(!processo.bairro?.trim() || !processo.setor?.trim()) && (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                              Localização incompleta
                            </span>
                          )}

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
                      </div>

                      <p className="mt-4 text-sm font-semibold text-blue-700">
                        {processo.assunto || "Sem assunto"}
                      </p>

                      <div className="mt-4 rounded-xl bg-white/80 p-3 text-sm text-slate-600">
                        <p>
                          <b>Entrada:</b> {formatarData(processo.data_entrada)}
                        </p>

                        <p>
                          <b>Conclusão:</b> {formatarData(processo.data_conclusao)}
                        </p>

                        <p>
                          <b>Aberto por:</b> {processo.aberto_por || "---"}
                        </p>

                        <p>
                          <b>Endereço:</b> {processo.rua || "---"}, nº{" "}
                          {processo.numero_rua || "---"}
                        </p>

                        <p>
                          <b>Bairro:</b>{" "}
                          {processo.bairro || "Será gerado automaticamente"}
                        </p>

                        <p>
                          <b>Setor:</b>{" "}
                          {processo.setor || "Será gerado automaticamente"}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${estilo.badge}`}
                        >
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
                            {(anexosPorProcesso[processo.id] || []).length}{" "}
                            arquivo(s)
                          </span>
                        </div>

                        {podeGerenciarProcessos ? (
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
                        ) : (
                          <div className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                            Apenas gestores e administradores podem anexar arquivos.
                          </div>
                        )}

                        <div className="mt-3 space-y-2">
                          {(anexosPorProcesso[processo.id] || []).map(
                            (anexo) => (
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

                                {podeGerenciarProcessos && (
                                  <button
                                    onClick={() => excluirAnexo(anexo)}
                                    className="rounded bg-red-100 px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-200"
                                  >
                                    Excluir
                                  </button>
                                )}
                              </div>
                            )
                          )}

                          {(anexosPorProcesso[processo.id] || []).length ===
                            0 && (
                            <p className="text-xs text-slate-500">
                              Nenhum anexo enviado.
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => abrirHistoricoProcesso(processo)}
                        className="mt-4 w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
                      >
                        Histórico
                      </button>

                      {podeGerenciarProcessos && (
                        <button
                          onClick={() => abrirModalEdicao(processo)}
                          className="mt-4 w-full rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600"
                        >
                          Editar processo
                        </button>
                      )}

                      {podeExcluirProcessos && (
                        <button
                          onClick={() => excluirProcesso(processo)}
                          className="mt-3 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                        >
                          Excluir processo
                        </button>
                      )}

                      {podeGerenciarProcessos && (
                        <button
                          onClick={() => alterarStatusProcesso(processo)}
                          className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-bold text-white ${
                            processo.concluido
                              ? "bg-slate-600 hover:bg-slate-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {processo.concluido
                            ? "Reabrir processo"
                            : "Concluir processo"}
                        </button>
                      )}
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

            {modoVisualizacao === "tabela" && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-[1650px] w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Selecionar</th>
                      <th className="px-4 py-3">SisGep</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Entrada</th>
                      <th className="px-4 py-3">Dias</th>
                      <th className="min-w-[220px] max-w-[320px] px-4 py-3">Assunto</th>
                      <th className="min-w-[180px] max-w-[260px] px-4 py-3">Aberto por</th>
                      <th className="min-w-[260px] max-w-[360px] px-4 py-3">Endereço</th>
                      <th className="min-w-[200px] px-4 py-3">Bairro</th>
                     <th className="min-w-[200px] px-4 py-3">Setor</th>
                      <th className="sticky right-0 bg-slate-50 px-4 py-3 text-right min-w-[300px]">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {processosPaginados.map((processo) => {
                      const dias = obterDiasDoProcesso(processo);

                      return (
                        <tr key={processo.id} className="border-t border-slate-100">
                          <td className="px-4 py-3">
                            {podeGerenciarProcessos ? (
                              <input
                                type="checkbox"
                                checked={processosSelecionados.includes(processo.id)}
                                disabled={processo.concluido}
                                onChange={() => alternarSelecaoProcesso(processo.id)}
                                className="h-4 w-4"
                              />
                            ) : (
                              <span className="text-xs font-semibold text-slate-400">—</span>
                            )}
                          </td>

                          <td className="px-4 py-3 font-bold text-slate-800">
                            {processo.sisgep}
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                processo.concluido
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {processo.concluido ? "Concluído" : "Pendente"}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {formatarData(processo.data_entrada)}
                          </td>

                          <td className="px-4 py-3 font-bold text-slate-700">
                            {dias}
                          </td>

                          <td className="min-w-[220px] max-w-[320px] px-4 py-3 text-slate-600">
                            <span className="block whitespace-normal break-words">
                              {processo.assunto || "---"}
                            </span>
                          </td>

                          <td className="min-w-[180px] max-w-[260px] px-4 py-3 text-slate-600">
                            <span className="block whitespace-normal break-words">
                              {processo.aberto_por || "---"}
                            </span>
                          </td>

                          <td className="min-w-[260px] max-w-[360px] px-4 py-3 text-slate-600">
                            <span className="block whitespace-normal break-words">
                              {processo.rua || "---"}, nº{" "}
                              {processo.numero_rua || "---"}
                            </span>
                          </td>

                          <td className="min-w-[200px] px-4 py-3 text-slate-600">
                            <span className="block whitespace-normal break-words">
                              {processo.bairro || "---"}
                            </span>
                          </td>

                          <td className="min-w-[200px] px-4 py-3 text-slate-600">>
                            <span className="block whitespace-normal break-words">
                              {processo.setor || "---"}
                            </span>
                          </td>

                          <td className="sticky right-0 bg-white px-4 py-3 min-w-[300px]">
                            <div className="flex justify-end gap-2 flex-nowrap">
                              <a
                                href={getLinkMapa(processo)}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                              >
                                Maps
                              </a>

                              <button
                                onClick={() => abrirHistoricoProcesso(processo)}
                                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                              >
                                Histórico
                              </button>

                              {podeGerenciarProcessos && (
                                <button
                                  onClick={() => abrirModalEdicao(processo)}
                                  className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600"
                                >
                                  Editar
                                </button>
                              )}

                              {podeGerenciarProcessos && (
                                <button
                                  onClick={() => alterarStatusProcesso(processo)}
                                  className={`rounded-lg px-3 py-1.5 text-xs font-bold text-white ${
                                    processo.concluido
                                      ? "bg-slate-600 hover:bg-slate-700"
                                      : "bg-green-600 hover:bg-green-700"
                                  }`}
                                >
                                  {processo.concluido ? "Reabrir" : "Concluir"}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {processosFiltrados.length === 0 && (
                      <tr>
                        <td
                          colSpan={11}
                          className="px-4 py-6 text-center text-slate-500"
                        >
                          Nenhum processo encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {processosFiltrados.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  Página {paginaAtualSegura} de {totalPaginas}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={irParaPaginaAnterior}
                    disabled={paginaAtualSegura <= 1}
                    className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Anterior
                  </button>

                  <button
                    onClick={irParaProximaPagina}
                    disabled={paginaAtualSegura >= totalPaginas}
                    className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
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
                  Informe os dados de entrada. Bairro e setor podem ser preenchidos automaticamente ou ajustados manualmente.
                </p>
              </div>

              <button
                onClick={fecharModalNovo}
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                Fechar
              </button>
            </div>

            {mensagemSucessoNovo && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                {mensagemSucessoNovo}
              </div>
            )}

            <form
              onSubmit={cadastrarNovoProcesso}
              className="grid gap-4 md:grid-cols-2"
            >
              <CampoData
                label="Data de entrada *"
                value={novoProcesso.data_entrada}
                onChange={(valor) =>
                  atualizarCampoNovoProcesso("data_entrada", valor)
                }
              />

              <CampoTexto
                label="Nº SisGep *"
                value={novoProcesso.sisgep}
                onChange={(valor) =>
                  atualizarCampoNovoProcesso(
                    "sisgep",
                    aplicarMascaraSisgep(valor)
                  )
                }
                required
                placeholder="000.000.000.000.001"
              />

              <CampoTexto
                label="Aberto por"
                value={novoProcesso.aberto_por}
                onChange={(valor) =>
                  atualizarCampoNovoProcesso("aberto_por", valor)
                }
              />

              <CampoAssunto
                value={novoProcesso.assunto}
                onChange={(valor) => atualizarCampoNovoProcesso("assunto", valor)}
              />

              <CampoTexto
                label="Rua"
                value={novoProcesso.rua}
                onChange={(valor) => atualizarCampoNovoProcesso("rua", valor)}
              />

              <CampoTexto
                label="Número"
                value={novoProcesso.numero_rua}
                onChange={(valor) =>
                  atualizarCampoNovoProcesso("numero_rua", valor)
                }
              />

              <div className="md:col-span-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={preencherLocalizacaoNovo}
                    disabled={buscandoLocalizacaoNovo}
                    className="rounded-lg bg-blue-800 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {buscandoLocalizacaoNovo ? "Buscando..." : "Buscar bairro e setor"}
                  </button>

                  <span className="text-xs font-semibold text-blue-800">
                    Preencha rua e número para buscar automaticamente.
                  </span>
                </div>

                {mensagemLocalizacaoNovo && (
                  <p className="mt-2 text-sm font-medium text-blue-800">
                    {mensagemLocalizacaoNovo}
                  </p>
                )}
              </div>

              <CampoTexto
                label="Bairro"
                value={novoProcesso.bairro}
                onChange={(valor) => atualizarBairroNovo(valor)}
              />

              <CampoTexto
                label="Setor"
                value={novoProcesso.setor}
                onChange={(valor) =>
                  atualizarCampoNovoProcesso("setor", valor)
                }
              />

              <CampoObservacao
                value={novoProcesso.observacao}
                onChange={(valor) =>
                  atualizarCampoNovoProcesso("observacao", valor)
                }
              />

              <div className="md:col-span-2 flex justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={fecharModalNovo}
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
                  Altere os dados do processo. Bairro e setor podem ser ajustados manualmente e recalculados pelo sistema.
                </p>
              </div>

              <button
                onClick={fecharModalEdicao}
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                Fechar
              </button>
            </div>

            <form
              onSubmit={salvarEdicaoProcesso}
              className="grid gap-4 md:grid-cols-2"
            >
              <CampoData
                label="Data de entrada *"
                value={processoEdicao.data_entrada}
                onChange={(valor) =>
                  atualizarCampoEdicaoProcesso("data_entrada", valor)
                }
              />

              <CampoTexto
                label="Nº SisGep *"
                value={processoEdicao.sisgep}
                onChange={(valor) =>
                  atualizarCampoEdicaoProcesso(
                    "sisgep",
                    aplicarMascaraSisgep(valor)
                  )
                }
                required
                placeholder="000.000.000.000.001"
              />

              <CampoTexto
                label="Aberto por"
                value={processoEdicao.aberto_por}
                onChange={(valor) =>
                  atualizarCampoEdicaoProcesso("aberto_por", valor)
                }
              />

              <CampoAssunto
                value={processoEdicao.assunto}
                onChange={(valor) =>
                  atualizarCampoEdicaoProcesso("assunto", valor)
                }
              />

              <CampoTexto
                label="Rua"
                value={processoEdicao.rua}
                onChange={(valor) => atualizarCampoEdicaoProcesso("rua", valor)}
              />

              <CampoTexto
                label="Número"
                value={processoEdicao.numero_rua}
                onChange={(valor) =>
                  atualizarCampoEdicaoProcesso("numero_rua", valor)
                }
              />

              <div className="md:col-span-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={preencherLocalizacaoEdicao}
                    disabled={buscandoLocalizacaoEdicao}
                    className="rounded-lg bg-blue-800 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {buscandoLocalizacaoEdicao ? "Buscando..." : "Buscar bairro e setor"}
                  </button>

                  <span className="text-xs font-semibold text-blue-800">
                    Preencha rua e número para buscar automaticamente.
                  </span>
                </div>

                {mensagemLocalizacaoEdicao && (
                  <p className="mt-2 text-sm font-medium text-blue-800">
                    {mensagemLocalizacaoEdicao}
                  </p>
                )}
              </div>

              <CampoTexto
                label="Bairro"
                value={processoEdicao.bairro}
                onChange={(valor) => atualizarBairroEdicao(valor)}
              />

              <CampoTexto
                label="Setor"
                value={processoEdicao.setor}
                onChange={(valor) =>
                  atualizarCampoEdicaoProcesso("setor", valor)
                }
              />

              <CampoObservacao
                value={processoEdicao.observacao}
                onChange={(valor) =>
                  atualizarCampoEdicaoProcesso("observacao", valor)
                }
              />

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

      {modalConclusaoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {modoConclusao === "individual"
                    ? "Concluir processo"
                    : "Concluir processos selecionados"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Escolha a data de conclusão. Não é permitido selecionar data futura.
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModalConclusao}
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                Fechar
              </button>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-700">
                Data de conclusão
              </span>
              <input
                type="date"
                value={dataConclusaoSelecionada}
                max={dataAtualInput()}
                onChange={(event) =>
                  setDataConclusaoSelecionada(event.target.value)
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
              />
            </label>

            {!dataConclusaoValida(dataConclusaoSelecionada) && (
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                A data de conclusão não pode ser maior que hoje.
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={fecharModalConclusao}
                disabled={salvandoConclusao}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarConclusao}
                disabled={
                  salvandoConclusao ||
                  !dataConclusaoValida(dataConclusaoSelecionada)
                }
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {salvandoConclusao ? "Salvando..." : "Confirmar conclusão"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalCorrecaoDataAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Corrigir data de conclusão
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Informe os números de SisGep e escolha a nova data de conclusão.
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModalCorrecaoData}
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                Fechar
              </button>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-700">
                SisGeps
              </span>
              <textarea
                value={sisgepsCorrecaoData}
                onChange={(event) => setSisgepsCorrecaoData(event.target.value)}
                rows={6}
                placeholder="Digite ou cole os SisGeps, separados por linha, vírgula ou espaço."
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">
                Nova data de conclusão
              </span>
              <input
                type="date"
                value={novaDataConclusaoCorrecao}
                max={dataAtualInput()}
                onChange={(event) =>
                  setNovaDataConclusaoCorrecao(event.target.value)
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
              />
            </label>

            {mensagemCorrecaoData && (
              <div className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800">
                {mensagemCorrecaoData}
              </div>
            )}

            <div className="mt-6 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Atenção: esta ação altera a data de conclusão dos processos encontrados e recalcula o SLA.
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={fecharModalCorrecaoData}
                disabled={salvandoCorrecaoData}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={corrigirDataConclusaoEmLote}
                disabled={salvandoCorrecaoData}
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {salvandoCorrecaoData ? "Atualizando..." : "Atualizar datas"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalCorrecaoLocalizacaoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Corrigir localização</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={fecharModalCorrecaoLocalizacao}
                  className="rounded-lg bg-white px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Fechar
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="col-span-1 h-72 overflow-auto rounded border p-2">
                {processosComLocalizacaoIncompleta.length === 0 ? (
                  <p className="text-sm text-slate-500">Nenhum processo com localização incompleta.</p>
                ) : (
                  processosComLocalizacaoIncompleta.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selecionarProcessoParaCorrigirLocalizacao(p)}
                      className={`w-full text-left p-2 rounded ${
                        processoLocalizacaoEditando?.id === p.id
                          ? "bg-blue-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-semibold text-sm">{p.sisgep}</div>
                      <div className="text-xs text-slate-500 truncate">{`${p.rua || ""} ${p.numero_rua || ""}`}</div>
                      <div className="text-xs text-slate-500">{p.bairro || "-"} · {p.setor || "-"}</div>
                    </button>
                  ))
                )}
              </div>

              <div className="col-span-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Bairro</label>

                  {carregandoBairrosSetores ? (
                    <p className="mt-1 text-sm text-slate-500">Carregando bairros e setores...</p>
                  ) : (
                    <select
                      value={bairroCorrecaoLocalizacao}
                      onChange={(event) => {
                        const bairroSelecionado = event.target.value;
                        const opcao = opcoesBairrosSetores.find(
                          (item) => item.bairro === bairroSelecionado
                        );

                        setBairroCorrecaoLocalizacao(bairroSelecionado);
                        setSetorCorrecaoLocalizacao(opcao?.setor || "");
                        setMensagemCorrecaoLocalizacao(
                          opcao?.setor ? "Setor preenchido automaticamente pelo bairro." : ""
                        );
                      }}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                    >
                      <option value="">Selecione o bairro...</option>
                      {opcoesBairrosSetores.map((opcao) => (
                        <option key={`${opcao.bairro}-${opcao.setor}`} value={opcao.bairro}>
                          {opcao.bairro}
                        </option>
                      ))}
                    </select>
                  )}

                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700">Setor</label>
                  <input
                    value={setorCorrecaoLocalizacao}
                    readOnly
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700 outline-none"
                  />
                  <p className="mt-2 text-sm text-slate-500">O setor é preenchido automaticamente conforme o bairro selecionado.</p>
                </div>

                <p className="mt-3 text-sm text-slate-500">{mensagemCorrecaoLocalizacao}</p>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={fecharModalCorrecaoLocalizacao}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-700 border"
                  >
                    Fechar
                  </button>

                  <button
                    onClick={salvarCorrecaoLocalizacao}
                    disabled={salvandoCorrecaoLocalizacao}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {salvandoCorrecaoLocalizacao ? "Salvando..." : "Salvar correção"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalHistoricoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Histórico do processo
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  SisGep: {processoHistorico?.sisgep || "---"}
                </p>
              </div>

              <button
                type="button"
                onClick={fecharHistoricoProcesso}
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                Fechar
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              {carregandoHistorico && (
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                  Carregando histórico...
                </div>
              )}

              {erroHistorico && (
                <div className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {erroHistorico}
                </div>
              )}

              {!carregandoHistorico && !erroHistorico && historicoProcesso.length === 0 && (
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                  Nenhum histórico registrado para este processo.
                </div>
              )}

              {!carregandoHistorico && historicoProcesso.length > 0 && (
                <div className="space-y-4">
                  {historicoProcesso.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {rotuloAcaoAuditoria(item.acao)}
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            {item.descricao || "Sem descrição."}
                          </p>
                        </div>

                        <span className="text-xs font-semibold text-slate-500">
                          {formatarDataHora(item.created_at)}
                        </span>
                      </div>

                      <div className="mt-3 text-xs text-slate-500">
                        Usuário: {item.usuario_nome || item.usuario_email || "---"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE RELATÓRIO DE PENDÊNCIAS */}
      {modalRelatorioAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            
            <div className="flex flex-shrink-0 items-start justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Gerar Relatório de Pendências</h2>
                <p className="mt-1 text-sm text-slate-600">Selecione múltiplas opções. O relatório mostrará apenas os itens que combinam com os filtros abaixo.</p>
              </div>
              <button onClick={() => setModalRelatorioAberto(false)} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200">
                Fechar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-red-800 uppercase">Processos Encontrados</p>
                  <p className="text-xs text-red-600">Prontos para impressão</p>
                </div>
                <p className="text-4xl font-black text-red-700">{preRelatorioFiltrados.length}</p>
              </div>

              <div className="mb-4">
                <label className="text-sm font-bold text-slate-800 mb-2 block">Nível de Atraso (SLA)</label>
                <div className="flex gap-2">
                  {[
                    { id: "todos", label: "Todos pendentes" },
                    { id: "critico", label: "Críticos (15+ dias)" },
                    { id: "atencao", label: "Atenção (10 a 14 dias)" },
                    { id: "normal", label: "Normal (Até 9 dias)" },
                  ].map((opcao) => (
                    <label key={opcao.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100">
                      <input type="radio" name="sla" checked={relFiltroSla === opcao.id} onChange={() => setRelFiltroSla(opcao.id)} className="h-4 w-4" />
                      <span>{opcao.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-800">Setores</label>
                    <button onClick={() => setRelSetoresSelecionados([])} className="text-xs text-blue-600 hover:underline">Limpar</button>
                  </div>
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-inner">
                    {relSetoresDisponiveis.map((setor) => (
                      <label key={setor} className="flex cursor-pointer items-center gap-2 py-1 text-sm text-slate-700 hover:bg-slate-200/50 rounded px-1">
                        <input type="checkbox" checked={relSetoresSelecionados.includes(setor)} onChange={() => alternarCheckboxRelatorio(setor, relSetoresSelecionados, setRelSetoresSelecionados)} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                        {setor}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-800">Assuntos</label>
                    <button onClick={() => setRelAssuntosSelecionados([])} className="text-xs text-blue-600 hover:underline">Limpar</button>
                  </div>
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-inner">
                    {relAssuntosDisponiveis.map((assunto) => (
                      <label key={assunto} className="flex cursor-pointer items-center gap-2 py-1 text-sm text-slate-700 hover:bg-slate-200/50 rounded px-1">
                        <input type="checkbox" checked={relAssuntosSelecionados.includes(assunto)} onChange={() => alternarCheckboxRelatorio(assunto, relAssuntosSelecionados, setRelAssuntosSelecionados)} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                        {assunto}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center justify-between border-t border-slate-200 bg-slate-50 p-6">
              <button type="button" onClick={limparFiltrosRelatorio} className="text-sm font-bold text-slate-500 hover:text-slate-800">
                Zerar Filtros
              </button>
              
              <div className="flex gap-3">
                <button type="button" onClick={() => setModalRelatorioAberto(false)} className="rounded-lg bg-white border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  Cancelar
                </button>

                <button type="button" onClick={gerarRelatorioPendenciasPersonalizado} disabled={preRelatorioFiltrados.length === 0} className="rounded-lg bg-red-700 px-6 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  Gerar Relatório
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}

function CampoTexto({
  label,
  value,
  onChange,
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (valor: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
      />
    </div>
  );
}

function CampoData({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (valor: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
      />
    </div>
  );
}

function CampoAssunto({
  value,
  onChange,
}: {
  value: string;
  onChange: (valor: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">Assunto</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
      >
        <option value="">Selecione...</option>
        {opcoesAssunto.map((assunto) => (
          <option key={assunto} value={assunto}>
            {assunto}
          </option>
        ))}
      </select>
    </div>
  );
}

function CampoObservacao({
  value,
  onChange,
}: {
  value: string;
  onChange: (valor: string) => void;
}) {
  return (
    <div className="md:col-span-2">
      <label className="text-sm font-semibold text-slate-700">Observação</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
      />
    </div>
  );
}