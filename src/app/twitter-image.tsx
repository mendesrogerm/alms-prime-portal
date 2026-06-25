import { ImageResponse } from "next/og";

export const alt = "ALMS Prime | Tecnologia, Gestão e Soluções Digitais";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #061728 0%, #0d3148 48%, #071b2d 100%)",
          color: "white",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "rgba(34, 211, 238, 0.22)",
            filter: "blur(80px)",
            left: -120,
            top: -140,
          }}
        />

        <div
          style={{
            position: "absolute",
            width: 460,
            height: 460,
            borderRadius: 9999,
            background: "rgba(52, 211, 153, 0.18)",
            filter: "blur(80px)",
            right: -120,
            bottom: -120,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 36,
            border: "1px solid rgba(125, 211, 252, 0.22)",
            borderRadius: 42,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "76px 84px",
            width: "100%",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: 26,
                background: "rgba(34, 211, 238, 0.12)",
                border: "1px solid rgba(125, 211, 252, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 42px rgba(34, 211, 238, 0.28)",
              }}
            >
              <span
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color: "#67e8f9",
                  letterSpacing: -2,
                }}
              >
                AP
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  letterSpacing: 8,
                  textTransform: "uppercase",
                }}
              >
                ALMS PRIME
              </span>

              <span
                style={{
                  marginTop: 8,
                  fontSize: 22,
                  color: "#bae6fd",
                  fontWeight: 700,
                }}
              >
                Tecnologia • Gestão • Soluções digitais
              </span>
            </div>
          </div>

          <div style={{ maxWidth: 920 }}>
            <div
              style={{
                display: "inline-flex",
                border: "1px solid rgba(125, 211, 252, 0.32)",
                background: "rgba(14, 116, 144, 0.18)",
                color: "#67e8f9",
                borderRadius: 999,
                padding: "12px 20px",
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Portal institucional
            </div>

            <h1
              style={{
                marginTop: 28,
                marginBottom: 0,
                fontSize: 72,
                lineHeight: 0.95,
                letterSpacing: -4,
                fontWeight: 900,
                maxWidth: 950,
              }}
            >
              Sistemas, automações e projetos digitais para sua operação crescer
            </h1>

            <p
              style={{
                marginTop: 28,
                marginBottom: 0,
                fontSize: 28,
                lineHeight: 1.35,
                color: "#dbeafe",
                maxWidth: 900,
                fontWeight: 600,
              }}
            >
              Organize processos, centralize informações e transforme ideias em
              soluções digitais profissionais.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 22,
              color: "#a7f3d0",
              fontWeight: 800,
            }}
          >
            <span>www.almsprime.com.br</span>
            <span>Gestão • Portais • Dashboards • Automação</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
