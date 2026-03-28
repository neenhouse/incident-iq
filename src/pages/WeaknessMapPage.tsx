import { useState } from 'react'
import { mockWeaknessMap } from '../lib/mock-data'
import type { WeaknessNode } from '../lib/mock-data'
import './WeaknessMapPage.css'

function weaknessColor(score: number): string {
  if (score >= 70) return 'var(--severity-critical)'
  if (score >= 50) return 'var(--severity-high)'
  if (score >= 30) return 'var(--severity-medium)'
  return 'var(--severity-low)'
}

function weaknessLabel(score: number): string {
  if (score >= 70) return 'Critical'
  if (score >= 50) return 'High'
  if (score >= 30) return 'Moderate'
  return 'Low'
}

// Network graph positions (manually placed for aesthetics)
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  'api-gateway': { x: 400, y: 100 },
  'database-primary': { x: 400, y: 300 },
  'auth-service': { x: 200, y: 200 },
  'payment-service': { x: 600, y: 200 },
  'user-service': { x: 200, y: 400 },
  'notification-service': { x: 600, y: 400 },
  'search-service': { x: 150, y: 320 },
  'cdn-edge': { x: 650, y: 100 },
}

export default function WeaknessMapPage() {
  const [selectedNode, setSelectedNode] = useState<WeaknessNode | null>(null)
  const [view, setView] = useState<'network' | 'treemap'>('network')

  const sortedNodes = [...mockWeaknessMap].sort((a, b) => b.score - a.score)
  const totalScore = sortedNodes.reduce((s, n) => s + n.score, 0)

  return (
    <div className="weakness-page">
      <div className="page-header">
        <div className="header-row">
          <div>
            <h1>Systemic Weakness Map</h1>
            <p>
              Identify which services and dependencies are most fragile. Nodes
              are colored by weakness score.
            </p>
          </div>
          <div className="view-selector">
            <button
              className={`filter-btn ${view === 'network' ? 'active' : ''}`}
              onClick={() => setView('network')}
            >
              Network Graph
            </button>
            <button
              className={`filter-btn ${view === 'treemap' ? 'active' : ''}`}
              onClick={() => setView('treemap')}
            >
              Treemap
            </button>
          </div>
        </div>
      </div>

      <div className="weakness-layout">
        <div className="map-container">
          {view === 'network' ? (
            <svg
              viewBox="0 0 800 500"
              className="network-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Draw edges first */}
              {mockWeaknessMap.map((node) =>
                node.dependencies.map((dep) => {
                  const from = NODE_POSITIONS[node.service]
                  const to = NODE_POSITIONS[dep]
                  if (!from || !to) return null
                  return (
                    <line
                      key={`${node.service}-${dep}`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="var(--border)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.6"
                    />
                  )
                })
              )}

              {/* Draw nodes */}
              {mockWeaknessMap.map((node) => {
                const pos = NODE_POSITIONS[node.service]
                if (!pos) return null
                const radius = 20 + node.score * 0.3
                const isSelected = selectedNode?.service === node.service

                return (
                  <g
                    key={node.service}
                    onClick={() => setSelectedNode(node)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Glow for high-risk */}
                    {node.score >= 60 && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={radius + 10}
                        fill={weaknessColor(node.score)}
                        opacity="0.15"
                      />
                    )}

                    {/* Node circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={radius}
                      fill={weaknessColor(node.score)}
                      opacity={isSelected ? 1 : 0.75}
                      stroke={isSelected ? 'white' : 'transparent'}
                      strokeWidth="2"
                    />

                    {/* Score label */}
                    <text
                      x={pos.x}
                      y={pos.y + 5}
                      textAnchor="middle"
                      fill="white"
                      fontSize="14"
                      fontWeight="700"
                    >
                      {node.score}
                    </text>

                    {/* Service name below */}
                    <text
                      x={pos.x}
                      y={pos.y + radius + 16}
                      textAnchor="middle"
                      fill="var(--text-secondary)"
                      fontSize="11"
                      fontFamily="var(--font-mono)"
                    >
                      {node.service}
                    </text>
                  </g>
                )
              })}
            </svg>
          ) : (
            <div className="treemap">
              {sortedNodes.map((node) => {
                const sizePercent = (node.score / totalScore) * 100
                return (
                  <div
                    key={node.service}
                    className={`treemap-cell ${selectedNode?.service === node.service ? 'selected' : ''}`}
                    style={{
                      flex: `${sizePercent} 0 0`,
                      background: `${weaknessColor(node.score)}20`,
                      borderColor: weaknessColor(node.score),
                    }}
                    onClick={() => setSelectedNode(node)}
                  >
                    <span className="treemap-score" style={{ color: weaknessColor(node.score) }}>
                      {node.score}
                    </span>
                    <span className="treemap-service">{node.service}</span>
                    <span className="treemap-issue">{node.topIssue}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="weakness-detail">
          {selectedNode ? (
            <>
              <div className="detail-header">
                <h2>{selectedNode.service}</h2>
                <span
                  className="weakness-score-badge"
                  style={{
                    color: weaknessColor(selectedNode.score),
                    borderColor: weaknessColor(selectedNode.score),
                  }}
                >
                  {selectedNode.score} - {weaknessLabel(selectedNode.score)}
                </span>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Incidents</span>
                  <span className="detail-value">{selectedNode.incidentCount}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Avg MTTR</span>
                  <span className="detail-value">{selectedNode.avgMttr}m</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Top Issue</h4>
                <p className="top-issue">{selectedNode.topIssue}</p>
              </div>

              <div className="detail-section">
                <h4>Dependencies</h4>
                {selectedNode.dependencies.length > 0 ? (
                  <div className="dep-list">
                    {selectedNode.dependencies.map((dep) => {
                      const depNode = mockWeaknessMap.find(
                        (n) => n.service === dep
                      )
                      return (
                        <div
                          key={dep}
                          className="dep-item"
                          onClick={() =>
                            depNode && setSelectedNode(depNode)
                          }
                        >
                          <span className="dep-service">{dep}</span>
                          {depNode && (
                            <span
                              className="dep-score"
                              style={{ color: weaknessColor(depNode.score) }}
                            >
                              Score: {depNode.score}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="no-deps">No upstream dependencies</p>
                )}
              </div>

              <div className="detail-section">
                <h4>Remediation Suggestions</h4>
                <ul className="remediation-list">
                  {selectedNode.score >= 70 && (
                    <li>Immediate: Reduce incident recurrence by addressing root cause pattern</li>
                  )}
                  {selectedNode.avgMttr > 100 && (
                    <li>Create and drill runbooks to reduce MTTR below 60 minutes</li>
                  )}
                  {selectedNode.dependencies.length > 2 && (
                    <li>Reduce coupling: too many upstream dependencies increase blast radius</li>
                  )}
                  <li>Add circuit breakers and graceful degradation paths</li>
                  <li>Increase observability: add custom dashboards and alerting</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Click a service node to view weakness details and remediation suggestions.</p>
            </div>
          )}
        </div>
      </div>

      <div className="weakness-ranking">
        <h2>Service Weakness Ranking</h2>
        <div className="ranking-list">
          {sortedNodes.map((node, i) => (
            <div
              key={node.service}
              className="ranking-item"
              onClick={() => setSelectedNode(node)}
            >
              <span className="ranking-pos">#{i + 1}</span>
              <span className="ranking-service">{node.service}</span>
              <div className="ranking-bar-track">
                <div
                  className="ranking-bar-fill"
                  style={{
                    width: `${node.score}%`,
                    background: weaknessColor(node.score),
                  }}
                />
              </div>
              <span className="ranking-score" style={{ color: weaknessColor(node.score) }}>
                {node.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
