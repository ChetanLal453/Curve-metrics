'use client'

import { useEffect, useMemo, useState } from 'react'

type NavChild = {
  id: number
  label: string
  url: string
  status: 'live' | 'draft'
}

type NavItem = {
  id: number
  label: string
  url: string
  status: 'live' | 'draft'
  isDropdown: boolean
  newTab: boolean
  children: NavChild[]
}

type PagePoolItem = {
  id?: number
  name: string
  label: string
  url: string
  status: 'live' | 'draft'
}

type HeaderForm = {
  logo_url: string
  cta_label: string
  cta_link: string
  style: string
}

type FooterForm = {
  copyright_text: string
  logo_url: string
  newsletter_enabled: boolean
}

type SocialForm = {
  instagram: string
  linkedin: string
  twitter: string
  whatsapp: string
}

const defaultHeader: HeaderForm = {
  logo_url: '',
  cta_label: 'Contact Us',
  cta_link: '/contact',
  style: 'sticky',
}

const defaultFooter: FooterForm = {
  copyright_text: '© 2026 Curve Metrics Solutions Pvt. Ltd.',
  logo_url: '',
  newsletter_enabled: true,
}

const defaultSocial: SocialForm = {
  instagram: '',
  linkedin: '',
  twitter: '',
  whatsapp: '',
}

function normalizeStatus(value: unknown): 'live' | 'draft' {
  return value === 'draft' ? 'draft' : 'live'
}

function normalizeNavItem(item: any): NavItem {
  const children: NavChild[] = Array.isArray(item.children)
    ? item.children.map((child: any) => ({
        id: Number(child.id ?? 0),
        label: child.label || 'Sub Link',
        url: child.url || child.href || '/sub-link',
        status: normalizeStatus(child.status),
      }))
    : []

  return {
    id: Number(item.id ?? 0),
    label: item.label || 'New Link',
    url: item.url || item.href || '/new-link',
    status: normalizeStatus(item.status),
    isDropdown: item.is_dropdown != null ? Boolean(item.is_dropdown) : children.length > 0,
    newTab: item.new_tab != null ? Boolean(item.new_tab) : Boolean(item.open_new_tab),
    children,
  }
}

function flattenTree(items: NavItem[]): NavItem[] {
  return items
}

