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

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-blue-800">ALMS PRIME</p>

        <h1 className="mt-2 text-2xl font-bold text-slate-800">
          Entrar no sistema
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Acesse com o usuário criado no Supabase.
        </p>

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
        </form>
      </div>
    </main>
  );
}