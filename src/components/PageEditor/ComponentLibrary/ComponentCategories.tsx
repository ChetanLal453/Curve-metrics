'use client'

import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { componentRegistry } from '@/lib/componentRegistry'
import { ComponentDefinition } from '@/types/page-editor'
import { ComponentCard } from './ComponentCard'

interface ComponentCategoriesProps {
  categories: string[]
  onComponentSelect?: (component: ComponentDefinition) => void
  query?: string
}

export const ComponentCategories: React.FC<ComponentCategoriesProps> = ({ categories: _categories, onComponentSelect, query = '' }) => {
  const normalizedQuery = query.trim().toLowerCase()
  const specCategories = [
    { label: 'Layout', matchers: ['container', 'grid', 'layout', 'section', 'row', 'column', 'divider', 'spacer', 'flex'] },
    { label: 'Typography', matchers: ['heading', 'paragraph', 'text', 'quote', 'rich'] },
    { label: 'Media', matchers: ['image', 'video', 'icon', 'gallery', 'media', 'carousel', 'slider'] },
    { label: 'Interactive', matchers: ['button', 'accordion', 'form', 'tabs', 'cta'] },
  ]

  const categorized = specCategories
    .map(({ label, matchers }) => {
      const components = componentRegistry
        .getAllComponents()
        .filter((component) => {
          const haystack = [component.name, component.description, component.category, component.type, component.id].join(' ').toLowerCase()
          const matchesCategory = matchers.some((matcher) => haystack.includes(matcher))
          const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery)
          return matchesCategory && matchesQuery
        })

      return { label, components }
    })
    .filter((group) => group.components.length > 0)

  const uncategorized = componentRegistry
    .getAllComponents()
    .filter((component) => {
      const haystack = [component.name, component.description, component.category, component.type, component.id].join(' ').toLowerCase()
      const inSpecCategory = specCategories.some((group) => group.matchers.some((matcher) => haystack.includes(matcher)))
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery)
      return !inSpecCategory && matchesQuery
    })

  return (
    <div className="flex flex-col">
      {categorized.map((group) => (
        <CategoryDroppable key={group.label} category={group.label.toLowerCase()} components={group.components} displayName={group.label} onComponentSelect={onComponentSelect} />
      ))}
      {uncategorized.length ? <CategoryDroppable category="other" components={uncategorized} displayName="Other" onComponentSelect={onComponentSelect} /> : null}
    </div>
  )
}

function CategoryDroppable({
  category,
  components,
  displayName,
  onComponentSelect,
}: {
  category: string
  components: ComponentDefinition[]
  displayName: string
  onComponentSelect?: (component: ComponentDefinition) => void
}) {
  const { setNodeRef } = useDroppable({
    id: `component-category:${category}`,
    data: {
      type: 'component-category',
      category,
    },
  })

  return (
    <div ref={setNodeRef}>
      <div className="cat">{displayName}</div>
      <div className="cgrid">
        {components.map((component, index) => (
          <ComponentCard key={component.id} component={component} index={index} onClick={() => onComponentSelect?.(component)} />
        ))}
      </div>
    </div>
  )
}
