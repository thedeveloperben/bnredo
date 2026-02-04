import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, touchTargets, glass } from '@/src/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
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
  sectionTitleNoMargin: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 13,
    fontWeight: '600',
  },
  premiumToggleTextActive: {
    color: colors.text,
  },
  premiumToggleTextInactive: {
    color: colors.black,
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
    minHeight: touchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
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
  weatherProviderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  providerStatus: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  providerName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  providerLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginLeft: 'auto',
  },
  configHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingLeft: spacing.md,
  },
  configHintText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  // Auth styles
  accountInfo: {
    gap: spacing.md,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  accountDetails: {
    flex: 1,
  },
  accountEmail: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  accountHint: {
    color: colors.textMuted,
    fontSize: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  signOutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  authForm: {
    gap: spacing.sm,
  },
  authInput: {
    backgroundColor: colors.surfaceElevated,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    fontSize: 15,
  },
  authButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
  authButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  authToggle: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  authToggleText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  authError: {
    color: colors.error,
    fontSize: 13,
    textAlign: 'center',
  },
});
