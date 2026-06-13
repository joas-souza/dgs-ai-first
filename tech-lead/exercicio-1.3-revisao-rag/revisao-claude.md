# Revisao Assistida por IA (Claude) - Exercicio 1.3

## Prompt usado para segunda revisao
"Revise criticamente a proposta de arquitetura RAG abaixo para um assistente de atendimento logistico. Liste problemas tecnicos reais, riscos e impactos. Seja objetivo e priorize riscos de producao. Proposta: Azure AI Search com embeddings ada-002; indice unico; chunking fixo 512 sem overlap; top-3 chunks; GPT-4o para geracao; ingestao manual quando alguem lembrar."

## Achados consolidados da revisao assistida

### A) Embeddings desatualizados para cenario atual
- Achado: uso de modelo de embedding antigo pode limitar qualidade semantica.
- Risco: retrieval pior em perguntas compostas/ambiguidade lexical.

### B) Falta de re-ranking
- Achado: pipeline para em similaridade vetorial bruta.
- Risco: chunk relevante fora do top-3 por ruído semantico.

### C) Ausencia de segmentacao por tipo de fonte
- Achado: FAQ e documento normativo tratados de forma equivalente.
- Risco: FAQ "pratico" sobrepor regra formal.

### D) Ausencia de controles de custo e latencia
- Achado: nao ha politicas de budget de tokens/tempo.
- Risco: variacao de custo e tempo de resposta sem governanca.

### E) Nao ha estrategia de avaliacao continua
- Achado: nao define suite de regressao para retrieval e resposta final.
- Risco: mudancas em prompt/documento degradarem qualidade sem deteccao.

### F) Nao ha desenho de observabilidade
- Achado: sem logs estruturados de retrieval, fonte citada e decisao de fallback.
- Risco: investigacao de incidentes dificil e sem rastreabilidade.

## Observacao
Esta revisao assistida foi usada como par de pensamento para ampliar riscos; a decisao final permanece humana.
