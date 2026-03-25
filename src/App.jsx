import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import { useLibrary } from './hooks/useLibrary'
import { useTheme } from './context/ThemeContext'
import { Sidebar } from './components/Sidebar'
import { StartHere } from './components/StartHere'
import { GoDeeper } from './components/GoDeeper'
import { PeopleIFollow } from './components/StayCurrent'
import { Reference } from './components/Reference'
import { ThinkingDrawer } from './components/ThinkingDrawer'

function App() {
  const { theme } = useTheme()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const {
    activeView,
    setActiveView,
    activeStage,
    setActiveStage,
    activeType,
    setActiveType,
    activeTags,
    toggleTag,
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
    allItems,
  } = useLibrary()

  function handleViewChange(id) {
    setActiveView(id)
    setMobileNavOpen(false)
  }

  return (
    <div
      className={`grain min-h-screen ${theme === 'light' ? 'theme-light' : ''}`}
      style={{ background: 'var(--th-bg)' }}
    >
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ── Mobile nav overlay backdrop ──────────────────── */}
      {mobileNavOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[35]"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────
          Desktop: always visible, fixed left
          Mobile:  hidden by default, slides in over content  */}
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        activeStage={activeStage}
        onStageChange={setActiveStage}
        allItems={allItems}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      {/* ── Floating hamburger — mobile only ─────────────── */}
      <button
        className="lg:hidden fixed z-[34] flex items-center justify-center rounded-full transition-all"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation"
        aria-expanded={mobileNavOpen}
        style={{
          top: 16,
          right: 16,
          width: 40,
          height: 40,
          background: 'var(--th-surface)',
          border: '1px solid var(--th-border)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          color: 'var(--th-text-2)',
          cursor: 'pointer',
          // Hide when nav is open (sidebar's X takes over)
          opacity: mobileNavOpen ? 0 : 1,
          pointerEvents: mobileNavOpen ? 'none' : 'auto',
          transition: 'opacity 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* ── Main content ─────────────────────────────────────
          Mobile: full width, no offset — content is the focus
          Desktop: offset by sidebar width                    */}
      <main
        id="main-content"
        className="flex flex-col min-h-screen lg:ml-[240px] mobile-content-pb"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeView === 'start-here' && (
              <StartHere
                items={startHereItems}
                isBookmarked={isBookmarked}
                onBookmarkToggle={toggleBookmark}
                onSelectBook={setSelectedItem}
              />
            )}

            {activeView === 'go-deeper' && (
              <GoDeeper
                allItems={allItems}
                activeStage={activeStage}
                onStageChange={setActiveStage}
                isBookmarked={isBookmarked}
                onBookmarkToggle={toggleBookmark}
                onSelectBook={setSelectedItem}
              />
            )}

            {activeView === 'people' && (
              <PeopleIFollow />
            )}

            {activeView === 'reference' && (
              <Reference
                items={filteredItems}
                allItems={allItems}
                activeStage={activeStage}
                onStageChange={setActiveStage}
                activeType={activeType}
                onTypeChange={setActiveType}
                activeTags={activeTags}
                onTagToggle={toggleTag}
                activeTime={activeTime}
                onTimeChange={setActiveTime}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                isBookmarked={isBookmarked}
                onBookmarkToggle={toggleBookmark}
                onSelectBook={setSelectedItem}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <ThinkingDrawer
        item={isDrawerOpen ? selectedItem : null}
        onClose={closeDrawer}
      />

      {/* Permanent sticky footer */}
      <footer
        className="fixed bottom-0 right-0 left-0 lg:left-[240px] px-4 sm:px-8 py-3 flex items-center justify-center z-20"
        style={{ borderTop: '1px solid var(--th-border-sub)', background: 'var(--th-surface)', backdropFilter: 'blur(12px)' }}
      >
        <p className="text-xs" style={{ color: 'var(--th-text-3)' }}>
          Curated by{' '}
          <a
            href="https://emberliu.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--th-text-2)', textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#C8974A' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--th-text-2)' }}
          >
            Ember Liu
          </a>
          {' '}· Last updated Mar 25, 2026
        </p>
      </footer>
    </div>
  )
}

export default App
