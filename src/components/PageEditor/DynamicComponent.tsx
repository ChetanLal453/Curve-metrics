'use client'

import React, { useState, useCallback, useEffect, useRef, memo, forwardRef, useMemo } from 'react'
import { LayoutComponent } from '@/types/page-editor'
import { componentRegistry } from '@/lib/componentRegistry'
import AdvancedCardComponent from './components/AdvancedCardComponent'
import AdvancedImageComponent from './components/AdvancedImageComponent'
import AdvancedParagraph from './components/AdvancedParagraph'
import { NewGrid } from './components/NewGrid'
import SwiperContainer from './components/SwiperContainer'
import AdvancedList, { advancedListDefaultProps } from './components/AdvancedList'
import AdvancedHeading from './components/AdvancedHeading'
import AdvancedButton, { advancedButtonDefaultProps } from './components/AdvancedButton'
import AdvancedAccordion, { advancedAccordionDefaultProps } from './components/AdvancedAccordion'
import { sanitizeHtml } from '@/lib/sanitize-markup'


// In the DynamicComponentInner function, update the props interface:
interface DynamicComponentProps {
  component: LayoutComponent
  isSelected: boolean
  onSelect?: () => void
  onUpdate: (newProps: Record<string, any>) => void
  editing?: boolean
  onComponentSelect?: (
    component: LayoutComponent,
    context: {
      sectionId: string
      containerId: string
      rowId: string
      colId: string
      carouselId?: string
      slideIndex?: number
      gridId?: string
      cellRow?: number
      cellCol?: number
      source?: 'grid-cell' | 'carousel-direct' | 'slide'
      isNestedSelection?: boolean
      parentComponentId?: string
      parentGridId?: string
    },
  ) => void
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void
  draggableProps?: any
  dragHandleProps?: any
  onDragEnd?: (result: any, draggedItem: any) => void
  sectionId?: string
  containerId?: string
  rowId?: string
  colId?: string
  carouselId?: string
  slideIndex?: number
  // ✅ FIXED: Add these missing props
  gridId?: string
  cellRow?: number
  cellCol?: number
  parentGridId?: string
  setSelectedComponent?: (component: { sectionId: string; compId: string; component: LayoutComponent }) => void
  deleteComponent?: (componentId: string, context?: any) => void
  onDelete?: (componentId: string, context?: any) => void
  layout?: any
  parentComponentId?: string
}

// ==================== HELPER COMPONENTS ====================

const DynamicRichText: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [content, setContent] = useState(component.props?.content || '<p>Start writing your rich text content here...</p>')

  useEffect(() => {
    setContent(component.props?.content || '<p>Start writing your rich text content here...</p>')
  }, [component.props?.content])

  return (
    <div className="border rounded p-2 min-h-[200px] bg-white">
      <div
        contentEditable
        suppressContentEditableWarning
        className="outline-none min-h-[180px] prose prose-sm max-w-none"
        onInput={(e) => {
          const newContent = sanitizeHtml(e.currentTarget.innerHTML)
          setContent(newContent)
          onUpdate({ ...component.props, content: newContent })
        }}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    </div>
  )
}

const DynamicQuote: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [editing, setEditing] = useState<'text' | 'author' | null>(null)

  return (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-center">
      {editing === 'text' ? (
        <textarea
          value={component.props?.text || '"This is a quote or testimonial text."'}
          onChange={(e) => onUpdate({ ...component.props, text: e.target.value })}
          onBlur={() => setEditing(null)}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
          autoFocus
        />
      ) : (
        <p className="cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => setEditing('text')}>
          {component.props?.text || '"This is a quote or testimonial text."'}
        </p>
      )}
      {editing === 'author' ? (
        <input
          type="text"
          value={component.props?.author || 'Author Name'}
          onChange={(e) => onUpdate({ ...component.props, author: e.target.value })}
          onBlur={() => setEditing(null)}
          className="text-sm text-gray-600 border rounded px-2 py-1 focus:outline-none focus:border-blue-400"
          autoFocus
        />
      ) : (
        <cite
          className="text-sm text-gray-600 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded not-italic font-semibold"
          onClick={() => setEditing('author')}>
          — {component.props?.author || 'Author Name'}
        </cite>
      )}
    </blockquote>
  )
}

const DEFAULT_VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

type ResolvedVideoSource =
  | { kind: 'youtube'; src: string }
  | { kind: 'vimeo'; src: string }
  | { kind: 'mp4'; src: string }
  | { kind: 'embed'; src: string }

const withQueryParams = (urlString: string, params: Record<string, string>): string => {
  try {
    const parsed = new URL(urlString)
    Object.entries(params).forEach(([key, value]) => {
      if (value === '' || value === undefined || value === null) {
        parsed.searchParams.delete(key)
        return
      }
      parsed.searchParams.set(key, value)
    })
    return parsed.toString()
  } catch {
    return urlString
  }
}

