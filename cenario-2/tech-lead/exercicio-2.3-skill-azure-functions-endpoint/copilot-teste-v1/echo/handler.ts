// Gerado pelo GitHub Copilot com a skill azure-functions-endpoint v1 presente em
// skills/domain/azure-functions-endpoint.md.
// Prompt usado: "Crie o endpoint 'echo': recebe { text: string } no body e devolve
// { text, length }. Siga a skill azure-functions-endpoint."
// Sandbox de teste da skill — não é um dos 5 módulos de spec do projeto.

import { HttpRequest, InvocationContext, HttpResponseInit } from "@azure/functions";
import { z } from "zod";
import { logger } from "../../shared/logger";

const schema = z.object({ text: z.string().min(1) });

export async function handler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const body = await request.json();
  const input = schema.parse(body);

  logger.info({ length: input.text.length }, "echo recebido");

  return {
    status: 200,
    jsonBody: { text: input.text, length: input.text.length },
  };
}
