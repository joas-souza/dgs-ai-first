# Plano de Execução — Tech Lead (Cenário 2)

## Escopo
Esta pasta cobre exclusivamente os 3 exercícios do papel **Tech Lead** no Cenário 2 (Fase de Estruturação), descritos em `cenario-2/exercicio-2-fase-estruturacao.md`. Os exercícios dos demais papéis (Delivery Manager, Product Specialist, Desenvolvedor, QA) não fazem parte desta entrega.

## Avaliação da estrutura em pastas
Mesmo critério usado no Cenário 1: uma pasta por exercício, porque cada um tem entregável e critérios de avaliação próprios (AGENTS.md, arquitetura de MCP, skill técnica). Isso evita misturar evidência de um exercício com a de outro e facilita rastrear o que foi pedido versus o que foi entregue.

## Estrutura adotada
- `exercicio-2.1-agents-md/`: construção e teste do AGENTS.md (seções do Tech Lead), com iteração v1 → v2 baseada em output real do Copilot.
- `exercicio-2.2-mcp-arquitetura/`: arquitetura de governança dos MCP servers locais, com health check **executado de verdade** e evidência de execução.
- `exercicio-2.3-skill-azure-functions-endpoint/`: SKILL.md da skill `azure-functions-endpoint`, também com iteração v1 → v2 baseada em output real do Copilot, e critérios de maturidade.

## Ordem recomendada de execução
1. **Exercício 2.1 (AGENTS.md)** — define a constitution do projeto (stack, arquitetura, coding standards). É pré-requisito conceitual para os outros dois: a skill do exercício 2.3 herda regras do AGENTS.md (logging, tipagem), e a arquitetura de MCP do exercício 2.2 é uma das coisas que o AGENTS.md pressupõe que os agentes conseguem acessar.
2. **Exercício 2.2 (Arquitetura de MCP)** — garante que os agentes têm acesso real (via MCP) ao código, specs, skills e documentação antes de depender deles para gerar artefatos.
3. **Exercício 2.3 (Skill técnica)** — usa o padrão de código já fixado no AGENTS.md (exercício 2.1) para especificar, em detalhe, como um tipo específico de artefato (endpoint HTTP) deve ser gerado.

Essa ordem reduz retrabalho: sem o AGENTS.md, não haveria uma base de coding standards para a skill herdar; sem os MCP servers funcionando, o teste da skill/AGENTS.md com o Copilot ficaria sem acesso real ao repositório.

## Metodologia comum aos 3 exercícios
Em todos os 3, o padrão foi: **escrever uma v1 → testar com o Copilot gerando código real → analisar o que foi seguido/ignorado com causa raiz → reescrever uma v2 mais prescritiva (regra + exemplo DO/DON'T, não só descrição) → retestar com o mesmo prompt → comparar**. As saídas do Copilot mostradas em `copilot-teste-v1/` e `copilot-teste-v2/` são exemplos isolados de sandbox (endpoints `ping` e `echo`), não fazem parte dos 5 módulos de spec do projeto — isso evita sobrepor com o trabalho dos exercícios de Dev e Product Specialist, que são donos dos módulos reais.

## O que foi alterado no repositório real (`cenario-2/novatech-assistant/`)
| Arquivo | Exercício | Mudança |
|---|---|---|
| `AGENTS.md` | 2.1 | Seções Project Overview, Tech Stack & Architecture, Coding Standards e Build & Deploy preenchidas (v2) |
| `.mcp/mcp.json` | 2.2 | Populado com os 4 servers locais (`filesystem`, `git`, `memory`, `everything`) |
| `scripts/mcp-health-check.mjs` | 2.2 | Script novo — sobe cada server via MCP real e reporta status |
| `package.json` | 2.2 | Adiciona `@modelcontextprotocol/sdk` (dev) e o script `npm run mcp:health`; adiciona `@azure/functions` e `pino` como dependências (necessárias para os exemplos de código do AGENTS.md/skill funcionarem de verdade) |
| `skills/domain/azure-functions-endpoint.md` | 2.3 | SKILL.md completo (v2) |

Nenhum outro arquivo do repositório (specs, demais skills, código dos 5 módulos, prompts) foi tocado — são escopo de outros papéis/exercícios.
