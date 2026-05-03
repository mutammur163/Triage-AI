import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Clock, ShieldCheck, AlertTriangle, AlertOctagon, Trash2, Plus, ChevronDown, ChevronUp, Activity } from 'lucide-react'
import { getHistory, clearHistory } from '../services/history'
import Button from '../components/Button'

const riskConfig = {
  LOW:    { color: 'text-risk-low',    bg: 'bg-risk-low-bg',    border: 'border-risk-low/20',    Icon: ShieldCheck,   dot: 'bg-risk-low' },
  MEDIUM: { color: 'text-risk-medium', bg: 'bg-risk-medium-bg', border: 'border-risk-medium/20', Icon: AlertTriangle, dot: 'bg-risk-medium' },
  HIGH:   { color: 'text-risk-high',   bg: 'bg-risk-high-bg',   border: 'border-risk-high/20',   Icon: AlertOctagon,  dot: 'bg-risk-high' },
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function HistoryCard({ entry, index }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = riskConfig[entry.risk_level] ?? riskConfig.LOW
  const { Icon } = cfg

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
      className={`glass rounded-2xl border ${cfg.border} overflow-hidden`}
    >
      {/* Card header */}
      <button
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-brand-navy/[0.02] transition-colors"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        {/* Risk icon */}
        <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
          <Icon size={18} className={cfg.color} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-widest ${cfg.color}`}>
              {entry.risk_level} Risk
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          </div>
          <p className="text-sm text-brand-navy font-medium line-clamp-1 mb-1">
            {entry.input}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-brand-navy/30">
            <Clock size={10} />
            <span>{formatDate(entry.timestamp)}</span>
          </div>
        </div>

        <div className="text-brand-navy/30 shrink-0 mt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-brand-navy/5 pt-4">
              {/* Symptoms */}
              {entry.symptoms?.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-navy/30 mb-2">Detected Symptoms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.symptoms.map((s, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-brand-blue/8 text-brand-navy/70 font-medium border border-brand-blue/10">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation */}
              {entry.explanation && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-navy/30 mb-2">Analysis</p>
                  <p className="text-xs text-brand-navy/60 leading-relaxed">{entry.explanation}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function History() {
  const [history, setHistory] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleClear = () => {
    if (window.confirm('Clear all history? This cannot be undone.')) {
      clearHistory()
      setHistory([])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="min-h-[calc(100vh-4rem)] px-4 py-8"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-brand-navy mb-1">Assessment History</h1>
            <p className="text-sm text-brand-navy/50">
              {history.length === 0
                ? 'No assessments recorded yet.'
                : `${history.length} past assessment${history.length > 1 ? 's' : ''}`}
            </p>
          </div>
          {history.length > 0 && (
            <button
              id="clear-history-btn"
              onClick={handleClear}
              className="btn-ghost text-sm text-red-400 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {history.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-5">
              <Activity size={28} className="text-brand-blue/60" />
            </div>
            <h2 className="font-semibold text-brand-navy text-lg mb-2">No assessments yet</h2>
            <p className="text-sm text-brand-navy/40 mb-6 max-w-xs mx-auto">
              Start your first AI health triage assessment to see your history here.
            </p>
            <Button
              id="history-start-btn"
              variant="primary"
              onClick={() => navigate('/assess')}
            >
              <Plus size={16} />
              Start Assessment
            </Button>
          </motion.div>
        )}

        {/* History list */}
        {history.length > 0 && (
          <div className="space-y-3">
            {history.map((entry, i) => (
              <HistoryCard key={entry.id} entry={entry} index={i} />
            ))}

            {/* New assessment CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: history.length * 0.06 + 0.2 }}
              className="pt-2"
            >
              <Button
                id="history-new-btn"
                variant="secondary"
                className="w-full"
                onClick={() => navigate('/assess')}
              >
                <Plus size={16} />
                New Assessment
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
