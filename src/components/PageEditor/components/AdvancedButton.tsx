// src/components/PageEditor/components/AdvancedButton.tsx
'use client'

import React, { useState, useCallback, useEffect } from 'react'

// ==================== TYPES ====================
export interface AdvancedButtonProps {
  // ===== CONTENT =====
  text: string
  link: string
  openInNewTab: boolean

  // ===== STYLE & DESIGN =====
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning'
  size: 'small' | 'medium' | 'large'
  // Color System
  primaryColor: string
  textColor: string
  hoverColor: string
  activeColor: string
  borderColor: string
  // ✅ NEW: Gradient Properties
  useGradient: boolean
  gradientColors: string
  gradientDirection: string
  gradientType: 'linear' | 'radial'
  // Customization
  borderRadius: string
  borderWidth: string
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl'

  // ===== LAYOUT & POSITIONING =====
  alignment: 'left' | 'center' | 'right'
  fullWidth: boolean
  marginTop: string
  marginRight: string
  marginBottom: string
  marginLeft: string
  paddingTop: string
  paddingRight: string
  paddingBottom: string
  paddingLeft: string

  // ===== TYPOGRAPHY =====
  fontFamily: string
  fontSize: string
  fontWeight: '400' | '500' | '600' | '700' | '800'
  letterSpacing: string
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  lineHeight: string

  // ===== ICONS =====
  icon: string
  iconPosition: 'left' | 'right'
  iconSize: string
  iconSpacing: string

  // ===== STATES & BEHAVIOR =====
  disabled: boolean
  loading: boolean
  loadingText: string
  // Hover Effects
  hoverEffect: 'none' | 'scale' | 'lift' | 'glow' | 'color-shift'
  hoverScale: number
  hoverShadow: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  // Animations
  animationType: 'none' | 'pulse' | 'bounce' | 'fade-in'
  animationDuration: string

  // ===== ADVANCED =====
  customClass: string
  customId: string
  ariaLabel: string
  onClick: string
  dataTracking: string

  // ===== RESPONSIVE =====
  mobileSize: 'small' | 'medium' | 'large'
  mobileFullWidth: boolean
  hideOnMobile: boolean

  // Callbacks
  onUpdate?: (props: Partial<AdvancedButtonProps>) => void
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void
  componentId?: string
  onSelect?: () => void
}

// ==================== DEFAULT PROPS ====================
export const advancedButtonDefaultProps: AdvancedButtonProps = {
  // ===== CONTENT =====
  text: 'Click Me',
  link: '#',
  openInNewTab: false,

  // ===== STYLE & DESIGN =====
  variant: 'primary',
  size: 'medium',
  // Color System
  primaryColor: '#7C6DFA',
  textColor: '#FFFFFF',
  hoverColor: '#A594FF',
  activeColor: '#6A5AE5',
  borderColor: '#7C6DFA',
  // ✅ NEW: Gradient Properties
  useGradient: false,
  gradientColors: '#7f00ff, #e100ff',
  gradientDirection: '135deg',
  gradientType: 'linear',
  // Customization
  borderRadius: '8px',
  borderWidth: '2px',
  shadow: 'md',

  // ===== LAYOUT & POSITIONING =====
  alignment: 'left',
  fullWidth: false,
  marginTop: '0px',
  marginRight: '0px',
  marginBottom: '0px',
  marginLeft: '0px',
  paddingTop: '14px',
  paddingRight: '28px',
  paddingBottom: '14px',
  paddingLeft: '28px',

  // ===== TYPOGRAPHY =====
  fontFamily: "'DM Sans', system-ui, sans-serif",
  fontSize: '16px',
  fontWeight: '600',
  letterSpacing: '0px',
  textTransform: 'none',
  lineHeight: '1.5',

  // ===== ICONS =====
  icon: '',
  iconPosition: 'left',
  iconSize: '16px',
  iconSpacing: '8px',

  // ===== STATES & BEHAVIOR =====
  disabled: false,
  loading: false,
  loadingText: 'Loading...',
  // Hover Effects
  hoverEffect: 'scale',
  hoverScale: 1.05,
  hoverShadow: 'lg',
  // Animations
  animationType: 'none',
  animationDuration: '0.3s',

  // ===== ADVANCED =====
  customClass: '',
  customId: '',
  ariaLabel: '',
  onClick: '',
  dataTracking: '',

  // ===== RESPONSIVE =====
  mobileSize: 'medium',
  mobileFullWidth: false,
  hideOnMobile: false,

  // Callbacks
  onUpdate: undefined,
  onComponentUpdate: undefined,
  componentId: '',
  onSelect: undefined,
}

