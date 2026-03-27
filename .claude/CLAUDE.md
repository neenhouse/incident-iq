# IncidentIQ -- Agent Instructions

## Project Overview
IncidentIQ is an incident pattern intelligence platform. It transforms raw incident history into actionable intelligence through pattern detection, predictions, automated runbooks, and analytics.

## Conventions
- Feature code lives in `src/features/<feature-name>/`
- Shared components in `src/components/ui/`, `src/components/charts/`, `src/components/layout/`
- Types in `src/types/`
- Hooks in `src/hooks/`
- Utilities in `src/lib/`
- Backend routes in `worker/routes/`
- Tests next to source files (`*.test.tsx`)
- Named exports preferred
- CSS custom properties for all theming (see `src/index.css`)
- Use React.lazy + Suspense for route-level code splitting

## Key Files
- `src/App.tsx` -- Route definitions
- `src/types/incident.ts` -- Core domain types
- `src/index.css` -- Design tokens
- `docs/prd.md` -- Feature requirements (8 features)
- `docs/vision.md` -- Product vision and design principles
