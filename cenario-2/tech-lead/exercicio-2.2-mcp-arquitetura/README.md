# Exercício 2.2 — Arquitetura de MCP do projeto (servers locais)

## Objetivo
Definir a arquitetura de MCP do projeto (servers, escopos, aprovação, monitoramento, versionamento) e comprovar, com execução real, que os servers locais configurados realmente sobem e respondem.

## Entregável exigido no enunciado
- Documento de arquitetura de MCP (diagrama, política de aprovação, monitoramento, versionamento).
- Script de health check **funcional, com saída de execução real**.
- Plano de contingência para servers indisponíveis.

## Estrutura da pasta
- `01-arquitetura-mcp.md` — diagrama de servers/consumidores/escopo, política de aprovação, monitoramento, versionamento.
- `02-health-check-output.txt` — saída real de `npm run mcp:health` rodado nesta máquina.
- `03-plano-contingencia.md` — o que fazer quando um server cai, usando a indisponibilidade real do `git` (observada na execução acima) como caso concreto.

## Correção pós-avaliação
Uma autoavaliação formal (D1-D5) identificou que o `.mcp/mcp.json` real usava o escopo amplo de exemplo do Anexo C (`./docs`, `./data` inteiros) enquanto o diagrama em `01-arquitetura-mcp.md` já descrevia um escopo mais estreito (least privilege) — diagrama e configuração versionada divergiam. Correções aplicadas:
1. `.mcp/mcp.json`: escopo do `filesystem` estreitado para `./docs/novatech ./docs/adr ./docs/runbooks ./data/retrieval-corpus` (em vez de `./docs ./data` inteiros) — `docs/onboarding.md`, conteúdo só para humanos, ficou de fora.
2. `03-plano-contingencia.md`: adicionado o risco "R1" (referenciado, mas antes inexistente) e "R2", documentando a limitação do server de referência quanto a RW/RO por path.
3. `01-arquitetura-mcp.md`: adicionada seção "Processo — uso de ferramentas" e nota reconciliando o diagrama com o `.mcp.json` real.
4. `02-health-check-output.txt`: regravado com saída real de uma nova execução (`npm run mcp:health`) contra o escopo estreitado, confirmando cada pasta individualmente (incluindo `docs/novatech` especificamente, como o enunciado pede).

## O que foi implementado no repositório real (`cenario-2/novatech-assistant/`)
- `.mcp/mcp.json` — populado com os 4 servers locais e gratuitos (`filesystem`, `git`, `memory`, `everything`); escopo do `filesystem` estreitado após a correção acima.
- `scripts/mcp-health-check.mjs` — script Node que usa o `@modelcontextprotocol/sdk` para subir cada server via stdio, fazer o handshake MCP real (`initialize`) e listar tools/resources expostos; para o `filesystem`, também confirma que as pastas configuradas existem no disco.
- `package.json` — adiciona `@modelcontextprotocol/sdk` (devDependency) e o script `npm run mcp:health`.

## Resultado real da execução (não simulado)
`filesystem`, `memory` e `everything` sobem via `npx` e respondem corretamente. `git` (via `uvx mcp-server-git`) falhou nesta máquina porque `uv`/`uvx` não está instalado — um caso real, não hipotético, do que o plano de contingência precisa cobrir. Ver `02-health-check-output.txt` para a saída completa.

## Nota de escopo
O mapeamento de necessidades (quais servers, para quais pastas) é entregável do exercício **Dev 2.1** e foi recebido aqui apenas como input simulado, conforme o próprio enunciado do exercício Tech Lead 2.2 fornece. A contribuição deste exercício é a camada de governança sobre esses servers (aprovação, monitoramento, versionamento, contingência) e a prova de que a configuração funciona de verdade — não a escolha dos servers em si.
