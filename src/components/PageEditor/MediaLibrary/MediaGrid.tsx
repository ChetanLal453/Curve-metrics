'use client'

import React, { useState } from 'react'

interface MediaItem {
  id: string
  filename: string
  url: string
  type: string
  size: number
  uploaded_at: string
  alt?: string
  tags?: string[]
}

interface MediaGridProps {
  mediaItems: MediaItem[]
  loading: boolean
  onSelect: (item: MediaItem) => void
  onDelete: (mediaId: string) => void
  selectedItem: MediaItem | null
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  mediaItems,
  loading,
  onSelect,
  onDelete,
  selectedItem
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const isImage = (type: string) => type.startsWith('image/')

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading media...</p>
      </div>
    )
  }

  if (mediaItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-600">No media files found</p>
        <p className="text-sm text-gray-400 mt-1">Upload some images or files to get started</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
              selectedItem?.id === item.id
                ? 'border-blue-500 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelect(item)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Media preview */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {isImage(item.type) ? (
                <img
                  src={item.url}
                  alt={item.alt || item.filename}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xs text-gray-500">{item.type.split('/')[1]?.toUpperCase()}</p>
                </div>
              )}
            </div>

            {/* Overlay with actions */}
            <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center ${
              hoveredItem === item.id ? 'bg-opacity-50' : ''
            }`}>
              <div className={`flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform ${
                hoveredItem === item.id ? 'translate-y-0' : ''
              }`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(item)
                  }}
                  className="px-3 py-1 bg-white text-black rounded text-sm hover:bg-gray-200"
                  title="Select"
                >
                  ✓
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('Are you sure you want to delete this file?')) {
                      onDelete(item.id)
                    }
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>

            {/* File info */}
            <div className="p-2 bg-white">
              <p className="text-xs font-medium truncate" title={item.filename}>
                {item.filename}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(item.size)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MediaGrid
