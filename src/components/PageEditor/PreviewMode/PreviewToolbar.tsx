'use client'

import React from 'react'

interface PreviewToolbarProps {
  device: 'desktop' | 'tablet' | 'mobile'
  orientation: 'portrait' | 'landscape'
  zoom: number
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void
  onOrientationChange: (orientation: 'portrait' | 'landscape') => void
  onZoomChange: (zoom: number) => void
  onClose: () => void
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  device,
  orientation,
  zoom,
  onDeviceChange,
  onOrientationChange,
  onZoomChange,
  onClose
}) => {
  const handleScreenshot = () => {
    // This would trigger a screenshot of the current preview
    alert('Screenshot functionality would be implemented here')
  }

  const handleShare = () => {
    // This would generate a shareable preview link
    const shareUrl = window.location.href + '?preview=true'
    navigator.clipboard.writeText(shareUrl)
    alert('Preview link copied to clipboard: ' + shareUrl)
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        {/* Device Selection */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Device:</span>
          <div className="flex rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => onDeviceChange('desktop')}
              className={`px-3 py-1 text-sm rounded ${
                device === 'desktop' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🖥️ Desktop
            </button>
            <button
              onClick={() => onDeviceChange('tablet')}
              className={`px-3 py-1 text-sm rounded ${
                device === 'tablet' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📱 Tablet
            </button>
            <button
              onClick={() => onDeviceChange('mobile')}
              className={`px-3 py-1 text-sm rounded ${
                device === 'mobile' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📱 Mobile
            </button>
          </div>
        </div>

        {/* Orientation (for tablet and mobile) */}
        {(device === 'tablet' || device === 'mobile') && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Orientation:</span>
            <div className="flex rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => onOrientationChange('portrait')}
                className={`px-3 py-1 text-sm rounded ${
                  orientation === 'portrait' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📱 Portrait
              </button>
              <button
                onClick={() => onOrientationChange('landscape')}
                className={`px-3 py-1 text-sm rounded ${
                  orientation === 'landscape' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📱 Landscape
              </button>
            </div>
          </div>
        )}

        {/* Zoom Control */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Zoom:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onZoomChange(Math.max(25, zoom - 25))}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              -
            </button>
            <span className="text-sm font-medium min-w-[3rem] text-center">{zoom}%</span>
            <button
              onClick={() => onZoomChange(Math.min(200, zoom + 25))}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleScreenshot}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Screenshot</span>
        </button>

        <button
          onClick={handleShare}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>Share</span>
        </button>

        <div className="w-px h-6 bg-gray-300" />

        <button
          onClick={onClose}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Exit Preview</span>
        </button>
      </div>
    </div>
  )
}

export default PreviewToolbar
