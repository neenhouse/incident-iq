import type {
  Incident,
  Severity,
  IncidentStatus,
  Pattern,
  Prediction,
  Runbook,
  CultureScore,
  MetricsSnapshot,
} from '../types/incident'

// 8 services
const SERVICES = [
  'api-gateway',
  'auth-service',
  'payment-service',
  'user-service',
  'notification-service',
  'search-service',
  'database-primary',
  'cdn-edge',
] as const

const SERVICE_TEAM_MAP: Record<string, string> = {
  'api-gateway': 'Platform',
  'auth-service': 'Identity',
  'payment-service': 'Payments',
  'user-service': 'Core',
  'notification-service': 'Messaging',
  'search-service': 'Search',
  'database-primary': 'Data',
  'cdn-edge': 'Infrastructure',
}

const ROOT_CAUSES = [
  'Memory leak in connection pool',
  'Certificate expiration',
  'Deployment regression',
  'Traffic spike beyond autoscaling limits',
  'Database connection pool exhaustion',
  'DNS resolution failure',
  'Cache invalidation storm',
  'Third-party API rate limiting',
  'Disk space exhaustion on logging volume',
  'Kubernetes pod OOMKill',
  'Network partition between availability zones',
  'Configuration drift after deploy',
  'SSL/TLS handshake timeout',
  'Queue backlog overflow',
  'Deadlock in transaction processing',
]

const RESOLUTIONS = [
  'Restarted affected pods and increased connection pool limit',
  'Renewed and rotated SSL certificates',
  'Rolled back to previous deployment version',
  'Scaled up instances and adjusted autoscaling thresholds',
  'Increased database connection pool size and added connection timeout',
  'Switched to backup DNS provider',
  'Implemented gradual cache warming strategy',
  'Added circuit breaker for third-party API calls',
  'Expanded logging volume and added log rotation',
  'Increased memory limits and optimized garbage collection',
  'Rerouted traffic to secondary AZ',
  'Synced configuration and added drift detection',
  'Updated TLS configuration and increased timeout',
  'Scaled queue consumers and increased queue capacity',
  'Fixed transaction isolation level and added deadlock retry',
]

const TAGS_POOL = [
  'deployment',
  'scaling',
  'network',
  'database',
  'security',
  'performance',
  'availability',
  'latency',
  'memory',
  'disk',
  'dns',
  'cache',
  'queue',
  'certificate',
  'config',
]

// Seeded random for deterministic data
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rand = seededRandom(42)

function randomItems<T>(arr: readonly T[], min: number, max: number): T[] {
  const count = min + Math.floor(rand() * (max - min + 1))
  const shuffled = [...arr].sort(() => rand() - 0.5)
  return shuffled.slice(0, count)
}

function randomDate(start: Date, end: Date): Date {
  const time = start.getTime() + rand() * (end.getTime() - start.getTime())
  return new Date(time)
}

function minutesToMs(min: number): number {
  return min * 60 * 1000
}

