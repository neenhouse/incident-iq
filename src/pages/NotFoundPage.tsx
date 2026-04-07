import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '4rem', fontWeight: 700, margin: 0, opacity: 0.15 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Page not found</h2>
      <p style={{ color: 'var(--text-muted, #888)', marginBottom: '1.5rem' }}>
        That page doesn't exist. Let's get you back on track.
      </p>
      <Link
        to="/"
        style={{
          padding: '0.5rem 1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--border)',
          background: 'var(--accent)',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '0.875rem',
        }}
      >
        Go home
      </Link>
    </div>
  )
}
