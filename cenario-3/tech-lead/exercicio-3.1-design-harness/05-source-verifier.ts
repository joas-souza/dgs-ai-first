// source-verifier.ts — camada "Verification loops" do harness (Tech Lead, Exercício 3.1)
// Gerado com apoio do GitHub Copilot.
//
// Responsabilidade única: checar se o `source_document` citado por uma resposta
// do assistente existe na lista de documentos válidos da NovaTech. Não valida
// schema nem guardrails de conteúdo — isso é escopo de `response-validator.ts`
// (Dev, Exercício 3.1). Este verifier é composto com aquele na mesma etapa do
// pipeline (ver 01-harness-5-camadas.md, camada 2).

export const VALID_SOURCE_DOCUMENTS = [
  "POL-001",
  "PROC-042",
  "PROC-042-v2",
  "SLA-2024",
  "FAQ-Atendimento",
] as const;

export type ValidSourceDocument = (typeof VALID_SOURCE_DOCUMENTS)[number];

export interface ModelResponse {
  answer: string;
  source_document: string | null | undefined;
  confidence_score?: "Alta" | "Média" | "Baixa";
}

export interface SourceVerificationResult {
  suspicious: boolean;
  reason?: string;
}

const VALID_SET = new Set<string>(VALID_SOURCE_DOCUMENTS);

/**
 * Verifica se a fonte citada por uma resposta do modelo é uma fonte válida
 * conhecida da NovaTech. Usa identificadores curtos (ex: "POL-001"), não o
 * título completo do documento.
 */
export function verifySourceDocument(
  response: ModelResponse
): SourceVerificationResult {
  const source = response.source_document?.trim();

  if (!source) {
    return {
      suspicious: true,
      reason: "source_document ausente ou vazio na resposta",
    };
  }

  if (!VALID_SET.has(source)) {
    return {
      suspicious: true,
      reason: `source_document "${source}" não consta na lista de documentos válidos da NovaTech (${VALID_SOURCE_DOCUMENTS.join(", ")})`,
    };
  }

  return { suspicious: false };
}
