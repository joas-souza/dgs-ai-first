# ADR-0001: Escolha do Modelo de LLM para Assistente de Atendimento NovaTech
## Status: Proposto

## Contexto
Precisamos selecionar o LLM para um assistente de atendimento integrado ao ecossistema Microsoft (Teams + SharePoint + Azure). O volume estimado e de 320 chamados/dia, com cerca de 60% envolvendo consulta documental. Requisitos-chave: minimizar alucinacao, citar fonte, suportar contexto suficiente para perguntas compostas e manter custo operacional previsivel.

Escopo avaliado:
- Azure OpenAI com GPT-4o
- Claude via API
- Modelos open-source via Ollama

## Decisao
Adotar Azure OpenAI (GPT-4o) como modelo principal de producao na fase inicial, com avaliacao trimestral de benchmark contra Claude em amostra controlada de perguntas reais.

Diretrizes associadas:
- O controle de nao alucinacao sera desenhado principalmente no pipeline RAG e nos guardrails deterministicos, nao apenas no modelo.
- Open-source via Ollama fica restrito a laboratorio de P&D para casos especificos de custo e privacidade, sem entrada imediata em producao.

## Consequencias
Positivas:
- Integracao nativa com stack Azure existente, reduzindo friccao operacional.
- Menor tempo para hardening de seguranca, observabilidade e governanca.
- Menor risco de dispersao tecnologica no inicio do projeto.

Negativas:
- Risco de lock-in em fornecedor.
- Custo por token pode aumentar com crescimento de volume.
- Dependencia de roadmap e disponibilidade regional do provedor.

## Alternativas consideradas
1. Claude via API
- Pontos fortes: qualidade alta em tarefas complexas e boa consistencia em raciocinio.
- Motivo de nao escolha agora: menor aderencia operacional ao stack Azure como caminho principal no contexto atual.

2. Open-source via Ollama
- Pontos fortes: potencial reducao de custo por inferencia e maior controle de hospedagem.
- Motivo de nao escolha agora: maior custo operacional (MLOps, tuning, observabilidade, seguranca), variabilidade de qualidade e risco de atraso para objetivo de 3 meses.

## Estimativa de custo por token (Base, Pico, Stress)
Premissas operacionais:
- Chamados/dia: 320
- Percentual com consulta documental: 60%
- Consultas ao assistente/dia: 192
- Horizonte mensal de planejamento: 30 dias

Premissas de tokens por consulta:
- Base: 4.000 tokens de entrada + 600 tokens de saida
- Pico: 6.500 tokens de entrada + 900 tokens de saida
- Stress: 9.000 tokens de entrada + 1.200 tokens de saida

Formula de custo:
- Custo diario = (Input_Mtokens_dia x Preco_Input_USD_por_1M) + (Output_Mtokens_dia x Preco_Output_USD_por_1M)
- Custo mensal = Custo diario x 30

Volume estimado por cenario:

| Cenario | Input/dia (M tokens) | Output/dia (M tokens) | Input/mes (M tokens) | Output/mes (M tokens) |
|---|---:|---:|---:|---:|
| Base | 0.7680 | 0.1152 | 23.0400 | 3.4560 |
| Pico | 1.2480 | 0.1728 | 37.4400 | 5.1840 |
| Stress | 1.7280 | 0.2304 | 51.8400 | 6.9120 |

Simulacao financeira para planejamento (valores de referencia, nao contratuais):
- Preco_Input_USD_por_1M = 5
- Preco_Output_USD_por_1M = 15

| Cenario | Custo diario estimado (USD) | Custo mensal estimado (USD) |
|---|---:|---:|
| Base | 5.57 | 167.04 |
| Pico | 8.83 | 264.96 |
| Stress | 12.10 | 362.88 |

Observacoes de governanca de custo:
- Atualizar os dois parametros de preco com valores reais do tenant Azure antes de aprovacao orcamentaria.
- Monitorar semanalmente tokens de entrada/saida por rota de prompt para recalibrar top-k e tamanho de contexto.
- Definir alertas de anomalia para variacao >20% no custo diario por 3 dias consecutivos.
