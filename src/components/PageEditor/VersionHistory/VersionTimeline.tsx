'use client'

import React, { useState } from 'react'

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

interface VersionTimelineProps {
  versions: Version[]
  onRestore: (version: Version) => void
  onCompare: (versions: Version[]) => void
}

export const VersionTimeline: React.FC<VersionTimelineProps> = ({
  versions,
  onRestore,
  onCompare
}) => {
  const [selectedVersions, setSelectedVersions] = useState<Set<string>>(new Set())

  const handleVersionSelect = (versionId: string) => {
    const newSelected = new Set(selectedVersions)
    if (newSelected.has(versionId)) {
      newSelected.delete(versionId)
    } else {
      newSelected.add(versionId)
    }
    setSelectedVersions(newSelected)
  }

  const handleCompare = () => {
    const selectedVersionObjects = versions.filter(v => selectedVersions.has(v.id))
    if (selectedVersionObjects.length >= 2) {
      onCompare(selectedVersionObjects)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-4">
      {/* Compare Actions */}
      {selectedVersions.size >= 2 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedVersions.size} versions selected
            </span>
            <button
              onClick={handleCompare}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Compare Versions
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {versions.map((version, index) => (
          <div key={version.id} className="relative">
            {/* Timeline line */}
            {index < versions.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
            )}

            <div className="flex items-start space-x-4">
              {/* Checkbox */}
              <div className="flex-shrink-0 mt-2">
                <input
                  type="checkbox"
                  checked={selectedVersions.has(version.id)}
                  onChange={() => handleVersionSelect(version.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              {/* Timeline dot */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {version.version_number}
                  </span>
                </div>
              </div>

              {/* Version content */}
              <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {version.name}
                    </h3>
                    {version.description && (
                      <p className="text-gray-600 mt-1">{version.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Created by: {version.created_by || 'Unknown'}</span>
                      <span>{formatDate(version.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => onRestore(version)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    >
                      Restore
                    </button>
                  </div>
                </div>

                {/* Version preview (simplified) */}
                <div className="mt-4 p-3 bg-gray-50 rounded border">
                  <div className="text-sm text-gray-600">
                    Sections: {version.layout?.sections?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {versions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No versions found
        </div>
      )}
    </div>
  )
}

export default VersionTimeline
