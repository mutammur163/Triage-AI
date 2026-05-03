const BASE_URL = 'http://127.0.0.1:8000'

/**
 * Analyze symptoms via the backend (EXISTING – unchanged)
 * @param {string} text - User's symptom description
 * @returns {Promise<{ symptoms: string[], risk_level: 'LOW'|'MEDIUM'|'HIGH', explanation?: string }>}
 */
export async function analyzeSymptoms(text) {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    let errMsg = `Server error (${response.status})`
    try {
      const data = await response.json()
      errMsg = data.detail || data.message || errMsg
    } catch (_) {}
    throw new Error(errMsg)
  }

  return response.json()
}

/**
 * Chat with the triage AI assistant (NEW)
 * @param {Array<{role: string, content: string}>} messages - Conversation history
 * @returns {Promise<{ reply: string, result?: { symptoms: string[], risk_level: string, explanation: string } }>}
 */
export async function chatWithAI(messages) {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    let errMsg = `Server error (${response.status})`
    try {
      const data = await response.json()
      errMsg = data.detail || data.message || errMsg
    } catch (_) {}
    throw new Error(errMsg)
  }

  return response.json()
}

/**
 * Mock response for demo mode (when backend is not available)
 * @param {string} text
 * @returns {Promise<{ symptoms: string[], risk_level: string, explanation: string }>}
 */
export async function mockAnalyzeSymptoms(text) {
  await new Promise(r => setTimeout(r, 2200))

  const lower = text.toLowerCase()
  let risk_level = 'LOW'
  let symptoms = []
  let explanation = ''

  // Simple keyword heuristic for demo
  if (lower.includes('chest pain') || lower.includes('breathing') || lower.includes('stroke') || lower.includes('unconscious')) {
    risk_level = 'HIGH'
    symptoms = ['chest pain', 'shortness of breath', 'high urgency indicator']
    explanation = 'Your reported symptoms include indicators commonly associated with serious cardiac or respiratory conditions. Immediate evaluation is strongly advised.'
  } else if (lower.includes('fever') || lower.includes('headache') || lower.includes('vomit') || lower.includes('dizzy')) {
    risk_level = 'MEDIUM'
    symptoms = extractKeywords(text, ['fever', 'headache', 'vomiting', 'dizziness', 'nausea', 'fatigue'])
    explanation = 'Your symptoms suggest a moderate-severity condition that warrants timely medical attention but may not be immediately life-threatening.'
  } else {
    risk_level = 'LOW'
    symptoms = extractKeywords(text, ['cough', 'runny nose', 'sore throat', 'mild pain', 'fatigue', 'cold'])
    explanation = 'Based on your described symptoms, the risk level appears low. Rest, hydration, and monitoring are recommended at this stage.'
  }

  if (symptoms.length === 0) {
    symptoms = text.split(' ').slice(0, 3).filter(w => w.length > 3)
  }

  return { symptoms, risk_level, explanation }
}

function extractKeywords(text, keywords) {
  const lower = text.toLowerCase()
  return keywords.filter(k => lower.includes(k.toLowerCase()))
}
