'use client'

import React, { useState, useEffect } from 'react'

interface Page {
  id: number
  slug: string
  title: string
}

interface PageSelectorProps {
  currentPageId?: string | number
  onPageSelect: (pageId: string | number) => void
}

export const PageSelector: React.FC<PageSelectorProps> = ({
  currentPageId,
  onPageSelect
}) => {
  const [pages, setPages] = useState<Page[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const currentPage = pages.find(p => p.id.toString() === currentPageId?.toString())

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors text-sm"
        disabled={loading}
      >
        <span className="text-slate-700">
          {loading ? 'Loading...' : currentPage ? currentPage.title : 'Select Page'}
        </span>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-1 w-64 bg-white border border-slate-300 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
            {pages.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                No pages found
              </div>
            ) : (
              pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    onPageSelect(page.id)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors text-sm ${
                    currentPageId?.toString() === page.id.toString()
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-700'
                  }`}
                >
                  <div className="font-medium">{page.title}</div>
                  <div className="text-xs text-slate-500">/{page.slug}</div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default PageSelector
