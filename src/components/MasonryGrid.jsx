import { Card } from './Card'

function cardProps(item, i, isBookmarked, onBookmarkToggle, onSelectBook) {
  return {
    item,
    index: i,
    isBookmarked,
    onBookmarkToggle,
    onSelect: onSelectBook,
  }
}

function EmptyState() {
  return (
    <div className="text-center py-24">
      <p
        className="text-base"
        style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', color: '#817D78' }}
      >
        Nothing here yet.
      </p>
      <p className="text-xs mt-1" style={{ color: '#817D78' }}>
        Try a different filter or search term.
      </p>
    </div>
  )
}

/**
 * Video / Podcast — uniform equal-width grid
 * All cards share the same width and 16:9 aspect ratio → consistent height.
 * The SpotlightCard in GoDeeper already serves as the featured hero above.
 */
function VideoGrid({ items, isBookmarked, onBookmarkToggle, onSelectBook }) {
  if (items.length === 0) return null
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item, i) => (
        <Card key={item.title} {...cardProps(item, i, isBookmarked, onBookmarkToggle, onSelectBook)} />
      ))}
    </div>
  )
}

/**
 * Books — tight portrait bookshelf grid
 */
function BookshelfGrid({ items, isBookmarked, onBookmarkToggle, onSelectBook }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
      {items.map((item, i) => (
        <Card key={item.title} {...cardProps(item, i, isBookmarked, onBookmarkToggle, onSelectBook)} />
      ))}
    </div>
  )
}

/**
 * Articles / Websites — text-forward 3-column grid
 */
function TextGrid({ items, isBookmarked, onBookmarkToggle, onSelectBook }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item, i) => (
        <Card key={item.title} {...cardProps(item, i, isBookmarked, onBookmarkToggle, onSelectBook)} />
      ))}
    </div>
  )
}

export function MasonryGrid({ items, isBookmarked, onBookmarkToggle, onSelectBook, type }) {
  if (!items.length) return <EmptyState />

  const props = { items, isBookmarked, onBookmarkToggle, onSelectBook }

  if (type === 'video' || type === 'podcast') return <VideoGrid {...props} />
  if (type === 'book') return <BookshelfGrid {...props} />
  return <TextGrid {...props} />
}
