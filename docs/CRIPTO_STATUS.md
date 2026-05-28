# ALMS Prime Cripto — Status do Projeto

Documento de controle do módulo **ALMS Prime Cripto** dentro do projeto `alms-prime-portal`.

Este documento registra o que já foi publicado, quais rotas existem, quais tabelas do Supabase são utilizadas, quais permissões foram criadas e quais melhorias futuras são recomendadas.

---

## 1. Status geral

Status atual: **em produção**.

O módulo Cripto foi lançado dentro do Portal ALMS Prime sem alterar diretamente o módulo de Fiscalização.

### Funcionalidades publicadas

- MVP do ALMS Prime Cripto
- Dashboard de carteira
- Registro de compra e venda
- Cadastro de ativos
- Cálculo de patrimônio, investimento, lucro/prejuízo e rentabilidade
- Relatório fiscal em CSV
- Simulador de cenários
- Notícias do mercado cripto
- Sentimento do mercado com Fear & Greed Index
- Gráficos da carteira
- Configurações do Cripto
- Cards de ferramentas na home do Cripto
- Navegação superior limpa

---

## 2. Rotas disponíveis

### Portal

| Rota | Função |
|---|---|
| `/` | Home do Portal ALMS Prime |
| `/login` | Tela de login |
| `/fiscalizacao` | Módulo de Fiscalização |
| `/cripto` | Página principal do ALMS Prime Cripto |

### Cripto

| Rota | Função |
|---|---|
| `/cripto` | Dashboard principal, carteira, transações, relatório e simulador |
| `/cripto/noticias` | Notícias recentes do mercado cripto |
| `/cripto/sentimento` | Fear & Greed Index e leitura estratégica |
| `/cripto/graficos` | Gráficos e análise visual da carteira |
| `/cripto/configuracoes` | Administração dos ativos cadastrados |

### APIs internas

| Rota | Função |
|---|---|
| `/api/cripto/noticias` | Busca notícias do mercado cripto |
| `/api/cripto/sentimento` | Busca Fear & Greed Index |
| `/api/geocodificar` | API usada pelo módulo de Fiscalização |

---

## 3. Arquivos principais

| Arquivo | Função |
|---|---|
| `src/app/cripto/page.tsx` | Página principal do Cripto |
| `src/app/cripto/noticias/page.tsx` | Página de notícias |
| `src/app/cripto/sentimento/page.tsx` | Página de sentimento |
| `src/app/cripto/graficos/page.tsx` | Página de gráficos |
| `src/app/cripto/configuracoes/page.tsx` | Página de configurações |
| `src/app/api/cripto/noticias/route.ts` | API interna de notícias |
| `src/app/api/cripto/sentimento/route.ts` | API interna de sentimento |
| `src/lib/cripto/calcularPortfolio.ts` | Funções de cálculo da carteira |
| `supabase/cripto_schema.sql` | Estrutura inicial das tabelas do Cripto |
| `supabase/cripto_configuracoes_policy.sql` | Policy para update em `cripto_ativos` |

---

## 4. Tabelas Supabase usadas pelo Cripto

### `cripto_ativos`

Tabela de ativos/moedas cadastradas.

Campos principais:

- `id`
- `simbolo`
- `nome`
- `ativo`
- `created_at`

Uso:

- Listagem de ativos no formulário de transações
- Cadastro de novas moedas
- Ativação/desativação em `/cripto/configuracoes`

### `cripto_transacoes`

Tabela de operações de compra e venda.

Campos principais:

- `id`
- `user_id`
- `ativo_id`
- `tipo`
- `quantidade`
- `preco_unitario`
- `moeda_preco`
- `created_at`

Uso:

- Registro de compras
- Registro de vendas
- Cálculo de carteira
- Relatório fiscal
- Gráficos
- Estatísticas por ativo

### `cripto_historico_precos`

Tabela criada para histórico de preços.

Status atual:

- Estrutura criada
- Ainda não usada de forma avançada no front-end

Uso futuro recomendado:

- Histórico diário de preço por ativo
- Evolução da carteira ao longo do tempo
- Gráficos temporais
- Comparação entre preço médio e preço histórico

---

## 5. Policies e segurança

Arquivo:

```txt
supabase/cripto_configuracoes_policy.sql