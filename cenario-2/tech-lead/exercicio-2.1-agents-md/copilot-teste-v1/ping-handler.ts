// Gerado pelo GitHub Copilot com o AGENTS.md v1 presente no repositório.
// Prompt usado: "Crie um endpoint de exemplo Azure Function (HTTP trigger) chamado
// ping, que recebe um nome via query string e devolve uma saudação. Gere também
// um teste para esse endpoint."
// Sandbox de teste do AGENTS.md — não faz parte dos módulos de spec do projeto.

export async function pingHandler(request: any, context: any) {
  console.log("ping recebido", request.query.get("name"));

  const name = request.query.get("name") || "atendente";

  try {
    const body = { message: `Olá, ${name}!` };
    return { status: 200, jsonBody: body };
  } catch (e) {
    console.log("erro no ping", e);
    return { status: 500, jsonBody: { error: "internal error" } };
  }
}
