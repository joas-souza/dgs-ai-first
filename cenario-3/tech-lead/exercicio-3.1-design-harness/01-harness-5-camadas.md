# Design do Harness — NovaTech Assistant (5 camadas)

> Papel: Tech Lead. Ferramenta: Claude (chat). Base: cenário completo do Cenário 3, código real em `cenario-2/novatech-assistant/`, ADR-0002 (`cenario-1/tech-lead/exercicio-1.1-adrs/ADR-0002-contexto.md`) e AGENTS.md do projeto.

Para cada camada: **o que já está implementado**, **o que falta**, **como fechar o gap**.

---

## 1. Tool orchestration

**Já implementado:**
- Pipeline de ingestão determinístico e sequencial: `chunker.ts` → `embedder.ts` → `indexer.ts`, processando os 847 documentos para o Azure AI Search.
- Query endpoint com um fluxo único: pergunta → `search.ts` (busca de chunks) → `prompt-builder.ts` (monta prompt respeitando ADR-0002) → `completion.ts` (chama o GPT-4o) → resposta com fonte.
- O bot do Teams reaproveita o mesmo query endpoint — não há uma segunda implementação de orquestração para o mesmo fluxo (evita divergência entre canais).

**Falta:**
- Não existe uma etapa de orquestração explícita **depois** da chamada ao modelo. Hoje `completion.ts` devolve a resposta e o handler já retorna — não há um passo formal de "verificar antes de responder".
- Não há bifurcação de fluxo para baixa confiança: uma resposta com `confidence_score: baixa` segue exatamente o mesmo caminho que uma de alta confiança até o atendente.

**Como fechar o gap:**
- Inserir uma etapa obrigatória entre `completion.ts` e o `return` do handler: `completion → verification loop → [suspeito ou baixa confiança?] → fila de revisão humana : retorno direto`.
- Documentar esse fluxo revisado no AGENTS.md, seção "Tech Stack & Architecture", como o diagrama oficial do pipeline (hoje o diagrama para em "resposta com fonte", sem mencionar verificação).

---

## 2. Verification loops

**Já implementado:** nenhuma verificação automática de output. É a lacuna que motivou esta fase — 12% de respostas incorretas em teste interno, sem nada que capture isso antes de chegar ao atendente.

**Falta:**
1. Validação de **schema** (structured output) — garantir que `answer`, `source_document` e `confidence_score` sempre existem.
2. Validação de **guardrails de conteúdo** — regras determinísticas de negócio (ex: carga perigosa + devolução deve negar).
3. Validação de **fonte** — o `source_document` citado precisa existir na lista de documentos válidos da NovaTech (não pode ser um documento inventado).

**Como fechar o gap:**
- (1) e (2) são escopo do Dev 3.1 (`src/services/response-validator.ts`, ainda vazio no repositório — Zod schema + os 2 guardrails determinísticos).
- (3) é o que este exercício implementa agora: uma função de verification loop que recebe a resposta do modelo e confirma que a fonte citada está na lista de documentos válidos (`05-source-verifier.ts`, com execução real em `07-execucao-real.txt`; processo completo com o Copilot, incluindo um bug real encontrado e corrigido, em `02-prompt-copilot.md` a `04-code-review-v1.md`).
- As três verificações devem compor a mesma etapa da camada 1 (tool orchestration) — nenhuma resposta chega ao atendente sem passar pelas três.

---

## 3. Context & memory

**Já implementado:** a ADR-0002 já define as regras e elas já estão espelhadas no AGENTS.md (seção "Gerenciamento de contexto"):
- Orçamento: ~4.000 tokens de system prompt + ~8.000 tokens de chunks.
- No máximo 5 chunks por query, ~1.500 tokens cada.
- Histórico limitado às últimas 3 trocas, sem acumular texto bruto.
- Corte por menor score de relevância quando o orçamento estoura.

Esta camada **não reabre a decisão** — ela é a mesma da ADR-0002. O papel do harness aqui é garantir que o código realmente obedece o que a ADR decidiu.

**Falta:** a regra está escrita (ADR + AGENTS.md), mas não há nada que **impeça em runtime** que `prompt-builder.ts` extrapole o orçamento — hoje é confiança na implementação, não uma trava verificável.

