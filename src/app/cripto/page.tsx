"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  calcularPortfolio,
  formatarMoedaBRL,
  formatarNumeroCripto,
  type AtivoCripto,
  type PrecosPorSimbolo,
  type TransacaoCripto,
} from "@/lib/cripto/calcularPortfolio";

type FormTransacao = {
  ativo_id: string;
  tipo: "COMPRA" | "VENDA";
  quantidade: string;
  valor_total_brl: string;
};

const ativosIniciais = [
  { simbolo: "BTC", nome: "Bitcoin" },
  { simbolo: "ETH", nome: "Ethereum" },
  { simbolo: "SOL", nome: "Solana" },
  { simbolo: "BNB", nome: "BNB" },
  { simbolo: "ADA", nome: "Cardano" },
];
const ferramentasCripto = [
  {
    icone: "📰",
    titulo: "Notícias do Mercado",
    descricao:
      "Acompanhe notícias recentes sobre Bitcoin, Ethereum, blockchain e mercado cripto.",
    href: "/cripto/noticias",
    cor: "cyan",
  },
  {
    icone: "🌡️",
    titulo: "Sentimento do Mercado",
    descricao:
      "Veja o Fear & Greed Index, classificação emocional do mercado e leitura estratégica.",
    href: "/cripto/sentimento",
    cor: "purple",
  },
  {
    icone: "📊",
    titulo: "Gráficos da Carteira",
    descricao:
      "Analise composição da carteira, valor por ativo, lucro/prejuízo e desempenho.",
    href: "/cripto/graficos",
    cor: "emerald",
  },
  {
    icone: "⚙️",
    titulo: "Configurações",
    descricao:
      "Gerencie ativos cadastrados, status ativo/inativo e dados operacionais do Cripto.",
    href: "/cripto/configuracoes",
    cor: "slate",
  },
];

