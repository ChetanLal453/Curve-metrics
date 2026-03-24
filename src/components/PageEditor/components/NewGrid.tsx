'use client'

import React, { useEffect, useRef, useMemo, useCallback, useState, memo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { LayoutComponent } from '@/types/page-editor'
import { DynamicComponent } from '../DynamicComponent'
import { ComponentWrapper } from './ComponentWrapper'
import { Edit, Trash2 } from 'lucide-react'
import { useStableComponentsArray } from '../hooks/useStableComponentsArray'

interface GridCellProps {
  rowIndex: number
  colIndex: number
  cellIndex: number
  droppableId: string
  component: LayoutComponent | null
  onComponentSelect?: (component: LayoutComponent, context: GridComponentContext) => void
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void
  sectionId?: string
  containerId?: string
  rowId?: string
  colId?: string
  carouselId?: string
  slideIndex?: number
  setSelectedComponent?: (component: { sectionId: string; compId: string; component: LayoutComponent }) => void
  deleteComponent?: (componentId: string, context?: any) => void
  parentGridId?: string
  onDeleteChildComponent?: (componentId: string, context?: any) => void
}

interface GridComponentContext {
  sectionId: string
  containerId: string
  rowId: string
  colId: string
  carouselId?: string
  slideIndex?: number
  source?: 'grid-cell' | 'carousel-direct' | 'slide'
  isNestedSelection?: boolean
  parentComponentId?: string
  parentGridId?: string
  gridId?: string
  cellRow?: number
  cellCol?: number
}

interface SelectedComponentInfo {
  sectionId: string
  compId: string
  component: LayoutComponent
}

interface NewGridComponentProps {
  columns?: number
  rows?: number
  gap?: number | string
  padding?: number | string
  margin?: number | string
  children?: React.ReactNode
  id?: string
  component?: LayoutComponent
  components?: (LayoutComponent | null)[]
  cells?: any[]
  onComponentsChange?: (newProps: Record<string, any>) => void
  onSelect?: () => void
  onComponentSelect?: (component: LayoutComponent, context: GridComponentContext) => void
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void
  layout?: any
  setLayout?: (layout: any) => void
  setSelectedComponent?: (component: SelectedComponentInfo) => void
  deleteComponent?: (componentId: string, context?: any) => void
  sectionId?: string
  containerId?: string
  rowId?: string
  colId?: string
  carouselId?: string
  slideIndex?: number
  onUpdate?: (newProps: Record<string, any>) => void
  parentComponentId?: string
  parentGridId?: string
  [key: string]: any
}

export const newGridDefaultProps = {
  columns: 3,
  rows: 1,
  gap: 16,
  padding: 8,
  margin: 8,
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: 0,
  gridLineColor: '#e5e7eb',
  justifyContent: 'stretch',
  alignItems: 'stretch',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridAutoRows: 'minmax(100px, auto)',
  minHeight: '150px',
  mobileColumns: 1,
  tabletColumns: 2,
  desktopColumns: 3,
  hideOnMobile: false,
  hideOnTablet: false,
  draggable: true,
  resizable: false,
  showGridLines: true,
  snapToGrid: true,
  customCSS: '',
  className: '',
  id: '',
  dataAttributes: '{}',
  visible: true,
  gridTestFromComponent: 'YES FROM NEWGRID COMPONENT FILE',
}

export const newGridSchema = {
  properties: {
    gridTestFromComponent: {
      type: 'text',
      label: 'Grid Test (FROM COMPONENT)',
      default: newGridDefaultProps.gridTestFromComponent,
      category: 'Advanced',
      description: 'This proves schema comes from component file!',
    },
    columns: {
      type: 'number',
      label: 'Columns',
      default: newGridDefaultProps.columns,
      min: 1,
      max: 12,
      step: 1,
      category: 'Layout',
      description: 'Number of columns in the grid',
    },
    rows: {
      type: 'number',
      label: 'Rows',
      default: newGridDefaultProps.rows,
      min: 1,
      max: 24,
      step: 1,
      category: 'Layout',
      description: 'Number of rows in the grid',
    },
    gap: {
      type: 'number',
      label: 'Gap (px)',
      default: newGridDefaultProps.gap,
      min: 0,
      max: 100,
      step: 4,
      category: 'Layout',
      description: 'Space between grid cells',
    },
    padding: {
      type: 'number',
      label: 'Padding (px)',
      default: newGridDefaultProps.padding,
      min: 0,
      max: 100,
      step: 4,
      category: 'Layout',
    },
    margin: {
      type: 'number',
      label: 'Margin (px)',
      default: newGridDefaultProps.margin,
      min: 0,
      max: 100,
      step: 4,
      category: 'Layout',
    },
    backgroundColor: {
      type: 'color',
      label: 'Background Color',
      default: newGridDefaultProps.backgroundColor,
      category: 'Style',
    },
    border: {
      type: 'text',
      label: 'Border',
      default: newGridDefaultProps.border,
      category: 'Style',
      placeholder: '1px solid #e5e7eb',
    },
    borderRadius: {
      type: 'number',
      label: 'Border Radius (px)',
      default: newGridDefaultProps.borderRadius,
      min: 0,
      max: 50,
      step: 1,
      category: 'Style',
    },
    gridLineColor: {
      type: 'color',
      label: 'Grid Line Color',
      default: newGridDefaultProps.gridLineColor,
      category: 'Style',
    },
    justifyContent: {
      type: 'select',
      label: 'Justify Content',
      default: newGridDefaultProps.justifyContent,
      options: [
        { value: 'stretch', label: 'Stretch' },
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'space-between', label: 'Space Between' },
        { value: 'space-around', label: 'Space Around' },
        { value: 'space-evenly', label: 'Space Evenly' },
      ],
      category: 'Alignment',
    },
    alignItems: {
      type: 'select',
      label: 'Align Items',
      default: newGridDefaultProps.alignItems,
      options: [
        { value: 'stretch', label: 'Stretch' },
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'baseline', label: 'Baseline' },
      ],
      category: 'Alignment',
    },
    mobileColumns: {
      type: 'number',
      label: 'Mobile Columns',
      default: newGridDefaultProps.mobileColumns,
      min: 1,
      max: 4,
      step: 1,
      category: 'Responsive',
    },
    tabletColumns: {
      type: 'number',
      label: 'Tablet Columns',
      default: newGridDefaultProps.tabletColumns,
      min: 1,
      max: 6,
      step: 1,
      category: 'Responsive',
    },
    desktopColumns: {
      type: 'number',
      label: 'Desktop Columns',
      default: newGridDefaultProps.desktopColumns,
      min: 1,
      max: 12,
      step: 1,
      category: 'Responsive',
    },
    hideOnMobile: {
      type: 'toggle',
      label: 'Hide on Mobile',
      default: newGridDefaultProps.hideOnMobile,
      category: 'Responsive',
    },
    hideOnTablet: {
      type: 'toggle',
      label: 'Hide on Tablet',
      default: newGridDefaultProps.hideOnTablet,
      category: 'Responsive',
    },
    draggable: {
      type: 'toggle',
      label: 'Draggable Cells',
      default: newGridDefaultProps.draggable,
      category: 'Behavior',
    },
    resizable: {
      type: 'toggle',
      label: 'Resizable Cells',
      default: newGridDefaultProps.resizable,
      category: 'Behavior',
    },
    showGridLines: {
      type: 'toggle',
      label: 'Show Grid Lines',
      default: newGridDefaultProps.showGridLines,
      category: 'Behavior',
    },
    snapToGrid: {
      type: 'toggle',
      label: 'Snap to Grid',
      default: newGridDefaultProps.snapToGrid,
      category: 'Behavior',
    },
    visible: {
      type: 'toggle',
      label: 'Visible',
      default: newGridDefaultProps.visible,
      category: 'Behavior',
    },
    customCSS: {
      type: 'textarea',
      label: 'Custom CSS',
      default: newGridDefaultProps.customCSS,
      category: 'Advanced',
      placeholder: 'Enter custom CSS here...',
    },
    className: {
      type: 'text',
      label: 'CSS Class',
      default: newGridDefaultProps.className,
      category: 'Advanced',
    },
    id: {
      type: 'text',
      label: 'HTML ID',
      default: newGridDefaultProps.id,
      category: 'Advanced',
    },
    dataAttributes: {
      type: 'textarea',
      label: 'Data Attributes (JSON)',
      default: newGridDefaultProps.dataAttributes,
      category: 'Advanced',
      placeholder: '{"data-custom": "value"}',
    },
    cells: {
      type: 'grid-cells',
      label: 'Grid Cells',
      default: [],
      category: 'Content',
      description: 'Manage components in grid cells',
    },
    components: {
      type: 'component-list',
      label: 'Components',
      default: [],
      category: 'Content',
      description: 'List of components in the grid',
    },
  },
} as any

