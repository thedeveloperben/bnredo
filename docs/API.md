# API & Services Documentation

Documentation for external services and internal APIs used in AI Caddy Pro.

## 🌐 External Services

### 1. Weather APIs

#### Open-Meteo (Primary Provider)

**Base URL:** `https://api.open-meteo.com/v1/forecast`

**Endpoint:** `/forecast`

**Parameters:**
```typescript
{
  latitude: number;      // GPS latitude
  longitude: number;     // GPS longitude
  current: string[];     // Current weather variables
  temperature_unit: 'fahrenheit' | 'celsius';
  windspeed_unit: 'mph' | 'kmh';
  timezone: 'auto';      // Auto-detect timezone
}
```

**Current Variables Requested:**
- `temperature_2m` - Temperature at 2 meters
- `relative_humidity_2m` - Relative humidity
- `surface_pressure` - Surface air pressure
- `windspeed_10m` - Wind speed at 10 meters
- `wind_direction_10m` - Wind direction in degrees
- `wind_gusts_10m` - Wind gust speed

**Example Request:**
```bash
GET https://api.open-meteo.com/v1/forecast?
  latitude=37.7749&
  longitude=-122.4194&
  current=temperature_2m,relative_humidity_2m,surface_pressure,windspeed_10m,wind_direction_10m,wind_gusts_10m&
  temperature_unit=fahrenheit&
  windspeed_unit=mph&
  timezone=auto
```

**Example Response:**
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "current": {
    "time": "2024-01-15T12:00",
    "temperature_2m": 65.5,
    "relative_humidity_2m": 55,
    "surface_pressure": 1013.25,
    "windspeed_10m": 8.5,
    "wind_direction_10m": 270,
    "wind_gusts_10m": 12.3
  }
}
```

**Rate Limits:**
- ✅ No API key required
- ✅ No hard rate limit
- ⚠️ Fair use policy: ~10,000 requests/day
- ⚠️ Recommend 5-minute caching

**Error Handling:**
```typescript
try {
  const weather = await fetchOpenMeteoWeather(lat, lon);
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    // Switch to fallback provider
  } else if (error.code === 'NETWORK_ERROR') {
    // Use cached data
  }
}
```

---

#### Tomorrow.io (Fallback Provider)

**Base URL:** `https://api.tomorrow.io/v4/weather`

**Endpoint:** `/realtime`

**Authentication:**
- API Key required (header: `apikey`)
- Free tier: 500 calls/day
- Premium: Higher limits

**Parameters:**
```typescript
{
  location: string;      // "lat,lon" format
  units: 'metric' | 'imperial';
  apikey: string;        // Required
}
```

**Example Request:**
```bash
GET https://api.tomorrow.io/v4/weather/realtime?
  location=37.7749,-122.4194&
  units=imperial&
  apikey=YOUR_API_KEY
```

**Example Response:**
```json
{
  "data": {
    "time": "2024-01-15T12:00:00Z",
    "values": {
      "temperature": 65.5,
      "humidity": 55,
      "pressureSurfaceLevel": 30.0,
      "windSpeed": 8.5,
      "windDirection": 270,
      "windGust": 12.3
    }
  },
  "location": {
    "lat": 37.7749,
    "lon": -122.4194
  }
}
```

**Rate Limits:**
- Free: 500 requests/day
- Startup: 25,000 requests/day
- Enterprise: Custom limits

---

### 2. Supabase

#### Authentication

**Endpoint:** `https://<project-id>.supabase.co/auth/v1`

**Sign Up:**
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
});
```

**Sign In:**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password',
});
```

**Session Management:**
```typescript
// Get current session
const { data: { session } } = await supabase.auth.getSession();

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // User logged in
  } else if (event === 'SIGNED_OUT') {
    // User logged out
  }
});
```

**Sign Out:**
```typescript
await supabase.auth.signOut();
```

#### Database

**Tables:**

**`user_clubs`**
```sql
CREATE TABLE user_clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  club_name TEXT NOT NULL,
  distance NUMERIC NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, club_name)
);

-- Row Level Security
ALTER TABLE user_clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own clubs"
  ON user_clubs
  FOR ALL
  USING (auth.uid() = user_id);
```

**`user_preferences`**
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  distance_unit TEXT DEFAULT 'yards',
  speed_unit TEXT DEFAULT 'mph',
  temperature_unit TEXT DEFAULT 'fahrenheit',
  pressure_unit TEXT DEFAULT 'inHg',
  skill_level TEXT DEFAULT 'INTERMEDIATE',
  weather_provider TEXT DEFAULT 'openmeteo',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own preferences"
  ON user_preferences
  FOR ALL
  USING (auth.uid() = user_id);
