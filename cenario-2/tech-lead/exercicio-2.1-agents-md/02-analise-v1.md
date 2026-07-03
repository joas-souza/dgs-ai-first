# Análise — O que o Copilot seguiu e o que ignorou (AGENTS.md v1)

## Prompt usado no Copilot
> "Crie um endpoint de exemplo Azure Function (HTTP trigger) chamado ping, que recebe um nome via query string e devolve uma saudação. Gere também um teste para esse endpoint."

Executado com o `AGENTS.md` v1 (seções do Tech Lead) presente na raiz do repositório. Saída em [`copilot-teste-v1/ping-handler.ts`](./copilot-teste-v1/ping-handler.ts) e [`copilot-teste-v1/ping-handler.test.ts`](./copilot-teste-v1/ping-handler.test.ts).

## O que foi seguido
| Regra do AGENTS.md v1 | Seguido? | Evidência |
|---|---|---|
| TypeScript | Sim | Arquivo `.ts`, `async function` tipada |
| Formato de handler Azure Functions (`status` / `jsonBody`) | Sim | Retorno do handler segue o formato v4 |
| Testes com Vitest | Parcial | Existe um arquivo de teste, mas sem `import` de `vitest` (usa globais implícitos) |

## O que foi ignorado
| Regra do AGENTS.md v1 | Ignorado? | Evidência | Causa raiz |
|---|---|---|---|
| "Logging estruturado com pino" | Sim | `console.log` usado 2x | A regra não **proíbe** explicitamente `console.log` nem aponta o import (`src/shared/logger.ts`) — é descritiva, não prescritiva |
| "Validação de dados com Zod" | Sim | Nenhum schema Zod; `name` é lido direto da query sem validação | A regra não mostra *como* aplicar Zod num handler HTTP nem exige rejeitar input inválido |
| Strict mode (implícito) | Parcial | `request: any, context: any` — compila sob `strict: true`, mas contraria o espírito de tipagem forte | A seção não proíbe `any` explícito nem aponta os tipos oficiais do Azure Functions v4 |
| Tratamento de erro consistente | Sim | `catch` genérico com `console.log`, sem classe de erro nem status semântico | AGENTS.md v1 não menciona `src/shared/errors.ts` nem um padrão de erro |

## Conclusão
O Copilot seguiu a forma (é um handler `.ts` de Azure Function com teste), mas ignorou o conteúdo (logging, validação, tipagem, erros) porque a v1 é **descritiva** ("usamos Zod", "usamos pino") em vez de **prescritiva** ("todo handler DEVE validar o input com Zod antes de qualquer lógica; nunca use `console.log` — importe `logger` de `src/shared/logger.ts`"). Isso confirma o padrão esperado: regras genéricas não mudam o comportamento de um agente; regras com exemplo de código e proibição explícita mudam.

A v2 (`04-agents-v2-secoes-tech-lead.md`) reescreve **Coding Standards** com exemplos DO/DON'T e proibições explícitas para as 4 lacunas acima, e é testada novamente em `copilot-teste-v2/`.
