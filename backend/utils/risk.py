"""
risk.py – Rule-based risk scoring engine

Each symptom keyword maps to a severity score.
Total score determines risk level:
  0–2  → LOW
  3–5  → MEDIUM
  6+   → HIGH
"""

from typing import List

# ---------------------------------------------------------------------------
# Symptom → score mapping (higher = more severe)
# ---------------------------------------------------------------------------
SYMPTOM_SCORES: dict[str, int] = {
    # Critical (score 5)
    "chest pain": 5,
    "chest tightness": 5,
    "difficulty breathing": 5,
    "shortness of breath": 5,
    "breathing difficulty": 5,
    "stroke": 5,
    "unconscious": 5,
    "seizure": 5,
    "heart attack": 5,
    "severe bleeding": 5,
    "paralysis": 5,
    "anaphylaxis": 5,
    "loss of consciousness": 5,

    # High (score 4)
    "high fever": 4,
    "severe headache": 4,
    "sudden vision loss": 4,
    "sudden weakness": 4,
    "coughing blood": 4,
    "vomiting blood": 4,
    "severe abdominal pain": 4,
    "neck stiffness": 4,

    # Moderate (score 3)
    "persistent fever": 3,
    "confusion": 3,
    "dizziness": 3,
    "numbness": 3,
    "rapid heartbeat": 3,
    "palpitations": 3,
    "swelling": 3,
    "dehydration": 3,

    # Mild-moderate (score 2)
    "fever": 2,
    "vomiting": 2,
    "nausea": 2,
    "headache": 2,
    "body ache": 2,
    "back pain": 2,
    "joint pain": 2,
    "rash": 2,
    "fatigue": 2,
    "chills": 2,
    "cough": 2,

    # Mild (score 1)
    "runny nose": 1,
    "sore throat": 1,
    "sneezing": 1,
    "mild pain": 1,
    "cold": 1,
    "congestion": 1,
    "watery eyes": 1,
}

# ---------------------------------------------------------------------------
# Thresholds
# ---------------------------------------------------------------------------
THRESHOLD_HIGH   = 6
THRESHOLD_MEDIUM = 3


def calculate_risk(symptoms: List[str]) -> tuple[str, str]:
    """
    Given a list of symptoms, return (risk_level, explanation).

    Returns:
        risk_level  – "LOW" | "MEDIUM" | "HIGH"
        explanation – human-readable reasoning string
    """
    if not symptoms:
        return "LOW", (
            "No specific symptoms were detected from your description. "
            "If you feel unwell, please monitor your condition and consult a doctor if symptoms develop."
        )

    total_score = 0
    matched: list[tuple[str, int]] = []

    for symptom in symptoms:
        symptom_lower = symptom.lower().strip()
        # Direct match first
        if symptom_lower in SYMPTOM_SCORES:
            score = SYMPTOM_SCORES[symptom_lower]
            matched.append((symptom, score))
            total_score += score
        else:
            # Partial / keyword match
            for keyword, score in SYMPTOM_SCORES.items():
                if keyword in symptom_lower or symptom_lower in keyword:
                    matched.append((symptom, score))
                    total_score += score
                    break

    # Determine level
    if total_score >= THRESHOLD_HIGH:
        risk_level = "HIGH"
        explanation = (
            f"Your symptoms (score: {total_score}) include indicators associated with potentially "
            "serious or life-threatening conditions. Immediate medical evaluation is strongly recommended. "
            "Please seek emergency care or call emergency services right away."
        )
    elif total_score >= THRESHOLD_MEDIUM:
        risk_level = "MEDIUM"
        explanation = (
            f"Your symptoms (score: {total_score}) suggest a moderate-urgency situation. "
            "You should seek medical attention today — visit an urgent care clinic or contact "
            "your healthcare provider. Do not delay if symptoms worsen."
        )
    else:
        risk_level = "LOW"
        explanation = (
            f"Your symptoms (score: {total_score}) appear to be mild. "
            "Rest, stay hydrated, and monitor your condition at home. "
            "If symptoms persist beyond 48 hours or worsen, please consult a doctor."
        )

    return risk_level, explanation
