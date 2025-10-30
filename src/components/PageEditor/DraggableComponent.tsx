'use client'

import React from 'react'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'
import { Draggable } from '@hello-pangea/dnd'
import { LayoutComponent } from '@/types/page-editor'
import { useDragDrop } from './DragDropProvider'
import { TrashIcon, EditIcon } from 'lucide-react'

interface DraggableComponentProps {
  component: LayoutComponent;
  index: number;
  sectionId: string;
  containerId: string;
  rowId: string;
  colId: string;
  isSelected?: boolean;
  onSelect?: (component: LayoutComponent, context: {
    sectionId: string;
    containerId: string;
    rowId: string;
    colId: string;
  }) => void;
  onEdit?: (componentId: string) => void;
  onDuplicate?: (component: LayoutComponent) => void;
  onDelete?: (componentId: string) => void;
  onResize?: (componentId: string, size: { width: number; height: number }) => void;
  renderComponent: (component: LayoutComponent, context: { sectionId: string; containerId: string; rowId: string; colId: string }) => React.ReactNode;
  [key: string]: any;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
  index,
  sectionId,
  containerId,
  rowId,
  colId,
  isSelected = false,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
  onResize,
  renderComponent
}) => {
  const { isDragging } = useDragDrop()

  const draggableId = `component:${component.id}:${sectionId}-${containerId}-${rowId}-${colId}`

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`w-full max-w-full h-auto relative group mb-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all ${
            snapshot.isDragging ? 'opacity-50 rotate-2 scale-105' : ''
          } ${isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200'}`}
        >
          {/* Drag Handle */}
          <div
            {...provided.dragHandleProps}
            className="absolute top-2 left-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded cursor-move flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Drag to move"
          >
            <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4h14a1 1 0 010 2H3a1 1 0 010-2zM3 8h14a1 1 0 010 2H3a1 1 0 010-2zM3 12h14a1 1 0 010 2H3a1 1 0 010-2z"/>
            </svg>
          </div>

          {/* Component Content */}
          <div className="w-full max-w-full h-auto p-3">
            <ResizableBox
              width={'100%' as any}
              height={component.height || 200}
              axis="y"
              onResize={(event: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
                onResize?.(component.id, size)
              }}
              minConstraints={[100, 100]}
              maxConstraints={[Infinity, 800]}
              className="w-full"
              style={{ maxWidth: '100%' }}
            >
              <div className="w-full h-auto">
                {renderComponent(component, { sectionId, containerId, rowId, colId })}
              </div>

              {/* Component Label */}
              <div className="mt-2 text-xs text-gray-500 text-center">
                {component.label} ({component.type})
              </div>
            </ResizableBox>
          </div>

          {/* Action Buttons Top-Right (fixed inside card) */}
          <div className="absolute top-0 right-0 flex gap-1 m-2 opacity-100 transition-opacity z-20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(component.id)
              }}
              className="bg-gray-100 hover:bg-gray-200 text-black rounded p-2"
              title="Edit Component"
            >
              <EditIcon size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(component.id)
              }}
              className="bg-red-100 hover:bg-red-200 text-red-700 rounded p-2"
              title="Delete Component"
            >
              <TrashIcon size={16} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  )
}
