# IncidentIQ -- Product Requirements Document

## Overview

IncidentIQ is an incident pattern intelligence platform that transforms raw incident history into actionable intelligence: pattern detection, future incident prediction, automated runbooks, MTTR/MTTA analytics, systemic weakness identification, and blameless culture scoring.

---

## Feature 1: Landing Page

### Summary
Marketing and product entry point that communicates the value proposition, showcases key capabilities, and drives user sign-up or demo requests.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| LP-1 | Hero section with tagline, subtitle, and primary CTA ("Get Started" / "Import Incidents") | P0 |
| LP-2 | Feature overview grid showing all 7 platform capabilities with icons and descriptions | P0 |
| LP-3 | Interactive demo preview -- animated or static mockup of the analytics dashboard | P1 |
| LP-4 | Social proof section (logos, testimonials, or metrics) | P1 |
| LP-5 | Pricing or plan comparison section (placeholder for MVP) | P2 |
| LP-6 | Footer with links to docs, GitHub, changelog, and contact | P0 |
| LP-7 | Responsive design -- mobile, tablet, desktop breakpoints | P0 |
| LP-8 | SEO meta tags, Open Graph, and structured data | P1 |

### Acceptance Criteria
- Page loads in under 2 seconds on 3G
- Lighthouse performance score >= 90
- All CTAs link to the incident importer or sign-up flow

---

## Feature 2: Incident Data Importer

### Summary
Ingest incident history from multiple sources (CSV, JSON, PagerDuty, Opsgenie, Jira) into a normalized schema for analysis.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| IDI-1 | CSV and JSON file upload with drag-and-drop support | P0 |
| IDI-2 | Column mapping UI -- map source fields to IncidentIQ schema (title, severity, start_time, end_time, service, team, root_cause, resolution) | P0 |
| IDI-3 | PagerDuty API integration -- OAuth or API key, paginated import | P1 |
| IDI-4 | Opsgenie API integration | P2 |
| IDI-5 | Jira API integration (filter by issue type = Incident) | P2 |
| IDI-6 | Data validation -- flag missing required fields, duplicate detection, date format normalization | P0 |
| IDI-7 | Import progress indicator with row count and error summary | P0 |
| IDI-8 | Import history log -- view past imports, re-import, delete | P1 |
| IDI-9 | Sample dataset included for demo/onboarding | P0 |

### Acceptance Criteria
- Successfully imports a 10,000-row CSV in under 10 seconds
- Validates and reports errors without crashing
- Normalized data is immediately available for pattern detection

### Data Schema

```typescript
interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'resolved' | 'open' | 'acknowledged';
  service: string;
  team: string;
  started_at: ISO8601;
  acknowledged_at?: ISO8601;
  resolved_at?: ISO8601;
  root_cause?: string;
  resolution?: string;
  tags: string[];
  source: string;
  imported_at: ISO8601;
}
```

---

## Feature 3: Pattern Detection Engine

### Summary
Analyze imported incident data to detect recurring patterns across time, services, severity, root causes, and teams.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| PDE-1 | Time-based clustering -- identify incidents that recur on schedules (daily, weekly, monthly, deploy-correlated) | P0 |
| PDE-2 | Service affinity detection -- which services have correlated incident spikes | P0 |
| PDE-3 | Root cause clustering -- group incidents by similar root cause text using NLP similarity | P1 |
| PDE-4 | Severity escalation patterns -- detect when low-severity incidents precede critical ones | P1 |
| PDE-5 | Team burden analysis -- identify disproportionate incident load across teams | P0 |
| PDE-6 | Pattern confidence scoring (0-100) based on recurrence count, consistency, and recency | P0 |
| PDE-7 | Pattern detail view -- timeline visualization, affected services, example incidents | P0 |
| PDE-8 | Pattern alerting -- notify when a known pattern is likely recurring | P2 |

### Acceptance Criteria
- Detects at least 3 known patterns in the sample dataset
- Confidence scores are explainable (user can see why a score was assigned)
- Patterns update automatically when new incidents are imported

---

## Feature 4: Incident Predictor with Risk Scoring

### Summary
Forecast future incidents based on detected patterns, historical trends, and contextual signals (deploy frequency, time of day, service dependencies).

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| IP-1 | 7-day and 30-day incident probability forecast per service | P0 |
| IP-2 | Risk score (0-100) combining pattern strength, service criticality, and recent trend | P0 |
| IP-3 | Risk heatmap -- calendar view showing predicted high-risk windows | P0 |
| IP-4 | Contributing factors breakdown for each prediction | P1 |
| IP-5 | Deploy correlation -- flag risk increases around recent or scheduled deploys | P1 |
| IP-6 | Prediction accuracy tracking -- compare predictions to actual incidents over time | P1 |
| IP-7 | Alert threshold configuration -- notify when risk score exceeds user-defined threshold | P2 |
| IP-8 | Export predictions as JSON or integrate with PagerDuty/Slack | P2 |

### Acceptance Criteria
- Predictions are generated within 5 seconds of data import
- Risk heatmap is scannable and highlights top 3 risk windows
- Accuracy tracking shows prediction vs. actual with precision/recall metrics

---

## Feature 5: Runbook Auto-Generator

