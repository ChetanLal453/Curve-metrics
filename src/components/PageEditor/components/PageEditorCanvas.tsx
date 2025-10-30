import React, { useCallback, useState, useEffect } from 'react'
import { Droppable, DropResult } from '@hello-pangea/dnd'
import { DragDropProvider } from '../DragDropProvider'
import { DroppableSection } from '../DroppableSection'
import { DraggableComponent } from '../DraggableComponent'
import { DynamicComponent } from '../DynamicComponent'
import { PreviewMode } from '../PreviewMode'

import { componentRegistry } from '@/lib/componentRegistry'
import { PageLayout, Section, LayoutComponent } from '@/types/page-editor'

interface PageEditorCanvasProps {
  layout: PageLayout
  selectedSectionId?: string
  editingSectionId?: string | null
  selectedComponent: {
    sectionId: string
    containerId: string
    rowId: string
    colId: string
    compId: string
    component: LayoutComponent
  } | null
  onSectionSelect: (sectionId: string) => void
  onSectionEdit: (sectionId: string) => void
  onSectionSave: () => void
  onSectionContentUpdate: (sectionId: string, content: string) => void
  onSectionDuplicate: (sectionId: string) => void
  onSectionDelete: (sectionId: string) => void
  onComponentSelect: (component: LayoutComponent, context: { sectionId: string; containerId: string; rowId: string; colId: string }) => void
  onComponentEdit: (componentId: string) => void
  onComponentDuplicate: (component: LayoutComponent) => void
  onComponentDelete: (componentId: string) => void
  onComponentUpdate: (componentId: string, props: Record<string, any>) => void
  onComponentResize?: (componentId: string, size: { width: number; height: number }) => void
  onColumnDelete: (sectionId: string, containerId: string, rowId: string, colId: string) => void
  onDragEnd: (result: DropResult, draggedItem: any) => void
  onAddSection: () => void
  onSetSectionRows: (sectionId: string, numRows: number) => void
  onSetSectionColumns: (sectionId: string, numColumns: number) => void
  pages: Array<{id: string, name: string, active: boolean, disabled: boolean}>
  currentPageId: string | null
  onDeletePage?: (pageId: string) => void
  onDisablePage?: (pageId: string, disabled: boolean) => void
}

