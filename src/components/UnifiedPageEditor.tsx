'use client'

import React, { useState, useEffect } from 'react'
import PageEditor from '@/components/PageEditor/index-unified'

interface Page {
  id: number
  title: string
  slug: string
}

interface UnifiedPageEditorProps {
  mode?: 'admin' | 'builder'
}

import PageTitle from '@/components/PageTitle'

export default function UnifiedPageEditor({ mode = 'builder' }: UnifiedPageEditorProps) {
  const [pages, setPages] = useState<Page[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Fetch available pages
  useEffect(() => {
    fetch('/api/get-pages')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPages(data.pages)
          // Default to first page or create new
          if (data.pages.length > 0) {
            setSelectedPageId(data.pages[0].id.toString())
          }
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId)
  }

  const handleSave = (layout: any) => {
    // Save the page layout
    fetch('/api/save-page-layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_id: selectedPageId,
        layout: layout
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Page saved successfully!')
      } else {
        alert('Error saving page')
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <PageTitle title={mode === 'admin' ? 'Page Editor' : 'Page Builder'} />
      <div className="flex items-center space-x-4 mb-4">
        <select
          value={selectedPageId}
          onChange={(e) => handlePageSelect(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a page...</option>
          {pages.map(page => (
            <option key={page.id} value={page.id.toString()}>
              {page.title}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            const newPageName = prompt('Enter page name:')
            if (newPageName) {
              fetch('/api/create-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newPageName })
              })
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  setPages([...pages, data.page])
                  setSelectedPageId(data.page.id.toString())
                }
              })
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          New Page
        </button>
      </div>

      {/* Main Editor */}
      <div className="flex-1">
        {selectedPageId ? (
          <PageEditor
            pageId={selectedPageId}
            onSave={handleSave}
            showSaveButton={true}
          />
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to the {mode === 'admin' ? 'Page Editor' : 'Page Builder'}
              </h2>
              <p className="text-gray-600 mb-4">
                Select a page to start editing, or create a new one.
              </p>
              <button
                onClick={() => {
                  const newPageName = prompt('Enter page name:')
                  if (newPageName) {
                    fetch('/api/create-page', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title: newPageName })
                    })
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        setPages([...pages, data.page])
                        setSelectedPageId(data.page.id.toString())
                      }
                    })
                  }
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Your First Page
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
