import { useCallback, useRef } from 'react'
import { PageLayout, Section, LayoutComponent, ComponentDefinition } from '@/types/page-editor'
import { DropResult } from '@hello-pangea/dnd'
import { componentRegistry } from '@/lib/componentRegistry'

export const useLayoutActions = (
  layout: PageLayout,
  setLayout: (layout: PageLayout | ((prev: PageLayout) => PageLayout)) => void
) => {
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const getAllComponents = useCallback(() => {
    const components: Array<{ component: LayoutComponent; context: { sectionId: string; containerId: string; rowId: string; colId: string } }> = []
    layout.sections.forEach(section => {
      section.container.rows.forEach(row => {
        row.columns.forEach(column => {
          column.components.forEach(component => {
            components.push({
              component,
              context: {
                sectionId: section.id,
                containerId: section.container.id,
                rowId: row.id,
                colId: column.id
              }
            })
          })
        })
      })
    })
    return components
  }, [layout.sections])

  const handleComponentMove = useCallback((result: DropResult, draggedItem: any) => {
    if (!result.destination) return

    setLayout(prevLayout => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout))
      const allComponents = getAllComponents().map(item => item.component)
      const [removed] = allComponents.splice(result.source.index, 1)
      allComponents.splice(result.destination!.index, 0, removed)
      // Put all components back into the first section's first row's first column
      if (newLayout.sections.length === 0) {
        newLayout.sections.push({
          id: 'section-1',
          name: 'Section 1',
          type: 'custom',
          container: {
            id: 'container-1',
            rows: [{
              id: 'row-1',
              columns: [{
                id: 'col-1',
                components: allComponents
              }]
            }]
          }
        })
      } else {
        newLayout.sections[0].container.rows[0].columns[0].components = allComponents
      }
      return newLayout
    })
  }, [getAllComponents, setLayout])

  const handleSectionMove = useCallback((result: DropResult, draggedItem: any) => {
    if (!result.destination) return

    setLayout(prevLayout => {
      const newSections = [...prevLayout.sections]
      const [removed] = newSections.splice(result.source.index, 1)
      newSections.splice(result.destination!.index, 0, removed)
      return {
        ...prevLayout,
        sections: newSections
      }
    })
  }, [setLayout])

  const handleTemplateDrop = useCallback((result: DropResult, draggedItem: any) => {
    console.log('Dropping template:', draggedItem, result)
  }, [])

  const handleDragEnd = useCallback((result: DropResult, draggedItem: any) => {
    if (!result.destination) return

    const { draggableId, destination } = result

    // Handle component from library
    if (draggableId.startsWith('component-lib:')) {
      const componentId = draggableId.split(':')[1]
      const componentDef = componentRegistry.getComponent(componentId)
      if (!componentDef) return

      // Parse destination: column:sectionId:containerId:rowId:colId
      const destParts = destination.droppableId.split(':')
      if (destParts[0] !== 'column') return

      const [_, sectionId, containerId, rowId, colId] = destParts

      setLayout(prevLayout => {
        const newLayout = JSON.parse(JSON.stringify(prevLayout))

        // Find the section
        const section = newLayout.sections.find((s: Section) => s.id === sectionId)
        if (!section) return prevLayout

        // Find the row
        const row = section.container.rows.find((r: any) => r.id === rowId)
        if (!row) return prevLayout

        // Find the column
        const column = row.columns.find((c: any) => c.id === colId)
        if (!column) return prevLayout

        // Create new component
        const newComponent: LayoutComponent = {
          id: `${componentDef.type}-${Date.now()}`,
          type: componentDef.type,
          label: componentDef.name,
          props: { ...componentDef.defaultProps }
        }

        // Add to column
        column.components.splice(destination.index, 0, newComponent)

        return newLayout
      })
    }
    // Handle different drag operations
    else if (draggedItem?.type === 'component') {
      handleComponentMove(result, draggedItem)
    } else if (draggedItem?.type === 'section') {
      handleSectionMove(result, draggedItem)
    } else if (draggedItem?.type === 'template') {
      handleTemplateDrop(result, draggedItem)
    }
  }, [setLayout])

  const handleComponentUpdate = useCallback((componentId: string, props: Record<string, any>) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Set new timeout for debounced update
    debounceTimeoutRef.current = setTimeout(() => {
      setLayout(prevLayout => {
        const newLayout = JSON.parse(JSON.stringify(prevLayout)) // Deep copy
        // Traverse sections, containers, rows, columns to find and update component
        for (const section of newLayout.sections) {
          for (const row of section.container.rows) {
            for (const column of row.columns) {
              const component = column.components.find((c: LayoutComponent) => c.id === componentId)
              if (component) {
                component.props = { ...component.props, ...props }
                break
              }
            }
          }
        }
        console.log('Update component:', componentId, props)
        return newLayout
      })
    }, 300) // 300ms debounce delay
  }, [setLayout])

  const handleAddSection = useCallback(() => {
    setLayout(prevLayout => {
      const timestamp = Date.now()
      const newSection: Section = {
        id: `section-${timestamp}`,
        name: 'New Section',
        type: 'custom',
        container: {
          id: `container-${timestamp}`,
          rows: []
        }
      }

      return {
        ...prevLayout,
        sections: [newSection, ...prevLayout.sections]
      }
    })
  }, [setLayout])

  const handleSetSectionRows = useCallback((sectionId: string, numRows: number) => {
    setLayout(prevLayout => {
      const sectionIndex = prevLayout.sections.findIndex((s: Section) => s.id === sectionId)
      if (sectionIndex === -1) return prevLayout

      const section = prevLayout.sections[sectionIndex]

      const rows = []
      for (let i = 0; i < numRows; i++) {
        rows.push({
          id: `row-${Date.now()}-${i}`,
          columns: [
            {
              id: `col-${Date.now()}-${i}`,
              width: 100,
              components: []
            }
          ]
        })
      }

      const updatedSection = {
        ...section,
        container: {
          ...section.container,
          rows
        }
      }

      const newSections = [...prevLayout.sections]
      newSections[sectionIndex] = updatedSection

      return {
        ...prevLayout,
        sections: newSections
      }
    })
  }, [setLayout])

  const handleSetSectionColumns = useCallback((sectionId: string, numColumns: number) => {
    setLayout(prevLayout => {
      const sectionIndex = prevLayout.sections.findIndex((s: Section) => s.id === sectionId)
      if (sectionIndex === -1) return prevLayout

      const section = prevLayout.sections[sectionIndex]

      const columns = []
      for (let i = 0; i < numColumns; i++) {
        columns.push({
          id: `col-${Date.now()}-${i}`,
          width: 100 / numColumns,
          components: []
        })
      }

      const newRow = {
        id: `row-${Date.now()}`,
        columns
      }

      const updatedSection = {
        ...section,
        container: {
          ...section.container,
          rows: [newRow]
        }
      }

      const newSections = [...prevLayout.sections]
      newSections[sectionIndex] = updatedSection

      return {
        ...prevLayout,
        sections: newSections
      }
    })
  }, [setLayout])

  const handleComponentAdd = useCallback((componentDef: ComponentDefinition) => {
    setLayout(prevLayout => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout)) // Deep copy

      // Create new component instance
      const newComponent: LayoutComponent = {
        id: `${componentDef.type}-${Date.now()}`,
        type: componentDef.type,
        label: componentDef.name,
        props: { ...componentDef.defaultProps }
      }

      // Add to the first available column in the first section
      if (newLayout.sections.length === 0) {
        // Create a new section if none exists
        const newSection: Section = {
          id: `section-${Date.now()}`,
          name: 'New Section',
          type: 'custom',
          container: {
            id: `container-${Date.now()}`,
            rows: [
              {
                id: `row-${Date.now()}`,
                columns: [
                  {
                    id: `col-${Date.now()}`,
                    width: 100,
                    components: [newComponent]
                  }
                ]
              }
            ]
          }
        }
        newLayout.sections = [newSection]
      } else {
        // Add to existing section
        const firstSection = newLayout.sections[0]
        if (firstSection.container.rows.length === 0) {
          // Create a new row if none exists
          firstSection.container.rows = [
            {
              id: `row-${Date.now()}`,
              columns: [
                {
                  id: `col-${Date.now()}`,
                  width: 100,
                  components: [newComponent]
                }
              ]
            }
          ]
        } else {
          // Add to first column of first row
          const firstRow = firstSection.container.rows[0]
          if (firstRow.columns.length === 0) {
            firstRow.columns = [
              {
                id: `col-${Date.now()}`,
                width: 100,
                components: [newComponent]
              }
            ]
          } else {
            firstRow.columns[0].components.push(newComponent)
          }
        }
      }

      return newLayout
    })
  }, [setLayout])

  const handleSectionDelete = useCallback((sectionId: string) => {
    setLayout(prevLayout => ({
      ...prevLayout,
      sections: prevLayout.sections.filter(section => section.id !== sectionId)
    }))
  }, [setLayout])

  const handleComponentDelete = useCallback((componentId: string) => {
    setLayout(prevLayout => {
      const newSections = prevLayout.sections.map(section => ({
        ...section,
        container: {
          ...section.container,
          rows: section.container.rows.map(row => ({
            ...row,
            columns: row.columns.map(column => ({
              ...column,
              components: column.components.filter(c => c.id !== componentId)
            }))
          }))
        }
      }))
      return {
        ...prevLayout,
        sections: newSections
      }
    })
  }, [setLayout])

  const handleColumnDelete = useCallback((sectionId: string, containerId: string, rowId: string, colId: string) => {
    setLayout(prevLayout => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout))
      // Find the section
      const section = newLayout.sections.find((s: Section) => s.id === sectionId)
      if (!section) return prevLayout

      // Find the row
      const row = section.container.rows.find((r: any) => r.id === rowId)
      if (!row) return prevLayout

      // Remove the column
      row.columns = row.columns.filter((c: any) => c.id !== colId)

      // If no columns left, perhaps remove the row or something, but for now, leave it
      return newLayout
    })
  }, [setLayout])

  return {
    handleDragEnd,
    handleComponentUpdate,
    handleAddSection,
    handleSetSectionRows,
    handleSetSectionColumns,
    handleComponentAdd,
    handleSectionDelete,
    handleComponentDelete,
    handleColumnDelete
  }
}
