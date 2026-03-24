'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { LayoutComponent } from '@/types/page-editor'
import { Trash2, Plus, Pause, Play, Settings, AlertCircle } from 'lucide-react'

// ✅ SWIPER 12: CORRECT IMPORTS
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper modules for Swiper 12
import {
  Navigation,
  Pagination,
  Autoplay,
  Mousewheel,
  Scrollbar,
  EffectFade,
  EffectCube,
  EffectCoverflow,
  EffectFlip,
  EffectCreative,
  EffectCards,
  FreeMode,
  Thumbs,
  Parallax,
  Keyboard,
  Controller
} from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/effect-fade'
import 'swiper/css/effect-cube'
import 'swiper/css/effect-coverflow'
import 'swiper/css/effect-flip'
import 'swiper/css/effect-creative'
import 'swiper/css/effect-cards'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import 'swiper/css/parallax'
import 'swiper/css/mousewheel'

// ✅ FIXED: Define a union type for all possible effects
type SwiperEffect = 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | 'cards' | 'creative'
type HoverEffectType = 'lift' | 'scale' | 'glow' | 'tilt' | 'minimal' | 'none'
type HoverIntensity = 'light' | 'medium' | 'strong'

interface SwiperContainerProps {
  id?: string
  component?: LayoutComponent
  slides?: any[]
  onUpdate?: (newProps: Record<string, any>) => void
  onComponentSelect?: (component: LayoutComponent, context: any) => void
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void
  deleteComponent?: (componentId: string, context?: any) => void
  sectionId?: string
  containerId?: string
  rowId?: string
  colId?: string
  carouselId?: string
  slideIndex?: number
  setSelectedComponent?: (component: { sectionId: string; compId: string; component: LayoutComponent }) => void
  parentComponentId?: string
  parentGridId?: string
  isEditing?: boolean
  hoverEffects?: boolean
  hoverEffectType?: HoverEffectType
  hoverIntensity?: HoverIntensity
  [key: string]: any
}

interface SlideType {
  id: string
  components: LayoutComponent[]
  backgroundColor: string
  padding?: string
}

// ✅ FIXED: Use the SwiperEffect type
export const swiperContainerDefaultProps = {
  // Layout
  slidesPerView: 3,
  slidesPerGroup: 1,
  spaceBetween: 20,
  direction: 'horizontal' as const,
  centeredSlides: false,
  slidesPerViewAuto: false,

  // Effects - typed as SwiperEffect
  effect: 'slide' as SwiperEffect,
  effectFadeCrossFade: true,
  effectCubeShadow: true,
  effectCubeShadowScale: 0.94,
  effectCoverflowDepth: 100,
  effectCoverflowRotate: 30,
  effectCoverflowStretch: 0,
  effectFlipSlideShadows: true,
  effectFlipLimitRotation: true,
  effectCardsPerSlideOffset: 8,
  effectCreativePrev: {
    translate: ['-120%', 0, -500],
  },
  effectCreativeNext: {
    translate: ['120%', 0, -500],
  },

  // Hover Effects
  hoverEffects: true,
  hoverEffectType: 'lift' as HoverEffectType,
  hoverIntensity: 'medium' as HoverIntensity,

  // Behavior
  autoplay: false,
  autoplayDelay: 3000,
  loop: true,
  speed: 500,
  draggable: true,
  grabCursor: true,
  freeMode: false,
  scrollContainer: false,
  mousewheel: false,
  mousewheelForceToAxis: true,
  mousewheelSensitivity: 1,

  // Navigation
  navigation: true,
  pagination: true,
  paginationType: 'bullets' as const,
  paginationDynamic: false,
  paginationProgress: false,
  scrollbar: false,
  scrollbarDraggable: true,
  scrollbarSnapOnRelease: true,

  // Style
  backgroundColor: 'transparent',
  padding: '20px',
  borderRadius: '12px',
  height: 'auto',
  width: '100%',
  slideMinHeight: '400px',
  slideWidth: '300px',
  slideMaxWidth: 'none',

  // Parallax
  parallax: false,
  parallaxBackground: '',
  parallaxSensitivity: 0.5,

  // Content
  slides: [
    {
      id: 'slide-1',
      components: [],
      backgroundColor: '#ffffff',
      padding: '20px',
    },
    {
      id: 'slide-2',
      components: [],
      backgroundColor: '#f0f0f0',
      padding: '20px',
    },
    {
      id: 'slide-3',
      components: [],
      backgroundColor: '#e0e0e0',
      padding: '20px',
    },
    {
      id: 'slide-4',
      components: [],
      backgroundColor: '#d0d0d0',
      padding: '20px',
    },
    {
      id: 'slide-5',
      components: [],
      backgroundColor: '#c0c0c0',
      padding: '20px',
    },
    {
      id: 'slide-6',
      components: [],
      backgroundColor: '#b0b0b0',
      padding: '20px',
    },
  ],
}

