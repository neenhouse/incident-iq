import { useState } from 'react'
import { mockRunbooks } from '../lib/mock-data'
import type { Runbook } from '../types/incident'
import './RunbooksPage.css'

export default function RunbooksPage() {
  const [selectedRunbook, setSelectedRunbook] = useState<Runbook>(mockRunbooks[0])
  const [isEditing, setIsEditing] = useState(false)
  const [editedSteps, setEditedSteps] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRunbooks = mockRunbooks.filter(
    (rb) =>
      rb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rb.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rb.symptoms.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  function handleEdit() {
    setIsEditing(true)
    setEditedSteps([...selectedRunbook.resolution_steps])
  }

  function handleSave() {
    setIsEditing(false)
    // In a real app, this would persist
    setSelectedRunbook({
      ...selectedRunbook,
      resolution_steps: editedSteps,
      version: selectedRunbook.version + 1,
      updated_at: new Date().toISOString(),
    })
  }

  function handleStepChange(index: number, value: string) {
    const updated = [...editedSteps]
    updated[index] = value
    setEditedSteps(updated)
  }

  return (
    <div className="runbooks-page">
      <div className="page-header">
        <h1>Runbook Generator</h1>
        <p>
          Auto-generated step-by-step runbooks from resolved incident clusters.
          Edit and version control your operational procedures.
        </p>
      </div>

      <div className="runbooks-layout">
        <aside className="runbooks-sidebar">
          <div className="sidebar-search">
            <input
              type="text"
              placeholder="Search runbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="runbooks-list">
            {filteredRunbooks.map((rb) => (
              <button
                key={rb.id}
                className={`runbook-item ${selectedRunbook.id === rb.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedRunbook(rb)
                  setIsEditing(false)
                }}
              >
                <span className="rb-service">{rb.service}</span>
                <span className="rb-title">{rb.title}</span>
                <span className="rb-meta">
                  v{rb.version} &middot; {rb.related_incidents.length} incidents
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="runbook-content">
          <div className="runbook-header">
            <div>
              <span className="rb-service-badge">{selectedRunbook.service}</span>
              <h2>{selectedRunbook.title}</h2>
              <div className="rb-version-info">
                Version {selectedRunbook.version} &middot; Last updated{' '}
                {new Date(selectedRunbook.updated_at).toLocaleDateString()}
              </div>
            </div>
            <div className="rb-actions">
              {isEditing ? (
                <>
                  <button className="btn btn-success btn-sm" onClick={handleSave}>
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button className="btn btn-secondary btn-sm" onClick={handleEdit}>
                  Edit
                </button>
              )}
            </div>
          </div>

          <section className="rb-section">
            <h3>
              <span className="section-number">1</span>
              Symptoms
            </h3>
            <ul className="rb-list symptoms-list">
              {selectedRunbook.symptoms.map((s, i) => (
                <li key={i}>
                  <span className="symptom-indicator" />
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section className="rb-section">
            <h3>
              <span className="section-number">2</span>
              Diagnostic Steps
            </h3>
            <ol className="rb-list diagnostic-list">
              {selectedRunbook.diagnostic_steps.map((step, i) => (
                <li key={i}>
                  <div className="step-content">{step}</div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rb-section">
            <h3>
              <span className="section-number">3</span>
              Resolution Steps
            </h3>
            {isEditing ? (
              <div className="edit-steps">
                {editedSteps.map((step, i) => (
                  <div key={i} className="edit-step">
                    <span className="step-number">{i + 1}</span>
                    <textarea
                      value={step}
                      onChange={(e) => handleStepChange(i, e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <ol className="rb-list resolution-list">
                {selectedRunbook.resolution_steps.map((step, i) => (
                  <li key={i}>
                    <div className="step-content">{step}</div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="rb-section">
            <h3>
              <span className="section-number">4</span>
              Escalation Path
            </h3>
            <div className="escalation-chain">
              {selectedRunbook.escalation_path.map((person, i) => (
                <div key={i} className="escalation-step">
                  <span className="escalation-number">{i + 1}</span>
                  <span>{person}</span>
                  {i < selectedRunbook.escalation_path.length - 1 && (
                    <span className="escalation-arrow">&rarr;</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rb-section">
            <h3>Related Incidents</h3>
            <div className="related-incidents">
              {selectedRunbook.related_incidents.map((id) => (
                <span key={id} className="incident-ref">{id}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
