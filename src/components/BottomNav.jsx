import { Sparkles, BookOpen, Users, SlidersHorizontal } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const NAV_ITEMS = [
  { id: 'start-here', icon: Sparkles,          labelKey: 'nav_start_here' },
  { id: 'go-deeper',  icon: BookOpen,           labelKey: 'nav_go_deeper' },
  { id: 'people',     icon: Users,              labelKey: 'nav_people' },
  { id: 'reference',  icon: SlidersHorizontal,  labelKey: 'nav_reference' },
]

/**
 * Mobile-only bottom navigation bar.
 * Follows iOS HIG tab bar + Material Design 3 navigation bar specs:
 * – Fixed at bottom, 56px item area + safe-area inset
 * – Active indicator: M3-style pill behind icon
 * – Touch targets: min 44×44pt (Apple HIG)
 * – Hidden on lg+ (sidebar takes over)
 */
export function BottomNav({ activeView, onViewChange }) {
  const { t } = useLanguage()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30"
      style={{
        background: 'var(--th-sidebar)',
        borderTop: '1px solid var(--th-sidebar-b)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-label="Main navigation"
    >
      <div className="flex" style={{ height: 56 }}>
        {NAV_ITEMS.map(({ id, icon: Icon, labelKey }) => {
          const isActive = activeView === id
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={t(labelKey)}
              className="flex-1 flex flex-col items-center justify-center gap-0 relative transition-colors"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? '#C8974A' : 'var(--th-text-3)',
                minWidth: 44,
                padding: 0,
              }}
            >
              {/* M3 active indicator pill behind icon */}
              <div
                style={{
                  position: 'relative',
                  width: 52,
                  height: 28,
                  borderRadius: 14,
                  background: isActive ? 'rgba(200,151,74,0.14)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease',
                  marginBottom: 2,
                }}
              >
                <Icon
                  style={{
                    width: 20,
                    height: 20,
                    strokeWidth: isActive ? 2 : 1.5,
                    transition: 'stroke-width 0.15s',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.01em',
                  lineHeight: 1,
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  transition: 'font-weight 0.15s',
                }}
              >
                {t(labelKey)}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