**Como fechar o gap:**
- Teste de integração que injeta 10 chunks candidatos de scores variados e assevera que no máximo 5 chegam ao prompt final montado por `prompt-builder.ts`.
- Teste que mede o tamanho real do prompt montado (tokenizer real, ex: `tiktoken`) e falha se ultrapassar o orçamento de ~12.000 tokens totais da ADR-0002.
- Esses testes viram parte do regression testing citado no Exercício PS 3.2 — mudanças futuras no prompt-builder não podem quebrar o orçamento silenciosamente.

---

## 4. Guardrails

**Já implementado:** os guardrails de produto foram formalizados pelo Product Specialist no Cenário 2 (formato DEVE / NÃO DEVE / QUANDO EM DÚVIDA), mas **a seção "Product Rules & Guardrails" do AGENTS.md ainda está com `<!-- TODO (Product Specialist — Ex. 2.3) -->`** — ou seja, o guardrail existe como decisão, mas ainda não foi consolidado no documento que os agentes de IA realmente leem. Isso é, em si, um risco de governança tratado no Exercício 3.2 deste papel.

**Falta:**
- Aplicar guardrails via dois mecanismos complementares, como o cenário pede:
  - **Structured output (determinístico, camada de código):** schema Zod `{ answer, source_document, confidence_score }`. Resposta que não bate com o schema é rejeitada antes mesmo de avaliar o conteúdo.
  - **Guardrails de negócio (determinístico, camada de código):** regra "carga perigosa + devolução ⇒ resposta deve negar", que é crítica demais para depender só do prompt (probabilístico).
  - **Prompt (probabilístico):** instruções de tom, escopo e comportamento geral — aceitável errar ocasionalmente, desde que a rede determinística abaixo pegue os casos de alto risco.
- **Human-in-the-loop:** quando `confidence_score = Baixa` **ou** quando o verification loop marcar a resposta como suspeita (fonte inválida, guardrail de carga perigosa disparado em resposta ambígua), a resposta **não** vai direto ao atendente — fica retida numa fila de revisão humana (supervisor de atendimento) antes de liberação. Esse é o ponto de HITL obrigatório desta camada.

**Como fechar o gap:**
- Completar `response-validator.ts` (Dev 3.1: Zod + 2 guardrails).
- Integrar a função `verifySourceDocument` (este exercício) ao mesmo pipeline de validação.
- Implementar a fila/flag de revisão humana no handler do query endpoint (`src/functions/query/handler.ts`) quando `suspicious = true` ou `confidence = Baixa`.
- Substituir o `TODO` do AGENTS.md pelos guardrails formalizados de fato — sem isso, o Copilot continua gerando código sem essa referência.

---

## 5. Observability

**Já implementado:** logger estruturado (`pino`) existe em `src/shared/logger.ts` e é usado nos handlers. Não há, porém, métricas agregadas, dashboards ou alertas — cada log é um evento isolado.

**Falta:** métricas de qualidade (% de respostas marcadas suspeitas pelo verifier, % de confiança baixa), técnicas (latência, taxa de erro) e de conteúdo (documentos mais citados, perguntas sem resposta). O plano completo de observabilidade é entregável do Delivery Manager (Exercício 3.2), mas a camada de harness precisa garantir que o **dado bruto existe** para esse plano funcionar.

**Como fechar o gap:**
- Cada execução do verification loop (schema, guardrails, fonte) deve logar via `pino`, de forma estruturada, o resultado (`suspicious`, `reason`, `source_document`, `confidence_score`) — não apenas a resposta final.
- Isso transforma o verifier implementado neste exercício na fonte primária de dado para a métrica de qualidade "% de respostas suspeitas", que o Delivery Manager vai agregar no relatório semanal.

---

## Resumo — bloqueante vs. desejável para o go-live

| Camada | Bloqueante para o go-live | Desejável (pode evoluir depois) |
|---|---|---|
| Tool orchestration | Etapa de verificação inserida entre modelo e resposta | Reorquestração para multi-canal além de Teams/painel |
| Verification loops | Schema + 2 guardrails de conteúdo + verificação de fonte | Verificação de estilo/tom da resposta |
| Context & memory | Nenhuma trava nova — ADR-0002 já implementada; testes de regressão do orçamento | Tokenizer exato por modelo (hoje aproximação) |
| Guardrails | Guardrails formalizados consolidados no AGENTS.md + HITL para baixa confiança/fonte suspeita | Guardrails adicionais para novos tipos de carga |
| Observability | Log estruturado do resultado do verification loop | Dashboard e alertas automatizados (Exercício DM 3.2) |
