"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Noticia = {
  titulo: string;
  link: string;
  fonte: string;
  data: string;
};

export default function NoticiasCriptoPage() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [atualizadoEm, setAtualizadoEm] = useState("");

  useEffect(() => {
    verificarLoginECarregarNoticias();
  }, []);

  async function verificarLoginECarregarNoticias() {
    setCarregando(true);
    setErro("");

    const { data: sessao } = await supabase.auth.getSession();

    if (!sessao.session?.user) {
      router.push("/login");
      return;
    }

    await carregarNoticias();
    setCarregando(false);
  }

  async function carregarNoticias() {
    try {
      setErro("");

      const resposta = await fetch("/api/cripto/noticias");

      if (!resposta.ok) {
        setErro("Não foi possível carregar as notícias do mercado.");
        return;
      }

      const dados = await resposta.json();

      setNoticias(dados.noticias || []);
      setAtualizadoEm(dados.atualizado_em || "");
    } catch {
      setErro("Erro inesperado ao buscar notícias.");
    }
  }

  const dataAtualizacao = atualizadoEm
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(atualizadoEm))
    : "";

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm font-semibold text-cyan-300">
          Carregando notícias do mercado...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-slate-950 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/cripto" className="text-sm font-semibold text-cyan-300">
              ← Voltar ao Cripto
            </Link>

            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Notícias do Mercado Cripto
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Radar com notícias recentes sobre Bitcoin, Ethereum,
              criptomoedas, blockchain e mercado cripto.
            </p>

            {dataAtualizacao && (
              <p className="mt-2 text-xs text-slate-500">
                Última atualização: {dataAtualizacao}
              </p>
            )}
          </div>

          <button
            onClick={carregarNoticias}
            className="rounded-lg border border-cyan-400 px-4 py-2 text-sm font-bold text-cyan-300 hover:bg-cyan-400 hover:text-slate-950"
          >
            Atualizar notícias
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6">
        {erro && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm font-semibold text-red-200">
            {erro}
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-100">
          <strong>Aviso:</strong> as notícias são informativas e não representam
          recomendação de compra, venda ou investimento.
        </div>

        {noticias.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
            Nenhuma notícia encontrada no momento.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {noticias.map((noticia, index) => (
              <article
                key={`${noticia.link}-${index}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-500/60 hover:bg-slate-900/80"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-bold text-slate-300">
                    {noticia.fonte}
                  </span>

                  {noticia.data && (
                    <span className="text-xs text-slate-500">
                      {noticia.data}
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-lg font-black leading-snug text-white">
                  {noticia.titulo}
                </h2>

                <a
                  href={noticia.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block rounded-lg bg-cyan-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-300"
                >
                  Ler notícia
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}