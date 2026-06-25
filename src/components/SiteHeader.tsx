"use client";

import Image from "next/image";
import { useState } from "react";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Soluções", href: "/solucoes" },
  { label: "Sistemas", href: "/sistemas" },
  { label: "Contato", href: "/contato" },
];

export function SiteHeader() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="relative mx-auto flex max-w-7xl items-center justify-between gap-6">
      <a href="/" className="flex items-center gap-3">
        <div className="flex h-13 w-13 items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/40 bg-cyan-300/10 p-1 shadow-lg shadow-cyan-500/20">
          <Image
            src="/logo-alms-prime.png"
            alt="Logo ALMS Prime"
            width={80}
            height={80}
            priority
            className="h-full w-full object-contain"
          />
        </div>

        <div>
          <p className="text-sm font-black tracking-[0.28em] text-white">
            ALMS PRIME
          </p>
          <p className="text-xs text-cyan-100/80">
            Tecnologia • Gestão • Soluções digitais
          </p>
        </div>
      </a>

      <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
        {navItems.map((item) => (
          <a
            key={item.href}
            className="transition hover:text-cyan-200"
            href={item.href}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="hidden md:block">
        <a
          href="/login"
          className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
        >
          Área interna
        </a>
      </div>

      <button
        type="button"
        onClick={() => setMenuAberto((valor) => !valor)}
        className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white transition hover:border-cyan-300/60 hover:bg-cyan-300/10 md:hidden"
        aria-expanded={menuAberto}
        aria-label="Abrir menu de navegação"
      >
        Menu
      </button>

      {menuAberto ? (
        <div className="absolute right-0 top-16 z-50 w-72 rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-black/40 backdrop-blur md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuAberto(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-cyan-300/10 hover:text-cyan-200"
              >
                {item.label}
              </a>
            ))}

            <a
              href="/login"
              onClick={() => setMenuAberto(false)}
              className="mt-2 rounded-2xl bg-cyan-300 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-slate-950 transition hover:bg-cyan-200"
            >
              Área interna
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}



