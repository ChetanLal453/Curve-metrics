import { notFound } from 'next/navigation'
import React from 'react'
import { componentRegistry } from '@/lib/componentRegistry'

interface Container {
  id: string
  rows: Row[]
}

interface Row {
  id: string
  columns: Column[]
}

interface Column {
  id: string
  width?: number
  components: LayoutComponent[]
}

interface LayoutComponent {
  id: string
  type: string
  label: string
  props?: Record<string, any>
}

async function getPageLayout(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/get-page-layout?slug=${slug}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.success ? data.layout : null
  } catch (error) {
    console.error('Error fetching page layout:', error)
    return null
  }
}

function renderComponent(component: LayoutComponent) {
  const renderer = componentRegistry.getComponentRenderer(component.type)

  if (!renderer) {
    return React.createElement('div', {
      key: component.id,
      style: { padding: '20px', border: '1px solid red', backgroundColor: '#fee' }
    }, `Component type "${component.type}" not found`)
  }

  try {
    return React.createElement('div', { key: component.id }, renderer(component.props || {}))
  } catch (error) {
    console.error(`Error rendering component ${component.type}:`, error)
    return React.createElement('div', {
      key: component.id,
      style: { padding: '20px', border: '1px solid red', backgroundColor: '#fee' }
    }, `Error rendering ${component.type}`)
  }
}

function renderColumn(column: Column) {
  return React.createElement('div', {
    key: column.id,
    style: {
      flex: column.width ? `0 0 ${column.width}%` : 1,
      padding: '0 10px'
    }
  }, column.components.map(renderComponent))
}

function renderRow(row: Row) {
  return React.createElement('div', {
    key: row.id,
    style: {
      display: 'flex',
      marginBottom: '20px'
    }
  }, row.columns.map(renderColumn))
}

function renderContainer(container: Container) {
  return React.createElement('div', {
    key: container.id,
    style: {
      marginBottom: '40px'
    }
  }, container.rows.map(renderRow))
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const layout = await getPageLayout(params.slug)

  if (!layout) {
    notFound()
  }

  // If layout is an array of containers (PageBuilder format)
  if (Array.isArray(layout)) {
    return React.createElement('div', {
      style: {
        minHeight: '100vh',
        padding: '20px'
      }
    }, layout.map(renderContainer))
  }

  // Fallback for other layout formats
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      padding: '20px'
    }
  }, React.createElement('pre', null, JSON.stringify(layout, null, 2)))
}

export async function generateStaticParams() {
  // In a real app, you'd fetch all page slugs here
  // For now, return empty array to generate pages on-demand
  return []
}
