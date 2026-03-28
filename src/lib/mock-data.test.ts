import { describe, it, expect } from 'vitest'
import {
  mockIncidents,
  mockPatterns,
  mockPredictions,
  mockRunbooks,
  mockCultureScores,
  mockMetricsSnapshots,
  mockWeaknessMap,
  SERVICES,
} from './mock-data'

describe('Mock data generation', () => {
  it('generates exactly 50 incidents', () => {
    expect(mockIncidents).toHaveLength(50)
  })

  it('generates incidents across all 8 services', () => {
    const services = new Set(mockIncidents.map((inc) => inc.service))
    expect(services.size).toBe(SERVICES.length)
    for (const service of SERVICES) {
      expect(services.has(service)).toBe(true)
    }
  })

  it('generates incidents over 6 months (Sep 2025 - Mar 2026)', () => {
    const dates = mockIncidents.map((inc) => new Date(inc.started_at))
    const earliest = new Date(Math.min(...dates.map((d) => d.getTime())))
    const latest = new Date(Math.max(...dates.map((d) => d.getTime())))

    expect(earliest.getFullYear()).toBe(2025)
    expect(latest.getFullYear()).toBe(2026)
  })

  it('generates incidents sorted by started_at', () => {
    for (let i = 1; i < mockIncidents.length; i++) {
      const prev = new Date(mockIncidents[i - 1].started_at).getTime()
      const curr = new Date(mockIncidents[i].started_at).getTime()
      expect(curr).toBeGreaterThanOrEqual(prev)
    }
  })

  it('includes all severity levels', () => {
    const severities = new Set(mockIncidents.map((inc) => inc.severity))
    expect(severities.has('critical')).toBe(true)
    expect(severities.has('high')).toBe(true)
    expect(severities.has('medium')).toBe(true)
    expect(severities.has('low')).toBe(true)
  })

  it('generates patterns with valid confidence scores', () => {
    expect(mockPatterns.length).toBeGreaterThan(0)
    for (const pattern of mockPatterns) {
      expect(pattern.confidence).toBeGreaterThanOrEqual(0)
      expect(pattern.confidence).toBeLessThanOrEqual(100)
      expect(pattern.services.length).toBeGreaterThan(0)
    }
  })

  it('generates predictions for all services', () => {
    expect(mockPredictions).toHaveLength(SERVICES.length)
    const predServices = new Set(mockPredictions.map((p) => p.service))
    for (const service of SERVICES) {
      expect(predServices.has(service)).toBe(true)
    }
  })

  it('generates runbooks with resolution steps', () => {
    expect(mockRunbooks.length).toBeGreaterThan(0)
    for (const runbook of mockRunbooks) {
      expect(runbook.resolution_steps.length).toBeGreaterThan(0)
      expect(runbook.diagnostic_steps.length).toBeGreaterThan(0)
      expect(runbook.symptoms.length).toBeGreaterThan(0)
    }
  })

  it('generates 6 months of culture scores', () => {
    expect(mockCultureScores).toHaveLength(6)
    for (const score of mockCultureScores) {
      expect(score.overall).toBeGreaterThan(0)
      expect(score.overall).toBeLessThanOrEqual(100)
      expect(score.grade).toBeTruthy()
    }
  })

  it('generates 6 months of metrics snapshots', () => {
    expect(mockMetricsSnapshots).toHaveLength(6)
    for (const snapshot of mockMetricsSnapshots) {
      expect(snapshot.mttr_minutes).toBeGreaterThan(0)
      expect(snapshot.mtta_minutes).toBeGreaterThan(0)
    }
  })

  it('generates weakness map for all 8 services', () => {
    expect(mockWeaknessMap).toHaveLength(8)
    for (const node of mockWeaknessMap) {
      expect(node.score).toBeGreaterThan(0)
      expect(node.score).toBeLessThanOrEqual(100)
      expect(node.topIssue).toBeTruthy()
    }
  })
})
