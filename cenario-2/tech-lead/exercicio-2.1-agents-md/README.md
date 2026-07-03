# Exercício 2.1 — Construção e teste do AGENTS.md do projeto

## Objetivo
Escrever as 4 seções de responsabilidade do Tech Lead no `AGENTS.md` (Project Overview, Tech Stack & Architecture, Coding Standards, Build & Deploy), testar a v1 com o Copilot gerando código real, e iterar para uma v2 mais prescritiva com base na evidência observada.

## Entregável exigido no enunciado
- AGENTS.md v1 (seções do Tech Lead).
- Outputs do Copilot testando a v1.
- Análise do que foi seguido/ignorado.
- AGENTS.md v2 (iterado).
- Outputs da segunda rodada com a v2.

## Estrutura da pasta
- `01-agents-v1-secoes-tech-lead.md` — rascunho inicial das 4 seções.
- `copilot-teste-v1/` — endpoint de exemplo (`ping`) e teste gerados pelo Copilot com a v1 presente no repo.
- `02-analise-v1.md` — o que foi seguido e o que foi ignorado, com causa raiz.
- `03-agents-v2-secoes-tech-lead.md` — seções revisadas, prescritivas (DO/DON'T, proibições explícitas).
- `copilot-teste-v2/` — mesmo prompt, mesmo endpoint, com a v2 presente no repo.
- `04-analise-v2-e-conclusao.md` — comparação v1 → v2 e conclusão.

O endpoint `ping` usado nos testes é um sandbox isolado, criado apenas para validar se o Copilot segue o AGENTS.md — não é um dos 5 módulos de spec do projeto (esses são responsabilidade do Product Specialist/Dev nos próprios exercícios deles).

## Onde o resultado final foi aplicado
A v2 das 4 seções do Tech Lead foi copiada para `cenario-2/novatech-assistant/AGENTS.md`, substituindo os `TODO` correspondentes. As demais seções do arquivo (Product Rules, Testing Standards, Project Management Rules) permanecem como `TODO` — são de responsabilidade de outros papéis, fora do escopo deste exercício.

## Ordem recomendada de leitura
1. `01-agents-v1-secoes-tech-lead.md`
2. `copilot-teste-v1/`
3. `02-analise-v1.md`
4. `03-agents-v2-secoes-tech-lead.md`
5. `copilot-teste-v2/`
6. `04-analise-v2-e-conclusao.md`
