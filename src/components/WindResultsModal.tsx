import * as React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  AccessibilityInfo,
  findNodeHandle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Wind, AlertTriangle, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react-native';
import { colors, spacing, hitSlop } from '@/src/constants/theme';
import { useWeather } from '@/src/contexts/WeatherContext';
import { useClubBag } from '@/src/contexts/ClubBagContext';
import { useUserPreferences } from '@/src/contexts/UserPreferencesContext';
import { calculateWindEffect } from '@/src/core/services/wind-calculator';
import { EnvironmentalCalculator } from '@/src/core/services/environmental-calculations';
import { formatDistance, formatWindSpeed } from '@/src/utils/unit-conversions';
import { styles } from '@/src/styles/components/WindResultsModal.styles';

interface WindResultsModalProps {
  visible: boolean;
  onClose: () => void;
  targetYardage: number;
  windAngle: number;
}

interface CalculationResult {
  adjustedYardage: number;
  lateralOffset: number;
  recommendedClub: string | null;
  windEffect: number;
  environmentalEffect: number;
}

export function WindResultsModal({
  visible,
  onClose,
  targetYardage,
  windAngle,
}: WindResultsModalProps) {
  const insets = useSafeAreaInsets();
  const { weather } = useWeather();
  const { getRecommendedClub } = useClubBag();
  const { preferences } = useUserPreferences();
  const firstResultRef = React.useRef<View>(null);

  // Format values based on user preferences
  const targetFormat = formatDistance(targetYardage, preferences.distanceUnit);
  const windSpeedFormat = weather ? formatWindSpeed(weather.windSpeed, preferences.windSpeedUnit) : null;
  const gustSpeedFormat = weather ? formatWindSpeed(weather.windGust, preferences.windSpeedUnit) : null;

  const calculations = React.useMemo(() => {
    if (!weather || !visible) return null;

    const conditions = {
      temperature: weather.temperature,
      humidity: weather.humidity,
      pressure: weather.pressure,
      altitude: weather.altitude,
      windSpeed: weather.windSpeed,
      windDirection: windAngle,
      windGust: weather.windGust,
      density: EnvironmentalCalculator.calculateAirDensity({
        temperature: weather.temperature,
        humidity: weather.humidity,
        pressure: weather.pressure,
      }),
    };

    const club = getRecommendedClub(targetYardage);
    if (!club) return null;

    const sustainedResult = calculateWindEffect({
      targetYardage,
      windSpeed: weather.windSpeed,
      windAngle,
      clubName: club.key,
      conditions,
    });

    const gustConditions = { ...conditions, windSpeed: weather.windGust };
    const gustResult = calculateWindEffect({
      targetYardage,
      windSpeed: weather.windGust,
      windAngle,
      clubName: club.key,
      conditions: gustConditions,
    });

    const sustainedYardage = sustainedResult
      ? Math.round(sustainedResult.totalDistance)
      : targetYardage;
    const gustYardage = gustResult
      ? Math.round(gustResult.totalDistance)
      : targetYardage;

    const sustainedClub = getRecommendedClub(sustainedYardage);
    const gustClub = getRecommendedClub(gustYardage);

    return {
      sustained: {
        adjustedYardage: sustainedYardage,
        lateralOffset: sustainedResult ? Math.round(sustainedResult.lateralEffect) : 0,
        recommendedClub: sustainedClub?.name || null,
        windEffect: sustainedResult?.windEffect || 0,
        environmentalEffect: sustainedResult?.environmentalEffect || 0,
      } as CalculationResult,
      gust: {
        adjustedYardage: gustYardage,
        lateralOffset: gustResult ? Math.round(gustResult.lateralEffect) : 0,
        recommendedClub: gustClub?.name || null,
        windEffect: gustResult?.windEffect || 0,
        environmentalEffect: gustResult?.environmentalEffect || 0,
      } as CalculationResult,
    };
  }, [weather, visible, targetYardage, windAngle, getRecommendedClub]);

  const getAimDirection = (offset: number): string => {
    if (Math.abs(offset) < 1) return 'On target';
    const dist = formatDistance(Math.abs(offset), preferences.distanceUnit);
    return offset > 0 ? `Aim ${dist.value} ${dist.shortLabel} RIGHT` : `Aim ${dist.value} ${dist.shortLabel} LEFT`;
  };

  React.useEffect(() => {
    if (visible && firstResultRef.current) {
      const reactTag = findNodeHandle(firstResultRef.current);
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    }
  }, [visible]);

  if (!calculations) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close wind calculation"
            hitSlop={hitSlop.medium}
          >
            <X color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.title} accessibilityRole="header">Wind Calculation</Text>
          <TouchableOpacity
            style={styles.recalcButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Recalculate wind effect"
            hitSlop={hitSlop.medium}
          >
            <RotateCcw color={colors.primary} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.targetInfo}>
            <Text style={styles.targetLabel}>Target Distance</Text>
            <Text style={styles.targetValue}>{targetFormat.value} {targetFormat.label}</Text>
          </View>

          <View
            ref={firstResultRef}
            style={styles.scenarioCard}
            accessible
            accessibilityLabel={`Sustained wind at ${windSpeedFormat?.value} ${windSpeedFormat?.label}. Plays like ${formatDistance(calculations.sustained.adjustedYardage, preferences.distanceUnit).value} ${formatDistance(calculations.sustained.adjustedYardage, preferences.distanceUnit).label}. ${getAimDirection(calculations.sustained.lateralOffset)}. ${calculations.sustained.recommendedClub ? `Recommended club: ${calculations.sustained.recommendedClub}` : ''}`}
          >
            <View style={styles.scenarioHeader}>
              <Wind color={colors.primary} size={20} />
              <Text style={styles.scenarioTitle}>Sustained Wind</Text>
              <Text style={styles.windSpeed}>{windSpeedFormat?.value} {windSpeedFormat?.shortLabel}</Text>
            </View>

            <View style={styles.mainResult}>
              <Text style={styles.playsLikeLabel}>Plays Like</Text>
              <Text style={styles.playsLikeValue}>
                {formatDistance(calculations.sustained.adjustedYardage, preferences.distanceUnit).value}
                <Text style={styles.playsLikeUnit}> {formatDistance(calculations.sustained.adjustedYardage, preferences.distanceUnit).shortLabel}</Text>
              </Text>
            </View>

            <View style={styles.aimIndicator}>
              {calculations.sustained.lateralOffset > 0 ? (
                <ArrowRight color={colors.accent} size={24} />
              ) : calculations.sustained.lateralOffset < 0 ? (
                <ArrowLeft color={colors.accent} size={24} />
              ) : null}
              <Text style={styles.aimText}>
                {getAimDirection(calculations.sustained.lateralOffset)}
              </Text>
            </View>

            {calculations.sustained.recommendedClub && (
              <View style={styles.clubRecommendation}>
                <Text style={styles.clubLabel}>Recommended</Text>
                <Text style={styles.clubName}>
                  {calculations.sustained.recommendedClub}
                </Text>
              </View>
            )}
          </View>

          <View
            style={[styles.scenarioCard, styles.gustCard]}
            accessible
            accessibilityLabel={`With gusts at ${gustSpeedFormat?.value} ${gustSpeedFormat?.label}. Plays like ${formatDistance(calculations.gust.adjustedYardage, preferences.distanceUnit).value} ${formatDistance(calculations.gust.adjustedYardage, preferences.distanceUnit).label}. ${getAimDirection(calculations.gust.lateralOffset)}. ${calculations.gust.recommendedClub ? `Recommended club: ${calculations.gust.recommendedClub}` : ''}`}
          >
            <View style={styles.scenarioHeader}>
              <AlertTriangle color={colors.warning} size={20} />
              <Text style={styles.scenarioTitle}>With Gusts</Text>
              <Text style={[styles.windSpeed, { color: colors.warning }]}>
                {gustSpeedFormat?.value} {gustSpeedFormat?.shortLabel}
              </Text>
            </View>

            <View style={styles.mainResult}>
              <Text style={styles.playsLikeLabel}>Plays Like</Text>
              <Text style={[styles.playsLikeValue, { color: colors.warning }]}>
                {formatDistance(calculations.gust.adjustedYardage, preferences.distanceUnit).value}
                <Text style={styles.playsLikeUnit}> {formatDistance(calculations.gust.adjustedYardage, preferences.distanceUnit).shortLabel}</Text>
              </Text>
            </View>

            <View style={styles.aimIndicator}>
              {calculations.gust.lateralOffset > 0 ? (
                <ArrowRight color={colors.warning} size={24} />
              ) : calculations.gust.lateralOffset < 0 ? (
                <ArrowLeft color={colors.warning} size={24} />
              ) : null}
              <Text style={[styles.aimText, { color: colors.warning }]}>
                {getAimDirection(calculations.gust.lateralOffset)}
              </Text>
            </View>

            {calculations.gust.recommendedClub && (
              <View style={styles.clubRecommendation}>
                <Text style={styles.clubLabel}>Recommended</Text>
                <Text style={[styles.clubName, { color: colors.warning }]}>
                  {calculations.gust.recommendedClub}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>Effect Breakdown</Text>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Environmental</Text>
              <Text style={styles.breakdownValue}>
                {calculations.sustained.environmentalEffect > 0 ? '+' : ''}
                {preferences.distanceUnit === 'meters'
                  ? (calculations.sustained.environmentalEffect * 0.9144).toFixed(1)
                  : calculations.sustained.environmentalEffect.toFixed(1)} {preferences.distanceUnit === 'meters' ? 'm' : 'yds'}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Wind (sustained)</Text>
              <Text style={styles.breakdownValue}>
                {calculations.sustained.windEffect > 0 ? '+' : ''}
                {preferences.distanceUnit === 'meters'
                  ? (calculations.sustained.windEffect * 0.9144).toFixed(1)
                  : calculations.sustained.windEffect.toFixed(1)} {preferences.distanceUnit === 'meters' ? 'm' : 'yds'}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Wind (gusts)</Text>
              <Text style={[styles.breakdownValue, { color: colors.warning }]}>
                {calculations.gust.windEffect > 0 ? '+' : ''}
                {preferences.distanceUnit === 'meters'
                  ? (calculations.gust.windEffect * 0.9144).toFixed(1)
                  : calculations.gust.windEffect.toFixed(1)} {preferences.distanceUnit === 'meters' ? 'm' : 'yds'}
              </Text>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Back to compass"
          accessibilityHint="Double tap to return to the wind calculator compass"
        >
          <Text style={styles.doneButtonText}>Back to Compass</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