export const PageEditorCanvas: React.FC<PageEditorCanvasProps> = ({
  layout,
  selectedSectionId,
  editingSectionId,
  selectedComponent,
  onSectionSelect,
  onSectionEdit,
  onSectionSave,
  onSectionContentUpdate,
  onSectionDuplicate,
  onSectionDelete,
  onComponentSelect,
  onComponentEdit,
  onComponentDuplicate,
  onComponentDelete,
  onComponentUpdate,
  onComponentResize,
  onColumnDelete,
  onDragEnd,
  onAddSection,
  onSetSectionRows,
  onSetSectionColumns,
  pages,
  currentPageId,
  onDeletePage,
  onDisablePage
}) => {
  const [editingContent, setEditingContent] = useState('')
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    if (editingSectionId) {
      const section = layout.sections.find(s => s.id === editingSectionId)
      setEditingContent(section?.content || '')
    }
  }, [editingSectionId, layout.sections])

  const handleSectionSave = useCallback(() => {
    if (editingSectionId) {
      onSectionContentUpdate(editingSectionId, editingContent)
    }
    onSectionSave()
  }, [editingSectionId, editingContent, onSectionContentUpdate, onSectionSave])

  const handlePreviewClick = useCallback(() => {
    setIsPreviewMode(true)
  }, [])

  const currentPage = pages.find(p => p.id === currentPageId)
  const isCriticalPage = currentPage?.name.toLowerCase() === 'home'

  const handleDelete = () => {
    if (currentPageId && onDeletePage && window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      onDeletePage(currentPageId)
    }
  }

  const handleToggleDisable = () => {
    if (currentPageId && onDisablePage) {
      onDisablePage(currentPageId, !currentPage?.disabled)
    }
  }

  const renderComponent = useCallback((component: LayoutComponent, context: { sectionId: string; containerId: string; rowId: string; colId: string }) => {
    return (
      <DynamicComponent
        key={component.id}
        component={component}
        isSelected={selectedComponent?.component.id === component.id}
        onSelect={() => onComponentSelect(component, context)}
        onUpdate={(newProps: Record<string, any>) => onComponentUpdate(component.id, newProps)}
      />
    )
  }, [selectedComponent, onComponentSelect, onComponentUpdate])

  const renderSection = useCallback((section: Section, index: number) => (
    <DroppableSection
      key={section.id}
      section={section}
      index={index}
      isSelected={selectedSectionId === section.id}
      editingSectionId={editingSectionId}
      onSelect={onSectionSelect}
      onEdit={onSectionEdit}
      onSave={handleSectionSave}
      onDuplicate={onSectionDuplicate}
      onDelete={onSectionDelete}
    >
      <div className="p-4">
        {editingSectionId === section.id ? (
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="w-full h-40 p-2 border rounded resize-none mb-4"
            placeholder="Enter section content..."
          />
        ) : (
          section.content && <div className="mb-4 whitespace-pre-wrap">{section.content}</div>
        )}

        {section.container.rows.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">Choose the number of columns for this section:</p>
              <div className="flex justify-center gap-3">
                {[1, 2, 3].map((numColumns) => (
                  <button
                    key={numColumns}
                    onClick={() => onSetSectionColumns(section.id, numColumns)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    {numColumns} Column{numColumns > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          section.container.rows.map((row) => (
            <div
              key={row.id}
              className="grid gap-4 mb-4 w-full h-auto overflow-x-hidden"
              style={{ gridTemplateColumns: `repeat(${row.columns.length}, 1fr)` }}
            >
              {row.columns.map((column) => (
                <Droppable
                  key={column.id}
                  droppableId={`column:${section.id}:${section.container.id}:${row.id}:${column.id}`}
                  type="component"
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-20 border-2 border-dashed rounded p-2 transition-all duration-200 ease-in-out bg-gray-50 max-w-full w-full flex-1 h-auto flex flex-col relative group overflow-x-hidden ${
                        snapshot.isDraggingOver
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {/* Column Action Buttons Top-Right */}
                      <div className="absolute top-0 right-0 flex gap-1 m-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // TODO: Implement column edit functionality
                            console.log('Edit column:', column.id)
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-black rounded p-2"
                          title="Edit Column"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onColumnDelete(section.id, section.container.id, row.id, column.id)
                          }}
                          className="bg-red-100 hover:bg-red-200 text-red-700 rounded p-2"
                          title="Delete Column"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {column.components.map((component, index) => (
                        <DraggableComponent
                          key={component.id}
                          component={component}
                          index={index}
                          sectionId={section.id}
                          containerId={section.container.id}
                          rowId={row.id}
                          colId={column.id}
                          isSelected={selectedComponent?.component.id === component.id}
                          onSelect={onComponentSelect}
                          onEdit={onComponentEdit}
                          onDuplicate={onComponentDuplicate}
                          onDelete={onComponentDelete}
                          onResize={onComponentResize}
                          renderComponent={renderComponent}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          ))
        )}
      </div>
    </DroppableSection>
  ), [selectedSectionId, editingSectionId, selectedComponent, onSectionSelect, onSectionEdit, handleSectionSave, onSectionDuplicate, onSectionDelete, onComponentSelect, onComponentEdit, onComponentDuplicate, onComponentDelete, renderComponent, onSetSectionRows, onSetSectionColumns, onColumnDelete])

  return (
    <>
      <div className="flex-1 min-h-0 bg-slate-50 overflow-x-hidden">
        <div className="p-6 h-full">
          <div>
            {/* Canvas Action Buttons */}
            <div className="flex justify-center items-center gap-2 py-2">
              <button
                onClick={onAddSection}
                className="w-32 h-8 px-1 py-0.5 bg-blue-100 text-black rounded-md hover:bg-blue-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Section
              </button>
              {currentPageId && (
                <>
                  <button
                    onClick={handleToggleDisable}
                    disabled={isCriticalPage}
                    className={`w-32 h-8 px-1 py-0.5 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 flex items-center justify-center gap-2 ${
                      isCriticalPage
                        ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                        : currentPage?.disabled
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                    title={isCriticalPage ? 'Cannot disable home page' : currentPage?.disabled ? 'Enable Page' : 'Disable Page'}
                  >
                    {currentPage?.disabled ? 'Enable Page' : 'Disable Page'}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isCriticalPage}
                    className={`w-32 h-8 px-1 py-0.5 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 flex items-center justify-center gap-2 ${
                      isCriticalPage
                        ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                    title={isCriticalPage ? 'Cannot delete home page' : 'Delete Page'}
                  >
                    🗑️ Delete
                  </button>
                </>
              )}
              <button
                onClick={handlePreviewClick}
                className="w-32 h-8 px-2 py-1 bg-blue-100 text-black rounded-md hover:bg-blue-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </button>
            </div>
            <Droppable droppableId="sections" type="section">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-4 min-h-full overflow-y-auto overflow-x-hidden"
                  >
                  {layout.sections.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center shadow-sm">
                        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Start Building Your Page</h3>
                      <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-6">
                        Drag components from the library to start creating your layout.
                      </p>
                    </div>
                  ) : (
                    layout.sections.map((section, index) => renderSection(section, index))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>


      </div>
      {isPreviewMode && (
        <PreviewMode
          layout={layout}
          onClose={() => setIsPreviewMode(false)}
        />
      )}
    </>
  )
}
