export type Processo = {
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

export type Anexo = {
  id: string;
  processo_id: string;
  processo_sisgep: string | null;
  nome_arquivo: string | null;
  url: string;
  mime_type: string | null;
  tamanho_bytes: number | null;
  created_at: string;
};

export type AuditoriaProcesso = {
  id: string;
  processo_id: string | null;
  processo_sisgep: string | null;
  user_id: string | null;
  usuario_email: string | null;
  usuario_nome: string | null;
  acao: string;
  descricao: string | null;
  dados_anteriores: unknown | null;
  dados_novos: unknown | null;
  created_at: string;
};

export type FiltroStatus = "todos" | "pendentes" | "concluidos";
export type ModoVisualizacao = "cards" | "tabela";
export type OrdenacaoProcessos =
  | "dias_desc"
  | "dias_asc"
  | "entrada_recente"
  | "entrada_antiga";
export type TipoFiltroPeriodo = "todos" | "entrada" | "conclusao";
export type ModoConclusao = "individual" | "lote";

export type NovoProcessoForm = {
  sisgep: string;
  data_entrada: string;
  aberto_por: string;
  assunto: string;
  rua: string;
  numero_rua: string;
  bairro: string;
  setor: string;
  observacao: string;
};

export type NivelUsuario = "admin" | "gestor" | "usuario";

export type PerfilUsuario = {
  id: string;
  user_id: string;
  email: string | null;
  nome: string | null;
  nivel: NivelUsuario;
  ativo: boolean;
  created_at: string;
  updated_at: string | null;
};

export type GrupoResumo = {
  nome: string;
  total: number;
};
