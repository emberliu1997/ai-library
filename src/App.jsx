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

  return (
    <div
      className={`grain min-h-screen ${theme === 'light' ? 'theme-light' : ''}`}
      style={{ background: 'var(--th-bg)' }}
    >
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        activeStage={activeStage}
        onStageChange={setActiveStage}
        allItems={allItems}
      />

      <main id="main-content" className="flex flex-col min-h-screen" style={{ marginLeft: 240 }}>
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
