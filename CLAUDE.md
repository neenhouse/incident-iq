# IncidentIQ -- Root CLAUDE.md

Incident pattern intelligence platform. Import incident history, detect patterns, predict future incidents, auto-generate runbooks, track MTTR/MTTA trends, identify systemic weaknesses, and score blameless culture adoption.

## Documentation Hierarchy

```
CLAUDE.md                  (this file -- root authority, tech stack, commands, team)
  .claude/CLAUDE.md        (agent instructions, conventions, project structure)
  docs/vision.md           (north star vision and design principles)
  docs/prd.md              (product requirements -- 8 core features)
  docs/specs/              (technical specs)
  docs/research/           (research and exploration notes)
```

When documents conflict, resolve by walking up the chain.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, React Router |
| Styling | CSS custom properties (design system) |
| Backend | Cloudflare Workers |
| Deploy | Cloudflare Pages via GitHub Actions |
| Testing | Vitest + React Testing Library |
| Tooling | pnpm (package manager), mise (runtime versions) |

## Dev Commands

```bash
pnpm dev           # Start dev server (port 3000)
pnpm build         # TypeScript check + Vite production build
pnpm test          # Run Vitest
pnpm lint          # ESLint
pnpm lint:fix      # ESLint with auto-fix
pnpm format        # Prettier
pnpm analyze       # Bundle visualizer
pnpm deploy        # Build + deploy to Cloudflare Pages
```

## Conventions

- Use **pnpm** as package manager (never npm or yarn)
- Use **mise** for runtime versions (see `.mise.toml`)
- CSS custom properties for theming (defined in `src/index.css`)
- React.lazy + Suspense for route-level code splitting
- Tests live next to source files (`Component.test.tsx`)
- Named exports preferred over default exports
- Feature-based directory structure under `src/features/`

## Agent Team Roles

Six agents defined in `.claude/agents/`:

| Agent | Role | Scope | Writes Code |
|-------|------|-------|-------------|
| `ceo` | Strategic leadership, vision, priorities | Strategy docs | No |
| `team-lead` | Orchestrator -- decomposes, delegates, monitors | Task management | No |
| `frontend-dev` | React, CSS, components, pages, visualizations | `src/` | Yes |
| `backend-dev` | Cloudflare Workers, APIs, data processing | `worker/` | Yes |
| `content-writer` | Copy, messaging, SEO, meta tags | Text content | No |
| `qa` | Testing, accessibility, performance | Tests + read-only | Yes (tests) |

## Single Source of Truth

| Concern | Source File |
|---------|------------|
| Vision and design principles | `docs/vision.md` |
| Product requirements | `docs/prd.md` |
| Runtime versions | `.mise.toml` |
| CSS design tokens (live) | `src/index.css` |
| Route definitions | `src/App.tsx` |

## Project Structure

```
src/
  pages/             Route-level components
  components/
    ui/              Reusable UI components
    charts/          Data visualization components
    layout/          Layout components (Header, Footer, Sidebar)
  features/
    incidents/       Incident data import and management
    patterns/        Pattern detection engine
    predictions/     Incident predictor with risk scoring
    runbooks/        Runbook auto-generator
    analytics/       MTTR/MTTA analytics dashboard
    weaknesses/      Systemic weakness map
    culture/         Blameless culture scorecard
  hooks/             Custom React hooks
  lib/               Utilities and helpers
  types/             Shared TypeScript types
worker/
  routes/            API endpoints
docs/
  specs/             Technical specs
  research/          Research and exploration notes
public/
  assets/            Static assets
```
