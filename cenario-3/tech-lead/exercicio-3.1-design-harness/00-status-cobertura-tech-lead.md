# Status de Cobertura — Exercício 3.1 (Tech Lead)

## Escopo analisado
Referência: seção TECH LEAD, Exercício 3.1 (Design do harness do projeto), em cenario-3/cenario-3-exercicios-fase-governanca.md.

## O que você disse já ter executado
- Exercícios sem especificação de ferramenta.
- Exercícios com especificação explícita de uso do Claude.

## Item Copilot exigido no enunciado
- Item Copilot exigido no enunciado: implementar **uma verificação simples da camada de Verification loops** para validar `source_document` contra a lista oficial:
  - `POL-001`
  - `PROC-042`
  - `PROC-042-v2`
  - `SLA-2024`
  - `FAQ-Atendimento`

## Implementação encontrada nesta pasta
- `exercicio-3.1-design-harness/05-source-verifier.ts` (v2, corrigida — ver `04-code-review-v1.md`)
  - Implementa `verifySourceDocument(response)`.
  - Marca como suspeita resposta com `source_document` ausente/vazio.
  - Marca como suspeita fonte fora da lista válida (match exato, não substring — ver correção do bug de v1).
- `exercicio-3.1-design-harness/06-demo-source-verifier.ts`
  - Demonstração executável com casos reais do cenário e casos de borda.
- `exercicio-3.1-design-harness/07-execucao-real.txt`
  - Evidência de execução real (8/8 casos esperados, exit code 0).
- `exercicio-3.1-design-harness/02-prompt-copilot.md`, `03-source-verifier-v1-copilot.ts`, `04-code-review-v1.md`
  - Evidência do processo completo com o Copilot: prompt literal → v1 bruto → code review → v2 corrigida (ajuste feito após avaliação em `cenario-3/tech-lead/avaliacao.md`, que apontava falta dessa evidência).

## Conclusão de lacunas
- No escopo do Exercício 3.1, não há pendência de implementação de Copilot.
- O item solicitado (verification loop de fonte) está implementado, demonstrado e com evidência de execução real.
