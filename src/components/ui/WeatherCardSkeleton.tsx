import * as React from 'react';
import { View } from 'react-native';
import { Skeleton } from './Skeleton';
import { styles } from '@/src/styles/ui/WeatherCardSkeleton.styles';

/**
 * Skeleton loading state for WeatherCard.
 * Mirrors the layout of WeatherCard for seamless loading transition.
 *
 * @example
 * {isLoading ? <WeatherCardSkeleton /> : <WeatherCard />}
 */
export function WeatherCardSkeleton() {
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading weather data"
    >
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.locationRow}>
          <Skeleton width={14} height={14} variant="circular" />
          <Skeleton width={120} height={14} variant="text" />
        </View>
        <Skeleton width={16} height={16} variant="circular" />
      </View>

      {/* Grid row - 4 items */}
      <View style={styles.grid}>
        <GridItemSkeleton />
        <GridItemSkeleton />
        <GridItemSkeleton />
        <GridItemSkeleton />
      </View>
    </View>
  );
}

function GridItemSkeleton() {
  return (
    <View style={styles.gridItem}>
      <Skeleton width={18} height={18} variant="circular" />
      <Skeleton width={40} height={18} variant="text" style={styles.valueGap} />
      <Skeleton width={32} height={12} variant="text" />
    </View>
  );
}
