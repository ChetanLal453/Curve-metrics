'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
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

  // Initialize local props when component changes or props update
  React.useEffect(() => {
    if (selectedComponent?.component?.props && JSON.stringify(selectedComponent.component.props) !== JSON.stringify(localProps)) {
      setLocalProps(selectedComponent.component.props)
    }
  }, [selectedComponent?.component?.props, localProps])

  const componentDef = selectedComponent ? componentRegistry.getComponent(selectedComponent.component.type) : null

  // Group properties by tabs
  const groupedProperties = React.useMemo(() => {
    if (!componentDef) {
      return {
        content: [],
        style: [],
        advanced: [],
        styling: [],
        css: []
      }
    }

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

  if (!selectedComponent) {
    return (
      <div className="bg-white border-l border-slate-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-semibold text-slate-900">Properties</h3>
          <p className="text-sm text-slate-500 mt-1">Component settings and styles</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-slate-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No component selected</p>
            <p className="text-sm text-slate-500 mt-1">Click on a component to edit its properties</p>
          </div>
        </div>
      </div>
    )
  }

  if (!componentDef) {
    return (
      <div className="bg-white border-l shadow-lg">
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

  const tabs = [
    { id: 'content' as TabType, label: 'Content', count: groupedProperties.content.length },
    { id: 'style' as TabType, label: 'Style', count: groupedProperties.style.length },
    { id: 'styling' as TabType, label: 'Advanced Styling', icon: '🎨', count: 0 },
    { id: 'css' as TabType, label: 'Custom CSS', icon: '💻', count: 0 },
    { id: 'advanced' as TabType, label: 'Advanced', count: groupedProperties.advanced.length }
  ].filter(tab => tab.count > 0 || tab.id === 'styling' || tab.id === 'css')

  return (
    <div className="bg-white border-l border-slate-200 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Properties</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 transition-all duration-200 hover:scale-105 p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Component Info */}
        <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">
            {componentDef.name}
          </div>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-wide">
            {componentDef.category} • {selectedComponent.component.type}
          </div>
        </div>
      </div>

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex border-b border-slate-200 bg-slate-50/50 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {tab.icon && <span className="text-base">{tab.icon}</span>}
              <span>{tab.label}</span>
              {(tab.count ?? 0) > 0 && (
                <span className="ml-2 text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
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
          <div className="p-6 space-y-5">
            {groupedProperties[activeTab].length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium">No {activeTab} properties</p>
                <p className="text-sm text-slate-500 mt-1">This component doesn't have {activeTab} settings</p>
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

      {/* Footer with Save/Apply Buttons */}
      <div className="p-2 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <button
            onClick={() => {
              // Apply changes
              toast.success('Changes applied successfully')
            }}
            className="flex-1 px-2 py-1 bg-blue-100 text-black rounded-md hover:bg-blue-200 transition-colors text-xs font-medium"
          >
            Apply Changes
          </button>
          <button
            onClick={() => {
              // Save changes
              toast.success('Changes saved successfully')
            }}
            className="flex-1 px-2 py-1 bg-green-100 text-black rounded-md hover:bg-green-200 transition-colors text-xs font-medium"
          >
            Save
          </button>
        </div>
        <div className="text-xs text-slate-500 text-center mt-1">
          Changes are applied automatically
        </div>
      </div>
    </div>
  )
}
