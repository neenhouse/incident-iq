import './ImportPage.css'

export default function ImportPage() {
  return (
    <div className="import-page">
      <header className="dashboard-header">
        <a href="/" className="logo">IncidentIQ</a>
        <nav className="dashboard-nav">
          <a href="/import" className="active">Import</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
      </header>
      <main className="import-main">
        <h1>Import Incidents</h1>
        <p>Upload incident data from CSV, JSON, or connect to PagerDuty, Opsgenie, and Jira.</p>

        <div className="import-dropzone">
          <div className="dropzone-content">
            <span className="dropzone-icon">📂</span>
            <h3>Drop files here or click to browse</h3>
            <p>Supports CSV and JSON files up to 50MB</p>
          </div>
        </div>

        <div className="import-integrations">
          <h2>Or connect a source</h2>
          <div className="integration-grid">
            <button className="integration-card" disabled>
              <strong>PagerDuty</strong>
              <span>Coming soon</span>
            </button>
            <button className="integration-card" disabled>
              <strong>Opsgenie</strong>
              <span>Coming soon</span>
            </button>
            <button className="integration-card" disabled>
              <strong>Jira</strong>
              <span>Coming soon</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
