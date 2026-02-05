import { StyleSheet } from 'react-native';
import { colors } from '@/src/constants/theme';

export const styles = StyleSheet.create({
  tintOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  fallbackBackground: {
    backgroundColor: colors.surfaceElevated,
  },
});
