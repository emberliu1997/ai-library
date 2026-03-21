import { BookCard } from './BookCard'
import { VideoCard } from './VideoCard'
import { ArticleCard } from './ArticleCard'

export function CardGrid({ items, isBookmarked, onBookmarkToggle, onSelectItem }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[#6B7280] text-sm">No results found.</p>
        <p className="text-[#9CA3AF] text-xs mt-1">Try a different search or category.</p>
      </div>
    )
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
      {items.map((item) => {
        if (item.type === 'book') {
          return (
            <BookCard
              key={item.title}
              item={item}
              isBookmarked={isBookmarked}
              onBookmarkToggle={onBookmarkToggle}
              onSelect={onSelectItem}
            />
          )
        }
        if (item.type === 'video') {
          return (
            <VideoCard
              key={item.title}
              item={item}
              isBookmarked={isBookmarked}
              onBookmarkToggle={onBookmarkToggle}
            />
          )
        }
        return (
          <ArticleCard
            key={item.title}
            item={item}
            isBookmarked={isBookmarked}
            onBookmarkToggle={onBookmarkToggle}
          />
        )
      })}
    </div>
  )
}
