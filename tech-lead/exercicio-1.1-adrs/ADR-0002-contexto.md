# ADR-0002: Estrategia de Gerenciamento de Contexto no Pipeline RAG
## Status: Proposto

## Contexto
A base documental e heterogenea e possui contradicoes em alguns procedimentos. O bot no Teams pode receber perguntas encadeadas na mesma sessao, elevando risco de context rot e perda de foco. Precisamos definir limites objetivos de contexto, recuperacao de chunks e comportamento para perguntas multi-dominio (SLA + frete + devolucao).

## Decisao
Adotar uma estrategia de contexto em camadas com orcamento fixo por query e politica de memoria conversacional resumida.

Diretrizes associadas:
- Orcamento maximo de contexto por query: 10.000 tokens (excluindo resposta).
- Recuperacao base: top-10 chunks por similaridade semantica.
- Re-ranking: selecionar top-6 finais para envio ao LLM.
- Perguntas multi-dominio: usar retrieval por dominio (SLA, frete, devolucao), com no maximo 2 chunks por dominio, respeitando teto global de 6 chunks.
- Historico de conversa: manter apenas resumo estruturado das ultimas interacoes (memoria curta), descartando texto bruto antigo.
- Politica anti-context rot: reset parcial de memoria a cada 5 trocas ou quando houver mudanca de topico detectada.
- Regra de sem cobertura: se nenhum chunk formal superar limiar minimo de similaridade, responder explicitamente que a base nao contem informacao suficiente.

## Consequencias
Positivas:
- Reduz saturacao do contexto e melhora foco da resposta.
- Mantem cobertura para perguntas multi-dominio sem inflar tokens.
- Facilita observabilidade por metrica (tokens por parte, cobertura de dominio, taxa de citacao).

Negativas:
- Risco de perda de nuance ao resumir historico.
- Necessidade de calibracao continua de top-k e tamanho de chunks.
- Maior complexidade de orquestracao que um retrieval simples.

## Alternativas consideradas
1. Contexto grande sem orcamento rigido
- Motivo de descarte: tende a elevar custo e piorar sinal/ruido, ampliando context rot.

2. Top-3 chunks fixo sem estrategia multi-dominio
- Motivo de descarte: cobertura insuficiente para perguntas que cruzam politicas.

3. Manter historico integral da conversa
- Motivo de descarte: crescimento descontrolado de tokens e degradacao progressiva de qualidade.
