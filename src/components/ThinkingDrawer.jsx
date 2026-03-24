import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export function ThinkingDrawer({ item, onClose }) {
  const { t, lang } = useLanguage()
  const isCN = lang === 'cn'
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

  useEffect(() => {
    if (item && closeRef.current) closeRef.current.focus()
  }, [item])

  const coverUrl = item?.isbn
    ? `https://covers.openlibrary.org/b/isbn/${item.isbn}-L.jpg`
    : null

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
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
              position: 'fixed', top: 0, right: 0,
              height: '100%', width: '100%', maxWidth: 480,
              background: '#0E0D0B',
              borderLeft: '1px solid #1F1D1A',
              zIndex: 50, overflowY: 'auto',
            }}
          >
            {/* ── Sticky header ── */}
            <div
              className="sticky top-0 flex items-center justify-between px-6 py-4 z-10"
              style={{ background: 'rgba(14,13,11,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1A1815' }}
            >
              <span className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: '#C8974A' }} aria-hidden="true">
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

            {/* ── Hero: title left + cover right ── */}
            <div
              className="relative overflow-hidden"
              style={{ minHeight: 280, padding: '36px 28px 44px' }}
            >
              {/* Ambient blurred cover as background */}
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt=""
                  aria-hidden="true"
                  onError={(e) => { e.target.style.display = 'none' }}
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%', objectFit: 'cover',
                    filter: 'blur(32px) brightness(0.18) saturate(1.4)',
                    transform: 'scale(1.15)',
                  }}
                />
              )}
              {/* Gradient overlay for legibility */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(105deg, rgba(14,13,11,0.92) 0%, rgba(14,13,11,0.72) 55%, rgba(14,13,11,0.45) 100%)',
              }} />
              {/* Bottom fade to body */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
                background: 'linear-gradient(to bottom, transparent, #0E0D0B)',
              }} />

              {/* Side-by-side layout */}
              <div className="relative flex items-end gap-5 z-10">

                {/* Left: badge + title + author */}
                <div className="flex-1 min-w-0">
                  <span
                    className="inline-block text-xs font-medium uppercase tracking-widest px-2 py-0.5 rounded mb-4"
                    style={{ color: '#817D78', background: 'rgba(255,255,255,0.06)', letterSpacing: '0.14em', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {item.stage || item.category}
                  </span>
                  <h2
                    id="drawer-title"
                    className="leading-tight mb-3"
                    style={{
                      fontFamily: 'Instrument Serif, Georgia, serif',
                      fontStyle: 'italic',
                      fontSize: 'clamp(20px, 4.5vw, 26px)',
                      color: '#EDE5D8',
                    }}
                  >
                    {isCN ? (item.title_cn || item.title) : item.title}
                  </h2>
                  <p className="text-sm" style={{ color: '#817D78' }}>
                    {t('by')} <span style={{ color: '#96928D' }}>{item.author}</span>
                  </p>
                </div>

                {/* Right: book cover */}
                {coverUrl && (
                  <div className="flex-shrink-0" style={{ marginBottom: -16 }}>
                    <img
                      src={coverUrl}
                      alt={item.title}
                      onError={(e) => { e.target.parentElement.style.display = 'none' }}
                      style={{
                        height: 200,
                        width: 'auto',
                        borderRadius: 6,
                        transform: 'rotate(2deg)',
                        boxShadow: '0 24px 56px rgba(0,0,0,0.8), 0 8px 20px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.07)',
                        transformOrigin: 'bottom right',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ── Content ── */}
            <div className="px-7 pb-10 space-y-7" style={{ paddingTop: 28 }}>

              {/* Divider */}
              <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(200,151,74,0.2), transparent)' }} />

              {/* Why It Matters */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] mb-3" style={{ color: '#5A5650', letterSpacing: '0.18em' }}>
                  {t('why_it_matters')}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#A09890', lineHeight: 1.8 }}>
                  {isCN ? (item.implication_cn || item.implication) : item.implication}
                </p>
              </div>

              {/* The Connection */}
              {(item.deepThinkingBridge || item.deepThinkingBridge_cn) && (
                <div
                  className="rounded-xl p-5"
                  style={{ background: 'rgba(13,20,36,0.7)', border: '1px solid rgba(59,91,153,0.25)' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#C8974A' }} aria-hidden="true" />
                    <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: '#C8974A' }}>
                      {t('the_connection')}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#8BA3C7', lineHeight: 1.8 }}>
                    {isCN ? (item.deepThinkingBridge_cn || item.deepThinkingBridge) : item.deepThinkingBridge}
                  </p>
                </div>
              )}

              {/* CTA */}
              {item.type === 'book' && (item.author || item.creator) && (
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(`${item.title} by ${item.author || item.creator}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-xl text-sm font-medium transition-all"
                  style={{ padding: '13px 16px', background: 'rgba(200,151,74,0.08)', border: '1px solid rgba(200,151,74,0.22)', color: '#C8974A', textDecoration: 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(200,151,74,0.15)'; e.currentTarget.style.borderColor = 'rgba(200,151,74,0.4)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(200,151,74,0.08)'; e.currentTarget.style.borderColor = 'rgba(200,151,74,0.22)' }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t('find_this_book')}
                </a>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
