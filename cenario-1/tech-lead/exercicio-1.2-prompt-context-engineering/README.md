# Exercicio 1.2 - Prompt e Context Engineering

## Objetivo
Definir prompts como artefatos versionados, testaveis e auditaveis.

## Entregaveis
- estrategia-prompts.md
- anatomia-contexto.md
- matriz-enforcement.md
- script-teste-prompts.py
- test-cases-anexo-b.json
- prompts/system/atendimento-novatech.v1.md

## Como executar o script de teste
Exemplo (modo offline):

python tech-lead/exercicio-1.2-prompt-context-engineering/script-teste-prompts.py \
	--system-prompt tech-lead/exercicio-1.2-prompt-context-engineering/prompts/system/atendimento-novatech.v1.md \
	--cases tech-lead/exercicio-1.2-prompt-context-engineering/test-cases-anexo-b.json \
	--offline

Comportamento do modo offline:
- Executa o fluxo tecnico completo (carrega prompt, carrega casos, roda validacoes e imprime relatorio).
- Usa resposta mock fixa para simulacao.
- Sempre retorna `exit code 0` para funcionar como smoke test tecnico (nao bloqueia por checks de conteudo).

Exemplo (com API):

python tech-lead/exercicio-1.2-prompt-context-engineering/script-teste-prompts.py \
	--system-prompt tech-lead/exercicio-1.2-prompt-context-engineering/prompts/system/atendimento-novatech.v1.md \
	--cases tech-lead/exercicio-1.2-prompt-context-engineering/test-cases-anexo-b.json \
	--base-url https://api.openai.com/v1 \
	--model gpt-4o \
	--api-key <SUA_CHAVE>

## Observacao do ambiente atual
Neste workspace, o runtime Python nao esta instalado no terminal, entao a execucao local nao foi validada aqui.
