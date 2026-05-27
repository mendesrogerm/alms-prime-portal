"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type LinhaCsv = {
  bairro: string;
  setor: string;
};

type BairroSetor = {
  id?: string | number;
  bairro: string | null;
  bairro_normalizado: string;
  setor: string | null;
};

type ProcessoDivergente = {
  id: string;
  sisgep: string;
  bairro: string | null;
  setor_atual: string | null;
  setor_correto: string;
};

export default function ImportarBairrosSetoresPage() {
  const [arquivoNome, setArquivoNome] = useState("");
  const [linhasCsv, setLinhasCsv] = useState<LinhaCsv[]>([]);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [importando, setImportando] = useState(false);
  const [carregandoTabela, setCarregandoTabela] = useState(false);
  const [bairrosCadastrados, setBairrosCadastrados] = useState<BairroSetor[]>([]);
  const [busca, setBusca] = useState("");
  const [divergencias, setDivergencias] = useState<ProcessoDivergente[]>([]);
  const [verificando, setVerificando] = useState(false);
  const [corrigindo, setCorrigindo] = useState(false);

  useEffect(() => {
    carregarBairrosSetores();
  }, []);

  const linhasValidas = useMemo(() => {
    return linhasCsv.filter(
      (linha) => linha.bairro.trim() !== "" && linha.setor.trim() !== ""
    );
  }, [linhasCsv]);

  const bairrosFiltrados = useMemo(() => {
    const termo = normalizarTexto(busca);

    if (!termo) return bairrosCadastrados;

    return bairrosCadastrados.filter((item) => {
      return [item.bairro, item.bairro_normalizado, item.setor]
        .join(" ")
        .toLowerCase()
        .includes(termo);
    });
  }, [bairrosCadastrados, busca]);

  function normalizarTexto(texto: string | null | undefined) {
    return String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  function detectarSeparador(cabecalho: string) {
    const virgulas = (cabecalho.match(/,/g) || []).length;
    const pontoVirgulas = (cabecalho.match(/;/g) || []).length;

    return pontoVirgulas > virgulas ? ";" : ",";
  }

  function dividirLinhaCsv(linha: string, separador: string) {
    const valores: string[] = [];
    let valorAtual = "";
    let dentroDeAspas = false;

    for (let i = 0; i < linha.length; i += 1) {
      const caractere = linha[i];
      const proximo = linha[i + 1];

      if (caractere === '"' && dentroDeAspas && proximo === '"') {
        valorAtual += '"';
        i += 1;
        continue;
      }

      if (caractere === '"') {
        dentroDeAspas = !dentroDeAspas;
        continue;
      }

      if (caractere === separador && !dentroDeAspas) {
        valores.push(valorAtual.trim());
        valorAtual = "";
        continue;
      }

      valorAtual += caractere;
    }

    valores.push(valorAtual.trim());
    return valores;
  }

  function lerCsv(conteudo: string) {
    const textoSemBom = conteudo.replace(/^\uFEFF/, "");
    const linhas = textoSemBom
      .split(/\r?\n/)
      .map((linha) => linha.trim())
      .filter((linha) => linha !== "");

    if (linhas.length < 2) {
      throw new Error("O CSV precisa ter cabeçalho e pelo menos uma linha de dados.");
    }

    const separador = detectarSeparador(linhas[0]);
    const cabecalhos = dividirLinhaCsv(linhas[0], separador).map((coluna) =>
      normalizarTexto(coluna)
    );

    const indiceBairro = cabecalhos.findIndex((coluna) =>
      ["bairro", "bairros"].includes(coluna)
    );
    const indiceSetor = cabecalhos.findIndex((coluna) => coluna === "setor");

    if (indiceBairro < 0 || indiceSetor < 0) {
      throw new Error(
        'O CSV precisa ter as colunas "bairro" e "setor". Também aceito "bairros".'
      );
    }

    return linhas.slice(1).map((linha) => {
      const colunas = dividirLinhaCsv(linha, separador);

      return {
        bairro: colunas[indiceBairro] || "",
        setor: colunas[indiceSetor] || "",
      };
    });
  }

  async function selecionarArquivo(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];

    setErro("");
    setMensagem("");
    setLinhasCsv([]);
    setArquivoNome("");
    setDivergencias([]);

    if (!arquivo) return;

    setArquivoNome(arquivo.name);

    try {
      const conteudo = await arquivo.text();
      const linhas = lerCsv(conteudo);
      setLinhasCsv(linhas);
      setMensagem(`${linhas.length} linha(s) lida(s) do arquivo.`);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao ler o CSV.");
    } finally {
      event.currentTarget.value = "";
    }
  }

  async function carregarBairrosSetores() {
    setCarregandoTabela(true);

    const { data, error } = await supabase
      .from("bairros_setores")
      .select("*")
      .order("bairro", { ascending: true });

    setCarregandoTabela(false);

    if (error) {
      setErro("Erro ao carregar bairros e setores: " + error.message);
      return;
    }

    setBairrosCadastrados((data || []) as BairroSetor[]);
  }

  async function importarBairrosSetores() {
    if (linhasValidas.length === 0) {
      alert("Nenhuma linha válida para importar.");
      return;
    }

    const confirmar = window.confirm(
      `Deseja importar/atualizar ${linhasValidas.length} bairro(s) e setor(es)?`
    );

    if (!confirmar) return;

    setImportando(true);
    setErro("");
    setMensagem("");

    const registros = linhasValidas.map((linha) => ({
      bairro: linha.bairro.trim(),
      bairro_normalizado: normalizarTexto(linha.bairro),
      setor: linha.setor.trim(),
    }));

    const registrosUnicos = Array.from(
      new Map(registros.map((item) => [item.bairro_normalizado, item])).values()
    );

    const tamanhoLote = 200;

    for (let i = 0; i < registrosUnicos.length; i += tamanhoLote) {
      const lote = registrosUnicos.slice(i, i + tamanhoLote);

      const { error } = await supabase
        .from("bairros_setores")
        .upsert(lote, {
          onConflict: "bairro_normalizado",
        });

      if (error) {
        setImportando(false);
        setErro("Erro ao importar bairros e setores: " + error.message);
        return;
      }
    }

    setImportando(false);
    setMensagem(`${registrosUnicos.length} bairro(s) importado(s)/atualizado(s).`);
    setLinhasCsv([]);
    setArquivoNome("");
    await carregarBairrosSetores();
  }

  async function verificarSetoresDosProcessos() {
    setVerificando(true);
    setErro("");
    setMensagem("");
    setDivergencias([]);

    const { data: bairros, error: erroBairros } = await supabase
      .from("bairros_setores")
      .select("bairro,bairro_normalizado,setor");

    if (erroBairros) {
      setVerificando(false);
      setErro("Erro ao consultar bairros e setores: " + erroBairros.message);
      return;
    }

    const mapaSetores = new Map<string, string>();

    (bairros || []).forEach((item) => {
      const chave = item.bairro_normalizado || normalizarTexto(item.bairro);
      const setor = item.setor || "";

      if (chave && setor) {
        mapaSetores.set(chave, setor);
      }
    });

    const { data: processos, error: erroProcessos } = await supabase
      .from("processos")
      .select("id,sisgep,bairro,setor")
      .not("bairro", "is", null);

    setVerificando(false);

    if (erroProcessos) {
      setErro("Erro ao consultar processos: " + erroProcessos.message);
      return;
    }

    const divergentes = (processos || [])
      .map((processo) => {
        const chave = normalizarTexto(processo.bairro);
        const setorCorreto = mapaSetores.get(chave);

        if (!setorCorreto) return null;

        const setorAtual = processo.setor || "";

        if (setorAtual.trim() === setorCorreto.trim()) return null;

        return {
          id: processo.id,
          sisgep: processo.sisgep,
          bairro: processo.bairro,
          setor_atual: processo.setor,
          setor_correto: setorCorreto,
        };
      })
      .filter((item): item is ProcessoDivergente => Boolean(item));

    setDivergencias(divergentes);
    setMensagem(`${divergentes.length} processo(s) com setor divergente encontrado(s).`);
  }

  async function corrigirSetoresDosProcessos() {
    if (divergencias.length === 0) {
      alert("Nenhum processo divergente para corrigir.");
      return;
    }

    const confirmar = window.confirm(
      `Deseja corrigir o setor de ${divergencias.length} processo(s)?`
    );

    if (!confirmar) return;

    setCorrigindo(true);
    setErro("");
    setMensagem("");

    const tamanhoLote = 25;
    let corrigidos = 0;

    for (let i = 0; i < divergencias.length; i += tamanhoLote) {
      const lote = divergencias.slice(i, i + tamanhoLote);

      const resultados = await Promise.all(
        lote.map((processo) =>
          supabase
            .from("processos")
            .update({
              setor: processo.setor_correto,
              updated_at: new Date().toISOString(),
            })
            .eq("id", processo.id)
        )
      );

      const erro = resultados.find((resultado) => resultado.error);

      if (erro?.error) {
        setCorrigindo(false);
        setErro("Erro ao corrigir setores: " + erro.error.message);
        return;
      }

      corrigidos += lote.length;
    }

    setCorrigindo(false);
    setDivergencias([]);
    setMensagem(`${corrigidos} processo(s) corrigido(s) com sucesso.`);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-blue-900 px-6 py-6 text-white">
        <div className="mx-auto max-w-[1400px]">
          <Link
            href="/fiscalizacao/configuracoes"
            className="text-sm font-semibold text-blue-200 hover:text-white"
          >
            ← Voltar para configurações
          </Link>

          <h1 className="mt-4 text-3xl font-bold">Importar bairros e setores</h1>

          <p className="mt-2 text-blue-100">
            Atualize a tabela oficial de bairros e corrija setores divergentes nos processos já cadastrados.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-6 py-8">
        {erro && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 font-semibold text-green-700">
            {mensagem}
          </div>
        )}

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">1. Importar CSV</h2>
            <p className="mt-2 text-sm text-slate-600">
              O arquivo precisa estar em UTF-8 e conter as colunas <b>bairro</b> e <b>setor</b>.
            </p>

            <label className="mt-5 block cursor-pointer rounded-xl border border-dashed border-blue-300 bg-blue-50 px-4 py-8 text-center font-bold text-blue-800 hover:bg-blue-100">
              Selecionar CSV de bairros e setores
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={selecionarArquivo}
              />
            </label>

            {arquivoNome && (
              <p className="mt-3 text-sm font-semibold text-slate-700">
                Arquivo: {arquivoNome}
              </p>
            )}

            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-bold text-slate-800">Modelo aceito:</p>
              <pre className="mt-2 overflow-auto rounded-lg bg-white p-3 text-xs">
{`bairro,setor
Chácara do Solar II (Fazendinha),1 - FAZENDINHA
Chácara Estela,3 - CENTRO`}
              </pre>
            </div>

            <button
              onClick={importarBairrosSetores}
              disabled={importando || linhasValidas.length === 0}
              className="mt-5 w-full rounded-lg bg-blue-800 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {importando
                ? "Importando..."
                : `Importar ${linhasValidas.length} linha(s) válida(s)`}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">2. Corrigir processos</h2>
            <p className="mt-2 text-sm text-slate-600">
              Compare o setor atual dos processos com a tabela de bairros e corrija automaticamente.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                onClick={verificarSetoresDosProcessos}
                disabled={verificando}
                className="rounded-lg bg-slate-800 px-4 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {verificando ? "Verificando..." : "Verificar divergências"}
              </button>

              <button
                onClick={corrigirSetoresDosProcessos}
                disabled={corrigindo || divergencias.length === 0}
                className="rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {corrigindo ? "Corrigindo..." : "Corrigir setores"}
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">
                Processos divergentes
              </p>
              <p className="mt-2 text-3xl font-black text-slate-800">
                {divergencias.length}
              </p>
            </div>
          </div>
        </div>

        {linhasCsv.length > 0 && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">Prévia do CSV</h2>
            <p className="mt-2 text-sm text-slate-600">
              Mostrando as primeiras 20 linhas. Linhas sem bairro ou setor serão ignoradas.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="border border-slate-200 px-3 py-2">Bairro</th>
                    <th className="border border-slate-200 px-3 py-2">Setor</th>
                    <th className="border border-slate-200 px-3 py-2">Normalizado</th>
                  </tr>
                </thead>
                <tbody>
                  {linhasCsv.slice(0, 20).map((linha, index) => (
                    <tr key={`${linha.bairro}-${index}`}>
                      <td className="border border-slate-200 px-3 py-2">
                        {linha.bairro || "---"}
                      </td>
                      <td className="border border-slate-200 px-3 py-2">
                        {linha.setor || "---"}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-500">
                        {normalizarTexto(linha.bairro) || "---"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {divergencias.length > 0 && (
          <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-yellow-800">
              Prévia dos processos que serão corrigidos
            </h2>

            <div className="mt-4 max-h-[420px] overflow-auto rounded-xl bg-white">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="sticky top-0 bg-yellow-100 text-xs uppercase text-yellow-800">
                  <tr>
                    <th className="border border-yellow-200 px-3 py-2">SisGep</th>
                    <th className="border border-yellow-200 px-3 py-2">Bairro</th>
                    <th className="border border-yellow-200 px-3 py-2">Setor atual</th>
                    <th className="border border-yellow-200 px-3 py-2">Setor correto</th>
                  </tr>
                </thead>
                <tbody>
                  {divergencias.map((processo) => (
                    <tr key={processo.id}>
                      <td className="border border-yellow-100 px-3 py-2 font-bold">
                        {processo.sisgep}
                      </td>
                      <td className="border border-yellow-100 px-3 py-2">
                        {processo.bairro || "---"}
                      </td>
                      <td className="border border-yellow-100 px-3 py-2 text-red-700">
                        {processo.setor_atual || "---"}
                      </td>
                      <td className="border border-yellow-100 px-3 py-2 font-bold text-green-700">
                        {processo.setor_correto}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Bairros cadastrados
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Total: {bairrosCadastrados.length} bairro(s). Exibindo {bairrosFiltrados.length}.
              </p>
            </div>

            <button
              onClick={carregarBairrosSetores}
              disabled={carregandoTabela}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
            >
              {carregandoTabela ? "Atualizando..." : "Atualizar lista"}
            </button>
          </div>

          <input
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar bairro ou setor..."
            className="mt-5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
          />

          <div className="mt-4 max-h-[520px] overflow-auto rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="border-b border-slate-200 px-3 py-2">Bairro</th>
                  <th className="border-b border-slate-200 px-3 py-2">Normalizado</th>
                  <th className="border-b border-slate-200 px-3 py-2">Setor</th>
                </tr>
              </thead>
              <tbody>
                {bairrosFiltrados.map((item) => (
                  <tr key={item.bairro_normalizado}>
                    <td className="border-b border-slate-100 px-3 py-2">
                      {item.bairro || "---"}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 text-slate-500">
                      {item.bairro_normalizado}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 font-bold text-slate-800">
                      {item.setor || "---"}
                    </td>
                  </tr>
                ))}

                {bairrosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-slate-500">
                      Nenhum bairro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
