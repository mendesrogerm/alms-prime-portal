import { NextResponse } from "next/server";

type Noticia = {
  titulo: string;
  link: string;
  fonte: string;
  data: string;
};

function limparTexto(valor: string) {
  return valor
    .replace("<![CDATA[", "")
    .replace("]]>", "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function extrairTag(item: string, tag: string) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const encontrado = item.match(regex);

  return encontrado ? limparTexto(encontrado[1]) : "";
}

function extrairFonte(item: string) {
  const source = extrairTag(item, "source");
  return source || "Google News";
}

function formatarData(dataOriginal: string) {
  if (!dataOriginal) return "";

  const data = new Date(dataOriginal);

  if (Number.isNaN(data.getTime())) {
    return dataOriginal;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}

export async function GET() {
  try {
    const url =
      "https://news.google.com/rss/search?q=criptomoedas+OR+bitcoin+OR+ethereum+OR+blockchain&hl=pt-BR&gl=BR&ceid=BR:pt-419";

    const resposta = await fetch(url, {
      next: {
        revalidate: 900,
      },
    });

    if (!resposta.ok) {
      return NextResponse.json(
        { erro: "Não foi possível carregar as notícias." },
        { status: 500 }
      );
    }

    const xml = await resposta.text();

    const itens = xml
      .split("<item>")
      .slice(1)
      .map((parte) => parte.split("</item>")[0])
      .slice(0, 12);

    const noticias: Noticia[] = itens.map((item) => {
      const tituloCompleto = extrairTag(item, "title");
      const titulo = tituloCompleto.includes(" - ")
        ? tituloCompleto.split(" - ")[0]
        : tituloCompleto;

      return {
        titulo,
        link: extrairTag(item, "link"),
        fonte: extrairFonte(item),
        data: formatarData(extrairTag(item, "pubDate")),
      };
    });

    return NextResponse.json({
      noticias,
      atualizado_em: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { erro: "Erro inesperado ao buscar notícias." },
      { status: 500 }
    );
  }
}