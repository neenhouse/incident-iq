import { Link } from 'react-router-dom'
import './LandingPage.css'

const features = [
  {
    title: 'Incident Importer',
    description:
      'Paste JSON, upload CSV, or connect PagerDuty. Smart schema mapping normalizes your data instantly.',
    icon: '\u25BC',
    color: 'var(--accent)',
  },
  {
    title: 'Pattern Detection',
    description:
      'AI-powered detection of recurring incidents: time-based, service-correlated, and deploy-triggered.',
    icon: '\u25C8',
    color: 'var(--severity-high)',
  },
  {
    title: 'Incident Predictor',
    description:
      'Risk scoring per service with probability forecasts and contributing factor breakdowns.',
    icon: '\u25B2',
    color: 'var(--warning)',
  },
  {
    title: 'Runbook Generator',
    description:
      'Auto-generate step-by-step runbooks from resolved incident clusters. Edit and version them.',
    icon: '\u2630',
    color: 'var(--info)',
  },
  {
    title: 'MTTR/MTTA Analytics',
    description:
      'Track resolution and acknowledgment trends with interactive charts and team leaderboards.',
    icon: '\u25CF',
    color: 'var(--success)',
  },
  {
    title: 'Weakness Map',
    description:
      'Visualize systemic weaknesses: which services and dependencies are most fragile.',
    icon: '\u25A0',
    color: 'var(--severity-critical)',
  },
  {
    title: 'Culture Scorecard',
    description:
      'Score your blameless culture across 5 dimensions: language, follow-through, learning, and more.',
    icon: '\u2605',
    color: '#a855f7',
  },
]

const stats = [
  { value: '73%', label: 'Faster MTTR' },
  { value: '89%', label: 'Patterns Detected' },
  { value: '5x', label: 'Fewer Repeat Incidents' },
  { value: '94%', label: 'Team Satisfaction' },
]

export default function LandingPage() {
  return (
    <div className="landing">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="landing-header">
        <nav className="landing-nav">
          <div className="logo">
            <span className="logo-icon">&#9888;</span>
            IncidentIQ
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#stats">Proof</a>
            <Link to="/import" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <div className="hero-wrap">
        <div className="hero-bg" aria-hidden="true">
          <video autoPlay muted loop playsInline poster="/hero-og.webp">
            <source src="/hero-og.webm" type="video/webm" />
            <source src="/hero-og.mp4" type="video/mp4" />
          </video>
        </div>
      <section id="main-content" className="hero">
        <div className="hero-badge">Incident Intelligence Platform</div>
        <h1>
          Learn from <span className="hero-accent">every</span> incident
        </h1>
        <p className="hero-subtitle">
          Transform incident history into actionable intelligence. Detect
          patterns, predict future incidents, auto-generate runbooks, and build
          a blameless culture.
        </p>
        <div className="hero-actions">
          <Link to="/import" className="btn btn-primary btn-lg">
            Import Incidents
          </Link>
          <Link to="/analytics" className="btn btn-secondary btn-lg">
            View Demo Dashboard
          </Link>
        </div>
        <div className="hero-visual">
          <div className="hero-terminal">
            <div className="terminal-header">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
              <span className="terminal-title">pattern-detection</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-line">
                <span className="t-prompt">$</span> incidentiq analyze
                --last-6-months
              </div>
              <div className="terminal-line t-output">
                Scanning 50 incidents across 8 services...
              </div>
              <div className="terminal-line t-output t-success">
                &#10003; 7 patterns detected
              </div>
              <div className="terminal-line t-output t-danger">
                &#9888; &quot;API gateway fails every Monday 2AM&quot;
                (confidence: 92%)
              </div>
              <div className="terminal-line t-output t-danger">
                &#9888; &quot;DB timeouts correlate with deploy events&quot;
                (confidence: 87%)
              </div>
              <div className="terminal-line t-output t-warning">
                &#9888; &quot;Payment degradation during peak hours&quot;
                (confidence: 78%)
              </div>
              <div className="terminal-line t-output t-info">
                Generated 5 runbooks from resolved incidents
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      <section id="stats" className="stats-section">
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="features">
        <h2>Platform Capabilities</h2>
        <p className="section-subtitle">
          Everything you need to go from reactive firefighting to proactive
          reliability.
        </p>
        <div className="feature-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <span
                className="feature-icon"
                style={{ color: feature.color }}
              >
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Stop fighting fires. Start preventing them.</h2>
        <p>
          Import your incident data and get intelligence in minutes, not months.
        </p>
        <Link to="/import" className="btn btn-primary btn-lg">
          Get Started Free
        </Link>
      </section>

      <footer className="landing-footer">
        <p>
          &copy; {new Date().getFullYear()} IncidentIQ. Built for SRE teams
          that learn from every incident.
        </p>
      </footer>
    </div>
  )
}
