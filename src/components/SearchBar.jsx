import { Search, X } from 'lucide-react'

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title or author…"
        className="w-full pl-9 pr-10 py-2.5 text-sm border border-[#E5E7EB] rounded-xl bg-white
                   focus:outline-none focus:ring-1 focus:ring-[#111111] placeholder:text-[#9CA3AF]
                   transition-shadow"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full
                     hover:bg-gray-100 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-[#6B7280]" />
        </button>
      )}
    </div>
  )
}
