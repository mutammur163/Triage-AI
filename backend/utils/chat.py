"""
chat.py – Groq-powered conversational triage assistant

Provides chat-style interaction where the AI asks follow-up questions
about symptoms. After enough information is gathered, signals the
system to trigger the existing rule-based risk analysis.
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
# Groq client (shared singleton)
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
# System prompt for the chat assistant
# ---------------------------------------------------------------------------
CHAT_SYSTEM_PROMPT = """You are an advanced AI-powered medical triage assistant integrated into a clinical decision-support system.

Your behavior must be intelligent, conversational, and controlled.

# CORE OBJECTIVE
You must:
- Understand user symptoms through conversation
- Ask relevant follow-up questions
- Maintain natural conversation flow
- Support general questions
- Prepare structured symptom data for triage evaluation

# STRICT RULES (DO NOT BREAK)
1. You are NOT allowed to:
   - Give medical diagnosis
   - Prescribe medication
   - Act as a doctor

2. You MUST:
   - Always ask at least ONE follow-up question when symptoms are mentioned
   - Keep responses short (1-3 sentences max)
   - Stay conversational and human-like

# CONVERSATION LOGIC

## CASE 1: USER PROVIDES SYMPTOMS
Step 1: Identify key symptoms
Step 2: Ask ONE relevant follow-up question (MANDATORY)
Examples:
- "How long have you been experiencing this?"
- "Are you also experiencing sweating or breathlessness?"
- "Is the pain sharp or dull?"
Even if symptoms are clear, STILL ask one question.

## CASE 2: USER CONTINUES CONVERSATION
- Combine previous + new symptoms
- Maintain context
- Ask next logical question OR prepare for evaluation

## CASE 3: SUFFICIENT INFORMATION REACHED
Condition is READY when:
- 2-3 meaningful symptoms collected
- OR critical symptom detected (e.g., chest pain + sweating)
Then you MUST say: "Thanks, I have enough information to assess your condition."
Then STOP asking questions.

## CASE 4: IRRELEVANT / GENERAL QUESTIONS
If user asks unrelated questions like "What is AI?" or "Tell me a joke":
- Answer briefly
- Then gently redirect. Example: "That's a great question! Now, can you tell me more about how you're feeling?"

## CASE 5: UNCLEAR INPUT
If input is vague, ask for clarification. Example: "Can you describe your symptoms more clearly?"

# PRIORITY HANDLING
If symptoms indicate danger (chest pain, breathing difficulty, severe weakness):
- Ask one quick confirmation question
- Do NOT delay unnecessarily

# RESPONSE STYLE
- Natural and conversational
- Short and precise
- No long explanations
- No medical jargon

# MEMORY
- Always remember previous messages
- Use context when asking questions
- Do NOT treat each message independently

# FINAL ROLE
You are NOT making the final decision. You are:
- Collecting structured symptom data
- Guiding the user conversation
- Preparing input for risk evaluation"""

EXTRACTION_SYSTEM_PROMPT = """You are a medical symptom extraction assistant.
Given a conversation between a user and a triage assistant, extract ALL symptoms mentioned by the user.

Rules:
- Return ONLY valid JSON, no extra text, no markdown.
- The JSON must have exactly one key: "symptoms" whose value is a list of strings.
- Each symptom should be a short, clean phrase (e.g. "fever", "chest pain", "shortness of breath").
- Include severity and duration qualifiers when mentioned (e.g. "high fever for 3 days").
- Only extract symptoms from the USER messages, not the assistant's questions.
- If no symptoms are found, return {"symptoms": []}."""


# ---------------------------------------------------------------------------
# Chat response generation
# ---------------------------------------------------------------------------
def generate_chat_response(messages: List[dict]) -> str:
    """
    Generate a conversational response from the triage assistant.

    Args:
        messages: List of {"role": "user"|"assistant", "content": "..."} dicts.

    Returns:
        The AI assistant's reply string.
    """
    try:
        client = _get_client()

        # Prepend system prompt
        full_messages = [
            {"role": "system", "content": CHAT_SYSTEM_PROMPT},
            *messages,
        ]

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=full_messages,
            temperature=0.4,
            max_tokens=300,
        )

        reply = response.choices[0].message.content.strip()
        logger.debug("Chat raw response: %s", reply)
        return reply

    except Exception as e:
        logger.error("Groq chat API error: %s", e)
        return "I'm sorry, I encountered an issue. Could you please repeat your symptoms?"


# ---------------------------------------------------------------------------
# Extract symptoms from the full conversation
# ---------------------------------------------------------------------------
def extract_symptoms_from_conversation(messages: List[dict]) -> List[str]:
    """
    Given the full chat history, extract all symptoms mentioned by the user.

    Args:
        messages: The full conversation array.

    Returns:
        A list of symptom strings.
    """
    try:
        client = _get_client()

        # Build a summary of the conversation for extraction
        conversation_text = "\n".join(
            f"{'User' if m['role'] == 'user' else 'Assistant'}: {m['content']}"
            for m in messages
        )

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": EXTRACTION_SYSTEM_PROMPT},
                {"role": "user", "content": f"Extract all symptoms from this conversation:\n\n{conversation_text}\n\nReturn ONLY JSON: {{\"symptoms\": [...]}}"},
            ],
            temperature=0.1,
            max_tokens=256,
            response_format={"type": "json_object"},
        )

        raw = response.choices[0].message.content.strip()
        logger.debug("Extraction raw response: %s", raw)

        data = json.loads(raw)
        symptoms = data.get("symptoms", [])
        symptoms = [str(s).strip() for s in symptoms if str(s).strip()]
        return symptoms

    except json.JSONDecodeError as e:
        logger.warning("Failed to parse extraction JSON: %s", e)
        return []

    except Exception as e:
        logger.error("Groq extraction API error: %s", e)
        return []


# ---------------------------------------------------------------------------
# Check if the conversation is ready for analysis
# ---------------------------------------------------------------------------
ANALYSIS_TRIGGER = "[READY_FOR_ANALYSIS]"


def is_ready_for_analysis(reply: str) -> bool:
    """Check if the AI's reply contains the analysis trigger marker."""
    return ANALYSIS_TRIGGER in reply


def clean_reply(reply: str) -> str:
    """Remove the trigger marker from the reply shown to the user."""
    return reply.replace(ANALYSIS_TRIGGER, "").strip()
