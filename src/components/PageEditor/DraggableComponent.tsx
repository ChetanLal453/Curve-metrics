'use client'

import React, { useState } from 'react'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
  onDelete?: (componentId: string, context?: any) => void;
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
  const [isDeleted, setIsDeleted] = useState(false) // 🆕 NEW STATE
  const isAdvancedHeading = component.type === 'advancedheading'
  const isAdvancedParagraph = component.type === 'advancedparagraph'
  const isAdvancedContent = isAdvancedHeading || isAdvancedParagraph

  const draggableId = `component:${component.id}:${sectionId}-${containerId}-${rowId}-${colId}`

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: draggableId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // ✅✅✅ **FIXED: handleDeleteClick - IMMEDIATE UI REMOVAL**
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isDeleted) {
      console.log('⏳ Already deleted, please wait...');
      return;
    }
    
    console.log("🧹 Delete clicked for section component:", component.id, {
      sectionId,
      containerId,
      rowId,
      colId,
      componentType: component.type
    });
    
    // 🎯 **CRITICAL FIX: IMMEDIATELY HIDE COMPONENT FROM UI**
    setIsDeleted(true);
    
    console.log('👁️ Component hidden from UI - STATE UPDATED');
    
    // ✅ Pass complete context to onDelete
    onDelete?.(component.id, {
      sectionId,
      containerId,
      rowId,
      colId,
      source: 'draggable-component',
      componentType: component.type,
      timestamp: new Date().toISOString()
    });
  }

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDeleted) {
      onSelect?.(component, { sectionId, containerId, rowId, colId });
    }
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDeleted) {
      onEdit?.(component.id);
    }
  }

  // 🎯 **CRITICAL: If component is deleted, DON'T RENDER**
  if (isDeleted) {
    console.log('🚫 Component deleted, not rendering:', component.id);
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      data-selected={isSelected}
      className={`draggable-component group relative mb-3 w-full max-w-full ${isSortableDragging ? 'opacity-50' : ''} ${isSelected ? 'is-selected' : ''} dc-type-${component.type}`}
      onClick={handleSelectClick}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className="dc-handle"
        title="Drag to move"
        onClick={(e) => e.stopPropagation()}
      >
        <svg className="dc-handle-icon" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h14a1 1 0 010 2H3a1 1 0 010-2zM3 8h14a1 1 0 010 2H3a1 1 0 010-2zM3 12h14a1 1 0 010 2H3a1 1 0 010-2z"/>
        </svg>
      </div>

      {/* Component Content */}
      <div className={`dc-body h-auto w-full ${isAdvancedContent ? 'p-0' : 'p-4'}`}>
        {isAdvancedContent ? (
          <div className="h-auto w-full">
            {renderComponent(component, { sectionId, containerId, rowId, colId })}
          </div>
        ) : (
          <ResizableBox
            width={'100%' as any}
            height={component.height || 200}
            axis="y"
            onResize={(event: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
              onResize?.(component.id, size)
            }}
            minConstraints={[100, 100]}
            maxConstraints={[Infinity, 800]}
            className="dc-resizable w-full"
            style={{ maxWidth: '100%' }}
          >
            <div className="h-auto w-full">
              {renderComponent(component, { sectionId, containerId, rowId, colId })}
            </div>

            {/* Component Label */}
            <div className="dc-label">
              {component.label} ({component.type})
            </div>
          </ResizableBox>
        )}
      </div>

      {/* Action Buttons Top-Right */}
      <div className="dc-actions">
        <button
          onClick={handleEditClick}
          disabled={isDeleted}
          className="dc-action-btn"
          title="Edit Component"
        >
          <EditIcon size={16} />
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={isDeleted}
          className={`dc-action-btn is-danger ${isDeleted ? 'is-disabled' : ''}`}
          title="Delete Component"
        >
          <TrashIcon size={16} />
        </button>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="dc-selected-dot"></div>
      )}
    </div>
  )
}
