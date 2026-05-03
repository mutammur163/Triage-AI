"""
main.py – TriageAI Backend Entry Point

Run with:
    uvicorn main:app --reload --port 8000
"""

import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models.schemas import (
    AnalyzeRequest, AnalyzeResponse,
    ChatRequest, ChatResponse, TriageResult,
)
from utils.ai import extract_symptoms
from utils.risk import calculate_risk
from utils.chat import (
    generate_chat_response,
    extract_symptoms_from_conversation,
    is_ready_for_analysis,
    clean_reply,
)

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="TriageAI API",
    description="AI-powered health triage — symptom extraction and risk assessment.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the Vite dev server and production frontend
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",  # Alternative dev port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"])
def root():
    """Simple health-check endpoint."""
    return {"status": "ok", "service": "TriageAI API", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
def health():
    """Detailed health check."""
    return {"status": "healthy"}


# ---------------------------------------------------------------------------
# EXISTING: /analyze (UNCHANGED)
# ---------------------------------------------------------------------------
@app.post("/analyze", response_model=AnalyzeResponse, tags=["Triage"])
def analyze(request: AnalyzeRequest):
    """
    Main triage endpoint.

    1. Extract symptoms from free-text input using Groq AI.
    2. Score symptoms with rule-based logic.
    3. Return risk level + explanation.
    """
    logger.info("Received analyze request: %.120s", request.text)

    # Step 1 – AI symptom extraction
    symptoms = extract_symptoms(request.text)
    logger.info("Extracted symptoms: %s", symptoms)

    # Step 2 – Risk scoring
    risk_level, explanation = calculate_risk(symptoms)
    logger.info("Risk level: %s", risk_level)

    return AnalyzeResponse(
        symptoms=symptoms,
        risk_level=risk_level,
        explanation=explanation,
    )


# ---------------------------------------------------------------------------
# NEW: /chat – Conversational triage
# ---------------------------------------------------------------------------
@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
def chat(request: ChatRequest):
    """
    Chat-based triage endpoint.

    1. Generate a conversational AI response (asks follow-up questions).
    2. Check decision trigger: conversation length >= 2 OR multiple symptoms extracted.
    3. If ready, run existing risk logic and return done=True.
    """
    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    logger.info("Chat request with %d messages", len(messages))

    # Step 1: Decision Trigger logic
    user_messages = [m for m in messages if m["role"] == "user"]
    combined_user_text = "\n".join(m["content"] for m in user_messages)

    # Reuse the exact same extract_symptoms from /analyze
    all_symptoms = extract_symptoms(combined_user_text)
    logger.info("Extracted symptoms from user history: %s", all_symptoms)

    # Check conditions
    is_done = False
    if len(messages) >= 4 or len(all_symptoms) >= 2:
        is_done = True

    if is_done:
        logger.info("Analysis triggered (done=True)")
        
        # Calculate risk using existing logic
        risk_level, explanation = calculate_risk(all_symptoms)

        # Generate a final wrap-up reply
        final_reply = "Thank you for the information. I have assessed your symptoms and generated a risk report."

        return ChatResponse(
            reply=final_reply,
            done=True,
            result=TriageResult(
                symptoms=all_symptoms,
                risk_level=risk_level,
                explanation=explanation,
            ),
        )

    # Not done: Ask a follow-up question
    raw_reply = generate_chat_response(messages)
    
    # Optional: strip the [READY_FOR_ANALYSIS] tag if the AI mistakenly generates it due to our old prompt
    display_reply = clean_reply(raw_reply)

    return ChatResponse(reply=display_reply, done=False, result=None)
