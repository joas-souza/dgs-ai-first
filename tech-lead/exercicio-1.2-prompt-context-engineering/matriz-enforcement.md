# Enforcement: Probabilistico vs Deterministico

## Probabilistico (no prompt)
- Instruir para citar fonte em toda resposta.
- Instruir para nao inventar prazos/valores/regras.
- Instruir para declarar insuficiencia de contexto.
- Instruir tom e formato de resposta.

Limite:
- O modelo pode descumprir instrucoes em casos de ambiguidade, pressao de contexto ou conflito de sinais.

## Deterministico (fora do prompt / harness)
- Validar que a resposta final contem citacao no padrao esperado.
- Rejeitar resposta com termos proibidos ou entidades inexistentes (ex.: "tier Platinum" como tier valido).
- Validar consistencia de fontes (ex.: nao aceitar so FAQ para regra critica sem sinalizacao).
- Aplicar fallback automatico para "informacao insuficiente" quando retrieval vier abaixo do limiar.
- Logar telemetria de falhas de regra e bloquear resposta sem fonte.

## Decisao de arquitetura
- Prompt define comportamento esperado (probabilistico).
- Harness garante conformidade minima (deterministico).
- Regras criticas de negocio e compliance nao podem depender apenas do prompt.

## Regras criticas no harness
1. `has_citation == true`
2. `forbidden_terms == 0`
3. `critical_question_without_formal_source == blocked`
4. `low_retrieval_confidence -> forced_no_answer`
