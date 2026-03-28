import { useState } from 'react'
import { mockMetricsSnapshots, mockIncidents, SERVICES } from '../lib/mock-data'
import { LineChart } from '../components/charts/LineChart'
import { BarChart } from '../components/charts/BarChart'
import './AnalyticsPage.css'

type TimeRange = '3m' | '6m'

function formatMinutes(m: number): string {
  if (m < 60) return `${Math.round(m)}m`
  return `${Math.floor(m / 60)}h ${Math.round(m % 60)}m`
}

// Calculate team leaderboard from incidents
function getTeamLeaderboard() {
  const teamStats: Record<string, { mttr: number[]; mtta: number[]; count: number }> = {}

  for (const inc of mockIncidents) {
    if (inc.status !== 'resolved' || !inc.resolved_at || !inc.acknowledged_at) continue
    if (!teamStats[inc.team]) {
      teamStats[inc.team] = { mttr: [], mtta: [], count: 0 }
    }
    const mttr = (new Date(inc.resolved_at).getTime() - new Date(inc.started_at).getTime()) / 60000
    const mtta = (new Date(inc.acknowledged_at).getTime() - new Date(inc.started_at).getTime()) / 60000
    teamStats[inc.team].mttr.push(mttr)
    teamStats[inc.team].mtta.push(mtta)
    teamStats[inc.team].count++
  }

  return Object.entries(teamStats)
    .map(([team, stats]) => ({
      team,
      avgMttr: stats.mttr.reduce((a, b) => a + b, 0) / stats.mttr.length,
      avgMtta: stats.mtta.reduce((a, b) => a + b, 0) / stats.mtta.length,
      count: stats.count,
    }))
    .sort((a, b) => a.avgMttr - b.avgMttr)
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('6m')

  const snapshots = timeRange === '3m'
    ? mockMetricsSnapshots.slice(-3)
    : mockMetricsSnapshots

  const latestSnapshot = mockMetricsSnapshots[mockMetricsSnapshots.length - 1]
  const previousSnapshot = mockMetricsSnapshots[mockMetricsSnapshots.length - 2]

  const mttrChange = latestSnapshot.mttr_minutes - previousSnapshot.mttr_minutes
  const mttaChange = latestSnapshot.mtta_minutes - previousSnapshot.mtta_minutes

  const mttrData = snapshots.map((s) => ({
    label: s.period,
    value: s.mttr_minutes,
  }))

  const mttaData = snapshots.map((s) => ({
    label: s.period,
    value: s.mtta_minutes,
  }))

  const volumeData = snapshots.map((s) => ({
    label: s.period,
    value: s.incident_count,
  }))

  const serviceData = SERVICES.map((s) => ({
    label: s,
    value: latestSnapshot.by_service[s] || 0,
    color: (latestSnapshot.by_service[s] || 0) > 1 ? 'var(--accent)' : 'var(--success)',
  }))

  const severityData = [
    { label: 'Critical', value: latestSnapshot.by_severity.critical, color: 'var(--severity-critical)' },
    { label: 'High', value: latestSnapshot.by_severity.high, color: 'var(--severity-high)' },
    { label: 'Medium', value: latestSnapshot.by_severity.medium, color: 'var(--severity-medium)' },
    { label: 'Low', value: latestSnapshot.by_severity.low, color: 'var(--severity-low)' },
  ]

  const teamLeaderboard = getTeamLeaderboard()

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="header-row">
          <div>
            <h1>MTTR/MTTA Analytics</h1>
            <p>
              Track resolution and acknowledgment trends with drill-down analysis
              and team comparisons.
            </p>
          </div>
          <div className="time-range-selector">
            <button
              className={`filter-btn ${timeRange === '3m' ? 'active' : ''}`}
              onClick={() => setTimeRange('3m')}
            >
              3 Months
            </button>
            <button
              className={`filter-btn ${timeRange === '6m' ? 'active' : ''}`}
              onClick={() => setTimeRange('6m')}
            >
              6 Months
            </button>
          </div>
        </div>
      </div>

      <div className="metrics-overview">
        <div className="metric-big-card">
          <div className="metric-label">Mean Time to Resolve</div>
          <div className="metric-value">{formatMinutes(latestSnapshot.mttr_minutes)}</div>
          <div className={`metric-change ${mttrChange <= 0 ? 'positive' : 'negative'}`}>
            {mttrChange <= 0 ? '\u2193' : '\u2191'} {Math.abs(mttrChange)}min vs last month
          </div>
        </div>
        <div className="metric-big-card">
          <div className="metric-label">Mean Time to Acknowledge</div>
          <div className="metric-value">{formatMinutes(latestSnapshot.mtta_minutes)}</div>
          <div className={`metric-change ${mttaChange <= 0 ? 'positive' : 'negative'}`}>
            {mttaChange <= 0 ? '\u2193' : '\u2191'} {Math.abs(mttaChange)}min vs last month
          </div>
        </div>
        <div className="metric-big-card">
          <div className="metric-label">Incidents This Month</div>
          <div className="metric-value">{latestSnapshot.incident_count}</div>
          <div className={`metric-change ${latestSnapshot.incident_count <= previousSnapshot.incident_count ? 'positive' : 'negative'}`}>
            {latestSnapshot.incident_count <= previousSnapshot.incident_count ? '\u2193' : '\u2191'}{' '}
            {Math.abs(latestSnapshot.incident_count - previousSnapshot.incident_count)} vs last month
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>MTTR Trend</h3>
          <LineChart
            data={mttrData}
            color="var(--accent)"
            height={220}
            valueFormatter={(v) => `${v}m`}
          />
        </div>
        <div className="chart-card">
          <h3>MTTA Trend</h3>
          <LineChart
            data={mttaData}
            color="var(--info)"
            height={220}
            valueFormatter={(v) => `${v}m`}
          />
        </div>
        <div className="chart-card">
          <h3>Incident Volume</h3>
          <LineChart
            data={volumeData}
            color="var(--warning)"
            height={220}
          />
        </div>
        <div className="chart-card">
          <h3>By Severity (Current Month)</h3>
          <BarChart
            data={severityData}
            height={220}
          />
        </div>
      </div>

      <div className="detail-row">
        <div className="chart-card wide">
          <h3>Incidents by Service (Current Month)</h3>
          <BarChart
            data={serviceData}
            horizontal
          />
        </div>

        <div className="chart-card">
          <h3>Team Leaderboard (Avg MTTR)</h3>
          <div className="leaderboard">
            {teamLeaderboard.map((team, i) => (
              <div key={team.team} className="leaderboard-row">
                <span className="leaderboard-rank">#{i + 1}</span>
                <span className="leaderboard-team">{team.team}</span>
                <div className="leaderboard-bar-container">
                  <div
                    className="leaderboard-bar"
                    style={{
                      width: `${(team.avgMttr / teamLeaderboard[teamLeaderboard.length - 1].avgMttr) * 100}%`,
                      background: i < 3 ? 'var(--success)' : 'var(--accent)',
                    }}
                  />
                </div>
                <span className="leaderboard-value">{formatMinutes(team.avgMttr)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
