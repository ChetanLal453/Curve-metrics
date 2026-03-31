import { useState, useEffect, useCallback, useRef } from 'react'
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
    id: String(page?.id || safeLayout.id || ''),
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
  const activePagesFetchRequestRef = useRef(0)
  const activeLoadRequestRef = useRef(0)
  const activeSaveRequestRef = useRef(0)
  const hasResolvedInitialPageRef = useRef(false)
  const currentPageIdRef = useRef<string | null>(initialPageId || null)

  useEffect(() => {
    currentPageIdRef.current = currentPageId
  }, [currentPageId])

  const fetchPages = useCallback(async () => {
    const requestId = activePagesFetchRequestRef.current + 1
    activePagesFetchRequestRef.current = requestId

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/pages')
      const data = await response.json()

      if (!response.ok || !data.success) {
        if (requestId !== activePagesFetchRequestRef.current) return
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

      if (requestId !== activePagesFetchRequestRef.current) return
      setPages(pagesData)

      if (!pagesData.length) {
        currentPageIdRef.current = null
        setCurrentPageId(null)
        setLayout(emptyLayout())
        return
      }

      const defaultPage = pagesData.find((page) => String(page.slug || '').toLowerCase() === 'home') || pagesData[0]

      let nextPage: EditorPage | undefined
      if (!hasResolvedInitialPageRef.current) {
        nextPage = initialPageId
          ? pagesData.find((page) => String(page.id) === String(initialPageId))
          : defaultPage
        hasResolvedInitialPageRef.current = true
      } else {
        const selectedPageId = currentPageIdRef.current
        nextPage = selectedPageId
          ? pagesData.find((page) => String(page.id) === String(selectedPageId))
          : defaultPage
      }

      if (nextPage?.id && String(nextPage.id) !== String(currentPageIdRef.current ?? '')) {
        currentPageIdRef.current = String(nextPage.id)
        setCurrentPageId(nextPage.id)
      }
    } catch (fetchError) {
      console.error('Error fetching pages:', fetchError)
      if (requestId !== activePagesFetchRequestRef.current) return
      setError('Error fetching pages')
    } finally {
      if (requestId !== activePagesFetchRequestRef.current) return
      setLoading(false)
    }
  }, [initialPageId])

  const loadPage = useCallback(async (pageId: string | null) => {
    const normalizedPageId = pageId == null ? null : String(pageId)
    const requestId = activeLoadRequestRef.current + 1
    activeLoadRequestRef.current = requestId

    if (!normalizedPageId) {
      setLayout(emptyLayout())
      return
    }

    const currentPage = pages.find((page) => String(page.id) === normalizedPageId)
    if (!currentPage) {
      setLayout(emptyLayout(normalizedPageId, 'Untitled Page'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      let loaded = false
      let lastError: string | null = null

      // 1) Preferred path: admin page by ID (authoritative editor source)
      if (!loaded) {
        const idResponse = await fetch(`/api/pages/${encodeURIComponent(normalizedPageId)}`)
        const idData = await idResponse.json()

        if (idResponse.ok && idData.success) {
          if (requestId !== activeLoadRequestRef.current) return
          const responsePageId = idData.page?.id == null ? null : String(idData.page.id)
          if (!responsePageId || responsePageId === normalizedPageId) {
            const normalizedLayout = normalizeEditorLayout(idData.page?.layout, {
              id: idData.page?.id ?? currentPage.id,
              name: idData.page?.name ?? currentPage.name,
              title: idData.page?.title ?? currentPage.title,
            })
            setLayout(normalizedLayout)
            loaded = true
          } else {
            lastError = `Page ID mismatch (requested ${normalizedPageId}, got ${responsePageId})`
          }
        } else {
          lastError = idData.error || idData.message || 'Failed to load page'
        }
      }

      // 2) Fallback path: slug endpoint (public route) when ID route fails
      if (!loaded && currentPage.slug) {
        try {
          const slugResponse = await fetch(`/api/page/${encodeURIComponent(currentPage.slug)}`)
          const slugData = await slugResponse.json()

          if (slugResponse.ok && slugData.success) {
            if (requestId !== activeLoadRequestRef.current) return
            const responsePageId = slugData.page?.id == null ? null : String(slugData.page.id)
            const expectedPageId = currentPage?.id == null ? null : String(currentPage.id)
            if (!responsePageId || !expectedPageId || responsePageId === expectedPageId) {
              const editorLayoutSource = slugData.draft_layout ?? slugData.layout
              const normalizedLayout = normalizeEditorLayout(editorLayoutSource, {
                id: slugData.page?.id ?? currentPage.id,
                name: slugData.page?.name ?? currentPage.name,
                title: slugData.page?.title ?? currentPage.title,
              })
              setLayout(normalizedLayout)
              loaded = true
            } else {
              lastError = `Page slug mismatch (expected ${expectedPageId}, got ${responsePageId})`
            }
          } else {
            lastError = slugData.error || slugData.message || 'Failed to load page by slug'
          }
        } catch (error) {
          console.error('Error loading page by slug:', error)
          lastError = 'Error loading page by slug'
        }
      }

      if (!loaded) {
        if (requestId !== activeLoadRequestRef.current) return
        setError(lastError || 'Failed to load page')
        setLayout(emptyLayout(normalizedPageId, currentPage.name))
      }
    } catch (loadError) {
      console.error('Error loading page:', loadError)
      if (requestId !== activeLoadRequestRef.current) return
      setError('Error loading page')
      setLayout(emptyLayout(normalizedPageId, currentPage.name))
    } finally {
      if (requestId !== activeLoadRequestRef.current) return
      setLoading(false)
    }
  }, [pages])

  const setCurrentPageIdHandler = useCallback((pageId: string | null) => {
    const normalizedPageId = pageId == null ? null : String(pageId)
    if (normalizedPageId === currentPageIdRef.current) return
    currentPageIdRef.current = normalizedPageId
    setCurrentPageId(normalizedPageId)
  }, [])

  const saveLayout = useCallback(async (newLayout: PageLayout): Promise<boolean> => {
    const layoutPageId = newLayout?.id == null ? null : String(newLayout.id)
    const selectedPageId = currentPageIdRef.current == null ? null : String(currentPageIdRef.current)
    if (layoutPageId && selectedPageId && layoutPageId !== selectedPageId) {
      // Ignore stale autosave attempts from a page that is no longer selected.
      return false
    }
    const savePageId = selectedPageId || layoutPageId

    if (!savePageId) {
      setError('No page selected')
      return false
    }
    const requestId = activeSaveRequestRef.current + 1
    activeSaveRequestRef.current = requestId

    const normalizedLayout = normalizeEditorLayout(newLayout, {
      id: savePageId,
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
      const response = await fetch(`/api/pages/${savePageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layout: validatedLayout,
        }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        if (requestId === activeSaveRequestRef.current && currentPageIdRef.current === savePageId) {
          setError(data.error || 'Failed to save layout')
        }
        return false
      }

      const savedLayout = normalizeEditorLayout(data.page?.layout ?? validatedLayout, {
        id: data.page?.id ?? savePageId,
        name: data.page?.name ?? validatedLayout.name,
        title: data.page?.title ?? validatedLayout.name,
      })

      if (requestId === activeSaveRequestRef.current && currentPageIdRef.current === savePageId) {
        setLayout(savedLayout)
      }
      return true
    } catch (saveError) {
      console.error('Error saving layout:', saveError)
      if (requestId === activeSaveRequestRef.current && currentPageIdRef.current === savePageId) {
        setError('Error saving layout')
      }
      return false
    } finally {
      if (requestId === activeSaveRequestRef.current) {
        setLoading(false)
      }
    }
  }, [])

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
      currentPageIdRef.current = newPage.id
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

  const deletePage = useCallback(async (pageId: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        const message = data.error || 'Failed to delete page'
        setError(message)
        return { success: false, error: message }
      }

      const remainingPages = pages.filter((page) => page.id !== pageId)
      setPages(remainingPages)

      if (currentPageId === pageId) {
        const fallbackPage = remainingPages.find((page) => page.slug === 'home') || remainingPages[0] || null
        currentPageIdRef.current = fallbackPage?.id || null
        setCurrentPageId(fallbackPage?.id || null)
        setLayout(emptyLayout(fallbackPage?.id || '', fallbackPage?.name || ''))
      }

      return { success: true }
    } catch (deleteError) {
      console.error('Error deleting page:', deleteError)
      const message = 'Error deleting page'
      setError(message)
      return { success: false, error: message }
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

  const renamePage = useCallback(async (pageId: string, nextName: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedName = String(nextName || '').trim()
    if (!trimmedName) {
      return { success: false, error: 'Page name cannot be empty' }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          title: trimmedName,
        }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        const message = data.error || 'Failed to rename page'
        setError(message)
        return { success: false, error: message }
      }

      const resolvedName = data.page?.name || data.page?.title || trimmedName
      setPages((previousPages) =>
        previousPages.map((page) =>
          String(page.id) === String(pageId)
            ? {
                ...page,
                name: resolvedName,
                title: data.page?.title || resolvedName,
              }
            : page,
        ),
      )

      setLayout((previousLayout) =>
        String(previousLayout?.id ?? '') === String(pageId)
          ? {
              ...previousLayout,
              name: resolvedName,
            }
          : previousLayout,
      )

      return { success: true }
    } catch (renameError) {
      console.error('Error renaming page:', renameError)
      const message = 'Error renaming page'
      setError(message)
      return { success: false, error: message }
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
    renamePage,
    togglePageActive,
  }
}
