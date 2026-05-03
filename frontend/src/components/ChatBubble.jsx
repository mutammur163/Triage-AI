import { motion } from 'framer-motion'
import { Activity, Bot } from 'lucide-react'

/**
 * A single chat message bubble
 * @param {'user'|'ai'} props.role
 * @param {string} props.text
 * @param {boolean} props.isTyping – show typing dots instead of text
 */
export default function ChatBubble({ role, text, isTyping = false }) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-brand-blue to-brand-blue-dark shadow-brand-blue/20'
            : 'bg-gradient-to-br from-brand-navy to-[#1a3a5c] shadow-brand-navy/20'
        }`}
      >
        {isUser ? 'You' : <Bot size={14} />}
      </div>

      {/* Bubble */}
      <div className={`relative max-w-[80%] sm:max-w-[65%]`}>
        <div
          className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bubble-user bg-brand-blue text-white rounded-br-sm'
              : 'bubble-ai glass text-brand-navy rounded-bl-sm'
          }`}
        >
          {isTyping ? (
            <div className="flex items-center gap-1.5 py-0.5 px-1">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{text}</p>
          )}
        </div>

        {/* Role label */}
        <p className={`text-[10px] text-brand-navy/30 mt-1 font-medium ${isUser ? 'text-right' : 'text-left'}`}>
          {isUser ? 'You' : 'TriageAI'}
        </p>
      </div>
    </motion.div>
  )
}
