import { NextResponse } from "next/server";

type FearGreedResponse = {
  data?: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update?: string;
  }>;
};

function traduzirClassificacao(classificacao: string) {
  const valor = classificacao.toLowerCase();

  if (valor.includes("extreme fear")) return "Medo Extremo";
  if (valor.includes("fear")) return "Medo";
  if (valor.includes("neutral")) return "Neutro";
  if (valor.includes("extreme greed")) return "Ganância Extrema";
  if (valor.includes("greed")) return "Ganância";

  return classificacao || "Indefinido";
}

function gerarAnalise(valor: number) {
  if (valor <= 24) {
    return {
      nivel: "Medo Extremo",
      cor: "red",
      resumo:
        "O mercado está em forte aversão ao risco. Pode haver oportunidades, mas a volatilidade costuma ser elevada.",
      estrategia:
        "Evite decisões impulsivas. Analise fundamentos, use compras graduais e proteja caixa para novas quedas.",
    };
  }

  if (valor <= 44) {
    return {
      nivel: "Medo",
      cor: "orange",
      resumo:
        "O mercado demonstra cautela. Investidores estão mais defensivos e sensíveis a notícias negativas.",
      estrategia:
        "Considere observar zonas de suporte, reduzir exposição exagerada e priorizar ativos com maior liquidez.",
    };
  }

  if (valor <= 55) {
    return {
      nivel: "Neutro",
      cor: "slate",
      resumo:
        "O mercado está sem direção emocional extrema. Esse cenário costuma exigir mais confirmação técnica.",
      estrategia:
        "Acompanhe volume, tendência e notícias relevantes antes de aumentar posições.",
    };
  }

  if (valor <= 74) {
    return {
      nivel: "Ganância",
      cor: "emerald",
      resumo:
        "O mercado está otimista. Esse ambiente pode favorecer altas, mas também aumenta o risco de euforia.",
      estrategia:
        "Avalie realização parcial de lucros, ajuste stops e evite aumentar posição apenas por FOMO.",
    };
  }

  return {
    nivel: "Ganância Extrema",
    cor: "cyan",
    resumo:
      "O mercado está em forte euforia. Movimentos de alta podem continuar, mas correções rápidas são mais prováveis.",
    estrategia:
      "Proteja ganhos, reduza alavancagem e tenha cautela com entradas tardias.",
  };
}

function formatarData(timestamp: string) {
  const numero = Number(timestamp);

  if (!numero) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(numero * 1000));
}

export async function GET() {
  try {
    const resposta = await fetch("https://api.alternative.me/fng/?limit=1", {
      next: {
        revalidate: 900,
      },
    });

    if (!resposta.ok) {
      return NextResponse.json(
        { erro: "Não foi possível carregar o sentimento do mercado." },
        { status: 500 }
      );
    }

    const dados = (await resposta.json()) as FearGreedResponse;
    const item = dados.data?.[0];

    if (!item) {
      return NextResponse.json(
        { erro: "Nenhum dado de sentimento foi encontrado." },
        { status: 404 }
      );
    }

    const valor = Number(item.value);
    const analise = gerarAnalise(valor);

    return NextResponse.json({
      valor,
      classificacao_original: item.value_classification,
      classificacao: traduzirClassificacao(item.value_classification),
      atualizado_em: formatarData(item.timestamp),
      proxima_atualizacao_segundos: item.time_until_update || null,
      analise,
    });
  } catch {
    return NextResponse.json(
      { erro: "Erro inesperado ao buscar sentimento do mercado." },
      { status: 500 }
    );
  }
}