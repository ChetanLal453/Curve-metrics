import React from 'react'
import { componentRegistry } from '@/lib/componentRegistry'
import { renderRegisteredSection } from '@/lib/sectionRegistry'

interface LayoutComponent {
  id: string
  type: string
  label?: string
  props?: Record<string, any>
}

interface Column {
  id: string
  width?: number
  components: LayoutComponent[]
}

interface Row {
  id: string
  columns: Column[]
}

interface Section {
  id: string
  type: string
  name?: string
  props?: Record<string, any>
  container?: {
    id: string
    rows: Row[]
  }
}

interface PageRendererProps {
  layout: {
    sections?: Section[]
  } | null
}

function renderComponent(component: LayoutComponent) {
  const renderer = componentRegistry.getComponentRenderer(component.type)

  if (!renderer) {
    return (
      <div key={component.id} style={{ padding: '20px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
        Component type "{component.type}" not found
      </div>
    )
  }

  try {
    return <div key={component.id}>{renderer(component.props || {})}</div>
  } catch (error) {
    console.error(`Error rendering component ${component.type}:`, error)
    return (
      <div key={component.id} style={{ padding: '20px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
        Error rendering {component.type}
      </div>
    )
  }
}

function renderSection(section: Section, index: number) {
  const isDynamicSection = Boolean(section?.type && section.type !== 'custom')

  if (isDynamicSection) {
    return (
      <div key={section.id || `section-${index + 1}`} className="mb-6">
        {renderRegisteredSection(section)}
      </div>
    )
  }

  return (
    <section key={section.id || `section-${index + 1}`} className="mb-10">
      {(section.container?.rows || []).map((row) => (
        <div
          key={row.id}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${row.columns?.length || 1}, minmax(0, 1fr))`,
            gap: '24px',
            marginBottom: '24px',
          }}>
          {(row.columns || []).map((column) => (
            <div key={column.id} style={{ width: '100%' }}>
              {(column.components || []).map(renderComponent)}
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}

export function PageRenderer({ layout }: PageRendererProps) {
  const sections = Array.isArray(layout?.sections) ? layout.sections : []

  if (!sections.length) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        No content available.
      </div>
    )
  }

  return <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6">{sections.map(renderSection)}</div>
}
