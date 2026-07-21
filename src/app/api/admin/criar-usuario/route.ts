import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const niveisPermitidos = new Set(["admin", "gestor", "usuario"]);

export async function POST(request: Request) {
  try {
    const corpo = await request.json();

    const nome =
      typeof corpo?.nome === "string" ? corpo.nome.trim() : "";
    const email =
      typeof corpo?.email === "string" ? corpo.email.trim() : "";
    const senha =
      typeof corpo?.senha === "string" ? corpo.senha : "";
    const nivelNormalizado =
      typeof corpo?.nivel === "string"
        ? corpo.nivel.trim().toLowerCase()
        : "";

    if (!nome || !email || !senha || !nivelNormalizado) {
      return NextResponse.json(
        { erro: "Nome, e-mail, senha e nível são obrigatórios." },
        { status: 400 }
      );
    }

    if (!niveisPermitidos.has(nivelNormalizado)) {
      return NextResponse.json(
        { erro: "Nível inválido." },
        { status: 400 }
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { erro: "A senha deve ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { erro: "Token de autenticação ausente." },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      return NextResponse.json(
        { erro: "Token de autenticação inválido." },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return NextResponse.json(
        {
          erro:
            "Configuração do Supabase ausente para criação de usuário.",
        },
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
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    const {
      data: userAuthData,
      error: erroAuth,
    } = await supabaseUsuario.auth.getUser();

    if (erroAuth || !userAuthData.user) {
      return NextResponse.json(
        { erro: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );

    const {
      data: perfilSolicitante,
      error: erroPerfilSolicitante,
    } = await supabaseAdmin
      .from("perfis_usuarios")
      .select("user_id,nivel,ativo")
      .eq("user_id", userAuthData.user.id)
      .maybeSingle();

    if (erroPerfilSolicitante) {
      return NextResponse.json(
        { erro: "Erro ao validar perfil do administrador." },
        { status: 500 }
      );
    }

    if (
      !perfilSolicitante ||
      perfilSolicitante.ativo !== true ||
      perfilSolicitante.nivel !== "admin"
    ) {
      return NextResponse.json(
        { erro: "Acesso negado." },
        { status: 403 }
      );
    }

    const {
      data: usuarioCriado,
      error: erroCriacao,
    } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });

    if (erroCriacao || !usuarioCriado.user) {
      return NextResponse.json(
        {
          erro:
            erroCriacao?.message ||
            "Erro ao criar usuário no Supabase.",
        },
        { status: 500 }
      );
    }

    const {
      data: perfilCriado,
      error: erroInsercaoPerfil,
    } = await supabaseAdmin
      .from("perfis_usuarios")
      .insert({
        user_id: usuarioCriado.user.id,
        email,
        nome,
        nivel: nivelNormalizado,
        ativo: true,
      })
      .select(
        "id,user_id,email,nome,nivel,ativo,created_at,updated_at"
      )
      .single();

    if (erroInsercaoPerfil) {
      const {
        error: erroExclusaoCompensatoria,
      } = await supabaseAdmin.auth.admin.deleteUser(
        usuarioCriado.user.id
      );

      if (erroExclusaoCompensatoria) {
        return NextResponse.json(
          {
            erro:
              "O usuário foi criado no Supabase Auth, mas o perfil não pôde ser salvo e a exclusão compensatória também falhou. Será necessária correção manual. " +
              `Perfil: ${erroInsercaoPerfil.message}. ` +
              `Auth: ${erroExclusaoCompensatoria.message}.`,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          erro:
            "Erro ao criar perfil do usuário. A criação no Supabase Auth foi revertida automaticamente. " +
            erroInsercaoPerfil.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      usuario: perfilCriado,
    });
  } catch {
    return NextResponse.json(
      {
        erro: "Erro inesperado ao criar usuário.",
      },
      { status: 500 }
    );
  }
}