// ==================== SCHEMA ====================
export const advancedButtonSchema = {
  properties: {
    // ===== CONTENT TAB =====
    text: {
      type: 'text' as const,
      label: 'Button Text',
      default: advancedButtonDefaultProps.text,
      description: 'The text displayed on the button',
      category: 'Content',
      placeholder: 'Enter button text...',
    },
    link: {
      type: 'text' as const,
      label: 'Link URL',
      default: advancedButtonDefaultProps.link,
      description: 'URL the button links to',
      category: 'Content',
      placeholder: 'https://example.com',
    },
    openInNewTab: {
      type: 'toggle' as const,
      label: 'Open in New Tab',
      default: advancedButtonDefaultProps.openInNewTab,
      description: 'Open link in new browser tab',
      category: 'Content',
    },

    // ===== STYLE TAB =====
    variant: {
      type: 'select' as const,
      label: 'Button Variant',
      default: advancedButtonDefaultProps.variant,
      options: [
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'outline', label: 'Outline' },
        { value: 'ghost', label: 'Ghost' },
        { value: 'danger', label: 'Danger' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
      ],
      category: 'Style',
    },
    
    // ✅ NEW: Gradient Properties in Schema
    useGradient: {
      type: 'toggle' as const,
      label: 'Use Gradient',
      default: advancedButtonDefaultProps.useGradient,
      description: 'Use gradient background instead of solid color',
      category: 'Style',
    },
    gradientColors: {
      type: 'text' as const,
      label: 'Gradient Colors',
      default: advancedButtonDefaultProps.gradientColors,
      description: 'Comma separated colors (e.g., #7f00ff, #e100ff)',
      category: 'Style',
      placeholder: '#7f00ff, #e100ff',
    },
    gradientDirection: {
      type: 'select' as const,
      label: 'Gradient Direction',
      default: advancedButtonDefaultProps.gradientDirection,
      options: [
        { value: 'to right', label: 'Left to Right' },
        { value: 'to left', label: 'Right to Left' },
        { value: 'to bottom', label: 'Top to Bottom' },
        { value: 'to top', label: 'Bottom to Top' },
        { value: '135deg', label: 'Diagonal (135deg)' },
        { value: '45deg', label: 'Diagonal (45deg)' },
        { value: '90deg', label: 'Vertical (90deg)' },
        { value: '180deg', label: 'Horizontal (180deg)' },
      ],
      category: 'Style',
    },
    gradientType: {
      type: 'select' as const,
      label: 'Gradient Type',
      default: advancedButtonDefaultProps.gradientType,
      options: [
        { value: 'linear', label: 'Linear Gradient' },
        { value: 'radial', label: 'Radial Gradient' },
      ],
      category: 'Style',
    },
    
    primaryColor: {
      type: 'color' as const,
      label: 'Primary Color',
      default: advancedButtonDefaultProps.primaryColor,
      description: 'Main button color (used when gradient is off)',
      category: 'Style',
    },
    textColor: {
      type: 'color' as const,
      label: 'Text Color',
      default: advancedButtonDefaultProps.textColor,
      description: 'Button text color',
      category: 'Style',
    },
    hoverColor: {
      type: 'color' as const,
      label: 'Hover Color',
      default: advancedButtonDefaultProps.hoverColor,
      description: 'Color on hover (for solid buttons)',
      category: 'Style',
    },
    borderRadius: {
      type: 'select' as const,
      label: 'Border Radius',
      default: advancedButtonDefaultProps.borderRadius,
      options: [
        { value: '0px', label: 'Square' },
        { value: '4px', label: 'Small' },
        { value: '6px', label: 'Medium' },
        { value: '8px', label: 'Large' },
        { value: '12px', label: 'Extra Large' },
        { value: '24px', label: 'Pill' },
        { value: '50px', label: 'Full Round' },
      ],
      category: 'Style',
    },
    shadow: {
      type: 'select' as const,
      label: 'Box Shadow',
      default: advancedButtonDefaultProps.shadow,
      options: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
      ],
      category: 'Style',
    },

    // ===== LAYOUT TAB =====
    alignment: {
      type: 'select' as const,
      label: 'Alignment',
      default: advancedButtonDefaultProps.alignment,
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      category: 'Layout',
    },
    fullWidth: {
      type: 'toggle' as const,
      label: 'Full Width',
      default: advancedButtonDefaultProps.fullWidth,
      description: 'Make button full width of container',
      category: 'Layout',
    },
    paddingTop: {
      type: 'text' as const,
      label: 'Padding Top',
      default: advancedButtonDefaultProps.paddingTop,
      category: 'Layout',
    },
    paddingRight: {
      type: 'text' as const,
      label: 'Padding Right',
      default: advancedButtonDefaultProps.paddingRight,
      category: 'Layout',
    },
    paddingBottom: {
      type: 'text' as const,
      label: 'Padding Bottom',
      default: advancedButtonDefaultProps.paddingBottom,
      category: 'Layout',
    },
    paddingLeft: {
      type: 'text' as const,
      label: 'Padding Left',
      default: advancedButtonDefaultProps.paddingLeft,
      category: 'Layout',
    },

    // ===== TYPOGRAPHY TAB =====
    fontFamily: {
      type: 'select' as const,
      label: 'Font Family',
      default: advancedButtonDefaultProps.fontFamily,
      options: [
        { value: 'system-ui, sans-serif', label: 'System Default' },
        { value: 'Inter, sans-serif', label: 'Inter' },
        { value: 'Roboto, sans-serif', label: 'Roboto' },
        { value: 'Georgia, serif', label: 'Georgia' },
        { value: 'Monaco, monospace', label: 'Monospace' },
      ],
      category: 'Typography',
    },
    fontSize: {
      type: 'text' as const,
      label: 'Font Size',
      default: advancedButtonDefaultProps.fontSize,
      category: 'Typography',
    },
    fontWeight: {
      type: 'select' as const,
      label: 'Font Weight',
      default: advancedButtonDefaultProps.fontWeight,
      options: [
        { value: '400', label: 'Normal' },
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semi Bold' },
        { value: '700', label: 'Bold' },
        { value: '800', label: 'Extra Bold' },
      ],
      category: 'Typography',
    },

    // ===== ICONS TAB =====
    icon: {
      type: 'select' as const,
      label: 'Icon',
      default: advancedButtonDefaultProps.icon,
      options: [
        { value: '', label: 'No Icon' },
        { value: '🔍', label: 'Search' },
        { value: '📩', label: 'Email' },
        { value: '⬇️', label: 'Download' },
        { value: '🛒', label: 'Cart' },
        { value: '❤️', label: 'Heart' },
        { value: '⭐', label: 'Star' },
        { value: '➡️', label: 'Arrow Right' },
        { value: '🔗', label: 'Link' },
      ],
      category: 'Icons',
    },
    iconPosition: {
      type: 'select' as const,
      label: 'Icon Position',
      default: advancedButtonDefaultProps.iconPosition,
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
      category: 'Icons',
    },

    // ===== INTERACTIONS TAB =====
    hoverEffect: {
      type: 'select' as const,
      label: 'Hover Effect',
      default: advancedButtonDefaultProps.hoverEffect,
      options: [
        { value: 'none', label: 'None' },
        { value: 'scale', label: 'Scale Up' },
        { value: 'lift', label: 'Lift Up' },
        { value: 'glow', label: 'Glow' },
        { value: 'color-shift', label: 'Color Shift' },
      ],
      category: 'Interactions',
    },
    animationType: {
      type: 'select' as const,
      label: 'Animation',
      default: advancedButtonDefaultProps.animationType,
      options: [
        { value: 'none', label: 'None' },
        { value: 'pulse', label: 'Pulse' },
        { value: 'bounce', label: 'Bounce' },
        { value: 'fade-in', label: 'Fade In' },
      ],
      category: 'Interactions',
    },

    // ===== STATES TAB =====
    disabled: {
      type: 'toggle' as const,
      label: 'Disabled',
      default: advancedButtonDefaultProps.disabled,
      description: 'Make button non-interactive',
      category: 'States',
    },
    loading: {
      type: 'toggle' as const,
      label: 'Loading State',
      default: advancedButtonDefaultProps.loading,
      description: 'Show loading spinner',
      category: 'States',
    },

    // ===== ADVANCED TAB =====
    customClass: {
      type: 'text' as const,
      label: 'CSS Class',
      default: advancedButtonDefaultProps.customClass,
      description: 'Additional CSS classes',
      category: 'Advanced',
    },
    customId: {
      type: 'text' as const,
      label: 'HTML ID',
      default: advancedButtonDefaultProps.customId,
      description: 'Custom HTML ID attribute',
      category: 'Advanced',
    },
    ariaLabel: {
      type: 'text' as const,
      label: 'ARIA Label',
      default: advancedButtonDefaultProps.ariaLabel,
      description: 'Accessibility label for screen readers',
      category: 'Advanced',
    },
    dataTracking: {
      type: 'text' as const,
      label: 'Data Tracking',
      default: advancedButtonDefaultProps.dataTracking,
      description: 'For analytics (data-tracking attribute)',
      category: 'Advanced',
    },

    // ===== RESPONSIVE TAB =====
    mobileSize: {
      type: 'select' as const,
      label: 'Mobile Size',
      default: advancedButtonDefaultProps.mobileSize,
      options: ['small', 'medium', 'large'],
      category: 'Responsive',
    },
    mobileFullWidth: {
      type: 'toggle' as const,
      label: 'Full Width on Mobile',
      default: advancedButtonDefaultProps.mobileFullWidth,
      category: 'Responsive',
    },
    hideOnMobile: {
      type: 'toggle' as const,
      label: 'Hide on Mobile',
      default: advancedButtonDefaultProps.hideOnMobile,
      category: 'Responsive',
    },
  },
}