const applyAlphaToColor = (colorValue: string, alphaPercent: number): string => {
  const alpha = Math.max(0, Math.min(100, alphaPercent)) / 100
  const trimmed = (colorValue || '').trim()
  const shortHexMatch = trimmed.match(/^#([0-9a-fA-F]{3})$/)
  const longHexMatch = trimmed.match(/^#([0-9a-fA-F]{6})$/)

  if (shortHexMatch?.[1]) {
    const [r, g, b] = shortHexMatch[1].split('').map((char) => parseInt(`${char}${char}`, 16))
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  if (longHexMatch?.[1]) {
    const hex = longHexMatch[1]
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return trimmed || `rgba(255, 255, 255, ${alpha})`
}

const extractYouTubeId = (urlString: string): string | null => {
  const trimmed = (urlString || '').trim()
  if (!trimmed) return null

  const shortMatch = trimmed.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/)
  if (shortMatch?.[1]) return shortMatch[1]

  const embedMatch = trimmed.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/)
  if (embedMatch?.[1]) return embedMatch[1]

  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/)
  if (shortsMatch?.[1]) return shortsMatch[1]

  try {
    const parsed = new URL(trimmed)
    const watchId = parsed.searchParams.get('v')
    if (watchId) return watchId
  } catch {
    return null
  }

  return null
}

const extractVimeoId = (urlString: string): string | null => {
  const trimmed = (urlString || '').trim()
  if (!trimmed) return null

  const match = trimmed.match(/vimeo\.com\/(?:video\/)?(\d{5,})/)
  return match?.[1] || null
}

const resolveVideoSource = (
  rawSrc: string,
  sourceType: 'auto' | 'youtube' | 'vimeo' | 'mp4',
  options: { autoplay: boolean; muted: boolean; loop: boolean; controls: boolean },
): ResolvedVideoSource => {
  const src = (rawSrc || DEFAULT_VIDEO_URL).trim()
  const lowerSrc = src.toLowerCase()

  const isMp4Url = lowerSrc.endsWith('.mp4') || lowerSrc.includes('.mp4?')
  const shouldUseMp4 = sourceType === 'mp4' || (sourceType === 'auto' && isMp4Url)
  if (shouldUseMp4) {
    return { kind: 'mp4', src }
  }

  const isYoutubeUrl = lowerSrc.includes('youtube.com') || lowerSrc.includes('youtu.be')
  if (sourceType === 'youtube' || (sourceType === 'auto' && isYoutubeUrl)) {
    const youtubeId = extractYouTubeId(src)
    if (youtubeId) {
      const youtubeEmbed = `https://www.youtube.com/embed/${youtubeId}`
      return {
        kind: 'youtube',
        src: withQueryParams(youtubeEmbed, {
          autoplay: options.autoplay ? '1' : '0',
          mute: options.muted ? '1' : '0',
          controls: options.controls ? '1' : '0',
          loop: options.loop ? '1' : '0',
          playlist: options.loop ? youtubeId : '',
          rel: '0',
          modestbranding: '1',
        }),
      }
    }
  }

  const isVimeoUrl = lowerSrc.includes('vimeo.com')
  if (sourceType === 'vimeo' || (sourceType === 'auto' && isVimeoUrl)) {
    const vimeoId = extractVimeoId(src)
    if (vimeoId) {
      const vimeoEmbed = `https://player.vimeo.com/video/${vimeoId}`
      return {
        kind: 'vimeo',
        src: withQueryParams(vimeoEmbed, {
          autoplay: options.autoplay ? '1' : '0',
          muted: options.muted ? '1' : '0',
          loop: options.loop ? '1' : '0',
          controls: options.controls ? '1' : '0',
          title: '0',
          byline: '0',
          portrait: '0',
        }),
      }
    }
  }

  return { kind: 'embed', src }
}

const DynamicVideo: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const props = component.props || {}
  const [editing, setEditing] = useState(false)
  const [draftUrl, setDraftUrl] = useState(props.src || DEFAULT_VIDEO_URL)
  const [localPlaying, setLocalPlaying] = useState(false)
  const [localProgress, setLocalProgress] = useState(0)
  const [localTimeLabel, setLocalTimeLabel] = useState('0:00 / 0:00')
  const htmlVideoRef = useRef<HTMLVideoElement | null>(null)

  const autoplay = Boolean(props.autoplay)
  const muted = Boolean(props.muted)
  const loop = Boolean(props.loop)
  const controls = props.controls !== false
  const sourceType = (props.sourceType || 'auto') as 'auto' | 'youtube' | 'vimeo' | 'mp4'
  const showOverlay = props.showOverlay !== false
  const showPreviewChrome = props.showPreviewChrome !== false
  const previewProgress = Number.isFinite(Number(props.previewProgress)) ? Number(props.previewProgress) : 35
  const borderOpacity = Number.isFinite(Number(props.borderOpacity)) ? Number(props.borderOpacity) : 13
  const resolvedSource = useMemo(
    () =>
      resolveVideoSource(props.src || DEFAULT_VIDEO_URL, sourceType, {
        autoplay,
        muted,
        loop,
        controls,
      }),
    [props.src, sourceType, autoplay, muted, loop, controls],
  )

  useEffect(() => {
    setDraftUrl(props.src || DEFAULT_VIDEO_URL)
  }, [props.src])

  const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleVideoPlayState = () => {
    if (resolvedSource.kind !== 'mp4' || !htmlVideoRef.current) return
    if (htmlVideoRef.current.paused) {
      void htmlVideoRef.current.play()
    } else {
      htmlVideoRef.current.pause()
    }
  }

  const commitUrl = () => {
    const cleaned = draftUrl.trim() || DEFAULT_VIDEO_URL
    onUpdate({ ...props, src: cleaned })
    setEditing(false)
  }

  return (
    <div style={{ width: props.width || '100%', maxWidth: props.maxWidth || '100%', margin: props.margin || '0 auto' }}>
      {editing && (
        <input
          type="text"
          value={draftUrl}
          onChange={(event) => setDraftUrl(event.target.value)}
          onBlur={commitUrl}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commitUrl()
            if (event.key === 'Escape') {
              setDraftUrl(props.src || DEFAULT_VIDEO_URL)
              setEditing(false)
            }
          }}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400 mb-2"
          placeholder="Enter YouTube, Vimeo, or MP4 URL..."
          autoFocus
        />
      )}

      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: props.aspectRatio || '16 / 9',
          minHeight: '160px',
          background: '#22263a',
          borderRadius: `${props.borderRadius ?? 10}px`,
          border: `1px solid ${applyAlphaToColor(props.borderColor || '#ffffff', borderOpacity)}`,
          overflow: 'hidden',
        }}>
        {resolvedSource.kind === 'mp4' ? (
          <video
            ref={htmlVideoRef}
            src={resolvedSource.src}
            autoPlay={autoplay}
            muted={muted || autoplay}
            controls={controls}
            loop={loop}
            playsInline
            onPlay={() => setLocalPlaying(true)}
            onPause={() => setLocalPlaying(false)}
            onTimeUpdate={(event) => {
              const current = event.currentTarget.currentTime
              const duration = event.currentTarget.duration || 0
              const percent = duration > 0 ? (current / duration) * 100 : 0
              setLocalProgress(percent)
              setLocalTimeLabel(`${formatTime(current)} / ${formatTime(duration)}`)
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: props.objectFit || 'cover',
              display: 'block',
            }}
          />
        ) : (
          <iframe
            src={resolvedSource.src}
            title={props.title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
          />
        )}

        {showOverlay && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, rgba(124,109,250,${(props.overlayStrength ?? 10) / 100}), rgba(0,0,0,0.5))`,
              pointerEvents: 'none',
            }}
          />
        )}

        {showPreviewChrome && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                toggleVideoPlayState()
              }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '48px',
                height: '48px',
                background: 'rgba(255,255,255,0.15)',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
                zIndex: 2,
                cursor: resolvedSource.kind === 'mp4' ? 'pointer' : 'default',
                pointerEvents: resolvedSource.kind === 'mp4' ? 'auto' : 'none',
              }}
              aria-label={localPlaying ? 'Pause video' : 'Play video'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                {localPlaying && resolvedSource.kind === 'mp4' ? (
                  <>
                    <rect x="6" y="5" width="4" height="14"></rect>
                    <rect x="14" y="5" width="4" height="14"></rect>
                  </>
                ) : (
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                )}
              </svg>
            </button>

            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                padding: '10px 14px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 2,
                pointerEvents: 'none',
              }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.max(0, Math.min(100, resolvedSource.kind === 'mp4' ? localProgress : previewProgress))}%`,
                    height: '100%',
                    background: props.accentColor || '#7c6dfa',
                  }}
                />
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontFamily: "'DM Mono', monospace" }}>
                {resolvedSource.kind === 'mp4' ? localTimeLabel : props.previewTime || '1:24 / 4:05'}
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setEditing((value) => !value)
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 3,
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.45)',
            color: '#d5d9e5',
            fontSize: '11px',
            fontWeight: 600,
            padding: '4px 8px',
            lineHeight: 1,
            cursor: 'pointer',
          }}>
          {editing ? 'Done' : 'Edit URL'}
        </button>
      </div>
    </div>
  )
}

const DynamicIcon: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [editing, setEditing] = useState(false)

  return (
    <div className="text-center p-4">
      {editing ? (
        <input
          type="text"
          value={component.props?.name || 'star'}
          onChange={(e) => onUpdate({ ...component.props, name: e.target.value })}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditing(false)
            }
          }}
          className="p-2 border rounded focus:outline-none focus:border-blue-400"
          placeholder="Icon name (e.g., star, heart, user)"
          autoFocus
        />
      ) : (
        <div className="cursor-pointer hover:bg-gray-100 p-4 rounded inline-block" onClick={() => setEditing(true)}>
          <i className={`fa fa-${component.props?.name || 'star'} text-4xl text-gray-600`} />
          <div className="text-sm text-gray-500 mt-2">{component.props?.name || 'star'}</div>
        </div>
      )}
    </div>
  )
}

const DynamicDivider: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  return <hr className="border-t-2 border-gray-300 my-4" />
}

