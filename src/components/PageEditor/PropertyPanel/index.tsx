'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LayoutComponent, PageLayout, Section } from '@/types/page-editor'
import { componentRegistry } from '@/lib/componentRegistry'
import { PropertyField } from './PropertyField'
import { SectionProperties } from '@/components/PageEditor/components/SectionProperties'
import { sanitizeSectionProps, sectionSchemaList } from '@/lib/sectionSchemas'

interface PropertyPanelProps {
  selectedComponent?: {
    sectionId: string
    containerId: string
    rowId: string
    colId: string
    component: LayoutComponent
    compId: string
    gridId?: string
    carouselId?: string
    slideIndex?: number
    cellRow?: number
    cellCol?: number
  } | null
  sections?: Section[]
  layout?: PageLayout
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void
  onClose?: () => void
  selectedSectionId?: string
  onConfigureSectionColumns?: (sectionId: string) => void
  onSectionUpdate?: (sectionId: string, updates: any) => void
}

type TabType = 'content' | 'style' | 'ai'

const COLOR_SWATCHES = ['#ffffff', '#7c6dfa', '#a594ff', '#3ecf8e', '#f87171', '#fbbf24']
const QUICK_PROMPTS = ['Larger + bolder', 'Gradient text', 'Add animation', 'Pro tone', 'More padding', 'Center align']

