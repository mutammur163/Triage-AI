# TriageAI – Backend

AI-powered health triage API built with FastAPI + Groq.

## 🚀 Quick Start

```bash
cd backend

# 1. Create & activate a virtual environment (recommended)
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start the server
uvicorn main:app --reload --port 8000
```

API will be available at **http://localhost:8000**
Interactive docs at **http://localhost:8000/docs**

## 📡 Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/health` | Detailed health check |
| POST | `/analyze` | Main triage endpoint |

### POST `/analyze`

**Request:**
```json
{ "text": "I have a fever and severe headache" }
```

**Response:**
```json
{
  "symptoms": ["fever", "severe headache"],
  "risk_level": "MEDIUM",
  "explanation": "Your symptoms (score: 6) suggest..."
}
```

## 🗂 Structure

```
backend/
├── main.py              # FastAPI app + routes
├── models/
│   └── schemas.py       # Pydantic request/response models
├── utils/
│   ├── ai.py            # Groq API – symptom extraction
│   └── risk.py          # Rule-based risk scoring
├── .env                 # API keys (never commit this!)
└── requirements.txt
```

## ⚙️ Environment

`.env` file:
```
GROQ_API_KEY=your_key_here
```

## 🔌 Frontend Connection

Set `DEMO_MODE = false` in `frontend/src/pages/Assessment.jsx` once this backend is running.
