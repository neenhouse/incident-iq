import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ImportPage = lazy(() => import('./pages/ImportPage'))

export function App() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/import" element={<ImportPage />} />
      </Routes>
    </Suspense>
  )
}
