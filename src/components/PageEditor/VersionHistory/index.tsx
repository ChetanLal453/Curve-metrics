'use client'

import React, { useState, useEffect } from 'react'
import { VersionTimeline } from './VersionTimeline'
import { VersionCompare } from './VersionCompare'

interface Version {
  id: string
  page_id: string
  version_number: number
  name: string
  description: string
  layout: any
  created_by: string
  created_at: string
}

interface VersionHistoryProps {
  pageId: string
  currentLayout: any
  onRestore: (version: Version) => void
  className?: string
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  pageId,
  currentLayout,
  onRestore,
  className = ''
}) => {
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVersions, setSelectedVersions] = useState<Version[]>([])
  const [showCompare, setShowCompare] = useState(false)

  useEffect(() => {
    fetchVersions()
  }, [pageId])

  const fetchVersions = async () => {
    try {
      const response = await fetch(`/api/versions/list?page_id=${pageId}`)
      const data = await response.json()
      if (data.success) {
        setVersions(data.versions)
      }
    } catch (error) {
      console.error('Error fetching versions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveVersion = async (name: string, description: string) => {
    try {
      const response = await fetch('/api/versions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_id: pageId,
          name,
          description,
          layout: currentLayout
        })
      })

      const data = await response.json()
      if (data.success) {
        setVersions(prev => [data.version, ...prev])
      }
    } catch (error) {
      console.error('Error saving version:', error)
    }
  }

  const handleRestore = async (version: Version) => {
    if (!window.confirm(`Are you sure you want to restore to version "${version.name}"? This will overwrite the current layout.`)) {
      return
    }

    try {
      const response = await fetch('/api/versions/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version_id: version.id
        })
      })

      const data = await response.json()
      if (data.success) {
        onRestore(version)
        alert('Version restored successfully!')
      }
    } catch (error) {
      console.error('Error restoring version:', error)
    }
  }

  const handleCompare = (versions: Version[]) => {
    setSelectedVersions(versions)
    setShowCompare(true)
  }

  if (showCompare) {
    return (
      <VersionCompare
        versions={selectedVersions}
        onClose={() => setShowCompare(false)}
        className={className}
      />
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Version History</h2>
            <p className="text-gray-600 mt-1">Track changes and restore previous versions</p>
          </div>
          <button
            onClick={() => {
              const name = prompt('Version name:')
              if (name) {
                const description = prompt('Description (optional):')
                handleSaveVersion(name, description || '')
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Save Version</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading versions...</span>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No versions yet</h3>
            <p className="text-gray-600 mb-4">
              Save your first version to start tracking changes.
            </p>
            <button
              onClick={() => {
                const name = prompt('Version name:')
                if (name) {
                  const description = prompt('Description (optional):')
                  handleSaveVersion(name, description || '')
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save First Version
            </button>
          </div>
        ) : (
          <VersionTimeline
            versions={versions}
            onRestore={handleRestore}
            onCompare={handleCompare}
          />
        )}
      </div>
    </div>
  )
}

export default VersionHistory
