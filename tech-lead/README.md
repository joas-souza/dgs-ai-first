# Plano de Execucao - Tech Lead

## Avaliacao da estrutura em pastas
Faz sentido separar por pasta, porque cada exercicio tem entregaveis diferentes e criterios de avaliacao especificos.

Beneficios práticos:
- Evita mistura entre decisao arquitetural (1.1), estrategia de prompt/contexto (1.2) e revisao tecnica (1.3).
- Facilita revisao por pares e rastreabilidade de evidencias.
- Permite evolucao incremental sem perder historico.

## Estrutura adotada
- exercicio-1.1-adrs/: ADRs e historico de devil's advocate.
- exercicio-1.2-prompt-context-engineering/: estrategia de prompts como codigo e testes.
- exercicio-1.3-revisao-rag/: revisao tecnica, comparacao e proposta reescrita.

## Ordem recomendada de execucao
1. Exercício 1.1 (ADRs)
2. Exercício 1.2 (Prompt/Context Engineering)
3. Exercício 1.3 (Revisao critica de arquitetura RAG)

Essa ordem reduz retrabalho: as decisoes do 1.1 orientam as escolhas de 1.2 e os criterios de revisao de 1.3.
