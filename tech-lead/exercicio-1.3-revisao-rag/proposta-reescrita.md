# Proposta Reescrita de Arquitetura RAG (sem overengineering)

## Objetivo
Entregar um assistente de atendimento baseado em RAG com qualidade, rastreabilidade e operacao sustentavel no stack Azure.

## Arquitetura proposta

### 1) Ingestao e indexacao
- Fontes: SharePoint, Confluence e planilhas de referencia.
- Execucao: pipeline automatizado diario + gatilho por publicacao de novo documento.
- SLA operacional: novo documento disponivel para busca em ate 24h.
- Normalizacao: extração de texto, OCR para escaneados, identificacao de tabela.

### 2) Chunking e metadados
- Chunking por secao semantica com overlap de 10%.
- Metadados obrigatorios por chunk:
  - documentId
  - versao
  - dataPublicacao
  - vigenciaInicio/vigenciaFim (quando houver)
  - status (ativo/superseded)
  - tipoFonte (normativo, procedimento, FAQ)

### 3) Retrieval
- Busca inicial: top-10 por similaridade vetorial.
- Re-ranking: ordenar por relevancia semantica e peso de tipo de fonte.
- Contexto final: top-6 chunks, com limite de 2 por dominio em perguntas multi-dominio.
- Regra de fonte: documento normativo/procedimento tem prioridade sobre FAQ em resposta critica.

### 4) Geracao
- LLM de producao: GPT-4o no Azure OpenAI.
- Prompt de sistema com guardrails:
  - citar fonte
  - nao inventar informacao
  - responder formalmente
  - declarar insuficiencia quando sem cobertura

### 5) Guardrails deterministicos (harness)
- Validar se a resposta contem citacao de fonte.
- Bloquear resposta com termos proibidos/padroes invalidos.
- Se confianca de retrieval baixa: forcar resposta de insuficiencia.
- Em contradicao de versoes: expor ambas, indicar vigente quando metadado permitir.

### 6) Observabilidade e regressao
- Logs por chamada:
  - pergunta
  - chunks recuperados e score
  - chunks enviados ao LLM
  - fontes citadas na resposta
  - acao de fallback/blocked
- Suite de regressao automatica com perguntas do Anexo B.
- Alerta de custo e latencia por rota de prompt.

## Parametros iniciais sugeridos
- Orcamento de contexto: 10.000 tokens de entrada por query.
- Reserva de resposta: ate 800 tokens.
- Timeout de resposta: 15s alvo, 30s maximo.

## O que foi mantido da proposta original
- Uso de Azure AI Search + GPT-4o.

## O que foi corrigido
- Ingestao manual -> automatizada com SLA.
- Chunking fixo -> semantico com overlap.
- Top-3 fixo -> top-10 + re-ranking + top-6 final.
- Ausencia de governanca -> metadados de versao, guardrails deterministicos e observabilidade.

## Justificativa de nao overengineering
- Mantem stack principal simples (Azure Search + GPT-4o).
- Adiciona somente controles necessarios para reduzir risco real de producao.
- Evita arquitetura hibrida complexa no MVP.
