import { motion } from 'framer-motion'
import { Bookmark, Play } from 'lucide-react'

function extractYouTubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/)
  return match ? match[1] : null
}

export function VideoCard({ item, isBookmarked, onBookmarkToggle }) {
  const videoId = extractYouTubeId(item.url)
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : null
  const bookmarked = isBookmarked(item.title)

  return (
    <motion.div
      className="break-inside-avoid mb-3"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden rounded-xl border border-[#E5E7EB]
                   bg-gray-100 group cursor-pointer"
        style={{ aspectRatio: '16/9' }}
      >
        {/* Thumbnail */}
        {thumbnail && (
          <img
            src={thumbnail}
            alt={item.title}
            onError={(e) => { e.target.style.display = 'none' }}
            className="absolute inset-0 w-full h-full object-cover
                       grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        )}

        {/* Dark scrim */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center
                       shadow-sm group-hover:scale-110 transition-transform duration-200"
          >
            <Play className="w-3.5 h-3.5 text-[#111111] ml-0.5 fill-[#111111]" />
          </div>
        </div>

        {/* Bottom metadata */}
        <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <p className="text-white font-medium text-xs leading-snug line-clamp-2">{item.title}</p>
          <p className="text-white/60 text-[10px] mt-0.5">{item.creator}</p>
        </div>

        {/* Bookmark */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBookmarkToggle(item.title) }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80
                     backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Bookmark
            className={`w-3.5 h-3.5 transition-colors ${
              bookmarked ? 'text-[#111111] fill-[#111111]' : 'text-[#6B7280]'
            }`}
          />
        </button>
      </a>
    </motion.div>
  )
}
