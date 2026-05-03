import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

/**
 * Button component
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'} props.variant
 * @param {boolean} props.loading
 * @param {boolean} props.disabled
 * @param {'sm'|'md'|'lg'} props.size
 */
export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  size = 'md',
  className = '',
  id,
  onClick,
  type = 'button',
  ...rest
}) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const variantClasses = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost:     'btn-ghost',
  }

  return (
    <motion.button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        (disabled || loading) ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin shrink-0" />}
      {children}
    </motion.button>
  )
}
