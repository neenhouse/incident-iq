import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'

describe('App', () => {
  it('renders the landing page at /', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByText('IncidentIQ')).toBeInTheDocument()
    expect(screen.getByText('Platform Capabilities')).toBeInTheDocument()
  })
})