// Generate 50 incidents across 8 services over 6 months
function generateIncidents(): Incident[] {
  const incidents: Incident[] = []
  const startDate = new Date('2025-09-15T00:00:00Z')
  const endDate = new Date('2026-03-15T00:00:00Z')

  const severities: Severity[] = ['critical', 'high', 'medium', 'low']
  const severityWeights = [0.12, 0.28, 0.38, 0.22]

  for (let i = 0; i < 50; i++) {
    const service = SERVICES[i % SERVICES.length]
    const team = SERVICE_TEAM_MAP[service]

    // Weighted severity
    const r = rand()
    let severity: Severity = 'medium'
    let cumulative = 0
    for (let j = 0; j < severityWeights.length; j++) {
      cumulative += severityWeights[j]
      if (r <= cumulative) {
        severity = severities[j]
        break
      }
    }

    const startedAt = randomDate(startDate, endDate)

    // MTTA: 2-30 minutes
    const mttaMinutes = 2 + rand() * 28
    const acknowledgedAt = new Date(
      startedAt.getTime() + minutesToMs(mttaMinutes)
    )

    // MTTR: 15 minutes - 6 hours depending on severity
    const severityMultiplier =
      severity === 'critical'
        ? 3
        : severity === 'high'
          ? 2
          : severity === 'medium'
            ? 1.2
            : 0.8
    const mttrMinutes = (15 + rand() * 180) * severityMultiplier
    const resolvedAt = new Date(
      startedAt.getTime() + minutesToMs(mttrMinutes)
    )

    // Most are resolved; a few open/acknowledged
    let status: IncidentStatus = 'resolved'
    if (i >= 47) status = 'open'
    else if (i >= 45) status = 'acknowledged'

    const rootCauseIdx = Math.floor(rand() * ROOT_CAUSES.length)

    incidents.push({
      id: `INC-${String(i + 1).padStart(4, '0')}`,
      title: `${service}: ${ROOT_CAUSES[rootCauseIdx].toLowerCase()}`,
      severity,
      status,
      service,
      team,
      started_at: startedAt.toISOString(),
      acknowledged_at: acknowledgedAt.toISOString(),
      resolved_at:
        status === 'resolved' ? resolvedAt.toISOString() : undefined,
      root_cause: ROOT_CAUSES[rootCauseIdx],
      resolution:
        status === 'resolved'
          ? RESOLUTIONS[rootCauseIdx % RESOLUTIONS.length]
          : undefined,
      tags: randomItems(TAGS_POOL, 1, 4),
      source: 'pagerduty',
      imported_at: new Date().toISOString(),
    })
  }

  // Sort by started_at
  incidents.sort(
    (a, b) =>
      new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
  )

  return incidents
}

// Generate patterns from incident data
function generatePatterns(): Pattern[] {
  return [
    {
      id: 'PAT-001',
      name: 'API Gateway Monday 2AM Failures',
      description:
        'API gateway experiences connection pool exhaustion every Monday around 2:00 AM UTC, coinciding with weekly batch job execution.',
      confidence: 92,
      incident_count: 7,
      services: ['api-gateway', 'database-primary'],
      recurrence_type: 'weekly',
      last_seen: '2026-03-10T02:15:00Z',
      example_incidents: ['INC-0003', 'INC-0011', 'INC-0019'],
    },
    {
      id: 'PAT-002',
      name: 'Database Timeouts After Deploys',
      description:
        'Database connection timeouts spike within 30 minutes of deployment events, suggesting connection pool misconfiguration in new releases.',
      confidence: 87,
      incident_count: 9,
      services: ['database-primary', 'api-gateway', 'user-service'],
      recurrence_type: 'deploy-correlated',
      last_seen: '2026-03-12T14:30:00Z',
      example_incidents: ['INC-0005', 'INC-0014', 'INC-0028'],
    },
    {
      id: 'PAT-003',
      name: 'Payment Service Peak Hour Degradation',
      description:
        'Payment processing latency exceeds SLA during peak hours (11 AM - 2 PM EST) on business days, linked to concurrent transaction volume.',
      confidence: 78,
      incident_count: 5,
      services: ['payment-service', 'database-primary'],
      recurrence_type: 'daily',
      last_seen: '2026-03-14T17:00:00Z',
      example_incidents: ['INC-0008', 'INC-0022', 'INC-0035'],
    },
    {
      id: 'PAT-004',
      name: 'Auth Service Certificate Rotation Failures',
      description:
        'Auth service TLS certificate renewal fails on the 15th of each month when the automated rotation job encounters expired intermediate CAs.',
      confidence: 95,
      incident_count: 4,
      services: ['auth-service'],
      recurrence_type: 'monthly',
      last_seen: '2026-02-15T08:00:00Z',
      example_incidents: ['INC-0012', 'INC-0024'],
    },
    {
      id: 'PAT-005',
      name: 'CDN Cache Invalidation Storms',
      description:
        'CDN edge nodes experience cache stampede after large-scale content updates, overwhelming origin servers.',
      confidence: 71,
      incident_count: 3,
      services: ['cdn-edge', 'api-gateway'],
      recurrence_type: 'irregular',
      last_seen: '2026-03-08T09:45:00Z',
      example_incidents: ['INC-0017', 'INC-0033'],
    },
    {
      id: 'PAT-006',
      name: 'Notification Queue Backlog Overflow',
      description:
        'Notification service queue exceeds capacity during promotional campaigns, causing message delays and drops.',
      confidence: 83,
      incident_count: 6,
      services: ['notification-service', 'user-service'],
      recurrence_type: 'irregular',
      last_seen: '2026-03-05T16:20:00Z',
      example_incidents: ['INC-0010', 'INC-0025', 'INC-0040'],
    },
    {
      id: 'PAT-007',
      name: 'Search Indexing Memory Leaks',
      description:
        'Search service pods hit OOM limits after 72 hours of continuous indexing, requiring periodic restarts.',
      confidence: 88,
      incident_count: 5,
      services: ['search-service'],
      recurrence_type: 'weekly',
      last_seen: '2026-03-13T03:00:00Z',
      example_incidents: ['INC-0015', 'INC-0030', 'INC-0042'],
    },
  ]
}

