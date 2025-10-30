import React, { useState, useEffect, useRef, useCallback } from 'react'
import { LayoutComponent } from '@/types/page-editor'

interface DynamicCardProps {
  component: LayoutComponent
  onUpdate: (newProps: Record<string, any>) => void
  isSelected?: boolean
  onSelect?: () => void
  isInCollection?: boolean
  collectionIndex?: number
  onCollectionUpdate?: (index: number, updates: Record<string, any>) => void
  // Collection management props
  onDuplicate?: () => void
  onDelete?: () => void
  onHide?: () => void
  onLock?: () => void
  isLocked?: boolean
  isHidden?: boolean
}

interface CardData {
  id: string
  layout: string
  title?: string
  subtitle?: string
  content?: string
  image?: string
  video?: string
  icon?: string
  avatar?: string
  quote?: string
  author?: string
  position?: string
  price?: string
  buttonText?: string
  buttons?: Array<{ label: string; link: string; openInNewTab: boolean }>
  badges?: string[]
  tags?: string[]
  rating?: number
  counter?: number
  link?: { url: string; text: string; openInNewTab: boolean }
  width?: string
  maxWidth?: string
  minHeight?: string
  padding?: string
  margin?: string
  borderRadius?: string
  border?: string
  boxShadow?: string
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundPosition?: string
  transition?: string
  hoverEffect?: string
  glowColor?: string
  hoverBorderColor?: string
  glassmorphism?: boolean
  gradient?: boolean
  gradientDirection?: string
  gradientStart?: string
  gradientEnd?: string
  scrollAnimation?: string
  customClass?: string
  customId?: string
  customCSS?: string
  // Advanced features
  aspectRatio?: string
  alignment?: string
  textAlign?: string
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  textColor?: string
  overlayOpacity?: number
  parallax?: boolean
  tiltEffect?: boolean
  imageFilter?: string
  blendMode?: string
  conditionalVisibility?: { condition: string; value: any }
  lazyLoad?: boolean
  skeleton?: boolean
  flipCard?: boolean
  flipContent?: { front: any; back: any }
  expandable?: boolean
  expandedContent?: string
  dragEnabled?: boolean
  microInteractions?: boolean
  animationDelay?: number
  animationDuration?: number
  // Collection properties
  visible?: boolean
  locked?: boolean
  category?: string
  // Developer features
  onClick?: (event: any) => void
  onHover?: (event: any) => void
  onLoad?: (event: any) => void
  dataAttributes?: Record<string, string>
  ariaLabel?: string
  role?: string
  tabIndex?: number
  [key: string]: any; // allow dynamic property access
}

