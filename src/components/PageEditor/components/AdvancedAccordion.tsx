// src/components/PageEditor/components/AdvancedAccordion.tsx
'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'

// ==================== TYPES ====================
export interface AccordionItem {
  id: string
  title: string
  content: string
  visible: boolean
}

export interface AdvancedAccordionProps {
  // Core Content
  items: AccordionItem[]
  
  // Behavior
  behavior: 'single' | 'multiple'
  allowAllClosed: boolean
  
  // Layout & Spacing
  itemSpacing: string
  padding: string
  margin: string
  
  // Typography
  titleFontSize: string
  titleFontWeight: string
  contentFontSize: string
  fontFamily: string
  lineHeight: string
  
  // Colors & Styling
  titleColor: string
  titleBackground: string
  contentColor: string
  contentBackground: string
  border: string
  borderRadius: string
  activeTitleColor: string
  activeTitleBackground: string
  
  // Icons & Animation
  iconPosition: 'left' | 'right'
  icon: string
  activeIcon: string
  animation: 'slide' | 'fade' | 'none'
  animationDuration: number

  // Callbacks
  onUpdate?: (props: Partial<AdvancedAccordionProps>) => void
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void
  componentId?: string
  onSelect?: () => void
}

// ==================== DEFAULT PROPS ====================
export const advancedAccordionDefaultProps: AdvancedAccordionProps = {
  // Core Content
  items: [
    {
      id: '1',
      title: 'Frequently Asked Question 1',
      content: 'This is the detailed answer for the first question.',
      visible: true,
    },
    {
      id: '2',
      title: 'Frequently Asked Question 2',
      content: 'This is the detailed answer for the second question.',
      visible: true,
    },
  ],

  // Behavior
  behavior: 'single',
  allowAllClosed: false,

  // Layout & Spacing
  itemSpacing: '8px',
  padding: '0px',
  margin: '0px',

  // Typography
  titleFontSize: '16px',
  titleFontWeight: '600',
  contentFontSize: '14px',
  fontFamily: 'system-ui, sans-serif',
  lineHeight: '1.5',

  // Colors & Styling
  titleColor: '#1f2937',
  titleBackground: '#f9fafb',
  contentColor: '#4b5563',
  contentBackground: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  activeTitleColor: '#1f2937',
  activeTitleBackground: '#f3f4f6',

  // Icons & Animation
  iconPosition: 'right',
  icon: '▼',
  activeIcon: '▲',
  animation: 'slide',
  animationDuration: 300,

  // Callbacks (defaults)
  onUpdate: undefined,
  onComponentUpdate: undefined,
  componentId: '',
  onSelect: undefined,
}

