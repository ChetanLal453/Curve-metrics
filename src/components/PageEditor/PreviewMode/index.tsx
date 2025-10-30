'use client'

import React, { useState } from 'react'
import { DeviceFrame } from './DeviceFrame'
import { PreviewToolbar } from './PreviewToolbar'

interface PreviewModeProps {
  layout: any
  onClose: () => void
  className?: string
}

export const PreviewMode: React.FC<PreviewModeProps> = ({
  layout,
  onClose,
  className = ''
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape')
  const [zoom, setZoom] = useState(100)

  const deviceConfigs = {
    desktop: { width: 1920, height: 1080, name: 'Desktop' },
    tablet: {
      width: orientation === 'portrait' ? 768 : 1024,
      height: orientation === 'portrait' ? 1024 : 768,
      name: 'Tablet'
    },
    mobile: {
      width: orientation === 'portrait' ? 375 : 667,
      height: orientation === 'portrait' ? 667 : 375,
      name: 'Mobile'
    }
  }

  const currentDevice = deviceConfigs[device]

  return (
    <div className={`fixed inset-0 bg-gray-900 z-50 flex flex-col ${className}`}>
      {/* Toolbar */}
      <PreviewToolbar
        device={device}
        orientation={orientation}
        zoom={zoom}
        onDeviceChange={setDevice}
        onOrientationChange={setOrientation}
        onZoomChange={setZoom}
        onClose={onClose}
      />

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-100">
        <DeviceFrame
          device={device}
          orientation={orientation}
          width={currentDevice.width}
          height={currentDevice.height}
          zoom={zoom}
        >
          <div className="w-full h-full bg-white overflow-auto">
            {/* Render the layout content */}
            <div className="min-h-full">
              {layout.sections?.map((section: any, index: number) => (
                <div key={index} className="relative">
                  {/* Render section content - simplified for preview */}
                  <div
                    className="p-4"
                    style={{
                      backgroundColor: section.backgroundColor || '#ffffff',
                      minHeight: section.height || 'auto'
                    }}
                  >
                    <h2 className="text-2xl font-bold mb-4">
                      {section.title || `Section ${index + 1}`}
                    </h2>
                    <div className="text-gray-700">
                      Section content preview...
                    </div>
                  </div>
                </div>
              )) || (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p>No content to preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DeviceFrame>
      </div>
    </div>
  )
}

export default PreviewMode
