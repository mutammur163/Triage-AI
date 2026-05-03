# TriageAI – Frontend

> AI-powered health triage decision-support dashboard

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:3000**

## 🔌 Backend Connection

The frontend expects the backend API at **http://localhost:8000**

API contract:
- **POST** `/analyze`
  - Body: `{ "text": "<symptom description>" }`
  - Response: `{ "symptoms": ["..."], "risk_level": "LOW|MEDIUM|HIGH", "explanation": "..." }`

> **Demo mode** is enabled by default (`DEMO_MODE = true` in `src/pages/Assessment.jsx`).  
> Set it to `false` once your backend is running.

## 🗂 Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx      # Sticky glassmorphism nav
│   │   ├── Button.jsx      # Reusable animated button
│   │   ├── InputBox.jsx    # Floating symptom input with voice
│   │   ├── ChatBubble.jsx  # AI/User chat message
│   │   ├── RiskCard.jsx    # Risk result dashboard card
│   │   └── Loader.jsx      # Animated loading states
│   ├── pages/
│   │   ├── Landing.jsx     # Hero + feature showcase
│   │   ├── Assessment.jsx  # 3-step triage flow
│   │   └── History.jsx     # Past assessments
│   ├── services/
│   │   ├── api.js          # Backend API + mock fallback
│   │   └── history.js      # localStorage history management
│   ├── App.jsx             # Route configuration
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Navy | `#0A2540` |
| Brand Blue | `#3A86FF` |
| Risk Low | `#10B981` (green) |
| Risk Medium | `#F59E0B` (amber) |
| Risk High | `#EF4444` (red) |
| Font | Inter + Poppins |

## 🧩 Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router v6** for navigation
- **Lucide React** for icons
