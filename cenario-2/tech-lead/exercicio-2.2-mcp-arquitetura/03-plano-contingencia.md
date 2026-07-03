# Plano de contingência — MCP servers indisponíveis

## Evidência real (não hipotética)
A execução do health check nesta máquina (`02-health-check-output.txt`) já produziu um caso real de indisponibilidade: o server `git` (`uvx mcp-server-git --repository .`) falhou com `MCP error -32000: Connection closed`, porque `uv`/`uvx` (runtime Python usado pelo pacote) não está instalado neste ambiente — só `npx`/Node está disponível. `filesystem`, `memory` e `everything` (todos via `npx`) subiram normalmente e responderam ao handshake MCP, listando suas tools reais.

Isso valida o cenário que o exercício pede para prever, sem precisar simular: **um server pode ficar indisponível por dependência de ambiente ausente**, não só por erro de configuração.

## Regra geral
Quando um server MCP configurado não responde, o agente **deve degradar com aviso explícito, nunca inventar a informação que o server forneceria.**

## Por server

### `filesystem` indisponível ou sem acesso a uma pasta
- Sintoma: `list_directory`/`read_file` falha, ou a pasta não aparece em `list_allowed_directories`.
- Comportamento esperado do agente: informar que não conseguiu acessar `docs/novatech/` ou `data/retrieval-corpus/` e **parar** — não responder pergunta de domínio "de memória"/treino, já que isso reintroduziria o risco de alucinação que o pipeline de RAG existe para evitar.
- Ação do time: rodar `npm run mcp:health`, conferir a saída de `dirChecks` (pasta ausente, sem permissão, ou caminho errado no `.mcp/mcp.json`), corrigir e rodar de novo.

### `git` indisponível (caso real observado nesta execução)
- Sintoma: `Connection closed` ao tentar iniciar o processo — geralmente `uv`/`uvx` não instalado, ou pacote `mcp-server-git` não resolvido.
- Comportamento esperado do agente: não afirmar coisas sobre histórico/branches/diff que não pôde consultar (ex.: não inventar "essa mudança já foi feita antes" sem checar). Se o agente também tiver acesso a terminal (ex.: Claude Code, Copilot em alguns modos), pode cair para `git log`/`git diff` via shell direto como *fallback documentado* — mas isso é uma segunda via, não o MCP, e deve ser declarado explicitamente na resposta do agente ("consultei via terminal, não via MCP git server").
- Ação do time: instalar `uv` (`pip install uv` ou instalador oficial) antes de depender do server `git` via MCP; até lá, o `.mcp/mcp.json` mantém o server declarado (para não esconder a intenção), e o health check documenta o estado real.

### `memory` indisponível
- Sintoma: processo não sobe ou `read_graph` falha.
- Comportamento esperado do agente: não reconstruir decisões/glossário "de cabeça" — avisar que a memória persistente está inacessível e pedir que a decisão relevante seja colada manualmente na conversa se for crítica no momento.

### `everything` indisponível
- Sintoma: processo não sobe.
- Impacto: baixo — server é só para aprendizado das primitivas MCP, não é dependência de nenhum fluxo de produto. Nenhuma ação de contingência necessária além de registrar no health check.

## Regra de ouro
Um agente que diz "não tenho acesso a X no momento" é sempre preferível a um agente que responde como se tivesse consultado X. O health check (`npm run mcp:health`) existe para que essa distinção não dependa de o agente "perceber sozinho" que um server caiu — o time confirma o estado antes de começar uma sessão de trabalho.

## Riscos conhecidos da configuração atual

### R1 — `filesystem` não impõe read-only por pasta
**Risco:** o reference server `@modelcontextprotocol/server-filesystem` concede o mesmo nível de acesso (leitura e escrita) a todos os paths listados em `.mcp/mcp.json`. Isso inclui `./docs/novatech`, `./docs/adr`, `./docs/runbooks` e `./data/retrieval-corpus` — pastas que deveriam ser só-leitura para o agente (são fonte de verdade de negócio, decisões e corpus de retrieval, não artefatos que o agente deve gerar). Um agente mal instruído (ou um prompt malicioso/errado) poderia, tecnicamente, escrever nessas pastas via MCP.

**Mitigação atual (nível processo, não transporte):**
- O AGENTS.md instrui explicitamente os agentes a nunca escrever em `docs/novatech/`, `docs/adr/`, `docs/runbooks/` ou `data/retrieval-corpus/` — apenas ler.
- Mudanças reais nessas pastas (nova política, novo ADR) passam pelo fluxo de PR local (revisão humana), não por escrita direta de agente.
- O health check confirma que as pastas existem e estão acessíveis, mas não impede escrita — não é um controle de segurança, é um diagnóstico de disponibilidade.

**Mitigação futura (nível transporte, não implementada nesta fase):** rodar duas instâncias do server `filesystem` — uma com paths rw (`./src ./specs ./skills`) e outra com um wrapper/proxy que rejeite `write_file`/`edit_file` para os paths de leitura — ou trocar por um server de referência que suporte permissão por path nativamente, caso um esteja disponível no futuro. Fora de escopo para o ambiente local desta fase.

### R2 — `git` depende de `uv`/`uvx`, ausente por padrão em máquinas Node-only
**Risco:** times que só têm Node/npm instalado (sem Python/`uv`) não conseguem subir o server `git` — como observado nesta própria execução (`02-health-check-output.txt`).

**Mitigação:** documentar `uv` como pré-requisito de setup local (`docs/onboarding.md`); até a instalação, o agente cai para o fallback declarado de terminal (ver seção "`git` indisponível" acima).