const SortableGridCell: React.FC<{
  component: LayoutComponent | null
  draggableId: string
  context: GridComponentContext
  onComponentSelect?: (component: LayoutComponent, context: GridComponentContext) => void
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void
  setSelectedComponent?: (component: { sectionId: string; compId: string; component: LayoutComponent }) => void
  deleteComponent?: (componentId: string, context?: any) => void
  onDeleteChildComponent?: (componentId: string, context?: any) => void
  children: React.ReactNode
}> = ({
  component,
  draggableId,
  context,
  onComponentSelect,
  onComponentUpdate,
  setSelectedComponent,
  deleteComponent,
  onDeleteChildComponent,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: draggableId })

  const style = {
    ...(transform
      ? {
          transform: CSS.Transform.toString(transform),
          transition,
        }
      : {}),
    opacity: isDragging ? 0.5 : 1,
    width: '100%',
    height: '100%',
    pointerEvents: 'auto' as const,
  }

  const handleDeleteComponent = useCallback(
    (componentId: string, nestedContext?: any) => {
      if (component) {
        const mergedContext = {
          ...context,
          ...nestedContext,
          parentGridId: context.parentGridId,
          source: 'grid-cell' as const,
          gridId: context.parentGridId,
        }

        if (onDeleteChildComponent) {
          onDeleteChildComponent(componentId, mergedContext)
        } else if (deleteComponent) {
          deleteComponent(componentId, mergedContext)
        }
      }
    },
    [deleteComponent, onDeleteChildComponent, context, component],
  )

  const handleChildUpdate = useCallback(
    (componentId: string, newProps: Record<string, any>) => {
      if (onComponentUpdate) {
        onComponentUpdate(componentId, newProps)
      }
    },
    [onComponentUpdate],
  )

  // ✅ FIXED: Edit handler that works with ComponentWrapper's onEdit prop
  const handleEditClick = useCallback(() => {
    console.log('🔘 SortableGridCell: Edit button clicked for component:', {
      componentId: component?.id,
      componentType: component?.type,
      context,
      hasOnComponentSelect: !!onComponentSelect,
      timestamp: new Date().toISOString(),
      stackTrace: new Error().stack,
    })

     if (!onComponentSelect) {
    console.error('❌❌❌ SortableGridCell DEBUG: onComponentSelect is undefined!', {
      component,
      context,
      parentProps: {
        draggableId,
        hasComponent: !!component,
      },
      // Check where this function is coming from
      functionSource: 'SortableGridCell.handleEditClick',
    })
  }

    if (component && onComponentSelect) {
      // ✅ CRITICAL: Pass ALL context properties
      onComponentSelect(component, {
        sectionId: context.sectionId,
        containerId: context.containerId,
        rowId: context.rowId,
        colId: context.colId,
        carouselId: context.carouselId,
        slideIndex: context.slideIndex,
        gridId: context.gridId || context.parentGridId,
        cellRow: context.cellRow,
        cellCol: context.cellCol,
        source: 'grid-cell' as const,
        isNestedSelection: true,
        parentComponentId: context.parentComponentId,
        parentGridId: context.parentGridId,
      })
    } else {
      console.error('❌ SortableGridCell: Missing component or onComponentSelect')
    }
  }, [component, onComponentSelect, context, draggableId])

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {component ? (
        <ComponentWrapper
          onEdit={handleEditClick}
          isGridLevel={false}
          sectionId={context.sectionId}
          containerId={context.containerId}
          rowId={context.rowId}
          colId={context.colId}
          component={component}
          deleteComponent={handleDeleteComponent}
          carouselId={context.carouselId}
          slideIndex={context.slideIndex}
          gridId={context.gridId || context.parentGridId}
          cellRow={context.cellRow}
          cellCol={context.cellCol}
          parentGridId={context.parentGridId}
          // ✅✅✅ CRITICAL: Pass onComponentSelect to ComponentWrapper
          onComponentSelect={onComponentSelect}
        >
          <DynamicComponent
            component={component}
            isSelected={false}
            onSelect={() => {
              if (onComponentSelect) {
                onComponentSelect(component, {
                  sectionId: context.sectionId,
                  containerId: context.containerId,
                  rowId: context.rowId,
                  colId: context.colId,
                  carouselId: context.carouselId,
                  slideIndex: context.slideIndex,
                  gridId: context.gridId || context.parentGridId,
                  cellRow: context.cellRow,
                  cellCol: context.cellCol,
                  source: 'grid-cell' as const,
                  isNestedSelection: true,
                  parentComponentId: context.parentComponentId,
                  parentGridId: context.parentGridId,
                })
              }
            }}
            onUpdate={(newProps) => {
              handleChildUpdate(component.id, newProps)
            }}
            onComponentSelect={onComponentSelect}
            onComponentUpdate={handleChildUpdate}
            setSelectedComponent={setSelectedComponent}
            deleteComponent={handleDeleteComponent}
            onDelete={handleDeleteComponent}
            sectionId={context.sectionId}
            containerId={context.containerId}
            rowId={context.rowId}
            colId={context.colId}
            carouselId={context.carouselId}
            slideIndex={context.slideIndex}
            parentGridId={context.parentGridId}
            gridId={context.gridId || context.parentGridId}
            cellRow={context.cellRow}
            cellCol={context.cellCol}
          />
        </ComponentWrapper>
      ) : (
        children
      )}
    </div>
  )
}

