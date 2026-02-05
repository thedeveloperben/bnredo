# Architecture Documentation

This document describes the technical architecture of the AI Caddy Pro application.

## 🏗️ High-Level Architecture

AI Caddy Pro is built using a modern, modular React Native architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer (Screens)                    │
│  Shot Calculator | Wind Calculator | Settings                │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Context Layer (State Management)                │
│  Auth | Weather | UserPreferences | ClubBag                 │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Business Logic Layer                       │
│  Physics Models | Wind Calculator | Environmental Calcs      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Services Layer                             │
│  Weather API | Supabase | Location | Compass                │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
/
├── app/                          # Expo Router - File-based navigation
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx          # Tab navigator configuration
│   │   ├── index.tsx            # Shot Calculator (Home)
│   │   ├── wind.tsx             # Wind Calculator (Premium)
│   │   └── settings.tsx         # Settings & Club Manager
│   ├── _layout.tsx              # Root layout with providers
│   └── +not-found.tsx           # 404 error page
│
├── src/
│   ├── core/                    # Core business logic
│   │   ├── models/
│   │   │   └── yardagemodel.ts  # Physics engine
│   │   └── services/
│   │       ├── wind-calculator.ts
│   │       └── environmental-calculations.ts
│   │
│   ├── contexts/                # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── WeatherContext.tsx
│   │   ├── UserPreferencesContext.tsx
│   │   └── ClubBagContext.tsx
│   │
│   ├── components/              # Reusable UI components
│   │   ├── WeatherCard.tsx
│   │   ├── CompassDisplay.tsx
│   │   ├── WindResultsModal.tsx
│   │   └── ui/                  # Base UI components
│   │       ├── GlassCard.tsx
│   │       ├── GradientButton.tsx
│   │       ├── Skeleton.tsx
│   │       └── AnimatedCollapsible.tsx
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useCompassHeading.ts
│   │   ├── useInterpolatedHeading.ts
│   │   ├── useHapticSlider.ts
│   │   └── useReduceMotion.ts
│   │
│   ├── services/                # External service integrations
│   │   ├── weather/             # Weather service layer
│   │   │   ├── index.ts         # Public API
│   │   │   ├── types.ts         # Type definitions
│   │   │   ├── provider-orchestrator.ts
│   │   │   ├── openmeteo-adapter.ts
│   │   │   ├── tomorrow-adapter.ts
│   │   │   ├── cache-manager.ts
│   │   │   ├── circuit-breaker.ts
│   │   │   └── retry-strategy.ts
│   │   └── weather-service.ts   # Legacy utilities
│   │
│   ├── features/                # Feature-specific code
│   │   ├── settings/utils/
│   │   │   └── club-mapping.ts
│   │   └── wind/utils/
│   │       ├── wind-colors.ts
│   │       └── wind-error-handler.ts
│   │
│   ├── constants/               # App-wide constants
│   │   └── theme.ts            # Design system tokens
│   │
│   ├── utils/                   # Utility functions
│   │   ├── unit-conversions.ts
│   │   └── clubs.ts
│   │
│   ├── lib/                     # Third-party library configs
│   │   └── supabase.ts
│   │
│   └── __tests__/              # Jest unit tests
│
├── assets/                      # Static assets
├── supabase/                    # Supabase migrations & types
└── hooks/                       # Expo lifecycle hooks
```

## 🎯 Design Patterns

### 1. Context Provider Pattern

All global state is managed through React Context providers, wrapped in `app/_layout.tsx`:

```typescript
UserPreferencesProvider
  └── ClubBagProvider
      └── WeatherProvider
          └── Navigation Stack
```

**Why this order?**
- UserPreferences must be loaded first (determines units, settings)
- ClubBag depends on UserPreferences (for unit conversions)
- Weather depends on both (for display formatting and provider selection)

### 2. Service Layer Pattern

External services are abstracted behind clean interfaces:

```typescript
// Weather Service
interface WeatherAdapter {
  fetchWeather(lat: number, lon: number): Promise<WeatherData>
  getName(): string
}

