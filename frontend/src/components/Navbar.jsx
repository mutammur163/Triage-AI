import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Clock, Menu, X, Zap } from 'lucide-react'

const navLinks = [
  { label: 'Home',       href: '/' },
  { label: 'Assessment', href: '/assess' },
  { label: 'History',    href: '/history' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleAssessClick = (e) => {
    if (location.pathname === '/assess') {
      e.preventDefault()
      window.dispatchEvent(new Event('reset-assessment'))
      setMobileOpen(false)
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-white/50 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue to-brand-navy flex items-center justify-center shadow-md shadow-brand-blue/30"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Activity size={18} className="text-white" />
            </motion.div>
            <span className="font-display font-bold text-xl text-brand-navy group-hover:text-brand-blue transition-colors">
              Triage<span className="text-brand-blue">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={link.href === '/assess' ? handleAssessClick : undefined}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'text-brand-blue'
                      : 'text-brand-navy/60 hover:text-brand-navy'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-brand-blue/10"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/assess" onClick={handleAssessClick} className="btn-primary py-2 px-5 text-sm">
              <Zap size={15} />
              Start Assessment
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden btn-ghost p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass border-b border-white/50 md:hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                    location.pathname === link.href
                      ? 'bg-brand-blue/10 text-brand-blue'
                      : 'text-brand-navy/70 hover:bg-brand-navy/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/assess" onClick={handleAssessClick} className="btn-primary mt-2 w-full text-sm justify-center">
                <Zap size={15} />
                Start Assessment
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}
