# ADR-0003: Tratamento de Documentos Contraditorios no RAG
## Status: Proposto

## Contexto
Foram identificadas contradicoes entre versoes de procedimentos. Se o sistema colapsar conteudos em uma unica verdade sem metadados, pode induzir erro operacional. O requisito do produto exige mostrar ambas as versoes com indicacao temporal quando houver conflito.

## Decisao
Manter versoes contraditorias com metadados de vigencia e origem, e resolver apresentacao ao usuario por regra deterministica antes da resposta final.

Diretrizes associadas:
- Ingestao deve preservar: id do documento, versao, data de publicacao, data de vigencia (quando existir), area responsavel e status (ativo/superseded).
- Retrieval deve retornar versoes potencialmente conflitantes quando houver alta similaridade para o mesmo topico.
- Camada de regras deve detectar conflito e instruir a resposta a:
  - Exibir as duas versoes com datas.
  - Indicar qual versao esta vigente (quando metadado permitir).
  - Sinalizar necessidade de validacao humana quando nao houver vigencia clara.

## Consequencias
Positivas:
- Aderencia ao requisito de transparencia e rastreabilidade.
- Reduz risco de resposta incorreta por simplificacao indevida.
- Trata contradicao como problema de dados e governanca, nao apenas de prompt.

Negativas:
- Maior complexidade de modelagem de metadados.
- Pode aumentar tamanho de resposta em casos de conflito.
- Exige disciplina de atualizacao das areas donas dos documentos.

## Alternativas consideradas
1. Manter apenas versao mais recente
- Motivo de descarte: pode ocultar regra ainda vigente por falta de metadado confiavel.

2. Delegar completamente ao LLM decidir versao correta
- Motivo de descarte: comportamento probabilistico e pouco auditavel para decisao normativa.

3. Bloquear resposta sempre que houver conflito
- Motivo de descarte: conservador demais para operacao diaria; deve haver saida util com transparencia.
