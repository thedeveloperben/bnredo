import * as React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { borderRadius } from '@/src/constants/theme';
import { useReduceMotion } from '@/src/hooks/useReduceMotion';
import { styles } from '@/src/styles/ui/Skeleton.styles';

interface SkeletonProps {
  /** Width of the skeleton */
  width?: number | `${number}%`;
  /** Height of the skeleton */
  height?: number;
  /** Border radius variant */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  /** Additional styles */
  style?: StyleProp<ViewStyle>;
}

/**
 * Skeleton loading placeholder with shimmer animation.
 * Respects reduce motion preference by disabling shimmer.
 *
 * @example
 * <Skeleton width={100} height={16} variant="text" />
 * <Skeleton width={48} height={48} variant="circular" />
 */
export function Skeleton({
  width = '100%',
  height = 16,
  variant = 'text',
  style,
}: SkeletonProps) {
  const reduceMotion = useReduceMotion();
  const shimmerProgress = useSharedValue(0);

  React.useEffect(() => {
    if (reduceMotion) {
      shimmerProgress.value = 0;
      return;
    }

    shimmerProgress.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [reduceMotion, shimmerProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    if (reduceMotion) {
      return { opacity: 0.6 };
    }

    const opacity = interpolate(
      shimmerProgress.value,
      [0, 0.5, 1],
      [0.4, 0.7, 0.4]
    );

    return { opacity };
  });

  const getBorderRadius = () => {
    switch (variant) {
      case 'circular':
        return typeof height === 'number' ? height / 2 : borderRadius.full;
      case 'text':
        return borderRadius.sm;
      case 'rounded':
        return borderRadius.md;
      case 'rectangular':
      default:
        return 0;
    }
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: getBorderRadius(),
        },
        animatedStyle,
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    />
  );
}
