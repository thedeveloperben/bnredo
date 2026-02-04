# Testing Guide

Comprehensive testing guide for AI Caddy Pro.

## 🧪 Testing Philosophy

AI Caddy Pro follows a multi-layer testing approach:

1. **Unit Tests** - Test individual functions and utilities
2. **Component Tests** - Test React components in isolation
3. **Integration Tests** - Test feature workflows
4. **E2E Tests** - Test complete user journeys
5. **Manual Testing** - Verify on real devices

**Test Coverage Goals:**
- Core physics: 95%+
- Business logic: 90%+
- Components: 80%+
- Overall: 85%+

## 🏃 Quick Start

```bash
# Run all tests
npm test

# Watch mode (re-run on changes)
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e
```

## 🔧 Test Setup

### Configuration Files

**`jest.config.js`** - Jest configuration
```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
};
```

**`jest.setup.js`** - Test environment setup
```javascript
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  watchHeadingAsync: jest.fn(),
}));
```

## 📝 Unit Tests

### Testing Utilities

**Example: Unit Conversions**

```typescript
// src/__tests__/unit-conversions.test.ts
import {
  yardsToMeters,
  metersToYards,
  mphToKmh,
  fahrenheitToCelsius,
} from '@/utils/unit-conversions';

describe('Unit Conversions', () => {
  describe('yardsToMeters', () => {
    it('converts yards to meters correctly', () => {
      expect(yardsToMeters(100)).toBeCloseTo(91.44, 2);
      expect(yardsToMeters(0)).toBe(0);
    });
  });

  describe('metersToYards', () => {
    it('converts meters to yards correctly', () => {
      expect(metersToYards(91.44)).toBeCloseTo(100, 2);
      expect(metersToYards(0)).toBe(0);
    });
  });

  describe('mphToKmh', () => {
    it('converts mph to km/h correctly', () => {
      expect(mphToKmh(10)).toBeCloseTo(16.09, 2);
      expect(mphToKmh(0)).toBe(0);
    });
  });

  describe('fahrenheitToCelsius', () => {
    it('converts Fahrenheit to Celsius correctly', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
      expect(fahrenheitToCelsius(212)).toBe(100);
      expect(fahrenheitToCelsius(70)).toBeCloseTo(21.11, 2);
    });
  });
});
```

### Testing Physics Engine

**Example: YardageModel Tests**

