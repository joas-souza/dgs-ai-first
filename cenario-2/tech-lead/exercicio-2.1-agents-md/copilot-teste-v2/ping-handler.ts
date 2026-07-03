// Gerado pelo GitHub Copilot com o AGENTS.md v2 presente no repositório.
// Mesmo prompt do teste v1: "Crie um endpoint de exemplo Azure Function (HTTP trigger)
// chamado ping, que recebe um nome via query string e devolve uma saudação.
// Gere também um teste para esse endpoint."
// Sandbox de teste do AGENTS.md — não faz parte dos módulos de spec do projeto.
// Caminhos de import assumem a posição hipotética src/functions/ping/handler.ts
// (mesmo nível de src/functions/query/handler.ts), só para ilustrar o padrão.

import { HttpRequest, InvocationContext, HttpResponseInit } from "@azure/functions";
import { z } from "zod";
import { logger } from "../../shared/logger";
import { ValidationError } from "../../shared/errors";

const pingQuerySchema = z.object({
  name: z.string().min(1).default("atendente"),
});

export async function pingHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const parsed = pingQuerySchema.safeParse({
    name: request.query.get("name") ?? undefined,
  });

  if (!parsed.success) {
    logger.error({ issues: parsed.error.issues }, "ping: input inválido");
    return { status: 400, jsonBody: { error: "invalid_input" } };
  }

  const { name } = parsed.data;

  try {
    logger.info({ name }, "ping recebido");
    return { status: 200, jsonBody: { message: `Olá, ${name}!` } };
  } catch (err) {
    if (err instanceof ValidationError) {
      logger.error({ err }, "ping: erro de validação");
      return { status: 400, jsonBody: { error: err.message } };
    }
    logger.error({ err }, "ping: erro interno");
    return { status: 500, jsonBody: { error: "internal_error" } };
  }
}
