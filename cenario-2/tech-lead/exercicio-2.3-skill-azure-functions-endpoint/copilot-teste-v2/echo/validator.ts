// Gerado pelo GitHub Copilot com a skill azure-functions-endpoint v2.
import { z } from "zod";

export const echoInputSchema = z.object({ text: z.string().min(1) });

export function parseEchoInput(body: unknown) {
  return echoInputSchema.safeParse(body);
}
