import * as React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MapPin, RefreshCw, Thermometer, Droplets, Wind, Gauge } from 'lucide-react-native';
import { colors, hitSlop } from '@/src/constants/theme';
import { useWeather } from '@/src/contexts/WeatherContext';
import { useUserPreferences } from '@/src/contexts/UserPreferencesContext';
import { getWindDirectionLabel } from '@/src/services/weather-service';
import { formatTemperature, formatWindSpeed, formatAltitude } from '@/src/utils/unit-conversions';
import { styles } from '@/src/styles/components/WeatherCard.styles';

export const WeatherCard = React.memo(function WeatherCard() {
  const { weather, isLoading, error, isOffline, refreshWeather } = useWeather();
  const { preferences } = useUserPreferences();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Format values based on user preferences
  const tempFormat = weather ? formatTemperature(weather.temperature, preferences.temperatureUnit) : null;
  const windFormat = weather ? formatWindSpeed(weather.windSpeed, preferences.windSpeedUnit) : null;
  const altFormat = weather ? formatAltitude(weather.altitude, preferences.distanceUnit) : null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshWeather();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container} accessibilityRole="alert" accessibilityLiveRegion="polite">
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="small" accessibilityLabel="Loading" />
          <Text style={styles.loadingText}>Loading weather...</Text>
        </View>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.container} accessibilityRole="alert">
        <Text style={styles.errorText}>Unable to load weather</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          accessibilityRole="button"
          accessibilityLabel="Retry loading weather"
          hitSlop={hitSlop.medium}
        >
          <RefreshCw color={colors.primary} size={16} />
          <Text style={styles.refreshText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationRow}>
          <MapPin color={colors.textSecondary} size={14} />
          <Text style={styles.locationText} numberOfLines={1}>
            {weather.locationName}
          </Text>
          {isOffline && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineBadgeText}>Cached</Text>
            </View>
          )}
          {weather.isManualOverride && (
            <View style={styles.manualBadge}>
              <Text style={styles.manualBadgeText}>Manual</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isRefreshing}
          accessibilityRole="button"
          accessibilityLabel={isRefreshing ? "Refreshing weather" : "Refresh weather data"}
          accessibilityState={{ busy: isRefreshing }}
          hitSlop={hitSlop.medium}
        >
          <RefreshCw
            color={isRefreshing ? colors.textMuted : colors.textSecondary}
            size={16}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.grid} accessibilityRole="summary">
        <View style={styles.gridItem} accessible accessibilityLabel={`Temperature: ${tempFormat?.value} ${tempFormat?.label}`}>
          <Thermometer color={colors.accent} size={18} />
          <Text style={styles.gridValue}>{tempFormat?.value}{tempFormat?.shortLabel}</Text>
          <Text style={styles.gridLabel}>Temp</Text>
        </View>
        <View style={styles.gridItem} accessible accessibilityLabel={`Humidity: ${weather.humidity} percent`}>
          <Droplets color={colors.primary} size={18} />
          <Text style={styles.gridValue}>{weather.humidity}%</Text>
          <Text style={styles.gridLabel}>Humidity</Text>
        </View>
        <View style={styles.gridItem} accessible accessibilityLabel={`Wind: ${windFormat?.value} ${windFormat?.label} from ${getWindDirectionLabel(weather.windDirection)}`}>
          <Wind color={colors.textSecondary} size={18} />
          <Text style={styles.gridValue}>
            {windFormat?.value}
            <Text style={styles.gridUnit}> {windFormat?.shortLabel}</Text>
          </Text>
          <Text style={styles.gridLabel}>{getWindDirectionLabel(weather.windDirection)}</Text>
        </View>
        <View style={styles.gridItem} accessible accessibilityLabel={`Altitude: ${altFormat?.value} ${altFormat?.label}`}>
          <Gauge color={colors.textSecondary} size={18} />
          <Text style={styles.gridValue}>{altFormat?.value}</Text>
          <Text style={styles.gridLabel}>Alt ({altFormat?.shortLabel})</Text>
        </View>
      </View>

      {error && !isOffline && (
        <Text style={styles.errorBanner}>{error}</Text>
      )}
    </View>
  );
});
