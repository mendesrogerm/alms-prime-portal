export function dataAtualInput(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export function dataAtualFormatoBanco(): string {
  return dataAtualInput();
}

export function somenteNumeros(valor: string) {
  return valor.replace(/\D/g, "");
}

export function extrairSisgepsDigitados(valor: string) {
  return Array.from(
    new Set(
      valor
        .split(/[\s,;]+/)
        .map((item) => somenteNumeros(item))
        .filter((item) => item.length > 0)
    )
  );
}

export function aplicarMascaraSisgep(valor: string) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 15)
    .replace(/(\d{3})(?=\d)/g, "$1.");
}

export function dataConclusaoValida(data: string) {
  if (!data) return false;
  return data <= dataAtualInput();
}

export function calcularDiasEntreDatas(
  dataInicial: string | null,
  dataFinal?: string | null
) {
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

export function normalizarTexto(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function formatarData(data: string | null) {
  if (!data) return "---";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataHora(valor: string | null | undefined) {
  if (!valor) return "---";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "---";
  }

  return data.toLocaleString("pt-BR");
}

export function rotuloAcaoAuditoria(acao: string) {
  const mapa: Record<string, string> = {
    processo_criado: "Processo criado",
    processo_editado: "Processo editado",
    processo_concluido: "Processo concluído",
    processo_reaberto: "Processo reaberto",
    processo_concluido_lote: "Processo concluído em lote",
    data_conclusao_corrigida: "Data de conclusão corrigida",
    anexo_enviado: "Anexo enviado",
    anexo_excluido: "Anexo excluído",
    processo_excluido: "Processo excluído",
  };

  return mapa[acao] || acao;
}

export function limparNomeArquivo(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export function escaparCsv(valor: string | number | null | undefined) {
  const texto = String(valor ?? "");
  return `"${texto.replace(/"/g, '""')}"`;
}

export function escaparHtml(valor: string | number | null | undefined) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
