import { useState } from 'react'
import { Search, X, LayoutGrid, List } from 'lucide-react'
import { TypeSections } from './TypeSections'
import { useLanguage } from '../context/LanguageContext'

const STAGES = ['Literacy', 'Craft', 'Judgment', 'Systems Thinking']
const TYPES  = ['book', 'video', 'podcast', 'article', 'website']
const TIMES  = ['15min', '1hr', '3hr+']
const TAGS   = ['Agents', 'Evals', 'Prompt Design', 'Responsible AI', 'Design Patterns', 'Mental Models', 'Strategy']

function Pill({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className="transition-all flex-shrink-0"
      style={{
        fontSize: 12,
        padding: '3px 11px',
        borderRadius: 20,
        color: isActive ? '#C8974A' : 'var(--th-text-2)',
        background: isActive ? 'rgba(200,151,74,0.1)' : 'var(--th-surface)',
        border: isActive ? '1px solid rgba(200,151,74,0.3)' : '1px solid var(--th-border)',
        fontWeight: isActive ? 500 : 400,
        lineHeight: 1.5,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function FilterRow({ label, children }) {
  return (
    <div className="flex items-start gap-2 sm:gap-3">
      <span
        className="flex-shrink-0 pt-1"
        style={{
          width: 46,
          fontSize: 10,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--th-text-3)',
          lineHeight: 1.5,
        }}
      >
        {label}
      </span>
      {/* Horizontally scrollable on mobile */}
      <div
        className="overflow-x-auto flex-1 min-w-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex gap-1.5 flex-nowrap pb-0.5">
          {children}
        </div>
      </div>
    </div>
  )
}

export function Reference({
  items,
  allItems,
  activeStage,
  onStageChange,
  activeType,
  onTypeChange,
  activeTags,
  onTagToggle,
  activeTime,
  onTimeChange,
  searchQuery,
  onSearchChange,
  isBookmarked,
  onBookmarkToggle,
  onSelectBook,
}) {
  const [viewMode, setViewMode] = useState('grid')
  const { t } = useLanguage()
  const hasFilters = activeStage || activeType || activeTags.length > 0 || activeTime || searchQuery

  function clearAll() {
    onStageChange(null)
    onTypeChange(null)
    activeTags.forEach((tag) => onTagToggle(tag))
    onTimeChange(null)
    onSearchChange('')
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Sticky filter bar ────────────────────────── */}
      <div
        className="sticky top-0 z-20 px-4 sm:px-8"
        style={{
          background: 'var(--th-filter-bar)',
          borderBottom: '1px solid var(--th-border-sub)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >

        {/* Top row: search + count + view toggle */}
        <div className="flex items-center gap-3 py-3.5">

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              style={{ color: 'var(--th-text-3)' }}
              aria-hidden="true"
            />
            <label htmlFor="reference-search" className="sr-only">Search resources</label>
            <input
              id="reference-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-9 pr-7 py-2 rounded-lg outline-none"
              style={{
                fontSize: 16, /* Prevent iOS auto-zoom on focus */
                background: 'var(--th-surface)',
                border: '1px solid var(--th-border)',
                color: 'var(--th-text)',
                fontFamily: 'DM Sans',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(200,151,74,0.5)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--th-border)' }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" style={{ color: 'var(--th-text-3)' }} />
              </button>
            )}
          </div>

          {/* Item count */}
          <span
            className="tabular-nums flex-shrink-0"
            style={{ fontSize: 13, color: 'var(--th-text-3)' }}
            aria-live="polite"
            aria-atomic="true"
          >
            {items.length} {items.length === 1 ? t('items_count_one') : t('items_count_many')}
          </span>

          {/* Clear all */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex-shrink-0 transition-colors"
              style={{
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 8,
                color: 'var(--th-text-3)',
                background: 'var(--th-surface)',
                border: '1px solid var(--th-border)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#C8974A' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--th-text-3)' }}
            >
              {t('clear_all')}
            </button>
          )}

          {/* View toggle — prominent segmented control */}
          <div
            className="ml-auto flex-shrink-0 flex rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--th-border)' }}
            role="group"
            aria-label="View mode"
          >
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className="flex items-center gap-1.5 transition-all"
              style={{
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 500,
                background: viewMode === 'grid' ? '#C8974A' : 'var(--th-surface2)',
                color: viewMode === 'grid' ? '#0C0B09' : 'var(--th-text-3)',
                cursor: 'pointer',
              }}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t('view_grid')}</span>
            </button>
            <div style={{ width: 1, background: 'var(--th-border)' }} />
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              className="flex items-center gap-1.5 transition-all"
              style={{
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 500,
                background: viewMode === 'list' ? '#C8974A' : 'var(--th-surface2)',
                color: viewMode === 'list' ? '#0C0B09' : 'var(--th-text-3)',
                cursor: 'pointer',
              }}
            >
              <List className="w-3.5 h-3.5" />
              <span>{t('view_list')}</span>
            </button>
          </div>
        </div>

        {/* Divider between top row and filters */}
        <div style={{ height: 1, background: 'var(--th-border-sub)' }} />

        {/* Filter rows */}
        <div className="flex flex-col gap-2.5 py-3">
          <FilterRow label={t('filter_stage')}>
            {STAGES.map((s) => (
              <Pill
                key={s}
                label={t(`stage_${s.replace(/\s+/g, '_')}`)}
                isActive={activeStage === s}
                onClick={() => onStageChange(activeStage === s ? null : s)}
              />
            ))}
          </FilterRow>

          <FilterRow label={t('filter_format')}>
            {TYPES.map((v) => {
              const keyMap = { book: 'format_book', video: 'format_video', podcast: 'format_podcast', article: 'format_article', website: 'format_site' }
              return (
                <Pill
                  key={v}
                  label={t(keyMap[v])}
                  isActive={activeType === v}
                  onClick={() => onTypeChange(activeType === v ? null : v)}
                />
              )
            })}
          </FilterRow>

          <FilterRow label={t('filter_time')}>
            {TIMES.map((v) => {
              const keyMap = { '15min': 'time_15min', '1hr': 'time_1hr', '3hr+': 'time_3hr' }
              return (
                <Pill
                  key={v}
                  label={t(keyMap[v])}
                  isActive={activeTime === v}
                  onClick={() => onTimeChange(activeTime === v ? null : v)}
                />
              )
            })}
          </FilterRow>

          <FilterRow label={t('filter_topic')}>
            {TAGS.map((tag) => (
              <Pill
                key={tag}
                label={tag}
                isActive={activeTags.includes(tag)}
                onClick={() => onTagToggle(tag)}
              />
            ))}
          </FilterRow>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div className="px-4 sm:px-8 pt-6 pb-16">
        {items.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <p style={{ fontSize: 14, color: 'var(--th-text-3)' }}>{t('no_results')}</p>
          </div>
        ) : (
          <TypeSections
            items={items}
            isBookmarked={isBookmarked}
            onBookmarkToggle={onBookmarkToggle}
            onSelectBook={onSelectBook}
            viewMode={viewMode}
          />
        )}
      </div>
    </div>
  )
}
