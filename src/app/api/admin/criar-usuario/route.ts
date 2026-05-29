import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const niveisPermitidos = new Set(["admin", "gestor", "usuario"]);

export async function POST(request: Request) {
  try {
    const corpo = await request.json();
    const { nome, email, senha, nivel } = corpo ?? {};

    if (!nome || !email || !senha || !nivel) {
      return NextResponse.json(
        { erro: "Nome, e-mail, senha e nível são obrigatórios." },
        { status: 400 }
      );
    }

    const nivelNormalizado = String(nivel).toLowerCase();

    if (!niveisPermitidos.has(nivelNormalizado)) {
      return NextResponse.json({ erro: "Nível inválido." }, { status: 400 });
    }

    if (typeof senha !== "string" || senha.length < 6) {
      return NextResponse.json(
        { erro: "A senha deve ter no mínimo 6 caracteres." },
        { status: 400 }
      );
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
        { erro: "Configuração do Supabase ausente para criação de usuário." },
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
      return NextResponse.json(
        { erro: "Usuário não autenticado." },
        { status: 401 }
      );
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

    const { data: usuarioCriado, error: erroCriacao } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });

    if (erroCriacao || !usuarioCriado.user) {
      return NextResponse.json(
        {
          erro: erroCriacao?.message || "Erro ao criar usuário no Supabase.",
        },
        { status: 500 }
      );
    }

    const { error: erroInsercaoPerfil } = await supabaseAdmin.from("perfis_usuarios").insert({
      user_id: usuarioCriado.user.id,
      email,
      nome,
      nivel: nivelNormalizado,
      ativo: true,
    });

    if (erroInsercaoPerfil) {
      await supabaseAdmin.auth.admin.deleteUser(usuarioCriado.user.id);
      return NextResponse.json(
        { erro: "Erro ao criar perfil do usuário: " + erroInsercaoPerfil.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      usuario: {
        id: usuarioCriado.user.id,
        email,
        nome,
        nivel: nivelNormalizado,
      },
    });
  } catch (erro) {
    return NextResponse.json(
      {
        erro: "Erro inesperado ao criar usuário.",
      },
      { status: 500 }
    );
  }
}
