import { useState, useEffect } from 'react'

const STORAGE_KEY = 'ai-library-bookmarks'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  const toggle = (title) =>
    setBookmarks((prev) => {
      const next = { ...prev }
      if (next[title]) delete next[title]
      else next[title] = true
      return next
    })

  const isBookmarked = (title) => Boolean(bookmarks[title])

  return { bookmarks, toggle, isBookmarked }
}