const DynamicButton: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const props = component.props || {}

  const getButtonStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: props.iconSpacing || '8px',
      padding: `${props.paddingTop || '12px'} ${props.paddingRight || '24px'} ${props.paddingBottom || '12px'} ${props.paddingLeft || '24px'}`,
      borderRadius: props.borderRadius || '6px',
      textDecoration: 'none',
      fontWeight: props.fontWeight || '600',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      border: 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: props.fontFamily || 'system-ui, sans-serif',
      fontSize: props.fontSize || '16px',
      letterSpacing: props.letterSpacing || '0px',
      textTransform: props.textTransform || 'none',
      lineHeight: props.lineHeight || '1.5',
      width: props.fullWidth ? '100%' : 'auto',
      opacity: props.disabled ? 0.6 : 1,
      position: 'relative',
      overflow: 'hidden',
    }

    const sizeStyles: Record<string, React.CSSProperties> = {
      small: { padding: '8px 16px', fontSize: '14px' },
      medium: { padding: '12px 24px', fontSize: '16px' },
      large: { padding: '16px 32px', fontSize: '18px' },
    }

    const getVariantStyles = (): React.CSSProperties => {
      const variantConfig: Record<string, React.CSSProperties> = {
        primary: {
          backgroundColor: props.primaryColor || '#3B82F6',
          color: props.textColor || '#FFFFFF',
          border: 'none',
        },
        secondary: {
          backgroundColor: '#6B7280',
          color: '#FFFFFF',
          border: 'none',
        },
        outline: {
          backgroundColor: 'transparent',
          color: props.primaryColor || '#3B82F6',
          border: `${props.borderWidth || '2px'} solid ${props.borderColor || props.primaryColor || '#3B82F6'}`,
        },
        ghost: {
          backgroundColor: 'transparent',
          color: props.primaryColor || '#3B82F6',
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

      const variant = props.variant as string
      return variantConfig[variant] || variantConfig.primary
    }

    const getShadowStyles = (): React.CSSProperties => {
      const shadows: Record<string, string> = {
        none: 'none',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }

      const shadow = props.shadow as string
      return { boxShadow: shadows[shadow] || shadows.md }
    }

    const size = props.size as string
    const sizeStyle = sizeStyles[size] || sizeStyles.medium

    return {
      ...baseStyles,
      ...sizeStyle,
      ...getVariantStyles(),
      ...getShadowStyles(),
    }
  }

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

  const buttonContent = props.loading
    ? [<LoadingSpinner key="spinner" />, props.loadingText || 'Loading...']
    : [
        props.icon && props.iconPosition === 'left' && <span key="icon-left">{props.icon}</span>,
        <span key="text">{props.text || 'Click Me'}</span>,
        props.icon && props.iconPosition === 'right' && <span key="icon-right">{props.icon}</span>,
      ].filter(Boolean)

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: props.alignment === 'center' ? 'center' : props.alignment === 'right' ? 'flex-end' : 'flex-start',
    width: '100%',
    margin: `${props.marginTop || '0px'} ${props.marginRight || '0px'} ${props.marginBottom || '0px'} ${props.marginLeft || '0px'}`,
  }

  return (
    <div style={containerStyles}>
      {props.link && !props.disabled ? (
        <a
          href={props.link}
          target={props.openInNewTab ? '_blank' : '_self'}
          rel={props.openInNewTab ? 'noopener noreferrer' : undefined}
          style={getButtonStyles()}>
          {buttonContent}
        </a>
      ) : (
        <button style={getButtonStyles()} disabled={props.disabled}>
          {buttonContent}
        </button>
      )}
    </div>
  )
}

