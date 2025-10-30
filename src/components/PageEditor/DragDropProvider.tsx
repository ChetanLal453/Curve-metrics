'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { DragDropContext, DropResult, DragStart, DragUpdate } from '@hello-pangea/dnd'
import { DragItem, DropZone } from '@/types/page-editor'

interface DragDropContextType {
  isDragging: boolean;
  draggedItem: DragItem | null;
  validDropZones: DropZone[];
  setValidDropZones: (zones: DropZone[]) => void;
  clearValidDropZones: () => void;
}

const DragDropContextValue = createContext<DragDropContextType | undefined>(undefined)

export const useDragDrop = () => {
  const context = useContext(DragDropContextValue)
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider')
  }
  return context
}

interface DragDropProviderProps {
  children: React.ReactNode;
  onDragEnd: (result: DropResult, draggedItem: DragItem | null) => void;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
  children,
  onDragEnd
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)
  const [validDropZones, setValidDropZones] = useState<DropZone[]>([])

  const handleDragStart = useCallback((start: DragStart) => {
    setIsDragging(true)

    // Parse the draggableId to get the drag item info
    // Format: type:id or type:id:context
    const parts = start.draggableId.split(':')
    const type = parts[0] as DragItem['type']
    const id = parts[1]

    let sourceContext: DragItem['sourceContext'] = undefined
    if (parts.length > 2) {
      // Parse context: sectionId:containerId:rowId:colId
      const contextParts = parts[2].split('-')
      sourceContext = {
        sectionId: contextParts[0] !== 'undefined' ? contextParts[0] : undefined,
        containerId: contextParts[1] !== 'undefined' ? contextParts[1] : undefined,
        rowId: contextParts[2] !== 'undefined' ? contextParts[2] : undefined,
        columnId: contextParts[3] !== 'undefined' ? contextParts[3] : undefined,
      }
    }

    const item: DragItem = {
      type,
      id,
      data: start, // Store the full drag start info
      sourceContext
    }

    setDraggedItem(item)

    // Calculate valid drop zones based on item type
    const zones = calculateValidDropZones(item)
    setValidDropZones(zones)
  }, [])

  const handleDragUpdate = useCallback((update: DragUpdate) => {
    // Update valid drop zones based on current position if needed
    // This can be used for dynamic drop zone highlighting
  }, [])

  const handleDragEnd = useCallback((result: DropResult) => {
    setIsDragging(false)
    setValidDropZones([])

    // Handle smart drop zones - auto-create missing structure
    if (result.destination && draggedItem) {
      const smartResult = handleSmartDrop(result, draggedItem)
      onDragEnd(smartResult, draggedItem)
    } else {
      onDragEnd(result, draggedItem)
    }

    setDraggedItem(null)
  }, [onDragEnd, draggedItem])

  const clearValidDropZones = useCallback(() => {
    setValidDropZones([])
  }, [])

  const contextValue: DragDropContextType = {
    isDragging,
    draggedItem,
    validDropZones,
    setValidDropZones,
    clearValidDropZones
  }

  return (
    <DragDropContextValue.Provider value={contextValue}>
      <DragDropContext
        onDragStart={handleDragStart}
        onDragUpdate={handleDragUpdate}
        onDragEnd={handleDragEnd}
      >
        {children}
      </DragDropContext>
    </DragDropContextValue.Provider>
  )
}

// Helper function to calculate valid drop zones based on drag item type
function calculateValidDropZones(item: DragItem): DropZone[] {
  const zones: DropZone[] = []

  switch (item.type) {
    case 'section':
      // Sections can be dropped into page layout
      zones.push({
        type: 'section',
        id: 'page-layout',
        accepts: ['section'],
        index: 0
      })
      break

    case 'container':
      // Containers can be dropped into sections
      zones.push({
        type: 'container',
        id: 'section-content',
        accepts: ['container'],
        index: 0
      })
      break

    case 'row':
      // Rows can be dropped into containers
      zones.push({
        type: 'row',
        id: 'container-content',
        accepts: ['row'],
        index: 0
      })
      break

    case 'column':
      // Columns can be dropped into rows
      zones.push({
        type: 'column',
        id: 'row-content',
        accepts: ['column'],
        index: 0
      })
      break

    case 'component':
      // Components can be dropped into columns
      zones.push({
        type: 'column',
        id: 'column-content',
        accepts: ['component'],
        index: 0
      })
      break

    case 'template':
      // Templates can be dropped into sections or page layout
      zones.push(
        {
          type: 'section',
          id: 'page-layout',
          accepts: ['template'],
          index: 0
        },
        {
          type: 'container',
          id: 'section-content',
          accepts: ['template'],
          index: 0
        }
      )
      break
  }

  return zones
}

// Helper function to handle smart drop zones - auto-create missing structure
function handleSmartDrop(result: DropResult, draggedItem: DragItem): DropResult {
  if (!result.destination) return result

  const { destination, draggableId } = result
  const destParts = destination.droppableId.split(':')
  const destType = destParts[0]
  const destId = destParts[1]

  // For components being dropped into columns, ensure the column exists
  if (draggedItem.type === 'component' && destType === 'column') {
    // The column should already exist, but we can add validation here
    return result
  }

  // For templates being dropped, they might need to be converted to appropriate structure
  if (draggedItem.type === 'template') {
    // Convert template to section/container based on drop target
    if (destType === 'section' || destType === 'page-sections') {
      // Template becomes a section
      return {
        ...result,
        draggableId: `section:${draggedItem.id}:template`
      }
    } else if (destType === 'container') {
      // Template becomes a container
      return {
        ...result,
        draggableId: `container:${draggedItem.id}:template`
      }
    }
  }

  // For sections dropped into page layout, ensure proper structure
  if (draggedItem.type === 'section' && destType === 'section') {
    return result
  }

  // For containers dropped into sections, auto-create if needed
  if (draggedItem.type === 'container' && destType === 'container') {
    return result
  }

  // For rows dropped into containers, auto-create if needed
  if (draggedItem.type === 'row' && destType === 'row') {
    return result
  }

  return result
}
