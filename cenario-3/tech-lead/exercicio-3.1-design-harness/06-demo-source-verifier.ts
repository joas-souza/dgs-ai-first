// Demonstração executável de verifySourceDocument (v2, pós code review — ver
// 04-code-review-v1.md), usando como casos de teste as próprias respostas
// simuladas do Exercício Product Specialist 3.1 (mesmo cenário, papel
// diferente) — reaproveita exemplos reais em vez de inventar casos
// artificiais, mais os casos adversariais que expuseram o bug da v1 do
// Copilot. Rodado com `npx tsx 06-demo-source-verifier.ts`; saída real
// capturada em 07-execucao-real.txt.

import { verifySourceDocument, VALID_SOURCE_DOCUMENTS, type ModelResponse } from "./05-source-verifier";

interface Case {
  label: string;
  response: ModelResponse;
  expectedSuspicious: boolean;
  note: string;
}

const cases: Case[] = [
  {
    label: "PS#1 — prazo de devolução standard",
    response: { answer: "...", source_document: "POL-001", confidence_score: "Alta" },
    expectedSuspicious: false,
    note: "fonte válida e correta (POL-001 existe e cobre devolução)",
  },
  {
    label: "PS#2 — SLA cliente Silver",
    response: { answer: "...", source_document: "SLA-2024", confidence_score: "Alta" },
    expectedSuspicious: false,
    note: "fonte válida",
  },
  {
    label: "PS#3 — devolução de carga perigosa",
    response: { answer: "...", source_document: "POL-001", confidence_score: "Alta" },
    expectedSuspicious: false,
    note: "fonte válida",
  },
  {
    label: "PS#4 — política de carga danificada (ALUCINAÇÃO)",
    response: { answer: "...", source_document: "Nenhuma", confidence_score: "Alta" },
    expectedSuspicious: true,
    note: "não existe documento sobre isso na base — o modelo inventou a fonte; o verifier pega porque 'Nenhuma' não está na lista",
  },
  {
    label: "PS#5 — SLA tier Enterprise (não documentado)",
    response: { answer: "...", source_document: null, confidence_score: "Baixa" },
    expectedSuspicious: true,
    note: "sem fonte citada — o modelo reconheceu a lacuna corretamente, mas o verifier ainda marca como suspeito para forçar revisão (correto: baixa confiança deve passar por HITL de qualquer forma)",
  },
  {
    label: "PS#6 — carga perigosa com frete expresso (fonte informal)",
    response: { answer: "...", source_document: "FAQ-Atendimento", confidence_score: "Alta" },
    expectedSuspicious: false,
    note: "LIMITAÇÃO CONHECIDA: FAQ-Atendimento está na lista de documentos válidos (existe de fato), então o verifier não marca suspeito — mas o Product Specialist já identificou essa resposta como problemática por OUTRO motivo (fonte informal demais para um tema de compliance). Este verifier só prova que a fonte EXISTE, não que é a fonte ADEQUADA para o tema. Esse segundo julgamento continua sendo humano ou de um guardrail de conteúdo mais específico.",
  },
  {
    label: "Fonte inventada fora da lista",
    response: { answer: "...", source_document: "REGRA-INTERNA-999", confidence_score: "Alta" },
    expectedSuspicious: true,
    note: "documento não existe na NovaTech",
  },
  {
    label: "Fonte com sufixo de seção (formato pré-structured-output)",
    response: { answer: "...", source_document: "POL-001, seção 3.2", confidence_score: "Alta" },
    expectedSuspicious: true,
    note: "hoje (texto livre) o modelo às vezes anexa a seção ao identificador; o verifier faz match exato contra o ID curto e marca como suspeito. Isso não é bug do verifier — é o motivo pelo qual o schema Zod do structured output (Dev 3.1) precisa normalizar `source_document` para conter SÓ o identificador curto antes desta checagem.",
  },
  {
    label: "[bug da v1] ID válido embutido em documento inventado",
    response: { answer: "...", source_document: "PROC-042-v2-RASCUNHO-INTERNO-NAO-REVISADO", confidence_score: "Alta" },
    expectedSuspicious: true,
    note: "a v1 do Copilot (03-source-verifier-v1-copilot.ts) usava correspondência por substring e aprovava este caso como válido só por conter 'PROC-042-v2'. A v2 (match exato) marca corretamente como suspeito — ver 04-code-review-v1.md.",
  },
  {
    label: "[bug da v1] frase qualquer contendo um ID real",
    response: { answer: "...", source_document: "Baseado em POL-001 mas na verdade inventei o resto", confidence_score: "Alta" },
    expectedSuspicious: true,
    note: "mesmo bug: a v1 aprovava qualquer texto que mencionasse 'POL-001' em algum ponto. É o caso mais grave encontrado no code review, porque anularia a verificação para respostas com fonte fabricada mas que citam um ID real de passagem.",
  },
];

console.log(`Documentos válidos: ${VALID_SOURCE_DOCUMENTS.join(", ")}\n`);

let failures = 0;
for (const c of cases) {
  const result = verifySourceDocument(c.response);
  const ok = result.suspicious === c.expectedSuspicious;
  if (!ok) failures++;
  console.log(`[${ok ? "OK" : "FALHOU"}] ${c.label}`);
  console.log(`  fonte citada: ${JSON.stringify(c.response.source_document)}`);
  console.log(`  resultado: suspicious=${result.suspicious}${result.reason ? ` (${result.reason})` : ""}`);
  console.log(`  nota: ${c.note}`);
  console.log("");
}

console.log(`${cases.length - failures}/${cases.length} casos bateram com o esperado.`);
if (failures > 0) {
  process.exitCode = 1;
}
