import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'

describe('App routing', () => {
  it('renders the landing page at /', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByText('Platform Capabilities')).toBeInTheDocument()
    expect(screen.getByText('Incident Intelligence Platform')).toBeInTheDocument()
  })

  it('renders the import page at /import', async () => {
    render(
      <MemoryRouter initialEntries={['/import']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByText('Import Incidents')).toBeInTheDocument()
    expect(screen.getByText('Sample Dataset')).toBeInTheDocument()
  })

  it('renders the patterns page at /patterns', async () => {
    render(
      <MemoryRouter initialEntries={['/patterns']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByText('Pattern Detection')).toBeInTheDocument()
  })

  it('renders the analytics page at /analytics', async () => {
    render(
      <MemoryRouter initialEntries={['/analytics']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByText('MTTR/MTTA Analytics')).toBeInTheDocument()
  })

  it('renders the culture score page at /culture', async () => {
    render(
      <MemoryRouter initialEntries={['/culture']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByText('Blameless Culture Scorecard')).toBeInTheDocument()
  })
})
