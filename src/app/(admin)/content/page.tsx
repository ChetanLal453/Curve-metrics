'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type PageItem = {
  id: number
  title?: string
  name?: string
  slug?: string
  url?: string
  status?: 'live' | 'draft'
}

export default function ContentPage() {
  const [pages, setPages] = useState<PageItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadPages() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/pages', { credentials: 'include' })
        const data = await response.json()
        console.log('API RESPONSE:', data)

        if (!response.ok || !data?.success) {
          throw new Error(data?.error || 'Failed to load pages')
        }

        if (!active) {
          return
        }

        const nextPages = Array.isArray(data?.pages) ? data.pages : []
        const sortedPages = [...nextPages].sort((a, b) => Number(b?.id ?? 0) - Number(a?.id ?? 0))

        setPages(sortedPages)
        setTotal(typeof data?.total === 'number' ? data.total : sortedPages.length)
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load pages')
          setPages([])
          setTotal(0)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadPages()

    return () => {
      active = false
    }
  }, [])

  const liveCount = useMemo(() => pages.filter((page) => page.status === 'live').length, [pages])
  const draftCount = useMemo(() => pages.filter((page) => page.status === 'draft').length, [pages])

  return (
    <div className="content-wrap">
      <div className="pg-hd">
        <div>
          <h2>Content Manager</h2>
          <p>Manage the actual pages currently stored in your CMS</p>
        </div>
      </div>

      <div className="ic">
        <div className="ic-h">
          <div>
            <div className="layout-nav-title">Pages Library</div>
            <div className="layout-nav-subtitle">
              {loading ? 'Loading pages...' : `${total} total pages · ${liveCount} live · ${draftCount} draft`}
            </div>
          </div>
          <div className="pg-actions">
            <Link className="gbtn pu" href="/page-editor">
              Open Page Editor
            </Link>
          </div>
        </div>

        <div className="ic-b">
          {error ? <div className="layout-side-empty">{error}</div> : null}

          {!error && loading ? <div className="layout-side-empty">Loading pages...</div> : null}

          {!error && !loading ? (
            pages.length ? (
              <div className="cms-page-list">
                {pages.map((page) => {
                  const title = page.title || page.name || 'Untitled Page'
                  const slug = page.slug || (page.url === '/' ? 'home' : String(page.url || '').replace(/^\//, ''))
                  const url = page.url || (slug === 'home' ? '/' : `/${slug}`)
                  const status = page.status === 'draft' ? 'draft' : 'live'

                  return (
                    <div key={page.id} className="cms-page-row">
                      <div className="cms-page-main">
                        <span className={`cms-page-dot ${status === 'live' ? 'is-live' : 'is-draft'}`} />
                        <div className="cms-page-copy">
                          <div className="cms-page-title">{title}</div>
                          <div className="cms-page-path">{url}</div>
                        </div>
                      </div>

                      <div className="cms-page-meta">
                        <span className={`nm-badge ${status === 'live' ? 'badge-live' : 'badge-draft'}`}>{status}</span>
                        <span className="cms-page-slug">slug: {slug || 'home'}</span>
                        <div className="cms-page-actions">
                          <Link className="cms-page-link" href={url} target="_blank" rel="noreferrer">
                            Open
                          </Link>
                          <Link className="cms-page-link is-primary" href="/page-editor">
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="layout-side-empty">No pages found.</div>
            )
          ) : null}
        </div>
      </div>

      <style jsx>{`
        :global(.cm-admin-shell .content-page) {
          background:
            radial-gradient(circle at top left, rgba(124, 109, 250, 0.12), transparent 25%),
            linear-gradient(180deg, #0d0f14 0%, #111318 100%);
          min-height: calc(100vh - 48px);
        }

        :global(.cm-admin-shell .content-wrap) {
          padding: 32px 24px;
          background: #0d0f14;
          font-family: 'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        :global(.cm-admin-shell .content-wrap .pg-hd) {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        :global(.cm-admin-shell .content-wrap .pg-hd h2) {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.4px;
          color: #e8eaf0;
        }

        :global(.cm-admin-shell .content-wrap .pg-hd p) {
          color: #8b90a8;
          font-size: 11px;
          line-height: 1.5;
          margin-top: 2px;
        }

        :global(.cm-admin-shell .content-wrap .ic) {
          background: #111318;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 12px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.5),
            0 32px 80px rgba(0, 0, 0, 0.6);
        }

        :global(.cm-admin-shell .content-wrap .ic-h) {
          min-height: 48px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          background: #13161e;
        }

        :global(.cm-admin-shell .content-wrap .layout-nav-title) {
          font-size: 13px;
          font-weight: 600;
          color: #e8eaf0;
        }

        :global(.cm-admin-shell .content-wrap .layout-nav-subtitle) {
          font-size: 11.5px;
          color: #8b90a8;
          margin-top: 2px;
        }

        :global(.cm-admin-shell .content-wrap .pg-actions) {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        :global(.cm-admin-shell .content-wrap .gbtn) {
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 500;
          font-family: 'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1;
        }

        :global(.cm-admin-shell .content-wrap .gbtn.pu) {
          background: #7c6dfa;
          border-color: #7c6dfa;
          color: #fff;
        }

        :global(.cm-admin-shell .content-wrap .gbtn.pu:hover) {
          background: #a594ff;
          border-color: #a594ff;
        }

        :global(.cm-admin-shell .content-wrap .ic-b) {
          padding: 24px;
          background: #13161e;
        }

        :global(.cm-admin-shell .content-wrap .layout-side-empty) {
          margin-bottom: 14px;
          padding: 22px 8px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: #1a1d28;
          color: #5a5f7a;
          font-size: 10px;
          text-align: center;
        }

        .nm-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 64px;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .badge-live {
          background: rgba(62, 207, 142, 0.1);
          color: #3ecf8e;
        }

        .badge-draft {
          background: rgba(251, 191, 36, 0.1);
          color: #fbbf24;
        }

        .cms-page-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cms-page-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 10px;
          background: #1a1d28;
          transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
        }

        .cms-page-row:hover {
          border-color: rgba(255, 255, 255, 0.13);
          background: #22263a;
          transform: translateY(-1px);
        }

        .cms-page-main {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          flex: 1;
        }

        .cms-page-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          flex-shrink: 0;
          box-shadow: none;
        }

        .cms-page-dot.is-live {
          background: #3ecf8e;
        }

        .cms-page-dot.is-draft {
          background: #fbbf24;
        }

        .cms-page-copy {
          min-width: 0;
        }

        .cms-page-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #e8eaf0;
        }

        .cms-page-path {
          margin-top: 3px;
          font-size: 12px;
          color: #8b90a8;
          font-family: 'DM Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
        }

        .cms-page-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .cms-page-slug {
          font-size: 11.5px;
          color: #8b90a8;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          padding: 3px 10px;
          background: #22263a;
        }

        .cms-page-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cms-page-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 30px;
          padding: 0 12px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: transparent;
          color: #8b90a8;
          text-decoration: none;
          font-size: 12.5px;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .cms-page-link:hover {
          border-color: rgba(255, 255, 255, 0.13);
          color: #e8eaf0;
          background: #22263a;
        }

        .cms-page-link.is-primary {
          background: #7c6dfa;
          border-color: #7c6dfa;
          color: #fff;
        }

        .cms-page-link.is-primary:hover {
          background: #a594ff;
          border-color: #a594ff;
        }

        @media (max-width: 900px) {
          :global(.cm-admin-shell .content-wrap) {
            padding: 24px 16px;
          }

          :global(.cm-admin-shell .content-wrap .pg-hd) {
            flex-direction: column;
          }

          .cms-page-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .cms-page-meta {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  )
}
