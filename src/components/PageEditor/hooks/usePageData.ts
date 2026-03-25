import { useState, useEffect, useCallback } from 'react'
import { Page, PageLayout, Section } from '@/types/page-editor'
import { sanitizeSectionProps, validateSectionProps } from '@/lib/sectionSchemas'

type EditorPage = Page & {
  slug?: string
  title?: string
  banner_slug?: string | null
}

const emptyLayout = (pageId = '', pageName = ''): PageLayout => ({
  id: pageId,
  name: pageName,
  sections: [],
})

const normalizeSection = (section: any, index: number) => {
  const rowId = section?.container?.rows?.[0]?.id || `row-${index + 1}`
  const normalizedColumns = Array.isArray(section?.container?.rows?.[0]?.columns)
    ? section.container.rows[0].columns.map((column: any, columnIndex: number) => ({
        id: column?.id || `col-${index + 1}-${columnIndex + 1}`,
        width: column?.width ?? 100,
        components: Array.isArray(column?.components) ? column.components : [],
      }))
    : Array.isArray(section?.columns)
      ? section.columns.map((column: any, columnIndex: number) => ({
          id: column?.id || `col-${index + 1}-${columnIndex + 1}`,
          width: column?.width ?? 100,
          components: Array.isArray(column?.components) ? column.components : [],
        }))
      : [
          {
            id: `col-${index + 1}-1`,
            width: 100,
            components: [],
          },
        ]

  return {
    ...section,
    id: section?.id || `section-${index + 1}`,
    name: section?.name || section?.title || `Section ${index + 1}`,
    type: section?.type || 'custom',
    props: sanitizeSectionProps(section?.type || 'custom', section?.props),
    columns: normalizedColumns,
    container: {
      id: section?.container?.id || `container-${index + 1}`,
      rows: [
        {
          id: rowId,
          columns: normalizedColumns,
        },
      ],
    },
  } satisfies Section & { props: Record<string, any>; columns: any[] }
}

const normalizeEditorLayout = (layout: any, page?: Partial<EditorPage>): PageLayout => {
  let parsedLayout = layout

  if (typeof parsedLayout === 'string') {
    try {
      parsedLayout = JSON.parse(parsedLayout)
    } catch {
      parsedLayout = null
    }
  }

  const safeLayout = parsedLayout && typeof parsedLayout === 'object' ? parsedLayout : {}
  const sections = Array.isArray(safeLayout.sections) ? safeLayout.sections : []

  return {
    id: String(safeLayout.id || page?.id || ''),
    name: String(safeLayout.name || page?.name || page?.title || 'Untitled Page'),
    sections: sections.map(normalizeSection),
  }
}

