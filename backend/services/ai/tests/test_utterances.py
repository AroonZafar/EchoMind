import requests

BASE = "http://localhost:8001/api"

CASES = [
    ("new_person", "I met Ali today. He is stressed because his AI assignment is due Friday.", "new"),
    ("new_task", "I need to finish my project report by Friday.", "new"),
    ("new_event", "I have a doctor's appointment next Monday.", "new"),
    ("new_multi_entity", "I talked to Sara and Ahmed about the budget.", "new"),
    ("new_preference", "I don't like spicy food.", "new"),
    ("update_same_person", "I have a meeting with Ahmed tomorrow at 5pm about the project deadline.", "update_setup"),
    ("update_same_person_v2", "Actually, my meeting with Ahmed is at 6pm now, not 5pm.", "update"),
    ("relationship_worry", "Ali is worried about his exam next week.", "new"),
    ("duplicate_mention", "I met Sara.", "new"),
    ("duplicate_mention_v2", "Sara called me again today.", "update"),
    ("vague_1", "Something happened today.", "vague"),
    ("vague_2", "It was kind of a weird day.", "vague"),
    ("irrelevant_1", "The weather is nice today.", "irrelevant"),
    ("irrelevant_2", "I had lunch, it was okay.", "irrelevant"),
    ("negation", "I don't have a meeting today.", "vague"),
    ("no_name_pronoun", "He is coming tomorrow.", "vague"),
    ("time_expression", "Remind me tomorrow to call the bank.", "new"),
    ("compound_sentence", "I met Ahmed and Ali, we discussed the hackathon deadline and Ahmed said he'd finish the backend by Sunday.", "new"),
    ("very_short", "ok", "vague"),
    ("task_for_completion_flow", "I need to call the bank about my account.", "new"),
]


def run():
    results = []
    for label, transcript, kind in CASES:
        try:
            r = requests.post(f"{BASE}/remember", json={"transcript": transcript}, timeout=30)
            ok = r.status_code == 200
            data = r.json() if ok else r.text
            entity_names = []
            if ok:
                entity_names = [e["name"] for e in data["extracted"]["entities"]]
                for e in data["extracted"]["entities"]:
                    if e["type"].lower() == "person" and e["name"].lower() not in transcript.lower():
                        ok = False
            results.append((label, kind, r.status_code, ok, entity_names, transcript))
        except Exception as e:
            results.append((label, kind, "ERR", False, str(e), transcript))

    print(f"\n{'LABEL':28} {'KIND':14} {'HTTP':6} {'OK':5} ENTITIES")
    print("-" * 100)
    passed = 0
    for label, kind, status, ok, entities, transcript in results:
        mark = "PASS" if ok else "CHECK"
        if ok:
            passed += 1
        print(f"{label:28} {kind:14} {str(status):6} {mark:5} {entities}")

    print("-" * 100)
    print(f"{passed}/{len(results)} returned 200 with no obvious hallucination flag.")

    print("\nChecking current memory graph state (GET /api/memories) ...")
    mem = requests.get(f"{BASE}/memories").json()
    for m in mem["memories"]:
        print(f"  [{m['type']:8}] {m['title']:20} importance={m['importance']:.2f} status={m['status']}")

    print("\nTesting /api/complete and /api/forget lifecycle actions ...")
    c = requests.post(f"{BASE}/complete", json={"title": "call the bank"})
    print("  complete 'call the bank':", c.status_code, c.json() if c.status_code == 200 else c.text)
    f = requests.post(f"{BASE}/forget", json={"title": "Ahmed"})
    print("  forget 'Ahmed':", f.status_code, f.json() if f.status_code == 200 else f.text)

    mem2 = requests.get(f"{BASE}/memories").json()
    print("\nMemory graph after lifecycle actions:")
    for m in mem2["memories"]:
        print(f"  [{m['type']:8}] {m['title']:20} importance={m['importance']:.2f} status={m['status']}")


if __name__ == "__main__":
    run()
