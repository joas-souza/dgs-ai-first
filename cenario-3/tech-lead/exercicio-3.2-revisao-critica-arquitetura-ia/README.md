# Exercício 3.2 — Revisão crítica da arquitetura gerada com IA

## Objetivo
Avaliar o risco de 4 artefatos do projeto terem sido gerados com apoio de IA (AGENTS.md, skills, pipeline/query endpoint, system prompt), com uma avaliação humana independente antes de consultar o Claude, e priorizar o que verificar nas 2 semanas até a demo.

## Entregável exigido no enunciado
- Avaliação de risco própria (antes do Claude).
- Complementação/segunda opinião do Claude.
- Priorização: o que verificar primeiro, o que aceitar como risco residual.

## Estrutura da pasta
- `01-avaliacao-risco-tech-lead.md` — avaliação feita primeiro, com acesso ao repositório real `cenario-2/novatech-assistant/` (não só ao resumo simulado do enunciado).
- `02-revisao-claude.md` — segunda opinião pedida ao Claude sobre os mesmos 4 artefatos, sem ver a avaliação anterior antes.
- `03-comparacao-e-priorizacao.md` — tabela de comparação achado a achado (onde bati, onde o Claude achou algo que eu não vi), e a priorização final para as 2 semanas.

## Achado central
A avaliação humana inicial não cruzou o resumo simulado do enunciado ("3 skills, a Foundation foi refinada") com o estado real do repositório (10 arquivos de skill, e a única com evidência de teste real é uma skill de Domain, não de Foundation — raio de impacto maior sem cobertura do que o resumo sugeria). Essa foi a principal lacuna que a segunda opinião do Claude expôs, documentada com honestidade em `03-comparacao-e-priorizacao.md`.

## Ajuste pós-avaliação
A avaliação em `cenario-3/tech-lead/avaliacao.md` (Exercício 3.2, D2 e D4) apontou duas lacunas, ambas corrigidas em `02-revisao-claude.md`:
1. O prompt usado para pedir a segunda opinião ao Claude estava só parafraseado — agora está registrado literalmente.
2. Faltava deixar explícito que a avaliação humana e a segunda opinião foram produzidas na mesma sessão de IA (em turnos separados, sem contexto cruzado) — uma ressalva estrutural que um avaliador de certificação precisa saber para calibrar a confiança na independência da primeira passada.
