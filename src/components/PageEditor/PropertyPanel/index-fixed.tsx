'use client'

import React, { useState } from 'react'
import { LayoutComponent, ComponentDefinition } from '@/types/page-editor'
import { componentRegistry } from '@/lib/componentRegistry'
import { PropertyField } from './PropertyField'
import { StylePanel } from '../StylePanel'
import { CustomCSS } from '../CustomCSS'

interface PropertyPanelProps {
  selectedComponent?: {
    sectionId: string;
    containerId: string;
    rowId: string;
    colId: string;
    compId: string;
    component: LayoutComponent;
  } | null;
  onComponentUpdate?: (componentId: string, props: Record<string, any>) => void;
  onClose?: () => void;
}

type TabType = 'content' | 'style' | 'advanced' | 'styling' | 'css';

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onComponentUpdate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const [localProps, setLocalProps] = useState<Record<string, any>>({})

  // Initialize local props when component changes
  React.useEffect(() => {
    if (selectedComponent) {
      setLocalProps(selectedComponent.component.props || {})
    }
  }, [selectedComponent])

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l shadow-lg flex flex-col">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">Select a component to edit its properties</p>
          </div>
        </div>
      </div>
    )
  }

  const componentDef = componentRegistry.getComponent(selectedComponent.component.type)

  if (!componentDef) {
    return (
      <div className="w-80 bg-white border-l shadow-lg">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold">Properties</h3>
        </div>
        <div className="p-4 text-center text-gray-500">
          Component type not found
        </div>
      </div>
    )
  }

  const handlePropChange = (propName: string, value: any) => {
    const newProps = { ...localProps, [propName]: value }
    setLocalProps(newProps)

    // Update the component
    if (onComponentUpdate) {
      onComponentUpdate(selectedComponent.compId, newProps)
    }
  }

  const handleStyleChange = (property: string, value: any) => {
    const newProps = { ...localProps, [property]: value }
    setLocalProps(newProps)

    if (onComponentUpdate) {
      onComponentUpdate(selectedComponent.compId, newProps)
    }
  }

  const handleCSSChange = (css: string) => {
    const newProps = { ...localProps, customCSS: css }
    setLocalProps(newProps)

    if (onComponentUpdate) {
      onComponentUpdate(selectedComponent.compId, newProps)
    }
  }

  // Group properties by tabs
  const groupedProperties = React.useMemo(() => {
    const groups: Record<TabType, Array<{ name: string; config: any }>> = {
      content: [],
      style: [],
      advanced: [],
      styling: [],
      css: []
    }

    Object.entries(componentDef.schema.properties).forEach(([propName, config]) => {
      // Simple heuristic: style-related properties go to style tab
      const styleProps = ['color', 'background', 'fontSize', 'fontWeight', 'textAlign', 'width', 'height', 'padding', 'margin', 'border']
      const advancedProps = ['className', 'id', 'data-', 'aria-']

      if (styleProps.some(styleProp => propName.toLowerCase().includes(styleProp.toLowerCase()))) {
        groups.style.push({ name: propName, config })
      } else if (advancedProps.some(advProp => propName.toLowerCase().includes(advProp.toLowerCase()))) {
        groups.advanced.push({ name: propName, config })
      } else {
        groups.content.push({ name: propName, config })
      }
    })

    return groups
  }, [componentDef])

  const tabs = [
    { id: 'content' as TabType, label: 'Content', count: groupedProperties.content.length },
    { id: 'style' as TabType, label: 'Style', count: groupedProperties.style.length },
    { id: 'styling' as TabType, label: 'Advanced Styling', icon: '🎨', count: 0 },
    { id: 'css' as TabType, label: 'Custom CSS', icon: '💻', count: 0 },
    { id: 'advanced' as TabType, label: 'Advanced', count: groupedProperties.advanced.length }
  ].filter(tab => tab.count > 0 || tab.id === 'styling' || tab.id === 'css')

  return (
    <div className="w-80 bg-white border-l shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Properties</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Component Info */}
        <div className="mt-2 p-2 bg-white rounded border">
          <div className="text-sm font-medium text-gray-900">
            {componentDef.name}
          </div>
          <div className="text-xs text-gray-500">
            {componentDef.category} • {selectedComponent.component.type}
          </div>
        </div>
      </div>

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex border-b bg-gray-50 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {(tab.count ?? 0) > 0 && (
                <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Properties */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'styling' ? (
          <StylePanel
            styles={localProps}
            onStyleChange={handleStyleChange}
          />
        ) : activeTab === 'css' ? (
          <CustomCSS
            css={localProps.customCSS || ''}
            onChange={handleCSSChange}
          />
        ) : (
          <div className="p-4 space-y-4">
            {groupedProperties[activeTab].length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No {activeTab} properties available</p>
              </div>
            ) : (
              groupedProperties[activeTab].map(({ name, config }) => (
                <PropertyField
                  key={name}
                  propName={name}
                  config={config}
                  value={localProps[name] ?? config.default}
                  onChange={(value) => handlePropChange(name, value)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          Changes are applied automatically
        </div>
      </div>
    </div>
  )
}
