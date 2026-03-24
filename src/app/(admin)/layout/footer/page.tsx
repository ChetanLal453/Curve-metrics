'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type FooterLink = {
  id: string
  label: string
  href: string
}

type FooterColumn = {
  id: string
  heading: string
  links: FooterLink[]
}

type SocialLink = {
  id: string
  platform: string
  url: string
}

type FooterRecord = {
  id?: number
  slug: string
  name: string
  columns: FooterColumn[]
  copyright: string
  social_links: SocialLink[]
  bg_color: string
  settings: Record<string, any>
}

const createFooterLink = (): FooterLink => ({
  id: `fl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  label: 'New Link',
  href: '/',
})

const createFooterColumn = (): FooterColumn => ({
  id: `fc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  heading: 'Column',
  links: [createFooterLink()],
})

const createSocialLink = (): SocialLink => ({
  id: `sl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  platform: 'LinkedIn',
  url: '',
})

const emptyFooter = (): FooterRecord => ({
  slug: '',
  name: '',
  columns: [createFooterColumn()],
  copyright: '',
  social_links: [createSocialLink()],
  bg_color: '#111116',
  settings: {},
})

const normalizeFooter = (footer: any): FooterRecord => ({
  id: footer.id,
  slug: footer.slug || '',
  name: footer.name || '',
  columns: (footer.columns || []).map((column: any, index: number) => ({
    id: column.id || `fc-${index}`,
    heading: column.heading || '',
    links: (column.links || []).map((link: any, linkIndex: number) => ({
      id: link.id || `fl-${index}-${linkIndex}`,
      label: link.label || '',
      href: link.href || '/',
    })),
  })),
  copyright: footer.copyright || '',
  social_links: (footer.social_links || []).map((link: any, index: number) => ({
    id: link.id || `sl-${index}`,
    platform: link.platform || '',
    url: link.url || '',
  })),
  bg_color: footer.bg_color || '#111116',
  settings: footer.settings || {},
})

const reorderItems = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

const FooterEditorPage = () => {
  const [footers, setFooters] = useState<FooterRecord[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [draft, setDraft] = useState<FooterRecord>(emptyFooter())
  const [saving, setSaving] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const selectedFooter = useMemo(
    () => footers.find((footer) => footer.id === selectedId) || null,
    [footers, selectedId],
  )

  const fetchFooters = useCallback(async () => {
    const response = await fetch('/api/footers', { credentials: 'include' })
    const data = await response.json()
    const next = (data.footers || data.items || []).map(normalizeFooter)
    setFooters(next)
    if (next.length) {
      setSelectedId((current) => current ?? next[0].id ?? null)
    }
  }, [])

  useEffect(() => {
    void fetchFooters()
  }, [fetchFooters])

  useEffect(() => {
    if (selectedFooter) {
      setDraft(selectedFooter)
    }
  }, [selectedFooter])

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        slug: draft.slug,
        name: draft.name,
        columns: draft.columns,
        copyright: draft.copyright,
        social_links: draft.social_links,
        bg_color: draft.bg_color,
        settings: draft.settings,
      }

      const response = await fetch(selectedId ? `/api/footers/${selectedId}` : '/api/footers', {
        method: selectedId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save footer')
      }

      await fetchFooters()
      const saved = normalizeFooter(data.footer || data.item)
      setSelectedId(saved.id || null)
      setDraft(saved)
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Failed to save footer')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="info-wrap">
      <div className="pg-hd">
        <div>
          <h2>Footer Editor</h2>
          <p>Build footer columns, social links, and copyright content.</p>
        </div>
        <div className="pg-actions">
          <button className="gbtn" type="button" onClick={() => { setSelectedId(null); setDraft({ ...emptyFooter(), slug: `footer-${footers.length + 1}`, name: `Footer ${footers.length + 1}` }) }}>
            + New Footer
          </button>
          <button className="gbtn pu" type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Footer'}
          </button>
        </div>
      </div>

      <div className="ic mb-3">
        <div className="ic-h">Footer Template</div>
        <div className="ic-b">
          <div className="ig">
            <label>Select Footer</label>
            <select className="form-select" value={selectedId ?? ''} onChange={(event) => setSelectedId(event.target.value ? Number(event.target.value) : null)}>
              <option value="">Create new footer</option>
              {footers.map((footer) => (
                <option key={footer.id} value={footer.id}>
                  {footer.slug}
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
            <label>Background Color</label>
            <input value={draft.bg_color} onChange={(event) => setDraft((current) => ({ ...current, bg_color: event.target.value }))} />
          </div>
        </div>
      </div>

      <div className="ic mb-3">
        <div className="ic-h">
          <span>Footer Columns</span>
          <button className="gbtn" type="button" onClick={() => setDraft((current) => ({ ...current, columns: [...current.columns, createFooterColumn()] }))}>
            + Add Column
          </button>
        </div>
        <div className="ic-b d-block">
          <div className="d-flex flex-column gap-3">
            {draft.columns.map((column, columnIndex) => (
              <div
                key={column.id}
                draggable
                onDragStart={() => setDragIndex(columnIndex)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null && dragIndex !== columnIndex) {
                    setDraft((current) => ({ ...current, columns: reorderItems(current.columns, dragIndex, columnIndex) }))
                  }
                  setDragIndex(null)
                }}
                className="rounded-3 border p-3"
                style={{ background: 'var(--s2)', borderColor: 'var(--b1)' }}>
                <div className="d-flex gap-2 align-items-center mb-3">
                  <span className="mono text-muted">{String(columnIndex + 1).padStart(2, '0')}</span>
                  <input className="form-control form-control-sm" value={column.heading} onChange={(event) => setDraft((current) => ({ ...current, columns: current.columns.map((item, index) => index === columnIndex ? { ...item, heading: event.target.value } : item) }))} />
                  <button className="gbtn" type="button" onClick={() => setDraft((current) => ({ ...current, columns: current.columns.filter((_, index) => index !== columnIndex) }))}>
                    Delete
                  </button>
                </div>
                <div className="d-flex flex-column gap-2">
                  {column.links.map((link, linkIndex) => (
                    <div key={link.id} className="row g-2">
                      <div className="col-md-5">
                        <input className="form-control form-control-sm" value={link.label} onChange={(event) => setDraft((current) => ({ ...current, columns: current.columns.map((item, index) => index === columnIndex ? { ...item, links: item.links.map((entry, entryIndex) => entryIndex === linkIndex ? { ...entry, label: event.target.value } : entry) } : item) }))} />
                      </div>
                      <div className="col-md-5">
                        <input className="form-control form-control-sm" value={link.href} onChange={(event) => setDraft((current) => ({ ...current, columns: current.columns.map((item, index) => index === columnIndex ? { ...item, links: item.links.map((entry, entryIndex) => entryIndex === linkIndex ? { ...entry, href: event.target.value } : entry) } : item) }))} />
                      </div>
                      <div className="col-md-2">
                        <button className="gbtn w-100" type="button" onClick={() => setDraft((current) => ({ ...current, columns: current.columns.map((item, index) => index === columnIndex ? { ...item, links: item.links.filter((_, entryIndex) => entryIndex !== linkIndex) } : item) }))}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="gbtn" type="button" onClick={() => setDraft((current) => ({ ...current, columns: current.columns.map((item, index) => index === columnIndex ? { ...item, links: [...item.links, createFooterLink()] } : item) }))}>
                    + Add Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ic">
        <div className="ic-h">Footer Details</div>
        <div className="ic-b">
          <div className="ig full">
            <label>Copyright</label>
            <input value={draft.copyright} onChange={(event) => setDraft((current) => ({ ...current, copyright: event.target.value }))} />
          </div>
          <div className="ig full">
            <label>Social Links</label>
            <div className="d-flex flex-column gap-2">
              {draft.social_links.map((link, index) => (
                <div key={link.id} className="row g-2">
                  <div className="col-md-4">
                    <input className="form-control form-control-sm" value={link.platform} onChange={(event) => setDraft((current) => ({ ...current, social_links: current.social_links.map((item, itemIndex) => itemIndex === index ? { ...item, platform: event.target.value } : item) }))} />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control form-control-sm" value={link.url} onChange={(event) => setDraft((current) => ({ ...current, social_links: current.social_links.map((item, itemIndex) => itemIndex === index ? { ...item, url: event.target.value } : item) }))} />
                  </div>
                  <div className="col-md-2">
                    <button className="gbtn w-100" type="button" onClick={() => setDraft((current) => ({ ...current, social_links: current.social_links.filter((_, itemIndex) => itemIndex !== index) }))}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button className="gbtn" type="button" onClick={() => setDraft((current) => ({ ...current, social_links: [...current.social_links, createSocialLink()] }))}>
                + Add Social Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterEditorPage



