'use client'

import React, { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { componentRegistry } from '@/lib/componentRegistry'
import { ComponentDefinition } from '@/types/page-editor'
import { ComponentCard } from './ComponentCard'

interface ComponentCategoriesProps {
  categories: string[]
  onComponentSelect?: (component: ComponentDefinition) => void
}

export const ComponentCategories: React.FC<ComponentCategoriesProps> = ({ categories, onComponentSelect }) => {
  const [openCategory, setOpenCategory] = useState<string | null>('all')

  const handleCategoryClick = (category: string) => {
    setOpenCategory(openCategory === category ? null : category)
  }

  const allCategories = ['all', ...categories]

  return (
    <div className="px-2 flex flex-col gap-1 overflow-y-auto">
      {allCategories.map((category) => {
        const isOpen = openCategory === category
        const displayName = category === 'all' ? 'All Components' : category.charAt(0).toUpperCase() + category.slice(1)

        const components = category === 'all' ? componentRegistry.getAllComponents() : componentRegistry.getComponentsByCategory(category)

        return (
          <div key={category} className="flex flex-col">
            {/* Category Button */}
            <button
              onClick={() => handleCategoryClick(category)}
              className="flex justify-between items-center px-2 rounded-md w-full hover:bg-gray-100 transition-all"
              style={{
                height: '48px', // fixed button height
                lineHeight: '1', // tighten text
                fontSize: '12px', // text-xs
              }}>
              <span className="truncate" style={{ lineHeight: '1', fontSize: '12px' }}>
                {displayName}
              </span>
              <svg
                className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Components Grid */}
            {isOpen && (
              <div className="mt-1 transition-all duration-300 ease-in-out">
                <Droppable droppableId={`category-${category}`} type="component">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-2 gap-2">
                      {components.map((component, index) => (
                        <ComponentCard key={component.id} component={component} index={index} onClick={() => onComponentSelect?.(component)} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
