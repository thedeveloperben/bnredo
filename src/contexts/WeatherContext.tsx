import * as React from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData, fetchWeather, getCachedWeather, getDefaultWeather } from '@/src/services/weather-service';

interface WeatherContextType {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
  refreshWeather: () => Promise<void>;
  updateManualWeather: (updates: Partial<WeatherData>) => void;
}

const WeatherContext = React.createContext<WeatherContextType | null>(null);

const MANUAL_OVERRIDE_KEY = 'weather_manual_override';

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weather, setWeather] = React.useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isOffline, setIsOffline] = React.useState(false);

  React.useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const manualOverride = await AsyncStorage.getItem(MANUAL_OVERRIDE_KEY);
      if (manualOverride) {
        const parsed = JSON.parse(manualOverride);
        if (parsed.isManualOverride) {
          setWeather(parsed);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Continue with auto fetch
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        const cached = await getCachedWeather();
        if (cached) {
          setWeather(cached);
          setIsOffline(true);
        } else {
          setWeather(getDefaultWeather());
          setError('Location permission required for weather');
        }
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const weatherData = await fetchWeather(
        location.coords.latitude,
        location.coords.longitude
      );

      setWeather(weatherData);
      setIsOffline(false);
      setError(null);
    } catch (err) {
      console.error('Weather fetch error:', err);

      const cached = await getCachedWeather();
      if (cached) {
        setWeather(cached);
        setIsOffline(true);
        setError('Using cached weather data');
      } else {
        setWeather(getDefaultWeather());
        setError('Unable to fetch weather');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWeather = async () => {
    await AsyncStorage.removeItem(MANUAL_OVERRIDE_KEY);
    await loadWeather();
  };

  const updateManualWeather = async (updates: Partial<WeatherData>) => {
    const newWeather = {
      ...(weather || getDefaultWeather()),
      ...updates,
      isManualOverride: true,
      observationTime: new Date().toISOString(),
    };
    setWeather(newWeather);
    await AsyncStorage.setItem(MANUAL_OVERRIDE_KEY, JSON.stringify(newWeather));
  };

  const value = React.useMemo(() => ({
    weather,
    isLoading,
    error,
    isOffline,
    refreshWeather,
    updateManualWeather,
  }), [weather, isLoading, error, isOffline]);

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = React.useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within WeatherProvider');
  }
  return context;
}
