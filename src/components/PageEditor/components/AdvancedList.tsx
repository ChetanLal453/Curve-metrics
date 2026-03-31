'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import * as FaIcons from 'react-icons/fa'
import * as Fa6Icons from 'react-icons/fa6'

// ==================== TYPES ====================
export interface ListItem {
  id: string
  title: string
  description: string
  visible: boolean
  iconType: 'emoji' | 'image' | 'number' | 'fontawesome'
  iconEmoji: string
  iconImage: string
  iconFontAwesome: string
  iconNumber: number
  order: number
}

export interface AdvancedListProps {
  // Core Content
  items: ListItem[]
  
  // List Type
  listType: 'icon' | 'numbered' | 'bullet' | 'custom'
  
  // Layout & Spacing
  columns: 1 | 2 | 3 | 4
  itemSpacing: string
  gap: string
  padding: string
  margin: string
  alignment: 'left' | 'center' | 'right'
  
  // Display Mode
  displayStyle: 'plain' | 'boxed' | 'bordered' | 'full-box' // ✅ UPDATED: Added full-box
  
  // Icons
  defaultIcon: string
  iconSize: string
  iconPosition: 'left' | 'right' | 'top'
  autoNumbering: boolean
  
  // Typography
  titleFontSize: string
  titleFontWeight: string
  descriptionFontSize: string
  fontFamily: string
  lineHeight: string
  
  // Colors & Styling
  titleColor: string
  descriptionColor: string
  iconColor: string
  backgroundColor: string
  border: string
  borderRadius: string
  itemBackground: string
  itemPadding: string
  
  // Box Styles
  boxShadow: string
  boxHoverShadow: string
  boxBorderWidth: string
  boxBorderColor: string
  
  // Full Box Styles (NEW)
  fullBoxShadow: string
  fullBoxPadding: string
  fullBoxBackground: string
  fullBoxBorder: string
  fullBoxBorderRadius: string
  
  // Callbacks
  onUpdate?: (props: Partial<AdvancedListProps>) => void
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void
  componentId?: string
  onSelect?: () => void
}

// ==================== DEFAULT PROPS ====================
export const advancedListDefaultProps: AdvancedListProps = {
  // Core Content
  items: [
    {
      id: '1',
      title: 'Lightning Fast',
      description: 'Loads in under 2 seconds',
      visible: true,
      iconType: 'emoji',
      iconEmoji: '⚡',
      iconImage: '',
      iconFontAwesome: 'FaBolt',
      iconNumber: 1,
      order: 1
    },
    {
      id: '2',
      title: 'Secure Payment',
      description: 'Bank-level security with SSL encryption',
      visible: true,
      iconType: 'emoji',
      iconEmoji: '🔒',
      iconImage: '',
      iconFontAwesome: 'FaLock',
      iconNumber: 2,
      order: 2
    },
    {
      id: '3',
      title: '24/7 Support',
      description: 'Always available to help you',
      visible: true,
      iconType: 'emoji',
      iconEmoji: '📞',
      iconImage: '',
      iconFontAwesome: 'FaHeadset',
      iconNumber: 3,
      order: 3
    }
  ],

  // List Type
  listType: 'icon',

  // Layout & Spacing
  columns: 1,
  itemSpacing: '16px',
  gap: '24px',
  padding: '0px',
  margin: '0px',
  alignment: 'left',

  // Display Mode
  displayStyle: 'plain', // 'plain', 'boxed', 'bordered', or 'full-box'

  // Icons
  defaultIcon: '●',
  iconSize: '24px',
  iconPosition: 'left',
  autoNumbering: true,

  // Typography
  titleFontSize: '18px',
  titleFontWeight: '600',
  descriptionFontSize: '14px',
  fontFamily: 'system-ui, sans-serif',
  lineHeight: '1.5',

  // Colors & Styling
  titleColor: '#1f2937',
  descriptionColor: '#4b5563',
  iconColor: '#3b82f6',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '8px',
  itemBackground: 'transparent',
  itemPadding: '12px',

  // Box Styles
  boxShadow: 'none',
  boxHoverShadow: '0 8px 24px rgba(0,0,0,0.12)',
  boxBorderWidth: '1px',
  boxBorderColor: '#e5e7eb',

  // Full Box Styles (NEW)
  fullBoxShadow: 'md',
  fullBoxPadding: '24px',
  fullBoxBackground: '#ffffff',
  fullBoxBorder: '1px solid #e5e7eb',
  fullBoxBorderRadius: '12px',

  // Callbacks
  onUpdate: undefined,
  onComponentUpdate: undefined,
  componentId: '',
  onSelect: undefined,
}

