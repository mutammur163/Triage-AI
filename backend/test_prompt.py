from utils.chat import generate_chat_response

# Test Case 1: User provides symptoms
print("=== TEST 1: Symptom input ===")
r1 = generate_chat_response([{"role": "user", "content": "I have chest pain"}])
print(r1)

# Test Case 4: Irrelevant question
print("\n=== TEST 2: Irrelevant question ===")
r2 = generate_chat_response([{"role": "user", "content": "What is AI?"}])
print(r2)

# Test Case 5: Unclear input
print("\n=== TEST 3: Vague input ===")
r3 = generate_chat_response([{"role": "user", "content": "I feel bad"}])
print(r3)
