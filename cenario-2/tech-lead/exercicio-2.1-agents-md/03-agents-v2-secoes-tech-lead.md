# AGENTS.md v2 — Seções do Tech Lead (revisado após teste com Copilot)

> Revisão da v1 depois de observar, em `02-analise-v1.md`, que regras descritivas ("usamos Zod", "usamos pino") não foram suficientes para mudar o output do Copilot. A v2 torna **Coding Standards** prescritiva, com proibições explícitas e exemplos DO/DON'T. As demais seções (Project Overview, Tech Stack & Architecture, Build & Deploy) foram mantidas da v1 por não terem sido testadas como causa das falhas observadas.

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

**Gerenciamento de contexto (ADR-0002) — regras obrigatórias para todo endpoint que monta prompt para o modelo:**
- Orçamento de contexto por query: ~4.000 tokens para o system prompt + ~8.000 tokens para os chunks recuperados.
- Recuperação: no máximo 5 chunks por query, ~1.500 tokens cada. Nunca envie mais de 5 chunks ao modelo.
- Histórico de conversa: no máximo as últimas 3 trocas (pergunta+resposta). Descarte o restante — não acumule histórico ilimitado no prompt.
- Se o orçamento estourar, corte chunks pelo menor score de relevância antes de cortar o system prompt ou a pergunta do usuário.

## Coding Standards

Regras abaixo são **obrigatórias** (DEVE / NÃO DEVE). Todo código gerado por agente de IA precisa respeitá-las antes de passar por code review humano.

### Logging
- DEVE: importar o logger de `src/shared/logger.ts` (`pino`) e usar `logger.info(...)`, `logger.error(...)`, etc.
- NÃO DEVE: usar `console.log`, `console.error` ou `console.warn` em nenhum arquivo dentro de `src/`.

```ts
// DO
import { logger } from "../../shared/logger";
logger.info({ name }, "ping recebido");

// DON'T
console.log("ping recebido", name);
```

### Validação de input
- DEVE: todo handler HTTP definir um schema Zod para o input (query, params ou body) e chamar `.parse()`/`.safeParse()` antes de qualquer lógica de negócio.
- NÃO DEVE: ler campos de `request.query`/`request.body` diretamente sem validação prévia.

```ts
// DO
import { z } from "zod";
const schema = z.object({ name: z.string().min(1).default("atendente") });
const { name } = schema.parse({ name: request.query.get("name") });

// DON'T
const name = request.query.get("name") || "atendente";
```

### Tipagem
- DEVE: usar os tipos oficiais do pacote `@azure/functions` (`HttpRequest`, `InvocationContext`) na assinatura de todo handler.
- NÃO DEVE: usar `any` explícito para `request` ou `context`.

```ts
// DO
import { HttpRequest, InvocationContext } from "@azure/functions";
export async function pingHandler(request: HttpRequest, context: InvocationContext) { ... }

// DON'T
export async function pingHandler(request: any, context: any) { ... }
```

### Erros
- DEVE: lançar/capturar erros usando as classes de `src/shared/errors.ts`; logar com `logger.error` incluindo o tipo do erro antes de responder.
- NÃO DEVE: usar `catch` genérico que apenas loga e retorna `500` sem diferenciar erro de validação (`400`) de erro interno (`500`).

### Testes
- DEVE: importar explicitamente `describe`, `it`, `expect` de `"vitest"` (sem depender de globais implícitos).
- NÃO DEVE: usar assertions vagas como `toBeDefined()`/`toBeTruthy()` como única verificação do comportamento.

## Build & Deploy

- Build via `tsc` (script `npm run build`).
- Lint via `npm run lint`.
- Testes via `npm run test` (Vitest, cobertura mínima 80% de linhas).
- CI roda lint, testes e build a cada push (`.github/workflows/ci.yml`).
- Deploy (CD) para staging/produção via `.github/workflows/cd.yml`, narrativo nesta fase (sem provisionamento real de Azure).
