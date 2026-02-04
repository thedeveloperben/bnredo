import { StyleSheet } from 'react-native';
import { colors } from '@/src/constants/theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  headingContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  headingValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  headingLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  headingLabelLocked: {
    color: colors.primary,
    fontWeight: '600',
  },
});
