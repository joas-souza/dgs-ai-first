# Anatomia de Contexto da Query

## Estrutura completa por chamada
1. System prompt (estatico)
2. Metadados do cliente (dinamico)
3. Chunks recuperados pelo RAG (dinamico)
4. Pergunta do atendente (dinamico)
5. Historico resumido da conversa (dinamico, crescente)

## Partes estaticas vs dinamicas
- Estaticas:
  - Objetivo do assistente
  - Politicas de fonte e nao alucinacao
  - Formato de resposta
- Dinamicas:
  - tier do cliente
  - unidade/regiao
  - chunks recuperados
  - pergunta atual
  - resumo da conversa

## Orcamento de contexto (recomendado)
- Limite total por query: 10.000 tokens (entrada)
- Reserva de saida: ate 800 tokens
- Alerta operacional: acima de 8.500 tokens de entrada

Distribuicao sugerida de entrada:
- System prompt: 600 tokens
- Metadados cliente: 200 tokens
- Chunks recuperados: 6.000 tokens
- Pergunta do usuario: 300 tokens
- Historico resumido: 1.400 tokens
- Margem tecnica: 1.500 tokens

## Estrategia de recuperacao
- Busca inicial: top-10
- Re-ranking: top-6 para envio final
- Multi-dominio: no maximo 2 chunks por dominio, teto global de 6

## Politica anti-context rot
- A cada 5 turnos, substituir historico bruto por resumo estruturado.
- Em mudanca de topico, resetar historico de tarefa e manter apenas fatos persistentes.
- Nunca reenviar historico completo de sessoes longas.

## Regra para perguntas sem cobertura
Se os chunks formais nao atingirem limiar minimo de similaridade, responder:
"Nao encontrei informacao suficiente nos documentos fornecidos."

## Exemplo de empacotamento
- System: regras e formato
- Metadata: {tier: Gold, canal: Teams, regiao: Norte}
- Contexto RAG: [POL-001-A, POL-001-B, PROC-042v2-A, PROC-042v2-B]
- Pergunta: "Prazo de devolucao + carga perigosa + frete especial"
- Historico resumido: "Cliente questionou elegibilidade e impacto no prazo"
