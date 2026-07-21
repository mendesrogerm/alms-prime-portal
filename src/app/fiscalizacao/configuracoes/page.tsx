"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type NivelUsuario = "admin" | "gestor" | "usuario";

type PerfilUsuario = {
  id: string;
  user_id: string;
  email: string | null;
  nome: string | null;
  nivel: NivelUsuario;
  ativo: boolean;
  created_at: string;
  updated_at: string | null;
};

type BairroSetor = {
  id: string;
  bairro: string;
  bairro_normalizado: string;
  setor: string;
  created_at: string;
};

function normalizarTexto(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export default function ConfiguracoesPage() {
  const router = useRouter();

  const [bairrosSetores, setBairrosSetores] = useState<BairroSetor[]>([]);
  const [bairro, setBairro] = useState("");
  const [setor, setSetor] = useState("");
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [perfilUsuario, setPerfilUsuario] = useState<PerfilUsuario | null>(null);

  const podeAdministrar = perfilUsuario?.nivel === "admin";

  useEffect(() => {
    verificarLoginECarregar();
  }, []);

  async function verificarLoginECarregar() {
    setCarregando(true);
    setErro("");

    const { data: sessao } = await supabase.auth.getSession();

    if (!sessao.session) {
      router.push("/login");
      return;
    }

    const { data: perfilData, error: erroPerfil } = await supabase
      .from("perfis_usuarios")
      .select("*")
      .eq("user_id", sessao.session.user.id)
      .maybeSingle();

    if (erroPerfil) {
      setErro("Erro ao carregar perfil: " + erroPerfil.message);
      setCarregando(false);
      return;
    }

    const perfilFinal: PerfilUsuario = perfilData
      ? {
          id: perfilData.id,
          user_id: perfilData.user_id,
          email: perfilData.email ?? sessao.session.user.email ?? null,
          nome: perfilData.nome ?? sessao.session.user.email ?? null,
          nivel: (perfilData.nivel as NivelUsuario) || "usuario",
          ativo: perfilData.ativo ?? true,
          created_at: perfilData.created_at,
          updated_at: perfilData.updated_at ?? null,
        }
      : {
          id: sessao.session.user.id,
          user_id: sessao.session.user.id,
          email: sessao.session.user.email ?? null,
          nome: sessao.session.user.email ?? null,
          nivel: "usuario",
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: null,
        };

    if (!perfilFinal.ativo) {
      await supabase.auth.signOut();
      router.push("/login");
      return;
    }

    setPerfilUsuario(perfilFinal);

    if (perfilFinal.nivel !== "admin") {
      setCarregando(false);
      return;
    }

    await carregarBairrosSetores();
    setCarregando(false);
  }

  async function carregarBairrosSetores() {
    const tamanhoLote = 1000;
    const todosBairros: BairroSetor[] = [];
    let inicio = 0;

    while (true) {
      const fim = inicio + tamanhoLote - 1;

      const { data, error } = await supabase
        .from("bairros_setores")
        .select(
          "id,bairro,bairro_normalizado,setor,created_at"
        )
        .order("bairro", { ascending: true })
        .order("bairro_normalizado", { ascending: true })
        .order("id", { ascending: true })
        .range(inicio, fim);

      if (error) {
        setErro("Erro ao carregar bairros e setores: " + error.message);
        return;
      }

      const lote = (data || []) as BairroSetor[];
      todosBairros.push(...lote);

      if (lote.length < tamanhoLote) {
        break;
      }

      inicio += tamanhoLote;
    }

    setBairrosSetores(todosBairros);
  }

  async function salvarBairroSetor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!podeAdministrar) {
      alert("Acesso restrito a administradores.");
      return;
    }

    if (!bairro.trim()) {
      alert("Informe o bairro.");
      return;
    }

    if (!setor.trim()) {
      alert("Informe o setor.");
      return;
    }

    setSalvando(true);

    const bairroFormatado = bairro.trim();
    const setorFormatado = setor.trim();
    const bairroNormalizado = normalizarTexto(bairroFormatado);

    const { error } = await supabase
      .from("bairros_setores")
      .upsert(
        {
          bairro: bairroFormatado,
          bairro_normalizado: bairroNormalizado,
          setor: setorFormatado,
        },
        {
          onConflict: "bairro_normalizado",
        }
      )
      .select("id")
      .single();

    setSalvando(false);

    if (error) {
      alert("Erro ao salvar bairro/setor: " + error.message);
      return;
    }

    setBairro("");
    setSetor("");
    await carregarBairrosSetores();
  }

  function preencherParaEditar(item: BairroSetor) {
    setBairro(item.bairro);
    setSetor(item.setor);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const bairrosFiltrados = bairrosSetores.filter((item) => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return true;

    return (
      item.bairro.toLowerCase().includes(termo) ||
      item.setor.toLowerCase().includes(termo)
    );
  });

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-blue-900 px-6 py-6 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/fiscalizacao"
            className="text-sm font-semibold text-blue-200 hover:text-white"
          >
            ← Voltar para Fiscalização
          </Link>

          <h1 className="mt-4 text-3xl font-bold">
            Configurações
          </h1>

          {podeAdministrar && (
            <Link
              href="/fiscalizacao/configuracoes/bairros-setores"
              className="mt-3 inline-flex rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              Importar bairros e setores
            </Link>
          )}

          <p className="mt-2 text-blue-100">
            Gerencie a relação de bairros e setores usada pelo sistema.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {podeAdministrar ? (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              Cadastrar ou atualizar bairro
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Se o bairro já existir, o sistema atualiza o setor automaticamente.
            </p>

            <form onSubmit={salvarBairroSetor} className="mt-5 grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Bairro
                </label>
                <input
                  value={bairro}
                  onChange={(event) => setBairro(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                  placeholder="Ex: Centro"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Setor
                </label>
                <input
                  value={setor}
                  onChange={(event) => setSetor(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                  placeholder="Ex: Setor 1"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={salvando}
                  className="w-full rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {salvando ? "Salvando..." : "Salvar bairro"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            <p className="text-lg font-bold">Acesso restrito a administradores.</p>
            <p className="mt-2 text-sm">
              Somente administradores podem alterar bairros e setores.
            </p>
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <input
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
            placeholder="Buscar bairro ou setor..."
          />

          <p className="mt-3 text-xs font-semibold text-slate-500">
            Exibindo {bairrosFiltrados.length} de {bairrosSetores.length} bairros cadastrados.
          </p>
        </div>

        {carregando && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Carregando configurações...
          </div>
        )}

        {erro && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 font-semibold text-red-700 shadow-sm">
            {erro}
          </div>
        )}

        {!carregando && !erro && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Bairro</th>
                  <th className="px-4 py-3">Setor</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>

              <tbody>
                {bairrosFiltrados.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {item.bairro}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.setor}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {podeAdministrar && (
                        <button
                          onClick={() => preencherParaEditar(item)}
                          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {bairrosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                      Nenhum bairro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}