// Multiple implementations
- OpenMeteoAdapter implements WeatherAdapter
- TomorrowAdapter implements WeatherAdapter
```

This allows:
- Easy provider switching
- Fallback support
- Testing with mocks
- Adding new providers without changing consumer code

### 3. Custom Hooks Pattern

Complex logic is encapsulated in custom hooks:

```typescript
// Compass integration
const { heading, accuracy, isCalibrating } = useCompassHeading();

// Smooth animations
const interpolatedHeading = useInterpolatedHeading(heading);

// Haptic feedback
const { handleValueChange } = useHapticSlider(onValueChange);
```

Benefits:
- Reusable across components
- Easier to test
- Cleaner component code

### 4. Error Boundary Pattern

Custom error classes for better error handling:

```typescript
// wind-error-handler.ts
class WindError extends Error {}
class NoValidClubError extends WindError {}
class ExcessiveIterationsError extends WindError {}
class PhysicsModelError extends WindError {}
```

### 5. Repository Pattern

Data persistence is abstracted through context providers that handle both:
- Local storage (AsyncStorage)
- Cloud storage (Supabase)

```typescript
// ClubBagContext automatically syncs
const { clubs, updateClub } = useClubBag();

// Updates both local AND cloud (if logged in)
updateClub('7-iron', { distance: 165 });
```

## 🔄 Data Flow

### Shot Calculation Flow

```
User Input (Target Yardage)
         ↓
WeatherContext provides current conditions
         ↓
YardageModelEnhanced.calculateAdjustedYardage()
    ├── Calculate air density
    ├── Apply environmental factors
    ├── Apply wind effects (if available)
    └── Apply skill level adjustments
         ↓
ClubBagContext suggests optimal club
         ↓
Display results to user
```

### Weather Data Flow

```
Location Service (expo-location)
         ↓
Cache Check (5-minute TTL)
    ├── Cache Hit → Return cached data
    └── Cache Miss ↓
         Primary Provider (Open-Meteo)
              ├── Success → Cache & Return
              └── Failure ↓
                   Circuit Breaker Check
                        ├── Open → Try Fallback
                        └── Closed → Retry with backoff
                             ↓
                        Fallback Provider (Tomorrow.io)
                             ↓
                        Manual Override (if configured)
```

### Authentication Flow

```
User Action (Sign In/Up)
         ↓
Supabase Auth API
    ├── Success → Store session
    │         ↓
    │    Load user data from database
    │         ↓
    │    Sync clubs & preferences
    │         ↓
    │    Update UI
    │
    └── Failure → Show error message
              ↓
         Remain in anonymous mode
```

## 🧩 Component Architecture

### Screen Components (`app/(tabs)/`)

Each screen follows this structure:

```typescript
export default function ScreenName() {
  // 1. Context hooks
  const { weather } = useWeather();
  const { preferences } = useUserPreferences();
  
  // 2. Local state
  const [targetYardage, setTargetYardage] = useState(150);
  
  // 3. Custom hooks
  const heading = useCompassHeading();
  
  // 4. Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // 5. Event handlers
  const handleCalculate = () => {
    // Logic
  };
  
  // 6. Render
  return (
    <SafeAreaView>
      {/* UI */}
    </SafeAreaView>
  );
}
```

### Context Providers

Each context follows this pattern:

```typescript
interface ContextValue {
  // State
  data: DataType;
  loading: boolean;
  error: Error | null;
  
  // Actions
  fetchData: () => Promise<void>;
  updateData: (newData: Partial<DataType>) => void;
}

