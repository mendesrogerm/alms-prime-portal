import { NextResponse } from "next/server";

type NominatimResultado = {
  lat: string;
  lon: string;
  address?: {
    neighbourhood?: string;
    suburb?: string;
    city_district?: string;
    quarter?: string;
    residential?: string;
    hamlet?: string;
  };
};

function escolherBairro(address?: NominatimResultado["address"]) {
  if (!address) return null;

  return (
    address.neighbourhood ||
    address.suburb ||
    address.city_district ||
    address.quarter ||
    address.residential ||
    address.hamlet ||
    null
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rua = String(body.rua || "").trim();
    const numero = String(body.numero || "").trim();

    if (!rua || !numero) {
      return NextResponse.json(
        { erro: "Informe rua e número." },
        { status: 400 }
      );
    }

    const endereco = `${rua}, ${numero}, Santana de Parnaíba, São Paulo, Brasil`;

    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", endereco);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "br");

    const resposta = await fetch(url, {
      headers: {
        "User-Agent": "ALMSPrimePortal/1.0 (https://www.almsprime.com.br)",
        Referer: "https://www.almsprime.com.br",
      },
    });

    if (!resposta.ok) {
      return NextResponse.json(
        { erro: "Não foi possível consultar o endereço." },
        { status: 500 }
      );
    }

    const resultados = (await resposta.json()) as NominatimResultado[];
    const primeiro = resultados[0];

    if (!primeiro) {
      return NextResponse.json({
        bairro: null,
        latitude: null,
        longitude: null,
      });
    }

    return NextResponse.json({
      bairro: escolherBairro(primeiro.address),
      latitude: Number(primeiro.lat),
      longitude: Number(primeiro.lon),
    });
  } catch {
    return NextResponse.json(
      { erro: "Erro inesperado ao geocodificar endereço." },
      { status: 500 }
    );
  }
}