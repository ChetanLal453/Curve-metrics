'use client'

import React, { useState, useEffect } from 'react'

interface Page {
  id: number
  slug: string
  title: string
}

interface Section {
  id: string
  name: string
  type: string
  container: any
}

interface CrossPageCopyProps {
  section: Section
  onCopy: (targetPageId: string) => void
  onClose: () => void
}

export const CrossPageCopy: React.FC<CrossPageCopyProps> = ({
  section,
  onCopy,
  onClose
}) => {
  const [pages, setPages] = useState<Page[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [copying, setCopying] = useState(false)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/get-pages')
      const data = await response.json()
      if (data.success) {
        setPages(data.pages)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!selectedPageId) return

    setCopying(true)
    try {
      await onCopy(selectedPageId)
      onClose()
    } catch (error) {
      console.error('Error copying section:', error)
    } finally {
      setCopying(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Copy Section to Another Page</h3>
          <p className="text-sm text-slate-500 mt-1">
            Copy "{section.name}" to a different page
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Target Page
              </label>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <select
                  value={selectedPageId}
                  onChange={(e) => setSelectedPageId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a page...</option>
                  {pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.title} (/{page.slug})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="bg-slate-50 rounded-md p-3">
              <h4 className="text-sm font-medium text-slate-900 mb-2">Section Details</h4>
              <div className="text-sm text-slate-600">
                <div><strong>Name:</strong> {section.name}</div>
                <div><strong>Type:</strong> {section.type}</div>
                <div><strong>ID:</strong> {section.id}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium"
            disabled={copying}
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            disabled={!selectedPageId || copying}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {copying ? 'Copying...' : 'Copy Section'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CrossPageCopy