const findComponentInLayout = (layout: PageLayout, componentId: string): LayoutComponent | null => {
  const search = (component: LayoutComponent | null | undefined): LayoutComponent | null => {
    if (!component) return null
    if (component.id === componentId) return component

    if (component.props?.components) {
      for (const nested of component.props.components) {
        const result = search(nested)
        if (result) return result
      }
    }

    if (component.props?.slides) {
      for (const slide of component.props.slides) {
        for (const nested of slide?.components || []) {
          const result = search(nested)
          if (result) return result
        }
      }
    }

    if (component.props?.cells) {
      for (const row of component.props.cells) {
        for (const cell of row || []) {
          const result = search(cell?.component)
          if (result) return result
        }
      }
    }

    return null
  }

  for (const section of layout?.sections || []) {
    for (const row of section.container?.rows || []) {
      for (const column of row.columns || []) {
        for (const component of column.components || []) {
          const result = search(component)
          if (result) return result
        }
      }
    }
  }

  return null
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  sections = [],
  layout,
  onComponentUpdate,
  selectedSectionId,
  onSectionUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const [localProps, setLocalProps] = useState<Record<string, any>>({})
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const sectionDebounceRef = useRef<NodeJS.Timeout>()

  const resolvedComponent = useMemo(() => {
    if (!selectedComponent) return null
    if (layout) return findComponentInLayout(layout, selectedComponent.compId) || selectedComponent.component
    return selectedComponent.component
  }, [layout, selectedComponent])

  const componentDef = useMemo(
    () => (resolvedComponent ? componentRegistry.getComponent(resolvedComponent.type) : null),
    [resolvedComponent],
  )

  useEffect(() => {
    setLocalProps(resolvedComponent?.props || {})
  }, [resolvedComponent])

  useEffect(() => {
    if (!selectedSectionId) {
      setSelectedSection(null)
      return
    }
    setSelectedSection(sections.find((section) => section.id === selectedSectionId) || null)
  }, [sections, selectedSectionId])

  useEffect(() => {
    return () => {
      if (sectionDebounceRef.current) clearTimeout(sectionDebounceRef.current)
    }
  }, [])

  const groupedProperties = useMemo(() => {
    const groups = {
      content: [] as Array<{ name: string; config: any }>,
      style: [] as Array<{ name: string; config: any }>,
    }

    if (!componentDef?.schema?.properties) return groups

    Object.entries(componentDef.schema.properties).forEach(([name, config]) => {
      const low = name.toLowerCase()
      if (['font', 'color', 'align', 'padding', 'margin', 'border', 'radius', 'opacity', 'background'].some((key) => low.includes(key))) {
        groups.style.push({ name, config })
      } else {
        groups.content.push({ name, config })
      }
    })

    return groups
  }, [componentDef])

  const usedProps = new Set([
    'text',
    'title',
    'headingText',
    'content',
    'label',
    'level',
    'semanticLevel',
    'fontFamily',
    'fontSize',
    'size',
    'fontWeight',
    'weight',
    'lineHeight',
    'textAlign',
    'align',
    'color',
    'marginTop',
    'marginBottom',
    'padding',
    'opacity',
    'borderRadius',
    'borderStyle',
    'customCSS',
  ])

  const handlePropChange = useCallback(
    (propName: string, value: any) => {
      if (!selectedComponent) return
      const nextProps = { ...localProps, [propName]: value }
      if (propName === 'level') nextProps.semanticLevel = value
      setLocalProps(nextProps)
      onComponentUpdate?.(resolvedComponent?.id || selectedComponent.compId, nextProps)
    },
    [localProps, onComponentUpdate, resolvedComponent, selectedComponent],
  )

  const handleSectionUpdate = useCallback(
    (sectionId: string, updates: any) => {
      if (!onSectionUpdate) return
      if (sectionDebounceRef.current) clearTimeout(sectionDebounceRef.current)
      sectionDebounceRef.current = setTimeout(() => onSectionUpdate(sectionId, updates), 220)
    },
    [onSectionUpdate],
  )

  const headingProp = ['headingText', 'title', 'text', 'content', 'label'].find((key) => key in localProps) || 'text'
  const levelValue = localProps.level || localProps.semanticLevel || 'h1'
  const normalizedComponentType = String(resolvedComponent?.type || '').toLowerCase()
  const isAdvancedHeading =
    normalizedComponentType === 'advancedheading' ||
    Boolean(componentDef?.schema?.properties?.level) ||
    Boolean(componentDef?.schema?.properties?.semanticLevel)

  const getDefaultHeadingSize = (level: string) => {
    const sizeMap: Record<string, number> = {
      h1: 36,
      h2: 24,
      h3: 17,
      h4: 15,
      h5: 14,
      h6: 12,
    }
    return sizeMap[level] || 24
  }

  const parseFontSize = (value: any) => {
    if (value === undefined || value === null) return undefined
    if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
    const str = String(value).trim()
    if (!str) return undefined
    if (/^-?\d+(\.\d+)?$/.test(str)) return Number(str)
    if (/^-?\d+(\.\d+)?px$/i.test(str)) return parseFloat(str)
    return undefined
  }

  const parseNumberValue = (value: any, fallback: number) => {
    const parsed = parseFontSize(value)
    return parsed ?? fallback
  }

  const parseLineHeight = (value: any) => {
    if (value === undefined || value === null) return 1.2
    const parsed = Number.parseFloat(String(value))
    return Number.isFinite(parsed) ? parsed : 1.2
  }

  const explicitFontSize = parseFontSize(localProps.fontSize ?? localProps.size)
  const fontSize = explicitFontSize ?? (isAdvancedHeading ? getDefaultHeadingSize(levelValue) : 50)
  const fontFamily = localProps.fontFamily || (isAdvancedHeading ? "'DM Sans', system-ui, sans-serif" : 'Inter')
  const fontWeight = String(localProps.fontWeight || localProps.weight || 600)
  const textAlign = String(localProps.textAlign || localProps.align || 'left')
  const colorValue = String(localProps.color || '#ffffff')
  const lineHeightValue = parseLineHeight(localProps.lineHeight)
  const marginTopValue = parseNumberValue(localProps.marginTop, 0)
  const marginBottomValue = parseNumberValue(localProps.marginBottom, 16)
  const paddingValue = String(localProps.padding ?? '24')
  const opacityValue = Number(localProps.opacity ?? 100)
  const radiusValue = Number(localProps.borderRadius ?? 0)
  const borderStyle = String(localProps.borderStyle || 'solid').toLowerCase()
  const sectionSettings = (selectedSection?.settings || {}) as Record<string, any>
  const sectionPaddingValue = String(sectionSettings.padding ?? 24)
  const sectionOpacityValue = Number(sectionSettings.opacity ?? 100)
  const sectionRadiusValue = Number(sectionSettings.borderRadius ?? 0)
  const sectionBorderStyle = String(sectionSettings.borderStyle || (sectionSettings.borderWidth ? 'solid' : 'none')).toLowerCase()

  const extraContentFields = groupedProperties.content.filter(({ name }) => !usedProps.has(name))
  const extraStyleFields = groupedProperties.style.filter(({ name }) => !usedProps.has(name))
  const groupedContentFields = useMemo(() => {
    const groups = new Map<string, Array<{ name: string; config: any }>>()
    if (!componentDef?.schema?.properties) return groups

    const labelForCategory = (value: string) => {
      const normalized = value.trim().toLowerCase()
      if (normalized === 'content') return 'Content'
      if (normalized === 'style') return 'Style'
      if (normalized === 'layout') return 'Layout'
      if (normalized === 'typography') return 'Typography'
      if (normalized === 'colors' || normalized === 'color') return 'Color'
      if (normalized === 'spacing') return 'Spacing'
      if (normalized === 'effects') return 'Effects'
      if (normalized === 'advanced') return 'Advanced'
      if (normalized === 'responsive') return 'Responsive'
      if (normalized === 'position') return 'Position'
      if (normalized === 'behavior') return 'Behavior'
      return value
    }

    Object.entries(componentDef.schema.properties).forEach(([name, config]) => {
      if (typeof config?.showIf === 'function') {
        try {
          if (!config.showIf(localProps)) return
        } catch {
          return
        }
      }
      const rawCategory = String(config?.category || 'Content')
      const category = labelForCategory(rawCategory)
      const existing = groups.get(category) || []
      existing.push({ name, config })
      groups.set(category, existing)
    })

    const ordered = new Map<string, Array<{ name: string; config: any }>>()
    const categoryOrder = ['Content', 'Typography', 'Color', 'Layout', 'Spacing', 'Effects', 'Responsive', 'Position', 'Behavior', 'Style', 'Advanced']
    categoryOrder.forEach((category) => {
      const fields = groups.get(category)
      if (fields?.length) ordered.set(category, fields)
    })
    groups.forEach((fields, category) => {
      if (!ordered.has(category)) ordered.set(category, fields)
    })

    return ordered
  }, [componentDef, localProps])
  const isSwiper = resolvedComponent?.type === 'swipercontainer'
  const swiperSlides = Array.isArray(localProps.slides) ? localProps.slides : []
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(selectedComponent?.slideIndex ?? 0)

  useEffect(() => {
    if (!isSwiper) return
    setActiveSlideIndex(selectedComponent?.slideIndex ?? 0)
  }, [isSwiper, selectedComponent?.slideIndex, resolvedComponent?.id])

  useEffect(() => {
    if (!isSwiper) return
    if (!swiperSlides.length) return
    if (activeSlideIndex >= swiperSlides.length) {
      setActiveSlideIndex(Math.max(0, swiperSlides.length - 1))
    }
  }, [activeSlideIndex, isSwiper, swiperSlides.length])

  const activeSlide = isSwiper && swiperSlides.length ? swiperSlides[activeSlideIndex] : null

  const updateSlideProp = (key: string, value: any) => {
    if (!isSwiper) return
    if (!swiperSlides.length) return
    const nextSlides = swiperSlides.map((slide: any, idx: number) => (idx === activeSlideIndex ? { ...slide, [key]: value } : slide))
    handlePropChange('slides', nextSlides)
  }

  const applySlidePreset = (preset: Record<string, any>) => {
    if (!isSwiper) return
    if (!swiperSlides.length) return
    const nextSlides = swiperSlides.map((slide: any, idx: number) => (idx === activeSlideIndex ? { ...slide, ...preset } : slide))
    handlePropChange('slides', nextSlides)
  }

  const slidePresets = [
    {
      id: 'hero',
      label: 'Hero',
      apply: {
        bgType: 'gradient',
        bgGradient: 'linear-gradient(135deg, #1a1628, #22263a)',
        bgColor: '#13161e',
        bgImage: '',
        bgOverlay: false,
      },
    },
    {
      id: 'dark',
      label: 'Dark',
      apply: {
        bgType: 'color',
        bgColor: '#13161e',
        bgGradient: '',
        bgImage: '',
        bgOverlay: false,
      },
    },
    {
      id: 'gradient',
      label: 'Gradient',
      apply: {
        bgType: 'gradient',
        bgGradient: 'linear-gradient(135deg, rgba(124,109,250,0.35), rgba(26,29,40,0.95))',
        bgColor: '#13161e',
        bgImage: '',
        bgOverlay: false,
      },
    },
    {
      id: 'image',
      label: 'Image Overlay',
      apply: {
        bgType: 'image',
        bgImage:
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
        bgGradient: '',
        bgOverlay: true,
        bgOverlayColor: '#000000',
        bgOverlayOpacity: 0.45,
      },
    },
  ]

  if (!selectedComponent && !selectedSectionId) {
    return (
      <div className="right-inner">
        <div className="rp-empty">
          <div className="rp-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 3 4.5 7v10L12 21l7.5-4V7L12 3Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
              <path d="M12 12v9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
              <path d="m4.5 7 7.5 5 7.5-5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
          <p>Select a component to edit its properties</p>
          <span>Click a section, container, or component on the canvas to load its settings here.</span>
        </div>
      </div>
    )
  }

  if (selectedSectionId && !selectedComponent && selectedSection && onSectionUpdate) {
    const sectionName = selectedSection.name || ''
    const sectionType = selectedSection.type || 'custom'

    return (
      <div className="right-inner">
        <div className="rp-top">
          <div className="rp-eye">Selected section</div>
          <div className="rp-name">Section settings</div>
          <div className="rp-sub">{`${sectionType} · ${selectedSection.id}`}</div>
        </div>

        <div className="rp-body rp-panel-scroll">
          <div className="rp-form">
            <div className="rp-card">
              <div className="rp-section-title">
                <div className="rp-section-title-main">Section identity</div>
                <div className="rp-section-title-sub">Name the section and choose the schema used for its properties.</div>
              </div>

              <div className="rp-field">
                <label>Section Name</label>
                <input
                  className="rp-input"
                  value={sectionName}
                  onChange={(event) => onSectionUpdate(selectedSection.id, { name: event.target.value })}
                  placeholder="Enter section name"
                />
              </div>

              <div className="rp-field">
                <label>Section Type</label>
                <select
                  className="rp-select"
                  value={sectionType}
                  onChange={(event) => {
                    const nextType = event.target.value
                    onSectionUpdate(selectedSection.id, {
                      type: nextType,
                      props: sanitizeSectionProps(nextType, nextType === selectedSection.type ? selectedSection.props : {}),
                    })
                  }}>
                  <option value="custom">Custom</option>
                  {sectionSchemaList.map((definition: any) => (
                    <option key={definition.type} value={definition.type}>
                      {definition.label}
                    </option>
                  ))}
                </select>
                <div className="note-ok">These settings save to the section itself, not just the component inside it.</div>
              </div>
            </div>

            <div className="rp-tabs">
              {[
                { id: 'content' as const, label: 'Content' },
                { id: 'style' as const, label: 'Style' },
                { id: 'ai' as const, label: 'AI +' },
              ].map((tab) => (
                <button key={tab.id} type="button" className={`rptab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {activeTab === 'content' ? <SectionProperties key={selectedSection.id} section={selectedSection} onUpdate={handleSectionUpdate} /> : null}

          {activeTab === 'style' ? (
            <div className="rp-form">
              <div className="frow">
                <label className="flbl">Padding</label>
                <div className="pad-box">
                  <input className="pad-in top" value={sectionPaddingValue} onChange={(event) => handleSectionUpdate(selectedSection.id, { settings: { padding: event.target.value } })} />
                  <input className="pad-in left" value={sectionPaddingValue} onChange={(event) => handleSectionUpdate(selectedSection.id, { settings: { padding: event.target.value } })} />
                  <div className="pad-center">section</div>
                  <input className="pad-in right" value={sectionPaddingValue} onChange={(event) => handleSectionUpdate(selectedSection.id, { settings: { padding: event.target.value } })} />
                  <input className="pad-in bottom" value={sectionPaddingValue} onChange={(event) => handleSectionUpdate(selectedSection.id, { settings: { padding: event.target.value } })} />
                </div>
              </div>

              <div className="frow">
                <div className="flbl-row">
                  <label className="flbl">Opacity</label>
                  <span className="rangeval">{sectionOpacityValue}%</span>
                </div>
                <input
                  className="rangeinp"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={sectionOpacityValue}
                  onChange={(event) => handleSectionUpdate(selectedSection.id, { settings: { opacity: Number(event.target.value) } })}
                />
              </div>

              <div className="frow">
                <div className="flbl-row">
                  <label className="flbl">Border Radius</label>
                  <span className="rangeval">{sectionRadiusValue}px</span>
                </div>
                <input
                  className="rangeinp"
                  type="range"
                  min="0"
                  max="32"
                  step="1"
                  value={sectionRadiusValue}
                  onChange={(event) => handleSectionUpdate(selectedSection.id, { settings: { borderRadius: Number(event.target.value) } })}
                />
              </div>

              <div className="frow">
                <label className="flbl">Border Type</label>
                <div className="chips">
                  {['none', 'solid', 'dashed'].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`chip ${sectionBorderStyle === value ? 'on' : ''}`}
                      onClick={() =>
                        handleSectionUpdate(selectedSection.id, {
                          settings: {
                            borderStyle: value,
                            borderWidth: value === 'none' ? 0 : 1,
                          },
                        })
                      }>
                      {value[0].toUpperCase() + value.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="frow">
                <label className="flbl">Custom CSS</label>
                <textarea
                  className="ta css-mini"
                  rows={4}
                  value={sectionSettings.customCSS || ''}
                  placeholder="/* custom styles */"
                  onChange={(event) => handleSectionUpdate(selectedSection.id, { settings: { customCSS: event.target.value } })}
                />
              </div>
            </div>
          ) : null}

          {activeTab === 'ai' ? (
            <div className="rp-form">
              <div className="ai-box">
                <div className="ai-lbl">✦ AI Editor</div>
                <textarea className="ta ai-ta" rows={3} value={aiPrompt} placeholder="Describe change…" onChange={(event) => setAiPrompt(event.target.value)} />
                <button type="button" className="gbtn primary w-full justify-center" onClick={() => setAiPrompt(aiPrompt)}>
                  Generate ✦
                </button>
              </div>

              <div className="quick-label">Quick Prompts</div>
              <div className="quick-tags">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="ai-tag"
                    onClick={() => setAiPrompt((value) => (value ? `${value} ${prompt}` : prompt))}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  if (!selectedComponent || !resolvedComponent || !componentDef) {
    return (
      <div className="right-inner">
        <div className="rp-empty">
          <div className="rp-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 3 4.5 7v10L12 21l7.5-4V7L12 3Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
              <path d="M12 12v.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
            </svg>
          </div>
          <p>Component settings unavailable</p>
          <span>Select a different component or reload the canvas to refresh the panel.</span>
        </div>
      </div>
    )
  }

  return (
      <div className="right-inner">
      <div className="rp-top">
        <div className="rp-eye">Selected component</div>
        <div className="rp-name">{componentDef.name}</div>
        <div className="rp-sub">{`${resolvedComponent.type} · ${selectedComponent.sectionId}`}</div>
      </div>

      <div className="rp-tabs">
        {[
          { id: 'content' as const, label: 'Content' },
          { id: 'style' as const, label: 'Style' },
          { id: 'ai' as const, label: 'AI +' },
        ].map((tab) => (
          <button key={tab.id} type="button" className={`rptab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rp-body rp-panel-scroll">
        {activeTab === 'content' ? (
          <div className="rp-form">
            {isAdvancedHeading ? (
              <>
                <div className="rp-group">
                  <div className="rp-group-label">Text</div>
                  <div className="rp-field">
                    <label>Heading Text</label>
                    <input className="rp-input" value={localProps[headingProp] || ''} onChange={(event) => handlePropChange(headingProp, event.target.value)} />
                  </div>
                  <div className="rp-field">
                    <label>Level</label>
                    <select className="rp-select" value={levelValue} onChange={(event) => handlePropChange('level', event.target.value)}>
                      <option value="h1">Heading 1 - Page Title</option>
                      <option value="h2">Heading 2 - Section Title</option>
                      <option value="h3">Heading 3</option>
                    </select>
                    <div className="note-ok">✓ Updates level + semanticLevel</div>
                  </div>
                </div>

                <div className="rp-group">
                  <div className="rp-group-label">Typography</div>
                  <div className="rp-field">
                    <label>Font Family</label>
                    <select className="rp-select" value={fontFamily} onChange={(event) => handlePropChange('fontFamily', event.target.value)}>
                      <option value="'DM Sans', system-ui, sans-serif">DM Sans</option>
                      <option value="Inter">Inter</option>
                      <option value="Manrope">Manrope</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Playfair Display">Playfair Display</option>
                    </select>
                  </div>
                  <div className="rp-row">
                    <div className="rp-field">
                      <label>Size</label>
                      <div className="rp-size-input">
                        <input type="number" min="12" max="96" step="1" value={fontSize} onChange={(event) => handlePropChange('fontSize', Number(event.target.value))} />
                        <div className="rp-size-unit">px</div>
                      </div>
                    </div>
                    <div className="rp-field">
                      <label>Line Height</label>
                      <div className="rp-size-input">
                        <input
                          type="number"
                          min="0.8"
                          max="3"
                          step="0.1"
                          value={lineHeightValue}
                          onChange={(event) => handlePropChange('lineHeight', event.target.value)}
                        />
                        <div className="rp-size-unit">×</div>
                      </div>
                    </div>
                  </div>
                  <div className="rp-field">
                    <label>Size slider</label>
                    <input className="slider" type="range" min="12" max="96" step="1" value={fontSize} onChange={(event) => handlePropChange('fontSize', Number(event.target.value))} />
                  </div>
                  <div className="rp-field">
                    <label>Weight</label>
                    <div className="weight-btns">
                      {['300', '400', '600', '700'].map((value) => (
                        <button key={value} type="button" className={`w-btn ${fontWeight === value ? 'active' : ''}`} onClick={() => handlePropChange('fontWeight', value)}>
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rp-field">
                    <label>Align</label>
                    <div className="align-btns">
                      {[
                        ['left', 'Left'],
                        ['center', 'Center'],
                        ['right', 'Right'],
                      ].map(([value, label]) => (
                        <button key={value} type="button" className={`align-btn ${textAlign === value ? 'active' : ''}`} onClick={() => handlePropChange('textAlign', value)}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rp-group">
                  <div className="rp-group-label">Color</div>
                  <div className="color-row">
                    {COLOR_SWATCHES.map((swatch) => (
                      <button
                        key={swatch}
                        type="button"
                        className={`color-swatch ${colorValue.toLowerCase() === swatch.toLowerCase() ? 'active' : ''}`}
                        style={{ background: swatch }}
                        onClick={() => handlePropChange('color', swatch)}
                      />
                    ))}
                  </div>
                </div>

                <div className="rp-group">
                  <div className="rp-group-label">Spacing</div>
                  <div className="rp-row">
                    <div className="rp-field">
                      <label>Margin T</label>
                      <div className="rp-size-input">
                        <input
                          type="number"
                          value={marginTopValue}
                          onChange={(event) => handlePropChange('marginTop', `${Number(event.target.value) || 0}px`)}
                        />
                        <div className="rp-size-unit">px</div>
                      </div>
                    </div>
                    <div className="rp-field">
                      <label>Margin B</label>
                      <div className="rp-size-input">
                        <input
                          type="number"
                          value={marginBottomValue}
                          onChange={(event) => handlePropChange('marginBottom', `${Number(event.target.value) || 0}px`)}
                        />
                        <div className="rp-size-unit">px</div>
                      </div>
                    </div>
                  </div>
                </div>

                {extraContentFields.length ? (
                  <div className="rp-group">
                    <div className="rp-group-label">Advanced</div>
                    {extraContentFields.map(({ name, config }) => (
                      <PropertyField key={name} propName={name} config={config} value={localProps[name] ?? config.default} onChange={(value) => handlePropChange(name, value)} />
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <>
                {Array.from(groupedContentFields.entries()).length ? (
                  Array.from(groupedContentFields.entries()).map(([groupName, fields]) => (
                    <div key={groupName} className="rp-group">
                      <div className="rp-group-label">{groupName}</div>
                      {fields.map(({ name, config }) => (
                        <PropertyField key={name} propName={name} config={config} value={localProps[name] ?? config.default} onChange={(value) => handlePropChange(name, value)} />
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="note-ok">No editable content fields for this component.</div>
                )}
              </>
            )}
          </div>
        ) : null}

        {activeTab === 'style' ? (
          <div className="rp-form">
            <div className="rp-section-title">
              <div className="rp-section-title-main">Layout</div>
              <div className="rp-section-title-sub">Spacing and structure for the selected element.</div>
            </div>

            <div className="frow">
              <label className="flbl">Padding</label>
              <div className="pad-box">
                <input className="pad-in top" value={paddingValue} onChange={(event) => handlePropChange('padding', event.target.value)} />
                <input className="pad-in left" value={paddingValue} onChange={(event) => handlePropChange('padding', event.target.value)} />
                <div className="pad-center">content</div>
                <input className="pad-in right" value={paddingValue} onChange={(event) => handlePropChange('padding', event.target.value)} />
                <input className="pad-in bottom" value={paddingValue} onChange={(event) => handlePropChange('padding', event.target.value)} />
              </div>
            </div>

            <div className="rp-section-title rp-section-tight">
              <div className="rp-section-title-main">Surface</div>
              <div className="rp-section-title-sub">Opacity, rounding, and border behavior.</div>
            </div>

            <div className="frow">
              <div className="flbl-row">
                <label className="flbl">Opacity</label>
                <span className="rangeval">{opacityValue}%</span>
              </div>
              <input className="rangeinp" type="range" min="0" max="100" step="1" value={opacityValue} onChange={(event) => handlePropChange('opacity', Number(event.target.value))} />
            </div>

            <div className="frow">
              <div className="flbl-row">
                <label className="flbl">Border Radius</label>
                <span className="rangeval">{radiusValue}px</span>
              </div>
              <input className="rangeinp" type="range" min="0" max="32" step="1" value={radiusValue} onChange={(event) => handlePropChange('borderRadius', Number(event.target.value))} />
            </div>

            <div className="frow">
              <label className="flbl">Border Style</label>
              <div className="chips">
                {['none', 'solid', 'dashed'].map((value) => (
                  <button key={value} type="button" className={`chip ${borderStyle === value ? 'on' : ''}`} onClick={() => handlePropChange('borderStyle', value)}>
                    {value[0].toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {isSwiper ? (
              <>
                <div className="rp-section-title rp-section-tight">
                  <div className="rp-section-title-main">Slide Background</div>
                  <div className="rp-section-title-sub">Per-slide color, image, gradient, and overlay controls.</div>
                </div>

                {swiperSlides.length ? (
                  <>
                    <div className="frow">
                      <label className="flbl">Slide</label>
                      <select
                        className="fi"
                        value={activeSlideIndex}
                        onChange={(event) => setActiveSlideIndex(Number(event.target.value))}>
                        {swiperSlides.map((slide: any, idx: number) => (
                          <option key={slide.id || `slide-${idx}`} value={idx}>
                            {`Slide ${idx + 1}${slide?.title ? ` · ${slide.title}` : ''}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="frow">
                      <label className="flbl">Background Type</label>
                      <select
                        className="fi"
                        value={activeSlide?.bgType || 'color'}
                        onChange={(event) => updateSlideProp('bgType', event.target.value)}>
                        <option value="color">Color</option>
                        <option value="image">Image</option>
                        <option value="gradient">Gradient</option>
                      </select>
                    </div>

                    <div className="frow">
                      <label className="flbl">Presets</label>
                      <div className="chips">
                        {slidePresets.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            className="chip"
                            onClick={() => {
                              applySlidePreset(preset.apply)
                            }}>
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {activeSlide?.bgType !== 'image' && activeSlide?.bgType !== 'gradient' ? (
                      <div className="frow">
                        <label className="flbl">Background Color</label>
                        <div className="color-row">
                          <input
                            type="color"
                            value={activeSlide?.bgColor || '#13161e'}
                            onChange={(event) => updateSlideProp('bgColor', event.target.value)}
                            className="colorinp"
                          />
                          <input
                            type="text"
                            value={activeSlide?.bgColor || '#13161e'}
                            onChange={(event) => updateSlideProp('bgColor', event.target.value)}
                            className="fi"
                          />
                        </div>
                      </div>
                    ) : null}

                    {activeSlide?.bgType === 'image' ? (
                      <div className="frow">
                        <label className="flbl">Background Image URL</label>
                        <input
                          className="fi"
                          value={activeSlide?.bgImage || ''}
                          onChange={(event) => updateSlideProp('bgImage', event.target.value)}
                          placeholder="https://example.com/hero.jpg"
                        />
                      </div>
                    ) : null}

                    {activeSlide?.bgType === 'gradient' ? (
                      <div className="frow">
                        <label className="flbl">Background Gradient</label>
                        <input
                          className="fi"
                          value={activeSlide?.bgGradient || ''}
                          onChange={(event) => updateSlideProp('bgGradient', event.target.value)}
                          placeholder="linear-gradient(135deg, #1a1628, #22263a)"
                        />
                      </div>
                    ) : null}

                    <div className="frow">
                      <label className="toggle-row">
                        <input
                          type="checkbox"
                          checked={Boolean(activeSlide?.bgOverlay)}
                          onChange={(event) => updateSlideProp('bgOverlay', event.target.checked)}
                          className="toggleinp"
                        />
                        <span className="flbl !mb-0">Overlay</span>
                      </label>
                    </div>

                    {activeSlide?.bgOverlay ? (
                      <>
                        <div className="frow">
                          <label className="flbl">Overlay Color</label>
                          <div className="color-row">
                            <input
                              type="color"
                              value={activeSlide?.bgOverlayColor || '#000000'}
                              onChange={(event) => updateSlideProp('bgOverlayColor', event.target.value)}
                              className="colorinp"
                            />
                            <input
                              type="text"
                              value={activeSlide?.bgOverlayColor || '#000000'}
                              onChange={(event) => updateSlideProp('bgOverlayColor', event.target.value)}
                              className="fi"
                            />
                          </div>
                        </div>

                        <div className="frow">
                          <div className="flbl-row">
                            <label className="flbl">Overlay Opacity</label>
                            <span className="rangeval">{Math.round((activeSlide?.bgOverlayOpacity ?? 0.4) * 100)}%</span>
                          </div>
                          <input
                            className="rangeinp"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={activeSlide?.bgOverlayOpacity ?? 0.4}
                            onChange={(event) => updateSlideProp('bgOverlayOpacity', Number(event.target.value))}
                          />
                        </div>
                      </>
                    ) : null}
                  </>
                ) : (
                  <div className="note-ok">Add a slide first to edit per-slide backgrounds.</div>
                )}
              </>
            ) : null}

            <div className="rp-section-title rp-section-tight">
              <div className="rp-section-title-main">Advanced</div>
              <div className="rp-section-title-sub">Custom CSS and component-specific extras.</div>
            </div>

            <div className="frow">
              <label className="flbl">Custom CSS</label>
              <textarea className="ta css-mini" rows={4} value={localProps.customCSS || ''} placeholder="/* custom styles */" onChange={(event) => handlePropChange('customCSS', event.target.value)} />
            </div>

            {extraStyleFields.length ? extraStyleFields.map(({ name, config }) => (
              <PropertyField key={name} propName={name} config={config} value={localProps[name] ?? config.default} onChange={(value) => handlePropChange(name, value)} />
            )) : null}
          </div>
        ) : null}

        {activeTab === 'ai' ? (
          <div className="rp-form">
            <div className="ai-box">
              <div className="ai-lbl">✦ AI Editor</div>
              <textarea className="ta ai-ta" rows={3} value={aiPrompt} placeholder="Describe change…" onChange={(event) => setAiPrompt(event.target.value)} />
              <button type="button" className="gbtn primary w-full justify-center" onClick={() => setAiPrompt(aiPrompt)}>
                Generate ✦
              </button>
            </div>

            <div className="quick-label">Quick Prompts</div>
            <div className="quick-tags">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="ai-tag"
                  onClick={() => setAiPrompt((value) => (value ? `${value} ${prompt}` : prompt))}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
