// Gerado pelo GitHub Copilot com a skill azure-functions-endpoint v2.
import { HttpResponseInit } from "@azure/functions";
import { ZodError } from "zod";
import { echoInputSchema } from "./validator";
import { z } from "zod";

type EchoInput = z.infer<typeof echoInputSchema>;

export function buildEchoResponse(input: EchoInput): HttpResponseInit {
  return { status: 200, jsonBody: { text: input.text, length: input.text.length } };
}

export function buildValidationErrorResponse(error: ZodError): HttpResponseInit {
  return { status: 400, jsonBody: { error: "invalid_input", issues: error.issues } };
}
