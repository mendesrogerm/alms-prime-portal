import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { StructuredData } from "../components/StructuredData";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.almsprime.com.br"),
  title: {
    default: "ALMS PRIME | Sistemas, Tecnologia e Conhecimento",
    template: "%s | ALMS PRIME",
  },
  description:
    "Portal da ALMS PRIME para sistemas, projetos, tecnologia, gestão, ALMS Academy, produtos digitais e conteúdos práticos.",
  applicationName: "ALMS PRIME",
  authors: [{ name: "ALMS PRIME" }],
  creator: "ALMS PRIME",
  publisher: "ALMS PRIME",
  keywords: [
    "ALMS PRIME",
    "sistemas de gestão",
    "soluções digitais",
    "tecnologia para negócios",
    "inteligência artificial",
    "ALMS Academy",
    "cursos digitais",
    "e-books",
    "gestão de clientes",
    "automação comercial",
    "projetos digitais",
  ],
  openGraph: {
    title: "ALMS PRIME | Sistemas, Tecnologia e Conhecimento",
    description:
      "Sistemas, projetos, produtos digitais e conhecimento reunidos em um único ecossistema.",
    url: "https://www.almsprime.com.br",
    siteName: "ALMS PRIME",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-alms-prime.png",
        width: 1200,
        height: 630,
        alt: "ALMS PRIME | Sistemas, Tecnologia e Conhecimento",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALMS PRIME | Sistemas, Tecnologia e Conhecimento",
    description:
      "Sistemas, projetos, produtos digitais e conhecimento em um único portal.",
    images: ["/og-alms-prime.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo-alms-prime-oficial.png",
    shortcut: "/logo-alms-prime-oficial.png",
    apple: "/logo-alms-prime-oficial.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full bg-white text-slate-950">
        <StructuredData />
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}