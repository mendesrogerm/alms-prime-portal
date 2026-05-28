export type AtivoCripto = {
  id: string;
  simbolo: string;
  nome: string;
  ativo?: boolean;
  created_at?: string;
};

export type TransacaoCripto = {
  id: string;
  user_id: string;
  ativo_id: string;
  tipo: "COMPRA" | "VENDA";
  quantidade: number;
  preco_unitario: number;
  moeda_preco?: "BRL" | "USD";
  created_at: string;
};

export type PrecosPorSimbolo = Record<string, number>;

type Posicao = {
  ativo_id: string;
  simbolo: string;
  nome: string;
  quantidade: number;
  preco_medio: number;
  preco_atual: number;
  valor_atual: number;
  custo_total: number;
  lucro: number;
  lucro_pct: number;
};

type Historico = {
  id: string;
  data: string;
  simbolo: string;
  tipo: string;
  quantidade: number;
  preco_unitario: number;
  total: number;
};

export function calcularPortfolio(
  transacoes: TransacaoCripto[],
  ativos: AtivoCripto[],
  precos: PrecosPorSimbolo
) {
  const ativosPorId = new Map(ativos.map((ativo) => [ativo.id, ativo]));
  const grupos = new Map<string, TransacaoCripto[]>();

  const historico: Historico[] = transacoes.map((transacao) => {
    const ativo = ativosPorId.get(transacao.ativo_id);

    return {
      id: transacao.id,
      data: transacao.created_at ? transacao.created_at.slice(0, 10) : "-",
      simbolo: ativo?.simbolo || "N/A",
      tipo: transacao.tipo,
      quantidade: Number(transacao.quantidade),
      preco_unitario: Number(transacao.preco_unitario),
      total: Number(transacao.quantidade) * Number(transacao.preco_unitario),
    };
  });

  const transacoesOrdenadas = [...transacoes].sort((a, b) =>
    String(a.created_at || "").localeCompare(String(b.created_at || ""))
  );

  for (const transacao of transacoesOrdenadas) {
    const lista = grupos.get(transacao.ativo_id) || [];
    lista.push(transacao);
    grupos.set(transacao.ativo_id, lista);
  }

  const posicoes: Posicao[] = [];

  for (const [ativoId, lista] of grupos) {
    const ativo = ativosPorId.get(ativoId);
    if (!ativo) continue;

    let quantidadeLiquida = 0;
    let custoTotal = 0;

    for (const transacao of lista) {
      const quantidade = Number(transacao.quantidade);
      const precoUnitario = Number(transacao.preco_unitario);
      const total = quantidade * precoUnitario;

      if (transacao.tipo === "COMPRA") {
        quantidadeLiquida += quantidade;
        custoTotal += total;
      }

      if (transacao.tipo === "VENDA") {
        if (quantidadeLiquida > 0) {
          const precoMedioAtual = custoTotal / quantidadeLiquida;
          custoTotal -= quantidade * precoMedioAtual;
        }

        quantidadeLiquida -= quantidade;
      }
    }

    if (quantidadeLiquida <= 0) continue;

    const precoAtual = precos[ativo.simbolo] || 0;
    const valorAtual = quantidadeLiquida * precoAtual;
    const precoMedio = custoTotal / quantidadeLiquida;
    const lucro = valorAtual - custoTotal;
    const lucroPct = custoTotal > 0 ? (lucro / custoTotal) * 100 : 0;

    posicoes.push({
      ativo_id: ativoId,
      simbolo: ativo.simbolo,
      nome: ativo.nome,
      quantidade: quantidadeLiquida,
      preco_medio: precoMedio,
      preco_atual: precoAtual,
      valor_atual: valorAtual,
      custo_total: custoTotal,
      lucro,
      lucro_pct: lucroPct,
    });
  }

  const patrimonio = posicoes.reduce((total, posicao) => total + posicao.valor_atual, 0);
  const investimento = posicoes.reduce((total, posicao) => total + posicao.custo_total, 0);
  const lucro = patrimonio - investimento;
  const rentabilidade = investimento > 0 ? (lucro / investimento) * 100 : 0;

  return {
    patrimonio,
    investimento,
    lucro,
    rentabilidade,
    posicoes: posicoes.sort((a, b) => b.valor_atual - a.valor_atual),
    historico,
  };
}

export function formatarMoedaBRL(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(valor) ? valor : 0);
}

export function formatarNumeroCripto(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(Number.isFinite(valor) ? valor : 0);
}