export default function LayoutPage() {
  const [navData, setNavData] = useState<NavItem[]>([])
  const [pages, setPages] = useState<PagePoolItem[]>([])
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [idCounter, setIdCounter] = useState(1000)
  const [headerForm, setHeaderForm] = useState<HeaderForm>(defaultHeader)
  const [footerForm, setFooterForm] = useState<FooterForm>(defaultFooter)
  const [socialForm, setSocialForm] = useState<SocialForm>(defaultSocial)
  const [loading, setLoading] = useState(true)
  const [navSaving, setNavSaving] = useState(false)
  const [layoutSaving, setLayoutSaving] = useState(false)
  const [showNavSaved, setShowNavSaved] = useState(false)
  const [toast, setToast] = useState('')

  const selectedTopLevel = useMemo(
    () => navData.find((item) => item.id === selectedId) || null,
    [navData, selectedId],
  )

  const selectedParent = useMemo(
    () => navData.find((item) => item.children.some((child) => child.id === selectedId)) || null,
    [navData, selectedId],
  )

  const selectedChild = useMemo(
    () => selectedParent?.children.find((child) => child.id === selectedId) || null,
    [selectedParent, selectedId],
  )

  useEffect(() => {
    let active = true

    async function loadAll() {
      setLoading(true)
      try {
        const [navRes, pagesRes, headersRes, footersRes, settingsRes] = await Promise.all([
          fetch('/api/navigation', { credentials: 'include' }),
          fetch('/api/pages', { credentials: 'include' }),
          fetch('/api/headers', { credentials: 'include' }),
          fetch('/api/footers', { credentials: 'include' }),
          fetch('/api/settings', { credentials: 'include' }),
        ])

        const [navData, pagesData, headersData, footersData, settingsData] = await Promise.all([
          navRes.json(),
          pagesRes.json(),
          headersRes.json(),
          footersRes.json(),
          settingsRes.json(),
        ])

        if (!active) {
          return
        }

        const nextNav: NavItem[] = Array.isArray(navData?.items)
          ? navData.items.map(normalizeNavItem)
          : Array.isArray(navData?.navigation)
            ? navData.navigation.map(normalizeNavItem)
            : []

        setNavData(nextNav)
        setExpanded(
          nextNav.reduce((acc: Record<number, boolean>, item: NavItem) => {
            if (item.children.length) {
              acc[item.id] = false
            }
            return acc
          }, {}),
        )
        setIdCounter(
          Math.max(
            1000,
            ...nextNav.flatMap((item) => [item.id, ...item.children.map((child) => child.id)]),
          ),
        )

        setPages(
          Array.isArray(pagesData?.pages)
            ? pagesData.pages.map((page: any) => ({
                id: page.id,
                name: page.name || page.label || 'Untitled Page',
                label: page.label || page.name || 'Untitled Page',
                url: page.url || '/',
                status: normalizeStatus(page.status),
              }))
            : [],
        )

        const header = headersData?.header || headersData?.headers?.[0]
        setHeaderForm({
          logo_url: header?.logo_url || header?.logo || '',
          cta_label: header?.cta_label || 'Contact Us',
          cta_link: header?.cta_link || '/contact',
          style: header?.style || header?.settings?.style || 'sticky',
        })

        const footer = footersData?.footer || footersData?.footers?.[0]
        setFooterForm({
          copyright_text:
            footer?.copyright_text ||
            footer?.copyright ||
            '© 2026 Curve Metrics Solutions Pvt. Ltd.',
          logo_url: footer?.logo_url || footer?.settings?.logo_url || '',
          newsletter_enabled:
            typeof footer?.newsletter_enabled === 'boolean'
              ? footer.newsletter_enabled
              : true,
        })

        const settings = settingsData?.settings || {}
        setSocialForm({
          instagram: settings.instagram_url || '',
          linkedin: settings.linkedin_url || '',
          twitter: settings.twitter_url || '',
          whatsapp: settings.whatsapp_number || '',
        })
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadAll()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!toast) {
      return
    }

    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!showNavSaved) {
      return
    }

    const timer = window.setTimeout(() => setShowNavSaved(false), 2800)
    return () => window.clearTimeout(timer)
  }, [showNavSaved])

  const addTopLevel = () => {
    const nextId = idCounter + 1
    const nextItem: NavItem = {
      id: nextId,
      label: 'New Link',
      url: '/new-link',
      status: 'draft',
      isDropdown: false,
      newTab: false,
      children: [],
    }

    setNavData((prev) => [...prev, nextItem])
    setSelectedId(nextId)
    setIdCounter(nextId)
  }

  const addFromPage = (page: PagePoolItem) => {
    const exists = navData.some((item) => item.url === page.url)
    if (exists) {
      window.alert('Already in navigation')
      return
    }

    const nextId = idCounter + 1
    const nextItem: NavItem = {
      id: nextId,
      label: page.label || page.name,
      url: page.url,
      status: page.status,
      isDropdown: false,
      newTab: false,
      children: [],
    }

    setNavData((prev) => [...prev, nextItem])
    setSelectedId(nextId)
    setIdCounter(nextId)
  }

  const addExternal = () => {
    const labelInput = document.getElementById('ext-label') as HTMLInputElement | null
    const urlInput = document.getElementById('ext-url') as HTMLInputElement | null
    const label = labelInput?.value.trim() || ''
    const url = urlInput?.value.trim() || ''

    if (!label || !url) {
      return
    }

    const nextId = idCounter + 1
    const nextItem: NavItem = {
      id: nextId,
      label,
      url,
      status: 'live',
      isDropdown: false,
      newTab: true,
      children: [],
    }

    setNavData((prev) => [...prev, nextItem])
    if (labelInput) labelInput.value = ''
    if (urlInput) urlInput.value = ''
    setSelectedId(nextId)
    setIdCounter(nextId)
  }

  const addSubItem = (parentId: number) => {
    const nextId = idCounter + 1
    const nextChild: NavChild = {
      id: nextId,
      label: 'Sub Link',
      url: '/sub-link',
      status: 'draft',
    }

    setNavData((prev) =>
      prev.map((item) =>
        item.id === parentId
          ? {
              ...item,
              isDropdown: true,
              children: [...item.children, nextChild],
            }
          : item,
      ),
    )
    setExpanded((prev) => ({ ...prev, [parentId]: true }))
    setSelectedId(nextId)
    setIdCounter(nextId)
  }

  const deleteItem = (id: number) => {
    setNavData((prev) => prev.filter((item) => item.id !== id))
    setSelectedId(null)
  }

  const deleteChild = (parentId: number, childId: number) => {
    setNavData((prev) =>
      prev.map((item) => {
        if (item.id !== parentId) {
          return item
        }

        const children = item.children.filter((child) => child.id !== childId)
        return {
          ...item,
          children,
          isDropdown: children.length === 0 ? false : item.isDropdown,
        }
      }),
    )
    setSelectedId(null)
  }

  const moveItem = (id: number, dir: -1 | 1) => {
    const index = navData.findIndex((item) => item.id === id)
    const newIndex = index + dir

    if (index < 0 || newIndex < 0 || newIndex >= navData.length) {
      return
    }

    const next = [...navData]
    ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
    setNavData(next)
  }

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const selectItem = (id: number) => {
    setSelectedId(id)
  }

  const selectChild = (_parentId: number, childId: number) => {
    setSelectedId(childId)
  }

  const updateTopLevel = (id: number, key: keyof Omit<NavItem, 'id' | 'children'>, val: string | boolean) => {
    setNavData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: val } : item)),
    )
  }

  const updateChild = (parentId: number, id: number, key: keyof Omit<NavChild, 'id'>, val: string) => {
    setNavData((prev) =>
      prev.map((item) =>
        item.id === parentId
          ? {
              ...item,
              children: item.children.map((child) =>
                child.id === id ? { ...child, [key]: val } : child,
              ),
            }
          : item,
      ),
    )
  }

  const saveNav = async () => {
    setNavSaving(true)
    try {
      const response = await fetch('/api/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ items: navData }),
      })

      if (!response.ok) {
        throw new Error('Failed to save navigation')
      }

      setShowNavSaved(true)
    } catch (error) {
      setToast(error instanceof Error ? error.message : 'Failed to save navigation')
    } finally {
      setNavSaving(false)
    }
  }

  const saveAll = async () => {
    setLayoutSaving(true)
    try {
      const responses = await Promise.all([
        fetch('/api/headers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(headerForm),
        }),
        fetch('/api/footers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(footerForm),
        }),
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            instagram_url: socialForm.instagram,
            linkedin_url: socialForm.linkedin,
            twitter_url: socialForm.twitter,
            whatsapp_number: socialForm.whatsapp,
          }),
        }),
      ])

      if (responses.some((response) => !response.ok)) {
        throw new Error('Failed to save layout')
      }

      setToast('Layout saved successfully')
    } catch (error) {
      setToast(error instanceof Error ? error.message : 'Failed to save layout')
    } finally {
      setLayoutSaving(false)
    }
  }

  const availablePages = useMemo(() => {
    const urls = new Set(flattenTree(navData).map((item) => item.url))
    return pages.filter((page) => !urls.has(page.url))
  }, [navData, pages])

  return (
    <div className="layout-wrap">
      <div className="pg-hd">
        <div>
          <h2>Layout Editor</h2>
          <p>Header, footer, navigation links — manage everything here</p>
        </div>
        <div className="pg-actions">
          <button className="gbtn" type="button" onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}>
            Preview Header
          </button>
          <button className="gbtn pu" type="button" onClick={() => void saveAll()} disabled={layoutSaving}>
            {layoutSaving ? 'Saving...' : 'Save Layout'}
          </button>
        </div>
      </div>

      <div className="ic layout-nav-manager">
        <div className="ic-h">
          <div>
            <div className="layout-nav-title">Navigation Manager</div>
            <div className="layout-nav-subtitle">Drag to reorder · Click item to edit</div>
          </div>
          <div className="pg-actions">
            <button className="gbtn" type="button" onClick={addTopLevel}>
              + Add Link
            </button>
            <button className="gbtn pu" type="button" onClick={() => void saveNav()} disabled={navSaving}>
              {navSaving ? 'Saving...' : 'Save Navigation'}
            </button>
          </div>
        </div>

        <div className="layout-nav-grid">
          <div className="layout-nav-main nm-left">
            <div className="layout-nav-label">Live Preview</div>
            <div className="layout-nav-preview">
              {navData.map((item, index) => (
                <span
                  key={item.id}
                  className={`prev-item ${item.isDropdown ? 'has-drop' : ''}`}
                  onClick={() => selectItem(item.id)}>
                  {item.label}
                  {item.isDropdown ? ' ▾' : ''}
                  {index < navData.length - 1 ? <span className="prev-sep" /> : null}
                </span>
              ))}
            </div>

            <div className="layout-nav-label">Navigation Structure</div>
            <div className="nav-builder">
              {loading ? <div className="layout-empty">Loading navigation...</div> : null}
              {!loading
                ? navData.map((item) => {
                    const hasChildren = item.children.length > 0
                    const isExpanded = expanded[item.id] === true

                    return (
                      <div
                        key={item.id}
                        className={`nav-item ${selectedId === item.id ? 'selected' : ''}`}>
                        <div className="nav-row" onClick={() => selectItem(item.id)}>
                          <span className="drag-handle">⠿</span>
                          <button
                            type="button"
                            className={`nav-expand ${hasChildren ? '' : 'empty'}`}
                            onClick={(event) => {
                              event.stopPropagation()
                              if (hasChildren) {
                                toggleExpand(item.id)
                              }
                            }}>
                            {hasChildren ? (isExpanded ? '▾' : '▸') : ''}
                          </button>
                          <span className="nav-label">{item.label}</span>
                          <span className="nav-url">{item.url}</span>
                          <span className="nav-badges">
                            <span className={`nm-badge ${item.status === 'live' ? 'badge-live' : 'badge-draft'}`}>{item.status}</span>
                            {item.isDropdown ? <span className="nm-badge badge-drop">dropdown</span> : null}
                            {item.newTab ? <span className="nm-badge badge-ext">↗</span> : null}
                          </span>
                          <span className="nav-actions">
                            <button
                              type="button"
                              className="nav-act"
                              onClick={(event) => {
                                event.stopPropagation()
                                moveItem(item.id, -1)
                              }}>
                              ↑
                            </button>
                            <button
                              type="button"
                              className="nav-act"
                              onClick={(event) => {
                                event.stopPropagation()
                                moveItem(item.id, 1)
                              }}>
                              ↓
                            </button>
                            <button
                              type="button"
                              className="nav-act del"
                              onClick={(event) => {
                                event.stopPropagation()
                                deleteItem(item.id)
                              }}>
                              ⌫
                            </button>
                          </span>
                        </div>

                        {isExpanded && hasChildren ? (
                          <div className="sub-items open">
                            {item.children.map((child) => (
                              <div
                                key={child.id}
                                className={`sub-item ${selectedId === child.id ? 'selected' : ''}`}
                                onClick={() => selectChild(item.id, child.id)}>
                                <span className="drag-handle sub-handle">⠿</span>
                                <svg className="sub-connector" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
                                  <path d="M2 2v6h10" strokeLinecap="round" />
                                </svg>
                                <span className="nav-label">{child.label}</span>
                                <span className="nav-url">{child.url}</span>
                                <span className="nav-badges">
                                  <span className={`nm-badge ${child.status === 'live' ? 'badge-live' : 'badge-draft'}`}>{child.status}</span>
                                </span>
                                <span className="nav-actions">
                                  <button
                                    type="button"
                                    className="nav-act del"
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      deleteChild(item.id, child.id)
                                    }}>
                                    ⌫
                                  </button>
                                </span>
                              </div>
                            ))}
                            <button type="button" className="add-sub" onClick={() => addSubItem(item.id)}>
                              ＋ Add sub-link under {item.label}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    )
                  })
                : null}
            </div>

            <button type="button" className="add-zone nm-add-zone cm-layout-add-zone" onClick={addTopLevel}>
              + Add top-level link — or pick a page from the right panel
            </button>

            {showNavSaved ? (
              <div className="layout-save-note">
                Navigation saved. Public site will reflect changes on next page load.
              </div>
            ) : null}
          </div>

          <div className="layout-nav-side nm-right">
            <div className="layout-nav-label">Edit Selected Item</div>
            <div className="layout-side-card">
              {selectedId === null ? (
                <div className="layout-side-empty">Click any nav item to edit it</div>
              ) : selectedTopLevel ? (
                <div className="layout-edit-panel">
                  <div className="ig">
                    <label>Label</label>
                    <input value={selectedTopLevel.label} onChange={(event) => updateTopLevel(selectedTopLevel.id, 'label', event.target.value)} />
                  </div>
                  <div className="ig">
                    <label>URL / Path</label>
                    <input value={selectedTopLevel.url} onChange={(event) => updateTopLevel(selectedTopLevel.id, 'url', event.target.value)} />
                  </div>
                  <div className="layout-toggles">
                    <div className="tgrow">
                      <span className="tglbl">Has dropdown children</span>
                      <div
                        className={`tg ${selectedTopLevel.isDropdown ? 'on' : ''}`}
                        onClick={() => updateTopLevel(selectedTopLevel.id, 'isDropdown', !selectedTopLevel.isDropdown)}
                      />
                    </div>
                    <div className="tgrow">
                      <span className="tglbl">Open in new tab</span>
                      <div
                        className={`tg ${selectedTopLevel.newTab ? 'on' : ''}`}
                        onClick={() => updateTopLevel(selectedTopLevel.id, 'newTab', !selectedTopLevel.newTab)}
                      />
                    </div>
                  </div>
                  <div className="layout-edit-actions">
                    <button type="button" className="gbtn danger-outline" onClick={() => deleteItem(selectedTopLevel.id)}>
                      Delete
                    </button>
                    {selectedTopLevel.isDropdown ? (
                      <button type="button" className="gbtn pu" onClick={() => addSubItem(selectedTopLevel.id)}>
                        + Add sub-link
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : selectedParent && selectedChild ? (
                <div className="layout-edit-panel">
                  <div className="ig">
                    <label>Label</label>
                    <input
                      value={selectedChild.label}
                      onChange={(event) => updateChild(selectedParent.id, selectedChild.id, 'label', event.target.value)}
                    />
                  </div>
                  <div className="ig">
                    <label>URL / Path</label>
                    <input
                      value={selectedChild.url}
                      onChange={(event) => updateChild(selectedParent.id, selectedChild.id, 'url', event.target.value)}
                    />
                  </div>
                  <div className="layout-edit-actions">
                    <button
                      type="button"
                      className="gbtn danger-outline"
                      onClick={() => deleteChild(selectedParent.id, selectedChild.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="layout-side-empty">Click any nav item to edit it</div>
              )}
            </div>

            <div className="layout-nav-label">Add From Your Pages</div>
            <div className="layout-side-card">
              {availablePages.map((page) => (
                <button key={page.url} type="button" className="pool-item" onClick={() => addFromPage(page)}>
                  <span className="dot" style={{ background: page.status === 'live' ? 'var(--gr)' : 'var(--am)' }} />
                  <span className="pool-name">{page.label || page.name}</span>
                  <span className="pool-url">{page.url}</span>
                  <span className="add-icon">+ add</span>
                </button>
              ))}
              {!availablePages.length ? <div className="layout-side-empty tight">All pages are already in the nav</div> : null}
            </div>

            <div className="layout-nav-label">Add External Link</div>
            <div className="layout-side-card">
              <div className="add-nav-row">
                <input id="ext-label" className="add-nav-inp" placeholder="Label" />
                <input id="ext-url" className="add-nav-inp" placeholder="URL" />
                <button className="nav-act nav-add-btn" type="button" onClick={addExternal}>
                  +
                </button>
              </div>
              <div className="layout-side-note">
                When you create a new page in Page Editor, it appears in &quot;Add from your pages&quot; above automatically.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="layout-settings-grid">
        <div>
          <div className="ic">
            <div className="ic-h">Header Settings</div>
            <div className="ic-b">
              <div className="ig">
                <label>Logo</label>
                <div className="layout-upload-row">
                  <div className="layout-upload-box">🖼</div>
                  <input
                    value={headerForm.logo_url}
                    onChange={(event) => setHeaderForm((current) => ({ ...current, logo_url: event.target.value }))}
                    placeholder="Logo URL"
                  />
                </div>
              </div>
              <div className="ig">
                <label>CTA Button Label</label>
                <input value={headerForm.cta_label} onChange={(event) => setHeaderForm((current) => ({ ...current, cta_label: event.target.value }))} />
              </div>
              <div className="ig">
                <label>CTA Button Link</label>
                <input value={headerForm.cta_link} onChange={(event) => setHeaderForm((current) => ({ ...current, cta_link: event.target.value }))} />
              </div>
              <div className="ig">
                <label>Header Style</label>
                <select value={headerForm.style} onChange={(event) => setHeaderForm((current) => ({ ...current, style: event.target.value }))}>
                  <option value="sticky">Sticky (follows scroll)</option>
                  <option value="fixed">Fixed top</option>
                  <option value="static">Static</option>
                </select>
              </div>
            </div>
          </div>

          <div className="ic">
            <div className="ic-h">Footer Settings</div>
            <div className="ic-b">
              <div className="ig full">
                <label>Copyright Text</label>
                <input value={footerForm.copyright_text} onChange={(event) => setFooterForm((current) => ({ ...current, copyright_text: event.target.value }))} />
              </div>
              <div className="ig">
                <label>Footer Logo</label>
                <input value={footerForm.logo_url} onChange={(event) => setFooterForm((current) => ({ ...current, logo_url: event.target.value }))} />
              </div>
              <div className="ig">
                <label>Newsletter Signup</label>
                <select
                  value={footerForm.newsletter_enabled ? 'enabled' : 'disabled'}
                  onChange={(event) =>
                    setFooterForm((current) => ({
                      ...current,
                      newsletter_enabled: event.target.value === 'enabled',
                    }))
                  }>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="ic">
            <div className="ic-h">Social Links</div>
            <div className="ic-b">
              <div className="ig">
                <label>Instagram</label>
                <input value={socialForm.instagram} onChange={(event) => setSocialForm((current) => ({ ...current, instagram: event.target.value }))} />
              </div>
              <div className="ig">
                <label>LinkedIn</label>
                <input value={socialForm.linkedin} onChange={(event) => setSocialForm((current) => ({ ...current, linkedin: event.target.value }))} />
              </div>
              <div className="ig">
                <label>Twitter / X</label>
                <input value={socialForm.twitter} onChange={(event) => setSocialForm((current) => ({ ...current, twitter: event.target.value }))} />
              </div>
              <div className="ig">
                <label>WhatsApp</label>
                <input value={socialForm.whatsapp} onChange={(event) => setSocialForm((current) => ({ ...current, whatsapp: event.target.value }))} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast ? <div className="layout-toast">{toast}</div> : null}

      <style jsx global>{`
        .nav-item {
          background: var(--s1);
          border: 1px solid var(--b1);
          border-radius: 8px;
          overflow: hidden;
        }

        .nav-item.selected {
          border-color: rgba(124, 92, 252, 0.5);
          background: var(--pud);
        }

        .nav-item .nav-row {
          display: grid;
          grid-template-columns: 14px 16px minmax(0, 1fr) minmax(84px, 120px) auto auto;
          gap: 8px;
          align-items: center;
          padding: 7px 10px;
          min-height: 36px;
        }

        .nav-item.selected .nav-row {
          background: var(--pud);
        }

        .drag-handle {
          cursor: grab;
          color: var(--t4);
        }

        .nav-expand {
          width: 16px;
          height: 16px;
          border: 1px solid var(--b2);
          background: var(--s3);
          border-radius: 4px;
          color: var(--t2);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .nav-expand.empty {
          opacity: 0;
          pointer-events: none;
        }

        .nav-label {
          flex: 1;
          font-weight: 500;
          color: var(--t1);
        }

        .nav-url {
          font-family: monospace;
          font-size: 9px;
          color: var(--t3);
        }

        .nav-badges {
          display: flex;
          gap: 3px;
          align-items: center;
        }

        .nm-badge {
          font-size: 8px;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: 10px;
        }

        .badge-live {
          background: var(--grd);
          color: var(--grl);
        }

        .badge-draft {
          background: var(--amd);
          color: var(--aml);
        }

        .badge-drop {
          background: var(--pud);
          color: var(--pul);
        }

        .badge-ext {
          background: var(--b2);
          color: var(--t3);
        }

        .nav-actions {
          display: flex;
          gap: 2px;
          opacity: 0;
        }

        .nav-item:hover .nav-actions {
          opacity: 1;
        }

        .nav-act {
          width: 20px;
          height: 20px;
          background: var(--s3);
          border: 1px solid var(--b2);
          border-radius: 4px;
          cursor: pointer;
          color: var(--t2);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .nav-act:hover {
          background: var(--s4);
          color: var(--t1);
        }

        .nav-act.del:hover {
          background: var(--rdd);
          color: var(--rd);
        }

        .sub-items {
          background: var(--s2);
          border-top: 1px solid var(--b1);
        }

        .sub-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border-bottom: 1px solid var(--b1);
        }

        .sub-item:hover {
          background: var(--s3);
        }

        .sub-item.selected {
          background: rgba(124, 92, 252, 0.08);
        }

        .sub-item .nav-label {
          flex: 1;
        }

        .sub-connector {
          color: var(--t4);
          flex-shrink: 0;
        }

        .add-sub {
          width: 100%;
          padding-left: 40px;
          color: var(--t4);
          cursor: pointer;
          text-align: left;
          border: 1px dashed transparent;
          background: transparent;
        }

        .add-sub:hover {
          color: var(--pul);
          background: var(--pud);
        }

        .tg {
          width: 28px;
          height: 15px;
          background: var(--s4);
          border: 1px solid var(--b2);
          border-radius: 8px;
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
        }

        .tg.on {
          background: var(--pu);
        }

        .tg::after {
          content: '';
          position: absolute;
          width: 9px;
          height: 9px;
          left: 2px;
          top: 2px;
          border-radius: 50%;
          background: white;
        }

        .tg.on::after {
          left: 15px;
        }

        .tgrow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--b1);
          padding: 5px 0;
        }

        .tgrow:last-child {
          border-bottom: none;
        }

        .tglbl {
          font-size: 10px;
          color: var(--t2);
        }

        .pool-item {
          display: flex;
          gap: 7px;
          background: var(--s3);
          border: 1px solid var(--b1);
          border-radius: 6px;
          padding: 6px 9px;
          cursor: pointer;
          margin-bottom: 6px;
        }

        .pool-item:hover {
          border-color: rgba(124, 92, 252, 0.4);
          color: var(--pul);
          background: var(--pud);
        }

        .nm-add-zone {
          border: 1px dashed var(--b3);
          border-radius: 8px;
          cursor: pointer;
        }

        .nm-add-zone:hover {
          border-color: var(--pu);
          background: var(--pud);
        }
      `}</style>
    </div>
  )
}

