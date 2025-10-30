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

interface VersionCompareProps {
  versions: Version[]
  onClose: () => void
  className?: string
}

export const VersionCompare: React.FC<VersionCompareProps> = ({
  versions,
  onClose,
  className = ''
}) => {
  const [leftVersion, setLeftVersion] = useState(versions[0])
  const [rightVersion, setRightVersion] = useState(versions[1] || versions[0])

  if (versions.length < 2) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
        <div className="p-6 text-center">
          <p className="text-gray-600">Need at least 2 versions to compare</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const getLayoutSummary = (layout: any) => {
    if (!layout || !layout.sections) return 'No layout data'

    const sections = layout.sections || []
    const totalComponents = sections.reduce((total: number, section: any) => {
      if (!section.containers) return total
      return total + section.containers.reduce((sectionTotal: number, container: any) => {
        if (!container.rows) return sectionTotal
        return sectionTotal + container.rows.reduce((rowTotal: number, row: any) => {
          return rowTotal + (row.columns?.length || 0)
        }, 0)
      }, 0)
    }, 0)

    return `${sections.length} sections, ${totalComponents} components`
  }

  const compareLayouts = (layout1: any, layout2: any) => {
    const changes = []

    const sections1 = layout1?.sections || []
    const sections2 = layout2?.sections || []

    if (sections1.length !== sections2.length) {
      changes.push(`Sections: ${sections1.length} → ${sections2.length}`)
    }

    // Simple comparison - in a real implementation, you'd do deep diffing
    if (JSON.stringify(layout1) !== JSON.stringify(layout2)) {
      changes.push('Layout structure has changed')
    }

    return changes
  }

  const changes = compareLayouts(leftVersion.layout, rightVersion.layout)

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Compare Versions</h2>
            <p className="text-gray-600 mt-1">Compare layout changes between versions</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Version selectors */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Left Version (Old)
            </label>
            <select
              value={leftVersion.id}
              onChange={(e) => {
                const version = versions.find(v => v.id === e.target.value)
                if (version) setLeftVersion(version)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {versions.map(version => (
                <option key={version.id} value={version.id}>
                  v{version.version_number}: {version.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Right Version (New)
            </label>
            <select
              value={rightVersion.id}
              onChange={(e) => {
                const version = versions.find(v => v.id === e.target.value)
                if (version) setRightVersion(version)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {versions.map(version => (
                <option key={version.id} value={version.id}>
                  v{version.version_number}: {version.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Version */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Version {leftVersion.version_number}: {leftVersion.name}
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Created</div>
                <div className="font-medium">{new Date(leftVersion.created_at).toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Layout Summary</div>
                <div className="font-medium">{getLayoutSummary(leftVersion.layout)}</div>
              </div>
              {leftVersion.description && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Description</div>
                  <div className="font-medium">{leftVersion.description}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Version */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Version {rightVersion.version_number}: {rightVersion.name}
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Created</div>
                <div className="font-medium">{new Date(rightVersion.created_at).toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Layout Summary</div>
                <div className="font-medium">{getLayoutSummary(rightVersion.layout)}</div>
              </div>
              {rightVersion.description && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Description</div>
                  <div className="font-medium">{rightVersion.description}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Changes Summary */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Changes Detected</h4>
          {changes.length > 0 ? (
            <div className="space-y-2">
              {changes.map((change, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-yellow-800">{change}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800">No changes detected between versions</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VersionCompare
