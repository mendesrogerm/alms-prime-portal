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

const niveisUsuario: NivelUsuario[] = ["admin", "gestor", "usuario"];

export default function UsuariosPage() {
  const router = useRouter();

  const [perfilAtual, setPerfilAtual] = useState<PerfilUsuario | null>(null);
  const [usuarios, setUsuarios] = useState<PerfilUsuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nivelSelecionado, setNivelSelecionado] = useState<NivelUsuario>("gestor");
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<PerfilUsuario | null>(null);
  const [editarNome, setEditarNome] = useState("");
  const [editarEmail, setEditarEmail] = useState("");
  const [editarNivel, setEditarNivel] = useState<NivelUsuario>("gestor");
  const [editarAtivo, setEditarAtivo] = useState(true);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

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
          nome: perfilData.nome ?? null,
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

    setPerfilAtual(perfilFinal);

    if (perfilFinal.nivel !== "admin") {
      setCarregando(false);
      return;
    }

    await carregarUsuarios();
    setCarregando(false);
  }

  async function carregarUsuarios() {
    const tamanhoLote = 1000;
    const todosUsuarios: PerfilUsuario[] = [];
    let inicio = 0;

    while (true) {
      const fim = inicio + tamanhoLote - 1;

      const { data, error } = await supabase
        .from("perfis_usuarios")
        .select(
          "id,user_id,email,nome,nivel,ativo,created_at,updated_at"
        )
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(inicio, fim);

      if (error) {
        setErro("Erro ao carregar usuários: " + error.message);
        return;
      }

      const lote = (data || []) as PerfilUsuario[];
      todosUsuarios.push(...lote);

      if (lote.length < tamanhoLote) {
        break;
      }

      inicio += tamanhoLote;
    }

    setUsuarios(todosUsuarios);
  }

  async function criarUsuario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!perfilAtual || perfilAtual.nivel !== "admin") {
      alert("Acesso restrito a administradores.");
      return;
    }

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      alert("Preencha nome, e-mail e senha.");
      return;
    }

    setSalvando(true);
    setErro("");
    setMensagemSucesso("");

    const { data: sessao } = await supabase.auth.getSession();
    const token = sessao.session?.access_token;

    if (!token) {
      setErro("Sessão expirada. Faça login novamente.");
      setSalvando(false);
      return;
    }

    const resposta = await fetch("/api/admin/criar-usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        nivel: nivelSelecionado,
      }),
    });

    const payload = await resposta.json().catch(() => ({}));

    setSalvando(false);

    if (!resposta.ok) {
      setErro(payload.erro || "Erro ao criar usuário.");
      return;
    }

    setMensagemSucesso("Usuário criado com sucesso.");
    setNome("");
    setEmail("");
    setSenha("");
    setNivelSelecionado("gestor");
    await carregarUsuarios();
  }

  function abrirModalEdicao(usuario: PerfilUsuario) {
    setUsuarioEditando(usuario);
    setEditarNome(usuario.nome || "");
    setEditarEmail(usuario.email || "");
    setEditarNivel(usuario.nivel);
    setEditarAtivo(usuario.ativo);
    setModalEdicaoAberto(true);
  }

  function fecharModalEdicao() {
    setModalEdicaoAberto(false);
    setUsuarioEditando(null);
    setErro("");
  }

  async function salvarEdicaoUsuario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!usuarioEditando) {
      return;
    }

    if (!perfilAtual || perfilAtual.nivel !== "admin") {
      alert("Acesso restrito a administradores.");
      return;
    }

    const nomeTrim = editarNome.trim();
    const emailTrim = editarEmail.trim();

    if (!nomeTrim || !emailTrim) {
      setErro("Nome e e-mail são obrigatórios.");
      return;
    }

    const editandoProprioUsuario =
      usuarioEditando.user_id === perfilAtual.user_id;
    const removendoAcessoAdministrativo =
      editarNivel !== "admin" || !editarAtivo;

    if (
      editandoProprioUsuario &&
      removendoAcessoAdministrativo
    ) {
      setErro(
        "N\u00e3o \u00e9 permitido desativar ou rebaixar o pr\u00f3prio usu\u00e1rio administrador."
      );
      return;
    }

    setSalvandoEdicao(true);
    setErro("");
    setMensagemSucesso("");

    const { data: sessao } = await supabase.auth.getSession();
    const token = sessao.session?.access_token;

    if (!token) {
      setErro("Sessão expirada. Faça login novamente.");
      setSalvandoEdicao(false);
      return;
    }

    const resposta = await fetch("/api/admin/atualizar-usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: usuarioEditando.user_id,
        nome: nomeTrim,
        email: emailTrim,
        nivel: editarNivel,
        ativo: editarAtivo,
      }),
    });

    const payload = await resposta.json().catch(() => ({}));

    setSalvandoEdicao(false);

    if (!resposta.ok) {
      setErro(payload.erro || "Erro ao atualizar usuário.");
      return;
    }

    setMensagemSucesso("Usuário atualizado com sucesso.");
    fecharModalEdicao();
    await carregarUsuarios();
  }

  const podeAdministrar = perfilAtual?.nivel === "admin";

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

          <h1 className="mt-4 text-3xl font-bold">Usuários do sistema</h1>
          <p className="mt-2 text-blue-100">
            Gerencie acessos, níveis e ativação de usuários.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {carregando && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Carregando usuários...
          </div>
        )}

        {!carregando && !podeAdministrar && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            <p className="text-lg font-bold">Acesso restrito a administradores.</p>
            <p className="mt-2 text-sm">
              Você não possui permissão para gerenciar usuários.
            </p>
          </div>
        )}

        {!carregando && podeAdministrar && (
          <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800">Criar novo usuário</h2>
              <p className="mt-1 text-sm text-slate-600">
                Cadastre um novo usuário com nível de acesso definido.
              </p>

              <form onSubmit={criarUsuario} className="mt-5 space-y-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Nome</label>
                  <input
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                    placeholder="Ex: Maria Silva"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                    placeholder="exemplo@empresa.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Senha</label>
                  <input
                    type="password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Nível</label>
                  <select
                    value={nivelSelecionado}
                    onChange={(event) => setNivelSelecionado(event.target.value as NivelUsuario)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                  >
                    {niveisUsuario.map((nivel) => (
                      <option key={nivel} value={nivel}>
                        {nivel}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={salvando}
                  className="w-full rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {salvando ? "Criando..." : "Criar usuário"}
                </button>
              </form>

              {erro && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                  {erro}
                </div>
              )}

              {mensagemSucesso && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                  {mensagemSucesso}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Usuários cadastrados</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Atualize o nível ou atividade dos acessos existentes.
                  </p>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Usuário</th>
                      <th className="px-4 py-3">E-mail</th>
                      <th className="px-4 py-3">Nível</th>
                      <th className="px-4 py-3">Ativo</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {usuario.nome || "Sem nome"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{usuario.email || "---"}</td>
                        <td className="px-4 py-3 text-slate-700">{usuario.nivel}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              usuario.ativo
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {usuario.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => abrirModalEdicao(usuario)}
                            className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}

                    {usuarios.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                          Nenhum usuário cadastrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {modalEdicaoAberto && usuarioEditando && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase text-blue-700">Editar usuário</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-800">{usuarioEditando.nome || "Usuário"}</h2>
                </div>

                <button
                  type="button"
                  onClick={fecharModalEdicao}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Fechar
                </button>
              </div>

              <form onSubmit={salvarEdicaoUsuario} className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Nome</label>
                  <input
                    value={editarNome}
                    onChange={(event) => setEditarNome(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">E-mail</label>
                  <input
                    type="email"
                    value={editarEmail}
                    onChange={(event) => setEditarEmail(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Nível</label>
                  <select
                    value={editarNivel}
                    onChange={(event) => setEditarNivel(event.target.value as NivelUsuario)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
                  >
                    {niveisUsuario.map((nivel) => (
                      <option key={nivel} value={nivel}>
                        {nivel}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editarAtivo}
                    onChange={(event) => setEditarAtivo(event.target.checked)}
                    className="h-4 w-4"
                  />
                  Usuário ativo
                </label>

                {erro && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                    {erro}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={fecharModalEdicao}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={salvandoEdicao}
                    className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {salvandoEdicao ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