```typescript
// src/__tests__/yardagemodel.test.ts
import { YardageModelEnhanced, SkillLevel } from '@/core/models/yardagemodel';

describe('YardageModelEnhanced', () => {
  let model: YardageModelEnhanced;

  beforeEach(() => {
    model = new YardageModelEnhanced();
  });

  describe('calculateAdjustedYardage', () => {
    it('increases distance in hot weather', () => {
      const result = model.calculateAdjustedYardage(
        150,
        '7-iron',
        {
          temperature: 95,  // Hot day
          humidity: 50,
          pressure: 29.92,
          altitude: 0,
        },
        SkillLevel.PROFESSIONAL
      );

      expect(result.adjustedYardage).toBeGreaterThan(150);
    });

    it('decreases distance in cold weather', () => {
      const result = model.calculateAdjustedYardage(
        150,
        '7-iron',
        {
          temperature: 40,  // Cold day
          humidity: 50,
          pressure: 29.92,
          altitude: 0,
        },
        SkillLevel.PROFESSIONAL
      );

      expect(result.adjustedYardage).toBeLessThan(150);
    });

    it('increases distance at high altitude', () => {
      const baseResult = model.calculateAdjustedYardage(
        150, '7-iron',
        { temperature: 70, humidity: 50, pressure: 29.92, altitude: 0 },
        SkillLevel.PROFESSIONAL
      );

      const altitudeResult = model.calculateAdjustedYardage(
        150, '7-iron',
        { temperature: 70, humidity: 50, pressure: 29.92, altitude: 5000 },
        SkillLevel.PROFESSIONAL
      );

      expect(altitudeResult.adjustedYardage).toBeGreaterThan(baseResult.adjustedYardage);
    });

    it('applies skill level adjustment correctly', () => {
      const proResult = model.calculateAdjustedYardage(
        150, '7-iron',
        { temperature: 70, humidity: 50, pressure: 29.92, altitude: 0 },
        SkillLevel.PROFESSIONAL
      );

      const beginnerResult = model.calculateAdjustedYardage(
        150, '7-iron',
        { temperature: 70, humidity: 50, pressure: 29.92, altitude: 0 },
        SkillLevel.BEGINNER
      );

      expect(beginnerResult.adjustedYardage).toBeLessThan(proResult.adjustedYardage);
    });
  });

  describe('calculateWindEffect', () => {
    it('reduces distance with headwind', () => {
      const result = model.calculateAdjustedYardage(
        150, '7-iron',
        {
          temperature: 70,
          humidity: 50,
          pressure: 29.92,
          altitude: 0,
          wind: {
            speed: 20,
            direction: 0,  // Headwind
            targetDirection: 180,
          },
        },
        SkillLevel.PROFESSIONAL
      );

      expect(result.windEffect?.carry).toBeLessThan(0);
      expect(result.adjustedYardage).toBeLessThan(150);
    });

    it('increases distance with tailwind', () => {
      const result = model.calculateAdjustedYardage(
        150, '7-iron',
        {
          temperature: 70,
          humidity: 50,
          pressure: 29.92,
          altitude: 0,
          wind: {
            speed: 20,
            direction: 180,  // Tailwind
            targetDirection: 0,
          },
        },
        SkillLevel.PROFESSIONAL
      );

      expect(result.windEffect?.carry).toBeGreaterThan(0);
      expect(result.adjustedYardage).toBeGreaterThan(150);
    });

    it('calculates lateral movement with crosswind', () => {
      const result = model.calculateAdjustedYardage(
        150, '7-iron',
        {
          temperature: 70,
          humidity: 50,
          pressure: 29.92,
          altitude: 0,
          wind: {
            speed: 20,
            direction: 90,  // Crosswind from right
            targetDirection: 0,
          },
        },
        SkillLevel.PROFESSIONAL
      );

      expect(Math.abs(result.windEffect?.lateral || 0)).toBeGreaterThan(0);
    });
  });

  describe('getClubData', () => {
    it('returns correct club data', () => {
      const data = model.getClubData('7-iron');

      expect(data).toBeDefined();
      expect(data.name).toBe('7-iron');
      expect(data.loft).toBeGreaterThan(0);
      expect(data.ballSpeed).toBeGreaterThan(0);
      expect(data.defaultDistance).toBeGreaterThan(0);
    });

    it('returns null for invalid club', () => {
      const data = model.getClubData('invalid-club');
      expect(data).toBeNull();
    });
  });
});
```

### Testing Wind Calculator

```typescript
// src/__tests__/wind-calculator.test.ts
import { calculateWindEffect } from '@/core/services/wind-calculator';

describe('Wind Calculator', () => {
  const standardConditions = {
    temperature: 70,
    pressure: 29.92,
    altitude: 0,
  };

  it('calculates headwind effect correctly', () => {
    const result = calculateWindEffect(
      150,
      { speed: 15, direction: 0, targetDirection: 180 },
      '7-iron',
      standardConditions
    );

    expect(result.carryAdjustment).toBeLessThan(0);
    expect(result.effectiveDistance).toBeGreaterThan(150);
  });

  it('calculates tailwind effect correctly', () => {
    const result = calculateWindEffect(
      150,
      { speed: 15, direction: 180, targetDirection: 0 },
      '7-iron',
      standardConditions
    );

    expect(result.carryAdjustment).toBeGreaterThan(0);
    expect(result.effectiveDistance).toBeLessThan(150);
  });

  it('handles crosswind correctly', () => {
    const result = calculateWindEffect(
      150,
      { speed: 15, direction: 90, targetDirection: 0 },
      '7-iron',
      standardConditions
    );

    expect(Math.abs(result.lateralMovement)).toBeGreaterThan(0);
  });

  it('converges in recursive mode', () => {
    const result = calculateWindEffect(
      150,
      { speed: 20, direction: 0, targetDirection: 180 },
      '7-iron',
      standardConditions
    );

    expect(result.iterations).toBeGreaterThan(0);
    expect(result.iterations).toBeLessThan(10);
  });
});
```

## 🧩 Component Tests

### Testing React Components

**Example: WeatherCard Component**

