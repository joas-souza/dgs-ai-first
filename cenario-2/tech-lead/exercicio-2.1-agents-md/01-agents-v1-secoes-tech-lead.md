# AGENTS.md v1 — Seções do Tech Lead

> Rascunho inicial das 4 seções de responsabilidade do Tech Lead (Project Overview, Tech Stack & Architecture, Coding Standards, Build & Deploy), escrito com o **Claude** a partir das ADRs da fase anterior. Esta é a v1 — será testada com o Copilot no passo 2 e revisada na v2 (arquivo `04-agents-v2-secoes-tech-lead.md`).

## Project Overview

O NovaTech Assistant é o assistente de atendimento da NovaTech (empresa de logística), integrado ao Microsoft Teams e a um painel web interno. Ele responde perguntas de atendentes sobre SLAs, frete e devoluções usando um pipeline de RAG sobre a documentação interna da empresa.

O projeto tem 4 componentes: pipeline de ingestão de documentos, API do assistente (query e feedback), bot do Teams, e painel web de métricas.

## Tech Stack & Architecture

- Backend e bot: TypeScript, rodando em Azure Functions v4 (HTTP triggers).
- Busca: Azure AI Search.
- Modelo: Azure OpenAI (GPT-4o).
- Painel web: React.
- Infraestrutura: Bicep.

Arquitetura do pipeline de resposta: pergunta do atendente → embedding → busca de chunks no Azure AI Search → montagem do prompt → chamada ao GPT-4o → resposta com fonte.

Gerenciamento de contexto (ADR-0002): o prompt enviado ao modelo deve respeitar um orçamento de contexto de aproximadamente 4K tokens para o system prompt e 8K tokens para os chunks recuperados (top-5 chunks, ~1.500 tokens cada), mais a pergunta do usuário e um histórico de conversa limitado às últimas 3 trocas. Isso evita estourar a janela de contexto e reduz custo por chamada.

## Coding Standards

- TypeScript com strict mode habilitado.
- Validação de dados com Zod.
- Testes com Vitest.
- Logging estruturado com pino.
- Commits seguindo Conventional Commits.
- Branches de feature locais; "PRs" são descritos como markdown em `docs/pull-requests/`.

## Build & Deploy

- Build via `tsc` (script `npm run build`).
- Lint via `npm run lint`.
- Testes via `npm run test` (Vitest, cobertura mínima 80% de linhas).
- CI roda lint, testes e build a cada push (`.github/workflows/ci.yml`).
- Deploy (CD) para staging/produção via `.github/workflows/cd.yml`, narrativo nesta fase (sem provisionamento real de Azure).
