import { motion } from 'framer-motion'
import { Bookmark, ArrowUpRight } from 'lucide-react'

export function ArticleCard({ item, isBookmarked, onBookmarkToggle }) {
  const bookmarked = isBookmarked(item.title)

  return (
    <motion.div
      className="break-inside-avoid mb-3"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <a
        href={item.url}
        target={item.url !== '#' ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="block p-4 rounded-xl border border-[#E5E7EB] bg-white group
                   hover:border-gray-300 hover:shadow-sm transition-all duration-200"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280]">
                {item.type === 'website' ? 'Website' : 'Article'}
              </span>
              <ArrowUpRight className="w-3 h-3 text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-sm font-semibold text-[#111111] leading-snug group-hover:text-gray-700 transition-colors">
              {item.title}
            </h3>
            {(item.author || item.creator) && (
              <p className="text-xs text-[#6B7280] mt-1">{item.author || item.creator}</p>
            )}
            <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">{item.implication}</p>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBookmarkToggle(item.title) }}
            className="shrink-0 mt-0.5 p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Bookmark
              className={`w-3.5 h-3.5 transition-colors ${
                bookmarked ? 'text-[#111111] fill-[#111111]' : 'text-[#6B7280]'
              }`}
            />
          </button>
        </div>
      </a>
    </motion.div>
  )
}
