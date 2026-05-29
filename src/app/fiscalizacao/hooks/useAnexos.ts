import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Anexo, Processo } from "../types";
import { limparNomeArquivo } from "../utils";

interface UseAnexosParams {
  podeGerenciarProcessos: boolean;
  registrarAuditoriaProcesso: (args: {
    processo?: Processo | null;
    acao: string;
    descricao?: string;
    dadosAnteriores?: unknown;
    dadosNovos?: unknown;
  }) => Promise<void>;
}

export function useAnexos({
  podeGerenciarProcessos,
  registrarAuditoriaProcesso,
}: UseAnexosParams) {
  const [anexosPorProcesso, setAnexosPorProcesso] = useState<
    Record<string, Anexo[]>
  >({});
  const [enviandoAnexoProcessoId, setEnviandoAnexoProcessoId] = useState<
    string | null
  >(null);

  async function carregarAnexos(listaProcessos: Processo[]) {
    const ids = listaProcessos
      .map((processo) => processo.id)
      .filter((id): id is string => Boolean(id));

    if (ids.length === 0) {
      setAnexosPorProcesso({});
      return;
    }

    const tamanhoLote = 100;
    const todosAnexos: Anexo[] = [];

    for (let indice = 0; indice < ids.length; indice += tamanhoLote) {
      const loteIds = ids.slice(indice, indice + tamanhoLote);

      const { data, error } = await supabase
        .from("anexos")
        .select("*")
        .in("processo_id", loteIds)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar anexos do lote:", {
          lote: indice / tamanhoLote + 1,
          quantidadeIds: loteIds.length,
          error,
        });

        continue;
      }

      todosAnexos.push(...((data || []) as Anexo[]));
    }

    const agrupados: Record<string, Anexo[]> = {};

    todosAnexos.forEach((anexo) => {
      if (!agrupados[anexo.processo_id]) {
        agrupados[anexo.processo_id] = [];
      }

      agrupados[anexo.processo_id].push(anexo);
    });

    setAnexosPorProcesso(agrupados);
  }

  async function enviarAnexo(processo: Processo, arquivo: File) {
    if (!podeGerenciarProcessos) {
      alert("Acesso restrito para anexar arquivos.");
      return;
    }

    if (!arquivo) return;

    const tamanhoMaximoMb = 10;
    const tamanhoMaximoBytes = tamanhoMaximoMb * 1024 * 1024;

    if (arquivo.size > tamanhoMaximoBytes) {
      alert(`O arquivo deve ter no máximo ${tamanhoMaximoMb} MB.`);
      return;
    }

    setEnviandoAnexoProcessoId(processo.id);

    const nomeSeguro = limparNomeArquivo(arquivo.name);
    const caminhoArquivo = `${processo.id}/${Date.now()}-${nomeSeguro}`;

    const { error: erroUpload } = await supabase.storage
      .from("anexos-processos")
      .upload(caminhoArquivo, arquivo, {
        cacheControl: "3600",
        upsert: false,
      });

    if (erroUpload) {
      setEnviandoAnexoProcessoId(null);
      alert("Erro ao enviar anexo: " + erroUpload.message);
      return;
    }

    const { data, error: erroBanco } = await supabase
      .from("anexos")
      .insert({
        processo_id: processo.id,
        processo_sisgep: processo.sisgep,
        nome_arquivo: arquivo.name,
        url: caminhoArquivo,
        mime_type: arquivo.type || null,
        tamanho_bytes: arquivo.size,
      })
      .select()
      .single();

    setEnviandoAnexoProcessoId(null);

    if (erroBanco) {
      alert("Arquivo enviado, mas erro ao salvar vínculo: " + erroBanco.message);
      return;
    }

    if (data) {
      setAnexosPorProcesso((atual) => ({
        ...atual,
        [processo.id]: [data, ...(atual[processo.id] || [])],
      }));

      void registrarAuditoriaProcesso({
        processo,
        acao: "anexo_enviado",
        descricao: `Anexo enviado no processo ${processo.sisgep}.`,
        dadosNovos: data,
      });
    }
  }

  async function excluirAnexo(processoOuAnexo: Processo | Anexo, anexoOpcional?: Anexo) {
    const anexo = anexoOpcional ?? (processoOuAnexo as Anexo);
    const processo = anexoOpcional
      ? (processoOuAnexo as Processo)
      : ({
          id: anexo.processo_id,
          sisgep: anexo.processo_sisgep || "",
        } as Processo);

    if (!podeGerenciarProcessos) {
      alert("Acesso restrito para excluir anexos.");
      return;
    }

    const confirmar = window.confirm(
      `Deseja excluir o anexo "${anexo.nome_arquivo || "arquivo"}"?`
    );

    if (!confirmar) return;

    const { error: erroStorage } = await supabase.storage
      .from("anexos-processos")
      .remove([anexo.url]);

    if (erroStorage) {
      alert("Erro ao excluir arquivo: " + erroStorage.message);
      return;
    }

    const { error: erroBanco } = await supabase
      .from("anexos")
      .delete()
      .eq("id", anexo.id);

    if (erroBanco) {
      alert(
        "Arquivo excluído, mas erro ao remover registro: " + erroBanco.message
      );
      return;
    }

    setAnexosPorProcesso((atual) => {
      const listaAtual = atual[anexo.processo_id] || [];

      return {
        ...atual,
        [anexo.processo_id]: listaAtual.filter((item) => item.id !== anexo.id),
      };
    });

    void registrarAuditoriaProcesso({
      processo,
      acao: "anexo_excluido",
      descricao: `Anexo excluído do processo ${processo.sisgep}.`,
      dadosAnteriores: anexo,
    });
  }

  return {
    anexosPorProcesso,
    setAnexosPorProcesso,
    enviandoAnexoProcessoId,
    carregarAnexos,
    enviarAnexo,
    excluirAnexo,
  };
}
