# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 app for finding Hari Raya prayer sessions in Singapore. Users can search, filter, and sort prayer venues by district, time, language, crowdedness, and distance from their postal code.

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint check
- No test suite configured

## Architecture

**Stack**: Next.js 15 (App Router), TypeScript, React 18, Tailwind CSS, shadcn/ui

**Data flow**: Static JSON (`data/prayer-sessions.json`) → client-side filtering/sorting in `app/page.tsx` → paginated card list (6 per page). All filter/sort logic runs client-side with React hooks — no database or external data fetching for prayer data.

**Key files**:
- `app/page.tsx` — Main page, owns all filter/sort state, "use client" component
- `app/api/geocode/route.ts` — Server route proxying OneMap API for postal code → lat/lng geocoding (with in-memory token caching)
- `data/prayer-sessions.json` — Source of truth for all prayer session data
- `types/prayer-session.ts` — `PrayerSession` and `Session` interfaces
- `lib/utils.ts` — `cn()` class merge utility and `calculateDistance()` Haversine function
- `components/filter-panel.tsx` — Search and filter controls
- `components/sort-panel.tsx` — Distance sorting with postal code input
- `components/prayer-session-card.tsx` — Individual venue card
- `components/prayer-session-list.tsx` — Paginated list rendering
- `components/ui/` — shadcn/ui components (do not manually edit)

## Conventions

- Path alias `@/*` maps to project root
- Client components use `"use client"` pragma; keep server components where possible
- District badges are color-coded: blue=North, red=South, green=East, orange=West
- Brand colors: primary purple `#6B46C1`, light `#8B5CF6`, dark `#4C1D95`
- `next.config.mjs` ignores ESLint/TypeScript build errors and uses unoptimized images

## Environment Variables

- `ONEMAP_EMAIL` / `ONEMAP_PASSWORD` — OneMap API credentials for geocoding
- `NEXT_PUBLIC_GA_ID` — Google Analytics measurement ID
