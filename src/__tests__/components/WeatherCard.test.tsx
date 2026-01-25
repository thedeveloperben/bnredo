/**
 * WeatherCard component tests
 * Tests loading states, error handling, and accessibility
 */
import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@/src/test-utils';
import { WeatherCard } from '@/src/components/WeatherCard';

// Mock the WeatherContext
const mockRefreshWeather = jest.fn();

jest.mock('@/src/contexts/WeatherContext', () => ({
  useWeather: jest.fn(),
  WeatherProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const { useWeather } = require('@/src/contexts/WeatherContext');

describe('WeatherCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRefreshWeather.mockResolvedValue(undefined);
  });

  describe('Loading State', () => {
    it('shows loading indicator when isLoading is true', async () => {
      useWeather.mockReturnValue({
        weather: null,
        isLoading: true,
        error: null,
        isOffline: false,
        refreshWeather: mockRefreshWeather,
      });

      render(<WeatherCard />);

      await waitFor(() => {
        expect(screen.getByText('Loading weather...')).toBeTruthy();
      });
    });

    it('has correct accessibility for loading state', async () => {
      useWeather.mockReturnValue({
        weather: null,
        isLoading: true,
        error: null,
        isOffline: false,
        refreshWeather: mockRefreshWeather,
      });

      render(<WeatherCard />);

      await waitFor(() => {
        // Verify loading indicator has accessible label
        const loadingIndicator = screen.getByLabelText('Loading');
        expect(loadingIndicator).toBeTruthy();
      });
    });
  });

  describe('Error State', () => {
    it('shows error message when weather is null and not loading', async () => {
      useWeather.mockReturnValue({
        weather: null,
        isLoading: false,
        error: 'Failed to fetch',
        isOffline: false,
        refreshWeather: mockRefreshWeather,
      });

      render(<WeatherCard />);

      await waitFor(() => {
        expect(screen.getByText('Unable to load weather')).toBeTruthy();
      });
    });

    it('shows retry button in error state', async () => {
      useWeather.mockReturnValue({
        weather: null,
        isLoading: false,
        error: 'Failed',
        isOffline: false,
        refreshWeather: mockRefreshWeather,
      });

      render(<WeatherCard />);

      await waitFor(() => {
        const retryButton = screen.getByRole('button', { name: /retry/i });
        expect(retryButton).toBeTruthy();
      });
    });

    it('calls refreshWeather when retry is pressed', async () => {
      useWeather.mockReturnValue({
        weather: null,
        isLoading: false,
        error: 'Failed',
        isOffline: false,
        refreshWeather: mockRefreshWeather,
      });

      render(<WeatherCard />);

      await waitFor(() => {
        const retryButton = screen.getByRole('button', { name: /retry/i });
        fireEvent.press(retryButton);
      });

      expect(mockRefreshWeather).toHaveBeenCalled();
    });
  });

  describe('Weather Display', () => {
    const mockWeather = {
      temperature: 72,
      humidity: 65,
      windSpeed: 12,
      windDirection: 180,
      windGust: 18,
      altitude: 500,
      pressure: 1013,
      locationName: 'San Francisco, CA',
      observationTime: new Date().toISOString(),
      isManualOverride: false,
    };

    beforeEach(() => {
      useWeather.mockReturnValue({
        weather: mockWeather,
        isLoading: false,
        error: null,
        isOffline: false,
        refreshWeather: mockRefreshWeather,
      });
    });

    it('displays temperature with unit', async () => {
      render(<WeatherCard />);

      await waitFor(() => {
        expect(screen.getByText('72°F')).toBeTruthy();
      });
    });

    it('displays humidity percentage', async () => {
      render(<WeatherCard />);

      await waitFor(() => {
        expect(screen.getByText('65%')).toBeTruthy();
      });
    });

    it('displays wind speed via accessibility label', async () => {
      render(<WeatherCard />);

      await waitFor(() => {
        // Wind speed is in nested text elements, verify via accessible label
        const windItem = screen.getByLabelText(/Wind: 12 miles per hour/);
        expect(windItem).toBeTruthy();
      });
    });

    it('displays altitude', async () => {
      render(<WeatherCard />);

      await waitFor(() => {
        expect(screen.getByText('500')).toBeTruthy();
      });
    });

    it('displays location name', async () => {
      render(<WeatherCard />);

      await waitFor(() => {
        expect(screen.getByText('San Francisco, CA')).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    const mockWeather = {
      temperature: 75,
      humidity: 50,
      windSpeed: 10,
      windDirection: 90,
      windGust: 15,
      altitude: 100,
      pressure: 1013,
      locationName: 'Test Location',
      observationTime: new Date().toISOString(),
      isManualOverride: false,
    };

    beforeEach(() => {
      useWeather.mockReturnValue({
        weather: mockWeather,
        isLoading: false,
        error: null,
        isOffline: false,
        refreshWeather: mockRefreshWeather,
      });
    });

    it('temperature has accessible label with full description', async () => {
      render(<WeatherCard />);

      await waitFor(() => {
        const tempItem = screen.getByLabelText(/Temperature: 75 degrees Fahrenheit/);
        expect(tempItem).toBeTruthy();
      });
    });

    it('humidity has accessible label with percentage', async () => {
      render(<WeatherCard />);

      await waitFor(() => {
        const humidityItem = screen.getByLabelText(/Humidity: 50 percent/);
        expect(humidityItem).toBeTruthy();
      });
    });

    it('wind has accessible label with speed and direction', async () => {
      render(<WeatherCard />);

      await waitFor(() => {
        const windItem = screen.getByLabelText(/Wind: 10 miles per hour/);
        expect(windItem).toBeTruthy();
      });
    });

    it('altitude has accessible label', async () => {
      render(<WeatherCard />);

      await waitFor(() => {
        const altItem = screen.getByLabelText(/Altitude: 100 feet/);
        expect(altItem).toBeTruthy();
      });
    });

    it('refresh button has accessibility label', async () => {
      render(<WeatherCard />);

      await waitFor(() => {
        const refreshButton = screen.getByLabelText(/Refresh weather data/);
        expect(refreshButton).toBeTruthy();
        expect(refreshButton.props.accessibilityRole).toBe('button');
      });
    });

    it('grid container has summary accessibility role', async () => {
      const { toJSON } = render(<WeatherCard />);

      await waitFor(() => {
        // Verify the summary role exists in the rendered output
        const json = JSON.stringify(toJSON());
        expect(json).toContain('"accessibilityRole":"summary"');
      });
    });
  });

  describe('Offline and Manual States', () => {
    it('shows cached badge when offline', async () => {
      useWeather.mockReturnValue({
        weather: {
          temperature: 70,
          humidity: 50,
          windSpeed: 8,
          windDirection: 180,
          windGust: 12,
          altitude: 0,
          pressure: 1013,
          locationName: 'Cached Location',
          observationTime: new Date().toISOString(),
          isManualOverride: false,
        },
        isLoading: false,
        error: null,
        isOffline: true,
        refreshWeather: mockRefreshWeather,
      });

      render(<WeatherCard />);

      await waitFor(() => {
        expect(screen.getByText('Cached')).toBeTruthy();
      });
    });

    it('shows manual badge when manually overridden', async () => {
      useWeather.mockReturnValue({
        weather: {
          temperature: 70,
          humidity: 50,
          windSpeed: 8,
          windDirection: 180,
          windGust: 12,
          altitude: 0,
          pressure: 1013,
          locationName: 'Manual Location',
          observationTime: new Date().toISOString(),
          isManualOverride: true,
        },
        isLoading: false,
        error: null,
        isOffline: false,
        refreshWeather: mockRefreshWeather,
      });

      render(<WeatherCard />);

      await waitFor(() => {
        expect(screen.getByText('Manual')).toBeTruthy();
      });
    });
  });
});
