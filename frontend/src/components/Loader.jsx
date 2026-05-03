import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

/**
 * Full-screen loading overlay or inline spinner
 * @param {'fullscreen'|'overlay'|'inline'} props.variant
 * @param {string} props.message
 */
export default function Loader({ variant = 'inline', message = 'Analyzing your symptoms…' }) {
  if (variant === 'fullscreen' || variant === 'overlay') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`flex flex-col items-center justify-center gap-6 ${
          variant === 'fullscreen' ? 'min-h-[60vh]' : 'py-16'
        }`}
      >
        <div className="relative">
          {/* Outer ring */}
          <motion.div
            className="w-20 h-20 rounded-full border-2 border-brand-blue/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand-blue" />
          </motion.div>

          {/* Inner pulse */}
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-blue/5 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Activity size={22} className="text-brand-blue" />
          </motion.div>
        </div>

        <div className="text-center">
          <p className="font-semibold text-brand-navy text-sm">{message}</p>
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-brand-navy/40 text-xs mt-1"
          >
            Powered by AI · Usually takes 2–4 seconds
          </motion.p>
        </div>
      </motion.div>
    )
  }

  // Inline
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="w-4 h-4 rounded-full border-2 border-brand-blue border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      <span className="text-xs text-brand-navy/60">{message}</span>
    </div>
  )
}
