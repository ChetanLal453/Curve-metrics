'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

type Lead = {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

const statusClassMap: Record<Lead['status'], string> = {
  new: 'bb',
  read: 'ba',
  replied: 'bu',
}

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/contact')
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load leads')
      }

      const nextLeads = data.submissions || []
      setLeads(nextLeads)
      setSelectedId((current) => current ?? nextLeads[0]?.id ?? null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchLeads()
  }, [fetchLeads])

  const filteredLeads = useMemo(() => {
    if (!query.trim()) {
      return leads
    }

    const lowered = query.toLowerCase()
    return leads.filter((lead) =>
      [lead.name, lead.email, lead.subject].some((value) => String(value || '').toLowerCase().includes(lowered)),
    )
  }, [leads, query])

  const selectedLead = leads.find((lead) => lead.id === selectedId) || null

  const updateStatus = async (lead: Lead, status: Lead['status']) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/contact/${lead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update lead')
      }

      setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, status } : item)))
      toast.success('Lead updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update lead')
    } finally {
      setSaving(false)
    }
  }

  const handleSelect = async (lead: Lead) => {
    setSelectedId(lead.id)
    if (lead.status === 'new') {
      await updateStatus(lead, 'read')
    }
  }

  const exportCsv = () => {
    const header = ['Name', 'Email', 'Phone', 'Subject', 'Status', 'Created At', 'Message']
    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone,
      lead.subject,
      lead.status,
      lead.created_at,
      lead.message.replace(/\r?\n/g, ' '),
    ])

    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="leads-wrap">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181f',
            color: '#eeeeff',
            border: '1px solid rgba(255,255,255,0.08)',
          },
        }}
      />

      <div className="pg-hd">
        <div>
          <h2>Leads <span className="cm-count-copy">(18 total · 5 new)</span></h2>
          <p>Contact form submissions — manage and respond to inquiries</p>
        </div>
        <div className="pg-actions">
          <button className="gbtn" type="button" onClick={exportCsv}>
            Export CSV
          </button>
          <button className="gbtn" type="button">
            Filter ↓
          </button>
        </div>
      </div>

      <div className="tbl-wrap">
        <div className="tbl-toolbar">
          <input
            className="srch"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search leads…"
          />
          <button className="gbtn" type="button">All status ↓</button>
          <button className="gbtn" type="button">All sources ↓</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Source</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => {
              const source = lead.subject?.startsWith('/') ? lead.subject : '/contact'
              const dateLabel = new Date(lead.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })

              return (
                <tr key={lead.id} className={`cm-click-row ${lead.id === selectedId ? 'active' : ''}`} onClick={() => void handleSelect(lead)}>
                  <td style={{ color: 'var(--t1)', fontWeight: 500 }}>{lead.name}</td>
                  <td style={{ fontSize: 10 }}>{lead.email}</td>
                  <td className="cm-lead-cell">{lead.message}</td>
                  <td><span className="cm-source-chip">{source}</span></td>
                  <td className="mono">{dateLabel}</td>
                  <td>
                    <span className={`badge ${statusClassMap[lead.status]}`}>
                      {lead.status === 'new' ? 'New' : lead.status === 'read' ? 'Read' : 'Replied'}
                    </span>
                  </td>
                </tr>
              )
            })}
            {!filteredLeads.length && !loading ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No leads found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LeadsPage
