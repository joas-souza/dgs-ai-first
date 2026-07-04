# Revisão do Claude (segunda opinião, como co-reviewer)

> Ajuste feito após a avaliação (`cenario-3/tech-lead/avaliacao.md`, Exercício 3.2, D2): a versão original só parafraseava a intenção do prompt. Abaixo está o texto literal usado, seguido da ressalva estrutural sobre como essa "segunda opinião" foi obtida.

## Prompt literal usado

```
Você é um segundo revisor independente. Avalie o risco de 4 artefatos do
projeto NovaTech Assistant terem sido gerados com apoio de IA, SEM ver
nenhuma avaliação anterior sobre eles. Você tem acesso ao mesmo repositório
real (cenario-2/novatech-assistant/) que a primeira avaliação usou.

Artefatos (resumo dado no enunciado do exercício):
1. AGENTS.md — gerado pelo Claude, refinado 4 vezes, 15 páginas na versão atual.
2. 3 skills — a Foundation foi refinada após testes; as outras duas foram
   usadas sem refinamento.
3. Pipeline de ingestão e query endpoint — 60-70% gerados pelo Copilot.
4. System prompt — iterado 6 vezes, sem documentar por que cada mudança foi feita.

Para cada artefato: qual o risco de ter sido gerado por IA, e o que verificar
antes do go-live. Não aceite os números do resumo sem cruzar com o estado
real do código/documentação no repositório — se algo no resumo não bater
com o que você encontrar nos arquivos, aponte a divergência explicitamente.
```

## Ressalva estrutural (transparência para quem for avaliar este entregável)
Esta "segunda opinião" e a avaliação humana em `01-avaliacao-risco-tech-lead.md` foram produzidas na mesma sessão de trabalho, pela mesma ferramenta de IA (Claude), em dois turnos de conversa separados e sem que o segundo turno recebesse o conteúdo do primeiro como contexto. Isso reproduz a mecânica pedida pelo exercício (análise independente → segunda opinião → comparação honesta) e o conteúdo das duas passadas de fato diverge em pontos concretos (ver `03-comparacao-e-priorizacao.md`). Mas não é o mesmo que um Tech Lead humano formar sua própria opinião antes de qualquer contato com IA — não há como este documento, sozinho, provar a independência da primeira passada da forma como um avaliador de certificação precisaria. Registrar isso aqui em vez de omitir é, em si, parte da revisão crítica que o exercício pede.

O Claude concorda com os 4 riscos identificados na avaliação humana (seção AGENTS.md, skills, pipeline/endpoint, system prompt) e com as descobertas concretas no repositório (TODOs no AGENTS.md, `prompt-changelog.md` vazio, stubs vazios em `src/`). Além disso, aponta 3 coisas que a primeira passada não capturou:

## 1. A narrativa "3 skills" não bate com o repositório real — e o padrão real é pior, não melhor

O resumo do exercício diz "a Foundation foi refinada após testes; as outras duas foram usadas sem refinamento". Mas o repositório tem **10 arquivos de skill**, em 3 categorias (`skills/foundation/` com 3 arquivos, `skills/domain/` com 4, `skills/artifact/` com 3) — e a única skill com evidência real de teste (`cenario-2/tech-lead/exercicio-2.3-skill-azure-functions-endpoint/`) é `skills/domain/azure-functions-endpoint.md`, uma skill de **Domain**, não de Foundation.

Isso importa porque skills de Foundation (`typescript-conventions.md`, `error-handling.md`, `project-structure.md`) são lidas para **todo** código gerado pelo Copilot no projeto — o raio de impacto de uma Foundation skill não testada é maior que o de uma Domain skill não testada, que só afeta um tipo específico de artefato. Se a leitura correta é "nenhuma Foundation skill foi testada", o risco é mais grave do que a redação do resumo sugere.

**Verificar:** confirmar, artefato por artefato, quais das 10 skills reais têm evidência de teste — não assumir que "a Foundation" (no sentido de categoria) foi coberta só porque uma skill qualquer foi.

## 2. Viés de autoavaliação na seção do AGENTS.md

A avaliação humana nota, corretamente, que só as seções escritas pelo próprio Tech Lead foram testadas contra saída real do Copilot. Vale nomear o viés: **quem escreveu a seção também foi quem decidiu que ela estava "pronta o suficiente" para não precisar de mais teste.** Isso não invalida o trabalho feito (o processo v1→teste→v2 documentado é sólido), mas significa que a ausência de teste nas seções de Product Specialist/QA/Delivery Manager não é neutra — ninguém com interesse direto nelas rodou o mesmo processo ainda. Isso reforça, e não apenas repete, o achado de que essas seções são bloqueantes para o go-live.

## 3. O system prompt sem changelog é também um buraco de guardrail (HITL), não só um problema de rastreabilidade

A avaliação humana trata isso como risco de "rollback às cegas". Vale acrescentar a conexão com a camada de Guardrails do harness (Exercício 3.1): se não há registro de por que o system prompt mudou 6 vezes, também não há evidência de que alguma dessas mudanças passou por aprovação humana antes de ir para staging. Ou seja, o risco não é só "não sei reverter" — é "não sei se as mudanças já feitas passaram pelo ponto de HITL que o harness de produto (Exercício Product Specialist 3.2) está pedindo para mudanças futuras". Antes do go-live, vale perguntar diretamente a quem iterou o prompt se houve aprovação em algum momento das 6 vezes, mesmo informal.

## Pontos de concordância total com a avaliação humana
- Pipeline/endpoint: 60-70% Copilot é o maior risco de erro silencioso, coerente com os 12% de respostas incorretas já medidos.
- A cobertura de "~75%" não tem evidência ainda no código real (stubs vazios, pastas de teste sem arquivos) — tratar como número a confirmar, não como fato.
- Skills e seções do AGENTS.md sem teste real são risco de inconsistência, pelo mesmo mecanismo em escalas diferentes.
