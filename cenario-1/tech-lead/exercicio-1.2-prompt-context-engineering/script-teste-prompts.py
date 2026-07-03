import argparse
import json
import os
import re
import sys
import urllib.request


def load_text(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def load_cases(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def build_user_message(case):
    metadata = case.get("customerMetadata", {})
    chunks = case.get("chunks", [])
    lines = []
    lines.append("METADADOS_CLIENTE:")
    for k, v in metadata.items():
        lines.append(f"- {k}: {v}")
    lines.append("")
    lines.append("CHUNKS_RECUPERADOS:")
    for chunk in chunks:
        lines.append(f"[{chunk['id']}] {chunk['text']}")
    lines.append("")
    lines.append("PERGUNTA:")
    lines.append(case["question"])
    return "\n".join(lines)


def call_chat_completion(base_url, api_key, model, system_prompt, user_message, timeout=60):
    url = base_url.rstrip("/") + "/chat/completions"
    payload = {
        "model": model,
        "temperature": 0,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {api_key}")

    with urllib.request.urlopen(req, timeout=timeout) as resp:
        body = json.loads(resp.read().decode("utf-8"))
    return body["choices"][0]["message"]["content"]


def evaluate_response(case, response_text):
    expected = case.get("expectedCitations", [])
    forbidden = [t.lower() for t in case.get("forbiddenTerms", [])]
    expect_insufficient = bool(case.get("expectInsufficientInfo", False))

    checks = []

    missing_citations = [c for c in expected if c not in response_text]
    checks.append(("citations", len(missing_citations) == 0, f"missing={missing_citations}"))

    lowered = response_text.lower()
    forbidden_found = [t for t in forbidden if t in lowered]
    checks.append(("forbidden_terms", len(forbidden_found) == 0, f"found={forbidden_found}"))

    if expect_insufficient:
        pattern = r"nao encontrei informacao suficiente|nao sei com base nos documentos"
        ok = re.search(pattern, lowered) is not None
        checks.append(("insufficient_info_fallback", ok, "expected explicit no-answer"))

    return checks


def main():
    parser = argparse.ArgumentParser(description="Teste automatizado de prompts para RAG NovaTech")
    parser.add_argument("--system-prompt", required=True, help="Caminho do prompt de sistema")
    parser.add_argument("--cases", required=True, help="Arquivo JSON com casos de teste")
    parser.add_argument("--model", default=os.getenv("LLM_MODEL", "gpt-4o"), help="Nome do modelo")
    parser.add_argument("--base-url", default=os.getenv("LLM_BASE_URL", "https://api.openai.com/v1"), help="Base URL compatível com OpenAI")
    parser.add_argument("--api-key", default=os.getenv("LLM_API_KEY", ""), help="API key")
    parser.add_argument("--offline", action="store_true", help="Nao chama API; apenas mostra os prompts montados")
    args = parser.parse_args()

    system_prompt = load_text(args.system_prompt)
    cases = load_cases(args.cases)

    total = 0
    failed = 0

    for case in cases:
        total += 1
        print(f"\n=== {case['id']} ===")
        user_message = build_user_message(case)

        if args.offline:
            response_text = "[MODO OFFLINE] Nao encontrei informacao suficiente nos documentos fornecidos. [Fonte: MOCK-001]"
        else:
            if not args.api_key:
                print("ERRO: informe --api-key ou LLM_API_KEY")
                return 2
            try:
                response_text = call_chat_completion(
                    base_url=args.base_url,
                    api_key=args.api_key,
                    model=args.model,
                    system_prompt=system_prompt,
                    user_message=user_message,
                )
            except Exception as exc:
                print(f"ERRO na chamada de modelo: {exc}")
                failed += 1
                continue

        print("Resposta:")
        print(response_text)

        checks = evaluate_response(case, response_text)
        case_failed = False
        for name, ok, detail in checks:
            status = "OK" if ok else "FAIL"
            print(f" - {name}: {status} ({detail})")
            if not ok:
                case_failed = True

        if case_failed:
            failed += 1

    print(f"\nResumo: {total - failed}/{total} casos aprovados")

    # Offline mode validates wiring (loading prompt/cases and running checks)
    # and should not fail CI for content-quality assertions.
    if args.offline:
        print("Modo offline: retorno 0 (smoke test tecnico).")
        return 0

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())

