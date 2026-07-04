// source-verifier.ts — OUTPUT BRUTO DO COPILOT (v1), NÃO CORRIGIDO.
// Mantido aqui só como evidência do que foi gerado antes do code review.
// A versão usada de fato pelo projeto é 05-source-verifier.ts (v2).

const VALID_DOCS = ["POL-001", "PROC-042", "PROC-042-v2", "SLA-2024", "FAQ-Atendimento"];

export function verifySourceDocument(response: any) {
  const source = response.source_document || "";

  if (!source) {
    return { suspicious: true, reason: "Fonte não informada" };
  }

  const isValid = VALID_DOCS.some((doc) => source.includes(doc));

  if (!isValid) {
    return { suspicious: true, reason: `Fonte "${source}" não reconhecida` };
  }

  return { suspicious: false };
}