const DynamicCard: React.FC<DynamicCardProps> = ({
  component,
  onUpdate,
  isSelected,
  onSelect,
  isInCollection = false,
  collectionIndex,
  onCollectionUpdate,
  onDuplicate,
  onDelete,
  onHide,
  onLock,
  isLocked = false,
  isHidden = false
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [tiltAngle, setTiltAngle] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null)

  const props = component.props as CardData || {}

  // Handle collection updates
  const updateCard = useCallback((field: string, value: any) => {
    if (isInCollection && collectionIndex !== undefined && onCollectionUpdate) {
      onCollectionUpdate(collectionIndex, { [field]: value })
    } else {
      onUpdate({ ...props, [field]: value })
    }
  }, [isInCollection, collectionIndex, onCollectionUpdate, onUpdate, props])

  const updateNestedField = useCallback((parent: string, field: string, value: any) => {
    const currentParent = props?.[parent] || {}
    updateCard(parent, { ...currentParent, [field]: value })
  }, [props, updateCard])

  // Animation and visibility effects
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (props.scrollAnimation) {
          setIsVisible(entry.isIntersecting)
        }
        if (entry.isIntersecting && !isLoaded) {
          setIsLoaded(true)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [props.scrollAnimation, isLoaded])

  // Parallax effect
  useEffect(() => {
    if (props.parallax) {
      const handleScroll = () => setScrollY(window.scrollY)
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [props.parallax])

  // Lazy loading effect with skeleton support
  useEffect(() => {
    if (props.lazyLoad && mediaRef.current) {
      const mediaObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsLoaded(true)
          }
        },
        { threshold: 0.1 }
      )
      mediaObserver.observe(mediaRef.current)
      return () => mediaObserver.disconnect()
    }
  }, [props.lazyLoad])

  // Skeleton loading state
  const renderSkeleton = () => {
    if (!props.skeleton || isLoaded) return null

    return (
      <div className="skeleton-loader" style={{
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s infinite',
        borderRadius: '4px',
        height: config.imagePosition === 'icon' ? '64px' : '200px',
        width: '100%'
      }} />
    )
  }

  // 3D Tilt effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!props.tiltEffect || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const angleX = (e.clientY - centerY) / 10
    const angleY = (centerX - e.clientX) / 10

    setTiltAngle({ x: angleX, y: angleY })
  }, [props.tiltEffect])

  const handleMouseLeave = useCallback(() => {
    setTiltAngle({ x: 0, y: 0 })
  }, [])

  // Conditional visibility with enhanced logic
  const isCardVisible = () => {
    if (isHidden) return false
    if (!props.conditionalVisibility) return true

    const { condition, value } = props.conditionalVisibility
    // Enhanced condition evaluation
    switch (condition) {
      case 'always': return true
      case 'never': return false
      case 'hasImage': return !!props.image
      case 'hasContent': return !!props.content
      case 'hasTitle': return !!props.title
      case 'hasVideo': return !!props.video
      case 'hasButtons': return props.buttons && props.buttons.length > 0
      case 'hasRating': return props.rating !== undefined && props.rating > 0
      case 'hasCounter': return props.counter !== undefined && props.counter > 0
      case 'isSelected': return isSelected || false
      case 'isHovered': return isHovered
      case 'custom': return value === true // For custom logic
      default: return true
    }
  }

  // Collection management controls
  const renderCollectionControls = () => {
    if (!isInCollection || !isSelected) return null

    return (
      <div className="collection-controls" style={{
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        display: 'flex',
        gap: '4px',
        zIndex: 10
      }}>
        {onDuplicate && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate()
            }}
            style={{
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Duplicate Card"
          >
            +
          </button>
        )}
        {onHide && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onHide()
            }}
            style={{
              background: isHidden ? '#6b7280' : '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isHidden ? "Show Card" : "Hide Card"}
          >
            👁
          </button>
        )}
        {onLock && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onLock()
            }}
            style={{
              background: isLocked ? '#dc2626' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isLocked ? "Unlock Card" : "Lock Card"}
          >
            {isLocked ? '🔒' : '🔓'}
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (window.confirm('Are you sure you want to delete this card?')) {
                onDelete()
              }
            }}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Delete Card"
          >
            ×
          </button>
        )}
      </div>
    )
  }

  // Aspect ratio calculations
  const getAspectRatioStyle = (aspectRatio?: string) => {
    switch (aspectRatio) {
      case '1:1': return { aspectRatio: '1/1' }
      case '4:3': return { aspectRatio: '4/3' }
      case '16:9': return { aspectRatio: '16/9' }
      case '3:4': return { aspectRatio: '3/4' }
      case '9:16': return { aspectRatio: '9/16' }
      default: return {}
    }
  }

  // Advanced shadow options
  const getAdvancedShadowStyle = (shadowType?: string) => {
    switch (shadowType) {
      case 'none': return { boxShadow: 'none' }
      case 'sm': return { boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }
      case 'md': return { boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }
      case 'lg': return { boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }
      case 'xl': return { boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }
      case 'inner': return { boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)' }
      default: return {}
    }
  }

  // Neumorphism and glassmorphism presets
  const getPresetStyle = (preset?: string) => {
    switch (preset) {
      case 'neumorphism':
        return {
          background: 'linear-gradient(145deg, #f0f0f0, #cacaca)',
          boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
          border: 'none'
        }
      case 'neumorphism-dark':
        return {
          background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
          boxShadow: '5px 5px 10px #0a0a0a, -5px -5px 10px #3a3a3a',
          border: 'none',
          color: '#ffffff'
        }
      case 'glassmorphism':
        return {
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }
      case 'glassmorphism-dark':
        return {
          background: 'rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          color: '#ffffff'
        }
      default: return {}
    }
  }

  // Hover effect styles
  const getHoverEffectStyle = () => {
    if (!isHovered || !props.hoverEffect) return {}

    switch (props.hoverEffect) {
      case 'lift':
        return { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }
      case 'glow':
        return { boxShadow: `0 0 20px ${props.glowColor || '#3b82f6'}` }
      case 'scale':
        return { transform: 'scale(1.02)' }
      case 'border':
        return { borderColor: props.hoverBorderColor || '#3b82f6' }
      case 'blur':
        return { filter: 'blur(1px)' }
      case 'fade':
        return { opacity: 0.8 }
      default:
        return {}
    }
  }

  // Scroll animation styles
  const getScrollAnimationStyle = () => {
    if (!props.scrollAnimation || !isVisible) return {}

    switch (props.scrollAnimation) {
      case 'fadeIn':
        return { animation: `fadeIn ${props.animationDuration || 0.6}s ease-out ${props.animationDelay || 0}s both` }
      case 'slideUp':
        return { animation: `slideUp ${props.animationDuration || 0.6}s ease-out ${props.animationDelay || 0}s both` }
      case 'zoomIn':
        return { animation: `zoomIn ${props.animationDuration || 0.6}s ease-out ${props.animationDelay || 0}s both` }
      case 'flip':
        return { animation: `flip ${props.animationDuration || 0.6}s ease-out ${props.animationDelay || 0}s both` }
      default:
        return {}
    }
  }

  // Parallax style
  const getParallaxStyle = () => {
    if (!props.parallax) return {}
    return { transform: `translateY(${scrollY * 0.5}px)` }
  }

  // Animated gradient border effect
  const getAnimatedBorderStyle = () => {
    if (!props.animatedBorder) return {}

    return {
      position: 'relative' as const,
      background: `linear-gradient(45deg, ${props.gradientStart || '#667eea'}, ${props.gradientEnd || '#764ba2'})`,
      padding: '2px',
      borderRadius: '10px'
    }
  }

  // Layout type configurations with responsive behavior
  const layoutConfigs = {
    imageTop: {
      imagePosition: 'top',
      textPosition: 'bottom',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      responsive: {
        mobile: { flexDirection: 'column', alignItems: 'center' },
        tablet: { flexDirection: 'column', alignItems: 'stretch' }
      }
    },
    imageBottom: {
      imagePosition: 'bottom',
      textPosition: 'top',
      flexDirection: 'column-reverse',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      responsive: {
        mobile: { flexDirection: 'column-reverse', alignItems: 'center' },
        tablet: { flexDirection: 'column-reverse', alignItems: 'stretch' }
      }
    },
    imageLeft: {
      imagePosition: 'left',
      textPosition: 'right',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      responsive: {
        mobile: { flexDirection: 'column', alignItems: 'center' },
        tablet: { flexDirection: 'row', alignItems: 'center' }
      }
    },
    imageRight: {
      imagePosition: 'right',
      textPosition: 'left',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-start',
      alignItems: 'center',
      responsive: {
        mobile: { flexDirection: 'column', alignItems: 'center' },
        tablet: { flexDirection: 'row-reverse', alignItems: 'center' }
      }
    },
    overlay: {
      imagePosition: 'background',
      textPosition: 'overlay',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      responsive: {
        mobile: { justifyContent: 'flex-end', alignItems: 'center' },
        tablet: { justifyContent: 'center', alignItems: 'center' }
      }
    },
    iconCard: {
      imagePosition: 'icon',
      textPosition: 'below',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      responsive: {
        mobile: { flexDirection: 'column', alignItems: 'center' },
        tablet: { flexDirection: 'column', alignItems: 'center' }
      }
    },
    testimonial: {
      imagePosition: 'avatar',
      textPosition: 'content',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      responsive: {
        mobile: { flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
        tablet: { flexDirection: 'row', alignItems: 'flex-start', textAlign: 'left' }
      }
    },
    product: {
      imagePosition: 'top',
      textPosition: 'bottom',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      responsive: {
        mobile: { flexDirection: 'column', alignItems: 'center' },
        tablet: { flexDirection: 'column', alignItems: 'stretch' }
      }
    },
    feature: {
      imagePosition: 'icon',
      textPosition: 'right',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      responsive: {
        mobile: { flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
        tablet: { flexDirection: 'row', alignItems: 'center', textAlign: 'left' }
      }
    }
  }

  // Get responsive layout config
  const getResponsiveConfig = () => {
    const baseConfig = layoutConfigs[props.layout as keyof typeof layoutConfigs] || layoutConfigs.imageTop

    // Simple responsive detection - can be enhanced with proper media queries
    const isMobile = window.innerWidth < 768
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024

    if (isMobile && baseConfig.responsive?.mobile) {
      return { ...baseConfig, ...baseConfig.responsive.mobile }
    } else if (isTablet && baseConfig.responsive?.tablet) {
      return { ...baseConfig, ...baseConfig.responsive.tablet }
    }

    return baseConfig
  }

  const config = getResponsiveConfig()

  // Render different content based on layout type
  const renderMedia = () => {
    if (!props.image && !props.video) return null

    const mediaStyle: React.CSSProperties = {
      width: config.imagePosition === 'icon' ? '64px' : '100%',
      height: config.imagePosition === 'icon' ? '64px' : 'auto',
      objectFit: 'cover' as const,
      borderRadius: config.imagePosition === 'avatar' ? '50%' : '4px',
      ...getAspectRatioStyle(props.aspectRatio),
      ...(props.lazyLoad && !isLoaded ? { display: 'none' } : {})
    }

    if (config.imagePosition === 'background') {
      return null // Background media handled in card container
    }

    return (
      <div
        className={`card-media ${config.imagePosition}`}
        style={{
          flex: config.imagePosition === 'left' || config.imagePosition === 'right' ? '0 0 40%' : 'none',
          marginBottom: config.imagePosition === 'top' ? '16px' : '0',
          marginTop: config.imagePosition === 'bottom' ? '16px' : '0',
          marginRight: config.imagePosition === 'left' ? '16px' : '0',
          marginLeft: config.imagePosition === 'right' ? '16px' : '0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {renderSkeleton()}
        {props.video ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={props.video}
            style={{ ...mediaStyle, display: isLoaded ? 'block' : 'none' }}
            controls={props.videoControls !== false}
            autoPlay={props.videoAutoPlay}
            muted={props.videoMuted}
            loop={props.videoLoop}
            onLoadedData={() => {
              setIsLoaded(true)
              props.onLoad?.({ type: 'video', element: mediaRef.current })
            }}
          />
        ) : (
          <img
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            src={props.image}
            alt={props.title || 'Card media'}
            style={{ ...mediaStyle, display: isLoaded ? 'block' : 'none' }}
            onLoad={() => {
              setIsLoaded(true)
              props.onLoad?.({ type: 'image', element: mediaRef.current })
            }}
          />
        )}
      </div>
    )
  }

  const renderIcon = () => {
    if (!props.icon && config.imagePosition !== 'icon') return null

    return (
      <div className="card-icon" style={{
        fontSize: '48px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        {props.icon || '⭐'}
      </div>
    )
  }

  const renderTextContent = () => {
    const textAlign = props.textAlign || (config as any).textAlign || 'left'

    return (
      <div
        className="card-content"
        style={{
          flex: config.textPosition === 'right' || config.textPosition === 'left' ? '1' : 'none',
          textAlign: textAlign as any,
          width: '100%'
        }}
      >
        {props.title && (
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: props.titleFontSize || props.fontSize || '18px',
            fontWeight: props.titleFontWeight || props.fontWeight || '600',
            color: props.titleColor || props.textColor || '#1f2937',
            fontFamily: props.titleFontFamily || props.fontFamily || 'inherit',
            textAlign: props.titleTextAlign || textAlign as any
          }}>
            {props.title}
          </h3>
        )}

        {props.subtitle && (
          <p style={{
            margin: '0 0 12px 0',
            fontSize: props.subtitleFontSize || '14px',
            fontWeight: props.subtitleFontWeight || '400',
            color: props.subtitleColor || '#6b7280',
            fontFamily: props.subtitleFontFamily || 'inherit',
            textAlign: props.subtitleTextAlign || textAlign as any
          }}>
            {props.subtitle}
          </p>
        )}

        {props.quote && (
          <blockquote style={{
            margin: '16px 0',
            padding: '0 16px',
            borderLeft: '4px solid #3b82f6',
            fontStyle: 'italic',
            color: props.quoteColor || '#4b5563',
            fontSize: props.quoteFontSize || '16px',
            fontFamily: props.quoteFontFamily || 'inherit',
            textAlign: props.quoteTextAlign || textAlign as any
          }}>
            "{props.quote}"
          </blockquote>
        )}

        {props.content && (
          props.richText ? (
            <div
              style={{
                margin: '0 0 16px 0',
                lineHeight: '1.6',
                color: props.contentColor || '#4b5563',
                fontSize: props.contentFontSize || '14px',
                fontWeight: props.contentFontWeight || '400',
                fontFamily: props.contentFontFamily || 'inherit',
                textAlign: props.contentTextAlign || textAlign as any
              }}
              dangerouslySetInnerHTML={{ __html: props.content }}
            />
          ) : (
            <p style={{
              margin: '0 0 16px 0',
              lineHeight: '1.6',
              color: props.contentColor || '#4b5563',
              fontSize: props.contentFontSize || '14px',
              fontWeight: props.contentFontWeight || '400',
              fontFamily: props.contentFontFamily || 'inherit',
              textAlign: props.contentTextAlign || textAlign as any
            }}>
              {props.content}
            </p>
          )
        )}

        {props.author && (
          <div style={{
            marginTop: '12px',
            fontSize: props.authorFontSize || '12px',
            color: props.authorColor || '#6b7280',
            fontWeight: props.authorFontWeight || '500',
            fontFamily: props.authorFontFamily || 'inherit',
            textAlign: props.authorTextAlign || textAlign as any
          }}>
            — {props.author}
            {props.position && <span style={{ marginLeft: '8px' }}>• {props.position}</span>}
          </div>
        )}

        {props.price && (
          <div style={{
            fontSize: props.priceFontSize || '20px',
            fontWeight: props.priceFontWeight || 'bold',
            color: props.priceColor || '#3b82f6',
            margin: '12px 0',
            fontFamily: props.priceFontFamily || 'inherit',
            textAlign: props.priceTextAlign || textAlign as any
          }}>
            {props.price}
          </div>
        )}

        {props.rating && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '8px 0',
            fontSize: '16px',
            color: '#fbbf24'
          }}>
            {'★'.repeat(Math.floor(props.rating))}
            {props.rating % 1 !== 0 && '☆'}
            <span style={{ marginLeft: '8px', color: '#6b7280', fontSize: '14px' }}>
              ({props.rating})
            </span>
          </div>
        )}

        {props.counter && (
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: props.counterColor || '#3b82f6',
            margin: '8px 0'
          }}>
            {props.counter}
          </div>
        )}

        {props.badges && props.badges.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
            {props.badges.map((badge, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: props.badgeBackgroundColor || '#e5e7eb',
                  color: props.badgeTextColor || '#374151',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {props.tags && props.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
            {props.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: props.tagBackgroundColor || '#f3f4f6',
                  color: props.tagTextColor || '#6b7280',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '400'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {props.buttons && props.buttons.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            {props.buttons.map((button, index) => (
              <button
                key={index}
                style={{
                  backgroundColor: props.buttonBackgroundColor || '#3b82f6',
                  color: props.buttonTextColor || 'white',
                  border: props.buttonBorder || 'none',
                  padding: props.buttonPadding || '8px 16px',
                  borderRadius: props.buttonBorderRadius || '4px',
                  cursor: 'pointer',
                  fontSize: props.buttonFontSize || '14px',
                  fontWeight: props.buttonFontWeight || '500',
                  fontFamily: props.buttonFontFamily || 'inherit'
                }}
                onClick={() => {
                  if (button.link) {
                    if (button.openInNewTab) {
                      window.open(button.link, '_blank')
                    } else {
                      window.location.href = button.link
                    }
                  }
                }}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}

        {props.buttonText && !props.buttons && (
          <button style={{
            backgroundColor: props.buttonBackgroundColor || '#3b82f6',
            color: props.buttonTextColor || 'white',
            border: props.buttonBorder || 'none',
            padding: props.buttonPadding || '8px 16px',
            borderRadius: props.buttonBorderRadius || '4px',
            cursor: 'pointer',
            fontSize: props.buttonFontSize || '14px',
            fontWeight: props.buttonFontWeight || '500',
            marginTop: '12px',
            fontFamily: props.buttonFontFamily || 'inherit'
          }}>
            {props.buttonText}
          </button>
        )}
      </div>
    )
  }

  const renderOverlay = () => {
    if (config.imagePosition !== 'background') return null

    return (
      <div
        className="card-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${props.overlayOpacity || 0.4})`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}
      >
        {renderTextContent()}
      </div>
    )
  }

  if (!isCardVisible()) return null

  const cardStyle: React.CSSProperties = {
    width: props.width || '100%',
    maxWidth: props.maxWidth || '400px',
    minHeight: props.minHeight || 'auto',
    padding: props.padding || '20px',
    margin: props.margin || '0',
    borderRadius: props.borderRadius || '8px',
    border: props.border || '1px solid #e5e7eb',
    boxShadow: props.advancedShadow ? getAdvancedShadowStyle(props.advancedShadow).boxShadow : (props.boxShadow || '0 1px 3px rgba(0,0,0,0.1)'),
    backgroundColor: props.preset ? getPresetStyle(props.preset).background : (props.gradient
      ? `linear-gradient(${props.gradientDirection || '45deg'}, ${props.gradientStart || '#667eea'}, ${props.gradientEnd || '#764ba2'})`
      : props.backgroundColor || '#ffffff'),
    backgroundImage: config.imagePosition === 'background' && props.image ? `url(${props.image})` : props.backgroundImage,
    backgroundSize: props.backgroundSize || 'cover',
    backgroundPosition: props.backgroundPosition || 'center',
    transition: props.transition || 'all 0.3s ease',
    transform: props.tiltEffect ? `perspective(1000px) rotateX(${tiltAngle.x}deg) rotateY(${tiltAngle.y}deg)` : undefined,
    opacity: isVisible ? 1 : 0,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: config.flexDirection as any,
    justifyContent: config.justifyContent as any,
    alignItems: config.alignItems as any,
    cursor: 'pointer',
    ...(props.imageFilter && { filter: `${props.imageFilter}(1)` }),
    ...(props.blendMode && { mixBlendMode: props.blendMode as any }),
    ...getPresetStyle(props.preset),
    ...getHoverEffectStyle(),
    ...getScrollAnimationStyle(),
    ...getParallaxStyle()
  }

  const animatedBorderStyle = getAnimatedBorderStyle()

  const cardContent = (
    <div
      ref={cardRef}
      id={props.customId || undefined}
      className={`dynamic-card ${props.customClass || ''} ${isSelected ? 'selected' : ''} ${isFlipped ? 'flipped' : ''} ${isLocked ? 'locked' : ''}`}
      style={{
        ...cardStyle,
        pointerEvents: isLocked ? 'none' : 'auto',
        opacity: isLocked ? 0.7 : cardStyle.opacity
      }}
      onMouseEnter={() => {
        setIsHovered(true)
        props.onHover?.({ type: 'enter' })
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        handleMouseLeave()
        props.onHover?.({ type: 'leave' })
      }}
      onMouseMove={handleMouseMove}
      onClick={(e) => {
        props.onClick?.(e)
        if (props.flipCard && !isLocked) {
          setIsFlipped(!isFlipped)
        }
        onSelect?.()
      }}
    >
      {renderCollectionControls()}
      {props.flipCard ? (
        <div className="card-flipper" style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}>
          {/* Front of card */}
          <div className="card-front" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: config.flexDirection as any,
            justifyContent: config.justifyContent as any,
            alignItems: config.alignItems as any
          }}>
            {renderMedia()}
            {renderIcon()}
            {config.imagePosition !== 'background' && renderTextContent()}
            {renderOverlay()}
          </div>

          {/* Back of card */}
          <div className="card-back" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: props.flipContent?.back?.backgroundColor || '#f8f9fa'
          }}>
            {props.flipContent?.back?.title && (
              <h3 style={{ margin: '0 0 16px 0', textAlign: 'center' }}>
                {props.flipContent.back.title}
              </h3>
            )}
            {props.flipContent?.back?.content && (
              <p style={{ margin: '0', textAlign: 'center', lineHeight: '1.6' }}>
                {props.flipContent.back.content}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          {renderMedia()}
          {renderIcon()}
          {config.imagePosition !== 'background' && renderTextContent()}
          {renderOverlay()}

          {/* Expandable content */}
          {props.expandable && (
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isExpanded ? 'Show Less' : 'Show More'}
                <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  ▼
                </span>
              </button>

              {isExpanded && props.expandedContent && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  lineHeight: '1.6'
                }}>
                  {props.expandedContent}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )

  // Wrap with animated border if enabled
  if (props.animatedBorder) {
    return (
      <div style={animatedBorderStyle}>
        {cardContent}
      </div>
    )
  }

  return cardContent
}

// Add CSS animations for scroll effects and skeleton loading
const style = document.createElement('style')
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes zoomIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes flip {
    from { opacity: 0; transform: rotateY(-90deg); }
    to { opacity: 1; transform: rotateY(0deg); }
  }

  @keyframes skeleton-loading {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`
document.head.appendChild(style)

export default DynamicCard
