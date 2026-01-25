import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/constants/theme';
import { Skeleton } from './Skeleton';

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    alignItems: 'center',
    gap: 4,
  },
  valueGap: {
    marginTop: 4,
  },
});
