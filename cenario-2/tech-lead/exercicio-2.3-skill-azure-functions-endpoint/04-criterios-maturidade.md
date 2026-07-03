# Critérios para "skill madura"

Uma skill está pronta para uso pelo time (deixa de ser rascunho e passa a ser referência oficial) quando atende a todos os critérios abaixo:

1. **Testada com o agente real, não só lida por humano.** A skill precisa ter sido usada para gerar pelo menos um artefato real com o Copilot (ou outro agente) e o output comparado regra a regra com o que a skill pede. Ex.: `copilot-teste-v1/` e `copilot-teste-v2/` desta pasta.

2. **Toda regra tem um exemplo de código, não só uma frase.** Se uma regra só existe como texto ("valide o input", "trate erros"), ela conta como não testada até ter um DO/DON'T ao lado. A v1 desta skill tinha 3 regras só em texto; nenhuma foi seguida pelo Copilot na prática (ver `02-analise-v1.md`).

3. **Taxa de aderência ≥ 90% num teste de regeneração.** Gerar o mesmo artefato 2-3 vezes com o mesmo prompt; se alguma regra crítica (layout de arquivos, tratamento de erro) falha em mais de 1 a cada 10 gerações, a regra precisa de mais um exemplo ou uma reformulação mais explícita antes de a skill ser considerada madura.

4. **Anti-padrões vêm de observação real, não de suposição.** Os anti-padrões listados devem ser erros que o agente realmente cometeu durante o teste (como os 3 listados na v2, vindos diretamente da análise v1) — não uma lista genérica de "coisas que IA erra".

5. **Dependências declaradas e existentes.** As skills Foundation/Domain referenciadas em "Dependências" precisam existir (mesmo que como rascunho) — uma skill que aponta para uma dependência inexistente não é madura, é aspiracional.

6. **Zero regras conflitantes com o AGENTS.md.** Uma skill madura nunca contradiz uma regra da constitution do projeto (ex.: se o AGENTS.md diz "nunca `console.log`", a skill não pode mostrar um exemplo com `console.log`, nem por engano).

## Status da skill `azure-functions-endpoint`
| Critério | v1 | v2 |
|---|---|---|
| 1. Testada com agente real | Sim | Sim |
| 2. Toda regra com exemplo | Não (3 regras só em texto) | Sim |
| 3. Taxa de aderência ≥ 90% | Não avaliado (só 1 rodada) | Não avaliado ainda — próximo passo antes de declarar madura |
| 4. Anti-padrões de observação real | Parcial | Sim |
| 5. Dependências existentes | Sim (`typescript-conventions.md`, `error-handling.md`, `project-structure.md`, `testing-patterns.md` — pastas já existem em `skills/`) | Sim |
| 6. Sem conflito com AGENTS.md | Sim | Sim |

**Conclusão:** a v2 está pronta para uso, mas ainda não pode ser declarada "madura" no sentido pleno do critério 3 — falta rodar mais 2-3 regenerações com o mesmo prompt (ou prompts variados para o mesmo tipo de endpoint) e confirmar que o layout de 3 arquivos e o `safeParse` se mantêm estáveis antes de tratá-la como padrão definitivo e parar de revisá-la a cada uso.
