import { motion } from 'framer-motion'
import { ShieldCheck, AlertTriangle, AlertOctagon, Activity, ArrowRight } from 'lucide-react'
import Button from './Button'

const riskConfig = {
  LOW: {
    label: 'Low Risk',
    color: 'text-risk-low',
    bgColor: 'bg-risk-low-bg',
    borderColor: 'border-risk-low/30',
    glowClass: 'risk-glow-low',
    gradFrom: 'from-emerald-50',
    gradTo: 'to-teal-50',
    iconBg: 'bg-risk-low',
    Icon: ShieldCheck,
    emoji: '🟢',
    message: 'Your symptoms suggest a low urgency situation.',
    action: 'Monitor your symptoms at home and consider speaking to your doctor if symptoms worsen or persist beyond 48 hours.',
    actionLabel: 'Schedule a Routine Checkup',
    dotColor: 'bg-risk-low',
  },
  MEDIUM: {
    label: 'Medium Risk',
    color: 'text-risk-medium',
    bgColor: 'bg-risk-medium-bg',
    borderColor: 'border-risk-medium/30',
    glowClass: 'risk-glow-medium',
    gradFrom: 'from-amber-50',
    gradTo: 'to-yellow-50',
    iconBg: 'bg-risk-medium',
    Icon: AlertTriangle,
    emoji: '🟡',
    message: 'Your symptoms require timely medical attention.',
    action: 'Visit an urgent care clinic or contact your healthcare provider today. Do not delay if symptoms worsen rapidly.',
    actionLabel: 'Find Urgent Care Near You',
    dotColor: 'bg-risk-medium',
  },
  HIGH: {
    label: 'High Risk',
    color: 'text-risk-high',
    bgColor: 'bg-risk-high-bg',
    borderColor: 'border-risk-high/30',
    glowClass: 'risk-glow-high',
    gradFrom: 'from-red-50',
    gradTo: 'to-rose-50',
    iconBg: 'bg-risk-high',
    Icon: AlertOctagon,
    emoji: '🔴',
    message: 'Your symptoms may indicate a serious condition.',
    action: 'Seek emergency medical care immediately or call 911. Do not wait or self-medicate.',
    actionLabel: 'Call Emergency Services (911)',
    dotColor: 'bg-risk-high',
  },
}

/**
 * Risk result dashboard card
 * @param {'LOW'|'MEDIUM'|'HIGH'} props.riskLevel
 * @param {string[]} props.symptoms
 * @param {string} props.explanation
 * @param {() => void} props.onReset
 */
export default function RiskCard({ riskLevel = 'LOW', symptoms = [], explanation = '', onReset }) {
  const cfg = riskConfig[riskLevel] ?? riskConfig.LOW
  const { Icon } = cfg

  return (
    <motion.div
      id="risk-result-card"
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Main card */}
      <div className={`glass rounded-3xl border ${cfg.borderColor} overflow-hidden shadow-2xl`}>

        {/* Header gradient band */}
        <div className={`bg-gradient-to-r ${cfg.gradFrom} ${cfg.gradTo} px-6 pt-8 pb-6 flex flex-col items-center text-center`}>
          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 18 }}
            className={`w-20 h-20 rounded-2xl ${cfg.iconBg} ${cfg.glowClass} flex items-center justify-center mb-4 shadow-lg`}
          >
            <Icon size={36} className="text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-navy/50 mb-1">Risk Assessment</p>
            <h2 className={`font-display font-bold text-4xl ${cfg.color}`}>{cfg.label}</h2>
            <p className="text-brand-navy/60 text-sm mt-2 max-w-sm">{cfg.message}</p>
          </motion.div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">

          {/* Detected Symptoms */}
          {symptoms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-navy/40 mb-3 flex items-center gap-2">
                <Activity size={12} />
                Detected Symptoms
              </h3>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((s, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    className="px-3 py-1 bg-brand-blue/8 text-brand-navy text-xs font-medium rounded-lg border border-brand-blue/15"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Explanation */}
          {explanation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className={`rounded-2xl p-4 ${cfg.bgColor} border ${cfg.borderColor}`}
            >
              <p className="text-sm text-brand-navy/80 leading-relaxed">{explanation}</p>
            </motion.div>
          )}

          {/* Recommended action */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-4"
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-navy/40 mb-2">Recommended Action</h3>
            <p className="text-sm text-brand-navy/80 leading-relaxed">{cfg.action}</p>
          </motion.div>
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
          <Button
            id="risk-action-btn"
            variant="primary"
            size="md"
            className="flex-1"
            onClick={() => {}}
          >
            {cfg.actionLabel}
            <ArrowRight size={16} />
          </Button>
          <Button
            id="risk-restart-btn"
            variant="secondary"
            size="md"
            onClick={onReset}
          >
            New Assessment
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-[11px] text-brand-navy/30 mt-4 px-4"
      >
        ⚠️ TriageAI is not a substitute for professional medical advice, diagnosis, or treatment.
      </motion.p>
    </motion.div>
  )
}