// ✅ FIXED: Define complete schema with hover options
export const swiperContainerSchema = {
  properties: {
    // Layout Category
    direction: {
      type: 'select' as const,
      label: 'Direction',
      default: swiperContainerDefaultProps.direction,
      options: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
      ],
      category: 'Layout',
    },

    slidesPerView: {
      type: 'select' as const,
      label: 'Slides Per View',
      default: swiperContainerDefaultProps.slidesPerView,
      options: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
        { value: 'auto', label: 'Auto' },
      ],
      category: 'Layout',
    },

    slidesPerViewAuto: {
      type: 'toggle' as const,
      label: 'Auto Adjust Slides Per View',
      default: swiperContainerDefaultProps.slidesPerViewAuto,
      category: 'Layout',
    },

    spaceBetween: {
      type: 'number' as const,
      label: 'Space Between (px)',
      default: swiperContainerDefaultProps.spaceBetween,
      min: 0,
      max: 100,
      category: 'Layout',
    },

    centeredSlides: {
      type: 'toggle' as const,
      label: 'Centered Slides',
      default: swiperContainerDefaultProps.centeredSlides,
      category: 'Layout',
    },

    // Effects Category
    effect: {
      type: 'select' as const,
      label: 'Transition Effect',
      default: swiperContainerDefaultProps.effect,
      options: [
        { value: 'slide', label: 'Slide' },
        { value: 'fade', label: 'Fade' },
        { value: 'cube', label: 'Cube' },
        { value: 'coverflow', label: 'Coverflow' },
        { value: 'flip', label: 'Flip' },
        { value: 'cards', label: 'Cards' },
        { value: 'creative', label: 'Creative' },
      ],
      category: 'Effects',
    },

    // Hover Effects Category
    hoverEffects: {
      type: 'toggle' as const,
      label: 'Enable Hover Effects',
      default: swiperContainerDefaultProps.hoverEffects,
      category: 'Effects',
      description: 'Add hover animations to slides'
    },

    hoverEffectType: {
      type: 'select' as const,
      label: 'Hover Effect Type',
      default: swiperContainerDefaultProps.hoverEffectType,
      options: [
        { value: 'lift', label: 'Lift with Shadow' },
        { value: 'scale', label: 'Scale Up' },
        { value: 'glow', label: 'Glowing Border' },
        { value: 'tilt', label: '3D Tilt' },
        { value: 'minimal', label: 'Minimal (Shadow Only)' },
        { value: 'none', label: 'No Effect' }
      ],
      category: 'Effects',
      dependsOn: { hoverEffects: true }
    },

    hoverIntensity: {
      type: 'select' as const,
      label: 'Hover Intensity',
      default: swiperContainerDefaultProps.hoverIntensity,
      options: [
        { value: 'light', label: 'Light' },
        { value: 'medium', label: 'Medium' },
        { value: 'strong', label: 'Strong' }
      ],
      category: 'Effects',
      dependsOn: { hoverEffects: true }
    },

    // Behavior Category
    autoplay: {
      type: 'toggle' as const,
      label: 'Auto Play',
      default: swiperContainerDefaultProps.autoplay,
      category: 'Behavior',
    },

    autoplayDelay: {
      type: 'number' as const,
      label: 'Auto Play Delay (ms)',
      default: swiperContainerDefaultProps.autoplayDelay,
      min: 1000,
      max: 10000,
      step: 500,
      category: 'Behavior',
    },

    loop: {
      type: 'toggle' as const,
      label: 'Infinite Loop',
      default: swiperContainerDefaultProps.loop,
      category: 'Behavior',
    },

    speed: {
      type: 'number' as const,
      label: 'Transition Speed (ms)',
      default: swiperContainerDefaultProps.speed,
      min: 100,
      max: 2000,
      category: 'Behavior',
    },

    draggable: {
      type: 'toggle' as const,
      label: 'Draggable',
      default: swiperContainerDefaultProps.draggable,
      category: 'Behavior',
    },

    grabCursor: {
      type: 'toggle' as const,
      label: 'Grab Cursor',
      default: swiperContainerDefaultProps.grabCursor,
      category: 'Behavior',
    },

    freeMode: {
      type: 'toggle' as const,
      label: 'Free Mode',
      default: swiperContainerDefaultProps.freeMode,
      category: 'Behavior',
    },

    scrollContainer: {
      type: 'toggle' as const,
      label: 'Scroll Container',
      default: swiperContainerDefaultProps.scrollContainer,
      category: 'Behavior',
    },

    mousewheel: {
      type: 'toggle' as const,
      label: 'Mousewheel Control',
      default: swiperContainerDefaultProps.mousewheel,
      category: 'Behavior',
    },

    // Navigation Category
    navigation: {
      type: 'toggle' as const,
      label: 'Navigation Arrows',
      default: swiperContainerDefaultProps.navigation,
      category: 'Navigation',
    },

    pagination: {
      type: 'toggle' as const,
      label: 'Pagination',
      default: swiperContainerDefaultProps.pagination,
      category: 'Navigation',
    },

    paginationType: {
      type: 'select' as const,
      label: 'Pagination Type',
      default: swiperContainerDefaultProps.paginationType,
      options: [
        { value: 'bullets', label: 'Bullets' },
        { value: 'fraction', label: 'Fraction' },
        { value: 'progressbar', label: 'Progress Bar' },
        { value: 'custom', label: 'Custom' },
      ],
      category: 'Navigation',
    },

    paginationDynamic: {
      type: 'toggle' as const,
      label: 'Dynamic Bullets',
      default: swiperContainerDefaultProps.paginationDynamic,
      category: 'Navigation',
    },

    paginationProgress: {
      type: 'toggle' as const,
      label: 'Show Progress',
      default: swiperContainerDefaultProps.paginationProgress,
      category: 'Navigation',
    },

    scrollbar: {
      type: 'toggle' as const,
      label: 'Scrollbar',
      default: swiperContainerDefaultProps.scrollbar,
      category: 'Navigation',
    },

    // Style Category
    backgroundColor: {
      type: 'color' as const,
      label: 'Background Color',
      default: swiperContainerDefaultProps.backgroundColor,
      category: 'Style',
    },

    padding: {
      type: 'text' as const,
      label: 'Padding',
      default: swiperContainerDefaultProps.padding,
      category: 'Style',
    },

    slideMinHeight: {
      type: 'text' as const,
      label: 'Slide Min Height',
      default: swiperContainerDefaultProps.slideMinHeight,
      category: 'Style',
    },

    slideWidth: {
      type: 'text' as const,
      label: 'Slide Width',
      default: swiperContainerDefaultProps.slideWidth,
      category: 'Style',
    },

    // Parallax Category
    parallax: {
      type: 'toggle' as const,
      label: 'Parallax Effect',
      default: swiperContainerDefaultProps.parallax,
      category: 'Parallax',
    },

    parallaxBackground: {
      type: 'text' as const,
      label: 'Parallax Background URL',
      default: swiperContainerDefaultProps.parallaxBackground,
      category: 'Parallax',
    },
  },
}

