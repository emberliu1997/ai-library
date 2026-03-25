import { useRef } from 'react'
import { Play, Headphones } from 'lucide-react'
import { TypeSections } from './TypeSections'
import { useLanguage } from '../context/LanguageContext'

const STAGE_IDS = ['Literacy', 'Craft', 'Judgment', 'Systems Thinking']

const STAGE_META = {
  Literacy: {
    number: '01',
    spotlight: '[1hr Talk] Intro to Large Language Models',
  },
  Craft: {
    number: '02',
    spotlight: 'AI prompt engineering in 2025 (with Sander Schulhoff)',
  },
  Judgment: {
    number: '03',
    spotlight: 'How to Build a Beloved AI Product',
  },
  'Systems Thinking': {
    number: '04',
    spotlight: 'The Rise of AI Agents (Andrew Ng, BUILD 2024)',
  },
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

function SpotlightCard({ item, stagePick }) {
  if (!item) return null
  const { lang } = useLanguage()
  const isCN = lang === 'cn'
  const displayTitle = isCN ? (item.title_cn || item.title) : item.title

  const isLink = item.type !== 'book'
  const linkProps = isLink && item.url && item.url !== '#'
    ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
    : { href: '#' }

  function extractVideoId(url) {
    if (!url) return null
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/)
    return m ? m[1] : null
  }

  const videoId = (item.type === 'video' || item.type === 'podcast') ? extractVideoId(item.url) : null
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  const coverUrl = item.isbn ? `https://covers.openlibrary.org/b/isbn/${item.isbn}-L.jpg` : null
  const creator = item.creator || item.author || ''
  const palette = BOOK_PALETTES[titleHash(item.title)]

  return (
    <a
      {...linkProps}
      className="group block relative rounded-2xl overflow-hidden mb-8 h-[220px] sm:h-[320px] lg:h-[420px]"
      style={{ textDecoration: 'none' }}
      aria-label={`${stagePick}: ${item.title}`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)` }} />

      {/* Hero image */}
      {(thumbnail || coverUrl) && (
        <img
          src={thumbnail || coverUrl}
          alt=""
          aria-hidden="true"
          onError={(e) => { e.target.style.display = 'none' }}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 lg:grayscale lg:group-hover:grayscale-0"
          style={{ transform: 'scale(1.04)', transition: 'transform 0.7s ease, filter 0.7s ease' }}
          onMouseEnter={(e) => { e.target.style.transform = 'scale(1.0)' }}
          onMouseLeave={(e) => { e.target.style.transform = 'scale(1.04)' }}
        />
      )}

      {/* Cinematic overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(8,7,6,0.96) 0%, rgba(8,7,6,0.75) 38%, rgba(8,7,6,0.18) 100%)' }} />
      <div className="absolute inset-x-0 bottom-0" style={{ height: '45%', background: 'linear-gradient(to top, rgba(8,7,6,0.7), transparent)' }} />

      {/* Text — bottom-left */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-7">
        <div className="flex items-center gap-2 mb-3">
          <div style={{ width: 16, height: 1, background: '#C8974A' }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#C8974A', letterSpacing: '0.2em' }}>
            {stagePick}
          </span>
        </div>
        <h3
          className="leading-snug mb-2"
          style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', color: '#EDE5D8', fontSize: 22, maxWidth: 520 }}
        >
          {displayTitle}
        </h3>
        <p className="text-sm" style={{ color: '#96928D' }}>
          {creator}
          {item.show && <span style={{ color: '#817D78' }}> · {item.show}</span>}
        </p>
      </div>

      {/* Play button — center-right */}
      {(item.type === 'video' || item.type === 'podcast') && (
        <div
          className="absolute flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
          style={{ right: 32, top: '50%', transform: 'translateY(-50%)', width: 60, height: 60, background: 'rgba(200,151,74,0.12)', border: '1px solid rgba(200,151,74,0.4)', backdropFilter: 'blur(8px)' }}
        >
          {item.type === 'video'
            ? <Play className="w-6 h-6" style={{ color: '#C8974A', fill: '#C8974A', marginLeft: 3 }} />
            : <Headphones className="w-6 h-6" style={{ color: '#C8974A' }} />
          }
        </div>
      )}

      {/* Hover border */}
      <div className="absolute inset-0 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ border: '1px solid rgba(200,151,74,0.25)', pointerEvents: 'none' }} />
    </a>
  )
}

export function GoDeeper({
  allItems,
  activeStage,
  onStageChange,
  isBookmarked,
  onBookmarkToggle,
  onSelectBook,
}) {
  const stageRefs = useRef({})
  const { t } = useLanguage()

  const stagesToShow = activeStage
    ? STAGE_IDS.filter((id) => id === activeStage)
    : STAGE_IDS

  return (
    <div className="px-4 sm:px-8 pt-8 sm:pt-10 pb-20">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#C8974A', letterSpacing: '0.18em' }}>
          {t('go_deeper_label')}
        </p>
        <h1 className="text-4xl leading-tight mb-2" style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', color: 'var(--th-text)' }}>
          {activeStage ? (
            <>
              <span style={{ color: 'var(--th-text-3)' }}>{STAGE_META[activeStage].number}.</span>
              {' '}{t(`stage_${activeStage.replace(/\s+/g, '_')}`)}
            </>
          ) : t('go_deeper_h1_all')}
        </h1>
        {!activeStage && (
          <p className="text-base max-w-lg" style={{ color: 'var(--th-text-2)', lineHeight: 1.7 }}>
            {t('go_deeper_desc')}
          </p>
        )}
        <div className="mt-5 h-px" style={{ background: 'linear-gradient(90deg, #C8974A22, transparent)' }} />
      </div>

      {/* Stage pills (when showing all) */}
      {!activeStage && (
        <div className="flex gap-2 mb-8 flex-wrap">
          {STAGE_IDS.map((id) => {
            const meta = STAGE_META[id]
            return (
              <button
                key={id}
                onClick={() => onStageChange(id)}
                className="text-xs px-3 py-1.5 rounded-full transition-colors"
                style={{ color: 'var(--th-text-2)', background: 'var(--th-surface2)', border: '1px solid var(--th-border)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#C8974A'; e.currentTarget.style.borderColor = 'rgba(200,151,74,0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--th-text-2)'; e.currentTarget.style.borderColor = 'var(--th-border)' }}
              >
                {meta.number} {t(`stage_${id.replace(/\s+/g, '_')}`)}
              </button>
            )
          })}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-16">
        {stagesToShow.map((stageId) => {
          const meta = STAGE_META[stageId]
          const stageItems = allItems.filter((item) => item.stage === stageId)
          const spotlightItem = stageItems.find((item) => item.title === meta.spotlight)
          const framingKey = `framing_${stageId.replace(/\s+/g, '_')}`

          return (
            <div key={stageId} ref={(el) => { stageRefs.current[stageId] = el }}>
              {/* Stage header */}
              <div className="mb-6">
                {!activeStage ? (
                  /* All-stages view: show number + name */
                  <div className="flex items-baseline gap-3 mb-2">
                    <span
                      className="text-5xl"
                      style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', color: 'var(--th-text-3)', lineHeight: 1 }}
                    >
                      {meta.number}
                    </span>
                    <h2 className="text-2xl" style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', color: 'var(--th-text)' }}>
                      {t(`stage_${stageId.replace(/\s+/g, '_')}`)}
                    </h2>
                  </div>
                ) : (
                  /* Single-stage view: show number as subtle label only */
                  <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--th-text-3)', letterSpacing: '0.16em' }}>
                    {meta.number} / 04
                  </p>
                )}
                <p className="text-base max-w-xl" style={{ color: 'var(--th-text-2)', lineHeight: 1.75 }}>
                  {t(framingKey)}
                </p>
              </div>

              {/* Spotlight */}
              <SpotlightCard item={spotlightItem} stagePick={t('stage_pick')} />

              {/* Grid — spotlight excluded */}
              <TypeSections
                items={stageItems.filter((item) => item.title !== meta.spotlight)}
                isBookmarked={isBookmarked}
                onBookmarkToggle={onBookmarkToggle}
                onSelectBook={onSelectBook}
              />

              {/* Divider */}
              <div className="mt-12 h-px" style={{ background: 'var(--th-border-sub)' }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
