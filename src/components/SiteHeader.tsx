"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "Soluções", href: "/#categorias" },
  { label: "Projetos", href: "/#projetos" },
  { label: "Academy", href: "/#academy" },
  { label: "Loja", href: "/#produtos" },
  { label: "Novidades", href: "/#novidades" },
  { label: "Sobre", href: "/sobre" },
];

export function SiteHeader() {
  const [menuAberto, setMenuAberto] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const botaoMenuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuAberto) {
      return;
    }

    function fecharComFocoNoBotao() {
      setMenuAberto(false);

      window.requestAnimationFrame(() => {
        botaoMenuRef.current?.focus();
      });
    }

    function tratarTeclado(event: KeyboardEvent) {
      if (event.key === "Escape") {
        fecharComFocoNoBotao();
      }
    }

    function tratarCliqueExterno(event: PointerEvent) {
      const alvo = event.target;

      if (!(alvo instanceof Node)) {
        return;
      }

      if (!headerRef.current?.contains(alvo)) {
        setMenuAberto(false);
      }
    }

    function tratarRedimensionamento() {
      if (window.innerWidth >= 1024) {
        setMenuAberto(false);
      }
    }

    document.addEventListener("keydown", tratarTeclado);
    document.addEventListener("pointerdown", tratarCliqueExterno);
    window.addEventListener("resize", tratarRedimensionamento);

    return () => {
      document.removeEventListener("keydown", tratarTeclado);
      document.removeEventListener("pointerdown", tratarCliqueExterno);
      window.removeEventListener("resize", tratarRedimensionamento);
    };
  }, [menuAberto]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl"
    >
      <div className="relative mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6 sm:px-10 lg:px-8">
        <Link
          href="/"
          aria-label="Ir para a página inicial da ALMS PRIME"
          onClick={() => setMenuAberto(false)}
          className="flex min-w-0 items-center gap-4"
        >
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-300/50 bg-[#06182C] shadow-[0_8px_24px_rgba(9,42,86,0.22)] ring-2 ring-white">
            <Image
              src="/logo-alms-prime-oficial.png"
              alt="Logo oficial da ALMS PRIME"
              width={1200}
              height={1200}
              sizes="64px"
              priority
              className="h-full w-full scale-[1.78] object-cover object-center"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-black tracking-[0.18em] text-[#092A56]">
              ALMS PRIME
            </p>
            <p className="hidden truncate text-xs font-semibold text-slate-500 sm:block">
              Tecnologia, gestão e conhecimento
            </p>
          </div>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-5 text-sm font-bold text-slate-600 lg:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[#075BC7]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#075BC7] px-5 py-2.5 text-sm font-black text-white shadow-md shadow-blue-900/10 transition hover:-translate-y-0.5 hover:bg-[#064da8]"
          >
            Área do cliente
          </Link>
        </div>

        <button
          ref={botaoMenuRef}
          type="button"
          onClick={() => setMenuAberto((valor) => !valor)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-[#092A56] transition hover:border-blue-300 hover:bg-blue-50 lg:hidden"
          aria-expanded={menuAberto}
          aria-controls="menu-mobile"
          aria-haspopup="true"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        >
          <span className="text-xl font-black" aria-hidden="true">
            {menuAberto ? "×" : "≡"}
          </span>
        </button>

        {menuAberto ? (
          <div
            id="menu-mobile"
            className="absolute left-6 right-6 top-[calc(100%+0.75rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-blue-950/15 sm:left-10 sm:right-10 lg:hidden"
          >
            <nav
              aria-label="Navegação móvel"
              className="flex flex-col gap-1"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuAberto(false)}
                  className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-[#075BC7]"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/login"
                onClick={() => setMenuAberto(false)}
                className="mt-2 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#075BC7] px-5 py-3 text-sm font-black text-white"
              >
                Área do cliente
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