// ✅ FIXED: ComponentPreview component
const ComponentPreview: React.FC<{
  component: LayoutComponent
  context: any
  onEdit?: () => void
  onDelete?: () => void
  onComponentSelect?: (component: LayoutComponent, context: any) => void
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void
}> = ({ component, context, onEdit, onDelete, onComponentSelect, onComponentUpdate }) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadComponent = async () => {
      try {
        switch (component.type) {
          case 'NewGrid':
            const NewGridModule = await import('./NewGrid')
            const NewGridComponent = NewGridModule.default || (NewGridModule as any).NewGrid
            setComponent(() => NewGridComponent)
            break
          case 'advancedImage':
            const AdvancedImageModule = await import('./AdvancedImageComponent')
            const AdvancedImageComponent = AdvancedImageModule.default || (AdvancedImageModule as any).AdvancedImageComponent
            setComponent(() => AdvancedImageComponent)
            break
          case 'advancedCard':
            const AdvancedCardModule = await import('./AdvancedCardComponent')
            const AdvancedCardComponent = AdvancedCardModule.default || (AdvancedCardModule as any).AdvancedCardComponent
            setComponent(() => AdvancedCardComponent)
            break
          case 'advancedheading':
            const AdvancedHeadingModule = await import('./AdvancedHeading')
            const AdvancedHeadingComponent = AdvancedHeadingModule.default || (AdvancedHeadingModule as any).AdvancedHeading
            setComponent(() => AdvancedHeadingComponent)
            break
          case 'advancedparagraph':
            const AdvancedParagraphModule = await import('./AdvancedParagraph')
            const AdvancedParagraphComponent = AdvancedParagraphModule.default || (AdvancedParagraphModule as any).AdvancedParagraph
            setComponent(() => AdvancedParagraphComponent)
            break
          case 'advancedbutton':
            const AdvancedButtonModule = await import('./AdvancedButton')
            const AdvancedButtonComponent = AdvancedButtonModule.default || (AdvancedButtonModule as any).AdvancedButton
            setComponent(() => AdvancedButtonComponent)
            break
          case 'carousel':
            const CarouselModule = await import('./Carousel')
            const CarouselComponent = CarouselModule.default || (CarouselModule as any).Carousel
            setComponent(() => CarouselComponent)
            break
          case 'advancedaccordion':
            const AdvancedAccordionModule = await import('./AdvancedAccordion')
            const AdvancedAccordionComponent = AdvancedAccordionModule.default || (AdvancedAccordionModule as any).AdvancedAccordion
            setComponent(() => AdvancedAccordionComponent)
            break
          case 'advancedlist':
            const AdvancedListModule = await import('./AdvancedList')
            const AdvancedListComponent = AdvancedListModule.default || (AdvancedListModule as any).AdvancedList
            setComponent(() => AdvancedListComponent)
            break
          case 'swipercontainer':
            const SwiperContainerModule = await import('./SwiperContainer')
            const SwiperContainerComponent = SwiperContainerModule.default || (SwiperContainerModule as any).SwiperContainer
            setComponent(() => SwiperContainerComponent)
            break
          default:
            setComponent(() => () => (
              <div className="p-4 border border-gray-300 rounded bg-gray-50 text-center">
                <div className="text-2xl mb-2">📦</div>
                <div className="font-medium text-gray-700">{component.type}</div>
                <div className="text-sm text-gray-500">Component Type</div>
              </div>
            ))
        }
      } catch (err) {
        console.error('Error loading component:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setComponent(() => () => (
          <div className="p-4 border border-red-300 rounded bg-red-50 text-center">
            <div className="text-red-600">Error loading {component.type}</div>
            <div className="text-xs text-red-500 mt-1">{err instanceof Error ? err.message : 'Unknown error'}</div>
          </div>
        ))
      }
    }

    loadComponent()
  }, [component.type])

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded bg-red-50 text-center">
        <div className="text-red-600">Error loading {component.type}</div>
        <div className="text-xs text-red-500 mt-1">{error}</div>
      </div>
    )
  }

  if (!Component) {
    return (
      <div className="p-4 border border-gray-300 rounded bg-gray-50 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className="relative group w-full max-w-full overflow-hidden">
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 text-xs" title="Edit Component">
          Edit
        </button>
        <button onClick={onDelete} className="bg-red-500 text-white p-1 rounded hover:bg-red-600 text-xs" title="Delete Component">
          ×
        </button>
      </div>

      <Component
        {...component.props}
        component={component}
        onUpdate={(newProps: Record<string, any>) => {
          if (onComponentUpdate) {
            onComponentUpdate(component.id, newProps)
          }
        }}
        onSelect={() => {
          if (onComponentSelect) {
            onComponentSelect(component, context)
          }
        }}
        sectionId={context.sectionId}
        containerId={context.containerId}
        rowId={context.rowId}
        colId={context.colId}
        onComponentSelect={onComponentSelect}
        onComponentUpdate={onComponentUpdate}
      />
    </div>
  )
}

