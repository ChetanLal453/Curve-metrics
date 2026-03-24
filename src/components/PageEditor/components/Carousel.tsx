'use client'

import React, { useEffect, useRef, useCallback, useState, memo, useMemo } from 'react' // ✅ Add useMemo
import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { LayoutComponent } from '@/types/page-editor'
import { DynamicComponent } from '../DynamicComponent'
import { ComponentWrapper } from './ComponentWrapper'
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  id: string
  components: LayoutComponent[]
  title?: string
  description?: string
  backgroundColor?: string
}

interface CarouselComponentProps {
  id?: string
  component?: LayoutComponent
  slides?: Slide[]
  onUpdate?: (newProps: Record<string, any>) => void
  onComponentSelect?: (component: LayoutComponent, context: CarouselComponentContext) => void
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void
  sectionId?: string
  containerId?: string
  rowId?: string
  colId?: string
  carouselId?: string
  slideIndex?: number
  setSelectedComponent?: (component: { sectionId: string; compId: string; component: LayoutComponent }) => void
  deleteComponent?: (componentId: string, context?: any) => void
  parentComponentId?: string
  parentGridId?: string
  [key: string]: any
}

interface CarouselComponentContext {
  sectionId: string
  containerId: string
  rowId: string
  colId: string
  carouselId?: string
  slideIndex?: number
  source?: 'carousel-direct' | 'slide' | 'grid-cell'
  isNestedSelection?: boolean
  parentComponentId?: string
  parentGridId?: string
  currentSlideIndex?: number
}

// ADVANCED DEFAULT PROPS ADDED HERE
export const carouselDefaultProps = {
  slides: [
    {
      id: 'slide-1',
      components: [],
      title: '',
      description: '',
      backgroundColor: 'transparent',
    },
  ],
  autoplay: false,
  autoplaySpeed: 3000,
  loop: false,
  showNavigation: true,
  showIndicators: true,
  navigationPosition: 'bottom',
  indicatorStyle: 'dots',
  slideTransition: 'slide',
  transitionDuration: 300,
  showArrows: true,
  arrowsPosition: 'sides',
  slidePadding: '16px',
  slideMargin: '8px',
  slideBorderRadius: '8px',
  slideBackgroundColor: 'transparent',
  carouselHeight: 'auto',
  carouselWidth: '100%',
  hideOnMobile: false,
  hideOnTablet: false,
  draggable: true,
  visible: true,
  customCSS: '',
  className: '',
  id: '',
  dataAttributes: '{}',
  carouselTestFromComponent: 'YES FROM CAROUSEL COMPONENT FILE',
  
  // 🎯 ADVANCED PROPERTIES ADDED
  slidesPerView: 1,
  slidesPerGroup: 1,
  spaceBetween: 0,
  centeredSlides: false,
  direction: 'horizontal',
  navigation: true,
  pagination: true,
  paginationType: 'bullets',
  paginationClickable: true,
  mousewheel: false,
  keyboard: true,
  effect: 'slide',
  speed: 300,
  easing: 'ease',
  touchRatio: 1,
  grabCursor: false,
  freeMode: false,
  breakpoints: JSON.stringify({
    '320': { slidesPerView: 1, spaceBetween: 10 },
    '640': { slidesPerView: 2, spaceBetween: 20 },
    '1024': { slidesPerView: 3, spaceBetween: 30 }
  }),
  lazy: false,
  observer: true,
  a11y: true,
  ariaLabel: 'Image carousel',
  shadow: 'none',
  borderRadius: '0px',
  borderWidth: '0px',
  borderColor: 'transparent',
  backgroundColor: 'transparent',
  showThumbnails: false,
  thumbnailSize: '80px',
  thumbnailPosition: 'bottom',
  debug: false,
}

