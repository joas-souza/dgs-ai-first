# Avaliação de risco — Tech Lead (antes do Claude)

> Feita antes de consultar o Claude, com acesso ao repositório real `cenario-2/novatech-assistant/`, para não me ancorar numa segunda opinião antes de formar a minha.

## 1. AGENTS.md (Claude, 4 refinamentos, 15 páginas)

**Risco de ter sido gerado por IA:** um documento de 15 páginas cria um problema parecido com o que a ADR-0002 resolve para o RAG — quanto maior o "contexto" que o Copilot precisa ler antes de gerar código, maior o risco de ele prestar atenção desigual às seções. Nós só testamos isso de verdade nas nossas próprias seções: o histórico em `cenario-2/tech-lead/exercicio-2.1-agents-md/` mostra iteração v1 → teste real com Copilot → v2 apenas para as seções que o Tech Lead escreveu (Tech Stack, Coding Standards, MCP). As seções de Product Specialist, QA e Delivery Manager **continuam com `<!-- TODO -->` no arquivo real** — ou seja, o "refinado 4 vezes" não cobre o documento inteiro por igual.

**Verificar antes do go-live:** confirmar quais seções foram de fato testadas contra geração real do Copilot (evidência: pasta de exercício com output real) versus quais são só texto nunca confrontado. As seções ainda com TODO são bloqueantes, não desejáveis — sem guardrails de produto no AGENTS.md, o Copilot não tem onde ler a regra "carga perigosa não pode ser devolvida" antes de gerar código relacionado.

## 2. As 3 skills (Foundation refinada; as outras duas sem refinamento)

**Risco:** skill sem refinamento é a mesma categoria de risco do item 1, em escala menor — nunca foi confrontada com uma geração real, então não sabemos se o Copilot realmente segue o que está escrito nela.

**Verificar:** rodar cada skill não refinada contra 1-2 prompts reais do domínio (o mesmo método usado em `cenario-2/tech-lead/exercicio-2.3-skill-azure-functions-endpoint/`: v1 → teste → analisar o que foi seguido/ignorado → v2) antes de confiar nelas em produção.

## 3. Pipeline de ingestão + query endpoint (60-70% gerado pelo Copilot)

**Risco:** é o tipo de artefato onde erro de IA dói mais silenciosamente — lógica de retrieval/scoring que "parece certa" mas erra em casos de borda. Isso é coerente com os 12% de respostas incorretas já observados (alucinação, documento desatualizado, chunk errado) citados no cenário.

**Verificar:** cobertura de teste **desses arquivos especificamente**, não a média do projeto. Hoje, olhando o repositório real, `src/pipeline/*.ts` e `src/services/*.ts` são arquivos vazios (stubs) e `tests/unit/`, `tests/integration/`, `tests/e2e/` não têm nenhum arquivo de teste ainda — só fixtures. A cobertura "~75%" citada no cenário ainda não tem evidência no código que temos hoje; é um número a confirmar quando o Dev implementar, não um fato já verificado.

## 4. System prompt (6 iterações, sem documentação do porquê)

**Risco:** sem histórico de mudança, um rollback depois de uma regressão é um "chute às cegas" — não sabemos qual das 6 versões anteriores era estável nem por que ela mudou.

**Verificar:** `prompts/prompt-changelog.md` existe no repositório, mas está vazio. Isso confirma o risco descrito no cenário: a documentação de mudança do prompt não existe. Antes do go-live, pelo menos a versão atual (v6) precisa ter registrado, retroativamente, por que chegou à forma atual — mesmo que as 5 versões anteriores fiquem sem registro.

## Minha priorização inicial (2 semanas, antes de comparar com o Claude)

1. Preencher a seção de guardrails no AGENTS.md (bloqueia o resto).
2. Testar as 2 skills sem refinamento.
3. Reconstruir o changelog do system prompt a partir da v6 atual.
4. Cobertura de teste do pipeline/endpoint — aceitar como risco residual monitorado (não dá para reescrever 60-70% de código gerado por IA em 2 semanas; mitigar com o verification loop do Exercício 3.1, não com reescrita).
