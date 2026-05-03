from utils.ai import extract_symptoms
import logging
logging.basicConfig(level=logging.DEBUG)
symptoms = extract_symptoms("User: I have fever\nAssistant: tell me more\nUser: and headache")
print("Extracted:", symptoms)
