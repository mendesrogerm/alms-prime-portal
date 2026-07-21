import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const niveisPermitidos = new Set(["admin", "gestor", "usuario"]);

export async function POST(request: Request) {
  try {
    const corpo = await request.json();

    const userId =
      typeof corpo?.user_id === "string"
        ? corpo.user_id.trim()
        : "";
    const nome =
      typeof corpo?.nome === "string" ? corpo.nome.trim() : "";
    const email =
      typeof corpo?.email === "string" ? corpo.email.trim() : "";
    const nivelNormalizado =
      typeof corpo?.nivel === "string"
        ? corpo.nivel.trim().toLowerCase()
        : "";
    const ativo = corpo?.ativo;

    if (!userId) {
      return NextResponse.json(
        { erro: "user_id inválido." },
        { status: 400 }
      );
    }

    if (!nome) {
      return NextResponse.json(
        { erro: "Nome inválido." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { erro: "E-mail inválido." },
        { status: 400 }
      );
    }

    if (!niveisPermitidos.has(nivelNormalizado)) {
      return NextResponse.json(
        { erro: "Nível inválido." },
        { status: 400 }
      );
    }

    if (typeof ativo !== "boolean") {
      return NextResponse.json(
        { erro: "Ativo inválido." },
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
            "Configuração do Supabase ausente para atualizar usuário.",
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
      data: perfilAlvo,
      error: erroPerfilAlvo,
    } = await supabaseAdmin
      .from("perfis_usuarios")
      .select(
        "id,user_id,email,nome,nivel,ativo,created_at,updated_at"
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (erroPerfilAlvo) {
      return NextResponse.json(
        { erro: "Erro ao consultar o usuário que será atualizado." },
        { status: 500 }
      );
    }

    if (!perfilAlvo) {
      return NextResponse.json(
        { erro: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const removendoAcessoAdministrativo =
      nivelNormalizado !== "admin" || ativo !== true;

    if (
      userId === userAuthData.user.id &&
      perfilAlvo.nivel === "admin" &&
      removendoAcessoAdministrativo
    ) {
      return NextResponse.json(
        {
          erro:
            "Não é permitido desativar ou rebaixar o próprio usuário administrador.",
        },
        { status: 409 }
      );
    }

    const removendoAdminAtivo =
      perfilAlvo.nivel === "admin" &&
      perfilAlvo.ativo === true &&
      removendoAcessoAdministrativo;

    if (removendoAdminAtivo) {
      const {
        count: quantidadeOutrosAdmins,
        error: erroContagemAdmins,
      } = await supabaseAdmin
        .from("perfis_usuarios")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("nivel", "admin")
        .eq("ativo", true)
        .neq("user_id", userId);

      if (erroContagemAdmins) {
        return NextResponse.json(
          {
            erro:
              "Erro ao validar a quantidade de administradores ativos.",
          },
          { status: 500 }
        );
      }

      if ((quantidadeOutrosAdmins ?? 0) === 0) {
        return NextResponse.json(
          {
            erro:
              "Não é permitido remover o último administrador ativo do sistema.",
          },
          { status: 409 }
        );
      }
    }

    const {
      data: usuarioAuthAtual,
      error: erroConsultaAuth,
    } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (erroConsultaAuth || !usuarioAuthAtual.user) {
      return NextResponse.json(
        {
          erro:
            erroConsultaAuth?.message ||
            "Usuário não encontrado no Supabase Auth.",
        },
        { status: 404 }
      );
    }

    const dadosAnterioresPerfil = {
      nome: perfilAlvo.nome,
      email: perfilAlvo.email,
      nivel: perfilAlvo.nivel,
      ativo: perfilAlvo.ativo,
      updated_at: perfilAlvo.updated_at,
    };

    const {
      data: perfilAtualizado,
      error: erroAtualizacaoPerfil,
    } = await supabaseAdmin
      .from("perfis_usuarios")
      .update({
        nome,
        email,
        nivel: nivelNormalizado,
        ativo,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select(
        "id,user_id,email,nome,nivel,ativo,created_at,updated_at"
      )
      .single();

    if (erroAtualizacaoPerfil) {
      return NextResponse.json(
        {
          erro:
            "Erro ao atualizar perfil do usuário: " +
            erroAtualizacaoPerfil.message,
        },
        { status: 500 }
      );
    }

    const emailAuthAnterior =
      usuarioAuthAtual.user.email ?? perfilAlvo.email ?? "";

    if (emailAuthAnterior !== email) {
      const {
        error: erroAtualizacaoAuth,
      } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { email }
      );

      if (erroAtualizacaoAuth) {
        const {
          error: erroRestauracaoPerfil,
        } = await supabaseAdmin
          .from("perfis_usuarios")
          .update(dadosAnterioresPerfil)
          .eq("user_id", userId)
          .select("id")
          .single();

        if (erroRestauracaoPerfil) {
          return NextResponse.json(
            {
              erro:
                "O perfil foi atualizado, mas o e-mail não pôde ser atualizado no Supabase Auth e a restauração do perfil também falhou. Será necessária correção manual. " +
                `Auth: ${erroAtualizacaoAuth.message}. ` +
                `Restauração: ${erroRestauracaoPerfil.message}.`,
            },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            erro:
              "O e-mail não pôde ser atualizado no Supabase Auth. As alterações do perfil foram revertidas automaticamente. " +
              erroAtualizacaoAuth.message,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      usuario: perfilAtualizado,
    });
  } catch {
    return NextResponse.json(
      {
        erro: "Erro inesperado ao atualizar usuário.",
      },
      { status: 500 }
    );
  }
}
