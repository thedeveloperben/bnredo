import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGust: number;
  altitude: number;
  locationName: string;
  latitude: number;
  longitude: number;
  observationTime: string;
  isManualOverride: boolean;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  elevation: number;
}

interface GeocodingResponse {
  results?: Array<{
    name: string;
    admin1?: string;
    country?: string;
  }>;
}

const CACHE_KEY = 'weather_cache';
const CACHE_DURATION_MS = 5 * 60 * 1000;

export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherData> {
  const cached = await getCachedWeather();
  if (cached && !isExpired(cached.observationTime)) {
    const distance = getDistanceKm(latitude, longitude, cached.latitude, cached.longitude);
    if (distance < 5) {
      return cached;
    }
  }

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=mph&temperature_unit=fahrenheit`;

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const weatherData: OpenMeteoResponse = await weatherResponse.json();

    let locationName = 'Current Location';
    try {
      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1`;
      const geocodeResponse = await fetch(geocodeUrl);
      if (geocodeResponse.ok) {
        const geocodeData: GeocodingResponse = await geocodeResponse.json();
        if (geocodeData.results && geocodeData.results.length > 0) {
          const place = geocodeData.results[0];
          locationName = place.admin1
            ? `${place.name}, ${place.admin1}`
            : place.name;
        }
      }
    } catch {
      // Use default location name
    }

    const weather: WeatherData = {
      temperature: Math.round(weatherData.current.temperature_2m),
      humidity: Math.round(weatherData.current.relative_humidity_2m),
      pressure: Math.round(weatherData.current.surface_pressure),
      windSpeed: Math.round(weatherData.current.wind_speed_10m),
      windDirection: Math.round(weatherData.current.wind_direction_10m),
      windGust: Math.round(weatherData.current.wind_gusts_10m),
      altitude: Math.round(weatherData.elevation * 3.28084),
      locationName,
      latitude,
      longitude,
      observationTime: new Date().toISOString(),
      isManualOverride: false,
    };

    await cacheWeather(weather);
    return weather;
  } catch (error) {
    if (cached) {
      return cached;
    }
    throw error;
  }
}

export async function fetchForecast(latitude: number, longitude: number): Promise<Array<{
  time: string;
  windSpeed: number;
  windDirection: number;
  windGust: number;
}>> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=mph&forecast_hours=6`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch forecast');
  }

  const data = await response.json();

  return data.hourly.time.map((time: string, index: number) => ({
    time,
    windSpeed: Math.round(data.hourly.wind_speed_10m[index]),
    windDirection: Math.round(data.hourly.wind_direction_10m[index]),
    windGust: Math.round(data.hourly.wind_gusts_10m[index]),
  }));
}

async function cacheWeather(weather: WeatherData): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(weather));
  } catch (error) {
    console.error('Failed to cache weather:', error);
  }
}

export async function getCachedWeather(): Promise<WeatherData | null> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Failed to get cached weather:', error);
  }
  return null;
}

function isExpired(observationTime: string): boolean {
  const cached = new Date(observationTime).getTime();
  const now = Date.now();
  return now - cached > CACHE_DURATION_MS;
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getDefaultWeather(): WeatherData {
  return {
    temperature: 72,
    humidity: 50,
    pressure: 1013,
    windSpeed: 10,
    windDirection: 0,
    windGust: 15,
    altitude: 0,
    locationName: 'Default',
    latitude: 0,
    longitude: 0,
    observationTime: new Date().toISOString(),
    isManualOverride: true,
  };
}

export function getWindDirectionLabel(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
