import { useState, useMemo, useEffect, useCallback } from "react";
import libraryItems from "../data/libraryData.json";

const BOOKMARKS_KEY = "ai-library-bookmarks";

function loadBookmarks() {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export function useLibrary() {
  const [activeView, setActiveView] = useState("start-here"); // 'start-here' | 'go-deeper' | 'stay-current' | 'reference'
  const [activeStage, setActiveStage] = useState(null);       // within Go Deeper
  const [activeType, setActiveType] = useState(null);         // within Reference
  const [activeTags, setActiveTags] = useState([]);           // within Reference / Go Deeper
  const [activeTime, setActiveTime] = useState(null);         // within Reference
  const [searchQuery, setSearchQuery] = useState("");          // within Reference
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookmarks, setBookmarks] = useState(loadBookmarks);

  const isDrawerOpen = selectedItem !== null && selectedItem.type === "book";

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarks]));
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (title) => bookmarks.has(title),
    [bookmarks]
  );

  const toggleBookmark = useCallback((title) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  }, []);

  const closeDrawer = useCallback(() => setSelectedItem(null), []);

  const handleViewChange = useCallback((view) => {
    setActiveView(view);
    setActiveStage(null);
    setActiveType(null);
    setActiveTags([]);
    setActiveTime(null);
    setSearchQuery("");
  }, []);

  const toggleTag = useCallback((tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const TYPE_ORDER = { video: 0, podcast: 1, website: 2, article: 3, book: 4 };

  const startHereItems = useMemo(
    () => libraryItems.filter((item) => item.startHere === true),
    []
  );

  const filteredItems = useMemo(() => {
    return libraryItems
      .filter((item) => {
        if (activeStage && item.stage !== activeStage) return false;
        if (activeType && item.type !== activeType) return false;
        if (activeTags.length > 0 && !activeTags.some((t) => item.tags?.includes(t))) return false;
        if (activeTime && item.timeCommitment !== activeTime) return false;
        const q = searchQuery.toLowerCase();
        if (!q) return true;
        return (
          item.title.toLowerCase().includes(q) ||
          (item.author || item.creator || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (TYPE_ORDER[a.type] ?? 5) - (TYPE_ORDER[b.type] ?? 5));
  }, [activeStage, activeType, activeTags, activeTime, searchQuery]);

  return {
    activeView,
    setActiveView: handleViewChange,
    activeStage,
    setActiveStage,
    activeType,
    setActiveType,
    activeTags,
    toggleTag,
    setActiveTags,
    activeTime,
    setActiveTime,
    searchQuery,
    setSearchQuery,
    selectedItem,
    setSelectedItem,
    isDrawerOpen,
    closeDrawer,
    isBookmarked,
    toggleBookmark,
    startHereItems,
    filteredItems,
    allItems: libraryItems,
  };
}