```

**CRUD Operations:**

```typescript
// Create/Update club
const { data, error } = await supabase
  .from('user_clubs')
  .upsert({
    user_id: session.user.id,
    club_name: '7-iron',
    distance: 165,
    enabled: true,
  });

// Fetch user clubs
const { data: clubs } = await supabase
  .from('user_clubs')
  .select('*')
  .eq('user_id', session.user.id);

// Update preferences
const { data, error } = await supabase
  .from('user_preferences')
  .upsert({
    user_id: session.user.id,
    distance_unit: 'meters',
    temperature_unit: 'celsius',
  });
```

---

### 3. Location Services

#### Expo Location

**Request Permissions:**
```typescript
import * as Location from 'expo-location';

const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== 'granted') {
  // Handle permission denied
}
```

**Get Current Position:**
```typescript
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Balanced,
});

// Result:
{
  coords: {
    latitude: 37.7749,
    longitude: -122.4194,
    altitude: 15.5,        // Meters above sea level
    accuracy: 10.2,        // Horizontal accuracy in meters
    altitudeAccuracy: 5.0, // Vertical accuracy in meters
    heading: 90,           // Degrees from north (if moving)
    speed: 0,              // Meters per second
  },
  timestamp: 1642263600000
}
```

**Get Compass Heading:**
```typescript
await Location.watchHeadingAsync((heading) => {
  console.log('Heading:', heading.magHeading);  // Magnetic north
  console.log('True Heading:', heading.trueHeading); // True north
  console.log('Accuracy:', heading.accuracy);   // +/- degrees
});
```

**Reverse Geocoding:**
```typescript
const addresses = await Location.reverseGeocodeAsync({
  latitude: 37.7749,
  longitude: -122.4194,
});

// Result:
[{
  city: "San Francisco",
  region: "California",
  country: "United States",
  postalCode: "94102",
  name: "San Francisco",
}]
```

---

## 🔧 Internal APIs

### Weather Service Layer

#### Architecture

```
Client Code
    ↓
WeatherService (Public API)
    ↓
ProviderOrchestrator
    ├── CacheManager (5-min TTL)
    ├── CircuitBreaker (Health tracking)
    └── RetryStrategy (Exponential backoff)
    ↓
WeatherAdapter (Interface)
    ├── OpenMeteoAdapter
    └── TomorrowAdapter
```

#### Public API

**Fetch Weather:**
```typescript
import { weatherService } from '@/services/weather';

const weather = await weatherService.fetchWeather(lat, lon);

// Result:
{
  temperature: 65.5,
  humidity: 55,
  pressure: 30.0,
  windSpeed: 8.5,
  windDirection: 270,
  windGust: 12.3,
  altitude: 15.5,
  location: "San Francisco, CA",
  timestamp: 1642263600000,
  provider: "openmeteo"
}
```

**Get Current Provider:**
```typescript
const provider = weatherService.getCurrentProvider();
// Returns: "openmeteo" | "tomorrow" | "manual"
```

**Switch Provider:**
```typescript
await weatherService.switchProvider('tomorrow');
```

**Manual Override:**
```typescript
weatherService.setManualWeather({
  temperature: 75,
  humidity: 60,
  pressure: 29.9,
  windSpeed: 10,
  windDirection: 180,
  altitude: 100,
});
```

**Clear Override:**
```typescript
weatherService.clearManualWeather();
```

#### Cache Manager

**Implementation:**
```typescript
class CacheManager {
  private cache: Map<string, CachedData> = new Map();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  get(key: string): WeatherData | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(key: string, data: WeatherData): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}
```

**Cache Key Format:**
```typescript
const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
// Example: "37.77,-122.42"
```

#### Circuit Breaker

**Purpose:** Prevent cascading failures by tracking provider health.

**States:**
- `CLOSED`: Normal operation
- `OPEN`: Provider failing, requests blocked
- `HALF_OPEN`: Testing if provider recovered

**Implementation:**
```typescript
class CircuitBreaker {
  private failureCount = 0;
  private readonly FAILURE_THRESHOLD = 3;
  private readonly TIMEOUT = 60000; // 1 minute
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailure < this.TIMEOUT) {
        throw new Error('Circuit breaker open');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    if (this.failureCount >= this.FAILURE_THRESHOLD) {
      this.state = 'OPEN';
      this.lastFailure = Date.now();
    }
  }
}
```

#### Retry Strategy

**Exponential Backoff:**
```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.min(1000 * Math.pow(2, i), 10000);
      await sleep(delay);
    }
  }
  throw new Error('Max retries exceeded');
}
```

**Delays:**
- Attempt 1: 1 second
- Attempt 2: 2 seconds
- Attempt 3: 4 seconds
- Max: 10 seconds

---

### Physics Engine API

#### YardageModelEnhanced

**Calculate Adjusted Yardage:**
```typescript
import { YardageModelEnhanced, SkillLevel } from '@/core/models/yardagemodel';

