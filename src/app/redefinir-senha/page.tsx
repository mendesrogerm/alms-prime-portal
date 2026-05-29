"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RedefinirSenhaPage() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvarNovaSenha(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (novaSenha.length < 6) {
      setMensagem("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem("As senhas não conferem.");
      return;
    }

    setSalvando(true);
    setMensagem("");

    const { error } = await supabase.auth.updateUser({
      password: novaSenha,
    });

    setSalvando(false);

    if (error) {
      setMensagem("Erro ao atualizar senha: " + error.message);
      return;
    }

    setMensagem("Senha atualizada com sucesso. Você já pode fazer login.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-blue-800">ALMS PRIME</p>

        <h1 className="mt-2 text-2xl font-bold text-slate-800">
          Redefinir senha
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Crie uma nova senha para acessar o sistema.
        </p>

        <form onSubmit={salvarNovaSenha} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Nova senha
            </label>
            <input
              type="password"
              value={novaSenha}
              onChange={(event) => setNovaSenha(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
              placeholder="Digite a nova senha"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Confirmar senha
            </label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(event) => setConfirmarSenha(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
              placeholder="Confirme a nova senha"
              required
            />
          </div>

          {mensagem && (
            <div
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                mensagem.includes("sucesso")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {mensagem}
            </div>
          )}

          <button
            type="submit"
            disabled={salvando}
            className="w-full rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {salvando ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>

        {mensagem.includes("sucesso") && (
          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-sm font-bold text-blue-700 hover:underline"
            >
              Voltar para o login
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
