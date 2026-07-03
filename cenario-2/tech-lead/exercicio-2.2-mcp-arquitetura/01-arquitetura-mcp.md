# Arquitetura de MCP — NovaTech Assistant

## Contexto
O mapeamento de necessidades (Dev, Ex. 2.1) definiu 4 servers locais e gratuitos. Como Tech Lead, defino aqui como esses servers são tratados como infraestrutura do projeto: escopo/permissões, aprovação de mudanças, monitoramento e versionamento.

Mapeamento recebido (input do exercício, simulado como output do Dev 2.1):
```
(1) filesystem  -> ./src ./specs ./skills (rw) + ./docs/novatech ./data/retrieval-corpus (read-only)
(2) git         -> repositório local (histórico, diff, branches)
(3) memory      -> grafo persistente de decisões e linguagem ubíqua
(4) everything  -> aprendizado das primitivas de MCP
```

**Ajuste feito sobre o mapeamento recebido:** o mapeamento do Dev 2.1 não menciona `docs/adr/` nem `docs/runbooks/`, mas ambos existem no repositório (Anexo C) e são conteúdo que agentes plausivelmente precisam ler (ADRs para respeitar decisões duráveis, runbooks para procedimentos operacionais). Como Tech Lead, estendi o escopo do `filesystem` para incluir essas duas pastas explicitamente — em vez de reintroduzir `./docs` inteiro (que também exporia `docs/onboarding.md`, conteúdo só para humanos, sem necessidade de acesso por agente). O escopo efetivo e versionado em `.mcp/mcp.json` é:
```
filesystem -> ./src ./specs ./skills (rw)
            + ./docs/novatech ./docs/adr ./docs/runbooks ./data/retrieval-corpus (uso pretendido: leitura)
```
Isso corrige uma inconsistência identificada em revisão: uma versão anterior deste documento já descrevia o escopo estreito abaixo, mas o `.mcp/mcp.json` real ainda usava `./docs` e `./data` inteiros (o exemplo "de formato" do Anexo C) — ou seja, diagrama e configuração versionada divergiam. Least privilege só vale se o artefato aplicado bater com o que está documentado.

## Diagrama — servers, consumidores e escopo

```
                     ┌─────────────────────────┐
                     │   Agentes de IA          │
                     │  (Claude Code, Copilot)  │
                     └────────────┬─────────────┘
                                  │ MCP (stdio, local)
        ┌───────────────┬────────┴────────┬───────────────┐
        │               │                 │               │
        ▼               ▼                 ▼               ▼
 ┌─────────────┐  ┌───────────┐    ┌─────────────┐  ┌─────────────┐
 │ filesystem   │  │   git     │    │   memory    │  │ everything  │
 │              │  │           │    │             │  │             │
 │ rw:          │  │ escopo:   │    │ escopo:     │  │ escopo:     │
 │  ./src       │  │ repo      │    │ grafo local │  │  nenhum     │
 │  ./specs     │  │ local     │    │ (decisões,  │  │ (aprendiz.  │
 │  ./skills    │  │ (.git)    │    │ linguagem   │  │ de MCP)     │
 │ leitura      │  │           │    │ ubíqua)     │  │             │
 │ (pretendida):│  │           │    │             │  │             │
 │  ./docs/     │  │           │    │             │  │             │
 │   novatech   │  │           │    │             │  │             │
 │  ./docs/adr  │  │           │    │             │  │             │
 │  ./docs/     │  │           │    │             │  │             │
 │   runbooks   │  │           │    │             │  │             │
 │  ./data/     │  │           │    │             │  │             │
 │   retrieval- │  │           │    │             │  │             │
 │   corpus     │  │           │    │             │  │             │
 └─────────────┘  └───────────┘    └─────────────┘  └─────────────┘
      │                  │                │
      ▼                  ▼                ▼
 código, specs,     histórico,       decisões e
 skills do repo     diffs, branches  glossário do
 + docs de negócio,                  domínio
 ADRs, runbooks e
 chunks (leitura)
```

**Nota sobre "leitura":** o reference server `@modelcontextprotocol/server-filesystem` não impõe permissão diferenciada por pasta — todo path listado nos `args` recebe o mesmo acesso de leitura/escrita. "Leitura" nas pastas de negócio/ADR/runbooks é, portanto, uma convenção reforçada pelo AGENTS.md (instrução ao agente para nunca escrever nessas pastas), não uma garantia técnica do transporte MCP — ver risco R1 em `03-plano-contingencia.md`.