```typescript
// src/__tests__/components/WeatherCard.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { WeatherCard } from '@/components/WeatherCard';

describe('WeatherCard', () => {
  const mockWeather = {
    temperature: 75,
    humidity: 60,
    pressure: 29.92,
    windSpeed: 10,
    windDirection: 180,
    altitude: 100,
    location: 'San Francisco, CA',
    timestamp: Date.now(),
    provider: 'openmeteo',
  };

  it('renders temperature correctly', () => {
    const { getByText } = render(
      <WeatherCard weather={mockWeather} units="imperial" />
    );

    expect(getByText(/75°F/i)).toBeTruthy();
  });

  it('renders humidity correctly', () => {
    const { getByText } = render(
      <WeatherCard weather={mockWeather} units="imperial" />
    );

    expect(getByText(/60%/i)).toBeTruthy();
  });

  it('renders wind speed correctly', () => {
    const { getByText } = render(
      <WeatherCard weather={mockWeather} units="imperial" />
    );

    expect(getByText(/10 mph/i)).toBeTruthy();
  });

  it('renders location correctly', () => {
    const { getByText } = render(
      <WeatherCard weather={mockWeather} units="imperial" />
    );

    expect(getByText(/San Francisco, CA/i)).toBeTruthy();
  });

  it('converts to metric units correctly', () => {
    const { getByText } = render(
      <WeatherCard weather={mockWeather} units="metric" />
    );

    expect(getByText(/24°C/i)).toBeTruthy();  // ~75°F
    expect(getByText(/16 km\/h/i)).toBeTruthy();  // ~10 mph
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <WeatherCard weather={null} units="imperial" loading={true} />
    );

    expect(getByTestId('weather-skeleton')).toBeTruthy();
  });

  it('shows error state', () => {
    const { getByText } = render(
      <WeatherCard 
        weather={null} 
        units="imperial" 
        error="Failed to load weather" 
      />
    );

    expect(getByText(/Failed to load weather/i)).toBeTruthy();
  });
});
```

### Testing Context Providers

**Example: WeatherContext Tests**

```typescript
// src/__tests__/contexts/WeatherContext.test.tsx
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { WeatherProvider, useWeather } from '@/contexts/WeatherContext';
import * as Location from 'expo-location';

jest.mock('expo-location');

describe('WeatherContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches weather on mount', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 37.7749, longitude: -122.4194, altitude: 15 },
    });

    const { result } = renderHook(() => useWeather(), {
      wrapper: WeatherProvider,
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weather).toBeDefined();
    expect(result.current.weather?.temperature).toBeGreaterThan(0);
  });

  it('handles location permission denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const { result } = renderHook(() => useWeather(), {
      wrapper: WeatherProvider,
    });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    expect(result.current.error).toContain('permission');
  });

  it('refreshes weather data', async () => {
    const { result } = renderHook(() => useWeather(), {
      wrapper: WeatherProvider,
    });

    await waitFor(() => {
      expect(result.current.weather).toBeDefined();
    });

    const firstTemp = result.current.weather?.temperature;

    await act(async () => {
      await result.current.refreshWeather();
    });

    expect(result.current.weather?.temperature).toBeDefined();
  });

  it('uses cached data within TTL', async () => {
    const { result } = renderHook(() => useWeather(), {
      wrapper: WeatherProvider,
    });

    await waitFor(() => {
      expect(result.current.weather).toBeDefined();
    });

    const mockFetch = jest.spyOn(global, 'fetch');

    await act(async () => {
      await result.current.refreshWeather();
    });

    // Should not fetch again (within 5-min cache)
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
```

## 🔗 Integration Tests

### Testing Feature Workflows

**Example: Shot Calculator Flow**

