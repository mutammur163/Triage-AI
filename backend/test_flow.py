"""Full end-to-end chat flow test simulating the exact user journey."""
import requests
import json

BASE = "http://127.0.0.1:8000"
messages = []

def chat(user_input):
    messages.append({"role": "user", "content": user_input})
    resp = requests.post(f"{BASE}/chat", json={"messages": messages})
    data = resp.json()
    print(f"\nUser: {user_input}")
    print(f"AI:   {data['reply']}")
    print(f"Done: {data['done']}")
    if data.get("result"):
        print(f">>> RESULT: {json.dumps(data['result'], indent=2)}")
    messages.append({"role": "assistant", "content": data["reply"]})
    return data

# Round 1: User describes a symptom
print("=" * 60)
print("ROUND 1: Initial symptom")
print("=" * 60)
r1 = chat("I have chest pain")

# Round 2: User adds another symptom
print("\n" + "=" * 60)
print("ROUND 2: Follow-up (should trigger analysis)")
print("=" * 60)
r2 = chat("I also have sweating and difficulty breathing")

if r2.get("done"):
    print("\n✅ FULL FLOW WORKS! Risk level:", r2["result"]["risk_level"])
else:
    print("\n⚠️ Analysis not triggered yet, would need more messages")
