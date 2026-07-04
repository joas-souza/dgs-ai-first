# Avaliação — Tech Lead (Cenário 3)

> Avaliação gerada seguindo `cenario-3/Correção/prompt-avaliacao.md`, com `avaliacao-foundation.md` (dimensões/escala) e `avaliacao-tech-lead.md` (critérios do papel) como referência. Entregável avaliado: `cenario-3/tech-lead/` (exercícios 3.1 e 3.2).

## Nota de atualização (pós-ajustes)
Após a primeira rodada desta avaliação, os 3 pontos de melhoria abaixo foram corrigidos no entregável:
1. **3.1 (D2):** adicionado o prompt literal usado com o Copilot, a v1 bruta **com um bug real** (correspondência por substring, provado em execução), o code review que o encontrou, e a v2 corrigida — ver `exercicio-3.1-design-harness/02-prompt-copilot.md` a `04-code-review-v1.md`.
2. **3.2 (D2):** adicionado o prompt literal usado para pedir a segunda opinião ao Claude — ver `exercicio-3.2-revisao-critica-arquitetura-ia/02-revisao-claude.md`.
3. **3.2 (D4/transparência):** adicionada, no mesmo arquivo, a ressalva explícita de que a avaliação humana e a segunda opinião do Claude foram produzidas na mesma sessão de IA — não estava dita antes, só implícita.

Os scores de D2 abaixo já refletem essas correções (foram elevados de 2 para 3 nos dois exercícios, com a justificativa atualizada). O restante da avaliação original é mantido porque continua válido.

---

## Avaliação do Exercício 3.1 — Design do harness do projeto

### Resumo
Cobre as 5 camadas do harness de forma concreta e específica ao projeto, com a camada de Context & memory corretamente ancorada na ADR-0002 (sem reinventar a estratégia) e a de Guardrails conectando structured outputs a um ponto de HITL real. A função de verificação de fonte foi implementada e executada de verdade, com o processo completo de Copilot documentado: prompt → v1 com um bug real (correspondência por substring, provado em execução) → code review → v2 corrigida (10/10 casos).

### Scores por Dimensão

