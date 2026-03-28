import { useState } from 'react'
import { mockPatterns } from '../lib/mock-data'
import type { Pattern } from '../types/incident'
import './PatternsPage.css'

const recurrenceLabels: Record<Pattern['recurrence_type'], string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  'deploy-correlated': 'Deploy-Correlated',
  irregular: 'Irregular',
}

function confidenceColor(confidence: number): string {
  if (confidence >= 85) return 'var(--severity-critical)'
  if (confidence >= 70) return 'var(--severity-high)'
  if (confidence >= 50) return 'var(--severity-medium)'
  return 'var(--severity-low)'
}

export default function PatternsPage() {
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null)
  const [filterType, setFilterType] = useState<string>('all')

  const patterns = mockPatterns
    .filter((p) => filterType === 'all' || p.recurrence_type === filterType)
    .sort((a, b) => b.confidence - a.confidence)

  return (
    <div className="patterns-page">
      <div className="page-header">
        <h1>Pattern Detection</h1>
        <p>
          Detected recurring incident patterns across your services. Higher
          confidence means stronger recurrence evidence.
        </p>
      </div>

      <div className="patterns-summary">
        <div className="summary-card">
          <span className="summary-value">{mockPatterns.length}</span>
          <span className="summary-label">Patterns Detected</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">
            {Math.round(
              mockPatterns.reduce((s, p) => s + p.confidence, 0) /
                mockPatterns.length
            )}
            %
          </span>
          <span className="summary-label">Avg Confidence</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">
            {mockPatterns.reduce((s, p) => s + p.incident_count, 0)}
          </span>
          <span className="summary-label">Linked Incidents</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">
            {new Set(mockPatterns.flatMap((p) => p.services)).size}
          </span>
          <span className="summary-label">Services Affected</span>
        </div>
      </div>

      <div className="patterns-filters">
        <span className="filter-label">Recurrence:</span>
        {['all', 'weekly', 'daily', 'monthly', 'deploy-correlated', 'irregular'].map(
          (type) => (
            <button
              key={type}
              className={`filter-btn ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type === 'all' ? 'All' : recurrenceLabels[type as Pattern['recurrence_type']]}
            </button>
          )
        )}
      </div>

      <div className="patterns-layout">
        <div className="patterns-list">
          {patterns.map((pattern) => (
            <div
              key={pattern.id}
              className={`pattern-card ${selectedPattern?.id === pattern.id ? 'selected' : ''}`}
              onClick={() => setSelectedPattern(pattern)}
            >
              <div className="pattern-card-header">
                <div className="pattern-confidence-ring">
                  <svg viewBox="0 0 36 36" className="confidence-svg">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="var(--bg-tertiary)"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={confidenceColor(pattern.confidence)}
                      strokeWidth="3"
                      strokeDasharray={`${pattern.confidence}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="confidence-text">{pattern.confidence}%</span>
                </div>
                <div className="pattern-info">
                  <h3>{pattern.name}</h3>
                  <div className="pattern-meta">
                    <span
                      className="recurrence-badge"
                      data-type={pattern.recurrence_type}
                    >
                      {recurrenceLabels[pattern.recurrence_type]}
                    </span>
                    <span className="pattern-count">
                      {pattern.incident_count} incidents
                    </span>
                  </div>
                </div>
              </div>
              <p className="pattern-desc">{pattern.description}</p>
              <div className="pattern-services">
                {pattern.services.map((s) => (
                  <span key={s} className="service-tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedPattern && (
          <div className="pattern-detail">
            <div className="detail-header">
              <h2>{selectedPattern.name}</h2>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedPattern(null)}
              >
                Close
              </button>
            </div>
            <p className="detail-description">{selectedPattern.description}</p>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Confidence</span>
                <span
                  className="detail-value"
                  style={{ color: confidenceColor(selectedPattern.confidence) }}
                >
                  {selectedPattern.confidence}%
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Recurrence</span>
                <span className="detail-value">
                  {recurrenceLabels[selectedPattern.recurrence_type]}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Incidents</span>
                <span className="detail-value">
                  {selectedPattern.incident_count}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Seen</span>
                <span className="detail-value">
                  {new Date(selectedPattern.last_seen).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Affected Services</h4>
              <div className="pattern-services">
                {selectedPattern.services.map((s) => (
                  <span key={s} className="service-tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h4>Example Incidents</h4>
              <div className="example-incidents">
                {selectedPattern.example_incidents.map((id) => (
                  <span key={id} className="incident-ref">
                    {id}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h4>Confidence Breakdown</h4>
              <div className="confidence-breakdown">
                <div className="breakdown-item">
                  <span>Recurrence consistency</span>
                  <div className="breakdown-bar">
                    <div
                      className="breakdown-fill"
                      style={{
                        width: `${selectedPattern.confidence * 0.95}%`,
                        background: 'var(--accent)',
                      }}
                    />
                  </div>
                </div>
                <div className="breakdown-item">
                  <span>Sample size</span>
                  <div className="breakdown-bar">
                    <div
                      className="breakdown-fill"
                      style={{
                        width: `${Math.min(100, selectedPattern.incident_count * 12)}%`,
                        background: 'var(--warning)',
                      }}
                    />
                  </div>
                </div>
                <div className="breakdown-item">
                  <span>Recency</span>
                  <div className="breakdown-bar">
                    <div
                      className="breakdown-fill"
                      style={{
                        width: `${selectedPattern.confidence * 0.9}%`,
                        background: 'var(--info)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
