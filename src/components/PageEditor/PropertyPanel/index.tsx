'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LayoutComponent, PageLayout, Section } from '@/types/page-editor'
import { componentRegistry } from '@/lib/componentRegistry'
import { PropertyField } from './PropertyField'
import { SectionProperties } from '@/components/PageEditor/components/SectionProperties'

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

const COLOR_SWATCHES = ['#eeeeff', '#7c5cfc', '#10d982', '#ffb020', '#ff5252', '#00d4ff']
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
    'textAlign',
    'align',
    'color',
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
  const isAdvancedHeading = resolvedComponent?.type === 'advancedheading'

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

  const explicitFontSize = parseFontSize(localProps.fontSize ?? localProps.size)
  const fontSize = explicitFontSize ?? (isAdvancedHeading ? getDefaultHeadingSize(levelValue) : 50)
  const fontFamily = localProps.fontFamily || (isAdvancedHeading ? "'DM Sans', system-ui, sans-serif" : 'Inter')
  const fontWeight = String(localProps.fontWeight || localProps.weight || 600)
  const textAlign = String(localProps.textAlign || localProps.align || 'left')
  const colorValue = String(localProps.color || '#eeeeff')
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
    return (
      <div className="right-inner">
        <div className="rp-top">
          <div className="rp-eye">Selected component</div>
          <div className="rp-name">{selectedSection.name || 'Section'}</div>
          <div className="rp-sub">{`${selectedSection.type || 'section'} · ${selectedSection.id}`}</div>
        </div>

        <div className="rp-tabs">
          {[
            { id: 'content' as const, label: 'Content' },
            { id: 'style' as const, label: 'Style' },
            { id: 'ai' as const, label: 'AI ✦' },
          ].map((tab) => (
            <button key={tab.id} type="button" className={`rptab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rp-body rp-panel-scroll">
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
          { id: 'ai' as const, label: 'AI ✦' },
        ].map((tab) => (
          <button key={tab.id} type="button" className={`rptab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rp-body rp-panel-scroll">
        {activeTab === 'content' ? (
          <div className="rp-form">
            <div className="rp-section-title">
              <div className="rp-section-title-main">Typography</div>
              <div className="rp-section-title-sub">Core text controls and alignment.</div>
            </div>

            <div className="frow">
              <label className="flbl">Heading Text</label>
              <input className="fi" value={localProps[headingProp] || ''} onChange={(event) => handlePropChange(headingProp, event.target.value)} />
            </div>

            <div className="frow">
              <label className="flbl">Level</label>
              <select className="fi" value={levelValue} onChange={(event) => handlePropChange('level', event.target.value)}>
                <option value="h1">Heading 1 - Page Title</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>
              <div className="note-ok">✓ Updates level + semanticLevel</div>
            </div>

            <div className="frow">
              <label className="flbl">Font Family</label>
              <select className="fi" value={fontFamily} onChange={(event) => handlePropChange('fontFamily', event.target.value)}>
                <option value="'DM Sans', system-ui, sans-serif">DM Sans</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Inter">Inter</option>
                <option value="Playfair Display">Playfair Display</option>
              </select>
            </div>

            <div className="frow">
              <div className="flbl-row">
                <label className="flbl">Size</label>
                <span className="rangeval">{fontSize}</span>
              </div>
              <input className="rangeinp" type="range" min="12" max="96" step="1" value={fontSize} onChange={(event) => handlePropChange('fontSize', Number(event.target.value))} />
            </div>

            <div className="frow">
              <label className="flbl">Weight</label>
              <div className="chips">
                {['300', '400', '600', '700'].map((value) => (
                  <button key={value} type="button" className={`chip ${fontWeight === value ? 'on' : ''}`} onClick={() => handlePropChange('fontWeight', value)}>
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="frow">
              <label className="flbl">Align</label>
              <div className="chips">
                {[
                  ['left', 'Left'],
                  ['center', 'Center'],
                  ['right', 'Right'],
                ].map(([value, label]) => (
                  <button key={value} type="button" className={`chip ${textAlign === value ? 'on' : ''}`} onClick={() => handlePropChange('textAlign', value)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rp-section-title rp-section-tight">
              <div className="rp-section-title-main">Color & Behavior</div>
              <div className="rp-section-title-sub">Visual emphasis and lightweight presentation controls.</div>
            </div>

            <div className="frow">
              <label className="flbl">Color</label>
              <div className="swatches">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch}
                    type="button"
                    className={`swatch ${colorValue.toLowerCase() === swatch.toLowerCase() ? 'on' : ''}`}
                    style={{ background: swatch }}
                    onClick={() => handlePropChange('color', swatch)}
                  />
                ))}
              </div>
            </div>

            <div className="vis-box">
              {[
                'Mobile',
                'Desktop',
                'Scroll animation',
              ].map((label, index) => (
                <div key={label} className={`vis-row ${index === 2 ? 'last' : ''}`}>
                  <span>{label}</span>
                  <button type="button" className={`mini-toggle ${index === 0 ? '' : 'on'}`}>
                    <span />
                  </button>
                </div>
              ))}
            </div>

            {extraContentFields.length ? (
              <>
                <div className="rp-section-title rp-section-tight">
                  <div className="rp-section-title-main">Advanced Fields</div>
                  <div className="rp-section-title-sub">Additional properties exposed by the selected component.</div>
                </div>
                {extraContentFields.map(({ name, config }) => (
                  <PropertyField key={name} propName={name} config={config} value={localProps[name] ?? config.default} onChange={(value) => handlePropChange(name, value)} />
                ))}
              </>
            ) : null}
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
