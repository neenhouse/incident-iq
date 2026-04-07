import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const ImportPage = lazy(() => import('./pages/ImportPage'))
const PatternsPage = lazy(() => import('./pages/PatternsPage'))
const PredictionsPage = lazy(() => import('./pages/PredictionsPage'))
const RunbooksPage = lazy(() => import('./pages/RunbooksPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const WeaknessMapPage = lazy(() => import('./pages/WeaknessMapPage'))
const CultureScorePage = lazy(() => import('./pages/CultureScorePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AppLayout />}>
            <Route path="/import" element={<ImportPage />} />
            <Route path="/patterns" element={<PatternsPage />} />
            <Route path="/predictions" element={<PredictionsPage />} />
            <Route path="/runbooks" element={<RunbooksPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/weaknesses" element={<WeaknessMapPage />} />
            <Route path="/culture" element={<CultureScorePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