// Generate predictions
function generatePredictions(): Prediction[] {
  return SERVICES.map((service, i) => {
    const riskScore = Math.round(30 + rand() * 60)
    const probability = Math.round(20 + rand() * 70)
    const now = new Date('2026-03-27')
    const windowStart = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
    const windowEnd = new Date(windowStart.getTime() + 7 * 24 * 60 * 60 * 1000)

    const factors = [
      'Historical pattern recurrence',
      'Recent deployment activity',
      'Increasing error rate trend',
      'Approaching certificate expiry',
      'Traffic volume projection',
      'Dependency health degradation',
    ]

    return {
      id: `PRED-${String(i + 1).padStart(3, '0')}`,
      service,
      risk_score: riskScore,
      probability,
      window_start: windowStart.toISOString(),
      window_end: windowEnd.toISOString(),
      contributing_factors: randomItems(factors, 2, 4),
      related_patterns: [`PAT-${String((i % 7) + 1).padStart(3, '0')}`],
    }
  })
}

// Generate runbooks
function generateRunbooks(): Runbook[] {
  return [
    {
      id: 'RB-001',
      title: 'API Gateway Connection Pool Recovery',
      service: 'api-gateway',
      symptoms: [
        '5xx error rate exceeds 5%',
        'Connection timeout errors in logs',
        'Upstream healthcheck failures',
      ],
      diagnostic_steps: [
        'Check current connection pool utilization: `kubectl exec -it api-gateway -- curl localhost:8080/metrics | grep pool`',
        'Review recent deployment history: `kubectl rollout history deployment/api-gateway`',
        'Check database connection count: `SELECT count(*) FROM pg_stat_activity`',
        'Verify no long-running queries: `SELECT * FROM pg_stat_activity WHERE state = \'active\' AND duration > interval \'30 seconds\'`',
      ],
      resolution_steps: [
        'Scale up api-gateway pods: `kubectl scale deployment/api-gateway --replicas=6`',
        'Restart affected pods gracefully: `kubectl rollout restart deployment/api-gateway`',
        'If DB connections exhausted, kill idle connections: `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = \'idle\' AND duration > interval \'10 minutes\'`',
        'Increase connection pool limit in config: update `MAX_POOL_SIZE` from 20 to 50',
        'Monitor error rate for 15 minutes to confirm resolution',
      ],
      escalation_path: [
        'On-call Platform engineer',
        'Platform team lead',
        'VP Engineering (if P0 > 30min)',
      ],
      related_incidents: ['INC-0003', 'INC-0011', 'INC-0019'],
      version: 3,
      created_at: '2025-11-01T10:00:00Z',
      updated_at: '2026-03-10T14:30:00Z',
    },
    {
      id: 'RB-002',
      title: 'Database Connection Timeout After Deploy',
      service: 'database-primary',
      symptoms: [
        'Multiple services report connection timeouts simultaneously',
        'Spike in 503 errors across API endpoints',
        'Recent deployment within last 30 minutes',
      ],
      diagnostic_steps: [
        'Identify the recent deployment: `kubectl get events --sort-by=.metadata.creationTimestamp | tail -20`',
        'Check connection pool metrics across all services',
        'Compare current DB connection count vs. baseline',
        'Review deployment diff for connection-related config changes',
      ],
      resolution_steps: [
        'Roll back the recent deployment: `kubectl rollout undo deployment/<service>`',
        'Drain existing connections: restart consumer pods one at a time',
        'Verify connection pool settings in the new release',
        'Fix config and redeploy with corrected pool settings',
        'Add connection pool validation to CI/CD pipeline',
      ],
      escalation_path: [
        'On-call Data engineer',
        'DBA on-call',
        'Data team lead',
      ],
      related_incidents: ['INC-0005', 'INC-0014', 'INC-0028'],
      version: 2,
      created_at: '2025-12-15T09:00:00Z',
      updated_at: '2026-03-12T16:00:00Z',
    },
    {
      id: 'RB-003',
      title: 'Auth Service Certificate Renewal',
      service: 'auth-service',
      symptoms: [
        'TLS handshake failures',
        'Authentication API returns 502',
        'Certificate expiry warnings in monitoring',
      ],
      diagnostic_steps: [
        'Check certificate expiry: `openssl s_client -connect auth-service:443 | openssl x509 -noout -dates`',
        'Verify cert-manager status: `kubectl get certificate -n auth`',
        'Check intermediate CA validity',
        'Review cert-manager logs for renewal errors',
      ],
      resolution_steps: [
        'Force certificate renewal: `kubectl delete certificate auth-tls -n auth && kubectl apply -f auth-tls-cert.yaml`',
        'If intermediate CA expired, update CA bundle in trust store',
        'Restart auth-service pods to pick up new cert',
        'Verify TLS with: `curl -vI https://auth-service.internal`',
        'Update monitoring to alert 30 days before expiry',
      ],
      escalation_path: [
        'On-call Identity engineer',
        'Security team',
        'Identity team lead',
      ],
      related_incidents: ['INC-0012', 'INC-0024'],
      version: 4,
      created_at: '2025-10-20T11:00:00Z',
      updated_at: '2026-02-15T10:00:00Z',
    },
    {
      id: 'RB-004',
      title: 'Payment Service Peak Hour Degradation',
      service: 'payment-service',
      symptoms: [
        'Payment processing latency > 5s during peak hours',
        'Transaction timeout errors',
        'Queue depth increasing steadily',
      ],
      diagnostic_steps: [
        'Check current transaction rate vs. capacity',
        'Monitor DB query performance: slow query log',
        'Verify payment gateway API response times',
        'Check if horizontal pod autoscaler is functioning',
      ],
      resolution_steps: [
        'Manually scale payment-service to 10 replicas',
        'Enable read replicas for payment history queries',
        'Activate rate limiting for non-critical payment endpoints',
        'Increase HPA max replicas for peak hours',
        'Consider pre-scaling before known peak windows',
      ],
      escalation_path: [
        'On-call Payments engineer',
        'Payments team lead',
        'CTO (if revenue impact > $10k)',
      ],
      related_incidents: ['INC-0008', 'INC-0022', 'INC-0035'],
      version: 2,
      created_at: '2026-01-05T14:00:00Z',
      updated_at: '2026-03-14T18:00:00Z',
    },
    {
      id: 'RB-005',
      title: 'Notification Queue Overflow Recovery',
      service: 'notification-service',
      symptoms: [
        'Notification delivery delays > 5 minutes',
        'Queue depth exceeds 100k messages',
        'Consumer lag alert triggered',
      ],
      diagnostic_steps: [
        'Check queue depth and consumer count',
        'Identify if promotional campaign is running',
        'Verify consumer health and processing rate',
        'Check for poison messages in dead letter queue',
      ],
      resolution_steps: [
        'Scale notification consumers: increase replicas to 20',
        'Enable priority queue: route critical notifications first',
        'Pause non-critical batch notifications temporarily',
        'Clear DLQ after investigating poison messages',
        'Implement backpressure mechanism for campaign sends',
      ],
      escalation_path: [
        'On-call Messaging engineer',
        'Messaging team lead',
        'Product team (to pause campaigns)',
      ],
      related_incidents: ['INC-0010', 'INC-0025', 'INC-0040'],
      version: 1,
      created_at: '2026-02-01T12:00:00Z',
      updated_at: '2026-03-05T17:00:00Z',
    },
  ]
}

