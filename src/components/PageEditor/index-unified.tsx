'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { componentRegistry, initializeComponentRegistry } from '@/lib/componentRegistry'
import { LayoutComponent, PageLayout, Page } from '@/types/page-editor'
import { usePageData } from './hooks/usePageData'
import { useUIState } from './hooks/useUIState'
import { useLayoutActions } from './hooks/useLayoutActions'
import { useUndoRedo } from '@/hooks/useUndoRedo'

import { PageEditorHeader } from './components/PageEditorHeader'
import { PageEditorCanvas } from './components/PageEditorCanvas'
import { LeftSidebar } from './components/LeftSidebar'
import { PropertyPanel } from './PropertyPanel'
import { JSONView } from './components/JSONView'
import { ConfirmationModal } from './components/ConfirmationModal'
import { DragDropProvider } from './DragDropProvider'

interface PageEditorProps {
  initialLayout?: any
  onSave?: (layout: any) => void
  onCancel?: () => void
  isModal?: boolean
  showSaveButton?: boolean
  pageId?: string
}

const PageEditor: React.FC<PageEditorProps> = ({
  initialLayout,
  onSave,
  onCancel,
  isModal = false,
  showSaveButton = true,
  pageId
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>()
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<{
    sectionId: string
    containerId: string
    rowId: string
    colId: string
    compId: string
    component: LayoutComponent
  } | null>(null)

  // Helper function to find component in layout
  const findComponentInLayout = (layout: PageLayout, compId: string): LayoutComponent | null => {
    for (const section of layout.sections) {
      for (const row of section.container.rows) {
        for (const col of row.columns) {
          const comp = col.components.find(c => c.id === compId)
          if (comp) return comp
        }
      }
    }
    return null
  }

  // Helper function to find component context in layout
  const findComponentContext = (layout: PageLayout, compId: string): { sectionId: string; containerId: string; rowId: string; colId: string } | null => {
    for (const section of layout.sections) {
      for (const row of section.container.rows) {
        for (const col of row.columns) {
          const comp = col.components.find(c => c.id === compId)
          if (comp) return { sectionId: section.id, containerId: section.container.id, rowId: row.id, colId: col.id }
        }
      }
    }
    return null
  }

  const [showJsonView, setShowJsonView] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type?: 'danger' | 'warning' | 'info'
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })

  // Custom hooks
  const {
    pages,
    currentPageId,
    setCurrentPageId,
    layout: baseLayout,
    setLayout: setBaseLayout,
    loading,
    saveLayout,
    createPage,
    deletePage,
    disablePage
  } = usePageData(pageId)

  // Undo/Redo for layout
  const {
    state: layout,
    setState: setLayout,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoRedo(baseLayout, 50)

  // Sync base layout changes to undo/redo
  useEffect(() => {
    setLayout(baseLayout)
  }, [baseLayout, setLayout])



  const {
    leftSidebarWidth,
    setLeftSidebarWidth,
    rightSidebarWidth,
    setRightSidebarWidth,
    isResizingLeft,
    setIsResizingLeft,
    isResizingRight,
    setIsResizingRight,
    isMobile,
    leftSidebarVisible,
    setLeftSidebarVisible,
    rightSidebarVisible,
    setRightSidebarVisible
  } = useUIState()

  const {
    handleDragEnd,
    handleComponentUpdate,
    handleAddSection,
    handleSetSectionRows,
    handleSetSectionColumns,
    handleComponentAdd,
    handleSectionDelete,
    handleComponentDelete: deleteComponent,
    handleColumnDelete
  } = useLayoutActions(layout, setLayout)

  // Sync selectedComponent with layout changes
  React.useEffect(() => {
    if (selectedComponent) {
      const updatedComponent = findComponentInLayout(layout, selectedComponent.compId)
      if (updatedComponent) {
        setSelectedComponent({
          ...selectedComponent,
          component: updatedComponent
        })
      }
    }
  }, [layout, selectedComponent?.compId])

  // Initialize component registry
  useEffect(() => {
    initializeComponentRegistry()
  }, [])

  // Event handlers
  const handleComponentSelect = useCallback((component: LayoutComponent, context: { sectionId: string; containerId: string; rowId: string; colId: string }) => {
    setSelectedComponent({
      ...context,
      compId: component.id,
      component
    })
  }, [])

  const handleComponentEdit = useCallback((componentId: string) => {
    const context = findComponentContext(layout, componentId)
    const component = findComponentInLayout(layout, componentId)
    if (context && component) {
      setSelectedComponent({
        ...context,
        compId: componentId,
        component
      })
    }
  }, [layout])

  const handleComponentDuplicate = useCallback((component: LayoutComponent) => {
    // TODO: Implement duplicate logic
  }, [])

  const handleComponentDelete = useCallback((componentId: string) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Component',
      message: 'Are you sure you want to delete this component? This action cannot be undone.',
      onConfirm: () => {
        deleteComponent(componentId)
        if (selectedComponent?.compId === componentId) {
          setSelectedComponent(null)
        }
        setConfirmationModal(prev => ({ ...prev, isOpen: false }))
        toast.success('Component deleted successfully')
      },
      type: 'danger'
    })
  }, [deleteComponent, selectedComponent])

  const handleSectionSelect = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId)
  }, [])

  const handleSectionEdit = useCallback((sectionId: string) => {
    setEditingSectionId(sectionId)
  }, [])

  const handleSectionSave = useCallback(() => {
    setEditingSectionId(null)
  }, [])

  const handleSectionDuplicate = useCallback((sectionId: string) => {
    // TODO: Implement duplicate logic
  }, [])

  const handleSectionDeleteCallback = useCallback((sectionId: string) => {
    handleSectionDelete(sectionId)
    toast.success('Section deleted successfully')
  }, [handleSectionDelete])

  const handleColumnDeleteCallback = useCallback((sectionId: string, containerId: string, rowId: string, colId: string) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Column',
      message: 'Are you sure you want to delete this column? This action cannot be undone.',
      onConfirm: () => {
        handleColumnDelete(sectionId, containerId, rowId, colId)
        setConfirmationModal(prev => ({ ...prev, isOpen: false }))
        toast.success('Column deleted successfully')
      },
      type: 'danger'
    })
  }, [handleColumnDelete])

  const handleSectionContentUpdate = useCallback((sectionId: string, content: string) => {
    setLayout(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, content } : s)
    }))
  }, [setLayout])

  const handleSave = useCallback(async () => {
    const success = await saveLayout(layout)
    if (success) {
      toast.success('Layout saved successfully!')
    } else {
      toast.error('Failed to save layout')
    }
  }, [saveLayout, layout])

  const handleLayoutChange = useCallback((newLayout: any) => {
    setLayout(newLayout)
  }, [setLayout])

  const handleAddPage = useCallback(async () => {
    const newPage = await createPage("New Page");
    if (newPage) {
      const initialLayout = { id: newPage.id, name: newPage.name, sections: [] };
      setBaseLayout(initialLayout);
      setCurrentPageId(newPage.id);
    }
  }, [createPage, setCurrentPageId, setBaseLayout])

  return (
    <div ref={containerRef} className="h-screen bg-slate-50 overflow-hidden flex flex-col">
      {/* Top Toolbar */}
      <PageEditorHeader
        isMobile={isMobile}
        leftSidebarVisible={leftSidebarVisible}
        setLeftSidebarVisible={setLeftSidebarVisible}
        rightSidebarVisible={rightSidebarVisible}
        setRightSidebarVisible={setRightSidebarVisible}
        pages={pages.map(p => ({ id: p.id, name: p.name, active: p.active, disabled: p.disabled }))}
        currentPageId={currentPageId}
        setCurrentPageId={setCurrentPageId}
        layoutName={layout.name}
        loading={loading}
        showSaveButton={showSaveButton}
        onSave={handleSave}
        onCancel={onCancel}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}

        isModal={isModal}
        onAddPage={handleAddPage}
      />

      {/* Main Content Area */}
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div
          className="flex-1 overflow-hidden grid transition-all duration-300 ease-in-out"
          style={{
            gridTemplateColumns: `${leftSidebarVisible ? '350px' : '40px'} 1fr ${rightSidebarVisible ? '8px' : '0px'} ${rightSidebarVisible ? rightSidebarWidth + 'px' : '40px'}`
          }}
        >
        {/* Left Sidebar */}
        <div className="bg-white border-r border-slate-200 shadow-sm transition-all duration-300 ease-in-out overflow-hidden flex">
          {leftSidebarVisible ? (
            <>
              <div className="flex-1 overflow-auto">
                <LeftSidebar
                  layout={layout}
                  selectedSectionId={selectedSectionId}
                  selectedComponentId={selectedComponent?.compId}
                  onSectionSelect={handleSectionSelect}
                  onComponentSelect={handleComponentSelect}
                  onComponentAdd={handleComponentAdd}
                />
              </div>
              <button
                onClick={() => setLeftSidebarVisible(false)}
                className="w-10 h-full bg-slate-100 hover:bg-slate-200 border-l border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                aria-label="Collapse left sidebar"
              >
                ‹
              </button>
            </>
          ) : (
            <button
              onClick={() => setLeftSidebarVisible(true)}
              className="w-10 h-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
              aria-label="Expand left sidebar"
            >
              ›
            </button>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex flex-col min-w-0 overflow-auto">
          <PageEditorCanvas
            layout={layout}
            selectedSectionId={selectedSectionId}
            editingSectionId={editingSectionId}
            selectedComponent={selectedComponent}
            onSectionSelect={handleSectionSelect}
            onSectionEdit={handleSectionEdit}
            onSectionSave={handleSectionSave}
            onSectionContentUpdate={handleSectionContentUpdate}
            onSectionDuplicate={handleSectionDuplicate}
            onSectionDelete={handleSectionDeleteCallback}
            onComponentSelect={handleComponentSelect}
            onComponentEdit={handleComponentEdit}
            onComponentDuplicate={handleComponentDuplicate}
            onComponentDelete={handleComponentDelete}
            onComponentUpdate={handleComponentUpdate}
            onColumnDelete={handleColumnDeleteCallback}
            onDragEnd={handleDragEnd}
            onAddSection={handleAddSection}
            onSetSectionRows={handleSetSectionRows}
            onSetSectionColumns={handleSetSectionColumns}
            pages={pages.map(p => ({ id: p.id, name: p.name, active: p.active, disabled: p.disabled }))}
            currentPageId={currentPageId}
            onDeletePage={async (pageId) => {
              const success = await deletePage(pageId);
              if (success) {
                toast.success('Page deleted successfully');
              } else {
                toast.error('Failed to delete page');
              }
            }}
            onDisablePage={async (pageId, disabled) => {
              const success = await disablePage(pageId, disabled);
              if (success) {
                toast.success(`Page ${disabled ? 'disabled' : 'enabled'} successfully`);
              } else {
                toast.error(`Failed to ${disabled ? 'disable' : 'enable'} page`);
              }
            }}
          />
        </div>

        {/* Right Resize Handle */}
        <div
          className="bg-slate-300 hover:bg-slate-400 transition-colors cursor-col-resize flex items-center justify-center group"
          onMouseDown={(e) => {
            if (rightSidebarVisible) {
              e.preventDefault()
              setIsResizingRight(true)
            }
          }}
          style={{ userSelect: 'none', width: rightSidebarVisible ? '8px' : '0px' }}
          aria-label="Resize properties panel"
          role="separator"
          aria-orientation="vertical"
        >
          <div className="w-0.5 h-8 bg-slate-400 group-hover:bg-slate-500 rounded transition-colors"></div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="bg-white border-l border-slate-200 shadow-sm transition-all duration-300 ease-in-out overflow-hidden flex">
          {rightSidebarVisible ? (
            <>
              <button
                onClick={() => setRightSidebarVisible(false)}
                className="w-10 h-full bg-slate-100 hover:bg-slate-200 border-r border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                aria-label="Collapse right sidebar"
              >
                ›
              </button>
              <div className="flex-1 overflow-auto">
                <PropertyPanel
                  selectedComponent={selectedComponent}
                  onComponentUpdate={handleComponentUpdate}
                  onClose={() => setSelectedComponent(null)}
                />
              </div>
            </>
          ) : (
            <button
              onClick={() => setRightSidebarVisible(true)}
              className="w-10 h-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
              aria-label="Expand right sidebar"
            >
              ‹
            </button>
          )}
        </div>
        </div>
      </DragDropProvider>

      {/* Bottom JSON View */}
      <JSONView
        layout={layout}
        onLayoutChange={handleLayoutChange}
        isOpen={showJsonView}
        onToggle={() => setShowJsonView(!showJsonView)}
      />

      {/* Toast notifications */}
      <Toaster position="top-right" />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
      />
    </div>
  )
}

export default React.memo(PageEditor)
