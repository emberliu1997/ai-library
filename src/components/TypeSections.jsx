import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MasonryGrid } from './MasonryGrid'
import { ExternalLink } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const TYPE_ORDER = ['video', 'podcast', 'website', 'article', 'book']

const TYPE_LABEL_KEYS = {
  video:   'type_videos',
  podcast: 'type_podcasts',
  website: 'type_websites',
  article: 'type_articles',
  book:    'type_books',
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

/** Floating thumbnail preview — always dark-themed (tooltip style) */
function ThumbnailPreview({ item, y }) {
  const videoId = (item.type === 'video' || item.type === 'podcast') ? extractVideoId(item.url) : null
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
  const coverUrl = item.isbn ? `https://covers.openlibrary.org/b/isbn/${item.isbn}-L.jpg` : null
  const src = thumbnail || coverUrl
  const creator = item.creator || item.author || ''
  const palette = BOOK_PALETTES[titleHash(item.title)]
  const isPortrait = !thumbnail && coverUrl

  if (!src) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 10, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 6, scale: 0.97 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        right: 40,
        top: y,
        transform: 'translateY(-50%)',
        width: isPortrait ? 160 : 220,
        zIndex: 9000,
        pointerEvents: 'none',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#0E0D0B',
        border: '1px solid rgba(200,151,74,0.22)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.65)',
      }}
    >
      {/* Image */}
      <div
        style={{
          position: 'relative',
          aspectRatio: isPortrait ? '2/3' : '16/9',
          overflow: 'hidden',
          background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)`,
        }}
      >
        <img
          src={src}
          alt={item.title}
          onError={(e) => { e.target.style.display = 'none' }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(8,7,6,0.8) 0%, transparent 50%)',
        }} />
      </div>
      {/* Info */}
      <div style={{ padding: '10px 13px 12px' }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#EDE5D8', lineHeight: 1.4, marginBottom: 3 }}>
          {item.title}
        </p>
        {creator && (
          <p style={{ fontSize: 11, color: '#817D78', lineHeight: 1.3 }}>{creator}</p>
        )}
      </div>
    </motion.div>
  )
}

/** Compact list row used in list-view mode */
function ListRow({ item, index, onSelectBook }) {
  const [hovered, setHovered] = useState(false)
  const [previewY, setPreviewY] = useState(0)
  const { lang } = useLanguage()
  const isCN = lang === 'cn'

  const displayTitle = isCN ? (item.title_cn || item.title) : item.title
  const creator = item.creator || item.author || ''
  const isLink = item.type !== 'book' && item.url && item.url !== '#'

  // Check if item has a previewable thumbnail
  const videoId = (item.type === 'video' || item.type === 'podcast') ? extractVideoId(item.url) : null
  const hasThumbnail = videoId || item.isbn

  function handleEnter(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    setPreviewY(rect.top + rect.height / 2)
    setHovered(true)
  }

  function handleLeave() {
    setHovered(false)
  }

  const inner = (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.015, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-start gap-3 py-2.5 px-3 rounded-lg transition-all"
      style={{
        cursor: 'pointer',
        background: hovered ? 'var(--th-hover)' : 'transparent',
      }}
    >
      {/* Type dot — animates amber on hover */}
      <div
        className="mt-1.5 rounded-full flex-shrink-0 transition-colors"
        style={{ width: 6, height: 6, background: hovered ? '#C8974A' : 'rgba(200,151,74,0.35)' }}
      />

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[13px] font-medium leading-snug transition-colors"
          style={{ color: hovered ? '#C8974A' : 'var(--th-text)' }}
        >
          {displayTitle}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--th-text-3)' }}>
          {creator}
          {item.show && (
            <>
              <span style={{ margin: '0 4px', color: 'var(--th-border)' }}>·</span>
              {item.show}
            </>
          )}
        </p>
      </div>

      {/* Right: time + link icon + bookmark */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {item.timeCommitment && (
          <span
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ color: 'var(--th-text-3)', background: 'var(--th-surface2)' }}
          >
            {item.timeCommitment === '15min' ? '15 min' : item.timeCommitment === '1hr' ? '1 hr' : '3 hr+'}
          </span>
        )}
        {isLink && (
          <ExternalLink
            className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: '#C8974A' }}
          />
        )}
      </div>
    </motion.div>
  )

  return (
    <>
      {isLink ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'block' }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {inner}
        </a>
      ) : (
        <div
          onClick={() => onSelectBook?.(item)}
          style={{ display: 'block' }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {inner}
        </div>
      )}

      {/* Floating thumbnail preview */}
      <AnimatePresence>
        {hovered && hasThumbnail && (
          <ThumbnailPreview key={item.title} item={item} y={previewY} />
        )}
      </AnimatePresence>
    </>
  )
}

export function TypeSections({ items, isBookmarked, onBookmarkToggle, onSelectBook, viewMode = 'grid' }) {
  const { t } = useLanguage()

  const groups = TYPE_ORDER
    .map((type) => ({ type, items: items.filter((i) => i.type === type) }))
    .filter(({ items }) => items.length > 0)

  if (groups.length === 0) return null

  return (
    <div className="space-y-10">
      {groups.map(({ type, items: groupItems }) => (
        <div key={type}>
          {/* Section header */}
          <div className="flex items-center gap-3 mb-4" role="heading" aria-level={3}>
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: '#C8974A', letterSpacing: '0.16em' }}
            >
              {t(TYPE_LABEL_KEYS[type])}
            </span>
            <span
              className="text-xs tabular-nums px-1.5 py-0.5 rounded"
              style={{ color: 'var(--th-text-3)', background: 'var(--th-surface2)' }}
              aria-label={`${groupItems.length} items`}
            >
              {groupItems.length}
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--th-border-sub)' }} aria-hidden="true" />
          </div>

          {viewMode === 'list' ? (
            <div className="-mx-3">
              {groupItems.map((item, i) => (
                <ListRow
                  key={`${item.type}-${item.title}`}
                  item={item}
                  index={i}
                  isBookmarked={isBookmarked}
                  onBookmarkToggle={onBookmarkToggle}
                  onSelectBook={onSelectBook}
                />
              ))}
            </div>
          ) : (
            <MasonryGrid
              items={groupItems}
              type={type}
              isBookmarked={isBookmarked}
              onBookmarkToggle={onBookmarkToggle}
              onSelectBook={onSelectBook}
            />
          )}
        </div>
      ))}
    </div>
  )
}