// ==================== DYNAMIC ACCORDION ====================
const DynamicAccordion: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['1']))
  const props = component.props || {}

  // Default props if not provided
  const defaultProps = {
    behavior: 'single',
    allowAllClosed: false,
    itemSpacing: '8px',
    padding: '0px',
    margin: '0px',
    titleFontSize: '16px',
    titleFontWeight: '600',
    contentFontSize: '14px',
    fontFamily: 'system-ui, sans-serif',
    lineHeight: '1.5',
    titleColor: '#1f2937',
    titleBackground: '#f9fafb',
    contentColor: '#4b5563',
    contentBackground: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    activeTitleColor: '#1f2937',
    activeTitleBackground: '#f3f4f6',
    iconPosition: 'right',
    icon: '▼',
    activeIcon: '▲',
    animation: 'slide',
    animationDuration: 300,
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
  }

  const items = useMemo(() => {
    const propItems = props.items || defaultProps.items
    if (Array.isArray(propItems) && propItems.length > 0) {
      return propItems.map((item, index) => ({
        id: item.id || `item-${index}`,
        title: item.title || 'Untitled Section',
        content: item.content || 'Content goes here...',
        visible: item.visible !== false,
      }))
    }
    return defaultProps.items
  }, [props.items])

  const toggleItem = useCallback(
    (itemId: string) => {
      setOpenItems((prev) => {
        const newOpenItems = new Set(prev)
        const behavior = props.behavior || defaultProps.behavior
        const allowAllClosed = props.allowAllClosed || defaultProps.allowAllClosed

        if (behavior === 'single') {
          newOpenItems.clear()
          if (!prev.has(itemId) || allowAllClosed) {
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
    },
    [props.behavior, props.allowAllClosed],
  )

  const isItemOpen = useCallback((itemId: string) => openItems.has(itemId), [openItems])

  const accordionStyle: React.CSSProperties = {
    padding: props.padding || defaultProps.padding,
    margin: props.margin || defaultProps.margin,
    fontFamily: props.fontFamily || defaultProps.fontFamily,
    lineHeight: props.lineHeight || defaultProps.lineHeight,
  }

  const AccordionItem = useMemo(() => {
    return ({ item, index }: { item: any; index: number }) => {
      const isOpen = isItemOpen(item.id)
      const contentRef = useRef<HTMLDivElement>(null)
      const [contentHeight, setContentHeight] = useState(0)

      useEffect(() => {
        if (contentRef.current && isOpen) {
          setContentHeight(contentRef.current.scrollHeight)
        }
      }, [item.content, isOpen])

      const itemStyle: React.CSSProperties = {
        marginBottom: props.itemSpacing || defaultProps.itemSpacing,
        border: props.border || defaultProps.border,
        borderRadius: props.borderRadius || defaultProps.borderRadius,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }

      const headerStyle: React.CSSProperties = {
        padding: '16px 20px',
        backgroundColor: isOpen
          ? props.activeTitleBackground || defaultProps.activeTitleBackground
          : props.titleBackground || defaultProps.titleBackground,
        color: isOpen ? props.activeTitleColor || defaultProps.activeTitleColor : props.titleColor || defaultProps.titleColor,
        fontSize: props.titleFontSize || defaultProps.titleFontSize,
        fontWeight: props.titleFontWeight || defaultProps.titleFontWeight,
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
        backgroundColor: props.contentBackground || defaultProps.contentBackground,
        color: props.contentColor || defaultProps.contentColor,
        fontSize: props.contentFontSize || defaultProps.contentFontSize,
        overflow: 'hidden',
        transition: props.animation !== 'none' ? `all ${props.animationDuration || defaultProps.animationDuration}ms ease` : 'none',
      }

      const animation = props.animation || defaultProps.animation

      if (animation === 'slide') {
        contentStyle.maxHeight = isOpen ? `${contentHeight}px` : '0px'
        contentStyle.opacity = isOpen ? 1 : 0.8
      } else if (animation === 'fade') {
        contentStyle.maxHeight = isOpen ? 'none' : '0px'
        contentStyle.opacity = isOpen ? 1 : 0
      } else {
        contentStyle.display = isOpen ? 'block' : 'none'
      }

      const icon = isOpen ? props.activeIcon || defaultProps.activeIcon : props.icon || defaultProps.icon
      const iconPosition = props.iconPosition || defaultProps.iconPosition

      return (
        <div style={itemStyle} className="accordion-item">
          <button
            style={headerStyle}
            onClick={() => toggleItem(item.id)}
            aria-expanded={isOpen}
            aria-controls={`accordion-content-${item.id}`}
            className="accordion-header hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-300">
            {iconPosition === 'left' && (
              <span className="accordion-icon" style={{ fontSize: '12px', minWidth: '16px', transition: 'transform 0.3s ease' }}>
                {icon}
              </span>
            )}

            <span className="accordion-title flex-1" style={{ textAlign: 'left' }}>
              {item.title}
            </span>

            {iconPosition !== 'left' && (
              <span className="accordion-icon" style={{ fontSize: '12px', minWidth: '16px', transition: 'transform 0.3s ease' }}>
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
            className="accordion-content">
            <div
              style={{
                padding: '20px',
                lineHeight: props.lineHeight || defaultProps.lineHeight,
              }}>
              {item.content}
            </div>
          </div>
        </div>
      )
    }
  }, [props, isItemOpen, toggleItem])

  if (items.length === 0) {
    return (
      <div style={accordionStyle} className="accordion-empty-state p-4 text-center text-gray-500 border border-dashed rounded-lg">
        <p>No accordion items to display. Add questions in the editor.</p>
      </div>
    )
  }

  return (
    <div style={accordionStyle} className="professional-accordion">
      {items
        .filter((item) => item.visible !== false)
        .map((item, index) => (
          <AccordionItem key={item.id} item={item} index={index} />
        ))}
    </div>
  )
}

const DynamicTabs: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [tabs, setTabs] = useState(
    component.props?.tabs || [
      { title: 'Tab 1', content: 'Content for tab 1' },
      { title: 'Tab 2', content: 'Content for tab 2' },
    ],
  )
  const [activeTab, setActiveTab] = useState(component.props?.activeTab || 0)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingField, setEditingField] = useState<'title' | 'content' | null>(null)

  const updateTabs = (newTabs: any[]) => {
    setTabs(newTabs)
    onUpdate({ ...component.props, tabs: newTabs })
  }

  const addTab = () => {
    const newTabs = [...tabs, { title: 'New Tab', content: 'New content' }]
    updateTabs(newTabs)
    setEditingIndex(newTabs.length - 1)
    setEditingField('title')
  }

  const removeTab = (index: number) => {
    const newTabs = tabs.filter((_: any, i: number) => i !== index)
    updateTabs(newTabs)
    if (activeTab >= newTabs.length) setActiveTab(newTabs.length - 1)
    if (editingIndex === index) {
      setEditingIndex(null)
      setEditingField(null)
    }
  }

  const updateTab = (index: number, field: 'title' | 'content', value: string) => {
    const newTabs = [...tabs]
    newTabs[index] = { ...newTabs[index], [field]: value }
    updateTabs(newTabs)
  }

  return (
    <div className="border rounded">
      <div className="flex border-b">
        {tabs.map((tab: any, index: number) => (
          <div key={index} className="flex-1">
            {editingIndex === index && editingField === 'title' ? (
              <input
                type="text"
                value={tab.title}
                onChange={(e) => updateTab(index, 'title', e.target.value)}
                onBlur={() => {
                  setEditingIndex(null)
                  setEditingField(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setEditingIndex(null)
                    setEditingField(null)
                  }
                }}
                className="w-full p-2 border-0 focus:outline-none focus:border-blue-400"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setActiveTab(index)}
                className={`w-full p-3 text-left ${activeTab === index ? 'bg-blue-500 text-white border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
                onDoubleClick={() => {
                  setEditingIndex(index)
                  setEditingField('title')
                }}>
                {tab.title}
              </button>
            )}
            <button onClick={() => removeTab(index)} className="ml-2 text-red-500 hover:text-red-700 p-1 text-sm">
              ×
            </button>
          </div>
        ))}
        <button onClick={addTab} className="p-3 text-blue-500 hover:text-blue-600">
          +
        </button>
      </div>
      <div className="p-4">
        {editingIndex !== null && editingField === 'content' && editingIndex === activeTab ? (
          <textarea
            value={tabs[activeTab]?.content || ''}
            onChange={(e) => updateTab(activeTab, 'content', e.target.value)}
            onBlur={() => {
              setEditingIndex(null)
              setEditingField(null)
            }}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
            rows={4}
            autoFocus
          />
        ) : (
          <div
            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={() => {
              setEditingIndex(activeTab)
              setEditingField('content')
            }}>
            {tabs[activeTab]?.content || 'Tab content'}
          </div>
        )}
      </div>
    </div>
  )
}

const DynamicGrid: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const columns = component.props?.columns || 3
  const gap = component.props?.gap || '1rem'

  return (
    <div
      className="grid min-h-[200px]"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gap,
      }}>
      {Array.from({ length: columns * 2 }, (_, i) => (
        <div key={i} className="bg-gray-100 border border-gray-200 p-4 text-center text-gray-500 text-sm flex items-center justify-center">
          Cell {i + 1}
        </div>
      ))}
    </div>
  )
}

interface DynamicFlexBoxProps {
  component: LayoutComponent
  onUpdate: (props: any) => void
  isSelected?: boolean
}

const DynamicFlexBox: React.FC<DynamicFlexBoxProps> = ({ component, onUpdate, isSelected = false }) => {
  const componentProps = component.props || {}

  const [localProps, setLocalProps] = useState(() => ({
    direction: componentProps.direction || 'row',
    justifyContent: componentProps.justifyContent || 'flex-start',
    alignItems: componentProps.alignItems || 'stretch',
    alignContent: componentProps.alignContent || 'stretch',
    gap: componentProps.gap || '16px',
    rowGap: componentProps.rowGap || '16px',
    columnGap: componentProps.columnGap || '16px',
    wrap: componentProps.wrap || 'nowrap',
    padding: componentProps.padding || '16px',
    minHeight: componentProps.minHeight || 'auto',
    backgroundColor: componentProps.backgroundColor || 'transparent',
  }))

  useEffect(() => {
    setLocalProps({
      direction: componentProps.direction || 'row',
      justifyContent: componentProps.justifyContent || 'flex-start',
      alignItems: componentProps.alignItems || 'stretch',
      alignContent: componentProps.alignContent || 'stretch',
      gap: componentProps.gap || '16px',
      rowGap: componentProps.rowGap || '16px',
      columnGap: componentProps.columnGap || '16px',
      wrap: componentProps.wrap || 'nowrap',
      padding: componentProps.padding || '16px',
      minHeight: componentProps.minHeight || 'auto',
      backgroundColor: componentProps.backgroundColor || 'transparent',
    })
  }, [componentProps])

  const handlePropChange = (propName: string, value: any) => {
    const newProps = { ...localProps, [propName]: value }
    setLocalProps(newProps)
    onUpdate({ ...componentProps, ...newProps })
  }

  const getContainerStyle = (): React.CSSProperties => ({
    display: 'flex',
    flexDirection: localProps.direction,
    justifyContent: localProps.justifyContent,
    alignItems: localProps.alignItems,
    alignContent: localProps.alignContent,
    flexWrap: localProps.wrap,
    gap: localProps.gap,
    rowGap: localProps.rowGap,
    columnGap: localProps.columnGap,
    padding: localProps.padding,
    minHeight: localProps.minHeight === 'auto' ? '120px' : localProps.minHeight,
    backgroundColor: localProps.backgroundColor,
    transition: 'all 0.2s ease-in-out',
  })

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'row':
        return '→'
      case 'row-reverse':
        return '←'
      case 'column':
        return '↓'
      case 'column-reverse':
        return '↑'
      default:
        return '→'
    }
  }

  const quickLayouts = [
    {
      label: 'Horizontal Start',
      props: { direction: 'row', justifyContent: 'flex-start', alignItems: 'center' },
    },
    {
      label: 'Horizontal Center',
      props: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
    },
    {
      label: 'Horizontal Between',
      props: { direction: 'row', justifyContent: 'space-between', alignItems: 'center' },
    },
    {
      label: 'Vertical Start',
      props: { direction: 'column', justifyContent: 'flex-start', alignItems: 'stretch' },
    },
    {
      label: 'Vertical Center',
      props: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
    },
  ]

  return (
    <div
      className={`
      relative border-2 rounded-lg transition-all duration-200
      ${isSelected ? 'border-blue-300 ring-2 ring-blue-100 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}
    `}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-mono">{getDirectionIcon(localProps.direction)}</span>
            <span className="text-sm font-medium text-gray-700">Flex Container</span>
          </div>

          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {['row', 'column'].map((dir) => (
              <button
                key={dir}
                onClick={() => handlePropChange('direction', dir)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  localProps.direction === dir ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}>
                {dir === 'row' ? 'Horizontal' : 'Vertical'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 mr-2">Presets:</span>
          {quickLayouts.slice(0, 3).map((layout, index) => (
            <button
              key={index}
              onClick={() => {
                Object.entries(layout.props).forEach(([key, value]) => {
                  handlePropChange(key, value)
                })
              }}
              className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              title={layout.label}>
              {layout.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div
          className="rounded-lg border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100/50 transition-all duration-200"
          style={getContainerStyle()}>
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`
                flex items-center justify-center rounded border-2 transition-all duration-200
                ${isSelected ? 'bg-white border-blue-200 text-blue-600 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}
              `}
              style={{
                minWidth: localProps.direction.includes('row') ? '80px' : 'auto',
                minHeight: localProps.direction.includes('column') ? '60px' : 'auto',
                padding: '12px 16px',
              }}>
              <div className="text-center">
                <div className="font-medium text-sm">Item {item}</div>
                <div className="text-xs opacity-60 mt-1">{localProps.direction.includes('row') ? '80px' : '60px'}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 font-medium">Align:</span>
            <select
              value={localProps.justifyContent}
              onChange={(e) => handlePropChange('justifyContent', e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500">
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="space-between">Between</option>
              <option value="space-around">Around</option>
            </select>

            <select
              value={localProps.alignItems}
              onChange={(e) => handlePropChange('alignItems', e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500">
              <option value="stretch">Stretch</option>
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 font-medium">Gap:</span>
            <input
              type="text"
              value={localProps.gap}
              onChange={(e) => handlePropChange('gap', e.target.value)}
              className="w-16 text-xs border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:border-blue-500 font-mono"
              placeholder="16px"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 font-medium">Wrap:</span>
            <button
              onClick={() => handlePropChange('wrap', localProps.wrap === 'wrap' ? 'nowrap' : 'wrap')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                localProps.wrap === 'wrap' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}>
              {localProps.wrap === 'wrap' ? 'On' : 'Off'}
            </button>
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Flex Container</span>
          </div>
        </div>
      )}

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="text-center text-xs text-gray-500">This container will arrange child components using flexbox layout</div>
      </div>
    </div>
  )
}

const DynamicCard: React.FC<{
  component: LayoutComponent
  onUpdate: (props: any) => void
  isSelected: boolean
  onSelect: () => void
}> = ({ component, onUpdate, isSelected, onSelect }) => {
  return (
    <div className={`border rounded p-4 ${isSelected ? 'ring-2 ring-blue-400' : ''}`} onClick={onSelect}>
      <h3 className="text-lg font-semibold">{component.props?.title || 'Card Title'}</h3>
      <p className="text-gray-600">{component.props?.content || 'Card content goes here...'}</p>
    </div>
  )
}

const DynamicSection: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [type, setType] = useState(component.props?.type || 'home_banner')

  useEffect(() => {
    setType(component.props?.type || 'home_banner')
  }, [component.props?.type])

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded">
      <select
        value={type}
        onChange={(e) => {
          const newType = e.target.value
          setType(newType)
          onUpdate({ ...component.props, type: newType })
        }}
        className="p-2 border rounded mb-2">
        <option value="home_banner">Home Banner</option>
        <option value="about">About</option>
        <option value="services">Services</option>
        <option value="contact">Contact</option>
      </select>
      <div className="bg-gray-100 p-8 rounded text-center text-gray-500">Section: {type.replace('_', ' ').toUpperCase()}</div>
    </div>
  )
}

const DynamicImage: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [editingMode, setEditingMode] = useState<'none' | 'src' | 'alt'>('none')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)
  const altInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (e.shiftKey) {
      setEditingMode('src')
      setTimeout(() => urlInputRef.current?.focus(), 0)
    } else {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        onUpdate({ ...component.props, src: event.target?.result as string, alt: file.name })
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newSrc = (e.target as HTMLInputElement).value
      onUpdate({ ...component.props, src: newSrc })
      setEditingMode('none')
    } else if (e.key === 'Escape') {
      setEditingMode('none')
    }
  }

  const handleAltSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newAlt = (e.target as HTMLInputElement).value
      onUpdate({ ...component.props, alt: newAlt })
      setEditingMode('none')
    } else if (e.key === 'Escape') {
      setEditingMode('none')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        setIsUploading(true)
        const reader = new FileReader()
        reader.onload = (event) => {
          onUpdate({ ...component.props, src: event.target?.result as string, alt: file.name })
          setIsUploading(false)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const imageStyle: React.CSSProperties = {
    width: component.props?.width || '100%',
    height: component.props?.height || 'auto',
    maxWidth: component.props?.maxWidth || '100%',
    maxHeight: component.props?.maxHeight || 'none',
    border: component.props?.border || 'none',
    borderRadius: component.props?.borderRadius || '0px',
    padding: component.props?.padding || '0px',
    display: 'block',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    objectFit: 'cover',
  }

  const containerStyle: React.CSSProperties = {
    textAlign: component.props?.alignment || 'center',
    margin: component.props?.margin || '20px 0px',
    position: 'relative',
  }

  const imageElement = (
    <img
      id={component.props?.customId || undefined}
      className={component.props?.customClass || undefined}
      src={component.props?.src || 'https://via.placeholder.com/400x300?text=Click+to+upload'}
      alt={component.props?.alt || 'Image'}
      style={imageStyle}
      onClick={handleImageClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    />
  )

  const wrappedImage = component.props?.linkUrl
    ? React.createElement(
        'a',
        {
          href: component.props.linkUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          style: { display: 'inline-block' },
        },
        imageElement,
      )
    : imageElement

  return (
    <figure style={containerStyle}>
      <div
        className={`relative inline-block ${dragOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        {wrappedImage}

        {editingMode === 'src' && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded">
            <input
              ref={urlInputRef}
              type="text"
              defaultValue={component.props?.src || ''}
              onKeyDown={handleUrlSubmit}
              onBlur={() => setEditingMode('none')}
              className="px-2 py-1 text-sm bg-white border rounded w-3/4"
              placeholder="Enter image URL..."
            />
          </div>
        )}

        {editingMode === 'alt' && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded">
            <input
              ref={altInputRef}
              type="text"
              defaultValue={component.props?.alt || ''}
              onKeyDown={handleAltSubmit}
              onBlur={() => setEditingMode('none')}
              className="px-2 py-1 text-sm bg-white border rounded w-3/4"
              placeholder="Enter alt text..."
            />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
            <div className="text-white text-sm">Uploading...</div>
          </div>
        )}

        {dragOver && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 border-2 border-dashed border-blue-400 flex items-center justify-center rounded">
            <div className="text-blue-600 font-medium">Drop image here</div>
          </div>
        )}

        <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setEditingMode('src')
              setTimeout(() => urlInputRef.current?.focus(), 0)
            }}
            className="bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded text-xs hover:bg-white"
            title="Edit URL">
            URL
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setEditingMode('alt')
              setTimeout(() => altInputRef.current?.focus(), 0)
            }}
            className="bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded text-xs hover:bg-white"
            title="Edit Alt Text">
            Alt
          </button>
        </div>
      </div>

      {component.props?.caption && (
        <figcaption
          className="mt-2 text-sm text-gray-600 italic cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
          onClick={() => {
            const newCaption = prompt('Edit caption:', component.props?.caption || '')
            if (newCaption !== null) {
              onUpdate({ ...component.props, caption: newCaption })
            }
          }}>
          {component.props.caption}
        </figcaption>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </figure>
  )
}

const DynamicGallery: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [images, setImages] = useState(
    component.props?.images || [
      { src: 'https://via.placeholder.com/300x200?text=Image+1', alt: 'Image 1' },
      { src: 'https://via.placeholder.com/300x200?text=Image+2', alt: 'Image 2' },
      { src: 'https://via.placeholder.com/300x200?text=Image+3', alt: 'Image 3' },
    ],
  )

  const updateImages = (newImages: any[]) => {
    setImages(newImages)
    onUpdate({ ...(component.props || {}), images: newImages })
  }

  const addImage = () => {
    const newImages = [...images, { src: 'https://via.placeholder.com/300x200?text=New+Image', alt: 'New Image' }]
    updateImages(newImages)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_: any, i: number) => i !== index)
    updateImages(newImages)
  }

  const replaceImage = (index: number, file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const newImages = [...images]
      newImages[index] = { src: event.target?.result as string, alt: file.name }
      updateImages(newImages)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image: any, index: number) => (
          <div key={index} className="relative group">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-32 object-cover rounded border cursor-pointer"
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) replaceImage(index, file)
                }
                input.click()
              }}
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              ×
            </button>
          </div>
        ))}
      </div>
      <button onClick={addImage} className="text-blue-500 hover:text-blue-700 text-sm font-medium">
        + Add Image
      </button>
    </div>
  )
}

