# SKILL.md v1 — azure-functions-endpoint (Domain)

> Escrito com o **Claude**. Nível Domain — define o padrão de todo endpoint HTTP do projeto (Azure Functions v4). Consumido pelas skills Artifact (`create-rag-endpoint`, etc). Testado com o Copilot no passo 2; revisado para v2 em `03-skill-v2.md` depois da análise em `02-analise-v1.md`.

## Contexto
Use esta skill sempre que for criar um novo endpoint Azure Functions no projeto (HTTP trigger). Todos os endpoints do assistente (query, feedback, health) seguem o mesmo padrão estrutural.

## Regras
- Todo endpoint é um HTTP trigger de Azure Functions v4.
- Valide o input com Zod.
- Use o logger de `src/shared/logger.ts` (pino).
- Trate erros com as classes de `src/shared/errors.ts`.
- Retorne sempre um `HttpResponseInit` com `status` e `jsonBody`.
- Escreva testes com Vitest cobrindo o caminho feliz e pelo menos um erro de validação.

## Exemplo

```ts
import { HttpRequest, InvocationContext, HttpResponseInit } from "@azure/functions";
import { z } from "zod";

const schema = z.object({ question: z.string().min(1) });

export async function handler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const input = schema.parse(await request.json());
  // lógica do endpoint
  return { status: 200, jsonBody: { ok: true } };
}
```

## Anti-padrões
- Handler sem validação de input.
- `console.log` em vez do logger.

## Dependências
- Foundation: `typescript-conventions.md`, `error-handling.md`.
