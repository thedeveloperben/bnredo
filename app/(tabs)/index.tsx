import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react-native';
import { colors } from '@/src/constants/theme';
import { WeatherCard } from '@/src/components/WeatherCard';
import { useWeather } from '@/src/contexts/WeatherContext';
import { useClubBag } from '@/src/contexts/ClubBagContext';
import { useUserPreferences } from '@/src/contexts/UserPreferencesContext';
import { YardageModelEnhanced, SkillLevel } from '@/src/core/models/yardagemodel';
import { useHapticSlider } from '@/src/hooks/useHapticSlider';
import { formatDistance } from '@/src/utils/unit-conversions';
import { styles } from '@/src/styles/screens/index.styles';

export default function ShotScreen() {
  const insets = useSafeAreaInsets();
  const { weather } = useWeather();
  const { getRecommendedClub } = useClubBag();
  const { preferences } = useUserPreferences();

  const [targetYardage, setTargetYardage] = React.useState(150);
  const [showBreakdown, setShowBreakdown] = React.useState(false);

  // Haptic feedback for slider every 5 yards
  const { onValueChange: onSliderHaptic, reset: resetSliderHaptic } = useHapticSlider({ interval: 5 });

  const calculations = React.useMemo(() => {
    if (!weather) return null;

    // Use YardageModelEnhanced for environmental calculations (same as wind calculator)
    const yardageModel = new YardageModelEnhanced();
    yardageModel.setBallModel('tour_premium');
    
    // Set conditions with NO wind (shot calculator doesn't include wind)
    yardageModel.setConditions(
      weather.temperature,
      weather.altitude,
      0, // No wind
      0, // No wind direction
      weather.pressure,
      weather.humidity
    );

    // Use 7-iron as reference club (environmental factor doesn't depend on club choice)
    const envResult = yardageModel.calculateAdjustedYardage(
      targetYardage,
      SkillLevel.PROFESSIONAL,
      '7-iron'
    );

    // Calculate environmental effect in yards (positive = plays longer)
    const envEffectYards = -(envResult.carryDistance - targetYardage);
    
    // Convert to percentage for display
    const totalAdjustmentPercent = (envEffectYards / targetYardage) * 100;
    
    // Adjusted yardage is the "plays like" distance
    const adjustedYardage = Math.round(targetYardage + envEffectYards);

    return {
      adjustedYardage,
      totalAdjustmentPercent,
    };
  }, [weather, targetYardage]);

  const recommendedClub = React.useMemo(() => {
    if (!calculations) return null;
    return getRecommendedClub(calculations.adjustedYardage);
  }, [calculations, getRecommendedClub]);

  // Format distances based on user preferences
  const targetFormat = formatDistance(targetYardage, preferences.distanceUnit);
  const adjustedFormat = calculations ? formatDistance(calculations.adjustedYardage, preferences.distanceUnit) : null;
  const clubDistanceFormat = recommendedClub ? formatDistance(recommendedClub.customDistance, preferences.distanceUnit) : null;

  const handleIncrement = (amount: number) => {
    setTargetYardage(prev => Math.min(350, Math.max(50, prev + amount)));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['rgba(35, 134, 54, 0.08)', 'transparent']}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WeatherCard />

        <View style={styles.yardageSection}>
          <Text style={styles.sectionLabel}>Target Distance</Text>

          <View style={styles.yardageDisplay}>
            <Text style={styles.yardageValue}>{targetFormat.value}</Text>
            <Text style={styles.yardageUnit}>{targetFormat.label}</Text>
          </View>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={50}
              maximumValue={350}
              step={1}
              value={targetYardage}
              onValueChange={(value) => {
                onSliderHaptic(value);
                setTargetYardage(value);
              }}
              onSlidingComplete={resetSliderHaptic}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
              accessibilityLabel={`Target distance: ${targetFormat.value} ${targetFormat.label}`}
              accessibilityRole="adjustable"
              accessibilityValue={{
                min: 50,
                max: 350,
                now: targetYardage,
                text: `${targetFormat.value} ${targetFormat.label}`,
              }}
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
              accessibilityRole="button"
              accessibilityLabel="Decrease distance by 5 yards"
              accessibilityHint="Double tap to subtract 5 yards from target distance"
            >
              <Minus color={colors.text} size={20} />
              <Text style={styles.adjustButtonText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => handleIncrement(-1)}
              accessibilityRole="button"
              accessibilityLabel="Decrease distance by 1 yard"
              accessibilityHint="Double tap to subtract 1 yard from target distance"
            >
              <Minus color={colors.text} size={20} />
              <Text style={styles.adjustButtonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => handleIncrement(1)}
              accessibilityRole="button"
              accessibilityLabel="Increase distance by 1 yard"
              accessibilityHint="Double tap to add 1 yard to target distance"
            >
              <Plus color={colors.text} size={20} />
              <Text style={styles.adjustButtonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => handleIncrement(5)}
              accessibilityRole="button"
              accessibilityLabel="Increase distance by 5 yards"
              accessibilityHint="Double tap to add 5 yards to target distance"
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
              {adjustedFormat?.value}
              <Text style={styles.playsLikeUnit}> {adjustedFormat?.label}</Text>
            </Text>

            {recommendedClub && (
              <View style={styles.clubRecommendation}>
                <Text style={styles.clubLabel}>Recommended Club</Text>
                <Text style={styles.clubName}>{recommendedClub.name}</Text>
                <Text style={styles.clubDistance}>
                  ({clubDistanceFormat?.value} {clubDistanceFormat?.shortLabel} club)
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.breakdownToggle}
              onPress={() => setShowBreakdown(!showBreakdown)}
              accessibilityRole="button"
              accessibilityLabel={`${showBreakdown ? 'Hide' : 'Show'} calculation breakdown`}
              accessibilityState={{ expanded: showBreakdown }}
              accessibilityHint="Double tap to toggle breakdown details"
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
                  <Text style={styles.breakdownLabel}>Environmental Effect</Text>
                  <Text style={styles.breakdownSubtext}>
                    (includes air density and altitude)
                  </Text>
                  <Text style={styles.breakdownValue}>
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
