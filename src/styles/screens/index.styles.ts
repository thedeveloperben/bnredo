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
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: 4,
    minWidth: 64,
    minHeight: touchTargets.minimum,
    justifyContent: 'center',
  },
  adjustButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    backgroundColor: glass.cardTint.success,
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
  breakdownSubtext: {
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
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
