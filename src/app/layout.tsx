import type { Metadata } from "next";
import "./globals.css";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "ALMS Prime | Tecnologia, Gestão e Soluções Digitais",
    description:
      "Portal institucional da ALMS Prime para sistemas, soluções digitais e projetos sob medida.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