// ==================== UPDATED SCHEMA ====================
export const advancedListSchema = {
  categories: [
    { id: 'content', label: '📋 Content', expanded: true },
    { id: 'layout', label: '📐 Layout', expanded: true },
    { id: 'display-style', label: '🎨 Display Style', expanded: true },
    { id: 'box-settings', label: '📦 Box Settings', expanded: false },
    { id: 'icons', label: '🎯 Icons', expanded: false },
    { id: 'typography', label: '🔤 Typography', expanded: false },
    { id: 'colors', label: '🎨 Colors', expanded: false },
  ],
  properties: {
    // Content Tab
    items: {
      type: 'list-items' as any,
      label: 'List Items',
      default: advancedListDefaultProps.items,
      description: 'Manage list items with icons and descriptions',
      category: 'content',
    },

    // List Type Tab
    listType: {
      type: 'select' as const,
      label: 'List Type',
      default: advancedListDefaultProps.listType,
      options: [
        { value: 'icon', label: 'Icon List' },
        { value: 'numbered', label: 'Numbered List' },
        { value: 'bullet', label: 'Bullet List' },
        { value: 'custom', label: 'Custom List' },
      ],
      category: 'layout',
    },

    // Layout Tab
    displayStyle: {
      type: 'select' as const,
      label: 'Display Style',
      default: advancedListDefaultProps.displayStyle,
      options: [
        { value: 'plain', label: 'Plain (No Box)' },
        { value: 'boxed', label: 'Boxed Items' },
        { value: 'bordered', label: 'Bordered Items' },
        { value: 'full-box', label: 'Full List Box' },
      ],
      category: 'display-style',
      description: 'Choose how list items are displayed'
    },
    columns: {
      type: 'select' as const,
      label: 'Columns',
      default: advancedListDefaultProps.columns,
      options: [
        { value: 1, label: '1 Column' },
        { value: 2, label: '2 Columns' },
        { value: 3, label: '3 Columns' },
        { value: 4, label: '4 Columns' },
      ],
      category: 'layout',
    },
    itemSpacing: {
      type: 'text' as const,
      label: 'Item Spacing',
      default: advancedListDefaultProps.itemSpacing,
      category: 'layout',
    },
    gap: {
      type: 'text' as const,
      label: 'Column Gap',
      default: advancedListDefaultProps.gap,
      category: 'layout',
    },
    padding: {
      type: 'text' as const,
      label: 'List Padding',
      default: advancedListDefaultProps.padding,
      category: 'layout',
    },
    margin: {
      type: 'text' as const,
      label: 'List Margin',
      default: advancedListDefaultProps.margin,
      category: 'layout',
    },
    alignment: {
      type: 'select' as const,
      label: 'Alignment',
      default: advancedListDefaultProps.alignment,
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      category: 'layout',
    },

    // Box Settings Tab (For all box styles)
    boxShadow: {
      type: 'select' as const,
      label: 'Item Shadow',
      default: advancedListDefaultProps.boxShadow,
      options: [
        { value: 'none', label: 'No Shadow' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
      ],
      category: 'box-settings',
      dependsOn: 'displayStyle',
      showIf: (props: any) => props.displayStyle === 'boxed' || props.displayStyle === 'full-box'
    },
    boxHoverShadow: {
      type: 'select' as const,
      label: 'Item Hover Shadow',
      default: advancedListDefaultProps.boxHoverShadow,
      options: [
        { value: 'none', label: 'No Hover Effect' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
      ],
      category: 'box-settings',
      dependsOn: 'displayStyle',
      showIf: (props: any) => props.displayStyle === 'boxed'
    },
    boxBorderWidth: {
      type: 'text' as const,
      label: 'Item Border Width',
      default: advancedListDefaultProps.boxBorderWidth,
      category: 'box-settings',
      dependsOn: 'displayStyle',
      showIf: (props: any) => props.displayStyle === 'boxed' || props.displayStyle === 'bordered' || props.displayStyle === 'full-box'
    },
    boxBorderColor: {
      type: 'color' as const,
      label: 'Item Border Color',
      default: advancedListDefaultProps.boxBorderColor,
      category: 'box-settings',
      dependsOn: 'displayStyle',
      showIf: (props: any) => props.displayStyle === 'boxed' || props.displayStyle === 'bordered' || props.displayStyle === 'full-box'
    },

    // Full Box Specific Settings
    fullBoxShadow: {
      type: 'select' as const,
      label: 'List Box Shadow',
      default: advancedListDefaultProps.fullBoxShadow,
      options: [
        { value: 'none', label: 'No Shadow' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
      ],
      category: 'box-settings',
      dependsOn: 'displayStyle',
      showIf: (props: any) => props.displayStyle === 'full-box'
    },
    fullBoxPadding: {
      type: 'text' as const,
      label: 'List Box Padding',
      default: advancedListDefaultProps.fullBoxPadding,
      category: 'box-settings',
      dependsOn: 'displayStyle',
      showIf: (props: any) => props.displayStyle === 'full-box'
    },
    fullBoxBackground: {
      type: 'color' as const,
      label: 'List Box Background',
      default: advancedListDefaultProps.fullBoxBackground,
      category: 'box-settings',
      dependsOn: 'displayStyle',
      showIf: (props: any) => props.displayStyle === 'full-box'
    },
    fullBoxBorder: {
      type: 'text' as const,
      label: 'List Box Border',
      default: advancedListDefaultProps.fullBoxBorder,
      category: 'box-settings',
      dependsOn: 'displayStyle',
      showIf: (props: any) => props.displayStyle === 'full-box'
    },
    fullBoxBorderRadius: {
      type: 'text' as const,
      label: 'List Box Border Radius',
      default: advancedListDefaultProps.fullBoxBorderRadius,
      category: 'box-settings',
      dependsOn: 'displayStyle',
      showIf: (props: any) => props.displayStyle === 'full-box'
    },

    // Icons Tab
    defaultIcon: {
      type: 'text' as const,
      label: 'Default Icon',
      default: advancedListDefaultProps.defaultIcon,
      description: 'Default icon for bullet list or when no icon specified',
      category: 'icons',
    },
    iconSize: {
      type: 'text' as const,
      label: 'Icon Size',
      default: advancedListDefaultProps.iconSize,
      category: 'icons',
    },
    iconPosition: {
      type: 'select' as const,
      label: 'Icon Position',
      default: advancedListDefaultProps.iconPosition,
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
        { value: 'top', label: 'Top' },
      ],
      category: 'icons',
    },
    autoNumbering: {
      type: 'toggle' as const,
      label: 'Auto Numbering',
      default: advancedListDefaultProps.autoNumbering,
      description: 'Automatically number items for numbered lists',
      category: 'icons',
    },

    // Typography Tab
    titleFontSize: {
      type: 'text' as const,
      label: 'Title Font Size',
      default: advancedListDefaultProps.titleFontSize,
      category: 'typography',
    },
    titleFontWeight: {
      type: 'select' as const,
      label: 'Title Font Weight',
      default: advancedListDefaultProps.titleFontWeight,
      options: [
        { value: '400', label: 'Normal' },
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semi Bold' },
        { value: '700', label: 'Bold' },
        { value: '800', label: 'Extra Bold' },
      ],
      category: 'typography',
    },
    descriptionFontSize: {
      type: 'text' as const,
      label: 'Description Font Size',
      default: advancedListDefaultProps.descriptionFontSize,
      category: 'typography',
    },
    fontFamily: {
      type: 'select' as const,
      label: 'Font Family',
      default: advancedListDefaultProps.fontFamily,
      options: [
        { value: 'system-ui, sans-serif', label: 'System Default' },
        { value: 'Inter, sans-serif', label: 'Inter' },
        { value: 'Roboto, sans-serif', label: 'Roboto' },
        { value: 'Georgia, serif', label: 'Georgia' },
        { value: 'Monaco, monospace', label: 'Monospace' },
      ],
      category: 'typography',
    },
    lineHeight: {
      type: 'text' as const,
      label: 'Line Height',
      default: advancedListDefaultProps.lineHeight,
      category: 'typography',
    },

    // Colors Tab
    titleColor: {
      type: 'color' as const,
      label: 'Title Color',
      default: advancedListDefaultProps.titleColor,
      category: 'colors',
    },
    descriptionColor: {
      type: 'color' as const,
      label: 'Description Color',
      default: advancedListDefaultProps.descriptionColor,
      category: 'colors',
    },
    iconColor: {
      type: 'color' as const,
      label: 'Icon Color',
      default: advancedListDefaultProps.iconColor,
      category: 'colors',
    },
    backgroundColor: {
      type: 'color' as const,
      label: 'List Background',
      default: advancedListDefaultProps.backgroundColor,
      category: 'colors',
    },
    border: {
      type: 'text' as const,
      label: 'List Border',
      default: advancedListDefaultProps.border,
      category: 'colors',
    },
    borderRadius: {
      type: 'text' as const,
      label: 'List Border Radius',
      default: advancedListDefaultProps.borderRadius,
      category: 'colors',
    },
    itemBackground: {
      type: 'color' as const,
      label: 'Item Background',
      default: advancedListDefaultProps.itemBackground,
      category: 'colors',
    },
    itemPadding: {
      type: 'text' as const,
      label: 'Item Padding',
      default: advancedListDefaultProps.itemPadding,
      category: 'colors',
    },
  },
}

// ==================== FONTAWESOME ICON HELPER ====================
const getFontAwesomeIcon = (iconName: string, size: string | number, color: string) => {
  if (!iconName) return null
  
  try {
    let cleanName = iconName.trim()
    
    // Remove prefixes
    if (cleanName.toLowerCase().startsWith('fa-')) {
      cleanName = cleanName.substring(3)
    }
    
    const prefixes = ['fas', 'far', 'fal', 'fab', 'fad', 'fa']
    prefixes.forEach(prefix => {
      if (cleanName.toLowerCase().startsWith(prefix + '-')) {
        cleanName = cleanName.substring(prefix.length + 1)
      }
    })
    
    // Convert to PascalCase
    const pascalName = cleanName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
    
    const iconVariations = [
      cleanName,
      pascalName,
      `Fa${pascalName}`,
      pascalName.replace(/^Fa/, ''),
      cleanName.toUpperCase(),
      pascalName.toUpperCase(),
    ]
    
    for (const variation of iconVariations) {
      const faName = variation.startsWith('Fa') ? variation : `Fa${variation}`
      
      if (Fa6Icons[faName as keyof typeof Fa6Icons]) {
        const IconComponent = Fa6Icons[faName as keyof typeof Fa6Icons]
        return (
          <IconComponent 
            size={typeof size === 'string' ? parseInt(size) : size} 
            color={color} 
          />
        )
      }
      
      if (FaIcons[faName as keyof typeof FaIcons]) {
        const IconComponent = FaIcons[faName as keyof typeof FaIcons]
        return (
          <IconComponent 
            size={typeof size === 'string' ? parseInt(size) : size} 
            color={color} 
          />
        )
      }
    }
    
    // Common icons fallback
    const commonIcons: Record<string, keyof typeof FaIcons> = {
      'home': 'FaHome',
      'user': 'FaUser',
      'star': 'FaStar',
      'heart': 'FaHeart',
      'check': 'FaCheck',
      'times': 'FaTimes',
      'bolt': 'FaBolt',
      'lock': 'FaLock',
      'phone': 'FaPhone',
      'envelope': 'FaEnvelope',
      'calendar': 'FaCalendar',
      'clock': 'FaClock',
      'cog': 'FaCog',
      'bell': 'FaBell',
      'search': 'FaSearch',
      'plus': 'FaPlus',
      'minus': 'FaMinus',
    }
    
    const lowerName = cleanName.toLowerCase()
    if (commonIcons[lowerName]) {
      const IconComponent = FaIcons[commonIcons[lowerName]]
      return (
        <IconComponent 
          size={typeof size === 'string' ? parseInt(size) : size} 
          color={color} 
        />
      )
    }
    
    return <FaIcons.FaQuestion size={typeof size === 'string' ? parseInt(size) : size} color={color} />
    
  } catch (error) {
    console.error('Error loading FontAwesome icon:', iconName, error)
    return null
  }
}

// ==================== SHADOW HELPER ====================
const getShadowStyle = (shadowType: string): React.CSSProperties => {
  switch (shadowType) {
    case 'none': return {}
    case 'sm': return { boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
    case 'md': return { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }
    case 'lg': return { boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }
    case 'xl': return { boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }
    default: return {}
  }
}

const getHoverShadowStyle = (shadowType: string): React.CSSProperties => {
  switch (shadowType) {
    case 'none': return {}
    case 'sm': return { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
    case 'md': return { boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }
    case 'lg': return { boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }
    case 'xl': return { boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }
    default: return {}
  }
}

// ==================== LIST ITEM COMPONENT ====================
const ListItemComponent: React.FC<{
  item: ListItem
  index: number
  props: Omit<AdvancedListProps, 'onUpdate' | 'onComponentUpdate' | 'componentId' | 'onSelect'>
}> = ({ item, index, props }) => {
  const [iconImageError, setIconImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getIconContent = useCallback(() => {
    switch (props.listType) {
      case 'numbered':
        if (props.autoNumbering) {
          return <span>{index + 1}</span>
        }
        return <span>{item.iconNumber || index + 1}</span>
      
      case 'bullet':
        return <span>{props.defaultIcon || '•'}</span>
      
      case 'custom':
      case 'icon':
      default:
        switch (item.iconType) {
          case 'image':
            if (item.iconImage && !iconImageError) {
              return (
                <img 
                  src={item.iconImage} 
                  alt="" 
                  onError={() => setIconImageError(true)}
                  style={{
                    width: props.iconSize,
                    height: props.iconSize,
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              )
            }
            return <span>{props.defaultIcon}</span>
          
          case 'fontawesome':
            return getFontAwesomeIcon(item.iconFontAwesome, props.iconSize, props.iconColor)
          
          case 'number':
            return <span>{item.iconNumber || index + 1}</span>
          
          case 'emoji':
          default:
            return <span>{item.iconEmoji || props.defaultIcon}</span>
        }
    }
  }, [item, index, props, iconImageError])

  // Get item style based on displayStyle
  const getItemStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: props.itemPadding,
      borderRadius: props.borderRadius,
      marginBottom: props.itemSpacing,
      display: 'flex',
      flexDirection: props.iconPosition === 'top' ? 'column' : 'row',
      alignItems: props.iconPosition === 'top' ? 'center' : 'flex-start',
      textAlign: props.iconPosition === 'top' ? 'center' : 'left',
      gap: '12px',
      transition: 'all 0.3s ease',
      width: '100%',
    }

    // Different styles based on displayStyle
    switch (props.displayStyle) {
      case 'plain':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          border: 'none',
        }
      
      case 'bordered':
        return {
          ...baseStyle,
          backgroundColor: props.itemBackground,
          border: `${props.boxBorderWidth} solid ${props.boxBorderColor}`,
        }
      
      case 'boxed':
        return {
          ...baseStyle,
          backgroundColor: props.itemBackground,
          border: `${props.boxBorderWidth} solid ${props.boxBorderColor}`,
          ...getShadowStyle(props.boxShadow),
          ...(isHovered && getHoverShadowStyle(props.boxHoverShadow)),
          transform: isHovered ? 'translateY(-2px)' : 'none',
        }
      
      case 'full-box':
        // In full-box mode, items have minimal styling
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          border: 'none',
          marginBottom: props.itemSpacing,
          padding: '8px 0',
        }
      
      default:
        return baseStyle
    }
  }

  const itemStyle = getItemStyle()

  const iconStyle: React.CSSProperties = {
    color: props.iconColor,
    fontSize: props.iconSize,
    minWidth: props.iconSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: props.titleFontSize,
    fontWeight: props.titleFontWeight,
    color: props.titleColor,
    margin: 0,
    padding: 0,
    lineHeight: props.lineHeight,
    fontFamily: props.fontFamily,
  }

  const descriptionStyle: React.CSSProperties = {
    fontSize: props.descriptionFontSize,
    color: props.descriptionColor,
    margin: '4px 0 0 0',
    padding: 0,
    lineHeight: props.lineHeight,
    fontFamily: props.fontFamily,
  }

  return (
    <div 
      style={itemStyle} 
      className="advanced-list-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon based on position */}
      {props.iconPosition !== 'right' && (
        <div style={iconStyle} className="list-icon">
          {getIconContent()}
        </div>
      )}
      
      <div style={contentStyle} className="list-content">
        <div style={titleStyle} className="list-title">
          {item.title}
        </div>
        {item.description && (
          <div style={descriptionStyle} className="list-description">
            {item.description}
          </div>
        )}
      </div>
      
      {/* Icon on right side */}
      {props.iconPosition === 'right' && (
        <div style={iconStyle} className="list-icon">
          {getIconContent()}
        </div>
      )}
    </div>
  )
}

// ==================== MAIN COMPONENT ====================
const AdvancedList: React.FC<AdvancedListProps> = (props) => {
  const { 
    onUpdate, 
    onComponentUpdate, 
    componentId, 
    onSelect, 
    ...listProps 
  } = props

  const [isListHovered, setIsListHovered] = useState(false)
  const [isEditor, setIsEditor] = useState(false)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsEditor(Boolean(document.querySelector('.cm-page-editor')))
    }
  }, [])

  const resolvedListProps = useMemo(() => {
    if (!isEditor) return listProps

    const ifDefault = <T,>(value: T, originalDefault: T, previewValue: T): T => (value === originalDefault ? previewValue : value)

    return {
      ...listProps,
      displayStyle: ifDefault(listProps.displayStyle, advancedListDefaultProps.displayStyle, 'bordered' as const),
      columns: ifDefault(listProps.columns, advancedListDefaultProps.columns, 1 as const),
      itemSpacing: ifDefault(listProps.itemSpacing, advancedListDefaultProps.itemSpacing, '10px'),
      gap: ifDefault(listProps.gap, advancedListDefaultProps.gap, '12px'),
      itemPadding: ifDefault(listProps.itemPadding, advancedListDefaultProps.itemPadding, '12px 14px'),
      padding: ifDefault(listProps.padding, advancedListDefaultProps.padding, '0px'),
      margin: ifDefault(listProps.margin, advancedListDefaultProps.margin, '0px'),
      alignment: ifDefault(listProps.alignment, advancedListDefaultProps.alignment, 'left' as const),
      titleFontSize: ifDefault(listProps.titleFontSize, advancedListDefaultProps.titleFontSize, '13px'),
      titleFontWeight: ifDefault(listProps.titleFontWeight, advancedListDefaultProps.titleFontWeight, '600'),
      descriptionFontSize: ifDefault(listProps.descriptionFontSize, advancedListDefaultProps.descriptionFontSize, '12.5px'),
      fontFamily: ifDefault(listProps.fontFamily, advancedListDefaultProps.fontFamily, "'DM Sans', system-ui, sans-serif"),
      lineHeight: ifDefault(listProps.lineHeight, advancedListDefaultProps.lineHeight, '1.65'),
      titleColor: ifDefault(listProps.titleColor, advancedListDefaultProps.titleColor, 'var(--canvas-text, #e8eaf0)'),
      descriptionColor: ifDefault(listProps.descriptionColor, advancedListDefaultProps.descriptionColor, 'var(--canvas-muted, #8b90a8)'),
      iconColor: ifDefault(listProps.iconColor, advancedListDefaultProps.iconColor, 'var(--canvas-accent2, #a594ff)'),
      backgroundColor: ifDefault(listProps.backgroundColor, advancedListDefaultProps.backgroundColor, 'transparent'),
      border: ifDefault(listProps.border, advancedListDefaultProps.border, 'none'),
      borderRadius: ifDefault(listProps.borderRadius, advancedListDefaultProps.borderRadius, '8px'),
      itemBackground: ifDefault(listProps.itemBackground, advancedListDefaultProps.itemBackground, 'var(--canvas-surface2, #1a1d28)'),
      boxBorderWidth: ifDefault(listProps.boxBorderWidth, advancedListDefaultProps.boxBorderWidth, '1px'),
      boxBorderColor: ifDefault(listProps.boxBorderColor, advancedListDefaultProps.boxBorderColor, 'var(--canvas-border2, rgba(255,255,255,0.13))'),
      defaultIcon: ifDefault(listProps.defaultIcon, advancedListDefaultProps.defaultIcon, '•'),
      iconSize: ifDefault(listProps.iconSize, advancedListDefaultProps.iconSize, '16px'),
    }
  }, [isEditor, listProps])

  // Handle local updates
  const handleLocalUpdate = useCallback((updatedProps: Partial<AdvancedListProps>) => {
    if (onUpdate) {
      onUpdate(updatedProps)
    }
    if (onComponentUpdate && componentId) {
      onComponentUpdate(componentId, updatedProps)
    }
  }, [onUpdate, onComponentUpdate, componentId])

  // Handle click for selection
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (onSelect) {
      onSelect()
    }
  }, [onSelect])

  // Sort items by order
  const sortedItems = useMemo(() => {
    return [...resolvedListProps.items]
      .filter(item => item.visible !== false)
      .sort((a, b) => a.order - b.order)
  }, [resolvedListProps.items])

  // Get main list container style based on displayStyle
  const getListContainerStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      fontFamily: resolvedListProps.fontFamily,
      lineHeight: resolvedListProps.lineHeight,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
    }

    switch (resolvedListProps.displayStyle) {
      case 'plain':
        return {
          ...baseStyle,
          backgroundColor: resolvedListProps.backgroundColor,
          padding: resolvedListProps.padding,
          margin: resolvedListProps.margin,
          border: resolvedListProps.border,
          borderRadius: resolvedListProps.borderRadius,
        }
      
      case 'boxed':
      case 'bordered':
        return {
          ...baseStyle,
          backgroundColor: resolvedListProps.backgroundColor,
          padding: resolvedListProps.padding,
          margin: resolvedListProps.margin,
          border: resolvedListProps.border,
          borderRadius: resolvedListProps.borderRadius,
        }
      
      case 'full-box':
        return {
          ...baseStyle,
          backgroundColor: resolvedListProps.fullBoxBackground || resolvedListProps.backgroundColor,
          padding: resolvedListProps.fullBoxPadding,
          margin: resolvedListProps.margin,
          border: resolvedListProps.fullBoxBorder,
          borderRadius: resolvedListProps.fullBoxBorderRadius,
          ...getShadowStyle(resolvedListProps.fullBoxShadow),
          ...(isListHovered && { transform: 'translateY(-2px)' }),
        }
      
      default:
        return baseStyle
    }
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${resolvedListProps.columns}, 1fr)`,
    gap: resolvedListProps.gap,
    alignItems: 'flex-start',
  }

  // Single column alignment
  const singleColumnStyle: React.CSSProperties = {
    textAlign: resolvedListProps.alignment,
    width: '100%',
  }

  if (sortedItems.length === 0) {
    return (
      <div 
        style={getListContainerStyle()} 
        className="list-empty-state p-4 text-center text-gray-500 border border-dashed rounded-lg"
        onClick={handleClick}
        onMouseEnter={() => setIsListHovered(true)}
        onMouseLeave={() => setIsListHovered(false)}
      >
        <p>No list items to display. Add some items in the editor.</p>
      </div>
    )
  }

  // Render different layouts
  const renderListContent = () => {
    if (resolvedListProps.columns === 1) {
      return (
        <div style={singleColumnStyle}>
          {sortedItems.map((item, index) => (
            <ListItemComponent
              key={item.id}
              item={item}
              index={index}
              props={resolvedListProps}
            />
          ))}
        </div>
      )
    } else {
      return (
        <div style={gridStyle}>
          {sortedItems.map((item, index) => (
            <div key={item.id} style={{ textAlign: resolvedListProps.alignment }}>
              <ListItemComponent
                item={item}
                index={index}
                props={resolvedListProps}
              />
            </div>
          ))}
        </div>
      )
    }
  }

  const listNode = (
    <div 
      style={getListContainerStyle()} 
      className="advanced-list"
      onClick={handleClick}
      onMouseEnter={() => setIsListHovered(true)}
      onMouseLeave={() => setIsListHovered(false)}
    >
      {renderListContent()}
    </div>
  )

  if (isEditor) {
    const previewCardStyle: React.CSSProperties = {
      width: '100%',
      borderRadius: '12px',
      border: '1px solid var(--canvas-border, rgba(255,255,255,0.07))',
      overflow: 'hidden',
      background: 'var(--canvas-surface, #13161e)',
    }
    const previewHeaderStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      background: 'var(--canvas-surface2, #1a1d28)',
      borderBottom: '1px solid var(--canvas-border, rgba(255,255,255,0.07))',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }
    const previewBodyStyle: React.CSSProperties = {
      padding: '32px 40px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: resolvedListProps.alignment === 'center' ? 'center' : resolvedListProps.alignment === 'right' ? 'flex-end' : 'flex-start',
      minHeight: '120px',
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }

    return (
      <div style={{ width: '100%' }} onClick={handleClick}>
        <div style={previewCardStyle}>
          <div style={previewHeaderStyle}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--canvas-accent2, #a594ff)',
                background: 'var(--canvas-accentbg, rgba(124,109,250,0.12))',
                border: '1px solid rgba(124,109,250,0.2)',
                padding: '2px 8px',
                borderRadius: '20px',
              }}
            >
              Content
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--canvas-text, #e8eaf0)' }}>List</span>
            <span style={{ marginLeft: 'auto', fontSize: '11.5px', color: 'var(--canvas-text3, #5a5f7a)', fontFamily: "'DM Mono', monospace" }}>
              {`${resolvedListProps.listType} · ${resolvedListProps.columns} col`}
            </span>
          </div>
          <div style={previewBodyStyle}>{listNode}</div>
        </div>
      </div>
    )
  }

  return listNode
}

// Attach default props and schema
(AdvancedList as any).schema = advancedListSchema;

export default AdvancedList
