"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [modoRecuperacao, setModoRecuperacao] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [mensagemRecuperacao, setMensagemRecuperacao] = useState("");
  const [enviandoRecuperacao, setEnviandoRecuperacao] = useState(false);

  async function fazerLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }

    router.push("/fiscalizacao");
  }

  async function enviarRecuperacaoSenha(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!emailRecuperacao.trim()) {
      setMensagemRecuperacao("Informe seu e-mail.");
      return;
    }

    setEnviandoRecuperacao(true);
    setMensagemRecuperacao("");

    const origem =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.almsprime.com.br";

    const { error } = await supabase.auth.resetPasswordForEmail(
      emailRecuperacao.trim(),
      {
        redirectTo: `${origem}/redefinir-senha`,
      }
    );

    setEnviandoRecuperacao(false);

    if (error) {
      setMensagemRecuperacao("Erro ao enviar recuperação: " + error.message);
      return;
    }

    setMensagemRecuperacao(
      "Enviamos um link de recuperação para seu e-mail. Verifique sua caixa de entrada."
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-blue-800">ALMS PRIME</p>

        <h1 className="mt-2 text-2xl font-bold text-slate-800">
          {modoRecuperacao ? "Recuperar senha" : "Entrar no sistema"}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {modoRecuperacao
            ? "Informe o e-mail cadastrado para receber o link de redefinição."
            : "Acesse com o usuário criado no Supabase."}
        </p>

        {!modoRecuperacao ? (
          <form onSubmit={fazerLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                placeholder="seuemail@exemplo.com"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                placeholder="Digite sua senha"
                required
              />
            </div>

            {erro && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setModoRecuperacao(true);
                  setEmailRecuperacao(email || "");
                  setMensagemRecuperacao("");
                }}
                className="text-sm font-semibold text-blue-700 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={enviarRecuperacaoSenha} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                E-mail
              </label>
              <input
                type="email"
                value={emailRecuperacao}
                onChange={(event) => setEmailRecuperacao(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                placeholder="seuemail@exemplo.com"
                required
              />
            </div>

            {mensagemRecuperacao && (
              <div
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                  mensagemRecuperacao.includes("Erro")
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {mensagemRecuperacao}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={enviandoRecuperacao}
                className="w-full rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {enviandoRecuperacao ? "Enviando..." : "Enviar link de recuperação"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setModoRecuperacao(false);
                  setEmailRecuperacao("");
                  setMensagemRecuperacao("");
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Voltar ao login
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}