### Summary
Automatically generate troubleshooting runbooks from resolved incident data, grouping by service and root cause pattern, with step-by-step resolution guides.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| RG-1 | Auto-generate runbook from cluster of similar resolved incidents | P0 |
| RG-2 | Runbook structure: title, symptoms, diagnostic steps, resolution steps, escalation path, related incidents | P0 |
| RG-3 | LLM-powered summarization of resolution notes into clear steps | P1 |
| RG-4 | Runbook editor -- users can refine, annotate, and approve generated runbooks | P0 |
| RG-5 | Version history for runbooks | P1 |
| RG-6 | Runbook search by service, symptom, or keyword | P0 |
| RG-7 | Runbook effectiveness scoring -- track MTTR for incidents where runbook was used vs. not | P2 |
| RG-8 | Export as Markdown, Confluence, or Notion format | P1 |

### Acceptance Criteria
- Generates at least one runbook per detected pattern with 3+ resolved incidents
- Generated content is coherent and actionable (no hallucinated steps)
- Runbooks are searchable within 1 second

---

## Feature 6: MTTR/MTTA Analytics Dashboard

### Summary
Comprehensive analytics dashboard tracking Mean Time to Resolve (MTTR), Mean Time to Acknowledge (MTTA), and related reliability metrics with trend analysis.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| AD-1 | MTTR and MTTA trend lines -- daily, weekly, monthly aggregation with selectable date range | P0 |
| AD-2 | Breakdown by service, team, severity, and time of day | P0 |
| AD-3 | Percentile distribution (p50, p75, p90, p99) for MTTR and MTTA | P1 |
| AD-4 | Incident volume over time -- stacked by severity | P0 |
| AD-5 | On-call burden metrics -- incidents per on-call rotation, after-hours percentage | P1 |
| AD-6 | SLA compliance tracking -- percentage of incidents resolved within SLA by severity tier | P1 |
| AD-7 | Comparative view -- compare two time periods or two teams side by side | P2 |
| AD-8 | Dashboard export as PDF or PNG for reporting | P2 |
| AD-9 | Real-time filter and drill-down on all charts | P0 |

### Acceptance Criteria
- Dashboard renders within 2 seconds for 50,000 incidents
- All charts are interactive with hover tooltips and click-to-drill-down
- Date range picker defaults to last 90 days

---

## Feature 7: Systemic Weakness Map

### Summary
Visualize the architecture and identify systemic weaknesses -- services, dependencies, and failure propagation paths that contribute to recurring incidents.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| SW-1 | Service dependency graph -- nodes are services, edges are observed incident correlations | P0 |
| SW-2 | Weakness scoring per service -- weighted by incident frequency, severity, MTTR, and blast radius | P0 |
| SW-3 | Failure propagation paths -- show how incidents cascade across services | P1 |
| SW-4 | Heatmap overlay -- color nodes by weakness score (green to red) | P0 |
| SW-5 | Historical comparison -- show how weakness scores change over time | P1 |
| SW-6 | Remediation suggestions -- link weakness to specific patterns and recommended actions | P1 |
| SW-7 | Interactive graph -- zoom, pan, click nodes for detail panel | P0 |
| SW-8 | Export graph as SVG or PNG | P2 |

### Acceptance Criteria
- Graph renders for up to 100 services without performance issues
- Weakness scores are explainable (breakdown visible on hover/click)
- Top 5 weakest services are highlighted by default

---

## Feature 8: Blameless Culture Scorecard

### Summary
Measure and track the organization's adoption of blameless incident management practices through analysis of incident review quality, language patterns, and process adherence.

### Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| BC-1 | Overall blameless culture score (0-100) with letter grade | P0 |
| BC-2 | Sub-scores: root cause depth, action item follow-through, review timeliness, language tone, learning extraction | P0 |
| BC-3 | Language analysis -- flag blame-oriented language in incident reports (NLP-based) | P1 |
| BC-4 | Post-incident review completion rate tracking | P0 |
| BC-5 | Action item tracking -- percentage of post-incident action items completed within SLA | P1 |
| BC-6 | Trend visualization -- culture score over time by team and organization | P0 |
| BC-7 | Recommendations engine -- suggest specific improvements based on lowest sub-scores | P1 |
| BC-8 | Team comparison -- anonymized benchmarking across teams | P2 |
| BC-9 | Celebration highlights -- surface examples of excellent blameless practices | P1 |

### Acceptance Criteria
- Score updates automatically when new incidents or reviews are imported
- Sub-scores clearly explain what is measured and how to improve
- Language analysis does not surface individual names -- only aggregate patterns

---

## Non-Functional Requirements

| Category | Requirement |
|----------|------------|
| Performance | Dashboard loads in < 2s for 50K incidents |
| Accessibility | WCAG 2.1 AA compliance |
| Security | No incident data leaves the browser unless explicitly exported; API keys encrypted at rest |
| Privacy | No PII displayed by default; anonymization mode available |
| Browser Support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| Mobile | Responsive design; core dashboards usable on tablet |

## Milestones

| Phase | Features | Target |
|-------|----------|--------|
| MVP | Landing Page, Incident Importer, MTTR/MTTA Dashboard | Phase 1 |
| Intelligence | Pattern Detection, Incident Predictor | Phase 2 |
| Automation | Runbook Generator, Systemic Weakness Map | Phase 3 |
| Culture | Blameless Culture Scorecard | Phase 4 |
