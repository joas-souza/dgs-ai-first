// Gerado pelo GitHub Copilot com a skill azure-functions-endpoint v2 presente em
// skills/domain/azure-functions-endpoint.md.
// Mesmo prompt do teste v1: "Crie o endpoint 'echo': recebe { text: string } no body
// e devolve { text, length }. Siga a skill azure-functions-endpoint."
// Sandbox de teste da skill — não é um dos 5 módulos de spec do projeto.

import { HttpRequest, InvocationContext, HttpResponseInit } from "@azure/functions";
import { logger } from "../../shared/logger";
import { parseEchoInput } from "./validator";
import { buildEchoResponse, buildValidationErrorResponse } from "./response-builder";

export async function handler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const parsed = parseEchoInput(await request.json());

  if (!parsed.success) {
    logger.error({ issues: parsed.error.issues }, "echo: input inválido");
    return buildValidationErrorResponse(parsed.error);
  }

  logger.info({ length: parsed.data.text.length }, "echo recebido");
  return buildEchoResponse(parsed.data);
}