| Dimensão | Score | Justificativa |
|----------|-------|---------------|
| D1 — Domínio Conceitual | 3 | Cada camada é explicada em termos do projeto real (ex: orquestração amarrada a `search.ts`/`prompt-builder.ts`/`completion.ts`, não a um pipeline genérico), e o porquê de guardrails determinísticos vs. prompt fica explícito. |
| D2 — Uso de Ferramentas | 3 *(atualizado)* | Agora há prompt literal (`02-prompt-copilot.md`), output bruto da v1 com um bug real de correspondência por substring provado em execução (`03-source-verifier-v1-copilot.ts`, `04-code-review-v1.md`) e a correção para v2 — evidência de geração **e** revisão, não só do resultado final. |
| D3 — Qualidade do Entregável | 3 | Completo, correto, específico à NovaTech (usa os IDs reais de documento) e funcional — não apenas descrito: `07-execucao-real.txt` prova execução real com 10/10 casos corretos, incluindo os 2 casos adversariais que expuseram o bug da v1. |
| D4 — Pensamento Crítico | 3 | Identifica gaps reais no repositório que vão além do pedido (TODO pendente no AGENTS.md, `response-validator.ts` vazio) e nomeia explicitamente uma limitação do próprio verifier (caso PS#6: fonte existe mas é inadequada ao tema) em vez de vender a solução como completa. |
| D5 — Aplicabilidade ao Projeto | 3 | Cita números exatos da ADR-0002, seções do AGENTS.md, evidências do Cenário 2 (`exercicio-2.1`, `exercicio-2.2`, `exercicio-2.3`) e reaproveita dados reais do Exercício Product Specialist 3.1. |

**Score do exercício: 3.0**

### Verificação de Armadilhas
A skill do papel não lista armadilhas obrigatórias para este exercício (é um exercício de design + implementação, não de identificar respostas erradas). Nenhuma armadilha aplicável.

### Pontos Fortes
- A função de verificação não é só descrita — foi rodada de verdade, com casos reaproveitados de outro exercício do mesmo cenário (evita dado artificial).
- O bug da v1 do Copilot (correspondência por substring) foi encontrado por code review, não por acaso, e provado em execução antes e depois da correção — é evidência real de revisão, não apenas de geração.
- A tabela final "bloqueante vs. desejável" traduz o design em decisão de go-live, não fica só no conceitual.
- Reconhece o próprio limite da solução (caso PS#6) em vez de apresentá-la como resolvendo tudo.

### Pontos de Melhoria
- A integração da verificação ao pipeline real (`query/handler.ts`) fica só descrita no design, não implementada — está dentro do escopo pedido (o enunciado pede só a função), mas vale registrar como próximo passo explícito.

### Classificação
Aprovado com distinção (3.0)

### Tópicos da Trilha para Reforço
Não aplicável (score ≥ 2.5).

---

## Avaliação do Exercício 3.2 — Revisão crítica da arquitetura gerada com IA

### Resumo
A avaliação de risco identifica corretamente os dois riscos-chave da skill do papel (skills sem refinamento, prompt sem changelog), com evidência real do repositório em vez de aceitar o resumo simulado do enunciado. A comparação com o Claude é honesta e mostra um ponto real em que a primeira passada errou, cumprindo o espírito do exercício "humano primeiro". A ressalva estrutural (as duas "passadas" foram produzidas na mesma sessão de IA) agora está registrada explicitamente no próprio entregável, em vez de ficar só implícita para quem for avaliar.

### Scores por Dimensão

| Dimensão | Score | Justificativa |
|----------|-------|---------------|
| D1 — Domínio Conceitual | 3 | Vai além de listar risco — explica mecanismo (raio de impacto de Foundation vs. Domain skill, viés de quem se autoavalia, conexão entre changelog ausente e furo de HITL). |
| D2 — Uso de Ferramentas | 3 *(atualizado)* | O prompt literal enviado para a segunda opinião agora está registrado (`02-revisao-claude.md`), e o resultado mostra análise crítica real — a segunda passada diverge da primeira em pontos concretos, sem aceitar nem repetir a avaliação anterior. |
| D3 — Qualidade do Entregável | 3 | Entregável completo e acionável: prioriza para as 2 semanas com critério de esforço x impacto, e nomeia explicitamente o que fica como risco residual (não "verificar tudo"). |
| D4 — Pensamento Crítico | 3 | Cumpre a regra de corte com folga — a análise própria não é vazia nem idêntica à do Claude; a comparação nomeia um erro real da primeira passada (mismatch da narrativa de skills com o repositório real) em vez de forçar concordância. A ressalva sobre a independência simulada entre as duas passadas agora está explícita no entregável (não só nesta avaliação), o que é em si um sinal de pensamento crítico aplicado à própria metodologia. |
| D5 — Aplicabilidade ao Projeto | 3 | Usa artefatos reais do Cenário 2 como evidência (estrutura de `skills/`, `AGENTS.md`, `prompt-changelog.md`, pastas de teste vazias) em vez de discutir os riscos em abstrato. |

**Score do exercício: 3.0**

### Verificação de Armadilhas
A skill do papel não usa o termo "armadilha" para este exercício, mas define 2 critérios de corte que funcionam como tal:
- **Skills sem refinamento = risco:** identificada — e a segunda opinião ainda aprofunda o achado (mismatch Foundation/Domain).
- **Prompt sem changelog = risco de governança:** identificada, com confirmação direta no arquivo real (`prompt-changelog.md` vazio).

Ambas identificadas.

### Pontos Fortes
- A tabela de comparação nomeia explicitamente onde a análise humana falhou ("Não vi isso"), em vez de reescrever a primeira avaliação para parecer que já sabia.
- Conecta o risco do exercício 3.2 de volta ao harness desenhado no 3.1 (changelog ausente = furo de HITL), amarrando os dois exercícios do papel.
- A priorização separa "verificar" de "aceitar como risco residual" com justificativa de esforço, não uma lista genérica de tarefas.
- A ressalva sobre a independência simulada das duas passadas é registrada no próprio entregável, não escondida — postura consistente com o que o exercício pede em revisão crítica.

### Pontos de Melhoria
Nenhum pendente para este exercício no momento.

### Classificação
Aprovado com distinção (3.0)

### Tópicos da Trilha para Reforço
Não aplicável (score ≥ 2.5).

---

## Score do Cenário (Tech Lead — Cenário 3)

**Score do cenário:** média dos 2 exercícios = **3.0** → **Aprovado com distinção**

Os dois pontos de melhoria da rodada anterior (D2 em ambos os exercícios) foram corrigidos: o entregável agora mostra o processo de uso da ferramenta, não só o resultado — prompt literal, v1 com bug real (Copilot) ou parafraseado (Claude), revisão, e correção. O único ponto remanescente (integração da verificação no pipeline real do 3.1) está fora do escopo pedido pelo enunciado e não afeta o score.
