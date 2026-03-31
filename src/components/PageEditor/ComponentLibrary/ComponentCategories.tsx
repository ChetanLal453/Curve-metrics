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

type PreviewLibraryItem = {
  componentId: string
  label: string
  glyphKey: string
}

export const ComponentCategories: React.FC<ComponentCategoriesProps> = ({ categories: _categories, onComponentSelect, query = '' }) => {
  const normalizedQuery = query.trim().toLowerCase()
  const previewGroups: Array<{ label: string; items: PreviewLibraryItem[] }> = [
    {
      label: 'Layout',
      items: [
        { componentId: 'spacer', label: 'Spacer', glyphKey: 'spacer' },
        { componentId: 'container', label: 'Container', glyphKey: 'container' },
        { componentId: 'flexbox', label: 'Flex', glyphKey: 'flex' },
        { componentId: 'divider', label: 'Divider', glyphKey: 'divider' },
      ],
    },
    {
      label: 'Content',
      items: [
        { componentId: 'advancedheading', label: 'Heading', glyphKey: 'heading' },
        { componentId: 'advancedparagraph', label: 'Paragraph', glyphKey: 'paragraph' },
        { componentId: 'advancedlist', label: 'List', glyphKey: 'list' },
        { componentId: 'advancedImage', label: 'Image', glyphKey: 'image' },
        { componentId: 'video', label: 'Video', glyphKey: 'video' },
      ],
    },
    {
      label: 'Interactive',
      items: [
        { componentId: 'advancedbutton', label: 'Button', glyphKey: 'button' },
        { componentId: 'tabs', label: 'Tabs', glyphKey: 'form' },
        { componentId: 'advancedaccordion', label: 'Accordion', glyphKey: 'accordion' },
        { componentId: 'swipercontainer', label: 'Carousel', glyphKey: 'carousel' },
      ],
    },
    {
      label: 'Advanced',
      items: [
        { componentId: 'NewGrid', label: 'Grid', glyphKey: 'grid' },
        { componentId: 'advancedCard', label: 'Card', glyphKey: 'chart' },
      ],
    },
  ]

  const categorized = previewGroups
    .map(({ label, items }) => {
      const resolvedItems = items
        .map((item) => {
          const component = componentRegistry.getComponent(item.componentId)
          if (!component) return null

          const haystack = [item.label, component.name, component.description, component.category, component.type, component.id].join(' ').toLowerCase()
          if (normalizedQuery && !haystack.includes(normalizedQuery)) {
            return null
          }

          return { ...item, component }
        })
        .filter((item): item is PreviewLibraryItem & { component: ComponentDefinition } => Boolean(item))

      return { label, items: resolvedItems }
    })
    .filter((group) => group.items.length > 0)

  return (
    <div className="flex flex-col">
      {categorized.map((group) => (
        <CategoryDroppable key={group.label} category={group.label.toLowerCase()} items={group.items} displayName={group.label} onComponentSelect={onComponentSelect} />
      ))}
    </div>
  )
}

function CategoryDroppable({
  category,
  items,
  displayName,
  onComponentSelect,
}: {
  category: string
  items: Array<PreviewLibraryItem & { component: ComponentDefinition }>
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
      <div className="comp-category cat">{displayName}</div>
      <div className="comp-grid cgrid">
        {items.map((item, index) => (
          <ComponentCard
            key={item.component.id}
            component={item.component}
            index={index}
            displayName={item.label}
            glyphKey={item.glyphKey}
            onClick={() => onComponentSelect?.(item.component)}
          />
        ))}
      </div>
    </div>
  )
}
