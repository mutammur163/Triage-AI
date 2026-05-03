import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Activity, Shield, Clock, ChevronRight, Sparkles, Brain, HeartPulse } from 'lucide-react'
import Button from '../components/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }),
}

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    desc: 'Advanced language models trained on medical literature analyze your symptoms intelligently.',
    color: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-200',
  },
  {
    icon: Shield,
    title: 'Risk Stratification',
    desc: 'Get a clear Low / Medium / High urgency rating with actionable next steps.',
    color: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-200',
  },
  {
    icon: HeartPulse,
    title: 'Instant Guidance',
    desc: 'Receive evidence-based recommendations tailored to your symptom profile.',
    color: 'from-rose-500 to-pink-600',
    shadow: 'shadow-rose-200',
  },
  {
    icon: Clock,
    title: 'Track History',
    desc: 'Review previous assessments over time to monitor health patterns.',
    color: 'from-amber-500 to-orange-600',
    shadow: 'shadow-amber-200',
  },
]

const stats = [
  { value: '< 5s', label: 'Response time' },
  { value: '3-tier', label: 'Risk classification' },
  { value: '100%', label: 'Private & secure' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-x-hidden"
    >
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-8 pb-16 overflow-hidden">
        {/* Background orbs */}
        <div className="orb w-[600px] h-[600px] bg-brand-blue top-[-100px] right-[-200px]" />
        <div className="orb w-[400px] h-[400px] bg-purple-400 bottom-[-80px] left-[-100px]" />
        <div className="orb w-[200px] h-[200px] bg-cyan-400 top-[30%] left-[10%]" />

        {/* Hero background pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30 pointer-events-none" />

        {/* Floating 3D decoration */}
        <motion.div
          className="absolute right-[8%] top-[15%] hidden xl:block"
          animate={{ y: [0, -16, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-64 h-64 glass rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-blue/10">
            <div className="relative">
              {/* 3D medical cross */}
              <div className="w-24 h-24 relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-navy opacity-90" style={{ transform: 'perspective(600px) rotateX(10deg) rotateY(-15deg)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity size={44} className="text-white drop-shadow-lg" />
                </div>
              </div>
              {/* Floating badge */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-3 -right-4 glass rounded-xl px-3 py-1.5 shadow-lg"
              >
                <span className="text-xs font-bold text-brand-blue">AI Ready</span>
              </motion.div>
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-3 -left-4 glass rounded-xl px-3 py-1.5 shadow-lg"
              >
                <span className="text-xs font-bold text-risk-low">🟢 Safe</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-semibold text-brand-blue border border-brand-blue/20 shadow-sm mb-6">
              <Sparkles size={12} />
              AI-Powered Health Triage · Beta
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-display font-bold text-5xl sm:text-6xl md:text-7xl text-brand-navy leading-[1.1] tracking-tight mb-6"
          >
            Assess Early.{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-brand-blue to-brand-blue-light bg-clip-text text-transparent">
                Act Fast.
              </span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
                className="absolute bottom-1 left-0 h-2 bg-brand-blue/10 rounded-full -z-0"
              />
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg sm:text-xl text-brand-navy/60 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            Describe your symptoms in plain language. TriageAI analyzes them instantly, provides
            a risk level assessment, and tells you exactly what to do next.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <Button
              id="hero-start-btn"
              variant="primary"
              size="lg"
              onClick={() => navigate('/assess')}
              className="w-full sm:w-auto"
            >
              Start Assessment
              <ArrowRight size={18} />
            </Button>
            <Button
              id="hero-learn-btn"
              variant="secondary"
              size="lg"
              onClick={() => navigate('/history')}
              className="w-full sm:w-auto"
            >
              View History
              <ChevronRight size={18} />
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex items-center justify-center gap-8 mt-12"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-display font-bold text-2xl text-brand-navy">{s.value}</p>
                <p className="text-xs text-brand-navy/40 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-navy mb-4">
              How TriageAI Works
            </h2>
            <p className="text-brand-navy/50 max-w-xl mx-auto">
              A seamless, three-step process from symptom description to actionable guidance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="glass rounded-2xl p-6 group cursor-default"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} shadow-lg ${f.shadow} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-brand-navy text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-brand-navy/55 leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative glass-dark rounded-3xl p-10 text-center overflow-hidden"
          >
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-transparent rounded-3xl" />
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue/80 mb-3">Ready to start?</p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
                Your health can't wait.
              </h2>
              <p className="text-white/50 mb-8 max-w-md mx-auto">
                Get a free, instant AI health triage in under 60 seconds. No signup required.
              </p>
              <Button
                id="cta-start-btn"
                variant="primary"
                size="lg"
                onClick={() => navigate('/assess')}
                className="mx-auto"
              >
                Start Free Assessment
                <ArrowRight size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-4 border-t border-brand-navy/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-blue flex items-center justify-center">
              <Activity size={12} className="text-white" />
            </div>
            <span className="font-display font-bold text-sm text-brand-navy">TriageAI</span>
          </div>
          <p className="text-xs text-brand-navy/30 text-center">
            Not a substitute for professional medical advice. Always consult a qualified healthcare provider.
          </p>
          <p className="text-xs text-brand-navy/30">© 2024 TriageAI</p>
        </div>
      </footer>
    </motion.div>
  )
}
