from pydantic import BaseModel, field_validator
from typing import List, Optional


# ---------------------------------------------------------------------------
# /analyze endpoint (EXISTING – DO NOT CHANGE)
# ---------------------------------------------------------------------------
class AnalyzeRequest(BaseModel):
    text: str

    @field_validator("text")
    @classmethod
    def text_must_not_be_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Input text cannot be empty.")
        return v.strip()


class AnalyzeResponse(BaseModel):
    symptoms: List[str]
    risk_level: str
    explanation: str


# ---------------------------------------------------------------------------
# /chat endpoint (NEW)
# ---------------------------------------------------------------------------
class ChatMessage(BaseModel):
    role: str          # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]

    @field_validator("messages")
    @classmethod
    def messages_must_not_be_empty(cls, v):
        if not v:
            raise ValueError("Messages list cannot be empty.")
        return v


class TriageResult(BaseModel):
    symptoms: List[str]
    risk_level: str
    explanation: str


class ChatResponse(BaseModel):
    reply: str
    done: bool
    result: Optional[TriageResult] = None
