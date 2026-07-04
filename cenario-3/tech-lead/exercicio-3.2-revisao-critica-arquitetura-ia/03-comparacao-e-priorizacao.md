# Comparação e priorização (2 semanas até a demo)

## Comparação honesta

| Achado | Eu (Tech Lead) | Claude |
|---|---|---|
| AGENTS.md com seções TODO (PS/QA/DM) é bloqueante | Sim | Sim |
| `prompt-changelog.md` vazio confirma o risco do system prompt | Sim | Sim |
| Cobertura "~75%" não tem evidência no código real ainda | Sim | Sim |
| Pipeline/endpoint 60-70% Copilot é o maior risco de erro silencioso | Sim | Sim |
| Narrativa "3 skills" não bate com as 10 skills reais do repo, e a skill testada é Domain, não Foundation (maior raio de impacto sem teste) | **Não vi isso** — assumi a categoria "Foundation" do resumo sem cruzar com o repositório real | Sim |
| Viés de autoavaliação nas seções do AGENTS.md (quem escreveu decidiu que estava pronto) | Implícito, não nomeado | Sim, nomeado explicitamente |
| Falta de changelog do prompt é também furo de HITL, não só de rastreabilidade | Não conectei à camada de Guardrails do harness | Sim |

**Onde eu estava incompleto:** não cruzei o resumo simulado ("3 skills") com o estado real do repositório (10 arquivos de skill) — só teria pego esse erro se tivesse desconfiado de um número redondo demais no resumo. É exatamente o tipo de erro que a revisão em dupla existe para pegar.

**Onde o Claude não acrescentou nada novo:** nos 4 achados de base (AGENTS.md, pipeline/endpoint, cobertura, changelog vazio), a segunda opinião confirmou sem contradizer — não achei isso suspeito de concordância automática porque os 4 são verificáveis diretamente no repositório (TODO literal, arquivo vazio, pastas de teste sem arquivos), não é uma questão de opinião.

## Priorização para as 2 semanas

**Verificar primeiro (maior redução de risco por esforço):**
1. **Seções TODO do AGENTS.md** — sem os guardrails de produto documentados, o Copilot continua gerando código sem essa referência. Baixo esforço (o Product Specialist já formalizou o conteúdo no Cenário 2; falta só consolidar no arquivo), alto impacto.
2. **Testar as skills de Foundation não refinadas** — maior raio de impacto (afetam todo código gerado), esforço médio (mesmo processo já usado em `azure-functions-endpoint.md`: v1 → teste real → v2).
3. **Reconstruir o changelog do prompt a partir da v6 atual** — baixo esforço, resolve o risco de rollback às cegas para a próxima mudança (mesmo sem recuperar o histórico das 5 versões anteriores).

**Aceitar como risco residual monitorado (não dá para eliminar em 2 semanas):**
- **Cobertura real do pipeline/endpoint gerado por Copilot.** Reescrever ou re-auditar 60-70% de código em 2 semanas não é viável. Mitigação: não eliminar o risco, mas capturá-lo — o verification loop do Exercício 3.1 (schema + guardrails + verificação de fonte) e o plano de observabilidade do Delivery Manager (Exercício 3.2) juntos garantem que, se esse código errar em produção, o erro aparece como resposta suspeita/log estruturado em vez de passar despercebido. É o argumento central do harness: quando não dá para confiar 100% no que a IA gerou, compensa-se com verificação e observabilidade, não com um adiamento indefinido do go-live.
- **Skills de Domain e Artifact não testadas além da já validada.** Menor raio de impacto que Foundation — aceitável priorizar depois do go-live, com o processo de melhoria contínua do harness de produto (Exercício Product Specialist 3.2).
