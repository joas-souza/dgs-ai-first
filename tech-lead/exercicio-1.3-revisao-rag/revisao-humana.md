# Revisao Tecnica Humana - Proposta RAG (Exercicio 1.3)

## Proposta avaliada
"Vamos usar Azure AI Search com embeddings do ada-002. Todos os documentos serao indexados num unico indice. Chunking fixo de 512 tokens sem overlap. O LLM recebe os 3 chunks mais similares. Usaremos GPT-4o para geracao. O pipeline de ingestao roda manualmente quando alguem lembra de atualizar."

## Problemas e riscos identificados (revisao propria)

### 1) Ingestao manual e risco operacional alto
- Problema: "roda quando alguem lembra" torna o processo nao confiavel.
- Risco: respostas desatualizadas, descumprimento da meta de atualizacao em ate 24h.
- Impacto: qualidade e confianca do atendimento.

### 2) Top-3 chunks como regra unica
- Problema: insuficiente para perguntas multi-dominio.
- Risco: cobertura parcial para perguntas que cruzam devolucao + frete + SLA.
- Impacto: resposta truncada e baixa completude.

### 3) Indice unico sem estrategia de metadados/versionamento
- Problema: mistura documentos vigentes e superseded sem tratamento claro.
- Risco: contradicoes (PROC-042 v1 vs v2) contaminando a resposta.
- Impacto: erro de regra aplicada ao cliente.

### 4) Nao ha estrategia explicita para perguntas sem cobertura
- Problema: sem regra de fallback, o LLM tende a preencher lacunas.
- Risco: alucinacao.
- Impacto: risco operacional/comercial.

### 5) Nao ha mecanismo de guardrails deterministicos
- Problema: confiar apenas no prompt para citacao e nao alucinacao.
- Risco: respostas sem fonte e termos inventados passarem para producao.
- Impacto: conformidade e auditabilidade comprometidas.

### 6) Nao ha plano de avaliacao/retrieval
- Problema: arquitetura sem metricas e sem baseline de qualidade.
- Risco: regressao silenciosa apos mudanca de prompt ou documento.
- Impacto: degradacao progressiva do assistente.

## Sintese
A proposta e viavel como rascunho, mas esta incompleta para producao. Os maiores riscos estao em governanca de dados (ingestao/versionamento), cobertura de contexto (top-3 fixo) e controle de qualidade (sem validacao automatizada).
