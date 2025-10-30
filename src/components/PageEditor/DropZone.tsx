'use client'

import React from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { DropZone as DropZoneType } from '@/types/page-editor'
import { useDragDrop } from './DragDropProvider'

interface DropZoneProps {
  zone: DropZoneType;
  children: React.ReactNode;
  className?: string;
  placeholder?: React.ReactNode;
  showDropIndicator?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  zone,
  children,
  className = '',
  placeholder,
  showDropIndicator = true
}) => {
  const { isDragging, draggedItem, validDropZones } = useDragDrop()

  const isValidDropZone = validDropZones.some(validZone =>
    validZone.type === zone.type && validZone.id === zone.id
  )

  const isDraggingValidItem = draggedItem && zone.accepts.includes(draggedItem.type)

  return (
    <Droppable
      droppableId={`${zone.type}:${zone.id}`}
      type={zone.type}
      isDropDisabled={!isValidDropZone}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`relative transition-all duration-200 ${className} ${
            snapshot.isDraggingOver && isValidDropZone
              ? 'bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg'
              : ''
          }`}
        >
          {children}

          {/* Drop Indicator */}
          {showDropIndicator && snapshot.isDraggingOver && isValidDropZone && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium">
                  Drop {draggedItem?.type} here
                </span>
              </div>
            </div>
          )}

          {/* Placeholder for empty zones */}
          {!snapshot.isDraggingOver && placeholder && (
            <div className="text-center py-8 text-gray-400">
              {placeholder}
            </div>
          )}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

// Specialized drop zones for different contexts

export const SectionDropZone: React.FC<{
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  onAddSection?: () => void;
}> = ({ children, placeholder, onAddSection }) => (
  <DropZone
    zone={{
      type: 'section',
      id: 'page-sections',
      accepts: ['section', 'template'],
      index: 0
    }}
    className="min-h-32"
    placeholder={placeholder || (
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Drag sections or templates here to build your page</p>
          {onAddSection && (
            <button
              onClick={onAddSection}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Container
            </button>
          )}
        </div>
      </div>
    )}
  >
    {children}
  </DropZone>
)

export const ContainerDropZone: React.FC<{
  sectionId: string;
  children: React.ReactNode;
  placeholder?: React.ReactNode;
}> = ({ sectionId, children, placeholder }) => (
  <DropZone
    zone={{
      type: 'container',
      id: `section-${sectionId}`,
      accepts: ['container', 'template'],
      index: 0
    }}
    className="min-h-24"
    placeholder={placeholder || (
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-xs text-gray-500">Drop containers here</p>
      </div>
    )}
  >
    {children}
  </DropZone>
)

export const RowDropZone: React.FC<{
  containerId: string;
  children: React.ReactNode;
  placeholder?: React.ReactNode;
}> = ({ containerId, children, placeholder }) => (
  <DropZone
    zone={{
      type: 'row',
      id: `container-${containerId}`,
      accepts: ['row'],
      index: 0
    }}
    className="min-h-16"
    placeholder={placeholder || (
      <div className="flex items-center justify-center py-2">
        <p className="text-xs text-gray-500">Drop rows here</p>
      </div>
    )}
  >
    {children}
  </DropZone>
)

export const ColumnDropZone: React.FC<{
  rowId: string;
  colId: string;
  children: React.ReactNode;
  placeholder?: React.ReactNode;
}> = ({ rowId, colId, children, placeholder }) => (
  <DropZone
    zone={{
      type: 'column',
      id: `row-${rowId}-col-${colId}`,
      accepts: ['column', 'component'],
      index: 0
    }}
    className="min-h-20"
    placeholder={placeholder || (
      <div className="flex flex-col items-center gap-1 py-4">
        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-xs text-gray-500">Drop components here</p>
      </div>
    )}
  >
    {children}
  </DropZone>
)
