import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ALMS Prime Cripto",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CriptoLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}