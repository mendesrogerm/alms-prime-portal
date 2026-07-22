import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Fiscalização SisGep",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FiscalizacaoLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}