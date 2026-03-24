'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type NavItem = {
  id: string
  label: string
  href: string
  open_new_tab: boolean
  is_active: boolean
  children: NavItem[]
}

type HeaderRecord = {
  id?: number
  slug: string
  name: string
  logo: string
  logo_dark: string
  cta_label: string
  cta_link: string
  is_sticky: boolean
  bg_color: string
  settings: Record<string, any>
  navigation_items: NavItem[]
}

const createNavItem = (): NavItem => ({
  id: `nav-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  label: 'New Link',
  href: '/',
  open_new_tab: false,
  is_active: true,
  children: [],
})

const emptyHeader = (): HeaderRecord => ({
  slug: '',
  name: '',
  logo: '',
  logo_dark: '',
  cta_label: '',
  cta_link: '',
  is_sticky: true,
  bg_color: 'transparent',
  settings: {},
  navigation_items: [],
})

const normalizeHeader = (header: any): HeaderRecord => ({
  id: header.id,
  slug: header.slug || '',
  name: header.name || '',
  logo: header.logo || '',
  logo_dark: header.logo_dark || '',
  cta_label: header.cta_label || '',
  cta_link: header.cta_link || '',
  is_sticky: header.is_sticky !== false,
  bg_color: header.bg_color || 'transparent',
  settings: header.settings || {},
  navigation_items: (header.navigation_items || []).map(normalizeNavItem),
})

const normalizeNavItem = (item: any): NavItem => ({
  id: String(item.id || `nav-${Math.random().toString(36).slice(2, 8)}`),
  label: item.label || '',
  href: item.href || '/',
  open_new_tab: Boolean(item.open_new_tab),
  is_active: item.is_active !== false,
  children: (item.children || []).map(normalizeNavItem),
})

const reorderItems = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

const updateTree = (items: NavItem[], targetId: string, updater: (item: NavItem) => NavItem): NavItem[] =>
  items.map((item) =>
    item.id === targetId
      ? updater(item)
      : {
          ...item,
          children: updateTree(item.children, targetId, updater),
        },
  )

const removeTreeItem = (items: NavItem[], targetId: string): NavItem[] =>
  items
    .filter((item) => item.id !== targetId)
    .map((item) => ({
      ...item,
      children: removeTreeItem(item.children, targetId),
    }))

const HeaderEditorPage = () => {
  const [headers, setHeaders] = useState<HeaderRecord[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [draft, setDraft] = useState<HeaderRecord>(emptyHeader())
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploadingField, setUploadingField] = useState<'logo' | 'logo_dark' | null>(null)
  const [dragState, setDragState] = useState<{ parentId: string | null; index: number } | null>(null)

  const selectedHeader = useMemo(
    () => headers.find((header) => header.id === selectedId) || null,
    [headers, selectedId],
  )

  const fetchHeaders = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/headers', { credentials: 'include' })
      const data = await response.json()
      const nextHeaders = (data.headers || []).map(normalizeHeader)
      setHeaders(nextHeaders)
      if (nextHeaders.length) {
        setSelectedId((current) => current ?? nextHeaders[0].id ?? null)
      } else {
        setSelectedId(null)
        setDraft(emptyHeader())
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchHeaders()
  }, [fetchHeaders])

  useEffect(() => {
    if (selectedHeader) {
      setDraft(selectedHeader)
    }
  }, [selectedHeader])

  const uploadMedia = useCallback(async (file: File, field: 'logo' | 'logo_dark') => {
    setUploadingField(field)
    try {
      const formData = new FormData()
      formData.append('files', file)
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await response.json()
      if (!response.ok || !data.success || !data.uploaded?.[0]?.url) {
        throw new Error(data.error || 'Upload failed')
      }

      const url = data.uploaded[0].url
      setDraft((current) => ({ ...current, [field]: url }))
    } finally {
      setUploadingField(null)
    }
  }, [])

  const handleCreateNew = () => {
    setSelectedId(null)
    setDraft({
      ...emptyHeader(),
      slug: `header-${headers.length + 1}`,
      name: `Header ${headers.length + 1}`,
      navigation_items: [createNavItem()],
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        slug: draft.slug,
        name: draft.name,
        logo: draft.logo,
        logo_dark: draft.logo_dark,
        cta_label: draft.cta_label,
        cta_link: draft.cta_link,
        is_sticky: draft.is_sticky,
        bg_color: draft.bg_color,
        settings: draft.settings,
        navigation_items: draft.navigation_items,
      }

      const response = await fetch(selectedId ? `/api/headers/${selectedId}` : '/api/headers', {
        method: selectedId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save header')
      }

      await fetchHeaders()
      const saved = normalizeHeader(data.header || data.item)
      setSelectedId(saved.id || null)
      setDraft(saved)
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Failed to save header')
    } finally {
      setSaving(false)
    }
  }

  const updateNavItem = (targetId: string, updates: Partial<NavItem>) => {
    setDraft((current) => ({
      ...current,
      navigation_items: updateTree(current.navigation_items, targetId, (item) => ({ ...item, ...updates })),
    }))
  }

  const addChildItem = (targetId: string) => {
    setDraft((current) => ({
      ...current,
      navigation_items: updateTree(current.navigation_items, targetId, (item) => ({
        ...item,
        children: [...item.children, createNavItem()],
      })),
    }))
  }

  const moveItem = (parentId: string | null, fromIndex: number, toIndex: number) => {
    setDraft((current) => {
      if (parentId === null) {
        return {
          ...current,
          navigation_items: reorderItems(current.navigation_items, fromIndex, toIndex),
        }
      }

      return {
        ...current,
        navigation_items: updateTree(current.navigation_items, parentId, (item) => ({
          ...item,
          children: reorderItems(item.children, fromIndex, toIndex),
        })),
      }
    })
  }

  const renderNavItems = (items: NavItem[], parentId: string | null = null) => (
    <div className="d-flex flex-column gap-2">
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => setDragState({ parentId, index })}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (dragState && dragState.parentId === parentId && dragState.index !== index) {
              moveItem(parentId, dragState.index, index)
            }
            setDragState(null)
          }}
          className="rounded-3 border p-3"
          style={{ background: 'var(--s2)', borderColor: 'var(--b1)' }}>
          <div className="d-flex gap-2 align-items-center mb-2">
            <span className="mono text-muted">{String(index + 1).padStart(2, '0')}</span>
            <input className="form-control form-control-sm" value={item.label} onChange={(event) => updateNavItem(item.id, { label: event.target.value })} />
            <button className="gbtn" type="button" onClick={() => addChildItem(item.id)}>
              + Submenu
            </button>
            <button className="gbtn" type="button" onClick={() => setDraft((current) => ({ ...current, navigation_items: removeTreeItem(current.navigation_items, item.id) }))}>
              Delete
            </button>
          </div>
          <div className="row g-2">
            <div className="col-md-7">
              <input className="form-control form-control-sm" value={item.href} onChange={(event) => updateNavItem(item.id, { href: event.target.value })} placeholder="/about" />
            </div>
            <div className="col-md-2">
              <div className="form-check form-switch pt-2">
                <input className="form-check-input" type="checkbox" checked={item.open_new_tab} onChange={(event) => updateNavItem(item.id, { open_new_tab: event.target.checked })} />
                <label className="form-check-label text-muted small">New tab</label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-check form-switch pt-2">
                <input className="form-check-input" type="checkbox" checked={item.is_active} onChange={(event) => updateNavItem(item.id, { is_active: event.target.checked })} />
                <label className="form-check-label text-muted small">Active</label>
              </div>
            </div>
          </div>
          {item.children.length ? <div className="mt-3 ms-3 border-start ps-3">{renderNavItems(item.children, item.id)}</div> : null}
        </div>
      ))}
    </div>
  )

  return (
    <div className="info-wrap">
      <div className="pg-hd">
        <div>
          <h2>Header Editor</h2>
          <p>Select a header by slug, edit logo assets, navigation links, and CTA settings.</p>
        </div>
        <div className="pg-actions">
          <button className="gbtn" type="button" onClick={handleCreateNew}>
            + New Header
          </button>
          <button className="gbtn pu" type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Header'}
          </button>
        </div>
      </div>

      <div className="ic mb-3">
        <div className="ic-h">Header Template</div>
        <div className="ic-b">
          <div className="ig">
            <label>Select Header</label>
            <select className="form-select" value={selectedId ?? ''} onChange={(event) => setSelectedId(event.target.value ? Number(event.target.value) : null)} disabled={loading}>
              <option value="">Create new header</option>
              {headers.map((header) => (
                <option key={header.id} value={header.id}>
                  {header.slug}
                </option>
              ))}
            </select>
          </div>
          <div className="ig">
            <label>Slug</label>
            <input value={draft.slug} onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} />
          </div>
          <div className="ig">
            <label>Name</label>
            <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
          </div>
          <div className="ig">
            <label>Background</label>
            <input value={draft.bg_color} onChange={(event) => setDraft((current) => ({ ...current, bg_color: event.target.value }))} />
          </div>
        </div>
      </div>

      <div className="ic mb-3">
        <div className="ic-h">Branding</div>
        <div className="ic-b">
          <div className="ig">
            <label>Logo URL</label>
            <input value={draft.logo} onChange={(event) => setDraft((current) => ({ ...current, logo: event.target.value }))} />
            <input type="file" className="form-control mt-2" accept="image/*" onChange={(event) => event.target.files?.[0] && void uploadMedia(event.target.files[0], 'logo')} />
            <small className="text-muted">{uploadingField === 'logo' ? 'Uploading…' : 'Upload light logo'}</small>
          </div>
          <div className="ig">
            <label>Logo Dark URL</label>
            <input value={draft.logo_dark} onChange={(event) => setDraft((current) => ({ ...current, logo_dark: event.target.value }))} />
            <input type="file" className="form-control mt-2" accept="image/*" onChange={(event) => event.target.files?.[0] && void uploadMedia(event.target.files[0], 'logo_dark')} />
            <small className="text-muted">{uploadingField === 'logo_dark' ? 'Uploading…' : 'Upload dark logo'}</small>
          </div>
          <div className="ig">
            <label>CTA Label</label>
            <input value={draft.cta_label} onChange={(event) => setDraft((current) => ({ ...current, cta_label: event.target.value }))} />
          </div>
          <div className="ig">
            <label>CTA Link</label>
            <input value={draft.cta_link} onChange={(event) => setDraft((current) => ({ ...current, cta_link: event.target.value }))} />
          </div>
          <div className="ig full">
            <div className="form-check form-switch pt-4">
              <input className="form-check-input" type="checkbox" checked={draft.is_sticky} onChange={(event) => setDraft((current) => ({ ...current, is_sticky: event.target.checked }))} />
              <label className="form-check-label ms-2">Sticky header</label>
            </div>
          </div>
        </div>
      </div>

      <div className="ic">
        <div className="ic-h">
          <span>Navigation Links</span>
          <button className="gbtn" type="button" onClick={() => setDraft((current) => ({ ...current, navigation_items: [...current.navigation_items, createNavItem()] }))}>
            + Add Link
          </button>
        </div>
        <div className="ic-b d-block">{renderNavItems(draft.navigation_items)}</div>
      </div>
    </div>
  )
}

export default HeaderEditorPage



