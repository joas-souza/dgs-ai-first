# Exercício 3.1 — Design do harness do projeto

## Objetivo
Projetar o harness do assistente pelas 5 camadas (tool orchestration, verification loops, context & memory, guardrails, observability) e implementar de verdade uma verificação da camada "verification loops".

## Entregável exigido no enunciado
- Design do harness pelas 5 camadas: o que já está implementado, o que falta, como fechar o gap. Context & memory conectado à ADR-0002; Guardrails mencionando structured outputs e ao menos um ponto de HITL.
- Uma função de verificação **funcional**: recebe a resposta do modelo e checa se `source_document` está na lista de documentos válidos da NovaTech (`POL-001`, `PROC-042`, `PROC-042-v2`, `SLA-2024`, `FAQ-Atendimento`).

## Estrutura da pasta
- `00-status-cobertura-tech-lead.md` — status de cobertura do exercício frente ao enunciado.
- `01-harness-5-camadas.md` — o design do harness, camada por camada, com a tabela final de critérios bloqueante vs. desejável para o go-live.
- `02-prompt-copilot.md` — prompt literal usado com o GitHub Copilot para gerar a função.
- `03-source-verifier-v1-copilot.ts` — output bruto da v1 do Copilot, **com bug**, mantido como evidência (não é o código usado de fato).
- `04-code-review-v1.md` — code review da v1: 2 problemas reais encontrados (correspondência por substring em vez de igualdade exata; uso de `any`), com prova de execução do bug antes da correção.
- `05-source-verifier.ts` — a função de verificação corrigida (v2), a que de fato compõe o harness.
- `06-demo-source-verifier.ts` — demonstração executável: as 6 respostas simuladas do Exercício Product Specialist 3.1 (mesmo cenário) como casos de teste reais, mais 4 casos de borda — incluindo os 2 casos adversariais que expuseram o bug da v1.
- `07-execucao-real.txt` — saída real de `npx tsx 06-demo-source-verifier.ts` rodado nesta máquina (10/10 casos bateram com o esperado, exit code 0).

## Como reexecutar
```
npx tsx 06-demo-source-verifier.ts
```
(Rodado com Node v22.23.1 e `tsx` via `npx`; não depende do projeto `novatech-assistant` — é um módulo isolado, como convém a uma verificação de harness que qualquer serviço pode importar.)

## Processo com o Copilot (v1 → code review → v2)
Adicionado após a avaliação em `cenario-3/tech-lead/avaliacao.md` (Exercício 3.1, D2), que apontou que a entrega original só mostrava o resultado final, sem evidência de iteração. O fluxo real: `02-prompt-copilot.md` (prompt) → `03-source-verifier-v1-copilot.ts` (output bruto, com bug de correspondência por substring provado em `04-code-review-v1.md`) → `05-source-verifier.ts` (corrigido). Os 2 casos adversariais que expuseram o bug (`PROC-042-v2-RASCUNHO-INTERNO-NAO-REVISADO` e uma frase qualquer contendo "POL-001") foram incorporados à demonstração final em `06-demo-source-verifier.ts`.

## Por que não foi colocado dentro de `novatech-assistant/src/`
O enunciado deste exercício (Tech Lead) não define um caminho no Anexo C, diferente do Exercício Dev 3.1, que especifica `src/services/response-validator.ts` para o schema Zod e os guardrails de conteúdo. Para não invadir esse escopo (o `response-validator.ts` já existe como stub vazio no repositório, reservado para o Dev), a verificação de fonte deste exercício foi mantida como módulo isolado aqui. A composição das duas verificações na mesma etapa do pipeline está descrita em `01-harness-5-camadas.md`, camada 2.

## Nota honesta sobre o limite da função
O caso "PS#6" na demonstração mostra que este verifier prova apenas que a fonte **existe** na lista da NovaTech — não que é a fonte **adequada** para o tema da pergunta. A resposta 6 do Exercício Product Specialist 3.1 cita `FAQ-Atendimento` (documento real, portanto não suspeito para este verifier), mas o Product Specialist já a identificou como problemática por outro motivo: um tema de compliance (carga perigosa) não deveria se apoiar numa fonte informal. Esse julgamento continua sendo humano ou exigiria um guardrail de conteúdo mais específico — não é algo que uma checagem de existência de fonte resolve sozinha.
