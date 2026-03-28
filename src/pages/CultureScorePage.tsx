import { mockCultureScores } from '../lib/mock-data'
import { LineChart } from '../components/charts/LineChart'
import './CultureScorePage.css'

const dimensionLabels: Record<string, { label: string; description: string }> = {
  root_cause_depth: {
    label: 'Root Cause Depth',
    description: 'How thoroughly incidents are investigated to find true root causes, not just symptoms.',
  },
  action_item_followthrough: {
    label: 'Action Item Follow-through',
    description: 'Percentage of post-incident action items completed within their SLA.',
  },
  review_timeliness: {
    label: 'Postmortem Completion Rate',
    description: 'How consistently post-incident reviews are conducted within 48 hours.',
  },
  language_tone: {
    label: 'Blame Language Detection',
    description: 'Absence of blame-oriented language in incident reports and reviews.',
  },
  learning_extraction: {
    label: 'Learning Sharing',
    description: 'How effectively learnings are documented and shared across teams.',
  },
}

const DIMENSION_KEYS = [
  'root_cause_depth',
  'action_item_followthrough',
  'review_timeliness',
  'language_tone',
  'learning_extraction',
] as const

function gradeColor(grade: string): string {
  if (grade.startsWith('A')) return 'var(--success)'
  if (grade.startsWith('B')) return 'var(--info)'
  if (grade.startsWith('C')) return 'var(--warning)'
  return 'var(--accent)'
}

function scoreColor(score: number): string {
  if (score >= 75) return 'var(--success)'
  if (score >= 60) return 'var(--info)'
  if (score >= 45) return 'var(--warning)'
  return 'var(--accent)'
}

function getRecommendation(key: string, score: number): string | null {
  if (score >= 75) return null
  const recommendations: Record<string, string> = {
    root_cause_depth:
      'Use the "5 Whys" technique in every postmortem. Train teams on systems thinking.',
    action_item_followthrough:
      'Assign clear owners and due dates. Review action items in weekly team standups.',
    review_timeliness:
      'Set a 48-hour SLA for postmortem completion. Automate reminders.',
    language_tone:
      'Establish review guidelines that focus on systems, not individuals. Use NLP scanning.',
    learning_extraction:
      'Create a shared incident learning database. Present key learnings in monthly all-hands.',
  }
  return recommendations[key] || null
}

// Simulate repeat incident rate
const repeatIncidentRate = [
  { label: '2025-10', value: 35 },
  { label: '2025-11', value: 30 },
  { label: '2025-12', value: 28 },
  { label: '2026-01', value: 22 },
  { label: '2026-02', value: 18 },
  { label: '2026-03', value: 15 },
]

export default function CultureScorePage() {
  const latest = mockCultureScores[mockCultureScores.length - 1]
  const previous = mockCultureScores[mockCultureScores.length - 2]

  const overallTrend = mockCultureScores.map((s) => ({
    label: s.period,
    value: s.overall,
  }))

  return (
    <div className="culture-page">
      <div className="page-header">
        <h1>Blameless Culture Scorecard</h1>
        <p>
          Measure and track your organization&apos;s adoption of blameless incident
          management across 5 key dimensions.
        </p>
      </div>

      <div className="score-hero">
        <div className="overall-score">
          <div className="score-ring-large">
            <svg viewBox="0 0 120 120" className="score-svg-large">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--bg-tertiary)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={gradeColor(latest.grade)}
                strokeWidth="8"
                strokeDasharray={`${(latest.overall / 100) * 327} 327`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="score-center">
              <span className="score-number">{latest.overall}</span>
              <span className="score-grade" style={{ color: gradeColor(latest.grade) }}>
                {latest.grade}
              </span>
            </div>
          </div>
          <div className="score-meta">
            <h2>Overall Culture Score</h2>
            <p className={`trend-indicator ${latest.trend}`}>
              {latest.trend === 'improving'
                ? '\u2191 Improving'
                : latest.trend === 'declining'
                  ? '\u2193 Declining'
                  : '\u2192 Stable'}{' '}
              ({latest.overall - previous.overall > 0 ? '+' : ''}
              {latest.overall - previous.overall} from last month)
            </p>
          </div>
        </div>
      </div>

      <div className="dimensions-grid">
        {DIMENSION_KEYS.map((key) => {
          const score = latest.sub_scores[key]
          const prevScore = previous.sub_scores[key]
          const change = score - prevScore
          const info = dimensionLabels[key]
          const recommendation = getRecommendation(key, score)

          return (
            <div key={key} className="dimension-card">
              <div className="dim-header">
                <div className="dim-score-circle">
                  <svg viewBox="0 0 44 44" className="dim-score-svg">
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      fill="none"
                      stroke="var(--bg-tertiary)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      fill="none"
                      stroke={scoreColor(score)}
                      strokeWidth="4"
                      strokeDasharray={`${(score / 100) * 113} 113`}
                      strokeLinecap="round"
                      transform="rotate(-90 22 22)"
                    />
                  </svg>
                  <span className="dim-score-text">{score}</span>
                </div>
                <div className="dim-info">
                  <h3>{info.label}</h3>
                  <span className={`dim-change ${change >= 0 ? 'positive' : 'negative'}`}>
                    {change >= 0 ? '+' : ''}{change} from last month
                  </span>
                </div>
              </div>
              <p className="dim-description">{info.description}</p>
              {recommendation && (
                <div className="dim-recommendation">
                  <span className="rec-label">Recommendation</span>
                  <p>{recommendation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Overall Score Trend</h3>
          <LineChart
            data={overallTrend}
            color="var(--info)"
            height={220}
          />
        </div>
        <div className="chart-card">
          <h3>Repeat Incident Rate (%)</h3>
          <LineChart
            data={repeatIncidentRate}
            color="var(--success)"
            height={220}
            valueFormatter={(v) => `${v}%`}
          />
        </div>
      </div>

      <div className="celebrations">
        <h2>Celebration Highlights</h2>
        <p className="section-subtitle">
          Examples of excellent blameless practices from recent incidents
        </p>
        <div className="celebration-grid">
          <div className="celebration-card">
            <span className="celebration-icon">&#9733;</span>
            <h4>Blame-Free Language</h4>
            <p>
              &quot;The Platform team&apos;s postmortem for INC-0019 focused entirely on
              systemic factors and automation gaps, with zero individual blame.&quot;
            </p>
            <span className="celebration-team">Platform Team</span>
          </div>
          <div className="celebration-card">
            <span className="celebration-icon">&#9733;</span>
            <h4>Deep Root Cause Analysis</h4>
            <p>
              &quot;The Data team traced INC-0028 through 5 contributing factors,
              identifying a configuration drift that affected 3 services.&quot;
            </p>
            <span className="celebration-team">Data Team</span>
          </div>
          <div className="celebration-card">
            <span className="celebration-icon">&#9733;</span>
            <h4>100% Action Completion</h4>
            <p>
              &quot;The Identity team completed all 8 action items from their
              Q1 postmortems ahead of schedule.&quot;
            </p>
            <span className="celebration-team">Identity Team</span>
          </div>
        </div>
      </div>
    </div>
  )
}
