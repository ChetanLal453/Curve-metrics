'use client'

import React, { useState, useEffect } from 'react'
import { Section, Column } from '@/types/page-editor'
import { PropertyField } from '@/components/PageEditor/PropertyPanel/PropertyField'
import { getSectionSchema, sanitizeSectionProps, sectionSchemaList } from '@/lib/sectionSchemas'

// Define local defaults
const sectionDefaultProps = {
  sticky_enabled: false,
  sticky_column_index: 0,
  sticky_position: 'top' as const,
  sticky_offset: 0,
  containerType: 'boxed' as const,
  maxWidth: 1200,
  sideSpacing: 20
}

// Extend the Section interface locally
interface ExtendedSection extends Section {
  settings?: Section['settings'] & {
    sticky_enabled?: boolean;
    sticky_column_index?: number;
    sticky_position?: 'top' | 'center' | 'bottom';
    sticky_offset?: number;
    containerType?: 'boxed' | 'full-width' | 'fluid';
    maxWidth?: number;
    sideSpacing?: number;
  }
}

interface SectionPropertiesProps {
  section: ExtendedSection
  onUpdate: (sectionId: string, updates: any) => void
}

export const SectionProperties: React.FC<SectionPropertiesProps> = ({ section, onUpdate }) => {
  // ✅ Get settings with defaults
  const settings = section.settings || {}
  const sectionSchema = getSectionSchema(section.type)
  const sectionProps = sanitizeSectionProps(section.type, section.props)
  
  const [sticky, setSticky] = useState({
    enabled: settings.sticky_enabled ?? sectionDefaultProps.sticky_enabled,
    columnIndex: settings.sticky_column_index ?? sectionDefaultProps.sticky_column_index,
    position: (settings.sticky_position ?? sectionDefaultProps.sticky_position) as 'top' | 'center' | 'bottom',
    offset: settings.sticky_offset ?? sectionDefaultProps.sticky_offset
  })
  
  const [containerSettings, setContainerSettings] = useState({
    type: settings.containerType ?? sectionDefaultProps.containerType,
    maxWidth: settings.maxWidth ?? sectionDefaultProps.maxWidth,
    sideSpacing: settings.sideSpacing ?? sectionDefaultProps.sideSpacing
  })

  const columns = section.container?.rows[0]?.columns || []

  // ✅ Update section width settings
  const updateContainerSettings = (updates: any) => {
    const newSettings = { ...containerSettings, ...updates }
    setContainerSettings(newSettings)
    
    onUpdate(section.id, {
      settings: {
        ...settings,
        containerType: newSettings.type,
        maxWidth: newSettings.maxWidth,
        sideSpacing: newSettings.sideSpacing
      }
    })
  }

  // ✅ Update column width
  const updateColumnWidth = (colIndex: number, width: number) => {
    if (!columns.length) return
    
    const newColumns = [...columns]
    newColumns[colIndex].width = width
    
    // Calculate other columns
    const otherColumns = newColumns.filter((_, idx) => idx !== colIndex)
    const remainingWidth = 100 - width
    const perColumnWidth = Math.round(remainingWidth / otherColumns.length)
    
    otherColumns.forEach((col, idx) => {
      const colIndex = newColumns.findIndex(c => c.id === col.id)
      if (colIndex !== -1) {
        newColumns[colIndex].width = perColumnWidth
      }
    })
    
    // Adjust last column if needed
    const total = newColumns.reduce((sum, col) => sum + (col.width || 0), 0)
    if (total !== 100 && newColumns.length > 0) {
      newColumns[newColumns.length - 1].width = (newColumns[newColumns.length - 1].width || 0) + (100 - total)
    }
    
    onUpdate(section.id, {
      container: {
        ...section.container,
        rows: [{
          ...(section.container?.rows[0] || { id: 'row-1', columns: [] }),
          columns: newColumns
        }]
      }
    })
  }
  
  // ✅ Update sticky settings
  const updateSticky = (updates: any) => {
    const newSticky = { ...sticky, ...updates }
    setSticky(newSticky)
    
    onUpdate(section.id, {
      settings: {
        ...settings,
        sticky_enabled: newSticky.enabled,
        sticky_column_index: newSticky.columnIndex,
        sticky_position: newSticky.position,
        sticky_offset: newSticky.offset
      }
    })
  }

  // ✅ Update general settings
  const updateSetting = (key: string, value: any) => {
    onUpdate(section.id, {
      settings: {
        ...settings,
        [key]: value
      }
    })
  }

  if (columns.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No columns found in this section
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      {/* SECTION NAME */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Section Name
        </label>
        <input
          type="text"
          value={section.name || ''}
          onChange={(e) => onUpdate(section.id, { name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter section name"
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Section Type</h3>
        <select
          value={section.type || 'custom'}
          onChange={(event) => {
            const nextType = event.target.value
            onUpdate(section.id, {
              type: nextType,
              props: sanitizeSectionProps(nextType, nextType === section.type ? section.props : {}),
            })
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="custom">Custom</option>
          {sectionSchemaList.map((definition: any) => (
            <option key={definition.type} value={definition.type}>
              {definition.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-gray-500">Registered section types use schema-driven props and safe fallback rendering.</p>
      </div>

      {sectionSchema ? (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Dynamic Section Content</h3>
          <div className="space-y-3">
            {sectionSchema.fields.map((field: any) => (
              <PropertyField
                key={field.name}
                propName={field.name}
                config={field}
                value={sectionProps[field.name]}
                onChange={(value) =>
                  onUpdate(section.id, {
                    props: {
                      ...sectionProps,
                      [field.name]: value,
                    },
                  })
                }
              />
            ))}
          </div>
        </div>
      ) : null}
      
      {/* SECTION WIDTH SETTINGS - NEW ADDITION */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Section Width</h3>
        
        {/* Container Type */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">Container Type</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => updateContainerSettings({ type: 'boxed' })}
              className={`p-3 rounded-lg border text-sm ${
                containerSettings.type === 'boxed'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
              Boxed
            </button>
            <button
              onClick={() => updateContainerSettings({ type: 'fluid' })}
              className={`p-3 rounded-lg border text-sm ${
                containerSettings.type === 'fluid'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
              Fluid
            </button>
            <button
              onClick={() => updateContainerSettings({ type: 'full-width' })}
              className={`p-3 rounded-lg border text-sm ${
                containerSettings.type === 'full-width'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
              Full Width
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            {containerSettings.type === 'boxed' && '✅ Content with side space (recommended)'}
            {containerSettings.type === 'fluid' && '📱 Content adjusts automatically with screen'}
            {containerSettings.type === 'full-width' && '🌊 Full browser width without side space'}
          </div>
        </div>
        
        {/* Max Width Control (only for boxed type) */}
        {containerSettings.type === 'boxed' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Max Width: {containerSettings.maxWidth}px
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="800"
                  max="1600"
                  step="50"
                  value={containerSettings.maxWidth}
                  onChange={(e) => updateContainerSettings({ maxWidth: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  value={containerSettings.maxWidth}
                  onChange={(e) => updateContainerSettings({ maxWidth: parseInt(e.target.value) || 1200 })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                  min="800"
                  max="1600"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Side Space: {containerSettings.sideSpacing}px
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={containerSettings.sideSpacing}
                  onChange={(e) => updateContainerSettings({ sideSpacing: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  value={containerSettings.sideSpacing}
                  onChange={(e) => updateContainerSettings({ sideSpacing: parseInt(e.target.value) || 20 })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                  min="0"
                  max="100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Space on left and right sides when screen is wider than max width
              </p>
            </div>
          </div>
        )}
        
        {/* Fluid container info */}
        {containerSettings.type === 'fluid' && (
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Fluid Container:</span> Content will adjust width automatically based on screen size with responsive side spacing.
            </p>
          </div>
        )}
        
        {/* Full-width container info */}
        {containerSettings.type === 'full-width' && (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Full Width Container:</span> Content will span the entire browser width without side spacing.
            </p>
          </div>
        )}
      </div>
      
      {/* COLUMN LAYOUT CONTROLS */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Column Layout ({columns.length} columns)
        </h3>
        
        <div className="space-y-4">
          {columns.map((col: Column, index: number) => {
            const columnWidth = col.width || Math.round(100 / columns.length)
            
            return (
              <div key={col.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Column {index + 1} 
                    {sticky.enabled && sticky.columnIndex === index && " 📌"}
                  </span>
                  <span className="text-sm font-medium">
                    {columnWidth}%
                  </span>
                </div>
                
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={columnWidth}
                  onChange={(e) => updateColumnWidth(index, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )
          })}
        </div>
      </div>
      
      {/* STICKY SETTINGS */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Sticky Column</h3>
            <p className="text-xs text-gray-500">Keep one column fixed while scrolling</p>
          </div>
          
          <button
            onClick={() => updateSticky({ enabled: !sticky.enabled })}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              sticky.enabled
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
            {sticky.enabled ? 'Sticky ON' : 'Sticky OFF'}
          </button>
        </div>
        
        {sticky.enabled && (
          <div className="space-y-4">
            {/* Column Selection */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Sticky Column:</label>
              <div className="grid grid-cols-2 gap-2">
                {columns.map((_: Column, index: number) => (
                  <button
                    key={index}
                    onClick={() => updateSticky({ columnIndex: index })}
                    className={`p-3 rounded-lg border text-sm ${
                      sticky.columnIndex === index
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    Column {index + 1}
                    {index === 0 && " (Left)"}
                    {index === columns.length - 1 && " (Right)"}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Position & Offset */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Position</label>
                <select
                  value={sticky.position}
                  onChange={(e) => updateSticky({ position: e.target.value as 'top' | 'center' | 'bottom' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="top">Top</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Offset: {sticky.offset}px from top
                </label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="10"
                  value={sticky.offset}
                  onChange={(e) => updateSticky({ offset: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* OTHER SECTION PROPERTIES */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Settings</h3>
        
        {/* Background Color */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Background Color</label>
          <input
            type="color"
            value={settings.backgroundColor || '#ffffff'}
            onChange={(e) => updateSetting('backgroundColor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
          />
        </div>
        
        {/* Padding */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Padding (px)</label>
          <input
            type="number"
            value={typeof settings.padding === 'string' ? parseInt(settings.padding) || 20 : settings.padding || 20}
            onChange={(e) => updateSetting('padding', parseInt(e.target.value) || 20)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            min="0"
            max="100"
          />
        </div>
        
        {/* Margin */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Margin (px)</label>
          <input
            type="number"
            value={typeof settings.margin === 'string' ? parseInt(settings.margin) || 0 : settings.margin || 0}
            onChange={(e) => updateSetting('margin', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            min="0"
            max="50"
          />
        </div>
        
        {/* Border Radius */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Border Radius (px)</label>
          <input
            type="number"
            value={typeof settings.borderRadius === 'string' ? parseInt(settings.borderRadius) || 0 : settings.borderRadius || 0}
            onChange={(e) => updateSetting('borderRadius', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            min="0"
            max="50"
          />
        </div>
        
        {/* Opacity */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Opacity: {((settings.opacity ?? 100) / 100).toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.opacity ?? 100}
            onChange={(e) => updateSetting('opacity', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        {/* Visibility Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`visible-${section.id}`}
            checked={settings.visible !== false}
            onChange={(e) => updateSetting('visible', e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-600"
          />
          <label htmlFor={`visible-${section.id}`} className="text-sm text-gray-700">
            Visible on Page
          </label>
        </div>
      </div>
    </div>
  )
}
