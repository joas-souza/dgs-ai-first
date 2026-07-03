# Exercício 2.3 — Criação e teste de skills técnicas

## Objetivo
Escrever o `SKILL.md` da skill `azure-functions-endpoint` (nível Domain), testar com o Copilot, iterar com base no resultado real, e definir critérios objetivos de maturidade.

## Entregável exigido no enunciado
- SKILL.md completo.
- Outputs do Copilot (antes e depois).
- Critérios de maturidade.

## Estrutura da pasta
- `01-skill-v1.md` — primeira versão da skill.
- `copilot-teste-v1/echo/` — endpoint de exemplo (`echo`) gerado pelo Copilot com a v1.
- `02-analise-v1.md` — o que foi seguido/ignorado, com causa raiz.
- `03-skill-v2.md` — versão revisada: layout de arquivos e fluxo de erro de validação viram regras prescritivas com exemplo DO/DON'T.
- `copilot-teste-v2/echo/` — mesmo prompt, mesmo endpoint, com a v2.
- `04-criterios-maturidade.md` — quando uma skill está pronta para uso pelo time, aplicado à própria skill testada aqui.

O endpoint `echo` é um sandbox de teste da skill, não um dos 5 módulos de spec do projeto.

## Onde o resultado final foi aplicado
A v2 foi copiada para `cenario-2/novatech-assistant/skills/domain/azure-functions-endpoint.md`, o arquivo real que o repositório já reservava para esta skill (Anexo C).

## Ordem recomendada de leitura
1. `01-skill-v1.md`
2. `copilot-teste-v1/echo/`
3. `02-analise-v1.md`
4. `03-skill-v2.md`
5. `copilot-teste-v2/echo/`
6. `04-criterios-maturidade.md`
