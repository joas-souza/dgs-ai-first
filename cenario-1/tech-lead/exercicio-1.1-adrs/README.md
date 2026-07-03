# Exercicio 1.1 - Decisoes arquiteturais documentadas como ADRs

## Objetivo
Registrar 4 decisoes arquiteturais do projeto como ADRs independentes, com trade-offs explicitos, baseadas nas capacidades e limitacoes reais de IA generativa.

## Entregavel exigido no enunciado
- 4 ADRs completos no formato especificado.
- Historico de devil's advocate para ao menos 2 das 4 decisoes.

## Formato obrigatorio de cada ADR
- Status
- Contexto
- Decisao
- Consequencias
- Alternativas consideradas

## Decisoes cobertas nesta pasta
- ADR-0001: Escolha do modelo de LLM
- ADR-0002: Estrategia de gerenciamento de contexto
- ADR-0003: Tratamento de documentos contraditorios
- ADR-0004: Build vs buy para pipeline de RAG

## Estrutura da pasta
- ADR-0001-llm.md
- ADR-0002-contexto.md
- ADR-0003-contradicoes.md
- ADR-0004-build-vs-buy.md
- devils-advocate/
  - ADR-0001-rodada.md
  - ADR-0004-rodada.md

## Checklist rapido de conformidade
- Cada ADR pode ser lido isoladamente.
- Cada decisao explicita beneficios, riscos e alternativas.
- ADR-0002 cobre context rot, orçamento de contexto e perguntas multi-dominio.
- ADR-0003 trata contradicao como problema de dados e governanca, nao apenas de prompt.
- O historico de devil's advocate mostra como a decisao foi fortalecida.
