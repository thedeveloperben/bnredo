import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '@/src/constants/theme';
import { WeatherCard } from '@/src/components/WeatherCard';
import { useWeather } from '@/src/contexts/WeatherContext';
import { useClubBag } from '@/src/contexts/ClubBagContext';
import { EnvironmentalCalculator } from '@/src/core/services/environmental-calculations';

export default function ShotScreen() {
  const insets = useSafeAreaInsets();
  const { weather } = useWeather();
  const { getRecommendedClub } = useClubBag();

  const [targetYardage, setTargetYardage] = React.useState(150);
  const [showBreakdown, setShowBreakdown] = React.useState(false);

  const calculations = React.useMemo(() => {
    if (!weather) return null;

    const conditions = {
      temperature: weather.temperature,
      humidity: weather.humidity,
      pressure: weather.pressure,
      altitude: weather.altitude,
      windSpeed: 0,
      windDirection: 0,
      windGust: 0,
      density: EnvironmentalCalculator.calculateAirDensity({
        temperature: weather.temperature,
        humidity: weather.humidity,
        pressure: weather.pressure,
      }),
    };

    const adjustments = EnvironmentalCalculator.calculateShotAdjustments(conditions);
    const altitudeEffect = EnvironmentalCalculator.calculateAltitudeEffect(weather.altitude);

    const totalAdjustmentPercent = adjustments.distanceAdjustment + altitudeEffect;
    const adjustedYardage = Math.round(targetYardage * (1 + totalAdjustmentPercent / 100));

    return {
      adjustedYardage,
      adjustments,
      altitudeEffect,
      totalAdjustmentPercent,
    };
  }, [weather, targetYardage]);

  const recommendedClub = React.useMemo(() => {
    if (!calculations) return null;
    return getRecommendedClub(calculations.adjustedYardage);
  }, [calculations, getRecommendedClub]);

  const handleIncrement = (amount: number) => {
    setTargetYardage(prev => Math.min(350, Math.max(50, prev + amount)));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Shot Calculator</Text>

        <WeatherCard />

        <View style={styles.yardageSection}>
          <Text style={styles.sectionLabel}>Target Distance</Text>

          <View style={styles.yardageDisplay}>
            <Text style={styles.yardageValue}>{targetYardage}</Text>
            <Text style={styles.yardageUnit}>yards</Text>
          </View>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={50}
              maximumValue={350}
              step={1}
              value={targetYardage}
              onValueChange={setTargetYardage}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>50</Text>
              <Text style={styles.sliderLabel}>350</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => handleIncrement(-5)}
            >
              <Minus color={colors.text} size={20} />
              <Text style={styles.adjustButtonText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => handleIncrement(-1)}
            >
              <Minus color={colors.text} size={20} />
              <Text style={styles.adjustButtonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => handleIncrement(1)}
            >
              <Plus color={colors.text} size={20} />
              <Text style={styles.adjustButtonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => handleIncrement(5)}
            >
              <Plus color={colors.text} size={20} />
              <Text style={styles.adjustButtonText}>5</Text>
            </TouchableOpacity>
          </View>
        </View>

        {calculations && (
          <View style={styles.resultSection}>
            <Text style={styles.playsLikeLabel}>Plays Like</Text>
            <Text style={styles.playsLikeValue}>
              {calculations.adjustedYardage}
              <Text style={styles.playsLikeUnit}> yards</Text>
            </Text>

            {recommendedClub && (
              <View style={styles.clubRecommendation}>
                <Text style={styles.clubLabel}>Recommended Club</Text>
                <Text style={styles.clubName}>{recommendedClub.name}</Text>
                <Text style={styles.clubDistance}>
                  ({recommendedClub.customDistance} yard club)
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.breakdownToggle}
              onPress={() => setShowBreakdown(!showBreakdown)}
            >
              <Text style={styles.breakdownToggleText}>
                {showBreakdown ? 'Hide' : 'Show'} Breakdown
              </Text>
              {showBreakdown ? (
                <ChevronUp color={colors.textSecondary} size={16} />
              ) : (
                <ChevronDown color={colors.textSecondary} size={16} />
              )}
            </TouchableOpacity>

            {showBreakdown && (
              <View style={styles.breakdown}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Air Density Effect</Text>
                  <Text style={styles.breakdownValue}>
                    {calculations.adjustments.distanceAdjustment > 0 ? '+' : ''}
                    {calculations.adjustments.distanceAdjustment.toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Altitude Effect</Text>
                  <Text style={styles.breakdownValue}>
                    +{calculations.altitudeEffect.toFixed(1)}%
                  </Text>
                </View>
                <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                  <Text style={styles.breakdownTotalLabel}>Total Adjustment</Text>
                  <Text style={styles.breakdownTotalValue}>
                    {calculations.totalAdjustmentPercent > 0 ? '+' : ''}
                    {calculations.totalAdjustmentPercent.toFixed(1)}%
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  yardageSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  yardageDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  yardageValue: {
    ...typography.largeTitle,
    color: colors.text,
  },
  yardageUnit: {
    color: colors.textSecondary,
    fontSize: 18,
    marginLeft: spacing.xs,
  },
  sliderContainer: {
    marginBottom: spacing.md,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  sliderLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  adjustButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 4,
    minWidth: 64,
    justifyContent: 'center',
  },
  adjustButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  playsLikeLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  playsLikeValue: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  playsLikeUnit: {
    fontSize: 20,
    fontWeight: '400',
  },
  clubRecommendation: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clubLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  clubName: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '700',
  },
  clubDistance: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  breakdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  breakdownToggleText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  breakdown: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  breakdownLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  breakdownValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  breakdownTotal: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  breakdownTotalLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  breakdownTotalValue: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
