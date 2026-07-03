// Gerado pelo GitHub Copilot com o AGENTS.md v1 presente no repositório.

import { pingHandler } from "./ping-handler";

test("ping works", async () => {
  const request = { query: new Map([["name", "Ana"]]) };
  const result = await pingHandler(request, {});
  expect(result).toBeDefined();
});
