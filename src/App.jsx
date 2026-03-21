import { useState } from 'react'
import { Menu } from 'lucide-react'
import { useLibrary } from './hooks/useLibrary'
import { useTheme } from './context/ThemeContext'
import { useLanguage } from './context/LanguageContext'
import { Sidebar } from './components/Sidebar'
import { StartHere } from './components/StartHere'
import { GoDeeper } from './components/GoDeeper'
import { PeopleIFollow } from './components/StayCurrent'
import { Reference } from './components/Reference'
import { ThinkingDrawer } from './components/ThinkingDrawer'

function App() {
  const { theme } = useTheme()
  const { t } = useLanguage()
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
    allItems,
  } = useLibrary()

  function handleViewChange(v) {
    setActiveView(v)
    setMobileNavOpen(false)
  }

  return (
    <div
      className={`grain min-h-screen ${theme === 'light' ? 'theme-light' : ''}`}
      style={{ background: 'var(--th-bg)' }}
    >
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Mobile backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        activeStage={activeStage}
        onStageChange={setActiveStage}
        allItems={allItems}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      {/* Mobile top bar */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4"
        style={{
          height: 52,
          background: 'var(--th-sidebar)',
          borderBottom: '1px solid var(--th-sidebar-b)',
        }}
        aria-label="Mobile navigation bar"
      >
        <button
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation menu"
          className="flex items-center justify-center rounded-lg"
          style={{ width: 44, height: 44, color: 'var(--th-text-2)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-[10px] tracking-[0.18em] uppercase" style={{ color: '#C8974A', fontFamily: 'DM Sans' }}>
            AI Library
          </p>
          <p
            className="text-sm leading-tight"
            style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', color: 'var(--th-text)' }}
          >
            Design & Intelligence
          </p>
        </div>

        {/* Spacer to balance hamburger */}
        <div style={{ width: 44 }} aria-hidden="true" />
      </header>

      <main
        id="main-content"
        className="flex flex-col min-h-screen lg:ml-[240px] pt-[52px] lg:pt-0"
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
      </main>

      <ThinkingDrawer
        item={isDrawerOpen ? selectedItem : null}
        onClose={closeDrawer}
      />
    </div>
  )
}

export default App