// ==================== SCHEMA ====================
export const advancedAccordionSchema = {
  properties: {
    // Content Tab
    items: {
      type: 'accordion-items' as any,
      label: 'Accordion Items',
      default: advancedAccordionDefaultProps.items,
      description: 'Manage accordion sections with titles and content',
      category: 'Content',
    },

    // Behavior Tab
    behavior: {
      type: 'select' as const,
      label: 'Behavior',
      default: advancedAccordionDefaultProps.behavior,
      options: [
        { value: 'single', label: 'Single (only one open)' },
        { value: 'multiple', label: 'Multiple (multiple can open)' },
      ],
      category: 'Behavior',
    },
    allowAllClosed: {
      type: 'toggle' as const,
      label: 'Allow All Closed',
      default: advancedAccordionDefaultProps.allowAllClosed,
      description: 'Allow closing all accordion items',
      category: 'Behavior',
    },

    // Layout Tab
    itemSpacing: {
      type: 'text' as const,
      label: 'Item Spacing',
      default: advancedAccordionDefaultProps.itemSpacing,
      category: 'Layout',
    },
    padding: {
      type: 'text' as const,
      label: 'Padding',
      default: advancedAccordionDefaultProps.padding,
      category: 'Layout',
    },
    margin: {
      type: 'text' as const,
      label: 'Margin',
      default: advancedAccordionDefaultProps.margin,
      category: 'Layout',
    },

    // Typography Tab
    titleFontSize: {
      type: 'text' as const,
      label: 'Title Font Size',
      default: advancedAccordionDefaultProps.titleFontSize,
      category: 'Typography',
    },
    titleFontWeight: {
      type: 'select' as const,
      label: 'Title Font Weight',
      default: advancedAccordionDefaultProps.titleFontWeight,
      options: [
        { value: '400', label: 'Normal' },
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semi Bold' },
        { value: '700', label: 'Bold' },
        { value: '800', label: 'Extra Bold' },
      ],
      category: 'Typography',
    },
    contentFontSize: {
      type: 'text' as const,
      label: 'Content Font Size',
      default: advancedAccordionDefaultProps.contentFontSize,
      category: 'Typography',
    },
    fontFamily: {
      type: 'select' as const,
      label: 'Font Family',
      default: advancedAccordionDefaultProps.fontFamily,
      options: [
        { value: 'system-ui, sans-serif', label: 'System Default' },
        { value: 'Inter, sans-serif', label: 'Inter' },
        { value: 'Roboto, sans-serif', label: 'Roboto' },
        { value: 'Georgia, serif', label: 'Georgia' },
        { value: 'Monaco, monospace', label: 'Monospace' },
      ],
      category: 'Typography',
    },
    lineHeight: {
      type: 'text' as const,
      label: 'Line Height',
      default: advancedAccordionDefaultProps.lineHeight,
      category: 'Typography',
    },

    // Colors Tab
    titleColor: {
      type: 'color' as const,
      label: 'Title Color',
      default: advancedAccordionDefaultProps.titleColor,
      category: 'Colors',
    },
    titleBackground: {
      type: 'color' as const,
      label: 'Title Background',
      default: advancedAccordionDefaultProps.titleBackground,
      category: 'Colors',
    },
    contentColor: {
      type: 'color' as const,
      label: 'Content Color',
      default: advancedAccordionDefaultProps.contentColor,
      category: 'Colors',
    },
    contentBackground: {
      type: 'color' as const,
      label: 'Content Background',
      default: advancedAccordionDefaultProps.contentBackground,
      category: 'Colors',
    },
    border: {
      type: 'text' as const,
      label: 'Border',
      default: advancedAccordionDefaultProps.border,
      category: 'Colors',
    },
    borderRadius: {
      type: 'text' as const,
      label: 'Border Radius',
      default: advancedAccordionDefaultProps.borderRadius,
      category: 'Colors',
    },
    activeTitleColor: {
      type: 'color' as const,
      label: 'Active Title Color',
      default: advancedAccordionDefaultProps.activeTitleColor,
      category: 'Colors',
    },
    activeTitleBackground: {
      type: 'color' as const,
      label: 'Active Title Background',
      default: advancedAccordionDefaultProps.activeTitleBackground,
      category: 'Colors',
    },

    // Icons & Animation Tab
    iconPosition: {
      type: 'select' as const,
      label: 'Icon Position',
      default: advancedAccordionDefaultProps.iconPosition,
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
      category: 'Icons & Animation',
    },
    icon: {
      type: 'text' as const,
      label: 'Closed Icon',
      default: advancedAccordionDefaultProps.icon,
      description: 'Icon shown when item is closed',
      category: 'Icons & Animation',
    },
    activeIcon: {
      type: 'text' as const,
      label: 'Open Icon',
      default: advancedAccordionDefaultProps.activeIcon,
      description: 'Icon shown when item is open',
      category: 'Icons & Animation',
    },
    animation: {
      type: 'select' as const,
      label: 'Animation',
      default: advancedAccordionDefaultProps.animation,
      options: [
        { value: 'slide', label: 'Slide' },
        { value: 'fade', label: 'Fade' },
        { value: 'none', label: 'None' },
      ],
      category: 'Icons & Animation',
    },
    animationDuration: {
      type: 'number' as const,
      label: 'Animation Duration (ms)',
      default: advancedAccordionDefaultProps.animationDuration,
      min: 0,
      max: 1000,
      step: 50,
      category: 'Icons & Animation',
    },
  },
}

