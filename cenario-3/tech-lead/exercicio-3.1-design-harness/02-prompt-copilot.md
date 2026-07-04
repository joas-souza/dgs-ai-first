# Prompt literal usado com o GitHub Copilot

> Ajuste feito após a avaliação (`cenario-3/tech-lead/avaliacao.md`, Exercício 3.1, D2): a entrega original só mostrava o resultado final. Abaixo está o prompt real, o output bruto do Copilot (`03-source-verifier-v1-copilot.ts`) e o code review que motivou a correção (`04-code-review-v1.md`).

## Prompt (chat inline do Copilot, no arquivo `source-verifier.ts` vazio)

```
Gere uma função TypeScript `verifySourceDocument(response)` para o harness do
NovaTech Assistant.

Contexto: `response` é a saída do modelo, com um campo `source_document`
(string, pode vir undefined/null se o modelo não citar fonte).

A função deve:
- Retornar `{ suspicious: boolean, reason?: string }`.
- Marcar suspicious=true se `source_document` estiver vazio/ausente.
- Marcar suspicious=true se `source_document` não for um dos documentos
  válidos da NovaTech: POL-001, PROC-042, PROC-042-v2, SLA-2024,
  FAQ-Atendimento.
- Marcar suspicious=false caso contrário.

Não preciso de integração com nada além da função — vai ser importada por
outro módulo depois.
```

## O que o Copilot gerou de primeira
Ver `03-source-verifier-v1-copilot.ts`. Rodou sem erro de sintaxe e passou nos casos óbvios (fonte exata, fonte ausente) — mas tinha um problema real de lógica, encontrado no code review (`04-code-review-v1.md`), não em teste automatizado: o teste "óbvio" não usa casos adversariais o suficiente para pegar esse tipo de bug, que é exatamente o ponto da revisão crítica que este cenário pede.
