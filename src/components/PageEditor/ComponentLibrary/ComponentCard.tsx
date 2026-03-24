'use client'

import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { ComponentDefinition } from '@/types/page-editor'

interface ComponentCardProps {
  component: ComponentDefinition
  index: number
  onClick?: () => void
}

const iconMap: Record<string, React.ReactNode> = {
  section: <path d="M2 4h12M2 8h12M2 12h12" strokeLinecap="round" />,
  container: <rect x="2" y="2" width="12" height="12" rx="1.5" />,
  grid: (
    <>
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </>
  ),
  form: (
    <>
      <rect x="2" y="3" width="12" height="3" rx="1" />
      <rect x="2" y="8" width="12" height="3" rx="1" />
      <rect x="2" y="13" width="8" height="1" rx="0.5" />
    </>
  ),
  text: (
    <>
      <path d="M3 4h10" strokeLinecap="round" />
      <path d="M8 4v8" strokeLinecap="round" />
      <path d="M5 12h6" strokeLinecap="round" />
    </>
  ),
  media: (
    <>
      <rect x="2" y="3" width="12" height="10" rx="1.5" />
      <path d="M4 10l2.5-2.5L9 10l1.5-1.5L14 12" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5.5" cy="6" r="1" />
    </>
  ),
  button: (
    <>
      <rect x="2" y="5" width="12" height="6" rx="3" />
      <path d="M6 8h4" strokeLinecap="round" />
    </>
  ),
}

const getGlyph = (component: ComponentDefinition) => {
  const value = String(component.icon || '').toLowerCase()

  if (value.includes('grid')) return iconMap.grid
  if (value.includes('form')) return iconMap.form
  if (value.includes('image') || value.includes('media') || value.includes('photo')) return iconMap.media
  if (value.includes('button')) return iconMap.button
  if (value.includes('text') || value.includes('heading') || value.includes('paragraph')) return iconMap.text
  if (value.includes('container') || value.includes('section')) return iconMap.container

  return iconMap.section
}

export const ComponentCard: React.FC<ComponentCardProps> = ({ component, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `component:${component.id}`,
    data: {
      type: 'component',
      component,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      draggable="true"
      className={`cc ${isDragging ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      <div className="cc-i">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          {getGlyph(component)}
        </svg>
      </div>
      <div className="cc-n">{component.name}</div>
      <div className="cc-d">{component.description || component.category}</div>
    </div>
  )
}
