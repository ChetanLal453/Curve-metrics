'use client'

import React from 'react'
import { Section, LayoutComponent, Row, Column } from '@/types/page-editor'

interface StructureTreeProps {
  layout: { sections: Section[] }
  selectedSectionId?: string
  selectedComponentId?: string
  onSectionSelect: (sectionId: string) => void
  onComponentSelect: (component: LayoutComponent, context: { sectionId: string; containerId: string; rowId: string; colId: string }) => void
}

export const StructureTree: React.FC<StructureTreeProps> = ({
  layout,
  selectedSectionId,
  selectedComponentId,
  onSectionSelect,
  onComponentSelect,
}) => {
  const structureItems = React.useMemo(() => {
    const items: Array<{
      id: string
      label: string
      meta: string
      active: boolean
      onClick: () => void
    }> = []

    layout.sections?.forEach((section, sectionIndex) => {
      items.push({
        id: section.id,
        label: section.name || `Section ${sectionIndex + 1}`,
        meta: section.type || 'container',
        active: selectedSectionId === section.id,
        onClick: () => onSectionSelect(section.id),
      })

      section.container?.rows?.forEach((row: Row) => {
        row.columns?.forEach((col: Column) => {
          col.components?.forEach((component: LayoutComponent, componentIndex: number) => {
            items.push({
              id: component.id,
              label: `${componentIndex + 1}. ${component.label || component.type}`,
              meta: component.type,
              active: selectedComponentId === component.id,
              onClick: () =>
                onComponentSelect(component, {
                  sectionId: section.id,
                  containerId: section.container.id,
                  rowId: row.id,
                  colId: col.id,
                }),
            })
          })
        })
      })
    })

    return items
  }, [layout.sections, onComponentSelect, onSectionSelect, selectedComponentId, selectedSectionId])

  if (structureItems.length === 0) {
    return <div className="px-1 py-4 text-[10px] text-[#666680]">No sections yet. Add components to start building.</div>
  }

  return (
    <div id="struct-list">
      {structureItems.map((item, index) => (
        <button key={item.id} type="button" className={`str-item w-full text-left ${item.active ? 'on' : ''}`} onClick={item.onClick}>
          <span className="min-w-[16px] font-mono text-[9px] text-[#666680]">{String(index + 1).padStart(2, '0')}</span>
          <span className="flex-1 truncate font-medium">{item.label}</span>
          <span className="font-mono text-[7px] uppercase tracking-[0.08em] text-[#666680]">{item.meta}</span>
        </button>
      ))}
    </div>
  )
}
