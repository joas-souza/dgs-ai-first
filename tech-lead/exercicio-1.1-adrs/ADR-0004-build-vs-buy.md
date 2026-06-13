# ADR-0004: Build vs Buy para Pipeline de RAG
## Status: Proposto

## Contexto
Precisamos escolher entre montar pipeline com componentes open-source (LangChain/LlamaIndex + ChromaDB/FAISS) ou adotar stack gerenciada (Azure AI Search + Azure OpenAI). A empresa ja opera no Azure e possui janela de projeto de 3 meses.

## Decisao
Adotar estrategia Buy-first para producao inicial com Azure AI Search + Azure OpenAI, mantendo trilha Build-controlada para experimentos pontuais.

Diretrizes associadas:
- Producao: stack gerenciada para reduzir complexidade operacional e acelerar go-live.
- Laboratorio: experimentacao open-source em ambiente separado para avaliar ganhos de custo/qualidade sem comprometer cronograma.

## Consequencias
Positivas:
- Menor carga de operacao e manutencao no periodo critico do projeto.
- Integracao mais direta com seguranca, identidade e monitoramento Azure.
- Tempo de entrega menor para MVP com governanca.

Negativas:
- Menor flexibilidade em customizacoes profundas de retrieval.
- Risco de custos recorrentes mais altos em escala.
- Dependencia de capacidades e limites da plataforma gerenciada.

## Alternativas consideradas
1. Build completo desde o inicio
- Pontos fortes: controle maximo de indexacao, retrieval e ranking.
- Motivo de descarte: maior risco de prazo e custo operacional no discovery+build+go-live em 3 meses.

2. Buy completo sem trilha de benchmark
- Motivo de descarte: reduz capacidade de negociacao de custo e evolucao tecnica futura.

3. Arquitetura hibrida complexa ja no MVP
- Motivo de descarte: overengineering para fase inicial.
