import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/constants/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
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
    flex: 1,
  },
  locationText: {
    color: colors.textSecondary,
    fontSize: 13,
    flex: 1,
  },
  offlineBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  offlineBadgeText: {
    color: colors.black,
    fontSize: 10,
    fontWeight: '600',
  },
  manualBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  manualBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.sm,
  },
  refreshText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    alignItems: 'center',
    gap: 4,
  },
  gridValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  gridUnit: {
    fontSize: 12,
    fontWeight: '400',
  },
  gridLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  errorBanner: {
    color: colors.warning,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
