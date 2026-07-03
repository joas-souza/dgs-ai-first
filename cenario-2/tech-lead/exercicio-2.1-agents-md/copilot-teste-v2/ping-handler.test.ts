// Gerado pelo GitHub Copilot com o AGENTS.md v2 presente no repositório.

import { describe, it, expect, vi } from "vitest";
import { pingHandler } from "./ping-handler";

function makeRequest(name?: string) {
  return {
    query: { get: (key: string) => (key === "name" ? name : null) },
  } as any;
}

describe("pingHandler", () => {
  it("should return a greeting with the given name when name is valid", async () => {
    const result = await pingHandler(makeRequest("Ana"), {} as any);

    expect(result.status).toBe(200);
    expect(result.jsonBody).toEqual({ message: "Olá, Ana!" });
  });

  it("should default to 'atendente' when name is not provided", async () => {
    const result = await pingHandler(makeRequest(undefined), {} as any);

    expect(result.status).toBe(200);
    expect(result.jsonBody).toEqual({ message: "Olá, atendente!" });
  });

  it("should return 400 when name is an empty string", async () => {
    const result = await pingHandler(makeRequest(""), {} as any);

    expect(result.status).toBe(400);
    expect(result.jsonBody).toEqual({ error: "invalid_input" });
  });
});
