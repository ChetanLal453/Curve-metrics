'use client'

import React, { useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { LayoutComponent } from '@/types/page-editor'

interface ComponentWrapperProps {
  children: React.ReactNode
  onEdit: () => void
  onDelete?: () => void
  className?: string
  isGridLevel?: boolean
  sectionId?: string
  containerId?: string
  rowId?: string
  colId?: string
  component?: LayoutComponent
  deleteComponent?: (componentId: string, context?: any) => void
  // 🆕 CRITICAL: Add nested context props
  carouselId?: string
  slideIndex?: number
  gridId?: string
  cellRow?: number
  cellCol?: number
  parentGridId?: string
  onComponentSelect?: (component: LayoutComponent, context: any) => void
}

export const ComponentWrapper: React.FC<ComponentWrapperProps> = ({
  children,
  onEdit,
  onDelete,
  className = '',
  isGridLevel = false,
  sectionId,
  containerId,
  rowId,
  colId,
  component,
  deleteComponent,
  // 🆕 New props
  carouselId,
  slideIndex,
  gridId,
  cellRow,
  cellCol,
  parentGridId,
  onComponentSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // 🆕 FIXED: Enhanced handleEdit with full context logging
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()

    // 🆕 Log complete context for debugging
    console.log('🔘 ComponentWrapper Edit Clicked - FULL CONTEXT:', {
      componentId: component?.id,
      componentType: component?.type,
      sectionId,
      containerId,
      rowId,
      colId,
      carouselId,
      slideIndex,
      gridId: gridId || parentGridId,
      cellRow,
      cellCol,
      parentGridId,
      isNested: !!carouselId || !!gridId,
      timestamp: new Date().toISOString(),
    })

    // 🆕 If onComponentSelect is provided, call it with full context
    if (component && onComponentSelect) {
      const context = {
        sectionId: sectionId || '',
        containerId: containerId || '',
        rowId: rowId || '',
        colId: colId || '',
        carouselId,
        slideIndex,
        gridId: gridId || parentGridId,
        cellRow,
        cellCol,
        parentGridId,
        source: gridId ? 'grid-cell' : carouselId ? 'carousel-direct' : 'regular',
        isNestedSelection: !!(carouselId || gridId),
      }

      console.log('📤 ComponentWrapper: Calling onComponentSelect with context:', context)
      onComponentSelect(component, context)
      
      // ✅✅✅ CRITICAL CHANGE: RETURN HERE, don't call onEdit()
      return;
    }

    // ✅ FIXED: Only call onEdit if onComponentSelect was not used
    onEdit()
  }

  // 🆕 FIXED: Enhanced handleDelete with full context
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!component) {
      console.error('❌ ComponentWrapper: No component to delete')
      return
    }

    console.log('🗑️ ComponentWrapper Delete Clicked with FULL CONTEXT:', {
      componentId: component.id,
      componentType: component.type,
      context: {
        sectionId,
        containerId,
        rowId,
        colId,
        carouselId,
        slideIndex,
        gridId: gridId || parentGridId,
        cellRow,
        cellCol,
        parentGridId,
        source: gridId ? 'grid-cell' : carouselId ? 'carousel-direct' : 'regular',
        isNestedSelection: !!(carouselId || gridId),
      },
    })

    // 🆕 Create comprehensive context object
    const deleteContext = {
      sectionId: sectionId || '',
      containerId: containerId || '',
      rowId: rowId || '',
      colId: colId || '',
      carouselId,
      slideIndex,
      gridId: gridId || parentGridId,
      cellRow,
      cellCol,
      parentGridId,
      source: gridId ? 'grid-cell' : carouselId ? 'carousel-direct' : 'regular',
      isNestedSelection: !!(carouselId || gridId),
      deletedFrom: 'ComponentWrapper',
    }

    // Priority: deleteComponent with context > onDelete > deleteComponent without context
    if (deleteComponent) {
      console.log('📤 ComponentWrapper: Calling deleteComponent with context:', deleteContext)
      deleteComponent(component.id, deleteContext)
    } else if (onDelete) {
      console.log('📤 ComponentWrapper: Falling back to onDelete prop')
      onDelete()
    } else {
      console.error('❌ ComponentWrapper: No delete handler available')
    }
  }

  // 🆕 Helper to get context badge text
  const getContextBadge = () => {
    const parts = []

    if (carouselId) {
      parts.push(`🎠 Slide ${(slideIndex || 0) + 1}`)
    }

    if (gridId || parentGridId) {
      parts.push(`🔳 Grid`)
    }

    if (cellRow !== undefined && cellCol !== undefined) {
      parts.push(`Cell ${cellRow},${cellCol}`)
    }

    return parts.join(' • ')
  }

  const hasNestedContext = carouselId || gridId || parentGridId || cellRow !== undefined || cellCol !== undefined

  return (
    <div
      className={`relative group component-wrapper ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-component-id={component?.id}
      data-carousel-id={carouselId}
      data-slide-index={slideIndex}
      data-grid-id={gridId || parentGridId}
      data-cell-row={cellRow}
      data-cell-col={cellCol}>
      {children}

      {/* 🆕 Component Type Label */}
      {component && !isGridLevel && (
        <div
          className={`absolute top-1 left-1 text-xs font-semibold text-gray-700 bg-white bg-opacity-90 px-2 py-1 rounded shadow-sm transition-opacity duration-200 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
          {component.type}
          {hasNestedContext && ' • '}
          {hasNestedContext && <span className="text-xs text-gray-500">{getContextBadge()}</span>}
        </div>
      )}

      {/* 🆕 Context Info Badge (for nested components) */}
      {hasNestedContext && (
        <div
          className={`absolute bottom-1 left-1 text-xs font-medium text-gray-600 bg-white bg-opacity-90 px-2 py-1 rounded shadow-sm transition-opacity duration-200 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
          {getContextBadge()}
        </div>
      )}

      {/* Edit/Delete buttons */}
      <div className={`absolute top-1 right-1 flex gap-1 transition-opacity duration-200 z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={handleEdit}
          className="p-1.5 bg-white hover:bg-blue-50 text-blue-600 border border-blue-300 rounded shadow-sm transition-colors hover:scale-105 active:scale-95"
          title={isGridLevel ? 'Edit Grid' : 'Edit Component'}>
          <Edit size={14} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-300 rounded shadow-sm transition-colors hover:scale-105 active:scale-95"
          title={isGridLevel ? 'Delete Grid' : 'Delete Component'}>
          <Trash2 size={14} />
        </button>
      </div>

      {/* 🆕 Debug overlay on hover (only in development) */}
      {process.env.NODE_ENV === 'development' && isHovered && (
        <div className="absolute inset-0 border-2 border-blue-300 border-dashed rounded pointer-events-none z-0" />
      )}
    </div>
  )
}