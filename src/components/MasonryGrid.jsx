import { Card } from './Card'

function cardProps(item, i, onSelectBook) {
  return {
    item,
    index: i,
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

function VideoGrid({ items, onSelectBook }) {
  if (items.length === 0) return null
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item, i) => (
        <Card key={item.title} {...cardProps(item, i, onSelectBook)} />
      ))}
    </div>
  )
}

function BookshelfGrid({ items, onSelectBook }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
      {items.map((item, i) => (
        <Card key={item.title} {...cardProps(item, i, onSelectBook)} />
      ))}
    </div>
  )
}

function TextGrid({ items, onSelectBook }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item, i) => (
        <Card key={item.title} {...cardProps(item, i, onSelectBook)} />
      ))}
    </div>
  )
}

export function MasonryGrid({ items, onSelectBook, type }) {
  if (!items.length) return <EmptyState />

  const props = { items, onSelectBook }

  if (type === 'video' || type === 'podcast') return <VideoGrid {...props} />
  if (type === 'book') return <BookshelfGrid {...props} />
  return <TextGrid {...props} />
}
