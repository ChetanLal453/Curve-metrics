'use client'

import React, { useState, useEffect } from 'react'
import { MediaGrid } from './MediaGrid'
import { MediaUploader } from './MediaUploader'
import { MediaDetails } from './MediaDetails'

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

interface MediaLibraryProps {
  onSelect?: (media: MediaItem) => void
  selectedMedia?: MediaItem | null
  className?: string
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onSelect,
  selectedMedia,
  className = ''
}) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [showUploader, setShowUploader] = useState(false)

  useEffect(() => {
    fetchMediaItems()
  }, [])

  const fetchMediaItems = async () => {
    try {
      const response = await fetch('/api/media/list')
      const data = await response.json()
      if (data.success) {
        setMediaItems(data.media)
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    const formData = new FormData()

    Array.from(files).forEach(file => {
      formData.append('files', file)
    })

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        setMediaItems(prev => [...data.uploaded, ...prev])
        setShowUploader(false)
      }
    } catch (error) {
      console.error('Error uploading media:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (mediaId: string) => {
    try {
      const response = await fetch(`/api/media/delete?id=${mediaId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        setMediaItems(prev => prev.filter(item => item.id !== mediaId))
        if (selectedItem?.id === mediaId) {
          setSelectedItem(null)
        }
      }
    } catch (error) {
      console.error('Error deleting media:', error)
    }
  }

  const filteredMedia = mediaItems.filter(item =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className={`flex h-full ${className}`}>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Media Library</h2>
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showUploader ? 'Cancel Upload' : 'Upload Media'}
            </button>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {showUploader ? (
            <MediaUploader
              onUpload={handleUpload}
              uploading={uploading}
            />
          ) : (
            <MediaGrid
              mediaItems={filteredMedia}
              loading={loading}
              onSelect={(item) => {
                setSelectedItem(item)
                onSelect?.(item)
              }}
              onDelete={handleDelete}
              selectedItem={selectedItem}
            />
          )}
        </div>
      </div>

      {/* Details panel */}
      {selectedItem && (
        <div className="w-80 border-l border-gray-200">
          <MediaDetails
            media={selectedItem}
            onUpdate={(updatedMedia) => {
              setMediaItems(prev =>
                prev.map(item =>
                  item.id === updatedMedia.id ? updatedMedia : item
                )
              )
              setSelectedItem(updatedMedia)
            }}
            onClose={() => setSelectedItem(null)}
          />
        </div>
      )}
    </div>
  )
}

export default MediaLibrary
