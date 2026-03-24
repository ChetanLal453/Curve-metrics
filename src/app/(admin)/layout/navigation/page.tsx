'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type NavigationItem = {
  id: string
  label: string
  url: string
  children?: NavigationItem[]
  order_index?: number
  parent_id?: string | null
  is_active?: boolean
  open_new_tab?: boolean
}

const emptyItem = {
  label: '',
  url: '',
  order_index: 0,
  parent_id: null as string | null,
}

const normalizeNavItem = (item: any): NavigationItem => ({
  id: String(item.id),
  label: item.label || '',
  url: item.url || item.href || '',
  order_index: Number(item.order_index || 0),
  parent_id: item.parent_id == null ? null : String(item.parent_id),
  is_active: item.is_active !== false,
  open_new_tab: Boolean(item.open_new_tab),
  children: Array.isArray(item.children) ? item.children.map(normalizeNavItem) : [],
})

const buildTree = (items: any[] = []) => {
  const byParent = new Map<string | null, NavigationItem[]>()

  for (const rawItem of items) {
    const item = normalizeNavItem(rawItem)
    const parentKey = item.parent_id ?? null
    if (!byParent.has(parentKey)) {
      byParent.set(parentKey, [])
    }
    byParent.get(parentKey)?.push(item)
  }

  const sortItems = (list: NavigationItem[] = []): NavigationItem[] =>
    [...list]
      .sort((left, right) => Number(left.order_index || 0) - Number(right.order_index || 0))
      .map((item, index) => ({
        ...item,
        order_index: index,
        children: sortItems(byParent.get(item.id) || []),
      }))

  return sortItems(byParent.get(null) || [])
}

const updateTree = (items: NavigationItem[], targetId: string, updater: (item: NavigationItem) => NavigationItem): NavigationItem[] =>
  items.map((item) =>
    item.id === targetId
      ? updater(item)
      : {
          ...item,
          children: updateTree(item.children || [], targetId, updater),
        },
  )

const removeTreeItem = (items: NavigationItem[], targetId: string): NavigationItem[] =>
  items
    .filter((item) => item.id !== targetId)
    .map((item) => ({
      ...item,
      children: removeTreeItem(item.children || [], targetId),
    }))

const findTreeItem = (items: NavigationItem[], targetId: string): NavigationItem | null => {
  for (const item of items) {
    if (item.id === targetId) {
      return item
    }

    const nested = findTreeItem(item.children || [], targetId)
    if (nested) {
      return nested
    }
  }

  return null
}