```typescript
// src/__tests__/integration/shot-calculator.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Index from '@/app/(tabs)/index';
import { WeatherProvider } from '@/contexts/WeatherContext';
import { ClubBagProvider } from '@/contexts/ClubBagContext';

describe('Shot Calculator Integration', () => {
  const wrapper = ({ children }) => (
    <NavigationContainer>
      <WeatherProvider>
        <ClubBagProvider>
          {children}
        </ClubBagProvider>
      </WeatherProvider>
    </NavigationContainer>
  );

  it('calculates adjusted yardage when distance changes', async () => {
    const { getByTestId, getByText } = render(<Index />, { wrapper });

    // Wait for weather to load
    await waitFor(() => {
      expect(getByTestId('weather-card')).toBeTruthy();
    });

    // Change target distance
    const slider = getByTestId('distance-slider');
    fireEvent(slider, 'valueChange', 150);

    // Check adjusted yardage updates
    await waitFor(() => {
      expect(getByTestId('adjusted-yardage')).toBeTruthy();
    });

    // Should show club recommendation
    expect(getByText(/7-iron/i)).toBeTruthy();
  });

  it('updates calculation when weather refreshed', async () => {
    const { getByTestId, getByText } = render(<Index />, { wrapper });

    await waitFor(() => {
      expect(getByTestId('weather-card')).toBeTruthy();
    });

    const firstResult = getByTestId('adjusted-yardage').props.children;

    // Refresh weather
    const refreshButton = getByTestId('refresh-weather');
    fireEvent.press(refreshButton);

    await waitFor(() => {
      const newResult = getByTestId('adjusted-yardage').props.children;
      // Result might change with new weather
      expect(newResult).toBeDefined();
    });
  });
});
```

## 🌐 E2E Tests (Playwright)

### Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8081',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --web',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Example

```typescript
// e2e/shot-calculator.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Shot Calculator', () => {
  test('calculates adjusted yardage', async ({ page }) => {
    await page.goto('/');

    // Wait for weather to load
    await expect(page.locator('[data-testid="weather-card"]')).toBeVisible();

    // Enter target distance
    await page.locator('[data-testid="distance-input"]').fill('150');

    // Check result appears
    await expect(page.locator('[data-testid="adjusted-yardage"]')).toBeVisible();

    // Verify club recommendation
    await expect(page.locator('text=/iron/i')).toBeVisible();
  });

  test('navigates to wind calculator', async ({ page }) => {
    await page.goto('/');

    // Click wind tab
    await page.locator('text=Wind Calculator').click();

    // Verify on wind screen
    await expect(page.locator('[data-testid="compass-display"]')).toBeVisible();
  });

  test('opens settings', async ({ page }) => {
    await page.goto('/');

    // Click settings tab
    await page.locator('text=Settings').click();

    // Verify club manager visible
    await expect(page.locator('text=Club Bag Manager')).toBeVisible();
  });
});
```

## 📊 Code Coverage

### Viewing Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Opens HTML report in browser
open coverage/lcov-report/index.html
```

### Coverage Thresholds

```javascript
// jest.config.js
module.exports = {
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    './src/core/': {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
```

## 🐛 Debugging Tests

### VS Code Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "runtimeArgs": [
        "--inspect-brk",
        "${workspaceRoot}/node_modules/.bin/jest",
        "--runInBand"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Console Debugging

```typescript
// Add debug output in tests
it('calculates correctly', () => {
  const result = calculate(150);
  console.log('Result:', result);  // Will show in test output
  expect(result).toBeGreaterThan(0);
});
```

## ✅ Testing Checklist

Before submitting PR:

- [ ] All unit tests pass
- [ ] All component tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)
- [ ] Coverage meets thresholds
- [ ] No console warnings/errors
- [ ] TypeScript compiles
- [ ] ESLint passes
- [ ] Manual testing on device

## 📚 Best Practices

### 1. Test Naming
```typescript
describe('ComponentName', () => {
  it('does something specific', () => {
    // Test
  });
});
```

### 2. Arrange-Act-Assert Pattern
```typescript
it('calculates correctly', () => {
  // Arrange
  const input = 150;
  const expected = 153;

  // Act
  const result = calculate(input);

  // Assert
  expect(result).toBe(expected);
});
```

### 3. Test Isolation
```typescript
beforeEach(() => {
  // Reset state before each test
  jest.clearAllMocks();
});
```

### 4. Meaningful Assertions
```typescript
// ❌ Bad
expect(result).toBeTruthy();

// ✅ Good
expect(result.adjustedYardage).toBeCloseTo(153, 1);
```

### 5. Test Edge Cases
```typescript
it('handles zero distance', () => {
  const result = calculate(0);
  expect(result).toBe(0);
});

it('handles negative distance', () => {
  expect(() => calculate(-10)).toThrow();
});

it('handles very large distance', () => {
  const result = calculate(10000);
  expect(result).toBeGreaterThan(0);
});
```

---

**Happy testing!** 🧪✅ Well-tested code is reliable code!
