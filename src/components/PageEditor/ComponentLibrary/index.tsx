'use client'

import React from 'react'
import { componentRegistry } from '@/lib/componentRegistry'
import { ComponentDefinition } from '@/types/page-editor'
import { ComponentCategories } from './ComponentCategories'

interface ComponentLibraryProps {
  onComponentSelect?: (component: ComponentDefinition) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onComponentSelect,
}) => {
  const categories = componentRegistry.getCategories()

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-2 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Component Library</h2>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        <ComponentCategories
          categories={categories}
          onComponentSelect={onComponentSelect}
        />
      </div>
    </div>
  )
}
