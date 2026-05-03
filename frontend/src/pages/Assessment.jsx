import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, RefreshCw, MessageSquareText } from 'lucide-react'
import InputBox from '../components/InputBox'
import ChatBubble from '../components/ChatBubble'
import RiskCard from '../components/RiskCard'
import Loader from '../components/Loader'
import Button from '../components/Button'
import { chatWithAI } from '../services/api'
import { addHistoryEntry } from '../services/history'

// Steps: 0 = chat, 1 = result
const STEP = { CHAT: 0, RESULT: 1 }

const STEP_LABELS = ['AI Triage Assistant', 'Risk Report']

export default function Assessment() {
  const [step, setStep] = useState(STEP.CHAT)
  
  // Store the conversation history for both UI and API
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm TriageAI. Please describe your symptoms in as much detail as you can.",
    },
  ])
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Listen for reset events from the Navbar
  useEffect(() => {
    const onReset = () => handleReset()
    window.addEventListener('reset-assessment', onReset)
    return () => window.removeEventListener('reset-assessment', onReset)
  }, [])

  const appendMessage = (msg) => setMessages(prev => [...prev, msg])

  const handleSubmit = async (text) => {
    if (!text.trim()) return
    setError(null)

    // Add user message to UI state immediately
    const userMsg = { role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      // Send entire conversation history to backend chat endpoint
      // We only send 'role' and 'content', omitting any UI-specific flags
      const apiMessages = updatedMessages.map(m => ({ role: m.role, content: m.content }))
      
      const data = await chatWithAI(apiMessages)

      // Add AI reply to conversation
      appendMessage({ role: 'assistant', content: data.reply })

      // If backend signals it has reached a conclusion, show result
      if (data.done && data.result) {
        // Persist to history
        addHistoryEntry({
          input: "Chat Triage Assessment",
          symptoms: data.result.symptoms,
          risk_level: data.result.risk_level,
          explanation: data.result.explanation || '',
        })

        setResult(data.result)
        // Add a slight delay before showing the result card so the user can read the final AI message
        setTimeout(() => setStep(STEP.RESULT), 1500)
      }
      
    } catch (err) {
      setError(err.message || 'Something went wrong connecting to the AI. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep(STEP.CHAT)
    setResult(null)
    setError(null)
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm TriageAI. Please describe your symptoms in as much detail as you can.",
      },
    ])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-[calc(100vh-4rem)] flex flex-col"
    >
      {/* Page header */}
      <div className="px-4 pt-8 pb-4 max-w-3xl mx-auto w-full">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <h1 className="font-display font-bold text-2xl text-brand-navy flex items-center gap-2">
            <MessageSquareText className="text-brand-blue" />
            Chat Assessment
          </h1>
          <p className="text-sm text-brand-navy/50 mt-1">Answer the AI's questions to get an accurate risk analysis</p>
        </motion.div>

        {/* Step Progress */}
        <div className="flex items-center gap-2">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-1.5 shrink-0">
                <motion.div
                  animate={{
                    backgroundColor: i <= step ? '#3A86FF' : '#E2E8F0',
                    scale: i === step ? 1.1 : 1,
                  }}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                >
                  {i < step ? <CheckCircle2 size={14} /> : i + 1}
                </motion.div>
                <span className={`text-xs font-medium hidden sm:inline ${i <= step ? 'text-brand-blue' : 'text-brand-navy/30'}`}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className="flex-1 h-0.5 rounded-full bg-brand-navy/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-blue rounded-full"
                    animate={{ width: i < step ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 pb-8 max-w-3xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* ── RESULT VIEW ── */}
          {step === STEP.RESULT && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <RiskCard
                riskLevel={result.risk_level}
                symptoms={result.symptoms}
                explanation={result.explanation}
                onReset={handleReset}
              />
            </motion.div>
          )}

          {/* ── CHAT VIEW ── */}
          {step === STEP.CHAT && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              {/* Chat area */}
              <div className="glass rounded-2xl p-5 min-h-[400px] max-h-[60vh] overflow-y-auto flex flex-col gap-4 shadow-sm scroll-smooth">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <ChatBubble 
                      key={i} 
                      role={msg.role === 'assistant' ? 'ai' : 'user'} 
                      text={msg.content} 
                    />
                  ))}
                  
                  {/* Loading state / Typing indicator */}
                  {loading && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="mt-2"
                    >
                      <ChatBubble role="ai" text="" isTyping={true} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              {/* Error alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
                  >
                    <AlertCircle size={16} className="shrink-0 text-red-500" />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto hover:text-red-900 transition-colors">
                      <RefreshCw size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input box */}
              <InputBox
                onSubmit={handleSubmit}
                loading={loading}
                disabled={loading}
                placeholder="Type your response here..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
