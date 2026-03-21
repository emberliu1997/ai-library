import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'

const BOOK_COLORS = [
  'from-slate-600 to-slate-800',
  'from-stone-600 to-stone-800',
  'from-zinc-600 to-zinc-800',
  'from-neutral-600 to-neutral-800',
  'from-gray-600 to-gray-800',
]

function hashTitle(title) {
  let h = 0
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) >>> 0
  return h % BOOK_COLORS.length
}

export function BookCard({ item, isBookmarked, onBookmarkToggle, onSelect }) {
  const gradient = BOOK_COLORS[hashTitle(item.title)]
  const bookmarked = isBookmarked(item.title)

  return (
    <motion.div
      className="break-inside-avoid mb-3"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div
        onClick={() => onSelect(item)}
        className="relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-white
                   cursor-pointer group"
        style={{ aspectRatio: '2/3' }}
      >
        {/* Background — grayscale by default, color on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient}
                      grayscale group-hover:grayscale-0 transition-all duration-300`}
        />

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )`
          }}
        />

        {/* Bottom gradient: title + author */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/75 via-black/30 to-transparent">
          <p className="text-white font-semibold text-xs leading-snug">{item.title}</p>
          <p className="text-white/60 text-[10px] mt-0.5">{item.author}</p>
        </div>

        {/* Hover reveal: implication + click hint */}
        <div
          className="absolute inset-0 flex items-end p-3
                     opacity-0 group-hover:opacity-100 transition-opacity duration-250
                     bg-gradient-to-t from-black/80 via-black/50 to-black/10"
        >
          <div>
            <p className="text-white/80 text-[10px] leading-relaxed mb-1.5">{item.implication}</p>
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase
                             tracking-wider text-white/50 border border-white/20 rounded px-1.5 py-0.5">
              Open
            </span>
          </div>
        </div>

        {/* Bookmark */}
        <button
          onClick={(e) => { e.stopPropagation(); onBookmarkToggle(item.title) }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80
                     backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Bookmark
            className={`w-3.5 h-3.5 transition-colors ${
              bookmarked ? 'text-[#111111] fill-[#111111]' : 'text-[#6B7280]'
            }`}
          />
        </button>
      </div>
    </motion.div>
  )
}
