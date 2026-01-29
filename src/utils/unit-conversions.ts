/**
 * Unit Conversion Utilities
 * Converts between imperial and metric units for golf app
 */

// Distance conversions
export const yardsToMeters = (yards: number): number => Math.round(yards * 0.9144);
export const metersToYards = (meters: number): number => Math.round(meters / 0.9144);

// Temperature conversions
export const fahrenheitToCelsius = (f: number): number => Math.round((f - 32) * 5 / 9);
export const celsiusToFahrenheit = (c: number): number => Math.round(c * 9 / 5 + 32);

// Wind speed conversions
export const mphToKmh = (mph: number): number => Math.round(mph * 1.60934);
export const kmhToMph = (kmh: number): number => Math.round(kmh / 1.60934);

// Altitude conversions
export const feetToMeters = (feet: number): number => Math.round(feet * 0.3048);
export const metersToFeet = (meters: number): number => Math.round(meters / 0.3048);

// Format helpers that return value + unit label
export function formatDistance(
  yards: number,
  unit: 'yards' | 'meters'
): { value: number; label: string; shortLabel: string } {
  if (unit === 'meters') {
    return {
      value: yardsToMeters(yards),
      label: 'meters',
      shortLabel: 'm',
    };
  }
  return {
    value: yards,
    label: 'yards',
    shortLabel: 'yds',
  };
}

export function formatTemperature(
  fahrenheit: number,
  unit: 'fahrenheit' | 'celsius'
): { value: number; label: string; shortLabel: string } {
  if (unit === 'celsius') {
    return {
      value: fahrenheitToCelsius(fahrenheit),
      label: 'degrees Celsius',
      shortLabel: '°C',
    };
  }
  return {
    value: fahrenheit,
    label: 'degrees Fahrenheit',
    shortLabel: '°F',
  };
}

export function formatWindSpeed(
  mph: number,
  unit: 'mph' | 'kmh'
): { value: number; label: string; shortLabel: string } {
  if (unit === 'kmh') {
    return {
      value: mphToKmh(mph),
      label: 'kilometers per hour',
      shortLabel: 'km/h',
    };
  }
  return {
    value: mph,
    label: 'miles per hour',
    shortLabel: 'mph',
  };
}

export function formatAltitude(
  feet: number,
  distanceUnit: 'yards' | 'meters'
): { value: number; label: string; shortLabel: string } {
  // Use meters for altitude when distance is in meters
  if (distanceUnit === 'meters') {
    return {
      value: feetToMeters(feet),
      label: 'meters',
      shortLabel: 'm',
    };
  }
  return {
    value: feet,
    label: 'feet',
    shortLabel: 'ft',
  };
}
