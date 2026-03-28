import { useState } from 'react'
import { mockPredictions } from '../lib/mock-data'
import './PredictionsPage.css'

function riskColor(score: number): string {
  if (score >= 75) return 'var(--severity-critical)'
  if (score >= 55) return 'var(--severity-high)'
  if (score >= 35) return 'var(--severity-medium)'
  return 'var(--severity-low)'
}

function riskLabel(score: number): string {
  if (score >= 75) return 'Critical'
  if (score >= 55) return 'High'
  if (score >= 35) return 'Medium'
  return 'Low'
}

export default function PredictionsPage() {
  const [sortBy, setSortBy] = useState<'risk' | 'probability'>('risk')

  const predictions = [...mockPredictions].sort((a, b) =>
    sortBy === 'risk'
      ? b.risk_score - a.risk_score
      : b.probability - a.probability
  )

  const highRiskCount = predictions.filter((p) => p.risk_score >= 55).length
  const avgRisk = Math.round(
    predictions.reduce((s, p) => s + p.risk_score, 0) / predictions.length
  )

  return (
    <div className="predictions-page">
      <div className="page-header">
        <h1>Incident Predictor</h1>
        <p>
          Risk scoring per service based on detected patterns, historical trends,
          and deployment activity. Shows likely next incident predictions.
        </p>
      </div>

      <div className="pred-summary">
        <div className="summary-card">
          <span className="summary-value" style={{ color: 'var(--accent)' }}>
            {highRiskCount}
          </span>
          <span className="summary-label">High+ Risk Services</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{avgRisk}</span>
          <span className="summary-label">Avg Risk Score</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">7d</span>
          <span className="summary-label">Prediction Window</span>
        </div>
      </div>

      <div className="pred-controls">
        <span className="filter-label">Sort by:</span>
        <button
          className={`filter-btn ${sortBy === 'risk' ? 'active' : ''}`}
          onClick={() => setSortBy('risk')}
        >
          Risk Score
        </button>
        <button
          className={`filter-btn ${sortBy === 'probability' ? 'active' : ''}`}
          onClick={() => setSortBy('probability')}
        >
          Probability
        </button>
      </div>

      <div className="predictions-grid">
        {predictions.map((pred) => (
          <div key={pred.id} className="prediction-card">
            <div className="pred-card-header">
              <div className="pred-service">
                <h3>{pred.service}</h3>
                <span className="pred-window">
                  {new Date(pred.window_start).toLocaleDateString()} -{' '}
                  {new Date(pred.window_end).toLocaleDateString()}
                </span>
              </div>
              <div
                className="risk-gauge"
                style={{
                  borderColor: riskColor(pred.risk_score),
                }}
              >
                <span
                  className="risk-score"
                  style={{ color: riskColor(pred.risk_score) }}
                >
                  {pred.risk_score}
                </span>
                <span className="risk-label">{riskLabel(pred.risk_score)}</span>
              </div>
            </div>

            <div className="pred-metrics">
              <div className="pred-metric">
                <span className="pred-metric-label">Probability</span>
                <div className="probability-bar">
                  <div
                    className="probability-fill"
                    style={{
                      width: `${pred.probability}%`,
                      background: riskColor(pred.risk_score),
                    }}
                  />
                </div>
                <span className="pred-metric-value">{pred.probability}%</span>
              </div>
            </div>

            <div className="pred-factors">
              <h4>Contributing Factors</h4>
              <ul>
                {pred.contributing_factors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="pred-related">
              <span className="pred-related-label">Related pattern:</span>
              {pred.related_patterns.map((p) => (
                <span key={p} className="pattern-ref">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="risk-heatmap-section">
        <h2>7-Day Risk Heatmap</h2>
        <p className="section-subtitle">
          Predicted risk windows for each service over the next 7 days
        </p>
        <div className="heatmap-grid">
          <div className="heatmap-header">
            <span className="heatmap-label">Service</span>
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date('2026-03-27')
              d.setDate(d.getDate() + i)
              return (
                <span key={i} className="heatmap-day">
                  {d.toLocaleDateString('en', { weekday: 'short', day: 'numeric' })}
                </span>
              )
            })}
          </div>
          {predictions.map((pred) => (
            <div key={pred.id} className="heatmap-row">
              <span className="heatmap-service">{pred.service}</span>
              {Array.from({ length: 7 }, (_, i) => {
                // Simulate varying risk per day
                const dayRisk = Math.max(
                  0,
                  pred.risk_score + Math.sin(i * 1.5 + pred.risk_score) * 15
                )
                const normalizedRisk = Math.min(100, Math.max(0, dayRisk))
                return (
                  <span
                    key={i}
                    className="heatmap-cell"
                    style={{
                      background: `rgba(239, 68, 68, ${normalizedRisk / 100 * 0.8})`,
                    }}
                    title={`Risk: ${Math.round(normalizedRisk)}`}
                  />
                )
              })}
            </div>
          ))}
          <div className="heatmap-legend">
            <span>Low risk</span>
            <div className="legend-gradient" />
            <span>High risk</span>
          </div>
        </div>
      </div>
    </div>
  )
}
