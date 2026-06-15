# Project Context

This repo is a Next.js App Router prototype for `flykyte`, a drone loaning, flight readiness, and fleet management app.

The current app is intentionally self-contained:

- primary UI lives in `components/flykyte/flykyte-app.tsx`
- demo data lives in `lib/flykyte-data.ts`
- app routes render the same flykyte surface while the product shape is being established
- shadcn-style primitives live in `components/ui`
- Tailwind theme tokens and global motion/background styles live in `app/globals.css`

# Product Direction

flykyte serves two points of view:

- User: loan an available drone, complete forceprep/execution/post-flight checks, track flight time, and manage profile competencies.
- Management: oversee drone inventory, personnel, flight logs, loans, damage reports, forecast, thresholds, and readiness risks.

Keep the product operational and task-first. This is a working tool, not a marketing site.

# UX And Visual Guidance

Follow the existing `instsig`-inspired shadcn language:

- restrained zinc/neutral palette
- dark mode by default
- compact operational cards
- clear borders, muted surfaces, and minimal accent color
- rounded controls consistent with existing UI primitives
- lucide icons in buttons, panels, and navigation
- responsive layouts that stay readable on mobile

Avoid:

- marketing hero sections
- decorative gradient/orb backgrounds
- loud palettes
- nested cards inside cards
- explanatory feature copy inside the app surface
- wide tables that break mobile layouts

# Core Workflows

## User Loan Flow

The main user action is loaning a drone.

Expected flow:

1. view available drones
2. select a drone
3. complete mission phases
4. track flight time
5. capture mission notes, defects, or incident reporting needs

Mission phases:

- Forceprep: pre-flight inspection, serial check, personnel currency, airspace clearance, JOD, 205 SQN link-up.
- Execution: controlling squadron call, active clearance/weather/JOD checks, take-off state, reserve tracking.
- Post: end-of-flight checks, damage inspection, damage report link, GSOC/ops room incident reporting.

## Management View

Management should be able to inspect:

- drone inventory: model, serial number, status, class, flight hours, threshold, flights
- personnel details and currency
- flight logs
- active loans
- damage reports
- forecast and weather risk

Use compact panels and scan-friendly rows. Keep statuses and thresholds visible without requiring drill-down.

## Profile And Competencies

The user profile should support:

- small, mini, and micro drone competencies
- safety compliance
- incident reporting currency
- expiry/action-needed states

# Data Model Notes

The prototype currently uses static data in `lib/flykyte-data.ts`. When adding persistence later, preserve the same domain language:

- drones
- personnel
- loans
- flight logs
- damage reports
- forecast
- profile competencies
- phase checklists

Prefer typed domain objects before wiring database-specific shapes into components.

# Important Files

- `app/page.tsx`
- `app/dashboard/page.tsx`
- `components/flykyte/flykyte-app.tsx`
- `lib/flykyte-data.ts`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/badge.tsx`
- `components/ui/checkbox.tsx`
- `app/globals.css`
- `tailwind.config.ts`

# Implementation Guidance

- Keep UI changes close to `components/flykyte/flykyte-app.tsx` until the app needs route-level separation.
- Add new mock data to `lib/flykyte-data.ts`.
- Reuse existing UI primitives before creating new ones.
- If introducing new interactive primitives, keep their API consistent with the local components, not assumptions from upstream shadcn.
- The local checkbox is a simple input wrapper and uses `onChange`, not Radix `onCheckedChange`.
- Keep app copy concise and operational.

# Verification

Before handoff after meaningful changes:

- run `npm run build`
- open `http://localhost:3000` if the dev server is running
- verify the user loan flow renders
- verify management mode renders at least one panel
- check mobile width for horizontal overflow when changing dense panels