// ==================== MAIN COMPONENT ====================

const DynamicComponentInner = memo(
  forwardRef<HTMLDivElement, DynamicComponentProps>(function DynamicComponentInner(
    {
      component,
      isSelected,
      onSelect,
      onUpdate,
      editing = false,
      onComponentSelect,
      onComponentUpdate,
      draggableProps,
      dragHandleProps,
      onDragEnd,
      sectionId = '',
      containerId = '',
      rowId = '',
      colId = '',
      carouselId,
      slideIndex,
      // ✅ DESTRUCTURE THESE NEW PROPS:
      gridId,
      cellRow,
      cellCol,
      setSelectedComponent,
      deleteComponent,
      onDelete,
      layout,
      parentComponentId,
      parentGridId,
    },
    ref,
  ) {
    // ✅ Helper function - gridId, cellRow, cellCol ab available hai
    const createComponentContext = useCallback(
      (
        sectionId: string,
        containerId: string,
        rowId: string,
        colId: string,
        carouselId?: string,
        slideIndex?: number,
        gridId?: string,
        cellRow?: number,
        cellCol?: number,
        parentGridId?: string,
      ) => {
        return {
          sectionId,
          containerId,
          rowId,
          colId,
          carouselId,
          slideIndex,
          gridId: gridId || parentGridId,
          cellRow,
          cellCol,
          source: gridId ? ('grid-cell' as const) : carouselId ? ('carousel-direct' as const) : undefined,
          isNestedSelection: !!gridId || !!carouselId,
          parentComponentId: containerId,
          parentGridId,
        }
      },
      [],
    )
    const [localProps, setLocalProps] = useState(component.props || {})
    const [lastUpdateTime, setLastUpdateTime] = useState(0)
    const prevPropsRef = useRef(component.props || {})

    useEffect(() => {
      const currentTime = Date.now()

      // Use ref for comparison instead of localProps
      if (component.props && JSON.stringify(component.props) !== JSON.stringify(prevPropsRef.current)) {
        setLocalProps(component.props)
        setLastUpdateTime(currentTime)
        prevPropsRef.current = component.props
      }
    }, [component.props, component.id, component.type]) // localProps REMOVED from dependencies

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()

      if (onComponentSelect) {
        const context = createComponentContext(
          sectionId || '',
          containerId || '',
          rowId || '',
          colId || '',
          carouselId,
          slideIndex,
          gridId, // ✅ NO ERROR NOW
          cellRow, // ✅ NO ERROR NOW
          cellCol, // ✅ NO ERROR NOW
          parentGridId,
        )
        onComponentSelect(component, context)
      }

      onSelect?.()
    }
    // ENHANCED: Update handler that bubbles up through onComponentUpdate
    const handleUpdate = useCallback(
      (newProps: Record<string, any>) => {
        console.log('🔄 DynamicComponent: handleUpdate called:', {
          componentId: component.id,
          componentType: component.type,
          newProps,
          hasOnUpdate: !!onUpdate,
          hasOnComponentUpdate: !!onComponentUpdate,
          context: { sectionId, containerId, parentGridId },
          isGridChild: !!parentGridId,
        })

        setLocalProps((prev) => ({ ...prev, ...newProps }))

        // FIX: Always call onUpdate for ALL components
        if (onUpdate) {
          console.log('📤 DynamicComponent: Calling onUpdate for component:', component.id)
          onUpdate(newProps)
        }

        // CRITICAL: For grid children, MUST call onComponentUpdate
        if (onComponentUpdate && parentGridId) {
          console.log('📤 DynamicComponent: Bubbling update for grid child:', {
            componentId: component.id,
            parentGridId,
            newProps,
          })
          onComponentUpdate(component.id, newProps)
        } else if (onComponentUpdate) {
          // Also call for non-grid contexts
          console.log('📤 DynamicComponent: Calling onComponentUpdate:', {
            componentId: component.id,
            newProps,
          })
          onComponentUpdate(component.id, newProps)
        }
      },
      [onUpdate, onComponentUpdate, component.id, component.type, sectionId, containerId, parentGridId],
    )

    const handleSelectForComponents = useCallback(() => {
      if (onComponentSelect) {
        const context = createComponentContext(
          sectionId || '',
          containerId || '',
          rowId || '',
          colId || '',
          carouselId,
          slideIndex,
          gridId, // ✅ NO ERROR NOW
          cellRow, // ✅ NO ERROR NOW
          cellCol, // ✅ NO ERROR NOW
          parentGridId,
        )
        onComponentSelect(component, context)
      }

      onSelect?.()
    }, [
      onSelect,
      onComponentSelect,
      component.id,
      sectionId,
      containerId,
      rowId,
      colId,
      carouselId,
      slideIndex,
      gridId, // ✅ NO ERROR NOW
      cellRow, // ✅ NO ERROR NOW
      cellCol, // ✅ NO ERROR NOW
      parentGridId,
    ])

    const handleDeleteForComponents = useCallback(() => {
      if (onDelete) {
        onDelete(component.id)
      } else if (deleteComponent) {
        deleteComponent(component.id)
      }
    }, [onDelete, deleteComponent, component.id])

    const renderComponent = () => {
      const propsToUse = localProps

      switch (component.type) {
        case 'heading': {
          const [text, setText] = useState(propsToUse?.text || 'Heading Text')
          const [isEditing, setIsEditing] = useState(false)
          useEffect(() => setText(propsToUse?.text || 'Heading Text'), [propsToUse?.text])

          const Tag = propsToUse?.level || 'h2'

          const headingStyle = {
            fontSize: propsToUse?.fontSize || '24px',
            fontWeight: propsToUse?.fontWeight || 'bold',
            color: propsToUse?.fontColor || '#000000',
            fontFamily: propsToUse?.fontFamily || 'inherit',
            textAlign: propsToUse?.align || 'left',
            lineHeight: propsToUse?.lineHeight || '1.2',
            letterSpacing: propsToUse?.letterSpacing || '0px',
            backgroundColor: propsToUse?.backgroundColor || 'transparent',
            padding: propsToUse?.padding || '0px',
            margin: propsToUse?.margin || '0px 0px 16px 0px',
            textTransform: propsToUse?.textTransform || 'none',
            cursor: 'pointer',
            border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
            borderRadius: '4px',
            transition: 'border-color 0.2s ease',
            minHeight: '1.5em',
            outline: 'none',
          }

          return (
            <div className="relative">
              {isEditing ? (
                <input
                  type="text"
                  value={text}
                  onChange={(e) => {
                    const newText = e.target.value
                    setText(newText)
                    handleUpdate({ ...propsToUse, text: newText })
                  }}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      setIsEditing(false)
                    }
                  }}
                  style={{
                    ...headingStyle,
                    border: '2px solid #3b82f6',
                    backgroundColor: 'white',
                    padding: '8px 12px',
                    fontSize: propsToUse?.fontSize || '24px',
                    fontWeight: propsToUse?.fontWeight || 'bold',
                    color: propsToUse?.fontColor || '#000000',
                    fontFamily: propsToUse?.fontFamily || 'inherit',
                    textAlign: propsToUse?.align || 'left',
                    textTransform: propsToUse?.textTransform || 'none',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  autoFocus
                />
              ) : (
                React.createElement(
                  Tag,
                  {
                    id: propsToUse?.customId || undefined,
                    className: propsToUse?.customClass || undefined,
                    style: headingStyle,
                    onClick: (e: React.MouseEvent) => {
                      e.stopPropagation()
                      setIsEditing(true)
                      onSelect?.()
                    },
                    onDoubleClick: () => setIsEditing(true),
                  },
                  text,
                )
              )}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow">{Tag.toUpperCase()}</div>
              )}
            </div>
          )
        }

        case 'advancedheading': {
          const [isEditing, setIsEditing] = useState(false)
          const [localText, setLocalText] = useState(propsToUse?.text || 'Advanced Heading')

          useEffect(() => {
            setLocalText(propsToUse?.text || 'Advanced Heading')
          }, [propsToUse?.text])

          const resolvedTag = useMemo(() => {
            const htmlTag = propsToUse?.htmlTag
            if (!htmlTag || htmlTag === 'auto') {
              return propsToUse?.semanticLevel || propsToUse?.level || 'h2'
            }
            return htmlTag
          }, [propsToUse?.htmlTag, propsToUse?.semanticLevel, propsToUse?.level])

          const tagLabel = String(resolvedTag || 'h2').toUpperCase()

          const handleTextUpdate = (newText: string) => {
            setLocalText(newText)
            handleUpdate({ ...propsToUse, text: newText })
          }

          const handleSeoWarning = (warnings: string[]) => {
            if (warnings.length > 0 && isSelected) {
              // SEO warnings handled silently
            }
          }

          const RichTextEditor = () => (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto">
                <div className="border-b p-4 flex flex-wrap gap-2 bg-gray-50 rounded-t-lg">
                  <button
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                    onClick={() => document.execCommand('bold')}
                    type="button">
                    <strong>B</strong>
                  </button>
                  <button
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                    onClick={() => document.execCommand('italic')}
                    type="button">
                    <em>I</em>
                  </button>
                  <button
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                    onClick={() => document.execCommand('underline')}
                    type="button">
                    <u>U</u>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Color:</span>
                    <input
                      type="color"
                      className="w-8 h-8 cursor-pointer border rounded"
                      onChange={(e) => document.execCommand('foreColor', false, e.target.value)}
                    />
                  </div>

                  <div className="flex-1"></div>

                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium"
                    onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
                    onClick={() => {
                      const content = document.getElementById('rich-text-editor')?.innerHTML || ''
                      handleTextUpdate(content)
                      setIsEditing(false)
                    }}>
                    Save Changes
                  </button>
                </div>

                <div className="p-6">
                  <div
                    id="rich-text-editor"
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(localText) }}
                    className="min-h-[200px] max-h-[50vh] overflow-y-auto p-4 border rounded focus:outline-none focus:border-blue-400 prose prose-lg"
                    style={{
                      fontSize: propsToUse?.fontSize || '32px',
                      fontWeight: propsToUse?.fontWeight || 'bold',
                      fontFamily: propsToUse?.fontFamily || 'system-ui, sans-serif',
                      lineHeight: propsToUse?.lineHeight || '1.2',
                    }}
                  />

                  <div className="mt-3 text-sm text-gray-500 text-right">
                    Characters: {localText.replace(/<[^>]*>/g, '').length}
                    {propsToUse?.seoMaxLength && (
                      <span
                        className={localText.replace(/<[^>]*>/g, '').length > propsToUse.seoMaxLength ? 'text-red-500 ml-2' : 'text-green-500 ml-2'}>
                        / {propsToUse.seoMaxLength} (SEO recommended)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )

          const headingStyle = {
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }

          return (
            <div
              className={`component-edit-shell advanced-heading-shell relative ${isSelected ? 'is-selected' : ''}`}
              onClick={handleClick}
              style={headingStyle}
            >
              {!isEditing && (
                <div
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    setIsEditing(true)
                  }}
                  className="component-edit-body cursor-pointer p-0">
                  <AdvancedHeading {...propsToUse} text={localText} componentId={component.id} onSeoWarning={handleSeoWarning} />

                  {isSelected && (
                    <div className="component-edit-pill absolute -top-3 -right-3 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-2">
                      <span className="font-semibold">{tagLabel}</span>
                      <span>-</span>
                      <span>Rich Text</span>
                    </div>
                  )}

                  <div className="component-edit-hint absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-5 transition-all rounded flex items-center justify-center opacity-0 hover:opacity-100 pointer-events-none">
                    <div className="component-edit-hint-box bg-white px-4 py-2 rounded shadow text-sm text-gray-600 border">Double-click to edit rich text</div>
                  </div>
                </div>
              )}

              {isEditing && <RichTextEditor />}
            </div>
          )
        }

        case 'advancedparagraph': {
          const [isEditing, setIsEditing] = useState(false)
          const [localText, setLocalText] = useState(propsToUse?.text || 'Paragraph text...')

          useEffect(() => {
            setLocalText(propsToUse?.text || 'Paragraph text...')
          }, [propsToUse?.text])

          const handleTextUpdate = (newText: string) => {
            setLocalText(newText)
            handleUpdate({ ...propsToUse, text: newText })
          }

          const paragraphStyle = {
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: '0px',
          }

          return (
            <div
              className={`component-edit-shell advanced-paragraph-shell relative ${isSelected ? 'is-selected' : ''}`}
              onClick={handleClick}
              style={paragraphStyle}
            >
              {!isEditing && (
                <div
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    setIsEditing(true)
                  }}
                  className="component-edit-body cursor-pointer p-0">
                  <AdvancedParagraph
                    {...propsToUse}
                    text={localText}
                    onUpdate={handleUpdate}
                    componentId={component.id}
                    onComponentUpdate={onComponentUpdate}
                  />

                  {isSelected && (
                    <div className="component-edit-pill absolute -top-3 -right-3 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-2">
                      <span>✏️</span>
                      <span>Rich Text</span>
                    </div>
                  )}

                  <div className="component-edit-hint absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-5 transition-all rounded flex items-center justify-center opacity-0 hover:opacity-100 pointer-events-none">
                    <div className="component-edit-hint-box bg-white px-4 py-2 rounded shadow text-sm text-gray-600 border">Double-click to edit rich text</div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto">
                    <div className="border-b p-4 flex justify-between items-center bg-gray-50 rounded-t-lg">
                      <h3 className="font-semibold">Edit Paragraph</h3>
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium"
                          onClick={() => setIsEditing(false)}>
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
                          onClick={() => setIsEditing(false)}>
                          Save
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <textarea
                        value={localText.replace(/<[^>]*>/g, '')}
                        onChange={(e) => handleTextUpdate(e.target.value)}
                        className="w-full min-h-[200px] p-4 border rounded focus:outline-none focus:border-blue-400 resize-y"
                        style={{
                          fontSize: propsToUse?.fontSize || '16px',
                          fontFamily: propsToUse?.fontFamily || 'inherit',
                          lineHeight: propsToUse?.lineHeight || '1.6',
                        }}
                        autoFocus
                      />
                      <div className="mt-3 text-sm text-gray-500 text-right">Characters: {localText.replace(/<[^>]*>/g, '').length}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }

        case 'rich-text':
          return <DynamicRichText component={component} onUpdate={handleUpdate} />

        case 'quote':
          return <DynamicQuote component={component} onUpdate={handleUpdate} />

        case 'image':
          return <DynamicImage component={component} onUpdate={handleUpdate} />

        case 'video':
          return <DynamicVideo component={component} onUpdate={handleUpdate} />

        case 'icon':
          return <DynamicIcon component={component} onUpdate={handleUpdate} />

        case 'divider':
          return <DynamicDivider component={component} onUpdate={handleUpdate} />

        case 'container':
        case 'Container': {
          const containerProps = {
            maxWidth: propsToUse?.maxWidth || '960px',
            padding: propsToUse?.padding || '20px',
            margin: propsToUse?.margin || '0 auto',
            backgroundColor: propsToUse?.backgroundColor || 'transparent',
          }

          return (
            <div
              className={`component-edit-shell container-shell relative ${isSelected ? 'is-selected' : ''}`}
              onClick={handleClick}
              style={{ width: '100%' }}>
              <div
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  border: '1px solid var(--canvas-border, rgba(255,255,255,0.07))',
                  overflow: 'hidden',
                  background: 'var(--canvas-surface, #13161e)',
                }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    background: 'var(--canvas-surface2, #1a1d28)',
                    borderBottom: '1px solid var(--canvas-border, rgba(255,255,255,0.07))',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}>
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
                    Layout
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--canvas-text, #e8eaf0)' }}>Container</span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: '11.5px',
                      color: 'var(--canvas-text3, #5a5f7a)',
                      fontFamily: "'DM Mono', monospace",
                    }}>
                    {`max-width: ${containerProps.maxWidth}`}
                  </span>
                </div>

                <div
                  style={{
                    padding: '32px 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '120px',
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '420px',
                      border: '2px dashed rgba(124,109,250,0.3)',
                      borderRadius: '10px',
                      padding: containerProps.padding,
                      margin: containerProps.margin,
                      position: 'relative',
                      backgroundColor: containerProps.backgroundColor,
                    }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '-11px',
                        left: '14px',
                        background: 'var(--canvas-accent, #7c6dfa)',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 8px',
                        borderRadius: '10px',
                        letterSpacing: '0.04em',
                      }}>
                      Container
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      {[1, 2].map((index) => (
                        <div
                          key={index}
                          style={{
                            flex: 1,
                            height: '52px',
                            background: 'var(--canvas-surface3, #222533)',
                            border: '1px solid var(--canvas-border2, rgba(255,255,255,0.13))',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            color: 'var(--canvas-text3, #5a5f7a)',
                          }}>
                          Child block
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        case 'swipercontainer':
  return (
    <SwiperContainer
      {...propsToUse}
      component={component}
      onUpdate={handleUpdate}
      onSelect={handleSelectForComponents}
      onComponentSelect={onComponentSelect}
      onComponentUpdate={onComponentUpdate}
      sectionId={sectionId}
      containerId={containerId}
      rowId={rowId}
      colId={colId}
      carouselId={carouselId}
      slideIndex={slideIndex}
      setSelectedComponent={setSelectedComponent}
      deleteComponent={deleteComponent}
      parentComponentId={parentComponentId}
      parentGridId={parentGridId}
    />
  )

        case 'advancedbutton':
          // Merge default props with actual props
          const buttonProps = {
            ...advancedButtonDefaultProps,
            ...propsToUse,
          }

          return (
            <AdvancedButton
              {...buttonProps}
              componentId={component.id}
              onUpdate={handleUpdate}
              onComponentUpdate={onComponentUpdate}
              onSelect={handleSelectForComponents}
            />
          )

        case 'advancedaccordion':
          // Merge default props with actual props
          const accordionProps = {
            ...advancedAccordionDefaultProps,
            ...propsToUse,
            // Ensure items is always an array
            items: Array.isArray(propsToUse?.items) && propsToUse.items.length > 0 ? propsToUse.items : advancedAccordionDefaultProps.items,
          }

          return (
            <AdvancedAccordion
              {...accordionProps}
              componentId={component.id}
              onUpdate={handleUpdate}
              onComponentUpdate={onComponentUpdate}
              onSelect={handleSelectForComponents}
            />
          )

        case 'tabs':
          return <DynamicTabs component={component} onUpdate={handleUpdate} />

        case 'advancedlist':
          // Merge default props with actual props - SAME AS ACCORDION
          const listProps = {
            ...advancedListDefaultProps,
            ...propsToUse,
            // Ensure items is always an array - SAME AS ACCORDION
            items: Array.isArray(propsToUse?.items) && propsToUse.items.length > 0 ? propsToUse.items : advancedListDefaultProps.items,
          }

          return (
            <AdvancedList
              {...listProps}
              componentId={component.id}
              onUpdate={handleUpdate}
              onComponentUpdate={onComponentUpdate}
              onSelect={handleSelectForComponents}
            />
          )

        case 'flex-box':
          return <DynamicFlexBox component={component} onUpdate={handleUpdate} isSelected={isSelected} />

        case 'advancedCard':
          return (
            <AdvancedCardComponent
              {...propsToUse}
              onUpdate={handleUpdate}
              onSelect={handleSelectForComponents}
              onComponentSelect={onComponentSelect}
              onComponentUpdate={(newProps) => {
                // ✅ Yeh already sahi hona chahiye
                onComponentUpdate?.(component.id, newProps)
              }}
            />
          )

        case 'advancedImage': // ✅ CHANGE CASE HERE
          return (
            <AdvancedImageComponent
              {...propsToUse}
              onUpdate={handleUpdate}
              onSelect={handleSelectForComponents}
              onComponentUpdate={onComponentUpdate}
            />
          )

        case 'NewGrid':
          return (
            <NewGrid
              {...propsToUse}
              component={component} // Pass the component itself
              onUpdate={handleUpdate}
              onSelect={handleSelectForComponents}
              onComponentSelect={onComponentSelect} // ✅✅✅ YEH LINE ADD KARO
              onComponentUpdate={onComponentUpdate}
              sectionId={sectionId}
              containerId={containerId}
              rowId={rowId}
              colId={colId}
              carouselId={carouselId}
              slideIndex={slideIndex}
              setSelectedComponent={setSelectedComponent}
              deleteComponent={deleteComponent}
              layout={layout}
              parentComponentId={parentComponentId}
              parentGridId={parentGridId}
              // Pass cells directly as props for immediate rendering
              cells={propsToUse?.cells}
            />
          )

        default:
          return <div>Unsupported component type: {component.type}</div>
      }
    }

    return (
      <div
        ref={ref}
        data-selected={isSelected}
        className={`component-shell relative w-full max-w-full h-auto overflow-x-hidden transition-all duration-200 ${
          isSelected ? 'is-selected' : ''
        }`}
        onClick={handleClick}
        {...draggableProps}
        {...dragHandleProps}>
        {renderComponent()}

        {isSelected && (
          <div className="component-selected-badge absolute -top-3 -left-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    )
  }),
)

export const DynamicComponent = DynamicComponentInner