// Culture scores over 6 months
function generateCultureScores(): CultureScore[] {
  return [
    {
      overall: 58,
      grade: 'C+',
      sub_scores: {
        root_cause_depth: 52,
        action_item_followthrough: 45,
        review_timeliness: 65,
        language_tone: 70,
        learning_extraction: 58,
      },
      trend: 'stable',
      period: '2025-10',
    },
    {
      overall: 62,
      grade: 'B-',
      sub_scores: {
        root_cause_depth: 58,
        action_item_followthrough: 50,
        review_timeliness: 68,
        language_tone: 72,
        learning_extraction: 62,
      },
      trend: 'improving',
      period: '2025-11',
    },
    {
      overall: 65,
      grade: 'B-',
      sub_scores: {
        root_cause_depth: 62,
        action_item_followthrough: 55,
        review_timeliness: 70,
        language_tone: 74,
        learning_extraction: 64,
      },
      trend: 'improving',
      period: '2025-12',
    },
    {
      overall: 68,
      grade: 'B',
      sub_scores: {
        root_cause_depth: 66,
        action_item_followthrough: 58,
        review_timeliness: 72,
        language_tone: 78,
        learning_extraction: 66,
      },
      trend: 'improving',
      period: '2026-01',
    },
    {
      overall: 71,
      grade: 'B',
      sub_scores: {
        root_cause_depth: 68,
        action_item_followthrough: 62,
        review_timeliness: 75,
        language_tone: 80,
        learning_extraction: 70,
      },
      trend: 'improving',
      period: '2026-02',
    },
    {
      overall: 74,
      grade: 'B+',
      sub_scores: {
        root_cause_depth: 72,
        action_item_followthrough: 65,
        review_timeliness: 78,
        language_tone: 82,
        learning_extraction: 73,
      },
      trend: 'improving',
      period: '2026-03',
    },
  ]
}