// ==================== ACCORDION ITEM COMPONENT ====================
const AccordionItem: React.FC<{
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
  props: Omit<AdvancedAccordionProps, 'onUpdate' | 'onComponentUpdate' | 'componentId' | 'onSelect'>
}> = ({ item, isOpen, onToggle, props }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current && isOpen) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [isOpen, item.content])

  const itemStyle: React.CSSProperties = {
    marginBottom: props.itemSpacing || '8px',
    border: props.border || '1px solid #e5e7eb',
    borderRadius: props.borderRadius || '8px',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  }

  const headerStyle: React.CSSProperties = {
    padding: '16px 20px',
    backgroundColor: isOpen ? props.activeTitleBackground : props.titleBackground,
    color: isOpen ? props.activeTitleColor : props.titleColor,
    fontSize: props.titleFontSize || '16px',
    fontWeight: props.titleFontWeight || '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  }

  const contentStyle: React.CSSProperties = {
    backgroundColor: props.contentBackground || '#ffffff',
    color: props.contentColor || '#4b5563',
    fontSize: props.contentFontSize || '14px',
    overflow: 'hidden',
    transition: props.animation !== 'none' ? `all ${props.animationDuration}ms ease` : 'none',
  }

  // Apply animation
  if (props.animation === 'slide') {
    contentStyle.maxHeight = isOpen ? `${contentHeight}px` : '0px'
    contentStyle.opacity = isOpen ? 1 : 0.8
  } else if (props.animation === 'fade') {
    contentStyle.maxHeight = isOpen ? 'none' : '0px'
    contentStyle.opacity = isOpen ? 1 : 0
  } else {
    contentStyle.display = isOpen ? 'block' : 'none'
  }

  const icon = isOpen ? props.activeIcon || '▲' : props.icon || '▼'

  return (
    <div style={itemStyle} className="accordion-item">
      <button
        style={headerStyle}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${item.id}`}
        className="accordion-header focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {props.iconPosition === 'left' && (
          <span className="accordion-icon" style={{ fontSize: '12px', minWidth: '16px' }}>
            {icon}
          </span>
        )}

        <span className="accordion-title flex-1" style={{ textAlign: 'left' }}>
          {item.title}
        </span>

        {props.iconPosition !== 'left' && (
          <span className="accordion-icon" style={{ fontSize: '12px', minWidth: '16px' }}>
            {icon}
          </span>
        )}
      </button>

      <div
        ref={contentRef}
        style={contentStyle}
        id={`accordion-content-${item.id}`}
        aria-labelledby={`accordion-header-${item.id}`}
        role="region"
        className="accordion-content"
      >
        <div style={{ padding: '20px', lineHeight: props.lineHeight }}>
          {item.content}
        </div>
      </div>
    </div>
  )
}

// ==================== MAIN ACCORDION COMPONENT ====================
const AdvancedAccordion: React.FC<AdvancedAccordionProps> = (props) => {
  const { onUpdate, onComponentUpdate, componentId, onSelect, ...accordionProps } = props
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['1']))
  
  // Initialize with first item open if allowAllClosed is false
  useEffect(() => {
    if (!accordionProps.allowAllClosed && accordionProps.items.length > 0 && openItems.size === 0) {
      setOpenItems(new Set([accordionProps.items[0].id]))
    }
  }, [accordionProps.allowAllClosed, accordionProps.items, openItems.size])

  const items = useMemo(() => {
    return accordionProps.items.filter(item => item.visible !== false)
  }, [accordionProps.items])

  const toggleItem = useCallback((itemId: string) => {
    setOpenItems(prev => {
      const newOpenItems = new Set(prev)
      
      if (accordionProps.behavior === 'single') {
        newOpenItems.clear()
        if (!prev.has(itemId) || accordionProps.allowAllClosed) {
          newOpenItems.add(itemId)
        }
      } else {
        if (newOpenItems.has(itemId)) {
          newOpenItems.delete(itemId)
        } else {
          newOpenItems.add(itemId)
        }
      }
      
      return newOpenItems
    })
  }, [accordionProps.behavior, accordionProps.allowAllClosed])

  const isItemOpen = useCallback((itemId: string) => {
    return openItems.has(itemId)
  }, [openItems])

  const accordionStyle: React.CSSProperties = {
    padding: accordionProps.padding,
    margin: accordionProps.margin,
    fontFamily: accordionProps.fontFamily,
    lineHeight: accordionProps.lineHeight,
    cursor: 'pointer',
  }

  if (items.length === 0) {
    return (
      <div style={accordionStyle} className="accordion-empty-state p-4 text-center text-gray-500 border border-dashed rounded-lg">
        <p>No accordion items to display. Add some items in the editor.</p>
      </div>
    )
  }

  return (
    <div style={accordionStyle} className="advanced-accordion" onClick={onSelect}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={isItemOpen(item.id)}
          onToggle={() => toggleItem(item.id)}
          props={accordionProps}
        />
      ))}
    </div>
  )
}

export default AdvancedAccordion