# Devil's Advocate - ADR-0001 (Escolha do LLM)

## Tese inicial
Azure OpenAI (GPT-4o) como principal em producao.

## Contra-argumentos levantados
1. Risco de lock-in e dependencia comercial elevada.
2. Custo pode ficar imprevisivel com crescimento de uso e contexto amplo.
3. Qualidade pode variar por tipo de pergunta; talvez outro modelo performe melhor em casos especificos.
4. Confiar no modelo como principal mitigacao de alucinacao e uma premissa fraca.

## Ajustes incorporados na ADR final
- Inclusao de benchmark trimestral contra Claude em amostra controlada de perguntas reais.
- Explicitacao de que mitigacao de alucinacao deve estar no RAG + guardrails deterministicos.
- Trilho de P&D open-source mantido fora de producao para opcao futura de custo/controle.

## Ganho de robustez
A decisao deixou de ser "ferramenta favorita" e passou a ser uma estrategia com governanca de custo, qualidade e risco.