export function ContextProvider({ children }: Props) {
  // State management
  const [state, setState] = useState<DataType>(initialState);
  
  // Persistence
  useEffect(() => {
    loadFromStorage();
  }, []);
  
  useEffect(() => {
    saveToStorage(state);
  }, [state]);
  
  // API integration
  const contextValue: ContextValue = {
    data: state,
    fetchData,
    updateData,
  };
  
  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
}
```

## 🔐 Security Architecture

### Authentication
- Supabase handles all auth (JWT tokens)
- Session stored in AsyncStorage (encrypted on device)
- No passwords stored locally
- Optional anonymous mode (no cloud sync)

### API Keys
- Environment variables for sensitive keys
- Never committed to git
- Stored in `.env` (gitignored)

### Data Privacy
- Location data never stored on servers
- Weather data cached locally (5 min TTL)
- User data isolated per account (Row Level Security in Supabase)

## 🎨 Design System

Colors, spacing, and typography are centralized in `src/constants/theme.ts`:

```typescript
export const colors = {
  // Semantic colors
  primary: '#238636',      // Green (success, actions)
  accent: '#c9a227',       // Gold (wind, highlights)
  error: '#f85149',        // Red (errors, warnings)
  
  // Background colors
  background: '#0d1117',   // Dark base
  surface: '#161b22',      // Cards, panels
  elevated: '#21262d',     // Modals, overlays
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48
};

export const typography = {
  fontSize: {
    xs: 12, sm: 14, md: 16, lg: 18, xl: 24, xxl: 32
  },
  fontWeight: {
    regular: '400', medium: '500', semibold: '600', bold: '700'
  }
};
```

## 🧪 Testing Architecture

### Unit Tests (`src/__tests__/`)
- Jest for unit testing
- React Native Testing Library for component tests
- Mocked contexts for isolation

### Integration Tests
- Test context provider interactions
- Test data flow through layers
- Mock external services (Supabase, Weather APIs)

### E2E Tests (Planned)
- Playwright for end-to-end testing
- Test complete user flows
- Real device/simulator testing

## 📊 Performance Considerations

### Optimization Strategies

1. **Memoization**
   - Heavy calculations cached with `useMemo`
   - Callbacks wrapped in `useCallback`

2. **Lazy Loading**
   - Screens loaded on-demand via Expo Router
   - Heavy components loaded conditionally

3. **Data Caching**
   - Weather data cached (5 min TTL)
   - Club data persisted locally
   - Network requests debounced

4. **Animation Optimization**
   - React Native Reanimated for 60fps animations
   - Reduced motion support for accessibility

## 🔄 State Management Flow

```
User Action
    ↓
Component Handler
    ↓
Context Action
    ↓
Update State
    ↓
[Persist to AsyncStorage]
    ↓
[Sync to Supabase] (if authenticated)
    ↓
Re-render affected components
```

## 🚀 Deployment Architecture

### Development
- Expo Go for quick iteration
- Metro bundler for hot reload
- Local development server

### Staging/Production
- EAS Build for native builds
- Over-the-air (OTA) updates via Expo Updates
- App Store & Google Play distribution

### CI/CD Pipeline
- GitHub Actions for automated testing
- EAS Build for app builds
- Automated deployment to stores

## 📱 Platform-Specific Considerations

### iOS
- Uses native location services
- Core Location for compass heading
- WKWebView for web content

### Android
- Uses fused location provider
- Sensor API for compass heading
- Chrome Custom Tabs for web content

### Web (via Expo Web)
- Geolocation API for location
- Device Orientation API for compass
- Responsive design for desktop browsers

## 🔮 Future Architecture Improvements

1. **State Management**: Consider Zustand/Redux for complex state
2. **Offline-First**: Implement service workers for PWA
3. **Real-time Sync**: WebSocket integration for live updates
4. **Microservices**: Separate weather/auth into dedicated services
5. **Analytics**: Add crash reporting & usage analytics
6. **Internationalization**: i18n support for multiple languages

---

This architecture is designed for:
- ✅ **Scalability** - Easy to add features
- ✅ **Maintainability** - Clear separation of concerns
- ✅ **Testability** - Isolated, mockable components
- ✅ **Performance** - Optimized rendering & data flow
- ✅ **Developer Experience** - Type-safe, well-documented code