// Monthly metrics snapshots
function generateMetricsSnapshots(): MetricsSnapshot[] {
  return [
    {
      mttr_minutes: 145,
      mtta_minutes: 18,
      incident_count: 12,
      period: '2025-10',
      by_severity: { critical: 2, high: 3, medium: 5, low: 2 },
      by_service: {
        'api-gateway': 3,
        'auth-service': 2,
        'payment-service': 2,
        'database-primary': 2,
        'notification-service': 1,
        'search-service': 1,
        'user-service': 1,
        'cdn-edge': 0,
      },
    },
    {
      mttr_minutes: 132,
      mtta_minutes: 15,
      incident_count: 10,
      period: '2025-11',
      by_severity: { critical: 1, high: 3, medium: 4, low: 2 },
      by_service: {
        'api-gateway': 2,
        'auth-service': 1,
        'payment-service': 2,
        'database-primary': 2,
        'notification-service': 1,
        'search-service': 1,
        'user-service': 1,
        'cdn-edge': 0,
      },
    },
    {
      mttr_minutes: 118,
      mtta_minutes: 12,
      incident_count: 8,
      period: '2025-12',
      by_severity: { critical: 1, high: 2, medium: 3, low: 2 },
      by_service: {
        'api-gateway': 2,
        'auth-service': 1,
        'payment-service': 1,
        'database-primary': 1,
        'notification-service': 1,
        'search-service': 1,
        'user-service': 0,
        'cdn-edge': 1,
      },
    },
    {
      mttr_minutes: 105,
      mtta_minutes: 10,
      incident_count: 7,
      period: '2026-01',
      by_severity: { critical: 0, high: 2, medium: 3, low: 2 },
      by_service: {
        'api-gateway': 1,
        'auth-service': 1,
        'payment-service': 1,
        'database-primary': 1,
        'notification-service': 1,
        'search-service': 1,
        'user-service': 0,
        'cdn-edge': 1,
      },
    },
    {
      mttr_minutes: 95,
      mtta_minutes: 9,
      incident_count: 8,
      period: '2026-02',
      by_severity: { critical: 1, high: 2, medium: 3, low: 2 },
      by_service: {
        'api-gateway': 2,
        'auth-service': 1,
        'payment-service': 1,
        'database-primary': 1,
        'notification-service': 1,
        'search-service': 1,
        'user-service': 0,
        'cdn-edge': 1,
      },
    },
    {
      mttr_minutes: 88,
      mtta_minutes: 8,
      incident_count: 5,
      period: '2026-03',
      by_severity: { critical: 0, high: 1, medium: 3, low: 1 },
      by_service: {
        'api-gateway': 1,
        'auth-service': 0,
        'payment-service': 1,
        'database-primary': 1,
        'notification-service': 1,
        'search-service': 0,
        'user-service': 1,
        'cdn-edge': 0,
      },
    },
  ]
}

