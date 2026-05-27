"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type TipoMarcador = "pendente" | "concluido" | "concluido_dia" | "oportunidade";

type ProcessoMapa = {
  id: string;
  sisgep: string;
  concluido: boolean;
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

type MapaProcessosProps = {
  processos: ProcessoMapa[];
};

function obterCorPorAssunto(assunto: string | null) {
  const assuntoNormalizado = (assunto || "").toLowerCase();

  if (assuntoNormalizado.includes("ouvidoria")) return "#dc2626";
  if (assuntoNormalizado.includes("denúncia")) return "#dc2626";
  if (assuntoNormalizado.includes("denuncia")) return "#dc2626";

  if (assuntoNormalizado.includes("inscrição")) return "#2563eb";
  if (assuntoNormalizado.includes("inscricao")) return "#2563eb";
  if (assuntoNormalizado.includes("alteração contratual")) return "#2563eb";
  if (assuntoNormalizado.includes("alteracao contratual")) return "#2563eb";

  if (assuntoNormalizado.includes("encerramento")) return "#475569";
  if (assuntoNormalizado.includes("cancelamento")) return "#475569";

  if (assuntoNormalizado.includes("processo físico")) return "#334155";
  if (assuntoNormalizado.includes("processo fisico")) return "#334155";

  if (assuntoNormalizado.includes("iptu")) return "#16a34a";

  if (assuntoNormalizado.includes("drm")) return "#ca8a04";
  if (assuntoNormalizado.includes("iss")) return "#ca8a04";

  if (assuntoNormalizado.includes("revisão")) return "#0891b2";
  if (assuntoNormalizado.includes("revisao")) return "#0891b2";
  if (assuntoNormalizado.includes("taxa")) return "#0891b2";

  if (assuntoNormalizado.includes("feiras")) return "#ea580c";
  if (assuntoNormalizado.includes("ambulantes")) return "#ea580c";

  if (assuntoNormalizado.includes("horário especial")) return "#4f46e5";
  if (assuntoNormalizado.includes("horario especial")) return "#4f46e5";

  if (assuntoNormalizado.includes("ministério público")) return "#9333ea";
  if (assuntoNormalizado.includes("ministerio publico")) return "#9333ea";

  if (assuntoNormalizado.includes("outros")) return "#64748b";

  return "#0f172a";
}

function obterCorMarcador(processo: ProcessoMapa) {
  if (processo.tipo_marcador === "concluido_dia") {
    return "#16a34a";
  }

  if (processo.tipo_marcador === "oportunidade") {
    return "#dc2626";
  }

  return obterCorPorAssunto(processo.assunto);
}

function obterTextoStatus(processo: ProcessoMapa) {
  if (processo.tipo_marcador === "concluido_dia") {
    return "✅ Concluído no dia";
  }

  if (processo.tipo_marcador === "oportunidade") {
    return "🛑 Oportunidade perdida";
  }

  return processo.concluido ? "✅ Concluído" : "⏳ Pendente";
}

function criarIcone(processo: ProcessoMapa) {
  const cor = obterCorMarcador(processo);

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 18px;
        height: 18px;
        background: ${cor};
        border: 3px solid white;
        border-radius: 999px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function AjustarZoom({ processos }: { processos: ProcessoMapa[] }) {
  const map = useMap();

  useEffect(() => {
    const pontos = processos
      .filter((p) => p.latitude !== null && p.longitude !== null)
      .map((p) => [p.latitude as number, p.longitude as number] as [number, number]);

    if (pontos.length === 0) return;

    if (pontos.length === 1) {
      map.setView(pontos[0], 16);
      return;
    }

    map.fitBounds(pontos, {
      padding: [40, 40],
      maxZoom: 16,
    });
  }, [map, processos]);

  return null;
}

export default function MapaProcessos({ processos }: MapaProcessosProps) {
  const processosComCoordenadas = processos.filter(
    (processo) => processo.latitude !== null && processo.longitude !== null
  );

  return (
    <div className="h-[75vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <MapContainer
        center={[-23.4431, -46.9123]}
        zoom={12}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AjustarZoom processos={processosComCoordenadas} />

        {processosComCoordenadas.map((processo) => (
          <Marker
            key={`${processo.id}-${processo.tipo_marcador || "geral"}`}
            position={[processo.latitude as number, processo.longitude as number]}
            icon={criarIcone(processo)}
          >
            <Popup>
              <div style={{ minWidth: 220 }}>
                <strong>{processo.sisgep}</strong>

                <p style={{ margin: "8px 0 0" }}>
                  <strong>Status:</strong> {obterTextoStatus(processo)}
                </p>

                <p style={{ margin: "4px 0 0" }}>
                  <strong>Assunto:</strong> {processo.assunto || "---"}
                </p>

                <p style={{ margin: "4px 0 0" }}>
                  <strong>Endereço:</strong> {processo.rua || "---"}, nº{" "}
                  {processo.numero_rua || "---"}
                </p>

                <p style={{ margin: "4px 0 0" }}>
                  <strong>Bairro:</strong> {processo.bairro || "---"}
                </p>

                <p style={{ margin: "4px 0 0" }}>
                  <strong>Setor:</strong> {processo.setor || "---"}
                </p>

                {processo.mapa_link && (
                  <a
                    href={processo.mapa_link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: 10,
                      fontWeight: 700,
                      color: "#1d4ed8",
                    }}
                  >
                    Abrir no Google Maps
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}