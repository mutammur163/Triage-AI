"""
ai.py – Groq-powered symptom extraction

Sends user input to the Groq API (llama3-8b-8192) with a strict prompt
that forces a clean JSON response containing a list of symptoms.
Falls back to an empty list on any failure.
"""

import os
import json
import logging
from typing import List

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Groq client (initialized once at import time)
# ---------------------------------------------------------------------------
_client: Groq | None = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY is not set in the environment / .env file.")
        _client = Groq(api_key=api_key)
    return _client


# ---------------------------------------------------------------------------
# Prompt template
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """You are a medical symptom extraction assistant.
Your ONLY job is to extract symptoms from the user's text and return them as a JSON object.

Rules:
- Return ONLY valid JSON, no extra text, no markdown, no explanation.
- The JSON must have exactly one key: "symptoms" whose value is a list of strings.
- Each symptom should be a short, clean phrase (e.g. "fever", "chest pain", "shortness of breath").
- If no symptoms are found, return {"symptoms": []}.
- Do NOT diagnose, do NOT add commentary."""

USER_PROMPT_TEMPLATE = """Extract all medical symptoms from the following text:

"{user_input}"

Return ONLY JSON in this exact format:
{{"symptoms": ["symptom1", "symptom2"]}}"""


# ---------------------------------------------------------------------------
# Main extraction function
# ---------------------------------------------------------------------------
def extract_symptoms(text: str) -> List[str]:
    """
    Call Groq API to extract symptoms from the given text.

    Args:
        text: The raw user symptom description.

    Returns:
        A list of symptom strings. Returns [] on any failure.
    """
    try:
        client = _get_client()

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": USER_PROMPT_TEMPLATE.format(user_input=text)},
            ],
            temperature=0.1,      # Low temperature → consistent, factual output
            max_tokens=256,
            response_format={"type": "json_object"},  # Force JSON mode
        )

        raw = response.choices[0].message.content.strip()
        logger.debug("Groq raw response: %s", raw)

        data = json.loads(raw)
        symptoms = data.get("symptoms", [])

        # Sanitize: ensure list of non-empty strings
        symptoms = [str(s).strip() for s in symptoms if str(s).strip()]
        return symptoms

    except json.JSONDecodeError as e:
        logger.warning("Failed to parse Groq JSON response: %s", e)
        return []

    except Exception as e:
        logger.error("Groq API error: %s", e)
        return []
