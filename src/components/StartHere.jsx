import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Play, Headphones, ExternalLink } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const TYPE_META = {
  video:   { label: 'Video',   color: '#8AACBE' },
  podcast: { label: 'Podcast', color: '#C47A6B' },
  book:    { label: 'Book',    color: '#C8974A' },
  article: { label: 'Article', color: '#94A97A' },
  website: { label: 'Site',    color: '#7BA38E' },
}

const TIME_LABELS = {
  '15min': '15 min',
  '1hr':   '1 hr',
  '3hr+':  '3 hr+',
}

const BOOK_PALETTES = [
  { from: '#0a0e27', to: '#1a2744' },
  { from: '#1a0808', to: '#3d1515' },
  { from: '#0d1a0d', to: '#1a3320' },
  { from: '#120a1f', to: '#1f1430' },
  { from: '#1a1208', to: '#2d1f0a' },
]

function titleHash(title) {
  let h = 0
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) >>> 0
  return h % BOOK_PALETTES.length
}

function extractVideoId(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/)
  return m ? m[1] : null
}

function TimelineCard({ item, index, onSelectBook, isLast, isExplored, onExplore }) {
  const [hovered, setHovered] = useState(false)
  const [shimmer, setShimmer] = useState(false)
  const { theme } = useTheme()
  const { t, lang } = useLanguage()
  const isDark = theme === 'dark'
  const isCN = lang === 'cn'

  // 3D tilt via motion values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 })

  const meta = TYPE_META[item.type] || TYPE_META.article

  const displayTitle = isCN ? (item.title_cn || item.title) : item.title
  const displayReason = isCN ? (item.startHereReason_cn || item.startHereReason) : item.startHereReason
  const videoId = (item.type === 'video' || item.type === 'podcast') ? extractVideoId(item.url) : null
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
  const coverUrl = item.isbn ? `https://covers.openlibrary.org/b/isbn/${item.isbn}-L.jpg` : null
  const palette = BOOK_PALETTES[titleHash(item.title)]
  const creator = item.creator || item.author || ''
  const hasMedia = thumbnail || coverUrl

  function handleClick(e) {
    if (item.type === 'book') {
      e.preventDefault()
      onSelectBook?.(item)
    }
  }

  const isExternalLink = item.type !== 'book' && item.url && item.url !== '#'
  const linkProps = isExternalLink
    ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
    : { href: '#', onClick: handleClick }

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [mouseX, mouseY])

  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    if (!isExplored) {
      onExplore(item.title)
      setShimmer(true)
      setTimeout(() => setShimmer(false), 600)
    }
  }, [isExplored, item.title, onExplore])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // Node bg uses actual color (not CSS var) because framer-motion needs to interpolate
  const nodeBg = isExplored ? 'rgba(200,151,74,0.12)' : (isDark ? '#0C0B09' : '#F4F1EC')

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-0"
    >
      {/* Left column: node + connector */}
      <div className="relative flex flex-col items-center flex-shrink-0" style={{ width: 72 }}>
        <div className="relative z-10" style={{ marginTop: 4 }}>
          {/* Ripple ring */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                key="ripple"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: `1.5px solid ${meta.color}`, pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>

          {/* Node circle */}
          <motion.div
            animate={{ background: nodeBg, borderColor: isExplored ? 'rgba(200,151,74,0.7)' : 'rgba(200,151,74,0.3)', scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center rounded-full"
            style={{ width: 36, height: 36, border: '1px solid rgba(200,151,74,0.3)' }}
          >
            {isExplored ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: 13, color: '#C8974A', lineHeight: 1 }}
              >
                ✦
              </motion.span>
            ) : (
              <span
                style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: 13, color: hovered ? '#C8974A' : 'rgba(200,151,74,0.5)', lineHeight: 1, transition: 'color 0.2s' }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            )}
          </motion.div>
        </div>

        {/* Connector line */}
        {!isLast && (
          <div className="flex-1 w-px mt-2 overflow-hidden" style={{ background: 'var(--th-border-sub)' }}>
            <motion.div
              animate={{ height: isExplored ? '100%' : '0%' }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              style={{ width: '100%', background: 'linear-gradient(to bottom, rgba(200,151,74,0.35), rgba(200,151,74,0.05))' }}
            />
          </div>
        )}
      </div>

      {/* Right column: card + why-panel */}
      <div className="flex-1 pb-10" style={{ paddingLeft: 16 }}>
        <div style={{ position: 'relative', perspective: 900 }}>
          {/* 3D tilt card */}
          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            onMouseMove={handleMouseMove}
          >
            <a
              {...linkProps}
              className="group block rounded-2xl overflow-hidden relative"
              style={{ textDecoration: 'none', background: 'var(--th-surface)', border: '1px solid var(--th-border)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200,151,74,0.28)'
                e.currentTarget.style.boxShadow = '0 0 0 1px rgba(200,151,74,0.12), 0 20px 60px rgba(0,0,0,0.6)'
                handleMouseEnter()
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--th-border)'
                e.currentTarget.style.boxShadow = 'none'
                handleMouseLeave()
              }}
            >
              {/* Shimmer sweep */}
              <AnimatePresence>
                {shimmer && (
                  <motion.div
                    key="shimmer"
                    initial={{ x: '-120%', skewX: '-15deg' }}
                    animate={{ x: '220%' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: 'absolute', inset: 0, width: '45%', background: 'linear-gradient(90deg, transparent, rgba(200,151,74,0.18), rgba(200,151,74,0.06), transparent)', pointerEvents: 'none', zIndex: 20 }}
                  />
                )}
              </AnimatePresence>

              {/* First-unlock top glow */}
              <AnimatePresence>
                {shimmer && (
                  <motion.div
                    key="glow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5, times: [0, 0.3, 1] }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`, pointerEvents: 'none', zIndex: 21 }}
                  />
                )}
              </AnimatePresence>

              {/* Media thumbnail */}
              {hasMedia ? (
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)` }} />
                  <img
                    src={coverUrl || thumbnail}
                    alt={item.title}
                    onError={(e) => { e.target.style.display = 'none' }}
                    className="absolute inset-0 w-full h-full object-cover lg:grayscale lg:group-hover:grayscale-0 transition-all duration-700"
                    style={{ objectPosition: item.type === 'book' ? 'center top' : 'center center' }}
                  />
                  <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-30" style={{ background: 'rgba(0,0,0,0.32)' }} />
                  <div className="absolute bottom-0 left-0 right-0" style={{ height: '50%', background: 'linear-gradient(to top, rgba(12,11,9,0.85) 0%, transparent 100%)' }} />
                  {(item.type === 'video' || item.type === 'podcast') && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: hovered ? 1.15 : 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="flex items-center justify-center rounded-full"
                        style={{ width: 52, height: 52, background: 'rgba(200,151,74,0.14)', border: '1px solid rgba(200,151,74,0.4)', backdropFilter: 'blur(8px)' }}
                      >
                        {item.type === 'video'
                          ? <Play className="w-5 h-5" style={{ color: '#C8974A', fill: '#C8974A' }} />
                          : <Headphones className="w-5 h-5" style={{ color: '#C8974A' }} />
                        }
                      </motion.div>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-widest px-2 py-1 rounded-md" style={{ color: meta.color, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', letterSpacing: '0.13em' }}>
                      {meta.label}
                    </span>
                    {item.timeCommitment && (
                      <span className="text-xs px-2 py-1 rounded-md" style={{ color: '#96928D', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
                        {TIME_LABELS[item.timeCommitment] || item.timeCommitment}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* Rich text-based banner for articles/websites */
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #0D0E18 0%, #1A1208 50%, #0E0A04 100%)' }}
                >
                  {/* Decorative grain texture */}
                  <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(200,151,74,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(200,151,74,0.07) 0%, transparent 50%)' }} />
                  {/* Large decorative quote mark */}
                  <div className="absolute" style={{ right: 24, top: 12, fontSize: 120, lineHeight: 1, fontFamily: 'Instrument Serif, Georgia, serif', color: 'rgba(200,151,74,0.06)', pointerEvents: 'none', userSelect: 'none' }}>"</div>
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-widest" style={{ color: meta.color, letterSpacing: '0.15em' }}>{meta.label}</span>
                      {item.timeCommitment && (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: 'rgba(200,151,74,0.6)', background: 'rgba(200,151,74,0.08)', border: '1px solid rgba(200,151,74,0.15)' }}>
                          {TIME_LABELS[item.timeCommitment] || item.timeCommitment}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="leading-snug mb-2 line-clamp-3" style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: 20, color: '#EDE5D8', maxWidth: 340 }}>
                        {displayTitle}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(200,151,74,0.6)' }}>
                        {item.creator || item.author}
                        {item.show && <span style={{ color: 'rgba(200,151,74,0.35)' }}> · {item.show}</span>}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="absolute top-4 right-4 w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'rgba(200,151,74,0.6)' }} />
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <p className="font-medium mb-1 line-clamp-2" style={{ color: 'var(--th-text)', fontSize: 14, lineHeight: 1.45 }}>
                  {displayTitle}
                </p>
                <p className="text-xs mb-0" style={{ color: 'var(--th-text-3)' }}>
                  {creator}
                  {item.show && <span> · {item.show}</span>}
                </p>
              </div>
            </a>
          </motion.div>

          {/* Why-panel — desktop only (no room on mobile) */}
          <div
            aria-hidden="true"
            className="hidden lg:block"
            style={{ position: 'absolute', left: 'calc(100% + 20px)', top: '50%', transform: 'translateY(-50%)', width: 288, zIndex: 30, pointerEvents: 'none' }}
          >
            <AnimatePresence>
              {hovered && item.startHereReason && (
                <motion.div
                  key="why"
                  initial={{ opacity: 0, x: 14, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 8, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#0E0D0B', border: '1px solid rgba(200,151,74,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: 2, background: `linear-gradient(90deg, ${meta.color}, transparent)`, transformOrigin: 'left' }}
                  />
                  <div style={{ padding: '18px 22px' }}>
                    <motion.span
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                      className="inline-block text-xs font-medium uppercase tracking-widest px-2 py-1 rounded mb-3"
                      style={{ color: meta.color, background: 'rgba(200,151,74,0.07)', letterSpacing: '0.14em' }}
                    >
                      {meta.label}
                    </motion.span>
                    <motion.h3
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                      className="text-base leading-snug mb-1"
                      style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', color: '#EDE5D8' }}
                    >
                      {displayTitle}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.13 }}
                      className="text-xs mb-4"
                      style={{ color: '#817D78' }}
                    >
                      {creator}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}
                      className="text-xs font-medium uppercase tracking-widest mb-2"
                      style={{ color: '#C8974A', letterSpacing: '0.16em' }}
                    >
                      {t('why_this_one')}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
                      className="text-xs leading-relaxed"
                      style={{ color: '#96928D' }}
                    >
                      {displayReason}
                    </motion.p>
                    {item.timeCommitment && (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="mt-4 pt-3"
                        style={{ borderTop: '1px solid #1A1815' }}
                      >
                        <span className="text-xs font-medium uppercase tracking-widest px-2 py-1 rounded" style={{ color: '#817D78', background: '#161412', letterSpacing: '0.12em' }}>
                          {TIME_LABELS[item.timeCommitment]}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function StartHere({ items, isBookmarked, onBookmarkToggle, onSelectBook }) {
  const [explored, setExplored] = useState(new Set())
  const { t } = useLanguage()

  const handleExplore = useCallback((title) => {
    setExplored((prev) => new Set([...prev, title]))
  }, [])

  const TYPE_ORDER = ['video', 'podcast', 'article', 'book', 'website']
  const sorted = [...items].sort(
    (a, b) => (TYPE_ORDER.indexOf(a.type) ?? 99) - (TYPE_ORDER.indexOf(b.type) ?? 99)
  )

  const progress = explored.size / sorted.length

  return (
    <div className="px-4 sm:px-8 pt-8 sm:pt-10 pb-20">

      {/* Hero intro */}
      <div className="mb-12 sm:mb-16 pb-10 sm:pb-12" style={{ borderBottom: '1px solid var(--th-border-sub)' }}>
        <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight mb-4" style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', color: 'var(--th-text)', maxWidth: 560 }}>
          {t('hero_title')}
        </h1>
        <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--th-text-2)', maxWidth: 480, lineHeight: 1.8 }}>
          {t('hero_desc')}
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(200,151,74,0.07)', border: '1px solid rgba(200,151,74,0.15)', color: 'var(--th-text-2)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C8974A', display: 'inline-block' }} />
            {t('hero_badge_free')}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(200,151,74,0.07)', border: '1px solid rgba(200,151,74,0.15)', color: 'var(--th-text-2)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C8974A', display: 'inline-block' }} />
            {t('hero_badge_nontechnical')}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-10 sm:mb-12">
        <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#C8974A', letterSpacing: '0.18em' }}>
          {t('start_here_label')}
        </p>
        <h1 className="text-4xl leading-tight mb-2" style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', color: 'var(--th-text)' }}>
          {t('start_here_h1')}
        </h1>
        <p className="text-base max-w-lg" style={{ color: 'var(--th-text-2)', lineHeight: 1.7 }}>
          {t('start_here_desc')}
        </p>

        {/* Progress tracker */}
        <div className="mt-5 flex items-center gap-3">
          <div className="flex-1 h-px rounded-full overflow-hidden" style={{ background: 'rgba(200,151,74,0.1)' }}>
            <motion.div
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #C8974A, rgba(200,151,74,0.4))' }}
            />
          </div>
          <motion.span
            key={explored.size}
            initial={{ scale: 1.3, color: '#C8974A' }}
            animate={{ scale: 1, color: 'var(--th-text-3)' }}
            transition={{ duration: 0.3 }}
            className="text-xs tabular-nums flex-shrink-0"
          >
            {explored.size} / {sorted.length} {t('start_explored')}
          </motion.span>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ maxWidth: 520, width: '100%' }}>
        {sorted.map((item, i) => (
          <TimelineCard
            key={item.title}
            item={item}
            index={i}
            isBookmarked={isBookmarked}
            onBookmarkToggle={onBookmarkToggle}
            onSelectBook={onSelectBook}
            isLast={i === sorted.length - 1}
            isExplored={explored.has(item.title)}
            onExplore={handleExplore}
          />
        ))}
      </div>

      {/* Completion celebration */}
      <AnimatePresence>
        {explored.size === sorted.length && sorted.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 rounded-2xl px-6 py-5"
            style={{ maxWidth: 520, width: '100%', background: 'rgba(200,151,74,0.05)', border: '1px solid rgba(200,151,74,0.2)' }}
          >
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: '#C8974A', letterSpacing: '0.18em' }}>
              {t('start_all_explored_title')}
            </p>
            <p className="text-sm" style={{ color: 'var(--th-text-2)', lineHeight: 1.6 }}>
              {t('start_all_explored_desc')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
