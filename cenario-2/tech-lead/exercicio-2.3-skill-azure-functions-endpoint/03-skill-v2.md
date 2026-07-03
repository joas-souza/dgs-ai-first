# SKILL.md v2 — azure-functions-endpoint (Domain)

> Nível: Domain. Frase-ativação: "criar um endpoint", "novo HTTP trigger", "endpoint Azure Function". Consumida pelas skills Artifact (`create-rag-endpoint`, `create-integration-test`). Revisada após o teste em `02-analise-v1.md` — agora prescreve o layout de arquivos e o fluxo de erro de validação com exemplo, em vez de descrevê-los em texto solto.

## Contexto
Use esta skill sempre que for criar um novo endpoint Azure Functions no projeto (HTTP trigger). Todos os endpoints do assistente (query, feedback, health, e qualquer endpoint novo) seguem a mesma estrutura de arquivos e o mesmo fluxo de validação/erro.

## Regras (prescritivas)

### 1. Layout de arquivos — sempre 3 arquivos por endpoint
Todo endpoint novo vive em `src/functions/<slug>/` com exatamente estes 3 arquivos:
- `validator.ts` — schema Zod e função de parsing do input.
- `response-builder.ts` — função(ões) que montam o `HttpResponseInit` de sucesso e de erro.
- `handler.ts` — o HTTP trigger: chama `validator`, a lógica de negócio, e `response-builder`. Não contém schema Zod nem montagem de JSON inline.

NÃO DEVE: colocar schema Zod, lógica de negócio e montagem de resposta todos dentro de `handler.ts`.

### 2. Fluxo de erro de validação — sempre `safeParse` + `400`
```ts
// validator.ts — DO
import { z } from "zod";

export const echoInputSchema = z.object({ text: z.string().min(1) });

export function parseEchoInput(body: unknown) {
  return echoInputSchema.safeParse(body);
}
```

```ts
// handler.ts — DO
import { HttpRequest, InvocationContext, HttpResponseInit } from "@azure/functions";
import { logger } from "../../shared/logger";
import { parseEchoInput } from "./validator";
import { buildEchoResponse, buildValidationErrorResponse } from "./response-builder";

export async function handler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const parsed = parseEchoInput(await request.json());

  if (!parsed.success) {
    logger.error({ issues: parsed.error.issues }, "input inválido");
    return buildValidationErrorResponse(parsed.error);
  }

  logger.info({ length: parsed.data.text.length }, "processando request");
  return buildEchoResponse(parsed.data);
}
```

```ts
// handler.ts — DON'T
export async function handler(request: HttpRequest, context: InvocationContext) {
  const schema = z.object({ text: z.string().min(1) }); // schema não pertence aqui
  const input = schema.parse(await request.json());      // .parse() sem try/catch => 500 genérico em erro de validação
  return { status: 200, jsonBody: { text: input.text, length: input.text.length } }; // resposta montada inline
}
```

### 3. Erros internos (não de validação)
- DEVE: usar `try/catch` ao redor da lógica de negócio (não da validação, que já usa `safeParse`); capturar erros das classes de `src/shared/errors.ts` e logar com `logger.error` antes de responder `500`.

### 4. Logging e tipagem (herdadas do AGENTS.md — Coding Standards)
- DEVE: logger de `src/shared/logger.ts`, nunca `console.log`.
- DEVE: tipos oficiais `HttpRequest`/`InvocationContext`/`HttpResponseInit` de `@azure/functions`, nunca `any`.

### 5. Endpoints que montam prompt para o modelo (ex: query)
- DEVE: respeitar o orçamento de contexto da ADR-0002 (ver AGENTS.md — Tech Stack & Architecture): máx. 5 chunks recuperados, ~1.500 tokens cada, histórico limitado a 3 trocas.
- DEVE: incluir `source_document` em toda resposta de sucesso.

## Anti-padrões (observados no teste real com Copilot — v1)
- Schema Zod, lógica e resposta no mesmo arquivo `handler.ts` (viola regra 1).
- `schema.parse()` direto, sem `safeParse`, deixando erro de validação virar `500` em vez de `400` (viola regra 2).
- Handler que nunca importa `src/shared/errors.ts` mesmo tendo um `catch` (viola regra 3).

## Testes
- Todo endpoint tem `handler.test.ts` cobrindo: caminho feliz, input inválido (espera `400`), e ao menos um erro interno simulado (espera `500`).

## Dependências
- Foundation: `typescript-conventions.md`, `error-handling.md`, `project-structure.md`.
- Domain: `testing-patterns.md` (para os testes do endpoint).
