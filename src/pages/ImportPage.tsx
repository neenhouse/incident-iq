import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SAMPLE_PAGERDUTY_JSON, mockIncidents } from '../lib/mock-data'
import type { Incident } from '../types/incident'
import './ImportPage.css'

type ImportTab = 'paste' | 'sample'

interface ImportResult {
  success: boolean
  count: number
  errors: string[]
  incidents: Incident[]
}

function parseJsonInput(raw: string): ImportResult {
  try {
    const parsed = JSON.parse(raw)
    const errors: string[] = []
    let incidents: Incident[] = []

    // Handle PagerDuty-style format
    const items = parsed.incidents || parsed.data || (Array.isArray(parsed) ? parsed : [parsed])

    incidents = items.map((item: Record<string, unknown>, idx: number) => {
      const inc: Incident = {
        id: (item.id as string) || `IMPORTED-${idx + 1}`,
        title: (item.title as string) || `Untitled incident #${idx + 1}`,
        severity: mapSeverity(item.urgency as string || item.severity as string || 'medium'),
        status: mapStatus(item.status as string || 'resolved'),
        service: ((item.service as Record<string, string>)?.summary as string) || (item.service as string) || 'unknown',
        team: ((item.teams as Array<Record<string, string>>)?.[0]?.summary as string) || (item.team as string) || 'unknown',
        started_at: (item.created_at as string) || (item.started_at as string) || new Date().toISOString(),
        acknowledged_at: (item.acknowledged_at as string) || undefined,
        resolved_at: (item.last_status_change_at as string) || (item.resolved_at as string) || undefined,
        root_cause: (item.description as string) || (item.root_cause as string) || undefined,
        resolution: (item.resolve_reason as string) || (item.resolution as string) || undefined,
        tags: (item.tags as string[]) || [],
        source: 'json-import',
        imported_at: new Date().toISOString(),
      }

      if (!inc.title) errors.push(`Row ${idx + 1}: missing title`)
      if (!inc.started_at) errors.push(`Row ${idx + 1}: missing start time`)

      return inc
    })

    return {
      success: errors.length === 0,
      count: incidents.length,
      errors,
      incidents,
    }
  } catch {
    return {
      success: false,
      count: 0,
      errors: ['Invalid JSON. Please check your input and try again.'],
      incidents: [],
    }
  }
}

function mapSeverity(s: string): Incident['severity'] {
  const lower = s.toLowerCase()
  if (lower === 'critical' || lower === 'p1') return 'critical'
  if (lower === 'high' || lower === 'p2') return 'high'
  if (lower === 'low' || lower === 'p4') return 'low'
  return 'medium'
}

function mapStatus(s: string): Incident['status'] {
  const lower = s.toLowerCase()
  if (lower === 'resolved' || lower === 'closed') return 'resolved'
  if (lower === 'acknowledged' || lower === 'accepted') return 'acknowledged'
  return 'open'
}

export default function ImportPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<ImportTab>('sample')
  const [jsonInput, setJsonInput] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)

  function handlePasteImport() {
    if (!jsonInput.trim()) {
      setResult({
        success: false,
        count: 0,
        errors: ['Please paste JSON data before importing.'],
        incidents: [],
      })
      return
    }
    setResult(parseJsonInput(jsonInput))
  }

  function handleSampleImport() {
    setResult({
      success: true,
      count: mockIncidents.length,
      errors: [],
      incidents: mockIncidents,
    })
  }

  function handleLoadSampleJson() {
    setJsonInput(JSON.stringify(SAMPLE_PAGERDUTY_JSON, null, 2))
    setTab('paste')
  }

  return (
    <div className="import-page">
      <div className="page-header">
        <h1>Import Incidents</h1>
        <p>
          Paste JSON data from PagerDuty, Opsgenie, or any incident source.
          Or load the built-in sample dataset to explore the platform.
        </p>
      </div>

      <div className="import-tabs">
        <button
          className={`import-tab ${tab === 'sample' ? 'active' : ''}`}
          onClick={() => setTab('sample')}
        >
          Sample Dataset
        </button>
        <button
          className={`import-tab ${tab === 'paste' ? 'active' : ''}`}
          onClick={() => setTab('paste')}
        >
          Paste JSON
        </button>
      </div>

      {tab === 'sample' && (
        <div className="import-section">
          <div className="sample-info">
            <h3>PagerDuty-style Sample Data</h3>
            <p>
              50 incidents across 8 services over 6 months. Includes critical,
              high, medium, and low severity incidents with root causes, resolutions,
              and timing data.
            </p>
            <div className="sample-stats">
              <div className="sample-stat">
                <span className="sample-stat-value">50</span>
                <span className="sample-stat-label">Incidents</span>
              </div>
              <div className="sample-stat">
                <span className="sample-stat-value">8</span>
                <span className="sample-stat-label">Services</span>
              </div>
              <div className="sample-stat">
                <span className="sample-stat-value">6</span>
                <span className="sample-stat-label">Months</span>
              </div>
              <div className="sample-stat">
                <span className="sample-stat-value">8</span>
                <span className="sample-stat-label">Teams</span>
              </div>
            </div>
            <div className="sample-actions">
              <button className="btn btn-primary btn-lg" onClick={handleSampleImport}>
                Load Sample Dataset
              </button>
              <button className="btn btn-secondary" onClick={handleLoadSampleJson}>
                View as JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'paste' && (
        <div className="import-section">
          <div className="json-editor">
            <label htmlFor="json-input">Paste incident JSON</label>
            <textarea
              id="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{
  "incidents": [
    {
      "id": "PD-10234",
      "title": "api-gateway 5xx rate above threshold",
      "urgency": "high",
      "status": "resolved",
      "service": { "summary": "api-gateway" },
      "created_at": "2026-03-20T14:32:00Z",
      "teams": [{ "summary": "Platform" }],
      "description": "Connection pool exhaustion.",
      "resolve_reason": "Restarted pods."
    }
  ]
}`}
              rows={16}
            />
            <div className="json-actions">
              <button className="btn btn-primary" onClick={handlePasteImport}>
                Import JSON
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setJsonInput(JSON.stringify(SAMPLE_PAGERDUTY_JSON, null, 2))
                }}
              >
                Load Example
              </button>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className={`import-result ${result.success ? 'success' : 'error'}`}>
          <div className="result-header">
            <span className="result-icon">
              {result.success ? '\u2713' : '\u2717'}
            </span>
            <div>
              <h3>
                {result.success
                  ? `Successfully imported ${result.count} incidents`
                  : 'Import failed'}
              </h3>
              {result.errors.length > 0 && (
                <ul className="result-errors">
                  {result.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {result.success && (
            <div className="result-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/patterns')}
              >
                View Patterns
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/analytics')}
              >
                View Analytics
              </button>
            </div>
          )}
        </div>
      )}

      {result && result.success && result.incidents.length > 0 && (
        <div className="import-preview">
          <h3>Imported Incidents Preview</h3>
          <div className="preview-table-wrapper">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Service</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {result.incidents.slice(0, 10).map((inc) => (
                  <tr key={inc.id}>
                    <td className="mono">{inc.id}</td>
                    <td className="title-cell">{inc.title}</td>
                    <td>
                      <span className={`severity-badge severity-${inc.severity}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${inc.status}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="mono">{inc.service}</td>
                    <td className="mono">
                      {new Date(inc.started_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.incidents.length > 10 && (
            <p className="preview-more">
              ...and {result.incidents.length - 10} more incidents
            </p>
          )}
        </div>
      )}
    </div>
  )
}
