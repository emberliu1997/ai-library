import { Sun, Moon, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

const PRIMARY_NAV = [
  { id: 'start-here',   labelKey: 'nav_start_here',  descKey: 'nav_desc_start' },
  { id: 'go-deeper',    labelKey: 'nav_go_deeper',   descKey: 'nav_desc_deeper' },
  { id: 'people',       labelKey: 'nav_people',      descKey: 'nav_desc_people' },
  { id: 'reference',    labelKey: 'nav_reference',   descKey: 'nav_desc_ref' },
]

const STAGES = ['Literacy', 'Craft', 'Judgment', 'Systems Thinking']

/**
 * Desktop-only sidebar navigation.
 * Hidden on mobile — BottomNav handles mobile navigation instead.
 * Follows Material Design navigation rail / Apple HIG sidebar patterns for large screens.
 */
export function Sidebar({ activeView, onViewChange, activeStage, onStageChange, allItems, mobileOpen, onMobileClose }) {
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()
  const isDark = theme === 'dark'
  const stageCount = (stage) => allItems.filter((i) => i.stage === stage).length

  return (
    <aside
      aria-label="Site navigation"
      className={`flex flex-col fixed top-0 right-0 h-screen z-[36] overflow-hidden lg:right-auto lg:left-0 lg:!translate-x-0 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      style={{
        width: 240,
        background: 'var(--th-sidebar)',
        borderLeft: '1px solid var(--th-sidebar-b)',
        transition: 'transform 0.3s cubic-bezier(0.32, 0, 0.67, 0), background 0.25s ease',
      }}
    >
      {/* Mobile close button */}
      <button
        className="lg:hidden absolute top-4 right-4 flex items-center justify-center rounded-full z-10"
        onClick={onMobileClose}
        aria-label="Close navigation"
        style={{
          width: 32,
          height: 32,
          background: 'var(--th-surface2)',
          border: '1px solid var(--th-border)',
          color: 'var(--th-text-2)',
          cursor: 'pointer',
        }}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Brand */}
      <div className="px-5 pt-7 pb-5" style={{ borderBottom: '1px solid var(--th-border-sub)' }}>
        <p
          className="text-xs tracking-[0.2em] uppercase mb-1"
          style={{ color: '#C8974A', fontFamily: 'DM Sans', letterSpacing: '0.16em' }}
          aria-hidden="true"
        >
          AI Library
        </p>
        <p
          className="text-xl leading-tight"
          style={{ fontFamily: 'Instrument Serif, Georgia, serif', color: 'var(--th-text)', fontStyle: 'italic' }}
          aria-label="Design and Intelligence — AI Library"
        >
          Design &<br />Intelligence
        </p>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p
          className="text-xs font-medium uppercase px-2 mb-2"
          style={{ color: 'var(--th-text-3)', letterSpacing: '0.14em' }}
          aria-hidden="true"
        >
          {t('nav_label')}
        </p>
        <nav aria-label="Primary navigation">
          {PRIMARY_NAV.map(({ id, labelKey, descKey }) => {
            const isActive = activeView === id
            return (
              <div key={id}>
                <button
                  onClick={() => onViewChange(id)}
                  className="w-full flex items-center justify-between rounded px-2 py-2 text-xs transition-all"
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    color: isActive ? 'var(--th-text)' : 'var(--th-text-2)',
                    background: isActive ? isDark ? '#1A1815' : 'rgba(200,151,74,0.08)' : 'transparent',
                    borderLeft: isActive ? '2px solid #C8974A' : '2px solid transparent',
                    paddingLeft: isActive ? '6px' : '8px',
                    minHeight: 44,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--th-text)'
                      e.currentTarget.style.background = isDark ? '#141210' : 'rgba(0,0,0,0.04)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--th-text-2)'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <div className="text-left">
                    <div style={{ fontWeight: isActive ? 500 : 400 }}>{t(labelKey)}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--th-text-3)' }}>{t(descKey)}</div>
                  </div>
                </button>

                {/* Stage sub-nav under Go Deeper */}
                {id === 'go-deeper' && isActive && (
                  <nav aria-label="Stage navigation" className="mt-1 mb-1 ml-3 space-y-px">
                    {STAGES.map((stage) => {
                      const isStageActive = activeStage === stage
                      return (
                        <button
                          key={stage}
                          onClick={() => onStageChange(isStageActive ? null : stage)}
                          className="w-full flex items-center justify-between rounded px-2 py-1.5 text-xs transition-all"
                          aria-current={isStageActive ? 'true' : undefined}
                          style={{
                            color: isStageActive ? '#C8974A' : 'var(--th-text-3)',
                            background: isStageActive ? 'rgba(200,151,74,0.06)' : 'transparent',
                            minHeight: 36,
                            cursor: 'pointer',
                            border: 'none',
                          }}
                          onMouseEnter={(e) => {
                            if (!isStageActive) {
                              e.currentTarget.style.color = 'var(--th-text)'
                              e.currentTarget.style.background = isDark ? '#141210' : 'rgba(0,0,0,0.04)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isStageActive) {
                              e.currentTarget.style.color = 'var(--th-text-3)'
                              e.currentTarget.style.background = 'transparent'
                            }
                          }}
                        >
                          <span>{stage}</span>
                          <span className="text-xs tabular-nums" style={{ color: 'var(--th-text-3)' }}>
                            {stageCount(stage)}
                          </span>
                        </button>
                      )
                    })}
                  </nav>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Theme + Language toggles */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid var(--th-border-sub)' }}>
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex items-center rounded-md p-0.5"
            style={{ background: isDark ? '#161412' : '#EEE9E3', border: `1px solid var(--th-border)` }}
            role="group"
            aria-label="Language"
          >
            {['en', 'cn'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className="px-2.5 py-1 rounded text-xs font-medium transition-all"
                style={{
                  background: lang === l ? '#C8974A' : 'transparent',
                  color: lang === l ? '#0C0B09' : 'var(--th-text-3)',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  border: 'none',
                  minHeight: 28,
                }}
              >
                {l === 'en' ? 'EN' : '中文'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center rounded-md transition-all"
            style={{
              width: 36,
              height: 36,
              background: isDark ? '#161412' : '#EEE9E3',
              border: `1px solid var(--th-border)`,
              color: 'var(--th-text-2)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#C8974A' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--th-text-2)' }}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Newsletter */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid var(--th-border-sub)' }}>
        <p
          className="text-xs mb-0.5"
          style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', color: 'var(--th-text)' }}
        >
          {t('stay_sharp')}
        </p>
        <p className="text-xs mb-3" style={{ color: 'var(--th-text-3)' }}>
          {t('subscribe_teaser')}
        </p>
        <a
          href="https://designandintelligence.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block text-center text-xs font-medium py-2 rounded-md transition-colors"
          style={{ background: '#C8974A', color: '#0C0B09', fontFamily: 'DM Sans', textDecoration: 'none' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#D4A55A' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#C8974A' }}
        >
          {t('subscribe_cta')}
        </a>
      </div>
    </aside>
  )
}
