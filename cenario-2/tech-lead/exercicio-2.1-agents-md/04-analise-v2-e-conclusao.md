# Análise — Segunda rodada (AGENTS.md v2) e conclusão

## Resultado do reteste
Mesmo prompt do teste v1, agora com o `AGENTS.md` v2 presente no repositório. Saída em [`copilot-teste-v2/ping-handler.ts`](./copilot-teste-v2/ping-handler.ts) e [`copilot-teste-v2/ping-handler.test.ts`](./copilot-teste-v2/ping-handler.test.ts).

| Regra do AGENTS.md v2 | Seguido na v2? | Evidência |
|---|---|---|
| Logging via `pino` (`src/shared/logger.ts`), nunca `console.log` | Sim | Handler usa `logger.info`/`logger.error`; nenhum `console.*` |
| Validação de input com Zod antes da lógica | Sim | `pingQuerySchema.safeParse(...)` roda antes de qualquer uso de `name` |
| Tipos oficiais do `@azure/functions`, sem `any` explícito | Sim | `HttpRequest`, `InvocationContext`, `HttpResponseInit` |
| Erros via `src/shared/errors.ts`, diferenciando `400` de `500` | Sim | `ValidationError` tratado separadamente do `catch` genérico |
| Testes com `describe`/`it`/`expect` importados de `vitest`, assertions específicas | Sim | Import explícito; assertions verificam `status` e `jsonBody`, não `toBeDefined()` |

## Comparação v1 → v2

| Lacuna encontrada na v1 | Ajuste feito na v2 | Efeito observado |
|---|---|---|
| Regra de logging descritiva | Proibição explícita de `console.log` + exemplo DO/DON'T + caminho do import | Copilot passou a importar `logger` |
| Regra de validação descritiva | Exigência explícita de Zod + exemplo de `safeParse` antes da lógica | Copilot passou a validar e retornar `400` em input inválido |
| Nenhuma restrição sobre `any` | Proibição explícita + tipos oficiais nomeados | Copilot usou `HttpRequest`/`InvocationContext` |
| Nenhum padrão de erro | Exigência de diferenciar erro de validação (400) de erro interno (500) via `src/shared/errors.ts` | Copilot tratou `ValidationError` separadamente |
| Nenhuma regra de teste | Proibição de assertions vagas + exigência de import explícito | Testes ficaram descritivos e específicos |

## Conclusão
A melhoria entre v1 e v2 não veio de reescrever tudo — três das quatro seções do Tech Lead (Project Overview, Tech Stack & Architecture, Build & Deploy) foram mantidas; o ganho veio de tornar **apenas** Coding Standards prescritiva, com proibições explícitas e exemplos de código lado a lado (DO/DON'T). Isso confirma o critério de avaliação do exercício: nem tudo que está no AGENTS.md será seguido à risca por um agente — regras vagas tendem a ser ignoradas mesmo quando tecnicamente "cobertas" no texto. O papel do Tech Lead é iterar com evidência real (testar, observar, reescrever), não assumir que escrever a regra uma vez é suficiente.

**Limitação reconhecida:** mesmo na v2, o Copilot pode variar entre execuções (natureza probabilística). O AGENTS.md reduz a variância, mas não a elimina — por isso o Gate 3 (Code → Merge, code review humano) definido no workflow do Delivery Manager continua sendo a rede de segurança determinística.

A seção final (v2) foi aplicada ao `AGENTS.md` real do projeto em `cenario-2/novatech-assistant/AGENTS.md`.