export const usePageData = (initialPageId?: string) => {
  const [pages, setPages] = useState<EditorPage[]>([])
  const [currentPageId, setCurrentPageId] = useState<string | null>(initialPageId || null)
  const [layout, setLayout] = useState<PageLayout>(emptyLayout())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPages = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/pages')
      const data = await response.json()
      console.log('API RESPONSE:', data)

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to fetch pages')
        return
      }

      const pagesPayload = Array.isArray(data?.pages) ? data.pages : []

      const pagesData: EditorPage[] = pagesPayload.map((page: any) => ({
        id: String(page.id),
        name: page.name || page.title || 'Untitled Page',
        title: page.title || page.name || 'Untitled Page',
        slug: page.slug || '',
        sections: [],
        active: page.active !== false,
        disabled: Boolean(page.disabled),
        header_slug: page.header_slug ?? null,
        footer_slug: page.footer_slug ?? null,
        banner_slug: page.banner_slug ?? null,
      }))

      setPages(pagesData)

      if (!pagesData.length) {
        setCurrentPageId(null)
        setLayout(emptyLayout())
        return
      }

      const requestedPage = initialPageId
        ? pagesData.find((page) => page.id === initialPageId)
        : currentPageId
          ? pagesData.find((page) => page.id === currentPageId)
          : null
      const defaultPage = pagesData.find((page) => page.slug === 'home') || pagesData[0]
      const nextPage = requestedPage || defaultPage

      if (nextPage?.id && nextPage.id !== currentPageId) {
        setCurrentPageId(nextPage.id)
      }
    } catch (fetchError) {
      console.error('Error fetching pages:', fetchError)
      setError('Error fetching pages')
    } finally {
      setLoading(false)
    }
  }, [currentPageId, initialPageId])

  const loadPage = useCallback(async (pageId: string | null) => {
    if (!pageId) {
      setLayout(emptyLayout())
      return
    }

    const currentPage = pages.find((page) => page.id === pageId)
    if (!currentPage?.slug) {
      setLayout(emptyLayout(pageId, currentPage?.name || 'Untitled Page'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/page/${encodeURIComponent(currentPage.slug)}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || data.message || 'Failed to load page')
        setLayout(emptyLayout(pageId, currentPage.name))
        return
      }

      const normalizedLayout = normalizeEditorLayout(data.layout, {
        id: data.page?.id ?? currentPage.id,
        name: data.page?.name ?? currentPage.name,
        title: data.page?.title ?? currentPage.title,
      })

      setLayout(normalizedLayout)
    } catch (loadError) {
      console.error('Error loading page:', loadError)
      setError('Error loading page')
      setLayout(emptyLayout(pageId, currentPage.name))
    } finally {
      setLoading(false)
    }
  }, [pages])

  const setCurrentPageIdHandler = useCallback(async (pageId: string | null) => {
    setCurrentPageId(pageId)
  }, [])

  const saveLayout = useCallback(async (newLayout: PageLayout): Promise<boolean> => {
    if (!currentPageId) {
      setError('No page selected')
      return false
    }

    const normalizedLayout = normalizeEditorLayout(newLayout, {
      id: currentPageId,
      name: newLayout?.name,
    })
    const validatedSections = normalizedLayout.sections.map((section) => {
      const validation = validateSectionProps(section.type, section.props)
      return {
        ...section,
        props: validation.sanitized ?? sanitizeSectionProps(section.type, section.props),
      }
    })
    const validatedLayout = {
      ...normalizedLayout,
      sections: validatedSections,
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/pages/${currentPageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layout: validatedLayout,
        }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to save layout')
        return false
      }

      const savedLayout = normalizeEditorLayout(data.page?.layout ?? validatedLayout, {
        id: data.page?.id ?? currentPageId,
        name: data.page?.name ?? validatedLayout.name,
        title: data.page?.title ?? validatedLayout.name,
      })

      setLayout(savedLayout)
      return true
    } catch (saveError) {
      console.error('Error saving layout:', saveError)
      setError('Error saving layout')
      return false
    } finally {
      setLoading(false)
    }
  }, [currentPageId])

  const createPage = useCallback(async (name: string): Promise<Page | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to create page')
        return null
      }

      const newPage: EditorPage = {
        id: String(data.page.id),
        name: data.page.name || name,
        title: data.page.title || data.page.name || name,
        slug: data.page.slug || '',
        sections: [],
        active: true,
        disabled: false,
        header_slug: data.page.header_slug ?? null,
        footer_slug: data.page.footer_slug ?? null,
        banner_slug: data.page.banner_slug ?? null,
      }

      setPages((previousPages) => [...previousPages, newPage])
      setCurrentPageId(newPage.id)
      setLayout(normalizeEditorLayout(data.page.layout, { id: newPage.id, name: newPage.name }))
      return newPage
    } catch (createError) {
      console.error('Error creating page:', createError)
      setError('Error creating page')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePage = useCallback(async (pageId: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to delete page')
        return false
      }

      const remainingPages = pages.filter((page) => page.id !== pageId)
      setPages(remainingPages)

      if (currentPageId === pageId) {
        const fallbackPage = remainingPages.find((page) => page.slug === 'home') || remainingPages[0] || null
        setCurrentPageId(fallbackPage?.id || null)
        setLayout(emptyLayout(fallbackPage?.id || '', fallbackPage?.name || ''))
      }

      return true
    } catch (deleteError) {
      console.error('Error deleting page:', deleteError)
      setError('Error deleting page')
      return false
    } finally {
      setLoading(false)
    }
  }, [currentPageId, pages])

  const disablePage = useCallback(async (pageId: string, disabled: boolean): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/pages/${pageId}/disable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disabled }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to update page status')
        return false
      }

      setPages((previousPages) =>
        previousPages.map((page) => (page.id === pageId ? { ...page, disabled } : page)),
      )
      return true
    } catch (disableError) {
      console.error('Error updating page status:', disableError)
      setError('Error updating page status')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const togglePageActive = useCallback((pageId: string, active: boolean) => {
    setPages((previousPages) =>
      previousPages.map((page) => (page.id === pageId ? { ...page, active } : page)),
    )
  }, [])

  useEffect(() => {
    void fetchPages()
  }, [fetchPages])

  useEffect(() => {
    if (!pages.length || !currentPageId) {
      return
    }

    void loadPage(currentPageId)
  }, [currentPageId, loadPage, pages])

  return {
    pages,
    currentPageId,
    setCurrentPageId: setCurrentPageIdHandler,
    layout,
    setLayout,
    loading,
    error,
    fetchPages,
    saveLayout,
    createPage,
    deletePage,
    disablePage,
    togglePageActive,
  }
}
