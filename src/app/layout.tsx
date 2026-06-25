import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { StructuredData } from "../components/StructuredData";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#071b2d",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.almsprime.com.br"),
  title: {
    default: "ALMS Prime | Tecnologia, Gestão e Soluções Digitais",
    template: "%s | ALMS Prime",
  },
  description:
    "Portal institucional da ALMS Prime. Soluções digitais, sistemas de gestão, automação comercial, dashboards, portais e projetos sob medida.",
  applicationName: "ALMS Prime",
  authors: [{ name: "ALMS Prime" }],
  creator: "ALMS Prime",
  publisher: "ALMS Prime",
  keywords: [
    "ALMS Prime",
    "sistemas de gestão",
    "soluções digitais",
    "automação comercial",
    "portal institucional",
    "dashboard",
    "gestão de clientes",
    "gestão comercial",
    "tecnologia para negócios",
  ],
  openGraph: {
    title: "ALMS Prime | Tecnologia, Gestão e Soluções Digitais",
    description:
      "Soluções digitais, sistemas de gestão, automação comercial, dashboards, portais e projetos sob medida.",
    url: "https://www.almsprime.com.br",
    siteName: "ALMS Prime",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/logo-alms-prime.png",
        width: 1200,
        height: 630,
        alt: "ALMS Prime | Tecnologia, Gestão e Soluções Digitais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALMS Prime | Tecnologia, Gestão e Soluções Digitais",
    description:
      "Portal institucional da ALMS Prime para sistemas, soluções digitais e projetos sob medida.",
    images: ["/logo-alms-prime.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo-alms-prime.png",
    shortcut: "/logo-alms-prime.png",
    apple: "/logo-alms-prime.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <StructuredData />
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
