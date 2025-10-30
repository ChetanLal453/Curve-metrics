'use client'

import React, { useState } from 'react'
import { ComponentLibrary } from '../ComponentLibrary'
import { StructureTree } from './StructureTree'
import { Section, LayoutComponent, ComponentDefinition } from '@/types/page-editor'

interface LeftSidebarProps {
  layout: { sections: Section[] }
  selectedSectionId?: string
  selectedComponentId?: string
  onSectionSelect: (sectionId: string) => void
  onComponentSelect: (component: LayoutComponent, context: { sectionId: string; containerId: string; rowId: string; colId: string }) => void
  onComponentAdd: (componentDef: ComponentDefinition) => void
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  layout,
  selectedSectionId,
  selectedComponentId,
  onSectionSelect,
  onComponentSelect,
  onComponentAdd
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'structure'>('library')

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'library'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          Components
        </button>
        <button
          onClick={() => setActiveTab('structure')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'structure'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          Structure
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'library' && (
          <ComponentLibrary onComponentSelect={onComponentAdd} />
        )}

        {activeTab === 'structure' && (
          <StructureTree
            layout={layout}
            selectedSectionId={selectedSectionId}
            selectedComponentId={selectedComponentId}
            onSectionSelect={onSectionSelect}
            onComponentSelect={onComponentSelect}
          />
        )}
      </div>
    </div>
  )
}
