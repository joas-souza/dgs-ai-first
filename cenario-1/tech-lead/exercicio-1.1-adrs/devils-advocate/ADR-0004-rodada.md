# Devil's Advocate - ADR-0004 (Build vs Buy)

## Tese inicial
Buy-first com Azure AI Search + Azure OpenAI para MVP.

## Contra-argumentos levantados
1. Buy-first pode mascarar problemas de qualidade de retrieval que exigem controle fino.
2. Custos gerenciados podem superar build proprio em medio prazo.
3. Time pode perder aprendizado tecnico critico ao depender excessivamente da plataforma.
4. Se nao houver trilha de benchmark, a decisao vira irreversivel na pratica.

## Ajustes incorporados na ADR final
- Definicao explicita de trilha Build-controlada em laboratorio separado.
- Preservacao de opcao de migracao parcial futura mediante evidencias de custo/qualidade.
- Reforco para evitar hibrido complexo no MVP (evita overengineering).

## Ganho de robustez
A decisao final preserva velocidade de entrega sem perder opcionalidade tecnica para evolucao.
