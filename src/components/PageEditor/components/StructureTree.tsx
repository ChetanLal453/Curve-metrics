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
  onComponentSelect
}) => {
  const renderComponent = (component: LayoutComponent, context: { sectionId: string; containerId: string; rowId: string; colId: string }, level = 0) => {
    const isSelected = selectedComponentId === component.id
    const indent = level * 16

    return (
      <div key={component.id}>
        <div
          className={`px-2 py-1 text-sm cursor-pointer hover:bg-slate-100 rounded ${
            isSelected ? 'bg-blue-100 text-blue-800' : 'text-slate-700'
          }`}
          style={{ paddingLeft: `${8 + indent}px` }}
          onClick={() => onComponentSelect(component, context)}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-400 rounded-full flex-shrink-0"></div>
            <span className="truncate">{component.type}</span>
          </div>
        </div>
      </div>
    )
  }

  const renderSection = (section: Section) => {
    const isSelected = selectedSectionId === section.id

    return (
      <div key={section.id} className="mb-1">
        <div
          className={`px-2 py-2 text-sm font-medium cursor-pointer hover:bg-slate-100 rounded ${
            isSelected ? 'bg-blue-100 text-blue-800' : 'text-slate-800'
          }`}
          onClick={() => onSectionSelect(section.id)}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-500 rounded flex-shrink-0"></div>
            <span className="truncate">Section {section.id}</span>
          </div>
        </div>

        {/* Render container */}
        {section.container && (
          <div key={section.container.id} className="ml-4">
            <div className="px-2 py-1 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-300 rounded flex-shrink-0"></div>
                <span>Container</span>
              </div>
            </div>

            {/* Render rows */}
            {section.container.rows?.map((row: Row) => (
              <div key={row.id} className="ml-4">
                <div className="px-2 py-1 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full flex-shrink-0"></div>
                    <span>Row</span>
                  </div>
                </div>

                {/* Render columns */}
                {row.columns?.map((col: Column) => (
                  <div key={col.id} className="ml-4">
                    <div className="px-2 py-1 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-slate-200 rounded-full flex-shrink-0"></div>
                        <span>Column</span>
                      </div>
                    </div>

                    {/* Render components */}
                    {col.components?.map((component: LayoutComponent) =>
                      renderComponent(component, {
                        sectionId: section.id,
                        containerId: section.container.id,
                        rowId: row.id,
                        colId: col.id
                      }, 4)
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">Page Structure</h3>
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {layout.sections?.length > 0 ? (
          layout.sections.map(renderSection)
        ) : (
          <div className="text-sm text-slate-500 text-center py-8">
            No sections yet. Add components to get started.
          </div>
        )}
      </div>
    </div>
  )
}