// ADVANCED SCHEMA ADDED HERE
export const carouselSchema = {
  properties: {
    carouselTestFromComponent: {
      type: 'text',
      label: 'Carousel Test (FROM COMPONENT)',
      default: carouselDefaultProps.carouselTestFromComponent,
      category: 'Advanced',
      description: 'This proves schema comes from component file!',
    },
    slides: {
      type: 'carousel-slides',
      label: 'Slides',
      default: carouselDefaultProps.slides,
      category: 'Content',
      description: 'Add container slides for your components',
    },
    autoplay: {
      type: 'toggle',
      label: 'Autoplay',
      default: carouselDefaultProps.autoplay,
      category: 'Behavior',
    },
    autoplaySpeed: {
      type: 'number',
      label: 'Autoplay Speed (ms)',
      default: carouselDefaultProps.autoplaySpeed,
      min: 1000,
      max: 10000,
      step: 500,
      category: 'Behavior',
    },
    loop: {
      type: 'toggle',
      label: 'Loop',
      default: carouselDefaultProps.loop,
      category: 'Behavior',
    },
    showNavigation: {
      type: 'toggle',
      label: 'Show Navigation',
      default: carouselDefaultProps.showNavigation,
      category: 'Navigation',
    },
    showIndicators: {
      type: 'toggle',
      label: 'Show Indicators',
      default: carouselDefaultProps.showIndicators,
      category: 'Navigation',
    },
    navigationPosition: {
      type: 'select',
      label: 'Navigation Position',
      default: carouselDefaultProps.navigationPosition,
      options: [
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' },
        { value: 'both', label: 'Both' },
      ],
      category: 'Navigation',
    },
    indicatorStyle: {
      type: 'select',
      label: 'Indicator Style',
      default: carouselDefaultProps.indicatorStyle,
      options: [
        { value: 'dots', label: 'Dots' },
        { value: 'lines', label: 'Lines' },
        { value: 'numbers', label: 'Numbers' },
      ],
      category: 'Navigation',
    },
    slideTransition: {
      type: 'select',
      label: 'Slide Transition',
      default: carouselDefaultProps.slideTransition,
      options: [
        { value: 'slide', label: 'Slide' },
        { value: 'fade', label: 'Fade' },
        { value: 'zoom', label: 'Zoom' },
      ],
      category: 'Animation',
    },
    transitionDuration: {
      type: 'number',
      label: 'Transition Duration (ms)',
      default: carouselDefaultProps.transitionDuration,
      min: 100,
      max: 2000,
      step: 100,
      category: 'Animation',
    },
    showArrows: {
      type: 'toggle',
      label: 'Show Arrows',
      default: carouselDefaultProps.showArrows,
      category: 'Navigation',
    },
    arrowsPosition: {
      type: 'select',
      label: 'Arrows Position',
      default: carouselDefaultProps.arrowsPosition,
      options: [
        { value: 'sides', label: 'Sides' },
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' },
      ],
      category: 'Navigation',
    },
    slidePadding: {
      type: 'text',
      label: 'Slide Padding',
      default: carouselDefaultProps.slidePadding,
      category: 'Style',
    },
    slideMargin: {
      type: 'text',
      label: 'Slide Margin',
      default: carouselDefaultProps.slideMargin,
      category: 'Style',
    },
    slideBorderRadius: {
      type: 'text',
      label: 'Slide Border Radius',
      default: carouselDefaultProps.slideBorderRadius,
      category: 'Style',
    },
    slideBackgroundColor: {
      type: 'color',
      label: 'Slide Background Color',
      default: carouselDefaultProps.slideBackgroundColor,
      category: 'Style',
    },
    carouselHeight: {
      type: 'text',
      label: 'Carousel Height',
      default: carouselDefaultProps.carouselHeight,
      category: 'Layout',
    },
    carouselWidth: {
      type: 'text',
      label: 'Carousel Width',
      default: carouselDefaultProps.carouselWidth,
      category: 'Layout',
    },
    hideOnMobile: {
      type: 'toggle',
      label: 'Hide on Mobile',
      default: carouselDefaultProps.hideOnMobile,
      category: 'Responsive',
    },
    hideOnTablet: {
      type: 'toggle',
      label: 'Hide on Tablet',
      default: carouselDefaultProps.hideOnTablet,
      category: 'Responsive',
    },
    draggable: {
      type: 'toggle',
      label: 'Draggable Slides',
      default: carouselDefaultProps.draggable,
      category: 'Behavior',
    },
    visible: {
      type: 'toggle',
      label: 'Visible',
      default: carouselDefaultProps.visible,
      category: 'Behavior',
    },
    customCSS: {
      type: 'textarea',
      label: 'Custom CSS',
      default: carouselDefaultProps.customCSS,
      category: 'Advanced',
      placeholder: 'Enter custom CSS here...',
    },
    className: {
      type: 'text',
      label: 'CSS Class',
      default: carouselDefaultProps.className,
      category: 'Advanced',
    },
    id: {
      type: 'text',
      label: 'HTML ID',
      default: carouselDefaultProps.id,
      category: 'Advanced',
    },
    dataAttributes: {
      type: 'textarea',
      label: 'Data Attributes (JSON)',
      default: carouselDefaultProps.dataAttributes,
      category: 'Advanced',
      placeholder: '{"data-custom": "value"}',
    },
    
    // 🎯 ADVANCED PROPERTIES ADDED TO SCHEMA
    slidesPerView: {
      type: 'select',
      label: 'Slides Per View',
      default: carouselDefaultProps.slidesPerView,
      options: [
        { value: '1', label: '1 Slide' },
        { value: '2', label: '2 Slides' },
        { value: '3', label: '3 Slides' },
        { value: '4', label: '4 Slides' },
        { value: '5', label: '5 Slides' },
        { value: 'auto', label: 'Auto (Fit container)' }
      ],
      category: 'Layout',
      description: 'Number of slides visible at once'
    },
    slidesPerGroup: {
      type: 'select',
      label: 'Slides Per Group',
      default: carouselDefaultProps.slidesPerGroup,
      options: [
        { value: '1', label: '1 Slide' },
        { value: '2', label: '2 Slides' },
        { value: '3', label: '3 Slides' }
      ],
      category: 'Behavior',
      description: 'Number of slides to move per navigation'
    },
    spaceBetween: {
      type: 'number',
      label: 'Space Between Slides (px)',
      default: carouselDefaultProps.spaceBetween,
      min: 0,
      max: 100,
      step: 1,
      category: 'Layout',
      description: 'Gap between slides in pixels'
    },
    centeredSlides: {
      type: 'toggle',
      label: 'Centered Slides',
      default: carouselDefaultProps.centeredSlides,
      category: 'Layout',
      description: 'Center active slide'
    },
    direction: {
      type: 'select',
      label: 'Direction',
      default: carouselDefaultProps.direction,
      options: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' }
      ],
      category: 'Layout',
      description: 'Carousel direction'
    },
    navigation: {
      type: 'toggle',
      label: 'Show Navigation',
      default: carouselDefaultProps.navigation,
      category: 'Navigation',
      description: 'Show next/prev buttons'
    },
    paginationType: {
      type: 'select',
      label: 'Pagination Type',
      default: carouselDefaultProps.paginationType,
      options: [
        { value: 'bullets', label: 'Bullets (Dots)' },
        { value: 'fraction', label: 'Fraction' },
        { value: 'progressbar', label: 'Progress Bar' },
        { value: 'custom', label: 'Custom' }
      ],
      category: 'Navigation',
      description: 'Type of pagination indicators'
    },
    mousewheel: {
      type: 'toggle',
      label: 'Mousewheel Control',
      default: carouselDefaultProps.mousewheel,
      category: 'Navigation',
      description: 'Enable mousewheel navigation'
    },
    keyboard: {
      type: 'toggle',
      label: 'Keyboard Control',
      default: carouselDefaultProps.keyboard,
      category: 'Navigation',
      description: 'Enable keyboard navigation'
    },
    effect: {
      type: 'select',
      label: 'Transition Effect',
      default: carouselDefaultProps.effect,
      options: [
        { value: 'slide', label: 'Slide' },
        { value: 'fade', label: 'Fade' },
        { value: 'cube', label: '3D Cube' },
        { value: 'coverflow', label: 'Coverflow' },
        { value: 'flip', label: '3D Flip' },
        { value: 'cards', label: 'Cards' },
        { value: 'creative', label: 'Creative' }
      ],
      category: 'Animation',
      description: 'Slide transition effect'
    },
    speed: {
      type: 'number',
      label: 'Transition Speed (ms)',
      default: carouselDefaultProps.speed,
      min: 100,
      max: 2000,
      step: 50,
      category: 'Animation',
      description: 'Duration of transition animation'
    },
    easing: {
      type: 'select',
      label: 'Easing Function',
      default: carouselDefaultProps.easing,
      options: [
        { value: 'linear', label: 'Linear' },
        { value: 'ease', label: 'Ease' },
        { value: 'ease-in', label: 'Ease In' },
        { value: 'ease-out', label: 'Ease Out' },
        { value: 'ease-in-out', label: 'Ease In Out' },
        { value: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', label: 'Bounce' }
      ],
      category: 'Animation',
      description: 'CSS easing function for transitions'
    },
    touchRatio: {
      type: 'range',
      label: 'Touch Sensitivity',
      default: carouselDefaultProps.touchRatio,
      min: 0.1,
      max: 2,
      step: 0.1,
      category: 'Touch',
      description: 'Touch movement sensitivity (1 = normal)'
    },
    grabCursor: {
      type: 'toggle',
      label: 'Grab Cursor',
      default: carouselDefaultProps.grabCursor,
      category: 'Interaction',
      description: 'Show grab cursor on hover'
    },
    freeMode: {
      type: 'toggle',
      label: 'Free Mode',
      default: carouselDefaultProps.freeMode,
      category: 'Behavior',
      description: 'Free scrolling without fixed positions'
    },
    breakpoints: {
      type: 'textarea',
      label: 'Responsive Breakpoints',
      default: carouselDefaultProps.breakpoints,
      category: 'Responsive',
      description: 'JSON configuration for different screen sizes',
      placeholder: '{"640": {"slidesPerView": 2, "spaceBetween": 20}, "1024": {"slidesPerView": 3, "spaceBetween": 30}}'
    },
    lazy: {
      type: 'toggle',
      label: 'Lazy Loading',
      default: carouselDefaultProps.lazy,
      category: 'Performance',
      description: 'Lazy load images'
    },
    observer: {
      type: 'toggle',
      label: 'Observer',
      default: carouselDefaultProps.observer,
      category: 'Performance',
      description: 'Watch for DOM changes'
    },
    a11y: {
      type: 'toggle',
      label: 'Accessibility',
      default: carouselDefaultProps.a11y,
      category: 'Accessibility',
      description: 'Enable accessibility features'
    },
    ariaLabel: {
      type: 'text',
      label: 'ARIA Label',
      default: carouselDefaultProps.ariaLabel,
      category: 'Accessibility',
      description: 'Accessibility label for screen readers'
    },
    shadow: {
      type: 'select',
      label: 'Shadow',
      default: carouselDefaultProps.shadow,
      options: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' }
      ],
      category: 'Style',
    },
    borderRadius: {
      type: 'text',
      label: 'Border Radius',
      default: carouselDefaultProps.borderRadius,
      category: 'Style',
    },
    backgroundColor: {
      type: 'color',
      label: 'Background Color',
      default: carouselDefaultProps.backgroundColor,
      category: 'Style',
    },
    showThumbnails: {
      type: 'toggle',
      label: 'Show Thumbnails',
      default: carouselDefaultProps.showThumbnails,
      category: 'Advanced',
    },
    thumbnailSize: {
      type: 'text',
      label: 'Thumbnail Size',
      default: carouselDefaultProps.thumbnailSize,
      category: 'Advanced',
    },
    debug: {
      type: 'toggle',
      label: 'Debug Mode',
      default: carouselDefaultProps.debug,
      category: 'Advanced',
    },
  },
} as any

