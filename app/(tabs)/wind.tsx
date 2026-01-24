import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock, Wind, Navigation, Target, Minus, Plus, AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, typography } from '@/src/constants/theme';
import { useWeather } from '@/src/contexts/WeatherContext';
import { useUserPreferences } from '@/src/contexts/UserPreferencesContext';
import { getWindDirectionLabel } from '@/src/services/weather-service';
import { WindResultsModal } from '@/src/components/WindResultsModal';
import { CompassDisplay } from '@/src/components/CompassDisplay';
import { useCompassHeading } from '@/src/hooks/useCompassHeading';

export default function WindScreen() {
  const insets = useSafeAreaInsets();
  const { weather } = useWeather();
  const { preferences, updatePreferences } = useUserPreferences();
  const { heading, hasPermission } = useCompassHeading();

  const [isLocked, setIsLocked] = React.useState(false);
  const [lockedHeading, setLockedHeading] = React.useState(0);
  const [showResults, setShowResults] = React.useState(false);
  const [targetYardage, setTargetYardage] = React.useState(150);

  const handleLock = () => {
    if (!preferences.isPremium) return;
    setLockedHeading(heading);
    setIsLocked(true);
    setShowResults(true);
    triggerHaptic();
  };

  const handleUnlock = () => {
    setIsLocked(false);
    setShowResults(false);
  };

  const handleUpgrade = () => {
    updatePreferences({ isPremium: true });
  };

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleSliderChange = (value: number) => {
    setTargetYardage(Math.round(value));
  };

  const handleSliderComplete = () => {
    triggerHaptic();
  };

  const adjustYardage = (amount: number) => {
    setTargetYardage(prev => {
      const newValue = Math.max(50, Math.min(350, prev + amount));
      if (newValue !== prev) {
        triggerHaptic();
      }
      return newValue;
    });
  };

  const windAngleRelativeToTarget = React.useMemo(() => {
    if (!weather) return 0;
    return ((weather.windDirection - lockedHeading) + 360) % 360;
  }, [weather, lockedHeading]);

  if (!preferences.isPremium) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.lockedContainer}>
          <View style={styles.lockIconContainer}>
            <Lock color={colors.accent} size={64} strokeWidth={1.5} />
          </View>
          <Text style={styles.lockedTitle}>Wind Calculator</Text>
          <Text style={styles.lockedSubtitle}>Premium Feature</Text>
          <Text style={styles.lockedDescription}>
            Get precise wind-adjusted distances with our compass-based wind calculator.
            Lock your target direction and see exactly how the wind affects your shot.
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Navigation color={colors.primary} size={20} />
              <Text style={styles.featureText}>Real-time compass integration</Text>
            </View>
            <View style={styles.featureItem}>
              <Wind color={colors.primary} size={20} />
              <Text style={styles.featureText}>Sustained and gust calculations</Text>
            </View>
            <View style={styles.featureItem}>
              <Target color={colors.primary} size={20} />
              <Text style={styles.featureText}>Lateral aim adjustments</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>Unlock Premium</Text>
          </TouchableOpacity>
          <Text style={styles.devNote}>(Dev: Tap to simulate premium)</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Wind Calculator</Text>
        <Text style={styles.subtitle}>Point device at target, then lock</Text>

        <View style={styles.compassSection}>
          <CompassDisplay
            heading={heading}
            windDirection={weather?.windDirection ?? 0}
            windSpeed={weather?.windSpeed ?? 0}
            isLocked={isLocked}
          />
        </View>

        {!hasPermission && (
          <View style={styles.permissionWarning}>
            <AlertCircle color={colors.warning} size={16} />
            <Text style={styles.permissionWarningText}>
              Compass access required for accurate readings
            </Text>
          </View>
        )}

        {weather ? (
          <View style={styles.windInfoBar}>
            <View style={styles.windInfoItem}>
              <Wind color={colors.accent} size={16} />
              <Text style={styles.windInfoText}>
                {weather.windSpeed} mph {getWindDirectionLabel(weather.windDirection)}
              </Text>
            </View>
            <View style={styles.windInfoDivider} />
            <View style={styles.windInfoItem}>
              <Text style={styles.windInfoLabel}>Gusts:</Text>
              <Text style={styles.windInfoText}>{weather.windGust} mph</Text>
            </View>
          </View>
        ) : (
          <View style={styles.noWeatherBar}>
            <AlertCircle color={colors.textMuted} size={16} />
            <Text style={styles.noWeatherText}>Loading weather data...</Text>
          </View>
        )}

        <View style={styles.distanceSection}>
          <Text style={styles.distanceLabel}>Target Distance</Text>
          <Text style={styles.distanceValue}>{targetYardage} yds</Text>

          <View style={styles.sliderContainer}>
            <TouchableOpacity
              style={styles.fineAdjustButton}
              onPress={() => adjustYardage(-1)}
            >
              <Minus color={colors.text} size={18} />
            </TouchableOpacity>

            <Slider
              style={styles.slider}
              minimumValue={50}
              maximumValue={350}
              step={1}
              value={targetYardage}
              onValueChange={handleSliderChange}
              onSlidingComplete={handleSliderComplete}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.surfaceElevated}
              thumbTintColor={colors.primary}
            />

            <TouchableOpacity
              style={styles.fineAdjustButton}
              onPress={() => adjustYardage(1)}
            >
              <Plus color={colors.text} size={18} />
            </TouchableOpacity>
          </View>

          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>50</Text>
            <Text style={styles.sliderLabel}>350</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.lockButton,
          preferences.handPreference === 'left' && styles.lockButtonLeft,
          !weather && styles.lockButtonDisabled,
        ]}
        onPress={handleLock}
        disabled={!weather}
      >
        <Target color={weather ? colors.white : colors.textMuted} size={28} />
        <Text style={[styles.lockButtonText, !weather && styles.lockButtonTextDisabled]}>
          Lock Target
        </Text>
      </TouchableOpacity>

      <WindResultsModal
        visible={showResults}
        onClose={handleUnlock}
        targetYardage={targetYardage}
        windAngle={windAngleRelativeToTarget}
      />
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
    paddingBottom: 120,
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  lockIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  lockedTitle: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  lockedSubtitle: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  lockedDescription: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  featureList: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  featureText: {
    color: colors.text,
    fontSize: 15,
  },
  upgradeButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 200,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '700',
  },
  devNote: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: spacing.sm,
  },
  compassSection: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  permissionWarningText: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '500',
  },
  noWeatherBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noWeatherText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  windInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  windInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  windInfoDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  windInfoLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  windInfoText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  distanceSection: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  distanceLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  distanceValue: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        fontVariant: ['tabular-nums'],
      },
      android: {
        fontFamily: 'monospace',
      },
    }),
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  fineAdjustButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 44,
    marginTop: spacing.xs,
  },
  sliderLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  lockButton: {
    position: 'absolute',
    bottom: 40,
    right: spacing.lg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  lockButtonLeft: {
    right: undefined,
    left: spacing.lg,
  },
  lockButtonDisabled: {
    backgroundColor: colors.surfaceElevated,
  },
  lockButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  lockButtonTextDisabled: {
    color: colors.textMuted,
  },
});
