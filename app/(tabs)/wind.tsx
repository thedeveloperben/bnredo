import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Animated,
  AccessibilityInfo,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock, Wind, Navigation, Target, Minus, Plus, AlertCircle, Edit3, Check, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/src/constants/theme';
import { useWeather } from '@/src/contexts/WeatherContext';
import { useUserPreferences } from '@/src/contexts/UserPreferencesContext';
import { getWindDirectionLabel } from '@/src/services/weather-service';
import { WindResultsModal } from '@/src/components/WindResultsModal';
import { CompassDisplay } from '@/src/components/CompassDisplay';
import { useCompassHeading } from '@/src/hooks/useCompassHeading';
import { useHapticSlider } from '@/src/hooks/useHapticSlider';
import { formatWindSpeed, formatDistance } from '@/src/utils/unit-conversions';
import { styles } from '@/src/styles/screens/wind.styles';

export default function WindScreen() {
  const insets = useSafeAreaInsets();
  const { weather, updateManualWeather } = useWeather();
  const { preferences, updatePreferences } = useUserPreferences();
  const { heading, hasPermission } = useCompassHeading();

  const [isLocked, setIsLocked] = React.useState(false);
  const [lockedHeading, setLockedHeading] = React.useState(0);
  const [showResults, setShowResults] = React.useState(false);
  const [targetYardage, setTargetYardage] = React.useState(150);

  // Manual wind input state
  const [showManualInput, setShowManualInput] = React.useState(false);
  const [manualWindSpeed, setManualWindSpeed] = React.useState('');
  const [manualWindGust, setManualWindGust] = React.useState('');
  const [manualWindDirection, setManualWindDirection] = React.useState('');

  // Format helpers based on user preferences
  const windSpeedFormat = formatWindSpeed(weather?.windSpeed ?? 0, preferences.windSpeedUnit);
  const windGustFormat = formatWindSpeed(weather?.windGust ?? 0, preferences.windSpeedUnit);
  const distanceFormat = formatDistance(targetYardage, preferences.distanceUnit);

  // Haptic feedback for slider every 5 yards
  const { onValueChange: onSliderHaptic, reset: resetSliderHaptic } = useHapticSlider({ interval: 5 });

  // Reduce motion preference
  const [reduceMotionEnabled, setReduceMotionEnabled] = React.useState(false);

  React.useEffect(() => {
    const checkReduceMotion = async () => {
      const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      setReduceMotionEnabled(isReduceMotionEnabled);
    };
    checkReduceMotion();

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled) => setReduceMotionEnabled(isEnabled)
    );

    return () => subscription.remove();
  }, []);

  // Animation values for visual feedback
  const lockButtonScale = React.useRef(new Animated.Value(1)).current;
  const fineAdjustScaleMinus = React.useRef(new Animated.Value(1)).current;
  const fineAdjustScalePlus = React.useRef(new Animated.Value(1)).current;

  const animateButtonPress = (scaleValue: Animated.Value) => {
    // Skip animation if reduce motion is enabled
    if (reduceMotionEnabled) {
      return;
    }

    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLock = () => {
    if (!preferences.isPremium) return;
    animateButtonPress(lockButtonScale);
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
    const roundedValue = Math.round(value);
    onSliderHaptic(roundedValue);
    setTargetYardage(roundedValue);
  };

  const handleSliderComplete = () => {
    resetSliderHaptic();
  };

  const adjustYardage = (amount: number, scaleValue: Animated.Value) => {
    animateButtonPress(scaleValue);
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

  // Manual wind input handlers
  const openManualInput = () => {
    if (weather) {
      setManualWindSpeed(String(weather.windSpeed));
      setManualWindGust(String(weather.windGust));
      setManualWindDirection(String(weather.windDirection));
    } else {
      setManualWindSpeed('10');
      setManualWindGust('15');
      setManualWindDirection('0');
    }
    setShowManualInput(true);
  };

  const handleManualWindSubmit = async () => {
    const windSpeed = parseFloat(manualWindSpeed);
    const windGust = parseFloat(manualWindGust);
    const windDirection = parseFloat(manualWindDirection);

    if (!isNaN(windSpeed) && !isNaN(windGust) && !isNaN(windDirection)) {
      await updateManualWeather({
        windSpeed: Math.max(0, Math.min(100, windSpeed)),
        windGust: Math.max(0, Math.min(150, windGust)),
        windDirection: ((windDirection % 360) + 360) % 360,
      });
      setShowManualInput(false);
      triggerHaptic();
    }
  };

  if (!preferences.isPremium) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={['rgba(35, 134, 54, 0.08)', 'transparent']}
          style={styles.gradientOverlay}
          pointerEvents="none"
        />
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

          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={handleUpgrade}
            accessibilityRole="button"
            accessibilityLabel="Unlock Premium features"
            accessibilityHint="Double tap to upgrade to premium and access wind calculator"
          >
            <Text style={styles.upgradeButtonText}>Unlock Premium</Text>
          </TouchableOpacity>
          <Text style={styles.devNote}>(Dev: Tap to simulate premium)</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['rgba(35, 134, 54, 0.08)', 'transparent']}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Point device at target, then lock</Text>

        <View style={styles.compassSection}>
          <CompassDisplay
            heading={heading}
            windDirection={weather?.windDirection ?? 0}
            windSpeed={weather?.windSpeed ?? 0}
            isLocked={isLocked}
            reduceMotion={reduceMotionEnabled}
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
          <TouchableOpacity
            style={styles.windInfoBar}
            onPress={openManualInput}
            accessibilityRole="button"
            accessibilityLabel={`Wind ${windSpeedFormat.value} ${windSpeedFormat.shortLabel}, gusts ${windGustFormat.value} ${windGustFormat.shortLabel}. Tap to enter manual wind`}
            accessibilityHint="Double tap to enter wind data manually"
          >
            <View style={styles.windInfoItem}>
              <Wind color={colors.accent} size={16} />
              <Text style={styles.windInfoText}>
                {windSpeedFormat.value} {windSpeedFormat.shortLabel} {getWindDirectionLabel(weather.windDirection)}
              </Text>
            </View>
            <View style={styles.windInfoDivider} />
            <View style={styles.windInfoItem}>
              <Text style={styles.windInfoLabel}>Gusts:</Text>
              <Text style={styles.windInfoText}>{windGustFormat.value} {windGustFormat.shortLabel}</Text>
            </View>
            <View style={styles.windInfoDivider} />
            <Edit3 color={colors.textSecondary} size={14} />
          </TouchableOpacity>
        ) : (
          <View style={styles.noWeatherBar}>
            <AlertCircle color={colors.textMuted} size={16} />
            <Text style={styles.noWeatherText}>Loading weather data...</Text>
          </View>
        )}

        <View style={styles.distanceSection}>
          <Text style={styles.distanceLabel}>Target Distance</Text>
          <Text style={styles.distanceValue}>{distanceFormat.value} {distanceFormat.shortLabel}</Text>

          <View style={styles.sliderContainer}>
            <TouchableOpacity
              onPress={() => adjustYardage(-1, fineAdjustScaleMinus)}
              accessibilityRole="button"
              accessibilityLabel="Decrease distance by 1 yard"
              accessibilityHint="Double tap to subtract 1 yard"
              activeOpacity={0.7}
            >
              <Animated.View style={[styles.fineAdjustButton, { transform: [{ scale: fineAdjustScaleMinus }] }]}>
                <Minus color={colors.text} size={18} />
              </Animated.View>
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
              accessibilityLabel={`Target distance: ${targetYardage} yards`}
              accessibilityRole="adjustable"
              accessibilityValue={{
                min: 50,
                max: 350,
                now: targetYardage,
                text: `${targetYardage} yards`,
              }}
            />

            <TouchableOpacity
              onPress={() => adjustYardage(1, fineAdjustScalePlus)}
              accessibilityRole="button"
              accessibilityLabel="Increase distance by 1 yard"
              accessibilityHint="Double tap to add 1 yard"
              activeOpacity={0.7}
            >
              <Animated.View style={[styles.fineAdjustButton, { transform: [{ scale: fineAdjustScalePlus }] }]}>
                <Plus color={colors.text} size={18} />
              </Animated.View>
            </TouchableOpacity>
          </View>

          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>50</Text>
            <Text style={styles.sliderLabel}>350</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handleLock}
        disabled={!weather}
        accessibilityRole="button"
        accessibilityLabel="Lock target direction"
        accessibilityHint={weather ? "Double tap to lock current compass heading as target" : "Weather data required to lock target"}
        accessibilityState={{ disabled: !weather }}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.lockButton,
            { bottom: 40 + insets.bottom },
            preferences.handPreference === 'left' && styles.lockButtonLeft,
            !weather && styles.lockButtonDisabled,
            { transform: [{ scale: lockButtonScale }] },
          ]}
        >
          <Target color={weather ? colors.white : colors.textMuted} size={28} />
          <Text style={[styles.lockButtonText, !weather && styles.lockButtonTextDisabled]}>
            Lock Target
          </Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Manual Wind Input Modal */}
      <Modal
        visible={showManualInput}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowManualInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + spacing.lg }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manual Wind Entry</Text>
              <TouchableOpacity
                onPress={() => setShowManualInput(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <X color={colors.text} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Wind Speed ({preferences.windSpeedUnit === 'kmh' ? 'km/h' : 'mph'})</Text>
              <TextInput
                style={styles.textInput}
                value={manualWindSpeed}
                onChangeText={setManualWindSpeed}
                keyboardType="numeric"
                placeholder="10"
                placeholderTextColor={colors.textMuted}
                accessibilityLabel="Wind speed"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gust Speed ({preferences.windSpeedUnit === 'kmh' ? 'km/h' : 'mph'})</Text>
              <TextInput
                style={styles.textInput}
                value={manualWindGust}
                onChangeText={setManualWindGust}
                keyboardType="numeric"
                placeholder="15"
                placeholderTextColor={colors.textMuted}
                accessibilityLabel="Gust speed"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Wind Direction (0-360°)</Text>
              <TextInput
                style={styles.textInput}
                value={manualWindDirection}
                onChangeText={setManualWindDirection}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                accessibilityLabel="Wind direction in degrees"
              />
              <Text style={styles.inputHint}>0° = North, 90° = East, 180° = South, 270° = West</Text>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleManualWindSubmit}
              accessibilityRole="button"
              accessibilityLabel="Apply manual wind settings"
            >
              <Check color={colors.white} size={20} />
              <Text style={styles.submitButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <WindResultsModal
        visible={showResults}
        onClose={handleUnlock}
        targetYardage={targetYardage}
        windAngle={windAngleRelativeToTarget}
      />
    </View>
  );
}
