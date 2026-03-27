import './DashboardPage.css'

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <a href="/" className="logo">IncidentIQ</a>
        <nav className="dashboard-nav">
          <a href="/import">Import</a>
          <a href="/dashboard" className="active">Dashboard</a>
        </nav>
      </header>
      <main className="dashboard-main">
        <h1>Analytics Dashboard</h1>
        <p>MTTR/MTTA analytics, pattern detection, and incident predictions will render here.</p>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>MTTR Trend</h3>
            <p className="placeholder">Chart placeholder</p>
          </div>
          <div className="dashboard-card">
            <h3>MTTA Trend</h3>
            <p className="placeholder">Chart placeholder</p>
          </div>
          <div className="dashboard-card">
            <h3>Incident Volume</h3>
            <p className="placeholder">Chart placeholder</p>
          </div>
          <div className="dashboard-card">
            <h3>Risk Heatmap</h3>
            <p className="placeholder">Chart placeholder</p>
          </div>
          <div className="dashboard-card">
            <h3>Detected Patterns</h3>
            <p className="placeholder">Pattern list placeholder</p>
          </div>
          <div className="dashboard-card">
            <h3>Culture Score</h3>
            <p className="placeholder">Scorecard placeholder</p>
          </div>
        </div>
      </main>
    </div>
  )
}
