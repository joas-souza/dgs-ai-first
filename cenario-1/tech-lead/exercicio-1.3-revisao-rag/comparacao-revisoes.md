# Comparacao: Revisao Humana vs Revisao Assistida (Claude)

## O que a revisao assistida encontrou e eu nao tinha explicitado
1. Embeddings possivelmente desatualizados para qualidade semantica.
2. Falta de re-ranking entre retrieval bruto e contexto final.
3. Equivalencia indevida entre fontes formais e FAQ.
4. Falta de desenho de observabilidade (logs e trilha de auditoria).

## O que eu havia identificado e a revisao assistida nao enfatizou
1. Risco de descumprir atualizacao em 24h por ingestao manual.
2. Necessidade de regra explicita para perguntas sem cobertura.
3. Risco especifico de contradicao v1 vs v2 (vigencia documental).

## Matriz consolidada: problema -> alternativa

| Problema | Origem | Alternativa proposta |
|---|---|---|
| Ingestao manual | Humana | Pipeline automatizado com agendamento e gatilho por atualizacao; SLA de reindexacao <= 24h |
| Chunking fixo sem overlap | Humana | Chunking por secao + overlap de 10% e tratamento dedicado para tabelas |
| Top-3 fixo | Humana | top-10 na busca + re-ranking + top-6 final com limite por dominio |
| Indice unico sem vigencia | Humana | Metadados de versao/vigencia/status e regra de resolucao de conflito |
| Sem fallback para sem cobertura | Humana | Regra deterministica de "informacao insuficiente" com limiar de confianca |
| Sem guardrails deterministicos | Humana | Pos-processamento: validacao de citacao, bloqueio de termos proibidos e fallback |
| Sem avaliacao continua | Ambas | Suite de regressao retrieval + geracao com casos do Anexo B |
| Embeddings antigos | Claude | Avaliar modelo de embedding atual do stack e benchmark A/B |
| Sem re-ranking | Claude | Inserir camada de re-ranking semantico antes do envio ao LLM |
| FAQ no mesmo peso de norma | Claude | Peso por tipo de fonte; regra formal prevalece sobre FAQ |
| Sem controle de custo/latencia | Claude | Budget de tokens por query, timeout e alertas de custo |
| Sem observabilidade | Claude | Log estruturado de chunks, score, fontes citadas e decisao de fallback |

## Conclusao honesta
- A revisao humana foi mais forte em risco de operacao e governanca documental.
- A revisao assistida agregou pontos de arquitetura de retrieval (re-ranking, embedding, observabilidade).
- Combinadas, as duas revisoes geram uma proposta final mais robusta e ainda pragmatica.