export default function CriptoPage() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  const [ativos, setAtivos] = useState<AtivoCripto[]>([]);
  const [transacoes, setTransacoes] = useState<TransacaoCripto[]>([]);
  const [precos, setPrecos] = useState<PrecosPorSimbolo>({});

  const [form, setForm] = useState<FormTransacao>({
    ativo_id: "",
    tipo: "COMPRA",
    quantidade: "",
    valor_total_brl: "",
  });

  const [simboloNovo, setSimboloNovo] = useState("");
  const [nomeNovo, setNomeNovo] = useState("");
  const [projecao, setProjecao] = useState(20);

  useEffect(() => {
    verificarLoginECarregar();
  }, []);

  async function verificarLoginECarregar() {
    setCarregando(true);
    setErro("");

    const { data: sessao } = await supabase.auth.getSession();

    if (!sessao.session?.user) {
      router.push("/login");
      return;
    }

    setUsuarioId(sessao.session.user.id);

    await garantirAtivosIniciais();
    await carregarDados(sessao.session.user.id);
    setCarregando(false);
  }

  async function garantirAtivosIniciais() {
    const { data } = await supabase.from("cripto_ativos").select("simbolo");

    const simbolosExistentes = new Set((data || []).map((item) => item.simbolo));

    const faltantes = ativosIniciais.filter(
      (ativo) => !simbolosExistentes.has(ativo.simbolo)
    );

    if (faltantes.length > 0) {
      await supabase.from("cripto_ativos").insert(faltantes);
    }
  }

  async function carregarDados(idUsuario: string) {
    const { data: ativosData, error: ativosError } = await supabase
      .from("cripto_ativos")
      .select("*")
      .eq("ativo", true)
      .order("simbolo");

    if (ativosError) {
      setErro("Erro ao carregar ativos: " + ativosError.message);
      return;
    }

    const ativosCarregados = (ativosData || []) as AtivoCripto[];
    setAtivos(ativosCarregados);

    const { data: transacoesData, error: transacoesError } = await supabase
      .from("cripto_transacoes")
      .select("*")
      .eq("user_id", idUsuario)
      .order("created_at", { ascending: false });

    if (transacoesError) {
      setErro("Erro ao carregar transações: " + transacoesError.message);
      return;
    }

    setTransacoes((transacoesData || []) as TransacaoCripto[]);
    await carregarPrecos(ativosCarregados);
  }

  async function carregarPrecos(listaAtivos: AtivoCripto[]) {
    const resultado: PrecosPorSimbolo = {};

    await Promise.all(
      listaAtivos.map(async (ativo) => {
        resultado[ativo.simbolo] = await buscarPrecoBRL(ativo.simbolo);
      })
    );

    setPrecos(resultado);
  }

  async function buscarPrecoBRL(simbolo: string) {
    try {
      const respostaBRL = await fetch(
        `https://data-api.binance.vision/api/v3/ticker/price?symbol=${simbolo}BRL`
      );

      if (respostaBRL.ok) {
        const dados = await respostaBRL.json();
        return Number(dados.price || 0);
      }

      const [respostaUSDT, respostaDolar] = await Promise.all([
        fetch(
          `https://data-api.binance.vision/api/v3/ticker/price?symbol=${simbolo}USDT`
        ),
        fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL"),
      ]);

      if (!respostaUSDT.ok || !respostaDolar.ok) {
        return 0;
      }

      const dadosUSDT = await respostaUSDT.json();
      const dadosDolar = await respostaDolar.json();

      return Number(dadosUSDT.price || 0) * Number(dadosDolar.USDBRL.bid || 0);
    } catch {
      return 0;
    }
  }

  const portfolio = useMemo(
    () => calcularPortfolio(transacoes, ativos, precos),
    [transacoes, ativos, precos]
  );

  const ativoSelecionado = ativos.find((ativo) => ativo.id === form.ativo_id);
  const precoSelecionado = ativoSelecionado
    ? precos[ativoSelecionado.simbolo] || 0
    : 0;
  const valorAtualSimulado = ativoSelecionado
    ? precoSelecionado * (1 + projecao / 100)
    : 0;

  function atualizarForm(campo: keyof FormTransacao, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function salvarTransacao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!usuarioId) {
      router.push("/login");
      return;
    }

    const quantidade = Number(form.quantidade.replace(",", "."));
    const valorTotal = Number(form.valor_total_brl.replace(",", "."));

    if (!form.ativo_id || quantidade <= 0 || valorTotal <= 0) {
      alert("Informe ativo, quantidade e valor total maiores que zero.");
      return;
    }

    const precoUnitario = valorTotal / quantidade;

    setSalvando(true);

    const { error } = await supabase.from("cripto_transacoes").insert({
      user_id: usuarioId,
      ativo_id: form.ativo_id,
      tipo: form.tipo,
      quantidade,
      preco_unitario: precoUnitario,
      moeda_preco: "BRL",
    });

    setSalvando(false);

    if (error) {
      alert("Erro ao salvar transação: " + error.message);
      return;
    }

    setForm({
      ativo_id: form.ativo_id,
      tipo: "COMPRA",
      quantidade: "",
      valor_total_brl: "",
    });

    await carregarDados(usuarioId);
  }

  async function excluirTransacao(id: string) {
    if (!confirm("Deseja excluir esta transação?")) return;

    const { error } = await supabase
      .from("cripto_transacoes")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir: " + error.message);
      return;
    }

    if (usuarioId) {
      await carregarDados(usuarioId);
    }
  }

  async function cadastrarAtivo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const simbolo = simboloNovo.trim().toUpperCase();
    const nome = nomeNovo.trim();

    if (!simbolo || !nome) {
      alert("Informe símbolo e nome do ativo.");
      return;
    }

    const { error } = await supabase.from("cripto_ativos").insert({
      simbolo,
      nome,
    });

    if (error) {
      alert("Erro ao cadastrar ativo: " + error.message);
      return;
    }

    setSimboloNovo("");
    setNomeNovo("");

    if (usuarioId) {
      await carregarDados(usuarioId);
    }
  }

  function baixarCSV() {
    const linhas = [
      ["Data", "Ativo", "Tipo", "Quantidade", "Preco Unitario BRL", "Total BRL"],
      ...portfolio.historico.map((item) => [
        item.data,
        item.simbolo,
        item.tipo,
        String(item.quantidade),
        String(item.preco_unitario),
        String(item.total),
      ]),
    ];

    const csv = linhas.map((linha) => linha.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `relatorio_fiscal_alms_prime_cripto_${new Date()
      .toISOString()
      .slice(0, 7)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm font-semibold text-cyan-300">
          Carregando ALMS Prime Cripto...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-slate-950 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-cyan-300">
              ← Voltar ao Portal
            </Link>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              ALMS Prime Cripto
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Carteira, operações, lucro/prejuízo, simulação e relatório fiscal.
            </p>
          </div>

          <button
            onClick={() => usuarioId && carregarDados(usuarioId)}
            className="rounded-lg border border-cyan-400 px-4 py-2 text-sm font-bold text-cyan-300 hover:bg-cyan-400 hover:text-slate-950"
          >
            Atualizar cotações
          </button>
        </div>
      </section>

      <nav className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          <a
            href="#resumo"
            className="whitespace-nowrap rounded-full border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
          >
            Resumo
          </a>
          <a
            href="#portfolio"
            className="whitespace-nowrap rounded-full border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
          >
            Portfólio
          </a>
          <a
            href="#transacoes"
            className="whitespace-nowrap rounded-full border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
          >
            Transações
          </a>
          <a
            href="#relatorio"
            className="whitespace-nowrap rounded-full border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
          >
            Relatório Fiscal
          </a>
          <a
            href="#simulador"
            className="whitespace-nowrap rounded-full border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
          >
            Simulador
            
          </a>
                    <Link
            href="/cripto/noticias"
            className="whitespace-nowrap rounded-full border border-cyan-700 bg-cyan-950/40 px-4 py-2 text-xs font-bold text-cyan-300 hover:border-cyan-400 hover:text-cyan-200"
          >
            Notícias
          </Link>
                    <Link
            href="/cripto/sentimento"
            className="whitespace-nowrap rounded-full border border-purple-700 bg-purple-950/40 px-4 py-2 text-xs font-bold text-purple-300 hover:border-purple-400 hover:text-purple-200"
          >
            Sentimento
          </Link>
                    <Link
            href="/cripto/graficos"
            className="whitespace-nowrap rounded-full border border-emerald-700 bg-emerald-950/40 px-4 py-2 text-xs font-bold text-emerald-300 hover:border-emerald-400 hover:text-emerald-200"
          >
            Gráficos
          </Link>
                    <Link
            href="/cripto/configuracoes"
            className="whitespace-nowrap rounded-full border border-slate-600 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
          >
            Configurações
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-6">
        {erro && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm font-semibold text-red-200">
            {erro}
          </div>
        )}

        <div id="resumo" className="scroll-mt-24 grid gap-4 md:grid-cols-4">
          <CardResumo titulo="Patrimônio Total" valor={formatarMoedaBRL(portfolio.patrimonio)} />
          <CardResumo titulo="Investimento" valor={formatarMoedaBRL(portfolio.investimento)} />
          <CardResumo
            titulo="Lucro/Prejuízo"
            valor={formatarMoedaBRL(portfolio.lucro)}
            destaque={portfolio.lucro >= 0 ? "positivo" : "negativo"}
          />
          <CardResumo
            titulo="Rentabilidade"
            valor={`${portfolio.rentabilidade >= 0 ? "+" : ""}${portfolio.rentabilidade.toFixed(2)}%`}
            destaque={portfolio.rentabilidade >= 0 ? "positivo" : "negativo"}
          />
        </div>
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-bold">🧭 Ferramentas do Cripto</h2>
              <p className="mt-1 text-sm text-slate-400">
                Acesse rapidamente os módulos de análise, notícias, gráficos e
                configurações.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {ferramentasCripto.map((ferramenta) => (
              <Link
                key={ferramenta.href}
                href={ferramenta.href}
                className={
                  ferramenta.cor === "cyan"
                    ? "rounded-2xl border border-cyan-700/60 bg-cyan-950/20 p-5 transition hover:border-cyan-400 hover:bg-cyan-950/40"
                    : ferramenta.cor === "purple"
                      ? "rounded-2xl border border-purple-700/60 bg-purple-950/20 p-5 transition hover:border-purple-400 hover:bg-purple-950/40"
                      : ferramenta.cor === "emerald"
                        ? "rounded-2xl border border-emerald-700/60 bg-emerald-950/20 p-5 transition hover:border-emerald-400 hover:bg-emerald-950/40"
                        : "rounded-2xl border border-slate-700 bg-slate-950 p-5 transition hover:border-cyan-400"
                }
              >
                <div className="text-3xl">{ferramenta.icone}</div>

                <h3 className="mt-4 font-black text-white">
                  {ferramenta.titulo}
                </h3>

                <p className="mt-2 text-sm leading-5 text-slate-400">
                  {ferramenta.descricao}
                </p>

                <span className="mt-4 inline-block text-sm font-bold text-cyan-300">
                  Acessar →
                </span>
              </Link>
            ))}
          </div>
        </section>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section id="portfolio" className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-bold">💰 Meu Portfólio</h2>

            {portfolio.posicoes.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">
                Nenhuma posição em carteira. Registre sua primeira compra.
              </p>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {portfolio.posicoes.map((posicao) => (
                  <div
                    key={posicao.ativo_id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold">{posicao.nome}</h3>
                        <p className="text-xs text-slate-400">
                          {formatarNumeroCripto(posicao.quantidade)} {posicao.simbolo}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {formatarMoedaBRL(posicao.valor_atual)}
                        </p>
                        <p
                          className={
                            posicao.lucro >= 0
                              ? "text-xs font-semibold text-emerald-400"
                              : "text-xs font-semibold text-red-400"
                          }
                        >
                          {posicao.lucro >= 0 ? "+" : ""}
                          {posicao.lucro_pct.toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <p>PM: {formatarMoedaBRL(posicao.preco_medio)}</p>
                      <p>Atual: {formatarMoedaBRL(posicao.preco_atual)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section id="transacoes" className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-bold">💸 Registrar Transação</h2>

            <form onSubmit={salvarTransacao} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400">Ativo</label>
                <select
                  value={form.ativo_id}
                  onChange={(event) => atualizarForm("ativo_id", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                  required
                >
                  <option value="">Selecione...</option>
                  {ativos.map((ativo) => (
                    <option key={ativo.id} value={ativo.id}>
                      {ativo.simbolo} — {ativo.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Tipo</label>
                  <select
                    value={form.tipo}
                    onChange={(event) =>
                      atualizarForm("tipo", event.target.value as "COMPRA" | "VENDA")
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                  >
                    <option value="COMPRA">COMPRA</option>
                    <option value="VENDA">VENDA</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400">
                    Quantidade
                  </label>
                  <input
                    value={form.quantidade}
                    onChange={(event) => atualizarForm("quantidade", event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                    placeholder="0.00000000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">
                  Valor total da operação em R$
                </label>
                <input
                  value={form.valor_total_brl}
                  onChange={(event) =>
                    atualizarForm("valor_total_brl", event.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                  placeholder="1000.00"
                  required
                />
              </div>

              <button
                disabled={salvando}
                className="w-full rounded-lg bg-cyan-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Confirmar lançamento"}
              </button>
            </form>

            <form onSubmit={cadastrarAtivo} className="mt-6 border-t border-slate-800 pt-4">
              <h3 className="text-sm font-bold">➕ Cadastrar nova moeda</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <input
                  value={simboloNovo}
                  onChange={(event) => setSimboloNovo(event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm uppercase outline-none focus:border-cyan-400"
                  placeholder="SOL"
                />
                <input
                  value={nomeNovo}
                  onChange={(event) => setNomeNovo(event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                  placeholder="Solana"
                />
              </div>
              <button className="mt-3 w-full rounded-lg border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200 hover:border-cyan-400">
                Cadastrar ativo
              </button>
            </form>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section id="relatorio" className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold">📄 Relatório Fiscal</h2>
              <button
                onClick={baixarCSV}
                disabled={portfolio.historico.length === 0}
                className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Baixar CSV
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-auto rounded-xl border border-slate-800">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-950 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Data</th>
                    <th className="px-3 py-2">Ativo</th>
                    <th className="px-3 py-2">Tipo</th>
                    <th className="px-3 py-2">Qtd</th>
                    <th className="px-3 py-2">Preço Un.</th>
                    <th className="px-3 py-2">Total</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.historico.map((item) => (
                    <tr key={item.id} className="border-t border-slate-800">
                      <td className="px-3 py-2 text-slate-300">{item.data}</td>
                      <td className="px-3 py-2 font-semibold">{item.simbolo}</td>
                      <td className="px-3 py-2">{item.tipo}</td>
                      <td className="px-3 py-2">
                        {formatarNumeroCripto(item.quantidade)}
                      </td>
                      <td className="px-3 py-2">
                        {formatarMoedaBRL(item.preco_unitario)}
                      </td>
                      <td className="px-3 py-2">{formatarMoedaBRL(item.total)}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => excluirTransacao(item.id)}
                          className="text-xs font-bold text-red-300 hover:text-red-200"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}

                  {portfolio.historico.length === 0 && (
                    <tr>
                      <td className="px-3 py-6 text-center text-slate-400" colSpan={7}>
                        Nenhuma transação registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section id="simulador" className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-bold">🔮 Simulador de Cenários</h2>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-400">
                Ativo base
              </label>
              <select
                value={form.ativo_id}
                onChange={(event) => atualizarForm("ativo_id", event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
              >
                <option value="">Selecione...</option>
                {ativos.map((ativo) => (
                  <option key={ativo.id} value={ativo.id}>
                    {ativo.simbolo} — {ativo.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-400">
                Projeção: {projecao}%
              </label>
              <input
                type="range"
                min={-90}
                max={1000}
                value={projecao}
                onChange={(event) => setProjecao(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </div>

            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Preço atual</p>
              <p className="mt-1 text-xl font-black">
                {formatarMoedaBRL(precoSelecionado)}
              </p>

              <p className="mt-4 text-sm text-slate-400">Preço projetado</p>
              <p className="mt-1 text-xl font-black text-cyan-300">
                {formatarMoedaBRL(valorAtualSimulado)}
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function CardResumo({
  titulo,
  valor,
  destaque,
}: {
  titulo: string;
  valor: string;
  destaque?: "positivo" | "negativo";
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {titulo}
      </p>
      <p
        className={
          destaque === "positivo"
            ? "mt-2 text-2xl font-black text-emerald-400"
            : destaque === "negativo"
              ? "mt-2 text-2xl font-black text-red-400"
              : "mt-2 text-2xl font-black text-white"
        }
      >
        {valor}
      </p>
    </div>
  );
}
