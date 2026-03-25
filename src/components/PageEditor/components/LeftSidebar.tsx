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
      <div className="lp-tabs">
        <button
          onClick={() => setActiveTab('library')}
          className={`lptab ${activeTab === 'library' ? 'active' : ''}`}
        >
          Components
        </button>
        <button
          onClick={() => setActiveTab('structure')}
          className={`lptab ${activeTab === 'structure' ? 'active' : ''}`}
        >
          Structure
        </button>
      </div>
      <div className="lp-div" />

      <div className="lp-body">
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
