# Plano de Execução — Tech Lead (Cenário 3)

## Escopo
Esta pasta cobre exclusivamente os 2 exercícios do papel **Tech Lead** no Cenário 3 (Fase de Governança e Validação), descritos em `cenario-3/cenario-3-exercicios-fase-governanca.md`. Os exercícios dos demais papéis (Delivery Manager, Product Specialist, Desenvolvedor, QA) não fazem parte desta entrega.

## Avaliação da estrutura em pastas
Mesmo critério usado nos Cenários 1 e 2: uma pasta por exercício, porque cada um tem entregável e critérios de avaliação próprios (design de harness + verificação de código vs. revisão crítica de arquitetura). Isso evita misturar evidência de um exercício com a de outro.

## Estrutura adotada
- `exercicio-3.1-design-harness/`: design do harness pelas 5 camadas (tool orchestration, verification loops, context & memory, guardrails, observability), conectando a camada de contexto à ADR-0002 e a de guardrails a structured outputs + HITL. Inclui uma verificação real da camada "verification loops" (`verifySourceDocument`), com o processo completo de Copilot (prompt → v1 com bug → code review → v2 corrigida) e **executada de verdade** (`07-execucao-real.txt`).
- `exercicio-3.2-revisao-critica-arquitetura-ia/`: avaliação de risco dos 4 artefatos gerados com apoio de IA no projeto (AGENTS.md, skills, pipeline/endpoint, system prompt) — feita primeiro sem o Claude, depois com o Claude como co-reviewer, com comparação honesta e priorização para as 2 semanas até a demo.

## Ordem recomendada de execução
1. **Exercício 3.1 (Design do harness)** — projeta o sistema de governança que vai proteger o go-live. É pré-requisito conceitual para o 3.2: para avaliar o risco de artefatos gerados por IA, ajuda já ter em mãos o vocabulário e os pontos de verificação/HITL definidos no harness (ex: um guardrail sem teste é exatamente o tipo de gap que a camada "Guardrails" do harness deveria cobrir).
2. **Exercício 3.2 (Revisão crítica da arquitetura)** — usa o harness do 3.1 como referência para julgar o que é risco aceitável vs. bloqueante nos artefatos já produzidos, e devolve a priorização de 2 semanas de forma pragmática.

## Metodologia comum aos 2 exercícios
Em ambos, o padrão foi: **fazer a análise/avaliação por conta própria primeiro (com acesso ao repositório real `cenario-2/novatech-assistant/`), só depois confrontar com uma segunda opinião do Claude, e documentar a comparação com honestidade** — inclusive onde a primeira passada errou ou deixou passar algo (ex: 3.2 documenta explicitamente onde a avaliação humana não cruzou o resumo simulado do enunciado com o estado real do repositório).

## O que foi implementado e executado de verdade
- `exercicio-3.1-design-harness/02-prompt-copilot.md` + `03-source-verifier-v1-copilot.ts` + `04-code-review-v1.md` — prompt literal usado com o Copilot, output bruto (v1, com um bug real de correspondência por substring, provado em execução) e o code review que motivou a correção.
- `exercicio-3.1-design-harness/05-source-verifier.ts` — função `verifySourceDocument` corrigida (v2), módulo isolado (ver justificativa de escopo no README do exercício sobre por que não foi colocado em `novatech-assistant/src/`).
- `exercicio-3.1-design-harness/06-demo-source-verifier.ts` — 10 casos de teste reais (6 reaproveitados do Exercício Product Specialist 3.1, mais 4 casos de borda, incluindo os 2 que expuseram o bug da v1), rodados com `npx tsx`.
- `exercicio-3.1-design-harness/07-execucao-real.txt` — saída real da execução: 10/10 casos bateram com o esperado, exit code 0.

## Nenhum arquivo do repositório real foi alterado
Diferente do Cenário 2, este papel não alterou `AGENTS.md`, `.mcp/mcp.json` nem nenhum arquivo em `cenario-2/novatech-assistant/src/` — os gaps identificados nesses arquivos (seções TODO, stubs vazios, `prompt-changelog.md` vazio) são **achados da revisão**, documentados como evidência, não corrigidos aqui. A correção desses gaps (preencher guardrails no AGENTS.md, implementar `response-validator.ts`, etc.) é escopo de outros papéis/exercícios (Product Specialist, Desenvolvedor).
