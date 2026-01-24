import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Crown, Check } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '@/src/constants/theme';
import { useUserPreferences } from '@/src/contexts/UserPreferencesContext';
import { useClubBag } from '@/src/contexts/ClubBagContext';

type OptionValue = string;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { preferences, updatePreferences } = useUserPreferences();
  const { clubs, updateClub } = useClubBag();
  const [showClubBag, setShowClubBag] = React.useState(false);
  const [editingClub, setEditingClub] = React.useState<string | null>(null);
  const [editDistance, setEditDistance] = React.useState('');

  const handleDistanceSubmit = (clubKey: string) => {
    const distance = parseInt(editDistance, 10);
    if (!isNaN(distance) && distance > 0 && distance <= 400) {
      updateClub(clubKey, { customDistance: distance });
    }
    setEditingClub(null);
    setEditDistance('');
  };

  const renderOption = (
    label: string,
    value: OptionValue,
    options: Array<{ label: string; value: OptionValue }>,
    onSelect: (value: OptionValue) => void
  ) => (
    <View style={styles.optionRow}>
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={styles.optionButtons}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              value === option.value && styles.optionButtonActive,
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text
              style={[
                styles.optionButtonText,
                value === option.value && styles.optionButtonTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <View style={styles.premiumBanner}>
            <View style={styles.premiumHeader}>
              <Crown
                color={preferences.isPremium ? colors.accent : colors.textSecondary}
                size={24}
              />
              <View style={styles.premiumInfo}>
                <Text style={styles.premiumTitle}>
                  {preferences.isPremium ? 'Premium Active' : 'Free Plan'}
                </Text>
                <Text style={styles.premiumSubtitle}>
                  {preferences.isPremium
                    ? 'All features unlocked'
                    : 'Wind Calculator locked'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.premiumToggle,
                preferences.isPremium && styles.premiumToggleActive,
              ]}
              onPress={() => updatePreferences({ isPremium: !preferences.isPremium })}
            >
              <Text style={styles.premiumToggleText}>
                {preferences.isPremium ? 'Downgrade' : 'Upgrade'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.devNote}>(Dev toggle for testing)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Units</Text>

          {renderOption(
            'Distance',
            preferences.distanceUnit,
            [
              { label: 'Yards', value: 'yards' },
              { label: 'Meters', value: 'meters' },
            ],
            value => updatePreferences({ distanceUnit: value as 'yards' | 'meters' })
          )}

          {renderOption(
            'Temperature',
            preferences.temperatureUnit,
            [
              { label: '°F', value: 'fahrenheit' },
              { label: '°C', value: 'celsius' },
            ],
            value => updatePreferences({ temperatureUnit: value as 'fahrenheit' | 'celsius' })
          )}

          {renderOption(
            'Wind Speed',
            preferences.windSpeedUnit,
            [
              { label: 'mph', value: 'mph' },
              { label: 'km/h', value: 'kmh' },
            ],
            value => updatePreferences({ windSpeedUnit: value as 'mph' | 'kmh' })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hand Preference</Text>

          {renderOption(
            'Dominant Hand',
            preferences.handPreference,
            [
              { label: 'Right', value: 'right' },
              { label: 'Left', value: 'left' },
            ],
            value => updatePreferences({ handPreference: value as 'right' | 'left' })
          )}
          <Text style={styles.hint}>
            Affects lock button placement in Wind Calculator
          </Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowClubBag(!showClubBag)}
          >
            <Text style={styles.sectionTitle}>My Clubs</Text>
            <ChevronRight
              color={colors.textSecondary}
              size={20}
              style={{ transform: [{ rotate: showClubBag ? '90deg' : '0deg' }] }}
            />
          </TouchableOpacity>

          {showClubBag && (
            <View style={styles.clubList}>
              {clubs.map(club => (
                <View key={club.key} style={styles.clubRow}>
                  <Switch
                    value={club.isEnabled}
                    onValueChange={value => updateClub(club.key, { isEnabled: value })}
                    trackColor={{ false: colors.border, true: colors.primaryDark }}
                    thumbColor={club.isEnabled ? colors.primary : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.clubName,
                      !club.isEnabled && styles.clubNameDisabled,
                    ]}
                  >
                    {club.name}
                  </Text>

                  {editingClub === club.key ? (
                    <View style={styles.distanceInput}>
                      <TextInput
                        style={styles.distanceTextInput}
                        value={editDistance}
                        onChangeText={setEditDistance}
                        keyboardType="number-pad"
                        autoFocus
                        selectTextOnFocus
                        maxLength={3}
                      />
                      <TouchableOpacity
                        style={styles.distanceSave}
                        onPress={() => handleDistanceSubmit(club.key)}
                      >
                        <Check color={colors.primary} size={18} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.distanceButton}
                      onPress={() => {
                        setEditingClub(club.key);
                        setEditDistance(String(club.customDistance));
                      }}
                    >
                      <Text style={styles.distanceText}>
                        {club.customDistance} yds
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>AICaddy Pro v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            PGA Tour average distances used as defaults
          </Text>
        </View>
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
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  premiumInfo: {
    gap: 2,
  },
  premiumTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  premiumSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  premiumToggle: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  premiumToggleActive: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  premiumToggleText: {
    color: colors.black,
    fontSize: 13,
    fontWeight: '600',
  },
  devNote: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  optionLabel: {
    color: colors.text,
    fontSize: 15,
  },
  optionButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  optionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    minWidth: 64,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: colors.primary,
  },
  optionButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  optionButtonTextActive: {
    color: colors.white,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  clubList: {
    marginTop: spacing.sm,
  },
  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  clubName: {
    color: colors.text,
    fontSize: 15,
    flex: 1,
    marginLeft: spacing.md,
  },
  clubNameDisabled: {
    color: colors.textMuted,
  },
  distanceButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.sm,
  },
  distanceText: {
    color: colors.text,
    fontSize: 14,
  },
  distanceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  distanceTextInput: {
    backgroundColor: colors.surfaceElevated,
    color: colors.text,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    width: 60,
    textAlign: 'center',
    fontSize: 14,
  },
  distanceSave: {
    padding: spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  footerSubtext: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
});
