# ALMS Prime Portal - V1.0

## Status da versão

Versão: V1.0
Tag Git: v1.0-portal-institucional
Branch principal: main
Domínio principal: https://www.almsprime.com.br
Repositório: mendesrogerm/alms-prime-portal

A V1.0 marca a conclusão da base institucional do portal ALMS Prime.

## Objetivo do portal

O portal ALMS Prime foi criado para apresentar a marca ALMS Prime como uma iniciativa de tecnologia, gestão e soluções digitais.

O site centraliza:

- Apresentação institucional da ALMS Prime.
- Soluções digitais oferecidas.
- Sistemas e projetos do ecossistema.
- Landing comercial do sistema de gestão de clientes.
- Canais de contato.
- Páginas legais.
- Acesso à área interna.
- Links para sistemas conectados.

## Rotas principais

Institucionais:

- /
- /sobre
- /solucoes
- /sistemas
- /contato

Landing comercial:

- /gestao-de-clientes
- /gestao

Páginas legais:

- /politica-de-privacidade
- /termos-de-uso

Módulos internos/conectados:

- /cripto
- /fiscalizacao
- /login
- /redefinir-senha

Técnicas:

- /sitemap.xml
- /robots.txt
- /manifest.webmanifest
- /og-alms-prime.png

Erro:

- Página 404 personalizada em src/app/not-found.tsx

## Funcionalidades entregues

Site institucional:

- Home institucional refinada.
- Página Sobre com posicionamento da marca.
- Página Soluções com explicação comercial.
- Página Sistemas com vitrine dos projetos.
- Página Contato com CTAs comerciais.
- Header com menu desktop e mobile.
- Footer completo com navegação, soluções, contato e links legais.
- Botão flutuante de WhatsApp.

Landing de gestão de clientes:

- Hero comercial.
- Dor do negócio.
- Antes x Depois.
- Módulos do sistema.
- Custo do improviso.
- Benefícios.
- Para quem é.
- Planilha x Sistema.
- Como funciona a demonstração.
- FAQ.
- CTAs para WhatsApp.

## SEO e metadados

Foram configurados:

- Metadata global em src/app/layout.tsx.
- Metadata individual nas páginas institucionais.
- Sitemap em src/app/sitemap.ts.
- Robots em src/app/robots.ts.
- Manifest em src/app/manifest.ts.
- Dados estruturados em src/components/StructuredData.tsx.
- Open Graph estático em public/og-alms-prime.png.

Imagem de compartilhamento:

- Arquivo: public/og-alms-prime.png
- Script gerador: scripts/gerar-og-image.ps1

## Páginas legais

Criadas páginas básicas para:

- Política de Privacidade.
- Termos de Uso.

Arquivos:

- src/app/politica-de-privacidade/page.tsx
- src/app/termos-de-uso/page.tsx

Observação: estas páginas são institucionais e não substituem revisão jurídica formal.

## Componentes principais

- src/components/SiteHeader.tsx
- src/components/SiteFooter.tsx
- src/components/PageHero.tsx
- src/components/FloatingWhatsApp.tsx
- src/components/StructuredData.tsx

## Arquivos técnicos relevantes

- src/app/layout.tsx
- src/app/page.tsx
- src/app/sitemap.ts
- src/app/robots.ts
- src/app/manifest.ts
- src/app/not-found.tsx
- public/logo-alms-prime.png
- public/og-alms-prime.png
- scripts/gerar-og-image.ps1

## Comandos principais

Instalar dependências:

    npm install

Rodar localmente:

    npm run dev

Build de produção:

    npm run build

Publicar alterações:

    git status --short
    git add .
    git commit -m "Mensagem do commit"
    git push origin main

## Deploy

O deploy do portal é feito pela Vercel a partir do repositório GitHub.

Branch de produção:

- main

Domínio principal:

- https://www.almsprime.com.br

## Tag da V1.0

Tag criada:

- v1.0-portal-institucional

Confirmação local:

    git tag --points-at HEAD

Confirmação remota:

    git ls-remote --tags origin v1.0-portal-institucional

## Próximos passos sugeridos para V1.1

- Criar página específica para projetos sob medida.
- Criar página específica para automações comerciais.
- Criar página específica para dashboards e relatórios.
- Adicionar prints reais ou mockups do sistema Gestão de Clientes.
- Criar seção de preços ou planos comerciais.
- Criar formulário próprio de lead.
- Integrar eventos de conversão.
- Melhorar tracking de campanhas.
- Criar materiais de divulgação para a landing /gestao.
- Criar versão clara do logo para fundos escuros.

## Observações finais

A V1.0 está fechada como uma base institucional sólida do ecossistema ALMS Prime.

A partir deste ponto, novas melhorias devem ser tratadas como V1.1, V1.2 ou módulos específicos, evitando alterar a V1.0 sem necessidade.
