# Estrategia de Prompts como Codigo

## 1. Onde os prompts ficam versionados
- Pasta raiz de prompts: `tech-lead/exercicio-1.2-prompt-context-engineering/prompts/`
- Prompt de sistema atual: `prompts/system/atendimento-novatech.v1.md`
- Regras de avaliacao e testes ficam junto ao script de validacao.

## 2. Convencao de nomes
- Padrao: `<dominio>-<canal>.v<major>.md`
- Exemplo atual: `atendimento-novatech.v1.md`
- Mudancas breaking (formato, politicas, guardrails): incrementam `major`.
- Ajustes textuais sem impacto de comportamento: registram changelog no PR.

## 3. Como sao testados
- Script: `script-teste-prompts.py`
- Casos: `test-cases-anexo-b.json`
- Criterios minimos automatizados:
  - resposta contem citacao de fonte esperada
  - resposta nao contem termos proibidos
  - em caso sem cobertura, resposta explicita insuficiencia de informacao
- Bloqueio de merge recomendado: falha em qualquer caso critico.

## 4. Quem pode alterar
- Autor inicial: Tech Lead / Engenharia IA.
- Revisao obrigatoria:
  - 1 aprovador tecnico (Tech Lead ou Eng. IA)
  - 1 aprovador de dominio (Product Specialist)
- Mudancas em guardrails de seguranca/compliance exigem aprovacao adicional de Compliance.

## 5. Fluxo de alteracao
1. Abrir branch e editar prompt versionado.
2. Executar `script-teste-prompts.py` localmente.
3. Abrir PR com diff, resultados de teste e justificativa da mudanca.
4. Aprovar apenas se nao houver regressao em citacao de fonte e regras de nao alucinacao.

## 6. Relacao com o exercicio
Esta estrategia cobre o requisito de tratar prompt como artefato de software: versionado, testavel, revisavel e auditavel.
