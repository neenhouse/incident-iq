import './LandingPage.css'

const features = [
  {
    title: 'Incident Importer',
    description: 'Import from CSV, JSON, PagerDuty, Opsgenie, or Jira with smart column mapping.',
    icon: '📥',
  },
  {
    title: 'Pattern Detection',
    description: 'Automatically detect recurring incident patterns across time, services, and teams.',
    icon: '🔍',
  },
  {
    title: 'Incident Predictor',
    description: 'Forecast future incidents with risk scoring and calendar heatmaps.',
    icon: '📊',
  },
  {
    title: 'Runbook Generator',
    description: 'Auto-generate troubleshooting runbooks from resolved incident clusters.',
    icon: '📋',
  },
  {
    title: 'MTTR/MTTA Analytics',
    description: 'Track resolution and acknowledgment trends with drill-down dashboards.',
    icon: '⏱️',
  },
  {
    title: 'Weakness Map',
    description: 'Visualize systemic weaknesses and failure propagation across services.',
    icon: '🗺️',
  },
  {
    title: 'Culture Scorecard',
    description: 'Measure and improve blameless incident management practices.',
    icon: '🎯',
  },
]

export default function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-header">
        <nav className="landing-nav">
          <div className="logo">IncidentIQ</div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/import" className="btn btn-primary">Get Started</a>
          </div>
        </nav>
      </header>

      <section className="hero">
        <h1>Turn incident chaos into<br />actionable intelligence</h1>
        <p className="hero-subtitle">
          Import your incident history. Detect patterns. Predict future incidents.
          Auto-generate runbooks. Track what matters.
        </p>
        <div className="hero-actions">
          <a href="/import" className="btn btn-primary btn-lg">Import Incidents</a>
          <a href="#features" className="btn btn-secondary btn-lg">Learn More</a>
        </div>
      </section>

      <section id="features" className="features">
        <h2>Platform Capabilities</h2>
        <div className="feature-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} IncidentIQ. Built for SRE teams that learn from every incident.</p>
      </footer>
    </div>
  )
}
