'use client'

import { useEffect, useMemo, useState } from 'react'

type PageItem = {
  id: number
  name: string
  label: string
  url: string
  status: 'live' | 'draft'
}

type MediaItem = {
  id: string
  filename: string
  url: string
  uploaded_at?: string | null
}

type NavItem = {
  id: number
  label: string
  url: string
  children?: NavItem[]
}

export default function DashboardPage() {
  const [pages, setPages] = useState<PageItem[]>([])
  const [media, setMedia] = useState<MediaItem[]>([])
  const [navigation, setNavigation] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setLoading(true)
      setError('')
      try {
        const [pagesRes, mediaRes, navRes] = await Promise.all([
          fetch('/api/pages', { credentials: 'include' }),
          fetch('/api/media/list', { credentials: 'include' }),
          fetch('/api/navigation', { credentials: 'include' }),
        ])

        const [pagesData, mediaData, navData] = await Promise.all([pagesRes.json(), mediaRes.json(), navRes.json()])

        if (!pagesRes.ok || !mediaRes.ok || !navRes.ok) {
          throw new Error(pagesData.error || mediaData.error || navData.error || 'Failed to load dashboard data')
        }

        if (!active) {
          return
        }

        setPages(Array.isArray(pagesData.pages) ? pagesData.pages : [])
        setMedia(Array.isArray(mediaData.media) ? mediaData.media : [])
        setNavigation(Array.isArray(navData.items) ? navData.items : [])
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard data')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadDashboard()
    return () => {
      active = false
    }
  }, [])

  const livePages = useMemo(() => pages.filter((page) => page.status === 'live'), [pages])
  const draftPages = useMemo(() => pages.filter((page) => page.status === 'draft'), [pages])
  const totalNavItems = useMemo(() => {
    const countItems = (items: NavItem[]): number => items.reduce((total, item) => total + 1 + countItems(item.children || []), 0)
    return countItems(navigation)
  }, [navigation])

  return (
    <div className="dash">
      <div className="dash-grid">
        <div className="kpi"><div className="kpi-l">Total Pages</div><div className="kpi-v" style={{ color: 'var(--pu)' }}>{loading ? '...' : pages.length}</div><div className="kpi-ch"><span className="kpi-chip up">Live {livePages.length}</span><span>Draft {draftPages.length}</span></div></div>
        <div className="kpi"><div className="kpi-l">Media Files</div><div className="kpi-v" style={{ color: 'var(--gr)' }}>{loading ? '...' : media.length}</div><div className="kpi-ch"><span className="kpi-chip good">Library</span><span>DB-backed</span></div></div>
        <div className="kpi"><div className="kpi-l">Navigation Items</div><div className="kpi-v" style={{ color: 'var(--am)' }}>{loading ? '...' : totalNavItems}</div><div className="kpi-ch"><span>{navigation.length} top-level</span></div></div>
        <div className="kpi"><div className="kpi-l">Status</div><div className="kpi-v" style={{ color: 'var(--rd)' }}>{error ? 'Error' : loading ? '...' : 'Ready'}</div><div className="kpi-ch"><span className={`kpi-chip ${error ? 'bad' : 'good'}`}>{error ? 'Needs attention' : 'Connected'}</span></div></div>
      </div>

      {error ? <div className="dcard" style={{ color: 'var(--rd)' }}>{error}</div> : null}

      <div className="dash-3col">
        <div className="dcard">
          <div className="dcard-h">Pages <span>Live data</span></div>
          {(loading ? [] : pages.slice(0, 6)).map((page) => (
            <div key={page.id} className="page-row"><span className={`status-pill ${page.status === 'live' ? 'sp-live' : 'sp-draft'}`}>{page.status}</span><span>{page.label || page.name}</span><span className="mono" style={{ marginLeft: 'auto' }}>{page.url}</span></div>
          ))}
          {!loading && !pages.length ? <div className="feed-m">No pages found.</div> : null}
        </div>

        <div className="dcard">
          <div className="dcard-h">Media <span>Newest files</span></div>
          {(loading ? [] : media.slice(0, 6)).map((item) => (
            <div key={item.id} className="leads-row"><span className="lead-status" style={{ background: 'var(--gr)' }} /><div><div className="feed-t">{item.filename}</div><div className="feed-m">{item.url}</div></div></div>
          ))}
          {!loading && !media.length ? <div className="feed-m">No media found.</div> : null}
        </div>

        <div className="dcard">
          <div className="dcard-h">Navigation <span>Nested tree</span></div>
          {(loading ? [] : navigation).map((item) => (
            <div key={item.id} className="feed">
              <div className="feed-ic" style={{ background: 'var(--pud)' }}>{item.children?.length ? '▾' : '•'}</div>
              <div>
                <div className="feed-t">{item.label}</div>
                <div className="feed-m">{item.url}</div>
                {item.children?.length ? <div className="feed-m">{item.children.length} child item(s)</div> : null}
              </div>
            </div>
          ))}
          {!loading && !navigation.length ? <div className="feed-m">No navigation configured.</div> : null}
        </div>
      </div>
    </div>
  )
}
