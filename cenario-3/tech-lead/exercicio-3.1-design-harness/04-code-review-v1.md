# Code review da v1 do Copilot (`03-source-verifier-v1-copilot.ts`)

> Revisão feita com o Claude sobre o output bruto do Copilot, antes de aceitar a função no harness.

## Problema 1 (crítico): correspondência por substring em vez de igualdade exata

`VALID_DOCS.some((doc) => source.includes(doc))` marca como válida qualquer string que **contenha** um ID válido, não só a que **é** um ID válido. Isso inverte o propósito da verificação: ela existe para pegar fontes fabricadas/malformadas, e uma fonte fabricada que embuta um ID real como substring é exatamente o tipo de coisa que deveria ser sinalizada.

**Prova (executada de verdade, `npx tsx`, contra a v1 sem modificação):**

```
{"source_document":"POL-001, seção 3.2"} -> {"suspicious":false}
{"source_document":"PROC-042-v2-RASCUNHO-INTERNO-NAO-REVISADO"} -> {"suspicious":false}
{"source_document":"Baseado em POL-001 mas na verdade inventei o resto"} -> {"suspicious":false}
```

Os 3 casos deveriam ser `suspicious: true` (nenhum deles é literalmente um dos 5 identificadores válidos) e a v1 aprova todos. O terceiro caso é o mais grave: uma frase inteira contendo "POL-001" em qualquer lugar passa como fonte válida — na prática, isso anula a verificação para qualquer resposta que mencione um ID real de passagem, mesmo sem citá-lo como fonte de fato.

## Problema 2: `response: any`

A assinatura usa `any` para o parâmetro de entrada, o que viola a regra do próprio AGENTS.md do projeto ("NÃO DEVE: usar `any` explícito"). Além de perder checagem de tipo em tempo de compilação, isso esconde uma falha de runtime: se `source_document` vier como algo que não seja string (ex: um objeto, por engano em algum lugar do pipeline), `.includes()` nem existe nesse tipo e a função quebra em produção sem que o compilador tivesse avisado antes.

## Correção aplicada (v2, `05-source-verifier.ts`)
- Troca `some(doc => source.includes(doc))` por um `Set` com igualdade exata (`VALID_SET.has(source)`) — nenhuma substring passa mais, só o identificador exato.
- Tipagem explícita via a interface `ModelResponse` (sem `any`), com `source_document` tipado como `string | null | undefined`.
- Mantém `.trim()` antes da comparação, para tolerar espaços acidentais sem abrir a porta para correspondência parcial de conteúdo.

Reexecutando os mesmos 3 casos adversariais contra a v2, os 3 corretamente saem como `suspicious: true` (ver `06-demo-source-verifier.ts` e `07-execucao-real.txt`, que incluem o caso "POL-001, seção 3.2" nos 8 cenários testados).
