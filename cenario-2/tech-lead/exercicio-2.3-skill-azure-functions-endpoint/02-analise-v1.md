# Análise — O que o Copilot seguiu e o que ignorou (skill v1)

## Prompt usado
> "Crie o endpoint 'echo': recebe `{ text: string }` no body e devolve `{ text, length }`. Siga a skill azure-functions-endpoint."

Saída em [`copilot-teste-v1/echo/handler.ts`](./copilot-teste-v1/echo/handler.ts).

## O que foi seguido
| Regra da skill v1 | Seguido? |
|---|---|
| HTTP trigger Azure Functions v4 | Sim |
| Validação com Zod | Sim (`schema.parse`) |
| Logger de `src/shared/logger.ts` | Sim |
| Retorno `HttpResponseInit` com `status`/`jsonBody` | Sim |

## O que foi ignorado
| Problema | Evidência | Causa raiz |
|---|---|---|
| Sem separação em `handler.ts` / `validator.ts` / `response-builder.ts` | Tudo em um único `handler.ts` (schema, lógica e resposta juntos) | A skill v1 nunca menciona a estrutura de arquivos por endpoint — só fala em "endpoint" genericamente. Não há exemplo do layout de pasta esperado (o Anexo C define isso, mas a skill não referencia o Anexo C nem reproduz a convenção) |
| `schema.parse()` sem `try/catch` — erro de validação vira exceção não tratada (Azure Functions devolve `500` genérico, não `400`) | `schema.parse(body)` lança `ZodError`, que não é capturado em lugar nenhum do handler | A skill v1 diz "valide com Zod" mas não diz **o que fazer quando a validação falha** — não há exemplo de `safeParse` + resposta `400` |
| Não usa classes de `src/shared/errors.ts` | Nenhum import de `errors.ts` | A skill v1 lista "trate erros com as classes de errors.ts" nas regras, mas não mostra como — regra descritiva sem exemplo, mesmo padrão de falha observado no AGENTS.md v1 (exercício 2.1) |

## Conclusão
O padrão se repete: regras que dizem *o quê* ("valide com Zod", "trate erros") sem mostrar *como* (o `safeParse` + resposta 400, o layout de arquivos) são seguidas apenas parcialmente. A skill v1 tem 100% de aderência nas regras que vieram com exemplo de código, e 0% nas que só foram descritas em texto. A v2 (`03-skill-v2.md`) adiciona: (1) o layout de arquivos como regra explícita com exemplo, e (2) o fluxo completo de erro de validação com `safeParse` + `400`.
