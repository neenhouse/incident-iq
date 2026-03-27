export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type IncidentStatus = 'resolved' | 'open' | 'acknowledged'

export interface Incident {
  id: string
  title: string
  severity: Severity
  status: IncidentStatus
  service: string
  team: string
  started_at: string
  acknowledged_at?: string
  resolved_at?: string
  root_cause?: string
  resolution?: string
  tags: string[]
  source: string
  imported_at: string
}

export interface Pattern {
  id: string
  name: string
  description: string
  confidence: number
  incident_count: number
  services: string[]
  recurrence_type: 'daily' | 'weekly' | 'monthly' | 'deploy-correlated' | 'irregular'
  last_seen: string
  example_incidents: string[]
}

export interface Prediction {
  id: string
  service: string
  risk_score: number
  probability: number
  window_start: string
  window_end: string
  contributing_factors: string[]
  related_patterns: string[]
}

export interface Runbook {
  id: string
  title: string
  service: string
  symptoms: string[]
  diagnostic_steps: string[]
  resolution_steps: string[]
  escalation_path: string[]
  related_incidents: string[]
  version: number
  created_at: string
  updated_at: string
}

export interface CultureScore {
  overall: number
  grade: string
  sub_scores: {
    root_cause_depth: number
    action_item_followthrough: number
    review_timeliness: number
    language_tone: number
    learning_extraction: number
  }
  trend: 'improving' | 'stable' | 'declining'
  period: string
}

export interface MetricsSnapshot {
  mttr_minutes: number
  mtta_minutes: number
  incident_count: number
  period: string
  by_severity: Record<Severity, number>
  by_service: Record<string, number>
}
