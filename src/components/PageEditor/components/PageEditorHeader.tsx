import React from 'react'

interface PageEditorHeaderProps {
  isMobile: boolean
  leftSidebarVisible: boolean
  setLeftSidebarVisible: (visible: boolean) => void
  rightSidebarVisible: boolean
  setRightSidebarVisible: (visible: boolean) => void
  pages: Array<{id: string, name: string, active: boolean, disabled: boolean}>
  currentPageId: string | null
  setCurrentPageId: (id: string | null) => void
  layoutName: string
  loading: boolean
  showSaveButton?: boolean
  onSave?: () => void
  onCancel?: () => void
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
  lastSaved?: Date | null
  isAutoSaving?: boolean
  isModal?: boolean
  onAddPage?: () => void
}

export const PageEditorHeader: React.FC<PageEditorHeaderProps> = ({
  isMobile,
  leftSidebarVisible,
  setLeftSidebarVisible,
  rightSidebarVisible,
  setRightSidebarVisible,
  pages,
  currentPageId,
  setCurrentPageId,
  layoutName,
  loading,
  showSaveButton = true,
  onSave,
  onCancel,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  lastSaved,
  isAutoSaving = false,
  isModal = false,
  onAddPage
}) => {
  return (
    <div className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* Mobile Toggle Buttons */}
        {isMobile && (
          <>
            <button
              onClick={() => setLeftSidebarVisible(!leftSidebarVisible)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                leftSidebarVisible
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
              aria-label={leftSidebarVisible ? 'Hide component library' : 'Show component library'}
            >
              📚 Components
            </button>
            <button
              onClick={() => setRightSidebarVisible(!rightSidebarVisible)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                rightSidebarVisible
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
              aria-label={rightSidebarVisible ? 'Hide properties panel' : 'Show properties panel'}
            >
              ⚙️ Properties
            </button>
            <div className="w-px h-6 bg-slate-300 mx-2"></div>
          </>
        )}
        <h1 className="text-lg font-semibold text-slate-900">Page Layout</h1>
        <select
          value={currentPageId || ''}
          onChange={(e) => setCurrentPageId(e.target.value || null)}
          className="px-3 py-1 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          {pages.map(page => (
            <option key={page.id} value={page.id}>{page.name}</option>
          ))}
        </select>
        <button
          onClick={onAddPage}
          className="px-3 py-1.5 text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          title="Add Page"
        >
          ➕ Add Page
        </button>
      </div>
      <div className="flex items-center gap-2">
        {/* Auto-save status */}
        {!isModal && (
          <div className="text-xs text-slate-500 mr-2">
            {isAutoSaving ? (
              <span className="text-blue-600">💾 Saving...</span>
            ) : lastSaved ? (
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            ) : (
              <span>Not saved</span>
            )}
          </div>
        )}

        {/* Undo/Redo buttons */}
        {onUndo && onRedo && (
          <>
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                canUndo
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-50 text-slate-400 cursor-not-allowed'
              }`}
              aria-label="Undo"
              title="Undo (Ctrl+Z)"
            >
              ↶ Undo
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                canRedo
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-50 text-slate-400 cursor-not-allowed'
              }`}
              aria-label="Redo"
              title="Redo (Ctrl+Y)"
            >
              ↷ Redo
            </button>
            {/* Version History Dropdown */}
            <div className="relative">
              <button
                className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                aria-label="Version history"
                title="Version History"
              >
                📚 History
              </button>
              {/* TODO: Add dropdown menu for version history */}
            </div>
          </>
        )}

        {showSaveButton && onSave && (
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            💾 Save
          </button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-all duration-200 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>


    </div>
  )
}