// ✅ FIXED: Slide Component with Optional Hover Effects
const Slide: React.FC<{
  slide: SlideType
  slideIndex: number
  swiperId: string
  sectionId: string
  containerId: string
  onDeleteSlide: (index: number) => void
  onComponentSelect?: (component: LayoutComponent, context: any) => void
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void
  deleteComponent?: (componentId: string, context?: any) => void
  onSlideUpdate: (slideIndex: number, updatedSlide: SlideType) => void
  isEditing: boolean
  slideMinHeight: string
  hoverEffects?: boolean
  hoverEffectType?: HoverEffectType
  hoverIntensity?: HoverIntensity
  isClone?: boolean
}> = ({
  slide,
  slideIndex,
  swiperId,
  sectionId,
  containerId,
  onDeleteSlide,
  onComponentSelect,
  onComponentUpdate,
  deleteComponent,
  onSlideUpdate,
  isEditing,
  slideMinHeight,
  hoverEffects = true,
  hoverEffectType = 'lift',
  hoverIntensity = 'medium',
  isClone = false,
}) => {
  const dropZoneId = `swiper-${swiperId}-slide-${slideIndex}${isClone ? '-clone' : ''}`
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [tiltAngle, setTiltAngle] = useState({ x: 0, y: 0 })

  const { isOver, setNodeRef } = useDroppable({
    id: dropZoneId,
    data: {
      type: 'swiper-slide',
      swiperId,
      slideIndex,
      sectionId,
      containerId,
      rowId: `slide-${slideIndex}`,
      colId: 'swiper-content',
      isClone,
      accepts: [
        'text',
        'button',
        'image',
        'card',
        'grid',
        'NewGrid',
        'advancedImage',
        'advancedCard',
        'advancedheading',
        'advancedparagraph',
        'advancedbutton',
        'richtext',
        'video',
        'icon',
        'divider',
        'advancedaccordion',
        'tabs',
        'advancedlist',
        'carousel',
        'swipercontainer',
        'flexbox',
        'container',
        'spacer',
      ],
    },
  })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoverEffectType !== 'tilt' || !hoverEffects || isEditing) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Adjust tilt intensity based on hoverIntensity
    const intensityMap = {
      light: 15,
      medium: 25,
      strong: 35
    }
    
    const intensity = intensityMap[hoverIntensity] || 25
    
    setTiltAngle({
      x: (y - centerY) / intensity,
      y: (centerX - x) / intensity
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTiltAngle({ x: 0, y: 0 })
  }

  const handleComponentAction = (action: 'edit' | 'delete', childComponent: LayoutComponent, childIndex: number) => {
    if (action === 'edit' && onComponentSelect) {
      onComponentSelect(childComponent, {
        sectionId,
        containerId: containerId || swiperId,
        rowId: `slide-${slideIndex}`,
        colId: `component-${childIndex}`,
        slideIndex,
        source: 'swiper-slide' as const,
      })
    } else if (action === 'delete') {
      const updatedSlide = {
        ...slide,
        components: slide.components?.filter((_: LayoutComponent, index: number) => index !== childIndex) || [],
      }
      onSlideUpdate(slideIndex, updatedSlide)
    }
  }

  const componentCount = slide.components?.length || 0

  // Get hover effect styles based on configuration
  const getHoverStyle = () => {
    if (!hoverEffects || hoverEffectType === 'none' || isEditing) {
      return {}
    }

    const intensityMap = {
      light: { scale: 1.02, lift: 4, shadow: '0 10px 25px rgba(0, 0, 0, 0.1)' },
      medium: { scale: 1.03, lift: 8, shadow: '0 15px 35px rgba(0, 0, 0, 0.15)' },
      strong: { scale: 1.04, lift: 12, shadow: '0 20px 50px rgba(0, 0, 0, 0.2)' }
    }

    const intensity = intensityMap[hoverIntensity] || intensityMap.medium

    switch (hoverEffectType) {
      case 'lift':
        return {
          transform: `translateY(-${intensity.lift}px) scale(${intensity.scale})`,
          boxShadow: intensity.shadow,
          zIndex: 10
        }
      
      case 'scale':
        return {
          transform: `scale(${intensity.scale})`,
          zIndex: 10
        }
      
      case 'tilt':
        return {
          transform: `perspective(1000px) rotateX(${tiltAngle.x}deg) rotateY(${tiltAngle.y}deg) translateZ(20px)`,
          boxShadow: intensity.shadow,
          zIndex: 10
        }
      
      case 'minimal':
        return {
          boxShadow: intensity.shadow,
          zIndex: 10
        }
      
      case 'glow':
        return {
          transform: `translateY(-${intensity.lift}px)`,
          boxShadow: `0 0 30px rgba(59, 130, 246, 0.3), ${intensity.shadow}`,
          borderColor: '#3b82f6',
          zIndex: 10
        }
      
      default:
        return {}
    }
  }

  // Get base slide style
  const getSlideStyle = () => {
    const baseStyle = {
      backgroundColor: slide.backgroundColor || '#ffffff',
      padding: slide.padding || '20px',
      minHeight: slideMinHeight,
      height: '100%',
      overflow: 'hidden',
      position: 'relative' as const,
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: isOver 
        ? '#93c5fd' 
        : (isClone ? '#f59e0b' : '#e5e7eb'),
    }

    const hoverStyle = getHoverStyle()

    return {
      ...baseStyle,
      ...(isHovered ? hoverStyle : {})
    }
  }

  return (
    <div
      ref={setNodeRef}
      className="h-full w-full"
      style={{
        minHeight: slideMinHeight,
        height: '100%',
        position: 'relative',
      }}
      onMouseEnter={() => !isEditing && setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => !isEditing && setIsActive(true)}
      onBlur={() => !isEditing && setIsActive(false)}>
      
      {/* Hover effect overlay for glow effect */}
      {hoverEffects && hoverEffectType === 'glow' && isHovered && !isEditing && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg" />
      )}

      {/* Active Highlight Border */}
      {isActive && !isEditing && (
        <div className="absolute inset-0 z-0 border-2 border-blue-400 rounded-lg animate-pulse" />
      )}

      <div
        className={`h-full rounded-lg transition-all duration-300 ${isEditing ? 'border-2' : 'border'} ${isClone ? 'border-dashed border-yellow-400' : ''}`}
        style={getSlideStyle()}>
        
        {/* Hover Indicator */}
        {isHovered && hoverEffects && !isEditing && hoverEffectType !== 'none' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg opacity-70" />
        )}

        {isClone && isEditing && (
          <div className="absolute top-2 left-2 z-10 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded shadow-sm">
            Clone
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isHovered ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-semibold text-gray-700">Slide {slideIndex + 1}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded transition-colors duration-300 hover:bg-gray-200">
                {componentCount} component{componentCount !== 1 ? 's' : ''}
              </span>
              {isClone && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded shadow-sm">
                  Clone
                </span>
              )}
            </div>
            {isOver && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded animate-pulse flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                Drop here
              </span>
            )}
            {isHovered && hoverEffects && !isEditing && hoverEffectType !== 'none' && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                {hoverEffectType.charAt(0).toUpperCase() + hoverEffectType.slice(1)} Effect
              </span>
            )}
          </div>

          {isEditing && !isClone && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteSlide(slideIndex)
              }}
              className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-110"
              title="Delete Slide">
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <div 
          className="h-[calc(100%-60px)] overflow-y-auto pr-2">
          
          {slide.components && slide.components.length > 0 ? (
            <div className="space-y-4">
              {slide.components.map((childComponent: LayoutComponent, childIndex: number) => {
                const componentContext = {
                  sectionId,
                  containerId: containerId || swiperId,
                  rowId: `slide-${slideIndex}`,
                  colId: `component-${childIndex}`,
                  slideIndex,
                  source: 'swiper-slide' as const,
                }

                return (
                  <div
                    key={childComponent.id || `component-${childIndex}`}
                    className={`p-4 rounded-lg border transition-all duration-300 hover:border-blue-300 hover:shadow-md ${
                      isEditing ? 'border-2 border-blue-200 bg-blue-50/30' : 'border-gray-200 bg-gray-50/30'
                    }`}>
                    {isEditing && (
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-blue-200">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-700 text-sm capitalize">{childComponent.type.replace('advanced', '')}</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">#{childIndex + 1}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-all duration-200 hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleComponentAction('edit', childComponent, childIndex)
                            }}
                            title="Edit Component">
                            Edit
                          </button>
                          <button
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-all duration-200 hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleComponentAction('delete', childComponent, childIndex)
                            }}
                            title="Delete Component">
                            ×
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mt-2 transform transition-transform duration-300 hover:scale-[1.01]">
                      <ComponentPreview
                        component={childComponent}
                        context={componentContext}
                        onEdit={() => handleComponentAction('edit', childComponent, childIndex)}
                        onDelete={() => handleComponentAction('delete', childComponent, childIndex)}
                        onComponentSelect={onComponentSelect}
                        onComponentUpdate={onComponentUpdate}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div 
              className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}>
              <div className="text-4xl mb-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-300">📦</div>
              <p className="text-gray-600 font-medium mb-2 group-hover:text-blue-600 transition-colors duration-300">Empty Slide</p>
              <p className="text-gray-500 text-sm mb-4 group-hover:text-blue-500 transition-colors duration-300">
                {isEditing ? 'Drop components here or add from the toolbar' : 'No content in this slide'}
              </p>
              {isEditing && (
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-300 transform hover:scale-105">
                  + Add Component
                </button>
              )}
              {isHovered && !isEditing && (
                <div className="mt-4 text-xs text-gray-400 animate-pulse">
                  Click to select this slide
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom hover indicator */}
        {isHovered && hoverEffects && !isEditing && hoverEffectType !== 'none' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-lg opacity-50" />
        )}
      </div>
    </div>
  )
}

// ✅ FIXED: SwiperContainer Component
const SwiperContainer: React.FC<SwiperContainerProps> = ({
  id,
  component: propComponent,
  slides: propSlides = [],
  onUpdate,
  onComponentSelect,
  onComponentUpdate,
  deleteComponent,
  sectionId = '',
  containerId = '',
  rowId = '',
  colId = '',
  isEditing = true,
  hoverEffects = true,
  hoverEffectType = 'lift',
  hoverIntensity = 'medium',
  ...props
}) => {
  const componentProps = { ...swiperContainerDefaultProps, ...props, hoverEffects, hoverEffectType, hoverIntensity }
  const componentId = id || propComponent?.id || `swiper-${Date.now()}`

  // Get initial slides
  const getCurrentSlides = (): SlideType[] => {
    if (propComponent?.props?.slides) {
      return propComponent.props.slides
    }
    if (propSlides && propSlides.length > 0) {
      return propSlides
    }
    return componentProps.slides
  }

  const [currentSlides, setCurrentSlides] = useState<SlideType[]>(getCurrentSlides())
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)
  const [autoPlayActive, setAutoPlayActive] = useState(componentProps.autoplay)
  const updateTimeoutRef = useRef<NodeJS.Timeout>()

  // Update slides when props change
  useEffect(() => {
    const newSlides = getCurrentSlides()
    setCurrentSlides(newSlides)
  }, [propComponent, propSlides, componentProps.slides])

  const getSlidesPerView = (): number | 'auto' => {
    const effect = componentProps.effect || 'slide'
    
    // ✅ FIXED: Use string array includes for type safety
    const specialEffects: SwiperEffect[] = ['fade', 'cube', 'flip', 'cards', 'creative']
    if (specialEffects.includes(effect as SwiperEffect)) {
      return 1
    }
    
    const slidesPerView = componentProps.slidesPerView
    if (typeof slidesPerView === 'string') {
      if (slidesPerView === 'auto') return 'auto'
      const parsed = parseInt(slidesPerView)
      return isNaN(parsed) ? 1 : parsed
    }
    
    return slidesPerView
  }

  // Calculate if loop should be enabled
  const shouldEnableLoop = useMemo(() => {
    if (!componentProps.loop) return false
    
    const effect = componentProps.effect || 'slide'
    const slidesPerView = getSlidesPerView()
    const slidesCount = currentSlides.length
    
    // ✅ FIXED: Use string array includes for type safety
    const fadeFlipCreative: SwiperEffect[] = ['fade', 'flip', 'creative']
    const cubeCoverflowCards: SwiperEffect[] = ['cube', 'coverflow', 'cards']
    
    if (fadeFlipCreative.includes(effect as SwiperEffect)) {
      return slidesCount >= 3
    }
    
    if (cubeCoverflowCards.includes(effect as SwiperEffect)) {
      return slidesCount >= 4
    }
    
    // For slide effect, calculate based on slidesPerView
    if (effect === 'slide') {
      const spv = typeof slidesPerView === 'number' ? slidesPerView : 1
      
      // Minimum required: slidesPerView + 2 (for centeredSlides) OR slidesPerView + 1
      if (componentProps.centeredSlides) {
        return slidesCount >= spv + 2
      }
      return slidesCount >= spv + 1
    }
    
    return false
  }, [componentProps.loop, componentProps.effect, componentProps.centeredSlides, currentSlides.length, componentProps.slidesPerView])

  // Handle adding a new slide
  const handleAddSlide = () => {
    const newSlide: SlideType = {
      id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      components: [],
      backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      padding: '20px',
    }

    const updatedSlides = [...currentSlides, newSlide]
    updateComponent({ slides: updatedSlides })

    setTimeout(() => {
      if (swiperInstance) {
        swiperInstance.slideTo(updatedSlides.length - 1)
      }
    }, 100)
  }

  // Handle deleting a slide
  const handleDeleteSlide = (slideIndex: number) => {
    if (currentSlides.length <= 1) return

    const updatedSlides = currentSlides.filter((_: SlideType, index: number) => index !== slideIndex)
    updateComponent({ slides: updatedSlides })
  }

  // Handle slide updates
  const handleSlideUpdate = (slideIndex: number, updatedSlide: SlideType) => {
    const updatedSlides = [...currentSlides]
    updatedSlides[slideIndex] = updatedSlide
    updateComponent({ slides: updatedSlides })
  }

  // Update component props
  const updateComponent = (newProps: Record<string, any>) => {
    if (newProps.slides) {
      setCurrentSlides(newProps.slides)
    }

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    updateTimeoutRef.current = setTimeout(() => {
      if (onUpdate) {
        onUpdate(newProps)
      }
    }, 300)
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  // Toggle autoplay
  const toggleAutoPlay = () => {
    if (!swiperInstance) return

    if (autoPlayActive) {
      swiperInstance.autoplay?.stop()
    } else {
      swiperInstance.autoplay?.start()
    }
    setAutoPlayActive(!autoPlayActive)
  }

  // Get required modules
  const getSwiperModules = () => {
    const effect = componentProps.effect || 'slide'
    const modules = [
      Navigation,
      Pagination,
      Autoplay,
      Mousewheel,
      Scrollbar,
      FreeMode,
      Keyboard,
      Controller
    ]

    // ✅ FIXED: Use type-safe comparisons
    if (effect === 'fade') modules.push(EffectFade)
    if (effect === 'cube') modules.push(EffectCube)
    if (effect === 'coverflow') modules.push(EffectCoverflow)
    if (effect === 'flip') modules.push(EffectFlip)
    if (effect === 'cards') modules.push(EffectCards)
    if (effect === 'creative') modules.push(EffectCreative)
    if (componentProps.parallax) modules.push(Parallax)

    return modules
  }

  // Get effect configuration
  const getEffectConfig = () => {
    const effect = componentProps.effect || 'slide'

    // ✅ FIXED: Use a type-safe switch statement
    switch (effect) {
      case 'fade':
        return {
          fadeEffect: {
            crossFade: Boolean(componentProps.effectFadeCrossFade),
          },
        }
      case 'cube':
        return {
          cubeEffect: {
            shadow: Boolean(componentProps.effectCubeShadow),
            shadowScale: parseFloat(String(componentProps.effectCubeShadowScale)) || 0.94,
            slideShadows: true,
          },
        }
      case 'coverflow':
        return {
          coverflowEffect: {
            rotate: parseFloat(String(componentProps.effectCoverflowRotate)) || 30,
            stretch: parseFloat(String(componentProps.effectCoverflowStretch)) || 0,
            depth: parseFloat(String(componentProps.effectCoverflowDepth)) || 100,
            modifier: 1,
            slideShadows: true,
          },
        }
      case 'flip':
        return {
          flipEffect: {
            slideShadows: Boolean(componentProps.effectFlipSlideShadows),
            limitRotation: Boolean(componentProps.effectFlipLimitRotation),
          },
        }
      case 'cards':
        return {
          cardsEffect: {
            perSlideOffset: parseFloat(String(componentProps.effectCardsPerSlideOffset)) || 8,
            perSlideRotate: 2,
            rotate: true,
            slideShadows: true,
          },
        }
      case 'creative':
        return {
          creativeEffect: {
            prev: componentProps.effectCreativePrev || { translate: ['-120%', 0, -500] },
            next: componentProps.effectCreativeNext || { translate: ['120%', 0, -500] },
            perspective: true,
          },
        }
      default:
        return {}
    }
  }

  // Get Swiper configuration
  const getSwiperConfig = () => {
    const effect = componentProps.effect || 'slide'
    const slidesPerView = getSlidesPerView()
    
    const config: any = {
      modules: getSwiperModules(),
      direction: componentProps.direction as 'horizontal' | 'vertical',
      slidesPerView: slidesPerView,
      spaceBetween: parseFloat(String(componentProps.spaceBetween)) || 20,
      speed: parseFloat(String(componentProps.speed)) || 500,
      
      // Navigation
      grabCursor: isEditing ? false : Boolean(componentProps.grabCursor),
      allowTouchMove: isEditing ? false : Boolean(componentProps.draggable),
      mousewheel: isEditing ? false : {
        enabled: Boolean(componentProps.mousewheel),
        forceToAxis: Boolean(componentProps.mousewheelForceToAxis),
        sensitivity: parseFloat(String(componentProps.mousewheelSensitivity)) || 1,
      },
      
      // ✅ FIXED: Type-safe effect handling
      effect: effect !== 'slide' ? effect : undefined,
      freeMode: effect === 'slide' && Boolean(componentProps.freeMode),
      
      // Loop
      loop: shouldEnableLoop,
      
      // Observer
      observer: true,
      observeParents: true,
      watchSlidesProgress: true,
      watchOverflow: true,
      resistance: true,
      resistanceRatio: 0.85,
      slideToClickedSlide: true,
    }

    // ✅ FIXED: Type-safe centeredSlides
    if (effect === 'coverflow') {
      config.centeredSlides = true
    } else {
      config.centeredSlides = Boolean(componentProps.centeredSlides)
    }

    // Navigation
    if (componentProps.navigation) {
      config.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        disabledClass: 'swiper-button-disabled',
      }
    }

    // Pagination
    if (componentProps.pagination && !isEditing) {
      config.pagination = {
        clickable: true,
        type: componentProps.paginationType as 'bullets' | 'fraction' | 'progressbar',
        dynamicBullets: Boolean(componentProps.paginationDynamic),
        dynamicMainBullets: 3,
        renderBullet: function (index: number, className: string) {
          return `<span class="${className} swiper-pagination-bullet-custom"></span>`
        }
      }
    }

    // Autoplay - only with loop enabled
    if (componentProps.autoplay && shouldEnableLoop && !isEditing) {
      config.autoplay = {
        delay: parseFloat(String(componentProps.autoplayDelay)) || 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        stopOnLastSlide: false,
        waitForTransition: true,
      }
    }

    // Keyboard - only when not editing
    if (!isEditing) {
      config.keyboard = {
        enabled: true,
        onlyInViewport: true,
        pageUpDown: true,
      }
    }

    // Scrollbar - only when not editing
    if (componentProps.scrollbar && !isEditing) {
      config.scrollbar = {
        draggable: Boolean(componentProps.scrollbarDraggable),
        snapOnRelease: Boolean(componentProps.scrollbarSnapOnRelease),
        hide: false,
        dragSize: 'auto'
      }
    }

    // Parallax
    if (componentProps.parallax) {
      config.parallax = true
    }

    // Add effect-specific config
    const effectConfig = getEffectConfig()
    return { ...config, ...effectConfig }
  }

  // Manual navigation handlers
  const goNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext()
    }
  }

  const goPrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev()
    }
  }

  // Container style
  const containerStyle = {
    backgroundColor: componentProps.backgroundColor,
    padding: componentProps.padding,
    borderRadius: componentProps.borderRadius,
    width: '100%',
    maxWidth: '100%',
    position: 'relative' as const,
    overflow: 'visible',
    boxSizing: 'border-box' as const,
  }

  return (
    <div
      style={containerStyle}
      className={`swiper-container-wrapper`}
      data-swiper-id={componentId}
      data-section-id={sectionId}
      data-loop-enabled={shouldEnableLoop}
      data-slides-count={currentSlides.length}
      data-hover-effects={componentProps.hoverEffects}
      data-hover-effect-type={componentProps.hoverEffectType}
      data-hover-intensity={componentProps.hoverIntensity}>
      
      {/* Parallax Background */}
      {componentProps.parallax && componentProps.parallaxBackground && (
        <div
          className="swiper-parallax absolute inset-0 z-0 bg-cover bg-center"
          data-swiper-parallax="-30%"
          style={{
            backgroundImage: `url(${componentProps.parallaxBackground})`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Swiper Carousel</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {componentProps.effect} effect
                </span>
                <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {currentSlides.length} slide{currentSlides.length !== 1 ? 's' : ''}
                </span>
                {componentProps.hoverEffects && componentProps.hoverEffectType !== 'none' && (
                  <span className="text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-2 py-1 rounded">
                    🎯 {componentProps.hoverEffectType} hover ({componentProps.hoverIntensity})
                  </span>
                )}
                {!componentProps.hoverEffects && (
                  <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    🔴 Hover Effects: Off
                  </span>
                )}
                {componentProps.autoplay && shouldEnableLoop && (
                  <span className={`text-sm px-2 py-1 rounded ${autoPlayActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {autoPlayActive ? '▶️ Auto-play' : '⏸️ Paused'}
                  </span>
                )}
                {componentProps.loop && !shouldEnableLoop && (
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center gap-1">
                    <AlertCircle size={12} />
                    Need {getSlidesPerView() === 1 ? '3' : `${getSlidesPerView()}+`} slides for loop
                  </span>
                )}
                {shouldEnableLoop && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    🔄 Infinite Loop Active
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {componentProps.autoplay && shouldEnableLoop && !isEditing && (
              <button
                onClick={toggleAutoPlay}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  autoPlayActive ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title={autoPlayActive ? 'Pause Autoplay' : 'Play Autoplay'}>
                {autoPlayActive ? <Pause size={16} /> : <Play size={16} />}
                {autoPlayActive ? 'Pause' : 'Play'}
              </button>
            )}
            {isEditing && (
              <button
                onClick={handleAddSlide}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                title="Add New Slide">
                <Plus size={18} />
                Add Slide
              </button>
            )}
          </div>
        </div>

        {/* Main Swiper Container */}
        <div className="relative">
          {/* Manual navigation buttons */}
          {componentProps.navigation && (
            <>
              <button
                onClick={goPrev}
                className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={!shouldEnableLoop && swiperInstance?.isBeginning}
                title="Previous slide">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={goNext}
                className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={!shouldEnableLoop && swiperInstance?.isEnd}
                title="Next slide">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <Swiper
            {...getSwiperConfig()}
            onSwiper={(swiper: SwiperType) => {
              setSwiperInstance(swiper)
            }}
            className={`swiper-editor ${isEditing ? 'swiper-editing' : 'swiper-preview'}`}
            style={{
              '--swiper-navigation-color': '#3b82f6',
              '--swiper-pagination-color': '#3b82f6',
              '--swiper-pagination-bullet-size': '8px',
              '--swiper-pagination-bullet-inactive-color': '#d1d5db',
              '--swiper-pagination-bullet-inactive-opacity': '1',
              '--swiper-navigation-size': '24px',
              paddingLeft: componentProps.navigation ? '40px' : '0',
              paddingRight: componentProps.navigation ? '40px' : '0',
            } as React.CSSProperties}>
            
            {currentSlides.map((slide: SlideType, index: number) => (
              <SwiperSlide key={slide.id} className="!h-auto !flex items-stretch">
                <Slide
                  slide={slide}
                  slideIndex={index}
                  swiperId={componentId}
                  sectionId={sectionId}
                  containerId={containerId || componentId}
                  onDeleteSlide={handleDeleteSlide}
                  onComponentSelect={onComponentSelect}
                  onComponentUpdate={onComponentUpdate}
                  deleteComponent={deleteComponent}
                  onSlideUpdate={handleSlideUpdate}
                  isEditing={isEditing}
                  slideMinHeight={componentProps.slideMinHeight}
                  hoverEffects={componentProps.hoverEffects}
                  hoverEffectType={componentProps.hoverEffectType}
                  hoverIntensity={componentProps.hoverIntensity}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Swiper's default navigation (still works) */}
          {componentProps.navigation && (
            <>
              <div className="swiper-button-next !hidden md:!flex" />
              <div className="swiper-button-prev !hidden md:!flex" />
            </>
          )}
        </div>

        {/* Swiper 12 pagination container */}
        {componentProps.pagination && !isEditing && (
          <div className="swiper-pagination !bottom-0 !relative mt-4" />
        )}

        {/* Slide counter and pagination */}
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="text-sm text-gray-600">
            Slide {swiperInstance ? swiperInstance.activeIndex + 1 : 1} of {currentSlides.length}
          </div>
          
          {/* Custom pagination dots for better visibility */}
          {currentSlides.length > 0 && (
            <div className="flex items-center gap-1">
              {currentSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => swiperInstance?.slideTo(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    swiperInstance?.activeIndex === index 
                      ? 'bg-blue-600 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  title={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {currentSlides.length === 0 && (
          <div className="min-h-[400px] border-3 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-6xl mb-6 text-gray-400">🔄</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Slides Yet</h3>
            <p className="text-gray-500 mb-8 max-w-md text-lg">
              Start by adding slides to create an interactive carousel with {componentProps.effect} effect.
            </p>
            <button
              onClick={handleAddSlide}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center gap-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all">
              <Plus size={24} />
              Create First Slide
            </button>
          </div>
        )}
      </div>

      {/* Global CSS */}
      <style jsx global>{`
        /* ===== SWIPER CONTAINER BASE STYLES ===== */
        .swiper-container-wrapper {
          position: relative;
          overflow: visible !important;
        }
        
        /* ===== EDITOR MODE STYLES ===== */
        .swiper-editor.swiper-editing .swiper-wrapper {
          overflow: visible !important;
        }
        
        .swiper-editor.swiper-editing .swiper-slide {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
          filter: none !important;
        }
        
        .swiper-editor .swiper-slide {
          height: auto;
          display: flex;
          align-items: stretch;
          box-sizing: border-box;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), 
                      opacity 0.5s ease,
                      box-shadow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        /* ===== HOVER EFFECTS ===== */
        
        /* Hover effects only apply when enabled and not in edit mode */
        .swiper-editor:not(.swiper-editing) .swiper-slide:hover {
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), 
                      box-shadow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.3s ease !important;
        }
        
        /* Lift hover effect */
        .swiper-editor[data-hover-effects="true"][data-hover-effect-type="lift"] .swiper-slide:not(.swiper-editing):hover {
          transform: translateY(-8px) scale(1.03) !important;
          z-index: 50 !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15),
                      0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Scale hover effect */
        .swiper-editor[data-hover-effects="true"][data-hover-effect-type="scale"] .swiper-slide:not(.swiper-editing):hover {
          transform: scale(1.03) !important;
          z-index: 50 !important;
        }
        
        /* Glow hover effect */
        .swiper-editor[data-hover-effects="true"][data-hover-effect-type="glow"] .swiper-slide:not(.swiper-editing):hover {
          transform: translateY(-4px) !important;
          z-index: 50 !important;
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.3),
                      0 15px 35px rgba(0, 0, 0, 0.15) !important;
          border-color: #3b82f6 !important;
        }
        
        /* Minimal hover effect */
        .swiper-editor[data-hover-effects="true"][data-hover-effect-type="minimal"] .swiper-slide:not(.swiper-editing):hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
          z-index: 50 !important;
        }
        
        /* Intensity variations */
        .swiper-editor[data-hover-effects="true"][data-hover-intensity="light"] .swiper-slide:not(.swiper-editing):hover {
          transform: translateY(-4px) scale(1.02) !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }
        
        .swiper-editor[data-hover-effects="true"][data-hover-intensity="strong"] .swiper-slide:not(.swiper-editing):hover {
          transform: translateY(-12px) scale(1.04) !important;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2) !important;
        }
        
        /* Tilt effect needs special handling - done inline in component */
        
        /* Disabled hover effects */
        .swiper-editor[data-hover-effects="false"] .swiper-slide:not(.swiper-editing):hover,
        .swiper-editor[data-hover-effect-type="none"] .swiper-slide:not(.swiper-editing):hover {
          transform: none !important;
          box-shadow: none !important;
          z-index: auto !important;
        }
        
        /* ===== PARTIAL VISIBILITY SLIDES ===== */
        .swiper-slide {
          visibility: visible !important;
        }
        
        .swiper-slide:not(.swiper-slide-visible):not(:hover) {
          opacity: 0.4 !important;
        }
        
        /* When non-visible slide is hovered */
        .swiper-slide:not(.swiper-slide-visible):hover {
          opacity: 1 !important;
          filter: none !important;
        }
        
        /* ===== NAVIGATION BUTTONS ===== */
        .swiper-button-prev-custom,
        .swiper-button-next-custom {
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        .swiper-editing .swiper-button-prev-custom,
        .swiper-editing .swiper-button-next-custom {
          display: flex !important;
        }
        
        /* Swiper default navigation buttons */
        .swiper-button-next,
        .swiper-button-prev {
          background-color: rgba(255, 255, 255, 0.9);
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: none;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }
        
        @media (min-width: 768px) {
          .swiper-button-next,
          .swiper-button-prev {
            display: flex;
          }
          
          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            display: none;
          }
        }
        
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 16px;
          color: #374151;
          font-weight: bold;
        }
        
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .swiper-button-disabled {
          opacity: 0.35;
          cursor: not-allowed;
          pointer-events: none;
        }
        
        /* ===== PAGINATION STYLING ===== */
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          opacity: 1;
        }
        
        .swiper-pagination-bullet-active {
          background: #3b82f6;
          transform: scale(1.2);
        }
        
        /* ===== EDITOR MODE SPECIFIC ===== */
        .swiper-editing {
          cursor: default !important;
        }
        
        .swiper-editing .swiper-slide {
          cursor: default !important;
        }
        
        /* Disable hover effects in editor mode */
        .swiper-editing .swiper-slide:hover {
          transform: none !important;
          box-shadow: none !important;
          z-index: auto !important;
        }
        
        /* ===== TOUCH DEVICE OPTIMIZATION ===== */
        @media (hover: none) and (pointer: coarse) {
          .swiper-editor .swiper-slide:not(.swiper-editing):hover {
            transform: none !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
          }
        }
        
        /* ===== DARK MODE SUPPORT ===== */
        @media (prefers-color-scheme: dark) {
          .swiper-button-next,
          .swiper-button-prev {
            background-color: rgba(30, 41, 59, 0.9);
            border-color: rgba(59, 130, 246, 0.3); 
          }
          
          .swiper-button-next:after,
          .swiper-button-prev:after {
            color: #e5e7eb;
          }
          
          .swiper-pagination-bullet {
            background: #475569;
          }
          
          .swiper-pagination-bullet-active {
            background: #3b82f6;
          }
        }
      `}</style>
    </div>
  )
}

;(SwiperContainer as any).schema = swiperContainerSchema

export default SwiperContainer