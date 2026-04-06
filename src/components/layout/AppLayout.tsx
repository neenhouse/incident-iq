import { NavLink, Outlet } from 'react-router-dom'
import './AppLayout.css'

const navItems = [
  { to: '/import', label: 'Import' },
  { to: '/patterns', label: 'Patterns' },
  { to: '/predictions', label: 'Predictions' },
  { to: '/runbooks', label: 'Runbooks' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/weaknesses', label: 'Weakness Map' },
  { to: '/culture', label: 'Culture Score' },
]

export function AppLayout() {
  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="app-header">
        <NavLink to="/" className="app-logo">
          <span className="logo-icon">&#9888;</span>
          <span className="logo-text">IncidentIQ</span>
        </NavLink>
        <nav className="app-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="main-content" className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
