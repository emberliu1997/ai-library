import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export function ThinkingDrawer({ item, onClose }) {
  const { t } = useLanguage()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!item) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [item, onClose])

  useEffect(() => {
    document.body.style.overflow = item ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [item])

  // Move focus into the dialog when it opens
  useEffect(() => {
    if (item && closeRef.current) closeRef.current.focus()
  }, [item])

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop — hidden from assistive tech */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)', zIndex: 40 }}
          />

          {/* Dialog panel */}
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100%',
              width: '100%',
              maxWidth: 480,
              background: '#0E0D0B',
              borderLeft: '1px solid #1F1D1A',
              zIndex: 50,
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div
              className="sticky top-0 flex items-center justify-between px-8 py-5 z-10"
              style={{ background: '#0E0D0B', borderBottom: '1px solid #1A1815' }}
            >
              <span className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: '#C8974A', fontFamily: 'DM Sans' }} aria-hidden="true">
                {t('deep_thinking')}
              </span>
              <button
                ref={closeRef}
                onClick={onClose}
                className="flex items-center justify-center rounded-full transition-colors"
                style={{ width: 32, height: 32 }}
                aria-label="Close"
                onMouseEnter={(e) => { e.currentTarget.style.background = '#1F1D1A' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <X className="w-4 h-4" style={{ color: '#96928D' }} />
              </button>
            </div>

            {/* Body */}
            <div className="px-8 py-7 space-y-8">
              {/* Stage badge + Title + Author */}
              <div>
                <span
                  className="inline-block text-xs font-medium uppercase tracking-widest px-2 py-1 rounded mb-4"
                  style={{ color: '#817D78', background: '#1A1815', letterSpacing: '0.14em' }}
                >
                  {item.stage || item.category}
                </span>
                <h2
                  id="drawer-title"
                  className="text-2xl leading-tight"
                  style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', color: '#EDE5D8' }}
                >
                  {item.title}
                </h2>
                <p className="text-sm mt-2" style={{ color: '#96928D' }}>
                  {t('by')} {item.author}
                </p>
              </div>

              {/* Why It Matters */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] mb-3" style={{ color: '#817D78' }}>
                  {t('why_it_matters')}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#A09890' }}>
                  {item.implication}
                </p>
              </div>

              {/* The Connection */}
              {item.deepThinkingBridge && (
                <div className="rounded-xl p-5" style={{ background: '#0D1424', border: '1px solid #1A2744' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#C8974A' }} aria-hidden="true" />
                    <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: '#C8974A' }}>
                      {t('the_connection')}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#8BA3C7' }}>
                    {item.deepThinkingBridge}
                  </p>
                </div>
              )}

              {/* CTA — search book on Google */}
              {item.type === 'book' && (item.author || item.creator) && (
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(`${item.title} by ${item.author || item.creator}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-xl text-sm font-medium transition-colors"
                  style={{ padding: '12px 16px', background: 'rgba(200,151,74,0.1)', border: '1px solid rgba(200,151,74,0.25)', color: '#C8974A', textDecoration: 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(200,151,74,0.18)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(200,151,74,0.1)' }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Find this book
                </a>
              )}

              <div style={{ height: 32 }} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