const GridCell = memo(
  ({
    rowIndex,
    colIndex,
    cellIndex,
    droppableId,
    component,
    onComponentSelect,
    onComponentUpdate,
    sectionId,
    containerId,
    rowId,
    colId,
    carouselId,
    slideIndex,
    setSelectedComponent,
    deleteComponent,
    parentGridId,
    onDeleteChildComponent,
  }: GridCellProps) => {
    const isInsideCarousel = !!carouselId

    const { setNodeRef, isOver } = useDroppable({
      id: droppableId,
    })

    const gridCellContext = useMemo(
      (): GridComponentContext => ({
        sectionId: sectionId || '',
        containerId: containerId || '',
        rowId: rowId || `slide-${slideIndex}` || `grid-row-${rowIndex}`,
        colId: colId || `grid-cell-${rowIndex}-${colIndex}`,
        carouselId: carouselId,
        slideIndex: slideIndex,
        source: 'grid-cell' as const,
        isNestedSelection: true,
        parentComponentId: containerId,
        parentGridId: parentGridId,
        gridId: parentGridId,
        cellRow: rowIndex,
        cellCol: colIndex,
      }),
      [sectionId, containerId, rowId, slideIndex, rowIndex, colId, colIndex, carouselId, parentGridId],
    )

    const draggableId = useMemo(
      () =>
        carouselId
          ? `component:${component?.id || 'empty'}:grid:${parentGridId || containerId}:${rowIndex}:${colIndex}:carousel-${carouselId}:slide-${slideIndex}`
          : `component:${component?.id || 'empty'}:grid:${parentGridId || containerId}:${rowIndex}:${colIndex}`,
      [component?.id, carouselId, containerId, rowIndex, colIndex, slideIndex, parentGridId],
    )

    const cellStyle = useMemo((): React.CSSProperties => {
      const baseStyle = {
        border: '2px dashed #d1d5db',
        borderRadius: '6px',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b7280',
        fontSize: '14px',
        transition: 'all 0.2s ease-in-out',
        padding: '8px',
        boxSizing: 'border-box' as const,
        position: 'relative' as const,
        pointerEvents: 'auto' as const,
        cursor: 'pointer',
        backgroundColor: '#f9fafb',
      }

      return isOver
        ? {
            ...baseStyle,
            border: '2px dashed #3b82f6',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
          }
        : baseStyle
    }, [isOver])

    const handleDelete = useCallback(
      (componentId: string, nestedContext?: any) => {
        const mergedContext = {
          ...gridCellContext,
          ...nestedContext,
          parentGridId: parentGridId,
          source: 'grid-cell' as const,
          gridId: parentGridId,
        }

        if (onDeleteChildComponent) {
          onDeleteChildComponent(componentId, mergedContext)
        }
      },
      [onDeleteChildComponent, gridCellContext, parentGridId],
    )

    return (
      <div
        ref={setNodeRef}
        style={{
          ...cellStyle,
          backgroundColor: component ? '#e0f2fe' : '#f9fafb',
          border: component ? '2px solid #0ea5e9' : cellStyle.border,
          maxWidth: '100%', // ✅ ADD THIS
          overflow: 'hidden', // ✅ ADD THIS
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
        data-inside-carousel={isInsideCarousel}
        data-carousel-id={carouselId}
        data-slide-index={slideIndex}
        data-cell-index={cellIndex}
        data-row-index={rowIndex}
        data-col-index={colIndex}
        data-dragging-over={isOver}
        className={`grid-cell ${isOver ? 'drag-over-active' : ''}`}>
        <SortableGridCell
          component={component}
          draggableId={draggableId}
          context={gridCellContext}
          onComponentSelect={onComponentSelect}
          onComponentUpdate={onComponentUpdate}
          setSelectedComponent={setSelectedComponent}
          deleteComponent={deleteComponent}
          onDeleteChildComponent={handleDelete}>
          {component ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isOver ? '#1e40af' : '#6b7280',
                fontWeight: 'normal',
                fontSize: '14px',
                pointerEvents: 'none',
                textAlign: 'center',
                padding: '8px',
                opacity: isOver ? 0.7 : 1,
              }}>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: isOver ? '#1e40af' : '#6b7280',
                    fontWeight: isOver ? 'bold' : 'normal',
                  }}>
                  Component loaded ✓{isOver && ' 🔥'}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    opacity: 0.7,
                    marginTop: '2px',
                    color: isOver ? '#1e40af' : '#6b7280',
                  }}>
                  Row {rowIndex}, Col {colIndex}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isOver ? '#1e40af' : '#6b7280',
                fontWeight: 'normal',
                fontSize: '14px',
                pointerEvents: 'none',
                textAlign: 'center',
                padding: '8px',
                opacity: isOver ? 0.7 : 1,
              }}>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: isOver ? '#1e40af' : '#6b7280',
                    fontWeight: isOver ? 'bold' : 'normal',
                  }}>
                  Drop component here
                  {isOver && ' 🔥'}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    opacity: 0.7,
                    marginTop: '2px',
                    color: isOver ? '#1e40af' : '#6b7280',
                  }}>
                  Row {rowIndex}, Col {colIndex}
                </div>
              </div>
            </div>
          )}
        </SortableGridCell>
      </div>
    )
  },
)