export default function NavigationAdminPage() {
  const [items, setItems] = useState<NavigationItem[]>([])
  const [draft, setDraft] = useState(emptyItem)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const selectedItem = useMemo(() => (selectedId ? findTreeItem(items, selectedId) : null), [items, selectedId])

  const loadNavigation = useCallback(async () => {
    try {
      const response = await fetch('/api/navigation')
      const data = await response.json()
      if (response.ok && data.success) {
        const nextItems = Array.isArray(data.navigation)
          ? data.navigation.map(normalizeNavItem)
          : buildTree(data.items || [])
        setItems(nextItems)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadNavigation()
  }, [loadNavigation])

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => ({ ...current, [id]: !current[id] }))
  }

  const saveDraft = async () => {
    if (!draft.label.trim() || !draft.url.trim()) {
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: draft.label,
          href: draft.url,
          order_index: draft.order_index,
          parent_id: draft.parent_id ? Number(draft.parent_id) : null,
          is_active: true,
          open_new_tab: false,
        }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        await loadNavigation()
        if (draft.parent_id) {
          setExpandedIds((current) => ({ ...current, [draft.parent_id as string]: true }))
        }
        setDraft(emptyItem)
      }
    } finally {
      setSaving(false)
    }
  }

  const updateItem = async (id: string, updates: Partial<NavigationItem>) => {
    setItems((current) => updateTree(current, id, (item) => ({ ...item, ...updates })))

    await fetch(`/api/navigation/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: updates.label,
        href: updates.url,
        order_index: updates.order_index,
        parent_id: updates.parent_id ? Number(updates.parent_id) : updates.parent_id === null ? null : undefined,
        is_active: updates.is_active,
        open_new_tab: updates.open_new_tab,
      }),
    })
  }

  const deleteItem = async (id: string) => {
    setItems((current) => removeTreeItem(current, id))
    if (selectedId === id) {
      setSelectedId(null)
    }
    await fetch(`/api/navigation/${id}`, { method: 'DELETE' })
  }

  const addItem = async (parentId: string | null) => {
    setDraft((current) => ({
      ...current,
      label: '',
      url: '',
      order_index: 0,
      parent_id: parentId,
    }))

    if (parentId) {
      setExpandedIds((current) => ({ ...current, [parentId]: true }))
    }
  }

  const renderTree = (tree: NavigationItem[], depth = 0) =>
    tree.map((item) => {
      const hasChildren = Boolean(item.children?.length)
      const isExpanded = expandedIds[item.id] ?? true
      const isSelected = selectedId === item.id

      return (
        <div key={item.id} className={`nm-item ${isSelected ? 'selected' : ''}`}>
          <div
            className={`nav-row ${isSelected ? 'selected' : ''}`}
            style={{ paddingLeft: `${12 + depth * 18}px` }}
            onClick={() => setSelectedId(item.id)}>
            <span className="drag-handle">⠿</span>
            <button
              type="button"
              className={`nav-expand ${hasChildren ? '' : 'empty'}`}
              onClick={(event) => {
                event.stopPropagation()
                if (hasChildren) {
                  toggleExpanded(item.id)
                }
              }}
              title={hasChildren ? (isExpanded ? 'Collapse' : 'Expand') : 'No children'}>
              {hasChildren ? (isExpanded ? '▾' : '▸') : ''}
            </button>
            <span className="nav-label">{item.label || 'Untitled Link'}</span>
            <span className="nav-url">{item.url || '/'}</span>
            <span className="nav-badges">
              <span className={`nm-badge ${item.is_active ? 'badge-live' : 'badge-draft'}`}>{item.is_active ? 'live' : 'hidden'}</span>
              {hasChildren ? <span className="nm-badge badge-drop">group</span> : null}
              {item.open_new_tab ? <span className="nm-badge badge-ext">↗</span> : null}
            </span>
            <span className="nav-actions">
              <button
                type="button"
                className="nav-act"
                onClick={(event) => {
                  event.stopPropagation()
                  void addItem(item.id)
                }}
                title="Add sub-link">
                +
              </button>
              <button
                type="button"
                className="nav-act del"
                onClick={(event) => {
                  event.stopPropagation()
                  void deleteItem(item.id)
                }}
                title="Delete item">
                ⌫
              </button>
            </span>
          </div>

          {hasChildren ? (
            <div className={`sub-items ${isExpanded ? 'open' : ''}`}>
              {isExpanded ? renderTree(item.children || [], depth + 1) : null}
              <button
                type="button"
                className="add-sub"
                style={{ marginLeft: `${30 + depth * 18}px` }}
                onClick={(event) => {
                  event.stopPropagation()
                  void addItem(item.id)
                }}>
                + Add sub-link under {item.label || 'this item'}
              </button>
            </div>
          ) : null}
        </div>
      )
    })

  return (
    <div className="info-wrap">
      <div className="pg-hd">
        <div>
          <h2>Navigation Builder</h2>
          <p>Manage hierarchical global navigation links used across the site.</p>
        </div>
        <div className="pg-actions">
          <button className="gbtn" type="button" onClick={() => void addItem(selectedId)}>
            {selectedId ? '+ Add Sub-Link' : '+ Add Root Link'}
          </button>
        </div>
      </div>

      <div className="cm-manager-grid">
        <div className="ic">
          <div className="ic-h">Navigation Tree <span>{selectedId ? 'Select parent to add nested links' : 'Add root links by default'}</span></div>
          <div className="ic-b d-block">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((row) => (
                  <div key={row} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : items.length ? (
              <div className="nav-builder">{renderTree(items)}</div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No navigation items yet.</div>
            )}
          </div>
        </div>

        <div className="ic">
          <div className="ic-h">
            {selectedItem ? 'Edit Link' : 'Add Link'}
            <span>{selectedItem ? 'Updates work for parent and child links' : draft.parent_id ? 'New child link' : 'New root link'}</span>
          </div>
          <div className="ic-b">
            <div className="ig">
              <label>Label</label>
              <input
                value={selectedItem?.label ?? draft.label}
                onChange={(event) =>
                  selectedItem
                    ? void updateItem(selectedItem.id, { label: event.target.value })
                    : setDraft((current) => ({ ...current, label: event.target.value }))
                }
                placeholder="Link label"
              />
            </div>
            <div className="ig">
              <label>URL</label>
              <input
                value={selectedItem?.url ?? draft.url}
                onChange={(event) =>
                  selectedItem
                    ? void updateItem(selectedItem.id, { url: event.target.value })
                    : setDraft((current) => ({ ...current, url: event.target.value }))
                }
                placeholder="/about"
              />
            </div>
            <div className="ig">
              <label>Order</label>
              <input
                type="number"
                value={selectedItem?.order_index ?? draft.order_index}
                onChange={(event) =>
                  selectedItem
                    ? void updateItem(selectedItem.id, { order_index: Number(event.target.value || 0) })
                    : setDraft((current) => ({ ...current, order_index: Number(event.target.value || 0) }))
                }
              />
            </div>
            <div className="ig">
              <label>Parent</label>
              <input value={selectedItem?.parent_id ?? draft.parent_id ?? 'root'} disabled />
            </div>

            <div className="ig full">
              <div className="cm-check-row">
                <input
                  type="checkbox"
                  checked={selectedItem?.is_active ?? true}
                  onChange={(event) => selectedItem && void updateItem(selectedItem.id, { is_active: event.target.checked })}
                  disabled={!selectedItem}
                />
                <span>Active link</span>
              </div>
            </div>

            <div className="ig full">
              <div className="cm-check-row">
                <input
                  type="checkbox"
                  checked={selectedItem?.open_new_tab ?? false}
                  onChange={(event) => selectedItem && void updateItem(selectedItem.id, { open_new_tab: event.target.checked })}
                  disabled={!selectedItem}
                />
                <span>Open in new tab</span>
              </div>
            </div>

            {!selectedItem ? (
              <div className="ig full">
                <button
                  type="button"
                  onClick={() => void saveDraft()}
                  disabled={saving}
                  className="gbtn pu">
                  {saving ? 'Saving...' : draft.parent_id ? 'Add Child Link' : 'Add Root Link'}
                </button>
              </div>
            ) : (
              <div className="ig full">
                <div className="d-flex gap-2">
                  <button className="gbtn" type="button" onClick={() => void addItem(selectedItem.id)}>
                    + Add Child
                  </button>
                  <button className="gbtn" type="button" onClick={() => setSelectedId(null)}>
                    Clear Selection
                  </button>
                  <button className="gbtn" type="button" onClick={() => setExpandedIds((current) => ({ ...current, [selectedItem.id]: !(current[selectedItem.id] ?? true) }))}>
                    {(expandedIds[selectedItem.id] ?? true) ? 'Collapse' : 'Expand'}
                  </button>
                  <button className="gbtn" type="button" onClick={() => void deleteItem(selectedItem.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
