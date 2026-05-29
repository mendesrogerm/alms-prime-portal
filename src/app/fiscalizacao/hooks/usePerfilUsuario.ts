import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { NivelUsuario, PerfilUsuario } from "../types";

export function usePerfilUsuario() {
  const [perfilUsuario, setPerfilUsuario] = useState<PerfilUsuario | null>(null);

  async function carregarPerfilUsuario(userId: string, email?: string | null) {
    const { data: perfilData, error: erroPerfil } = await supabase
      .from("perfis_usuarios")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (erroPerfil) {
      return {
        perfil: null,
        erro: "Erro ao carregar perfil do usuário: " + erroPerfil.message,
      };
    }

    const perfilFinal: PerfilUsuario = perfilData
      ? {
          id: perfilData.id,
          user_id: perfilData.user_id,
          email: perfilData.email ?? email ?? null,
          nome: perfilData.nome ?? email ?? null,
          nivel: (perfilData.nivel as NivelUsuario) || "usuario",
          ativo: perfilData.ativo ?? true,
          created_at: perfilData.created_at,
          updated_at: perfilData.updated_at ?? null,
        }
      : {
          id: userId,
          user_id: userId,
          email: email ?? null,
          nome: email ?? null,
          nivel: "usuario",
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: null,
        };

    setPerfilUsuario(perfilFinal);

    return {
      perfil: perfilFinal,
      erro: "",
    };
  }

  function limparPerfilUsuario() {
    setPerfilUsuario(null);
  }

  const nivelUsuario = perfilUsuario?.nivel || "usuario";
  const podeGerenciarProcessos = ["admin", "gestor"].includes(nivelUsuario);
  const podeExcluirProcessos = nivelUsuario === "admin";
  const podeAdministrarUsuarios = nivelUsuario === "admin";

  return {
    perfilUsuario,
    setPerfilUsuario,
    carregarPerfilUsuario,
    limparPerfilUsuario,
    nivelUsuario,
    podeGerenciarProcessos,
    podeExcluirProcessos,
    podeAdministrarUsuarios,
  };
}