GridCell.displayName = 'GridCell'

const NewGridComponent: React.FC<NewGridComponentProps> = ({
  columns = newGridDefaultProps.columns,
  rows = newGridDefaultProps.rows,
  gap = newGridDefaultProps.gap,
  padding = newGridDefaultProps.padding,
  margin = newGridDefaultProps.margin,
  children,
  id,
  components = [],
  cells = [],
  onComponentsChange,
  onSelect,
  onComponentSelect,
  onComponentUpdate,
  layout,
  setLayout,
  setSelectedComponent,
  deleteComponent,
  sectionId,
  containerId,
  rowId,
  colId,
  carouselId,
  slideIndex,
  component: propComponent,
  onUpdate,
  parentComponentId,
  parentGridId,
  ...props
}) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const componentProps = { ...newGridDefaultProps, ...props }

  const [localComponent, setLocalComponent] = useState(propComponent)
  const [childUpdateCount, setChildUpdateCount] = useState(0)
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now())

  useEffect(() => {
    console.log('🔄 NewGrid: Prop component updated:', {
      propComponentId: propComponent?.id,
      propComponentType: propComponent?.type,
      hasProps: !!propComponent?.props,
      hasCells: !!propComponent?.props?.cells,
      hasPropsCells: !!props.cells,
      carouselId,
      slideIndex,
    })

    if (propComponent) {
      setLocalComponent(propComponent)
    }
  }, [propComponent, carouselId, slideIndex, props.cells])

  const parsedRows = rows || localComponent?.props?.rows || 1
  const parsedColumns = columns || localComponent?.props?.columns || 3
  const parsedGap = Number(gap) || 16
  const parsedPadding = Number(padding) || 8
  const parsedMargin = Number(margin) || 8

  const currentComponentsCount = components.filter((c) => c !== null && c !== undefined && typeof c === 'object' && c.id && c.type).length

  const gridId = useMemo(() => {
    console.log('🔍 NewGrid: Determining grid ID:', {
      localComponentId: localComponent?.id,
      propId: id,
      componentId: propComponent?.id,
      propsId: props?.id,
      carouselId,
      slideIndex,
    })

    if (propComponent?.id) {
      console.log('✅ Using propComponent ID:', propComponent.id)
      return propComponent.id
    }

    if (localComponent?.id) {
      console.log('✅ Using localComponent ID:', localComponent.id)
      return localComponent.id
    }

    if (props?.id) {
      console.log('✅ Using props ID:', props.id)
      return props.id
    }

    if (id) {
      console.log('✅ Using prop ID:', id)
      return id
    }

    const fallbackId = carouselId
      ? `grid-${carouselId}-slide-${slideIndex}-${Date.now()}`
      : `NewGrid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    console.log('🔧 Generated fallback grid ID:', fallbackId)
    return fallbackId
  }, [localComponent?.id, id, propComponent?.id, props?.id, carouselId, slideIndex])

  const gridComponents = useStableComponentsArray(components, parsedColumns, parsedRows)

  useEffect(() => {
    console.log('🎯 NewGrid Component Debug:', {
      gridId,
      carouselId,
      slideIndex,
      hasLocalComponent: !!localComponent,
      localComponentCells: localComponent?.props?.cells?.map((row: any[]) =>
        row.map((cell) => ({
          hasComponent: !!cell?.component,
          componentId: cell?.component?.id,
        })),
      ),
      hasPropComponent: !!propComponent,
      propComponentCells: propComponent?.props?.cells?.map((row: any[]) =>
        row.map((cell) => ({
          hasComponent: !!cell?.component,
          componentId: cell?.component?.id,
        })),
      ),
      hasPropsCells: !!props.cells,
      propsCells: props.cells?.map((row: any[]) =>
        row?.map((cell) => ({
          hasComponent: !!cell?.component,
          componentId: cell?.component?.id,
        })),
      ),
      parsedRows,
      parsedColumns,
      gridComponentsLength: gridComponents?.length,
    })
  }, [gridId, localComponent, propComponent, parsedRows, parsedColumns, gridComponents, carouselId, slideIndex, props.cells])

  const handleComponentUpdate = useCallback(
    (componentId: string, newProps: Record<string, any>) => {
      console.log('🔄 NewGrid: handleComponentUpdate called:', {
        componentId,
        gridId,
        carouselId,
        slideIndex,
        isGridChild: componentId !== gridId,
      })

      if (componentId === gridId) {
        return
      }

      setChildUpdateCount((prev) => prev + 1)
      setLastUpdateTime(Date.now())

      let updatedComponent = null

      if (localComponent?.props?.cells) {
        const updatedCells = localComponent.props.cells.map((row: any) =>
          row.map((cell: any) => {
            if (cell?.component?.id === componentId) {
              return {
                ...cell,
                component: {
                  ...cell.component,
                  props: {
                    ...cell.component.props,
                    ...newProps,
                  },
                },
              }
            }
            return cell
          }),
        )

        updatedComponent = {
          ...localComponent,
          props: {
            ...localComponent.props,
            cells: updatedCells,
          },
        }
      } else {
        if (localComponent?.props?.components) {
          updatedComponent = {
            ...localComponent,
            props: {
              ...localComponent.props,
              components: localComponent.props.components.map((comp: any) =>
                comp?.id === componentId ? { ...comp, props: { ...comp.props, ...newProps } } : comp,
              ),
            },
          }
        }
      }

      if (updatedComponent) {
        console.log('✅ NewGrid: Updated local component with new props')
        setLocalComponent(updatedComponent)
      }

      if (onUpdate && updatedComponent) {
        console.log('📤 NewGrid: Calling onUpdate with new props')
        onUpdate(updatedComponent.props)
      }

      if (onComponentUpdate) {
        console.log('📤 NewGrid: Bubbling update to parent')
        onComponentUpdate(componentId, newProps)
      }
    },
    [localComponent, onUpdate, onComponentUpdate, gridId, parentGridId],
  )

  const handleComponentSelect = useCallback(
    (gridComponent: LayoutComponent, context: GridComponentContext) => {
      if (onComponentSelect) {
        onComponentSelect(gridComponent, context)
      }

      if (setSelectedComponent) {
        setSelectedComponent({
          sectionId: context.sectionId || sectionId || 'grid-section',
          compId: gridComponent.id,
          component: gridComponent,
        })
      }
    },
    [onComponentSelect, setSelectedComponent, sectionId],
  )

  const getComponentFromCell = useCallback(
    (rowIndex: number, colIndex: number): LayoutComponent | null => {
      console.log('🔍 NewGrid: getComponentFromCell called:', {
        rowIndex,
        colIndex,
        gridId,
        carouselId,
        slideIndex,
        hasLocalComponent: !!localComponent,
        hasPropComponent: !!propComponent,
        hasPropsCells: !!props.cells,
      })

      // First check direct props.cells (this is the most reliable source)
      if (props.cells && Array.isArray(props.cells)) {
        const row = props.cells[rowIndex]
        if (row && row[colIndex] && row[colIndex].component) {
          const comp = row[colIndex].component
          console.log('✅ Found component in direct props.cells:', {
            componentId: comp.id,
            type: comp.type,
            rowIndex,
            colIndex,
            source: 'direct-props',
          })
          return comp
        }
      }

      // Then check local component's cells
      if (localComponent?.props?.cells) {
        const row = localComponent.props.cells[rowIndex]
        if (row && row[colIndex] && row[colIndex].component) {
          const comp = row[colIndex].component
          console.log('✅ Found component in cells structure (localComponent):', {
            componentId: comp.id,
            type: comp.type,
            rowIndex,
            colIndex,
          })
          return comp
        }
      }

      // Then check prop component's cells
      if (propComponent?.props?.cells) {
        const row = propComponent.props.cells[rowIndex]
        if (row && row[colIndex] && row[colIndex].component) {
          const comp = row[colIndex].component
          console.log('✅ Found component in cells structure (propComponent):', {
            componentId: comp.id,
            type: comp.type,
            rowIndex,
            colIndex,
          })
          return comp
        }
      }

      // Fallback to gridComponents array (legacy support)
      const cellIndex = rowIndex * parsedColumns + colIndex
      const comp = gridComponents[cellIndex]
      if (comp) {
        console.log('✅ Found component in gridComponents:', comp)
        return comp
      }

      console.log('❌ No component found at:', { rowIndex, colIndex })
      return null
    },
    [localComponent?.props, propComponent?.props, gridComponents, parsedColumns, gridId, carouselId, slideIndex, props.cells],
  )

  useEffect(() => {
    if (localComponent && onUpdate && (!localComponent.props?.cells || localComponent.props.cells.length === 0)) {
      const newProps = { ...localComponent.props }

      if (!newProps.cells) {
        newProps.cells = Array.from({ length: parsedRows }, () =>
          Array.from({ length: parsedColumns }, () => ({
            component: null,
          })),
        )
      }

      if (newProps.cells.length !== parsedRows || (newProps.cells[0] && newProps.cells[0].length !== parsedColumns)) {
        const newCells = Array.from({ length: parsedRows }, (_, rowIdx) =>
          Array.from({ length: parsedColumns }, (_, colIdx) => {
            if (newProps.cells[rowIdx] && newProps.cells[rowIdx][colIdx]) {
              return newProps.cells[rowIdx][colIdx]
            }
            return { component: null }
          }),
        )
        newProps.cells = newCells
      }

      if (JSON.stringify(newProps.cells) !== JSON.stringify(localComponent.props?.cells)) {
        onUpdate(newProps)
      }
    }
  }, [localComponent, onUpdate, parsedRows, parsedColumns, gridId])

  const handleDeleteChildComponent = useCallback(
    (componentId: string, context?: any) => {
      let componentRemoved = false
      let updatedProps = localComponent?.props ? { ...localComponent.props } : {}

      if (localComponent?.props?.cells) {
        const updatedCells = localComponent.props.cells.map((row: any) =>
          row.map((cell: any) => {
            if (cell?.component?.id === componentId) {
              componentRemoved = true
              return {
                ...cell,
                component: null,
              }
            }
            return cell
          }),
        )

        if (componentRemoved) {
          updatedProps.cells = updatedCells
        }
      }

      if (!componentRemoved && localComponent?.props?.components) {
        const updatedComponents = localComponent.props.components.map((comp: any) => {
          if (comp?.id === componentId) {
            componentRemoved = true
            return null
          }
          return comp
        })

        if (componentRemoved) {
          updatedProps.components = updatedComponents
        }
      }

      if (componentRemoved && localComponent) {
        const newLocalComponent = {
          ...localComponent,
          props: updatedProps,
        }

        setLocalComponent(newLocalComponent)
        setChildUpdateCount((prev) => prev + 1)
        setLastUpdateTime(Date.now())

        if (onUpdate) {
          onUpdate(updatedProps)
        }
      }

      if (deleteComponent) {
        const enhancedContext = {
          ...context,
          parentGridId: gridId,
          parentComponentId: parentComponentId || containerId || gridId,
          source: 'grid-cell' as const,
          gridId: gridId,
          deletedFromGrid: componentRemoved,
        }

        deleteComponent(componentId, enhancedContext)
      }
    },
    [localComponent, onUpdate, deleteComponent, gridId, parentComponentId, containerId],
  )

  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (localComponent && sectionId && setSelectedComponent) {
        setSelectedComponent({
          sectionId,
          compId: gridId,
          component: localComponent,
        })
      }
    },
    [localComponent, sectionId, setSelectedComponent, gridId],
  )

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (deleteComponent) {
        deleteComponent(gridId, {
          sectionId,
          containerId,
          rowId,
          colId,
          carouselId,
          slideIndex,
          source: 'grid-direct',
          isNestedSelection: !!carouselId,
          parentComponentId: parentComponentId || containerId,
          gridId: gridId,
        })
      }
    },
    [deleteComponent, gridId, sectionId, containerId, rowId, colId, carouselId, slideIndex, parentComponentId],
  )

  const gridStyle = useMemo(
  (): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${parsedColumns}, 1fr)`,
    gridAutoRows: 'minmax(100px, auto)',
    gap: `${parsedGap}px`,
    padding: `${parsedPadding}px`,
    margin: `${parsedMargin}px`,
    width: '100%',
    maxWidth: '100%', // ✅ ADD THIS
    boxSizing: 'border-box' as const,
    position: 'relative',
    minHeight: '150px',
    background: componentProps.backgroundColor,
    border: componentProps.border,
    borderRadius: `${componentProps.borderRadius}px`,
    overflow: 'hidden', // ✅ ADD THIS to contain children
    ...(componentProps.customCSS ? JSON.parse(componentProps.customCSS || '{}') : {}),
  }),
  [parsedColumns, parsedGap, parsedPadding, parsedMargin, componentProps],
)

  const gridConfig = useMemo(
    () => ({
      rows: parsedRows,
      columns: parsedColumns,
      totalCells: parsedColumns * parsedRows,
    }),
    [parsedRows, parsedColumns],
  )

  const getDroppableId = useCallback(
    (rowIndex: number, colIndex: number): string => {
      const actualGridId = gridId || localComponent?.id || id

      if (!actualGridId) {
        console.error('❌ No grid ID available for droppableId')
        return `component:empty:grid:unknown:${rowIndex}:${colIndex}`
      }

      const baseId = `component:empty:grid:${actualGridId}:${rowIndex}:${colIndex}`

      if (carouselId && slideIndex !== undefined) {
        return `${baseId}:carousel-${carouselId}:slide-${slideIndex}`
      }

      return baseId
    },
    [gridId, localComponent?.id, id, carouselId, slideIndex],
  )

  const gridCells = useMemo(() => {
    console.log('🔄 NewGrid: Re-rendering gridCells - DEBUG:', {
      hasOnComponentSelect: !!onComponentSelect,
      onComponentSelectType: typeof onComponentSelect,
      gridId,
    });

    const cells = [];

    for (let rowIndex = 0; rowIndex < gridConfig.rows; rowIndex++) {
      for (let colIndex = 0; colIndex < gridConfig.columns; colIndex++) {
        const cellIndex = rowIndex * gridConfig.columns + colIndex;
        const droppableId = getDroppableId(rowIndex, colIndex);
        const cellComponent = getComponentFromCell(rowIndex, colIndex);

        cells.push(
          <GridCell
            key={`cell-${gridId}-${rowIndex}-${colIndex}`}
            rowIndex={rowIndex}
            colIndex={colIndex}
            cellIndex={cellIndex}
            droppableId={droppableId}
            component={cellComponent}
            // ✅✅✅ CRITICAL: Pass onComponentSelect FIXED HERE
            onComponentSelect={onComponentSelect}
            onComponentUpdate={onComponentUpdate}
            sectionId={sectionId}
            containerId={gridId}
            rowId={rowId || `slide-${slideIndex}`}
            colId={`grid-cell-${rowIndex}-${colIndex}`}
            carouselId={carouselId}
            slideIndex={slideIndex}
            setSelectedComponent={setSelectedComponent}
            deleteComponent={deleteComponent}
            onDeleteChildComponent={handleDeleteChildComponent}
            parentGridId={gridId}
          />
        );
      }
    }

    return cells;
  }, [
    gridConfig.rows,
    gridConfig.columns,
    getDroppableId,
    getComponentFromCell,
    gridId,
    // ✅✅✅ CRITICAL: onComponentSelect dependency add karo
    onComponentSelect,
    onComponentUpdate,
    sectionId,
    rowId,
    slideIndex,
    carouselId,
    setSelectedComponent,
    deleteComponent,
    handleDeleteChildComponent,
    localComponent?.props?.cells,
    propComponent?.props?.cells,
    props.cells,
    childUpdateCount,
    lastUpdateTime,
    components,
  ])

  if (componentProps.visible === false) {
    return null
  }

  return (
    <div
      ref={gridRef}
      style={gridStyle}
      className={`new-grid-container relative group ${componentProps.className || ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.()
      }}
      data-grid-container="true"
      data-grid-id={gridId}
      data-parent-component-id={parentComponentId}
      data-carousel-id={carouselId}
      data-slide-index={slideIndex}
      data-update-count={childUpdateCount}
      id={componentProps.id || gridId}
      {...(componentProps.dataAttributes ? JSON.parse(componentProps.dataAttributes) : {})}>
      <div
        className="absolute top-2 right-2 text-xs font-medium bg-white border border-gray-300 px-2 py-1 rounded shadow-sm z-50 text-gray-600"
        style={{ right: '8px' }}>
        Grid ({parsedColumns}×{parsedRows}){carouselId && ` • Slide ${(slideIndex || 0) + 1}`}
        <span className="ml-1 font-bold">{currentComponentsCount} components</span>
      </div>

      <div className="absolute top-10 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-50" style={{ right: '8px' }}>
        <button
          onClick={handleEditClick}
          className="p-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded shadow-sm transition-colors"
          title="Edit Grid">
          <Edit size={12} />
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded shadow-sm transition-colors"
          title="Delete Grid">
          <Trash2 size={12} />
        </button>
      </div>

      {gridCells}
    </div>
  )
}

;(NewGridComponent as any).schema = newGridSchema

export default NewGridComponent
export { NewGridComponent as NewGrid }

const gridPropsAreEqual = (prevProps: NewGridComponentProps, nextProps: NewGridComponentProps) => {
  if (prevProps.id !== nextProps.id) return false
  if (prevProps.component?.id !== nextProps.component?.id) return false
  if (prevProps.carouselId !== nextProps.carouselId) return false
  if (prevProps.slideIndex !== nextProps.slideIndex) return false
  if (prevProps.rows !== nextProps.rows) return false
  if (prevProps.columns !== nextProps.columns) return false
  if (prevProps.parentComponentId !== nextProps.parentComponentId) return false
  if (prevProps.parentGridId !== nextProps.parentGridId) return false

  // Check props.cells
  if (prevProps.cells !== nextProps.cells) {
    if (!prevProps.cells && !nextProps.cells) {
      // Both undefined/null, continue
    } else if (!prevProps.cells || !nextProps.cells) {
      return false
    } else if (prevProps.cells.length !== nextProps.cells.length) {
      return false
    } else {
      for (let i = 0; i < prevProps.cells.length; i++) {
        if (prevProps.cells[i].length !== nextProps.cells[i].length) return false
        for (let j = 0; j < prevProps.cells[i].length; j++) {
          const prevCell = prevProps.cells[i][j]
          const nextCell = nextProps.cells[i][j]

          if (!!prevCell?.component !== !!nextCell?.component) {
            return false
          }

          if (prevCell?.component && nextCell?.component) {
            if (prevCell.component.id !== nextCell.component.id) {
              return false
            }
          }
        }
      }
    }
  }

  const prevCells = prevProps.component?.props?.cells
  const nextCells = nextProps.component?.props?.cells

  if (prevCells !== nextCells) {
    if (!prevCells && !nextCells) {
      // Both undefined/null, continue
    } else if (!prevCells || !nextCells) {
      return false
    } else if (prevCells.length !== nextCells.length) {
      return false
    } else {
      for (let i = 0; i < prevCells.length; i++) {
        if (prevCells[i].length !== nextCells[i].length) return false
        for (let j = 0; j < prevCells[i].length; j++) {
          const prevCell = prevCells[i][j]
          const nextCell = nextCells[i][j]

          if (!!prevCell?.component !== !!nextCell?.component) {
            return false
          }

          if (prevCell?.component && nextCell?.component) {
            if (prevCell.component.id !== nextCell.component.id) {
              return false
            }

            const prevProps = prevCell.component.props || {}
            const nextProps = nextCell.component.props || {}

            if (JSON.stringify(prevProps) !== JSON.stringify(nextProps)) {
              return false
            }
          }
        }
      }
    }
  }

  if (prevProps.components !== nextProps.components) {
    const prevComponents = prevProps.components || []
    const nextComponents = nextProps.components || []

    if (prevComponents.length !== nextComponents.length) return false

    for (let i = 0; i < prevComponents.length; i++) {
      const prevComp = prevComponents[i]
      const nextComp = nextComponents[i]
      if (prevComp?.id !== nextComp?.id || prevComp?.type !== nextComp?.type) {
        return false
      }
    }
  }

  return true
}

export const MemoizedNewGrid = memo(NewGridComponent, gridPropsAreEqual)
MemoizedNewGrid.displayName = 'NewGrid'