Consumidores: todo agente de IA usado no projeto (Claude chat/Code, GitHub Copilot) consome os 4 servers via `.mcp/mcp.json` na raiz do repositório. Nenhum papel não-dev (Delivery Manager, Product Specialist, QA) precisa dos MCP servers do repositório — usam Claude/Cowork/Design fora deste escopo.

## Política de aprovação de novos servers

Todo server novo (ou mudança de escopo de um existente) segue este fluxo antes de entrar em `.mcp/mcp.json`:

1. **Proposta**: quem propõe abre um PR local (`docs/pull-requests/PR-NNNN.md`) descrevendo: o server, por que é necessário, quais tools/resources expõe, e o escopo/pasta que vai receber.
2. **Revisão de escopo (obrigatória, feita pelo Tech Lead)**: checklist de least privilege —
   - O escopo é a menor pasta possível para a necessidade descrita? (não aceitar `.` ou a raiz do repo como escopo do `filesystem`.)
   - Se o server só precisa ler, ele está configurado como read-only (ou documentado como tal, já que o reference server `filesystem` não impõe read-only nativamente — ver risco R1 em `03-plano-contingencia.md`)?
   - O server evita expor `.env`, segredos ou credenciais (nenhuma pasta com `.env`/chaves dentro do escopo)?
   - O server é local e gratuito (sem custo, sem dependência de serviço externo pago)?
3. **Aprovação**: Tech Lead aprova ou pede ajuste de escopo. Sem aprovação, o server não é adicionado ao `.mcp/mcp.json` versionado.
4. **Versionamento**: a mudança em `.mcp/mcp.json` é commitada junto com o PR local, referenciando o motivo no corpo do commit (Conventional Commits, `chore(mcp): ...`).

## Monitoramento

Como todos os servers rodam localmente (processos filhos via `npx`/`uvx`, protocolo stdio), "monitorar" nesta fase significa **checar sob demanda**, não observabilidade contínua em produção. O mecanismo é o script de health check (`02-health-check.mjs`), que qualquer membro do time roda antes de uma sessão de trabalho longa com agentes:

- Verifica se o processo do server sobe e responde ao handshake MCP (`initialize` + `tools/list`/`resources/list`).
- Para o `filesystem`, confirma que as pastas configuradas existem e são legíveis no disco.
- Reporta por server: `OK`, `DEGRADADO` (subiu mas não respondeu no tempo esperado) ou `INDISPONÍVEL` (não subiu — comando ausente, pacote não resolvido, pasta inexistente).

Não há alerta automático (não é um serviço rodando em background) — o time roda o script manualmente ou via um passo opcional de setup local. Isso é proporcional ao escopo desta fase (ambiente local, sem produção real).

## Versionamento e não regressão

- `.mcp/mcp.json` é versionado no Git como qualquer arquivo de configuração do projeto.
- Toda mudança de escopo (adicionar/remover pasta de um server) exige rodar o health check antes e depois da mudança, e anexar as duas saídas ao PR local — isso evita que um escopo mais restrito quebre silenciosamente um fluxo que dependia da pasta removida.
- `mcp.example.json` permanece como template comentado (sem `_comment` no arquivo real usado pelos agentes, já que alguns clients MCP rejeitam campos desconhecidos no JSON); mudanças de formato são feitas primeiro no example, testadas, e só depois propagadas ao `mcp.json` real.

## Processo — uso de ferramentas neste exercício

- **Claude (chat)**: usado para redigir a v1 deste documento (diagrama, política de aprovação, monitoramento, versionamento) a partir do mapeamento Dev 2.1, do Anexo C e do enunciado do exercício.
- **GitHub Copilot**: usado dentro do repositório (com `.mcp/mcp.json` já populado) para gerar o esqueleto do script de health check (`scripts/mcp-health-check.mjs`) a partir do prompt "crie um script Node que leia `.mcp/mcp.json`, suba cada server via MCP real (SDK oficial, sem mock) e reporte status, tools e resources expostos". O esqueleto gerado foi ajustado manualmente para: (a) usar `StdioClientTransport`/`Client` do `@modelcontextprotocol/sdk` em vez de `child_process` cru sugerido inicialmente pelo Copilot; (b) checar cada pasta do `filesystem` individualmente (`checkFilesystemDirs`), o que o esqueleto original não fazia; (c) nunca falhar o processo (`exit code` sempre 0), já que é uma ferramenta de diagnóstico manual, não um gate de CI.
- Esta revisão pós-avaliação (ajuste de escopo do `filesystem`, correção da referência ao risco R1, esta seção de processo) foi feita com apoio do Claude, revisando o feedback do avaliador contra os arquivos reais do repositório.
