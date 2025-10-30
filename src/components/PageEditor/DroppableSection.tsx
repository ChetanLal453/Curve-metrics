'use client'

import React from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import { Section } from '@/types/page-editor'
import { useDragDrop } from './DragDropProvider'

interface DroppableSectionProps {
  section: Section;
  index: number;
  isSelected?: boolean;
  editingSectionId?: string | null;
  onSelect?: (sectionId: string) => void;
  onEdit?: (sectionId: string) => void;
  onSave?: () => void;
  onDuplicate?: (sectionId: string) => void;
  onDelete?: (sectionId: string) => void;
  children: React.ReactNode;
  [key: string]: any;
}

export const DroppableSection: React.FC<DroppableSectionProps> = ({
  section,
  index,
  isSelected = false,
  editingSectionId,
  onSelect,
  onEdit,
  onSave,
  onDuplicate,
  onDelete,
  children
}) => {
  const { isDragging, validDropZones } = useDragDrop()

  const isValidDropZone = validDropZones.some(zone =>
    zone.type === 'section' && zone.id === 'page-layout'
  )

  return (
    <Draggable draggableId={`section:${section.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group transition-all duration-200 ${
            snapshot.isDragging ? 'opacity-50 rotate-2 scale-105' : ''
          } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50 rounded-xl shadow-lg' : 'hover:shadow-md'}`}
        >
          {/* Section Toolbar */}
          <div
            {...provided.dragHandleProps}
            className={`flex items-center justify-between p-4 bg-white border border-slate-200 rounded-t-xl cursor-move group-hover:bg-slate-50 transition-all duration-200 ${
              isSelected ? 'bg-blue-50/50 border-blue-300 shadow-sm' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-slate-400 rounded-md cursor-move group-hover:bg-slate-600 transition-colors flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4h14a1 1 0 010 2H3a1 1 0 010-2zM3 8h14a1 1 0 010 2H3a1 1 0 010-2zM3 12h14a1 1 0 010 2H3a1 1 0 010-2z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900 text-sm">
                  {section.name || `Section ${index + 1}`}
                </span>
                <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                  {section.type}
                </span>
              </div>
            </div>

            {/* Section Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete?.(section.id)}
                className="px-2 py-1 border border-red-500 text-red-500 bg-white rounded-full text-xs font-medium hover:bg-red-50 transition-colors flex items-center gap-1"
                title="Delete Section"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* Section Content */}
          <div className={`border-l border-r border-b border-slate-200 rounded-b-xl bg-white shadow-sm overflow-x-hidden ${
            isSelected ? 'border-blue-300 shadow-blue-100' : ''
          }`}>
            <Droppable
              droppableId={`section-content:${section.id}`}
              type="container"
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-40 h-auto p-6 transition-all duration-200 relative flex flex-col w-full ${
                    snapshot.isDraggingOver && isValidDropZone
                      ? 'bg-blue-50/50 border-2 border-blue-300 border-dashed rounded-xl'
                      : 'bg-white'
                  }`}
                >

                  {children}

                  {/* Drop indicator */}
                  {snapshot.isDraggingOver && isValidDropZone && (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <p className="text-base text-blue-700 font-semibold">Drop container here</p>
                        <p className="text-sm text-blue-600 mt-1">Release to add to this section</p>
                      </div>
                    </div>
                  )}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      )}
    </Draggable>
  )
}
