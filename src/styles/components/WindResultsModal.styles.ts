import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, borderRadius, typography, glass } from '@/src/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.sm,
  },
  title: {
    ...typography.headline,
    color: colors.text,
  },
  recalcButton: {
    padding: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  targetInfo: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  targetLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  targetValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
  },
  scenarioCard: {
    backgroundColor: glass.cardTint.success,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  gustCard: {
    backgroundColor: colors.surface,
    borderColor: colors.warning,
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  scenarioTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  windSpeed: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  mainResult: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  playsLikeLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  playsLikeValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
  },
  playsLikeUnit: {
    fontSize: 18,
    fontWeight: '400',
  },
  aimIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  aimText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  clubRecommendation: {
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clubLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  clubName: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '700',
  },
  breakdownSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdownTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.md,
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
  doneButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
    marginBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  doneButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