// ==================== BUTTON COMPONENT ====================
const AdvancedButton: React.FC<Partial<AdvancedButtonProps>> = (props) => {
  const mergedProps: AdvancedButtonProps = {
    ...advancedButtonDefaultProps,
    ...props,
  }
  const { onUpdate, onComponentUpdate, componentId, onSelect, ...buttonProps } = mergedProps
  const [isHovered, setIsHovered] = useState(false)
  const [isEditor, setIsEditor] = useState(false)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsEditor(Boolean(document.querySelector('.cm-page-editor')))
    }
  }, [])

  // ✅ NEW: Function to create gradient string
  const getGradientString = useCallback((): string => {
    if (!buttonProps.useGradient) return ''
    
    const colors = buttonProps.gradientColors
      .split(',')
      .map(color => color.trim())
      .join(', ')
    
    if (buttonProps.gradientType === 'radial') {
      return `radial-gradient(circle, ${colors})`
    } else {
      return `linear-gradient(${buttonProps.gradientDirection || '135deg'}, ${colors})`
    }
  }, [buttonProps.useGradient, buttonProps.gradientColors, buttonProps.gradientDirection, buttonProps.gradientType])

  // ✅ NEW: Function to create hover gradient
  const getHoverGradientString = useCallback((): string => {
    if (!buttonProps.useGradient) return ''
    
    const colors = buttonProps.gradientColors
      .split(',')
      .map(color => {
        // Make colors slightly darker on hover
        const hex = color.trim().replace('#', '')
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        
        // Darken by 10%
        const darken = (value: number) => Math.max(0, Math.min(255, value * 0.9))
        
        return `#${Math.round(darken(r)).toString(16).padStart(2, '0')}${Math.round(darken(g)).toString(16).padStart(2, '0')}${Math.round(darken(b)).toString(16).padStart(2, '0')}`
      })
      .join(', ')
    
    if (buttonProps.gradientType === 'radial') {
      return `radial-gradient(circle, ${colors})`
    } else {
      return `linear-gradient(${buttonProps.gradientDirection || '135deg'}, ${colors})`
    }
  }, [buttonProps.useGradient, buttonProps.gradientColors, buttonProps.gradientDirection, buttonProps.gradientType])

  const getButtonStyles = useCallback((): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: buttonProps.iconSpacing || '8px',
      padding: `${buttonProps.paddingTop || '14px'} ${buttonProps.paddingRight || '28px'} ${buttonProps.paddingBottom || '14px'} ${buttonProps.paddingLeft || '28px'}`,
      borderRadius: buttonProps.borderRadius || '8px',
      textDecoration: 'none',
      fontWeight: buttonProps.fontWeight || '600',
      cursor: buttonProps.disabled ? 'not-allowed' : 'pointer',
      border: 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: buttonProps.fontFamily || 'system-ui, sans-serif',
      fontSize: buttonProps.fontSize || '16px',
      letterSpacing: buttonProps.letterSpacing || '0px',
      textTransform: buttonProps.textTransform || 'none',
      lineHeight: buttonProps.lineHeight || '1.5',
      width: buttonProps.fullWidth ? '100%' : 'auto',
      opacity: buttonProps.disabled ? 0.6 : 1,
      position: 'relative',
      overflow: 'hidden',
    }

    // Size variations
    const sizeStyles: Record<string, React.CSSProperties> = {
      small: { padding: '10px 20px', fontSize: '14px' },
      medium: { padding: '14px 28px', fontSize: '16px' },
      large: { padding: '18px 36px', fontSize: '18px' },
    }

    // ✅ UPDATED: Variant styles with gradient support
    const getVariantStyles = (): React.CSSProperties => {
      const isGradient = buttonProps.useGradient && buttonProps.variant === 'primary'
      const gradient = getGradientString()
      
      const variantConfig: Record<string, React.CSSProperties> = {
        primary: {
          ...(isGradient ? { background: gradient } : { backgroundColor: buttonProps.primaryColor || '#3B82F6' }),
          color: buttonProps.textColor || '#FFFFFF',
          border: 'none',
        },
        secondary: {
          backgroundColor: '#6B7280',
          color: '#FFFFFF',
          border: 'none',
        },
        outline: {
          backgroundColor: 'transparent',
          color: buttonProps.primaryColor || '#3B82F6',
          border: `${buttonProps.borderWidth || '2px'} solid ${buttonProps.borderColor || buttonProps.primaryColor || '#3B82F6'}`,
        },
        ghost: {
          backgroundColor: 'transparent',
          color: buttonProps.primaryColor || '#3B82F6',
          border: 'none',
        },
        danger: {
          backgroundColor: '#EF4444',
          color: '#FFFFFF',
          border: 'none',
        },
        success: {
          backgroundColor: '#10B981',
          color: '#FFFFFF',
          border: 'none',
        },
        warning: {
          backgroundColor: '#F59E0B',
          color: '#FFFFFF',
          border: 'none',
        },
      }

      const variant = buttonProps.variant as string
      return variantConfig[variant] || variantConfig.primary
    }

    // Shadow styles
    const getShadowStyles = (): React.CSSProperties => {
      const shadows: Record<string, string> = {
        none: 'none',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }

      const shadow = buttonProps.shadow as string
      return { boxShadow: shadows[shadow] || shadows.md }
    }

    // ✅ UPDATED: Hover effects with gradient support
    const getHoverStyles = (): React.CSSProperties => {
      if (!isHovered) return {}

      const isGradient = buttonProps.useGradient && buttonProps.variant === 'primary'
      
      const effects: Record<string, React.CSSProperties> = {
        scale: {
          transform: `scale(${buttonProps.hoverScale || 1.05})`,
        },
        lift: {
          transform: 'translateY(-2px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        glow: {
          boxShadow: `0 0 20px ${buttonProps.primaryColor}40`,
        },
        'color-shift': {
          ...(isGradient 
            ? { background: getHoverGradientString() }
            : { backgroundColor: buttonProps.hoverColor || '#2563EB' }
          ),
        },
      }

      const hoverEffect = buttonProps.hoverEffect as string
      return effects[hoverEffect] || effects.scale
    }

    const size = buttonProps.size as string
    const sizeStyle = sizeStyles[size] || sizeStyles.medium

    return {
      ...baseStyles,
      ...sizeStyle,
      ...getVariantStyles(),
      ...getShadowStyles(),
      ...getHoverStyles(),
    }
  }, [buttonProps, isHovered, getGradientString, getHoverGradientString])

  const LoadingSpinner = () => (
    <div
      style={{
        width: '16px',
        height: '16px',
        border: '2px solid transparent',
        borderTop: '2px solid currentColor',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  )

  const buttonContent = buttonProps.loading ? (
    <>
      <LoadingSpinner />
      <span>{buttonProps.loadingText || 'Loading...'}</span>
    </>
  ) : (
    <>
      {buttonProps.icon && buttonProps.iconPosition === 'left' && (
        <span style={{ fontSize: buttonProps.iconSize || '16px' }}>{buttonProps.icon}</span>
      )}
      <span>{buttonProps.text || 'Click Me'}</span>
      {buttonProps.icon && buttonProps.iconPosition === 'right' && (
        <span style={{ fontSize: buttonProps.iconSize || '16px' }}>{buttonProps.icon}</span>
      )}
    </>
  )

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: buttonProps.alignment === 'center' ? 'center' : buttonProps.alignment === 'right' ? 'flex-end' : 'flex-start',
    width: '100%',
    margin: `${buttonProps.marginTop || '0px'} ${buttonProps.marginRight || '0px'} ${buttonProps.marginBottom || '0px'} ${buttonProps.marginLeft || '0px'}`,
    cursor: 'pointer',
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect?.()
  }
  const animationStyles = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .advanced-button-pulse {
      animation: pulse ${buttonProps.animationDuration || '1s'} infinite;
    }
    
    .advanced-button-bounce {
      animation: bounce ${buttonProps.animationDuration || '0.5s'} infinite;
    }
    
    .advanced-button-fade-in {
      animation: fade-in ${buttonProps.animationDuration || '0.3s'} ease-in;
    }
  `

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
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: buttonProps.alignment === 'center' ? 'center' : buttonProps.alignment === 'right' ? 'flex-end' : 'flex-start',
      padding: '28px 36px',
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }

    const staticPreviewButtonStyle: React.CSSProperties = {
      ...getButtonStyles(),
      padding: '10px 22px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      cursor: 'default',
      transform: 'none',
    }

    const previewSubtitle = `${buttonProps.variant || 'primary'} variant`

    return (
      <div style={containerStyles} className={buttonProps.customClass || ''} onClick={handleClick}>
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
              }}>
              Interactive
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--canvas-text, #e8eaf0)' }}>Button</span>
            <span style={{ marginLeft: 'auto', fontSize: '11.5px', color: 'var(--canvas-text3, #5a5f7a)', fontFamily: "'DM Mono', monospace" }}>
              {previewSubtitle}
            </span>
          </div>

          <div style={previewBodyStyle}>
            {buttonProps.link && !buttonProps.disabled ? (
              <a
                href={buttonProps.link}
                target={buttonProps.openInNewTab ? '_blank' : '_self'}
                rel={buttonProps.openInNewTab ? 'noopener noreferrer' : undefined}
                style={staticPreviewButtonStyle}
                id={buttonProps.customId || undefined}
                aria-label={buttonProps.ariaLabel || undefined}
                data-tracking={buttonProps.dataTracking || undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleClick(e)
                }}>
                {buttonContent}
              </a>
            ) : (
              <button
                style={staticPreviewButtonStyle}
                disabled={buttonProps.disabled}
                id={buttonProps.customId || undefined}
                aria-label={buttonProps.ariaLabel || undefined}
                data-tracking={buttonProps.dataTracking || undefined}
                onClick={handleClick}>
                {buttonContent}
              </button>
            )}
          </div>
        </div>

        <style>{animationStyles}</style>
      </div>
    )
  }

  return (
    <div
      style={containerStyles}
      className={buttonProps.customClass || ''}
      onClick={handleClick}
    >
      {buttonProps.link && !buttonProps.disabled ? (
        <a
          href={buttonProps.link}
          target={buttonProps.openInNewTab ? '_blank' : '_self'}
          rel={buttonProps.openInNewTab ? 'noopener noreferrer' : undefined}
          style={getButtonStyles()}
          id={buttonProps.customId || undefined}
          aria-label={buttonProps.ariaLabel || undefined}
          data-tracking={buttonProps.dataTracking || undefined}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {buttonContent}
        </a>
      ) : (
        <button
          style={getButtonStyles()}
          disabled={buttonProps.disabled}
          id={buttonProps.customId || undefined}
          aria-label={buttonProps.ariaLabel || undefined}
          data-tracking={buttonProps.dataTracking || undefined}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {buttonContent}
        </button>
      )}
      
      <style>{animationStyles}</style>
    </div>
  )
}

// Attach schema metadata used by the editor registry
(AdvancedButton as any).schema = advancedButtonSchema

export default React.memo(AdvancedButton)
