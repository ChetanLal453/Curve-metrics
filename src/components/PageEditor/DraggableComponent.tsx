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
      className={`draggable-component relative mb-3 w-full max-w-full rounded-[10px] border bg-[#18181f] transition-all ${
        isSortableDragging ? 'opacity-50' : ''
      } ${isSelected ? 'border-[#7c5cfc] shadow-[0_0_0_1px_rgba(124,92,252,0.25)]' : 'border-white/10'}`}
      onClick={handleSelectClick}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className="absolute left-2 top-2 z-10 flex h-6 w-6 cursor-move items-center justify-center rounded bg-[#20202a] opacity-0 transition-opacity group-hover:opacity-100"
        title="Drag to move"
        onClick={(e) => e.stopPropagation()}
      >
        <svg className="h-3 w-3 text-[#8888aa]" fill="currentColor" viewBox="0 0 20 20">
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
          <div className="h-auto w-full rounded-[8px] border border-white/5 bg-[#111116] p-2">
            {renderComponent(component, { sectionId, containerId, rowId, colId })}
          </div>

          {/* Component Label */}
          <div className="mt-2 text-center text-[9px] uppercase tracking-[0.08em] text-[#666680]">
            {component.label} ({component.type})
          </div>
        </ResizableBox>
      </div>

      {/* Action Buttons Top-Right */}
      <div className="absolute right-0 top-0 z-20 m-2 flex gap-1 opacity-100 transition-opacity">
        <button
          onClick={handleEditClick}
          disabled={isDeleted}
          className="rounded bg-[#20202a] p-2 text-[#8888aa] transition-colors hover:bg-[#292935] hover:text-[#eeeeff] disabled:cursor-not-allowed disabled:opacity-50"
          title="Edit Component"
        >
          <EditIcon size={16} />
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={isDeleted}
          className={`${isDeleted ? 'bg-[#50506a] cursor-wait' : 'bg-[#2a1d22] hover:bg-[#3a232c]'} rounded p-2 text-[#ff8aa0] transition-colors disabled:cursor-not-allowed disabled:opacity-70`}
          title="Delete Component"
        >
          <TrashIcon size={16} />
        </button>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute right-12 top-2 h-3 w-3 rounded-full bg-[#7c5cfc]"></div>
      )}
    </div>
  )
}
