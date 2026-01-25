# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Golf shot calculator app built with Expo (SDK 54) and React Native. Features:
- Shot distance calculator with environmental adjustments
- Wind calculator with compass integration (premium feature)
- Weather data from Open-Meteo API
- Supabase backend

## Commands

```bash
# Development
npm run dev              # Start Expo dev server (EXPO_NO_TELEMETRY=1)

# Build
npm run build:web        # Export web build

# Quality
npm run lint             # ESLint
npm run typecheck        # TypeScript check (tsc --noEmit)
```

## Architecture

### Directory Structure
```
app/                     # Expo Router screens (file-based routing)
  (tabs)/               # Tab navigation group
    index.tsx           # Shot calculator (main screen)
    wind.tsx            # Wind calculator (premium)
    settings.tsx        # User settings
src/
  core/
    models/             # Physics models (YardageModelEnhanced)
    services/           # Environmental & wind calculations
  contexts/             # React contexts (Weather, ClubBag, UserPreferences)
  components/           # Reusable UI (CompassDisplay, WeatherCard)
  features/             # Feature-specific code
  services/             # External services (weather-service.ts)
  lib/                  # Supabase client
  constants/theme.ts    # Design tokens (colors, spacing, typography)
```

### Key Patterns

**Context Providers** - App wrapped in nested providers in `app/_layout.tsx`:
```
UserPreferencesProvider → ClubBagProvider → WeatherProvider → Stack
```

**Physics Engine** - `YardageModelEnhanced` in `src/core/models/yardagemodel.ts`:
- Club database with ball speed, launch angle, spin rates
- Air density calculations (Magnus equation)
- Wind gradient modeling
- Environmental factor calculations

**Wind Calculator** - `src/core/services/wind-calculator.ts`:
- Recursive club selection algorithm
- Error handling with typed `WindError` classes
- Adaptive convergence thresholds by distance

**Weather Service** - `src/services/weather-service.ts`:
- Open-Meteo API integration
- 5-minute cache with location-based invalidation
- Manual override support via AsyncStorage

### Path Aliases

`@/*` maps to project root (configured in `tsconfig.json`)

### Environment Variables

Required in `.env`:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Design System

Colors use dark theme tokens from `src/constants/theme.ts`:
- `primary`: #238636 (green, success states)
- `accent`: #c9a227 (gold, wind indicators)
- `error`: #f85149 (red)
- `background`: #0d1117, `surface`: #161b22