// Weakness scores per service
export interface WeaknessNode {
  service: string
  score: number
  incidentCount: number
  avgMttr: number
  dependencies: string[]
  topIssue: string
}

function generateWeaknessMap(): WeaknessNode[] {
  return [
    {
      service: 'api-gateway',
      score: 82,
      incidentCount: 11,
      avgMttr: 125,
      dependencies: ['database-primary', 'auth-service', 'cdn-edge'],
      topIssue: 'Connection pool exhaustion under load',
    },
    {
      service: 'database-primary',
      score: 75,
      incidentCount: 8,
      avgMttr: 155,
      dependencies: [],
      topIssue: 'Connection storms after deployments',
    },
    {
      service: 'payment-service',
      score: 68,
      incidentCount: 7,
      avgMttr: 110,
      dependencies: ['database-primary', 'api-gateway'],
      topIssue: 'Peak hour capacity limitations',
    },
    {
      service: 'auth-service',
      score: 62,
      incidentCount: 5,
      avgMttr: 95,
      dependencies: ['database-primary'],
      topIssue: 'Certificate lifecycle management',
    },
    {
      service: 'notification-service',
      score: 55,
      incidentCount: 5,
      avgMttr: 80,
      dependencies: ['user-service', 'api-gateway'],
      topIssue: 'Queue capacity during campaigns',
    },
    {
      service: 'search-service',
      score: 48,
      incidentCount: 4,
      avgMttr: 70,
      dependencies: ['database-primary'],
      topIssue: 'Memory leaks in indexing pipeline',
    },
    {
      service: 'cdn-edge',
      score: 35,
      incidentCount: 3,
      avgMttr: 45,
      dependencies: ['api-gateway'],
      topIssue: 'Cache invalidation storms',
    },
    {
      service: 'user-service',
      score: 28,
      incidentCount: 2,
      avgMttr: 40,
      dependencies: ['database-primary', 'auth-service'],
      topIssue: 'Cascading failures from upstream',
    },
  ]
}

// Export sample JSON for the importer
export const SAMPLE_PAGERDUTY_JSON = {
  incidents: [
    {
      id: 'PD-10234',
      title: 'HIGH: api-gateway 5xx rate above threshold',
      urgency: 'high',
      status: 'resolved',
      service: { id: 'PSVC001', summary: 'api-gateway' },
      created_at: '2026-03-20T14:32:00Z',
      last_status_change_at: '2026-03-20T16:15:00Z',
      teams: [{ id: 'PT001', summary: 'Platform' }],
      description: 'API gateway returning 503 errors. Connection pool exhaustion detected.',
      resolve_reason: 'Restarted pods and increased connection pool limit from 20 to 50.',
    },
    {
      id: 'PD-10235',
      title: 'CRITICAL: database-primary connection timeout',
      urgency: 'critical',
      status: 'resolved',
      service: { id: 'PSVC002', summary: 'database-primary' },
      created_at: '2026-03-21T02:10:00Z',
      last_status_change_at: '2026-03-21T03:45:00Z',
      teams: [{ id: 'PT002', summary: 'Data' }],
      description: 'Primary database rejecting connections. Followed recent deployment.',
      resolve_reason: 'Rolled back deployment and fixed connection pool configuration.',
    },
    {
      id: 'PD-10236',
      title: 'MEDIUM: search-service latency degradation',
      urgency: 'medium',
      status: 'resolved',
      service: { id: 'PSVC003', summary: 'search-service' },
      created_at: '2026-03-22T10:05:00Z',
      last_status_change_at: '2026-03-22T11:20:00Z',
      teams: [{ id: 'PT003', summary: 'Search' }],
      description: 'Search queries timing out. Pod memory at 95%.',
      resolve_reason: 'Restarted pods. Increased memory limits and added GC tuning.',
    },
  ],
}

// All mock data exports
export const mockIncidents = generateIncidents()
export const mockPatterns = generatePatterns()
export const mockPredictions = generatePredictions()
export const mockRunbooks = generateRunbooks()
export const mockCultureScores = generateCultureScores()
export const mockMetricsSnapshots = generateMetricsSnapshots()
export const mockWeaknessMap = generateWeaknessMap()

export { SERVICES }
