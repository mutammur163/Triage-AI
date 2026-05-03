from utils.chat import generate_chat_response
import logging
logging.basicConfig(level=logging.DEBUG)
messages = [{"role": "user", "content": "I have chest pain"}]
try:
    print(generate_chat_response(messages))
except Exception as e:
    print(f"Exception: {e}")
