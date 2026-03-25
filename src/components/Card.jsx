import { motion } from 'framer-motion'
import { Play, Headphones, FileText, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

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

const TYPE_CONFIG = {
  book:       { label: 'Book',       Icon: null,       isLink: true  },
  video:      { label: 'Video',      Icon: Play,       isLink: true  },
  podcast:    { label: 'Podcast',    Icon: Headphones, isLink: true  },
  article:    { label: 'Article',    Icon: FileText,   isLink: true  },
  website:    { label: 'Site',       Icon: Globe,      isLink: true  },
  newsletter: { label: 'Newsletter', Icon: FileText,   isLink: true  },
}

const ASPECT = {
  book:       '3/4',
  video:      '16/9',
  podcast:    '16/9',
  article:    null,
  website:    null,
  newsletter: null,
}

export function Card({ item, onSelect, index = 0 }) {
  const { lang, t } = useLanguage()
  const isCN = lang === 'cn'
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.article
  const videoId = (item.type === 'video' || item.type === 'podcast') ? extractVideoId(item.url) : null
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : (item.image || null)
  const coverUrl = item.isbn ? `https://covers.openlibrary.org/b/isbn/${item.isbn}-L.jpg` : null
  const palette = BOOK_PALETTES[titleHash(item.title)]
  const displayTitle = isCN ? (item.title_cn || item.title) : item.title
  const displayImplication = isCN ? (item.implication_cn || item.implication) : item.implication
  const creator = item.creator || item.author || ''
  const hasImage = ASPECT[item.type] !== null || !!item.image

  // For books: use a button. For links: use an anchor.
  const isExternalLink = item.type !== 'book' && cfg.isLink && item.url && item.url !== '#'
  const isBook = item.type === 'book'
  const isVideo = item.type === 'video' || item.type === 'podcast'
  const isFixedCard = isBook || isVideo

  function ImageArea() {
    const imageContent = (
      <>
        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)` }} />
        {(coverUrl || thumbnail) && (
          <img
            src={coverUrl || thumbnail}
            alt=""
            aria-hidden="true"
            onError={(e) => { e.target.style.display = 'none' }}
            className="absolute inset-0 w-full h-full object-cover lg:grayscale lg:group-hover:grayscale-0 transition-all duration-500 ease-out"
          />
        )}
        {item.type === 'book' && !coverUrl && (
          <div className="absolute inset-0 flex flex-col justify-end p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }}>
            <p className="text-sm leading-snug line-clamp-3" style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', color: '#EDE5D8' }}>
              {displayTitle}
            </p>
            <p className="text-xs mt-1 opacity-60" style={{ color: '#EDE5D8' }}>{item.author}</p>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.22)' }} />
        {cfg.Icon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110" style={{ width: 38, height: 38, background: 'rgba(var(--th-accent-rgb),0.12)', border: '1px solid rgba(var(--th-accent-rgb),0.3)', backdropFilter: 'blur(8px)' }}>
              <cfg.Icon className="w-3.5 h-3.5" style={{ color: 'var(--th-accent)', fill: item.type === 'video' ? 'var(--th-accent)' : 'none', strokeWidth: item.type === 'podcast' ? 1.5 : 0 }} />
            </div>
          </div>
        )}
      </>
    )

    const aspectRatio = isFixedCard ? undefined : (ASPECT[item.type] || (item.image ? '16/9' : undefined))
    const fixedImgStyle = isFixedCard ? { flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden', width: '100%', display: 'block' } : { aspectRatio }

    if (isExternalLink) {
      return (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden" style={{ aspectRatio }} aria-label={`${cfg.label}: ${item.title}`} tabIndex={-1}>
          {imageContent}
        </a>
      )
    }
    return (
      <button onClick={() => onSelect?.(item)} className="relative overflow-hidden w-full" style={fixedImgStyle} aria-label={`Open ${item.title}`} tabIndex={-1}>
        {imageContent}
      </button>
    )
  }

  function TextArea() {
    const content = (
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--th-accent)', letterSpacing: '0.12em' }}>
            {cfg.label}
          </span>
        </div>
        <p className="text-[15px] font-medium leading-snug line-clamp-2" style={{ color: '#EDE5D8', lineHeight: 1.45 }}>
          {displayTitle}
        </p>
        {displayImplication && (
          <p className="text-xs mt-1.5 leading-relaxed line-clamp-2" style={{ color: '#96928D' }}>
            {displayImplication}
          </p>
        )}
        <p className="text-xs mt-2.5" style={{ color: '#817D78' }}>
          {creator}
          {item.show && <><span aria-hidden="true"> · </span>{item.show}</>}
        </p>
      </div>
    )

    if (isExternalLink) {
      return (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block" style={{ textDecoration: 'none' }}>
          {content}
        </a>
      )
    }
    return (
      <button onClick={() => onSelect?.(item)} className="block w-full text-left" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
        {content}
      </button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      {/* Outer wrapper — position:relative so bookmark can be absolutely placed */}
      <div
        className="rounded-2xl overflow-hidden group cursor-pointer relative"
        style={{
          background: '#111010',
          border: '1px solid #1F1D1A',
          ...(isBook && { display: 'flex', flexDirection: 'column', aspectRatio: '0.618/1' }),
          ...(isVideo && { display: 'flex', flexDirection: 'column', aspectRatio: '16/11' }),
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 1px rgba(var(--th-accent-rgb),0.18), 0 10px 28px rgba(0,0,0,0.55)'
          e.currentTarget.style.borderColor = 'rgba(var(--th-accent-rgb),0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.borderColor = '#1F1D1A'
        }}
      >
        {hasImage && <ImageArea />}
        <TextArea />

        {/* Why hover panel — slides up from bottom on hover */}
        {item.startHereReason && (
          <div
            className="absolute bottom-0 left-0 right-0 z-10 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250"
            style={{
              background: 'rgba(10,9,7,0.95)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '10px 14px 14px',
              borderTop: '1px solid rgba(var(--th-accent-rgb),0.18)',
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: 'var(--th-accent)', letterSpacing: '0.15em' }}
            >
              {t('why_this_one')}
            </p>
            <p className="text-xs leading-relaxed line-clamp-3" style={{ color: '#96928D' }}>
              {isCN ? (item.startHereReason_cn || item.startHereReason) : item.startHereReason}
            </p>
          </div>
        )}

      </div>
    </motion.div>
  )
}