const model = new YardageModelEnhanced();

const result = model.calculateAdjustedYardage(
  150,                          // Target yardage
  '7-iron',                     // Club name
  {
    temperature: 85,            // °F
    humidity: 60,               // %
    pressure: 29.92,            // inHg
    altitude: 5000,             // feet
    wind: {
      speed: 15,                // MPH
      direction: 0,             // Degrees (0 = headwind)
      targetDirection: 180,     // Degrees (180 = facing wind)
    }
  },
  SkillLevel.ADVANCED
);

// Result:
{
  adjustedYardage: 156.5,      // Total adjusted distance
  carryDistance: 156.5,        // Carry in air
  rollDistance: 5.2,           // Roll after landing
  lateralMovement: 0,          // Sideways movement (wind)
  environmentalFactor: 1.043,  // 4.3% increase
  windEffect: {
    carry: -12.5,              // Headwind reduces 12.5 yards
    lateral: 0,                // No crosswind
  },
  suggestedClub: '6-iron',     // Better choice
}
```

**Get Club Data:**
```typescript
const clubData = model.getClubData('7-iron');

// Result:
{
  name: '7-iron',
  loft: 34,                    // Degrees
  ballSpeed: 120,              // MPH
  launchAngle: 19,             // Degrees
  spinRate: 6500,              // RPM
  defaultDistance: 160,        // Yards
  category: 'iron',
}
```

#### Wind Calculator

**Calculate Wind Effect:**
```typescript
import { calculateWindEffect } from '@/core/services/wind-calculator';

const result = calculateWindEffect(
  150,                          // Target distance
  {
    speed: 20,                  // MPH
    direction: 90,              // From east
    targetDirection: 0,         // Facing north
  },
  '7-iron',
  { temperature: 70, pressure: 29.92, altitude: 0 }
);

// Result:
{
  carryAdjustment: -3.5,       // 3.5 yards shorter
  lateralMovement: 18.2,       // 18.2 yards right
  effectiveDistance: 153.5,    // Adjusted target
  suggestedClub: '7-iron',     // Same club works
  iterations: 2,               // Convergence in 2 steps
}
```

**Recursive Club Selection:**
```typescript
const result = calculateWindEffectRecursive(
  150,                          // Target distance
  wind,
  conditions,
  clubs,                        // Array of available clubs
  SkillLevel.ADVANCED
);

// Returns optimal club accounting for wind-induced distance changes
```

---

## 🔒 Security Considerations

### API Key Management
```typescript
// .env file (never committed)
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

// Access in code
import Constants from 'expo-constants';
const apiKey = Constants.expoConfig?.extra?.supabaseKey;
```

### Rate Limiting
- Weather API calls cached for 5 minutes
- Supabase queries use Row Level Security
- No user input directly in SQL queries

### Data Privacy
- Location data never stored on servers
- Weather data cached locally only
- User data isolated per account

---

## 📊 Performance Metrics

### Weather API Response Times
- Open-Meteo: ~200-500ms average
- Tomorrow.io: ~100-300ms average
- Cache hit: <1ms

### Database Query Times
- Club fetch: ~50-100ms
- Preferences fetch: ~50-100ms
- Club upsert: ~100-200ms

### Physics Calculations
- Single shot: <1ms
- Wind calculation: <5ms
- Recursive club selection: <20ms

---

## 🐛 Error Handling

### Common Error Codes

```typescript
// Weather errors
RATE_LIMIT_EXCEEDED - Too many API calls
NETWORK_ERROR - No internet connection
PROVIDER_ERROR - API returned error
CACHE_MISS - No cached data available

// Auth errors
INVALID_CREDENTIALS - Wrong email/password
SESSION_EXPIRED - Need to re-login
NETWORK_ERROR - Can't reach Supabase

// Location errors
PERMISSION_DENIED - User denied location access
TIMEOUT - Location lookup took too long
UNAVAILABLE - GPS not available
```

### Error Recovery Strategies

1. **Weather API Failure**
   - Try cache
   - Switch provider
   - Fall back to manual input

2. **Database Failure**
   - Use local storage
   - Queue for retry
   - Notify user of sync issues

3. **Location Failure**
   - Prompt for manual location
   - Use last known location
   - Disable weather features

---

**Questions?** See [ARCHITECTURE](./ARCHITECTURE.md) for system design details!
