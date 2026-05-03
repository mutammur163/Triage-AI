import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Loader2 } from 'lucide-react'

/**
 * Floating symptom input box with voice button
 * @param {object} props
 * @param {(text: string) => void} props.onSubmit
 * @param {boolean} props.loading
 * @param {string} props.placeholder
 * @param {boolean} props.disabled
 */
export default function InputBox({
  onSubmit,
  loading = false,
  placeholder = 'Describe your symptoms...',
  disabled = false,
  className = '',
}) {
  const [value, setValue] = useState('')
  const [listening, setListening] = useState(false)
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!value.trim() || loading || disabled) return
    onSubmit(value.trim())
    setValue('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Please type your symptoms.')
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (listening) {
      setListening(false)
      return
    }
    setListening(true)
    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setValue(prev => prev ? prev + ' ' + transcript : transcript)
      setListening(false)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognition.start()
  }

  const canSubmit = value.trim().length > 0 && !loading && !disabled

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      animate={focused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Glow ring when focused */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-blue/30 to-brand-blue-light/20 blur-md -z-10"
          />
        )}
      </AnimatePresence>

      <div className="glass rounded-2xl overflow-hidden shadow-xl shadow-brand-navy/5">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="symptom-input"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled || loading}
          rows={3}
          className="w-full bg-transparent px-5 pt-5 pb-2 text-brand-navy placeholder-brand-navy/30 resize-none focus:outline-none text-base leading-relaxed"
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-2">
            {/* Voice Button */}
            <motion.button
              type="button"
              id="voice-input-btn"
              onClick={toggleVoice}
              title="Voice input"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                listening
                  ? 'bg-red-100 text-red-500 animate-pulse'
                  : 'bg-brand-blue/8 text-brand-navy/40 hover:bg-brand-blue/15 hover:text-brand-blue'
              }`}
              whileTap={{ scale: 0.92 }}
            >
              {listening ? <MicOff size={16} /> : <Mic size={16} />}
            </motion.button>

            {listening && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-red-500 font-medium"
              >
                Listening…
              </motion.span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-navy/25 tabular-nums">
              {value.length}/1000
            </span>

            {/* Submit */}
            <motion.button
              type="submit"
              id="submit-symptom-btn"
              disabled={!canSubmit}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                canSubmit
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/25 hover:bg-brand-blue-dark'
                  : 'bg-brand-navy/8 text-brand-navy/25 cursor-not-allowed'
              }`}
              whileHover={canSubmit ? { scale: 1.03, y: -1 } : {}}
              whileTap={canSubmit ? { scale: 0.96 } : {}}
            >
              {loading
                ? <Loader2 size={15} className="animate-spin" />
                : <Send size={15} />
              }
              {loading ? 'Analyzing…' : 'Analyze'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.form>
  )
}
