'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: (sectionId: string) => void;
  onConfigureColumns?: (sectionId: string) => void;
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
  onMoveUp,
  onMoveDown,
  onConfigureColumns,
  onDelete,
  children
}) => {
  const { isDragging, validDropZones, isDraggingOverNested } = useDragDrop()

  const isValidDropZone = validDropZones.some(zone =>
    zone.type === 'section' && zone.id === 'page-layout'
  )

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: `section:${section.id}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDraggingOverNested ? 1 : 'auto',
    overflow: 'visible' as 'visible',
  }

  // ==================== ✅ CRITICAL FIX: APPLY SECTION SETTINGS ====================
  const sectionSettings = section?.settings || {}
  
  // Apply section settings to the MAIN wrapper (not header)
  const mainWrapperStyle: React.CSSProperties = {
    ...style,
    backgroundColor: sectionSettings?.backgroundColor || 'transparent',
    margin: sectionSettings?.margin
      ? typeof sectionSettings.margin === 'number'
        ? `${sectionSettings.margin}px`
        : sectionSettings.margin
      : undefined,
    marginBottom:
      sectionSettings?.marginBottom ??
      (typeof sectionSettings?.margin === 'string' && sectionSettings.margin.includes(' ') ? undefined : '60px'),
    border: sectionSettings?.borderWidth
      ? `${sectionSettings.borderWidth}px solid ${sectionSettings.borderColor || '#e5e7eb'}`
      : undefined,
    borderRadius: sectionSettings?.borderRadius || '10px',
    boxShadow: sectionSettings?.shadow || undefined,
    display: sectionSettings?.visible === false ? 'none' : 'block',
    ...(sectionSettings?.customCSS ? parseCustomCSS(sectionSettings.customCSS) : {})
  }

  // ✅✅✅ CRITICAL FIX: Sticky should be applied to CONTENT AREA, not header
  const contentAreaStyle: React.CSSProperties = {
    // Apply sticky settings to CONTENT AREA
    position: sectionSettings?.sticky_enabled ? 'sticky' : 'static',
    top: sectionSettings?.sticky_enabled ? (sectionSettings.sticky_offset || 0) + 'px' : undefined,
    zIndex: sectionSettings?.sticky_enabled ? 10 : 'auto',
  }

  // Helper function to parse custom CSS
  function parseCustomCSS(css: string): Record<string, string> {
    const styleObj: Record<string, string> = {}
    
    // Simple CSS parsing for inline styles
    const rules = css.split(';').filter(rule => rule.trim())
    
    rules.forEach(rule => {
      const [property, value] = rule.split(':').map(part => part.trim())
      if (property && value) {
        // Convert CSS property to React style property
        const reactProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
        
        // Special handling for opacity
        if (property.toLowerCase() === 'opacity') {
          styleObj.opacity = value
        } else {
          styleObj[reactProperty] = value
        }
      }
    })
    
    return styleObj
  }

  return (
    <div
      ref={setNodeRef}
      style={mainWrapperStyle} // ✅ Apply section settings to MAIN wrapper
      {...attributes}
      data-selected={isSelected}
      className={`sf group overflow-visible ${isSelected ? 'sel' : ''} ${isSortableDragging ? 'opacity-50' : ''}`}
      data-section-id={section.id}
      data-background-color={sectionSettings?.backgroundColor || 'none'}
      data-sticky-enabled={sectionSettings?.sticky_enabled || false}
      onClick={() => onSelect?.(section.id)}
    >
      <div className="sf-stripe"></div>
      <div className="sf-overlay"></div>

      <div {...listeners} className="sf-lbl cursor-move">
        <div className="sf-badge">
          {String(index + 1).padStart(2, '0')} · {section.name || `Section ${index + 1}`}
        </div>
        <div className="sf-type">{section.type || 'container'}</div>
      </div>

      <div className="sf-acts">
        {onMoveUp ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMoveUp()
            }}
            className="sact"
            title="Move section up"
          >
            ↑
          </button>
        ) : null}
        {onMoveDown ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMoveDown()
            }}
            className="sact"
            title="Move section down"
          >
            ↓
          </button>
        ) : null}
        {onDuplicate ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate(section.id)
            }}
            className="sact"
            title="Duplicate section"
          >
            ⧉
          </button>
        ) : null}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(section.id)
            }}
            className="sact del"
            title="Delete Section"
          >
            ⌫
          </button>
        )}
      </div>

      <div
        className="sf-content"
        style={{
          ...contentAreaStyle,
          overflow: 'visible',
          padding: sectionSettings?.padding ? (typeof sectionSettings.padding === 'number' ? `${sectionSettings.padding}px` : sectionSettings.padding) : undefined,
        }}>
        {children}
      </div>
    </div>
  )
}
