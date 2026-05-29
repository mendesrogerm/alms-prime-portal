import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const niveisPermitidos = new Set(["admin", "gestor", "usuario"]);

export async function POST(request: Request) {
  try {
    const corpo = await request.json();
    const { user_id, nome, email, nivel, ativo } = corpo ?? {};

    if (typeof user_id !== "string" || !user_id.trim()) {
      return NextResponse.json({ erro: "user_id inválido." }, { status: 400 });
    }

    if (typeof nome !== "string" || !nome.trim()) {
      return NextResponse.json({ erro: "Nome inválido." }, { status: 400 });
    }

    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ erro: "E-mail inválido." }, { status: 400 });
    }

    if (typeof nivel !== "string" || !niveisPermitidos.has(nivel)) {
      return NextResponse.json({ erro: "Nível inválido." }, { status: 400 });
    }

    if (typeof ativo !== "boolean") {
      return NextResponse.json({ erro: "Ativo inválido." }, { status: 400 });
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ erro: "Token de autenticação ausente." }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return NextResponse.json(
        { erro: "Configuração do Supabase ausente para atualizar usuário." },
        { status: 500 }
      );
    }

    const supabaseUsuario = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
      },
    });

    const { data: userAuthData, error: erroAuth } = await supabaseUsuario.auth.getUser();

    if (erroAuth || !userAuthData.user) {
      return NextResponse.json({ erro: "Usuário não autenticado." }, { status: 401 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

    const { data: perfilSolicitante, error: erroPerfilSolicitante } = await supabaseAdmin
      .from("perfis_usuarios")
      .select("*")
      .eq("user_id", userAuthData.user.id)
      .maybeSingle();

    if (erroPerfilSolicitante) {
      return NextResponse.json(
        { erro: "Erro ao validar perfil do administrador." },
        { status: 500 }
      );
    }

    if (!perfilSolicitante || perfilSolicitante.ativo !== true || perfilSolicitante.nivel !== "admin") {
      return NextResponse.json({ erro: "Acesso negado." }, { status: 403 });
    }

    const { error: erroAtualizacaoAuth } = await supabaseAdmin.auth.admin.updateUserById(
      user_id.trim(),
      {
        email: email.trim(),
      }
    );

    if (erroAtualizacaoAuth) {
      return NextResponse.json(
        {
          erro: "Erro ao atualizar usuário no Supabase Auth: " + erroAtualizacaoAuth.message,
        },
        { status: 500 }
      );
    }

    const { data: perfilAtualizado, error: erroAtualizacaoPerfil } = await supabaseAdmin
      .from("perfis_usuarios")
      .update({
        nome: nome.trim(),
        email: email.trim(),
        nivel,
        ativo,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user_id.trim())
      .select()
      .single();

    if (erroAtualizacaoPerfil) {
      return NextResponse.json(
        {
          erro: "Erro ao atualizar perfil do usuário: " + erroAtualizacaoPerfil.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ usuario: perfilAtualizado });
  } catch {
    return NextResponse.json({ erro: "Erro inesperado ao atualizar usuário." }, { status: 500 });
  }
}