const SortableCarouselItem: React.FC<{
  component: LayoutComponent
  slideIndex: number
  componentIndex: number
  carouselId: string
  context: CarouselComponentContext
  onComponentSelect?: (component: LayoutComponent, context: CarouselComponentContext) => void
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void
  setSelectedComponent?: (component: { sectionId: string; compId: string; component: LayoutComponent }) => void
  deleteComponent?: (componentId: string, context?: any) => void
  onDeleteChildComponent?: (componentId: string, context?: any) => void
}> = ({
  component,
  slideIndex,
  componentIndex,
  carouselId,
  context,
  onComponentSelect,
  onComponentUpdate,
  setSelectedComponent,
  deleteComponent,
  onDeleteChildComponent,
}) => {
  const draggableId = `component:${component.id}:carousel:${carouselId}:slide-${slideIndex}:${componentIndex}`

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: draggableId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    width: '100%',
    height: '100%',
    pointerEvents: 'auto' as const,
  }

  const handleDeleteComponent = useCallback(
    (componentId: string, nestedContext?: any) => {
      const mergedContext = {
        ...context,
        ...nestedContext,
        slideIndex: slideIndex,
        source: 'carousel-direct' as const,
        parentComponentId: carouselId,
      }

      if (onDeleteChildComponent) {
        onDeleteChildComponent(componentId, mergedContext)
      } else if (deleteComponent) {
        deleteComponent(componentId, mergedContext)
      }
    },
    [onDeleteChildComponent, deleteComponent, context, slideIndex, carouselId],
  )

  const handleChildUpdate = useCallback(
    (componentId: string, newProps: Record<string, any>) => {
      if (onComponentUpdate) {
        onComponentUpdate(componentId, newProps)
      }
    },
    [onComponentUpdate],
  )

  const handleEditClick = useCallback(() => {
    if (component && onComponentSelect) {
      onComponentSelect(component, {
        ...context,
        slideIndex: slideIndex,
        colId: `component-${componentIndex}`,
        source: 'carousel-direct' as const,
      })
    }
  }, [component, onComponentSelect, context, slideIndex, componentIndex])

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ComponentWrapper
        onEdit={handleEditClick}
        isGridLevel={false}
        sectionId={context.sectionId}
        containerId={context.containerId}
        rowId={context.rowId}
        colId={`component-${componentIndex}`}
        component={component}
        deleteComponent={handleDeleteComponent}
        carouselId={carouselId}
        slideIndex={slideIndex}
        // Add these instead:
        gridId={carouselId}
      >
        <DynamicComponent
          component={component}
          isSelected={false}
          onSelect={() => {
            if (onComponentSelect) {
              onComponentSelect(component, {
                ...context,
                slideIndex: slideIndex,
                colId: `component-${componentIndex}`,
                source: 'carousel-direct' as const,
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
          sectionId={context.sectionId}
          containerId={context.containerId}
          rowId={context.rowId}
          colId={`component-${componentIndex}`}
          carouselId={carouselId}
          slideIndex={slideIndex}
          parentComponentId={carouselId}
        />
      </ComponentWrapper>
    </div>
  )
}

const CarouselComponent: React.FC<CarouselComponentProps> = ({
  id,
  component: propComponent,
  slides: propSlides = [],
  onUpdate,
  onComponentSelect,
  onComponentUpdate,
  sectionId = '',
  containerId = '',
  rowId = '',
  colId = '',
  carouselId,
  slideIndex,
  setSelectedComponent,
  deleteComponent,
  parentComponentId,
  parentGridId,
  ...props
}) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [localComponent, setLocalComponent] = useState(propComponent)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isReadyForDrop, setIsReadyForDrop] = useState(false)
  const [isEditor] = useState(true)

  const componentProps = { ...carouselDefaultProps, ...props }
  const carouselComponentId = id || localComponent?.id || componentProps.id || `carousel-${Date.now()}`

  useEffect(() => {
    if (propComponent) {
      setLocalComponent(propComponent)
    }
  }, [propComponent])

  const currentSlides = useMemo(() => {
    if (localComponent?.props?.slides) {
      return localComponent.props.slides
    }
    if (propSlides.length > 0) {
      return propSlides
    }
    return componentProps.slides || carouselDefaultProps.slides
  }, [localComponent?.props?.slides, propSlides, componentProps.slides])

  useEffect(() => {
    console.log('🚀 CAROUSEL MOUNTED:', {
      carouselId: carouselComponentId,
      slidesCount: currentSlides.length,
      hasComponent: !!localComponent,
    })

    const timer = setTimeout(() => {
      setIsReadyForDrop(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [carouselComponentId, currentSlides.length, localComponent])

  const dropZoneId = `component:carousel-${carouselComponentId}:section-${sectionId}-container-${containerId}-row-${rowId}-col-${colId}`

  const { isOver, setNodeRef } = useDroppable({
    id: dropZoneId,
    disabled: !isEditor || !isReadyForDrop,
    data: {
      type: 'carousel',
      carouselId: carouselComponentId,
      sectionId,
      containerId,
      rowId,
      colId,
      currentSlideIndex,
    },
  })

  const handleSlideUpdate = useCallback(
    (updatedSlides: Slide[]) => {
      const newProps = {
        ...localComponent?.props,
        slides: updatedSlides,
      }

      if (localComponent) {
        const updatedComponent = {
          ...localComponent,
          props: newProps,
        }
        setLocalComponent(updatedComponent)
      }

      if (onUpdate) {
        onUpdate(newProps)
      }
    },
    [localComponent, onUpdate],
  )

  const handleAddSlide = useCallback(() => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      components: [],
    }
    const updatedSlides = [...currentSlides, newSlide]
    handleSlideUpdate(updatedSlides)
    setCurrentSlideIndex(updatedSlides.length - 1)
  }, [currentSlides, handleSlideUpdate])

  const handleDeleteSlide = useCallback(
    (slideIndexToDelete: number) => {
      if (currentSlides.length <= 1) {
        alert('Cannot delete the last slide')
        return
      }

      const updatedSlides = currentSlides.filter((_: Slide, index: number) => index !== slideIndexToDelete)
      handleSlideUpdate(updatedSlides)

      if (currentSlideIndex >= updatedSlides.length) {
        setCurrentSlideIndex(updatedSlides.length - 1)
      }
    },
    [currentSlides, currentSlideIndex, handleSlideUpdate],
  )

  const handleDeleteChildComponent = useCallback(
    (componentId: string, context?: any) => {
      const updatedSlides = [...currentSlides]
      const currentSlide = updatedSlides[currentSlideIndex]

      if (currentSlide && currentSlide.components) {
        const newComponents = currentSlide.components.filter((comp: LayoutComponent) => comp?.id !== componentId)

        if (newComponents.length !== currentSlide.components.length) {
          updatedSlides[currentSlideIndex] = {
            ...currentSlide,
            components: newComponents,
          }

          handleSlideUpdate(updatedSlides)
        }
      }

      if (deleteComponent) {
        const deleteContext = {
          ...context,
          sectionId,
          containerId: containerId || carouselComponentId,
          rowId: rowId || `slide-${currentSlideIndex}`,
          colId: 'carousel-item',
          carouselId: carouselComponentId,
          slideIndex: currentSlideIndex,
          source: 'carousel-direct' as const,
          isNestedSelection: true,
        }

        deleteComponent(componentId, deleteContext)
      }
    },
    [currentSlides, currentSlideIndex, handleSlideUpdate, deleteComponent, sectionId, containerId, rowId, carouselComponentId],
  )

  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (localComponent && sectionId && setSelectedComponent) {
        setSelectedComponent({
          sectionId,
          compId: carouselComponentId,
          component: localComponent,
        })
      }
    },
    [localComponent, sectionId, setSelectedComponent, carouselComponentId],
  )

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (deleteComponent) {
        deleteComponent(carouselComponentId, {
          sectionId,
          containerId,
          rowId,
          colId,
          carouselId,
          slideIndex,
          source: 'carousel-direct',
          isNestedSelection: false,
          parentComponentId,
        })
      }
    },
    [deleteComponent, carouselComponentId, sectionId, containerId, rowId, colId, carouselId, slideIndex, parentComponentId],
  )

  const nextSlide = useCallback(() => {
    if (componentProps.loop || currentSlideIndex < currentSlides.length - 1) {
      setCurrentSlideIndex((prev) => (prev + 1) % currentSlides.length)
    }
  }, [currentSlides.length, componentProps.loop, currentSlideIndex])

  const prevSlide = useCallback(() => {
    if (componentProps.loop || currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => (prev - 1 + currentSlides.length) % currentSlides.length)
    }
  }, [currentSlides.length, componentProps.loop, currentSlideIndex])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlideIndex(index)
  }, [])

  const carouselContext = useMemo(
    (): CarouselComponentContext => ({
      sectionId,
      containerId: containerId || carouselComponentId,
      rowId: rowId || `slide-${currentSlideIndex}`,
      colId: colId || 'carousel',
      carouselId: carouselComponentId,
      slideIndex: currentSlideIndex,
      source: 'carousel-direct' as const,
      isNestedSelection: false,
      parentComponentId: parentComponentId,
      parentGridId: parentGridId,
      currentSlideIndex,
    }),
    [sectionId, containerId, rowId, colId, carouselComponentId, currentSlideIndex, parentComponentId, parentGridId],
  )

  const currentSlide = currentSlides[currentSlideIndex] || { id: 'empty', components: [] }
  const hasMultipleSlides = currentSlides.length > 1

  const carouselStyle = useMemo(
    (): React.CSSProperties => ({
      height: componentProps.carouselHeight,
      width: componentProps.carouselWidth,
      overflow: 'hidden',
      position: 'relative',
      ...(componentProps.customCSS ? JSON.parse(componentProps.customCSS || '{}') : {}),
    }),
    [componentProps.carouselHeight, componentProps.carouselWidth, componentProps.customCSS],
  )

  const slideStyle = useMemo(
    (): React.CSSProperties => ({
      padding: componentProps.slidePadding,
      margin: componentProps.slideMargin,
      borderRadius: componentProps.slideBorderRadius,
      backgroundColor: currentSlide.backgroundColor || componentProps.slideBackgroundColor,
      minHeight: '100px',
      position: 'relative',
    }),
    [componentProps, currentSlide.backgroundColor],
  )

  if (componentProps.visible === false) {
    return null
  }

  return (
    <div
      ref={setNodeRef}
      style={carouselStyle}
      className={`carousel-container relative group ${componentProps.className || ''} ${
        isOver ? 'ring-2 ring-blue-400 bg-blue-50 border-blue-300' : ''
      }`}
      onClick={(e) => e.stopPropagation()}
      data-carousel-container="true"
      data-carousel-id={carouselComponentId}
      data-parent-component-id={parentComponentId}
      data-drop-zone-id={dropZoneId}
      data-is-over={isOver}
      data-ready-for-drop={isReadyForDrop}
      data-current-slide-index={currentSlideIndex}
      id={componentProps.id || carouselComponentId}
      {...(componentProps.dataAttributes ? JSON.parse(componentProps.dataAttributes) : {})}>
      <div
        className="absolute top-2 right-2 text-xs font-medium bg-white border border-gray-300 px-2 py-1 rounded shadow-sm z-50 text-gray-600"
        style={{ right: '8px' }}>
        Carousel • Slide {currentSlideIndex + 1} of {currentSlides.length}
        {currentSlide.title && <span className="ml-1">• {currentSlide.title}</span>}
      </div>

      <div className="absolute top-10 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-50" style={{ right: '8px' }}>
        <button
          onClick={handleEditClick}
          className="p-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded shadow-sm transition-colors"
          title="Edit Carousel">
          <Edit size={12} />
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded shadow-sm transition-colors"
          title="Delete Carousel">
          <Trash2 size={12} />
        </button>
        <button
          onClick={handleAddSlide}
          className="p-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded shadow-sm transition-colors"
          title="Add Slide">
          +
        </button>
        {hasMultipleSlides && (
          <button
            onClick={() => handleDeleteSlide(currentSlideIndex)}
            className="p-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded shadow-sm transition-colors"
            title="Delete Current Slide">
            −
          </button>
        )}
      </div>

      {isOver && isReadyForDrop && (
        <div className="absolute inset-0 bg-blue-100/30 border-4 border-blue-400 border-dashed rounded-lg flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-white px-6 py-3 rounded-lg shadow-xl text-blue-600 font-bold text-lg border-2 border-blue-300">
            🎯 Drop to add to carousel slide
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {componentProps.showArrows && hasMultipleSlides && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border border-gray-300 rounded-full p-2 shadow-sm z-30 transition-all hover:scale-110"
            style={{ opacity: componentProps.loop || currentSlideIndex > 0 ? 1 : 0.3 }}
            disabled={!componentProps.loop && currentSlideIndex <= 0}>
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border border-gray-300 rounded-full p-2 shadow-sm z-30 transition-all hover:scale-110"
            style={{ opacity: componentProps.loop || currentSlideIndex < currentSlides.length - 1 ? 1 : 0.3 }}
            disabled={!componentProps.loop && currentSlideIndex >= currentSlides.length - 1}>
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Slide Content */}
      <div ref={contentRef} style={slideStyle} className="relative z-10">
        {(currentSlide.title || currentSlide.description) && (
          <div className="mb-4 p-3 bg-white/80 border border-gray-200 rounded">
            {currentSlide.title && <h3 className="text-lg font-bold text-gray-900 mb-1">{currentSlide.title}</h3>}
            {currentSlide.description && <p className="text-gray-600">{currentSlide.description}</p>}
          </div>
        )}

        <div className="space-y-3">
          {currentSlide.components.length === 0 ? (
            <div className="min-h-[100px] border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-2xl mb-2">🎠</div>
                <div className="font-medium text-gray-700 mb-1">Empty Slide</div>
                <div className="text-sm text-gray-500">Drop components here</div>
              </div>
            </div>
          ) : (
            currentSlide.components.map((child: LayoutComponent, componentIndex: number) => (
              <SortableCarouselItem
                key={child.id}
                component={child}
                slideIndex={currentSlideIndex}
                componentIndex={componentIndex}
                carouselId={carouselComponentId}
                context={carouselContext}
                onComponentSelect={onComponentSelect}
                onComponentUpdate={onComponentUpdate}
                setSelectedComponent={setSelectedComponent}
                deleteComponent={deleteComponent}
                onDeleteChildComponent={handleDeleteChildComponent}
              />
            ))
          )}
        </div>
      </div>

      {/* Navigation Indicators */}
      {(componentProps.showIndicators || componentProps.showNavigation) && hasMultipleSlides && (
        <div className="flex justify-center items-center p-3 border-t border-gray-200 bg-gray-50">
          {componentProps.showIndicators && (
            <div className="flex gap-2 mr-4">
              {currentSlides.map((_: Slide, index: number) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlideIndex ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
          {componentProps.showNavigation && (
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                disabled={!componentProps.loop && currentSlideIndex <= 0}>
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                {currentSlideIndex + 1} / {currentSlides.length}
              </span>
              <button
                onClick={nextSlide}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                disabled={!componentProps.loop && currentSlideIndex >= currentSlides.length - 1}>
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

;(CarouselComponent as any).schema = carouselSchema



const carouselPropsAreEqual = (prevProps: CarouselComponentProps, nextProps: CarouselComponentProps) => {
  if (prevProps.id !== nextProps.id) return false
  if (prevProps.component?.id !== nextProps.component?.id) return false
  if (prevProps.carouselId !== nextProps.carouselId) return false
  if (prevProps.slideIndex !== nextProps.slideIndex) return false
  if (prevProps.parentComponentId !== nextProps.parentComponentId) return false
  if (prevProps.parentGridId !== nextProps.parentGridId) return false

  // Check slides
  const prevSlides = prevProps.component?.props?.slides || prevProps.slides || []
  const nextSlides = nextProps.component?.props?.slides || nextProps.slides || []

  if (prevSlides.length !== nextSlides.length) return false

  for (let i = 0; i < prevSlides.length; i++) {
    const prevSlide = prevSlides[i]
    const nextSlide = nextSlides[i]

    if (prevSlide.id !== nextSlide.id) return false
    if (prevSlide.title !== nextSlide.title) return false
    if (prevSlide.description !== nextSlide.description) return false
    if (prevSlide.backgroundColor !== nextSlide.backgroundColor) return false

    // Check components in slide
    if (prevSlide.components?.length !== nextSlide.components?.length) return false

    if (prevSlide.components && nextSlide.components) {
      for (let j = 0; j < prevSlide.components.length; j++) {
        const prevComp = prevSlide.components[j]
        const nextComp = nextSlide.components[j]

        if (prevComp?.id !== nextComp?.id || prevComp?.type !== nextComp?.type) {
          return false
        }
      }
    }
  }

  return true
}

export default CarouselComponent;
export { CarouselComponent as Carousel }; 