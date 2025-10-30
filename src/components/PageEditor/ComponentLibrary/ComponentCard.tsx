'use client'

import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { ComponentDefinition } from '@/types/page-editor'

interface ComponentCardProps {
  component: ComponentDefinition
  index: number
  onClick?: () => void
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  index,
  onClick
}) => {
  return (
    <Draggable draggableId={`component-lib:${component.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`p-0.5 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200 ease-in-out select-none ${
            snapshot.isDragging ? 'opacity-50 rotate-2 scale-105 shadow-lg' : ''
          }`}
        >
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] text-gray-600">{component.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-[8px] text-gray-900 truncate">{component.name}</h4>
              <p className="text-[8px] text-gray-500 line-clamp-2">{component.description}</p>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
