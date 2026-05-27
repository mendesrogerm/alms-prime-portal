"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
};

type MapaProcessosProps = {
  processos: ProcessoMapa[];
};

function criarIcone(concluido: boolean) {
  const cor = concluido ? "#16a34a" : "#dc2626";

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
      .filter((p) => p.latitude && p.longitude)
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
    (processo) => processo.latitude && processo.longitude
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
            key={processo.id}
            position={[processo.latitude as number, processo.longitude as number]}
            icon={criarIcone(processo.concluido)}
          >
            <Popup>
              <div style={{ minWidth: 220 }}>
                <strong>{processo.sisgep}</strong>

                <p style={{ margin: "8px 0 0" }}>
                  <strong>Status:</strong>{" "}
                  {processo.concluido ? "Concluído" : "Pendente"}
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