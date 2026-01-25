import { useEffect, useRef } from 'react';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { useReduceMotion } from './useReduceMotion';
import { animation } from '@/src/constants/theme';

interface UseInterpolatedHeadingOptions {
  /** Duration of the interpolation in ms (default: 200) */
  duration?: number;
  /** Whether to animate (default: true, respects reduce motion) */
  animated?: boolean;
}

/**
 * Hook that provides smooth interpolation for compass heading values.
 * Handles the 0/360 degree wraparound to prevent spinning the wrong way.
 *
 * @param heading - Current heading in degrees (0-360)
 * @param options - Configuration options
 * @returns Shared value for animated heading
 *
 * @example
 * const { heading } = useCompassHeading();
 * const interpolatedHeading = useInterpolatedHeading(heading);
 *
 * const animatedStyle = useAnimatedStyle(() => ({
 *   transform: [{ rotate: `${-interpolatedHeading.value}deg` }],
 * }));
 */
export function useInterpolatedHeading(
  heading: number,
  options: UseInterpolatedHeadingOptions = {}
) {
  const { duration = animation.duration.fast, animated = true } = options;
  const reduceMotion = useReduceMotion();
  const animatedHeading = useSharedValue(heading);
  const previousHeading = useRef(heading);

  useEffect(() => {
    const shouldAnimate = animated && !reduceMotion;

    if (!shouldAnimate) {
      // Instant update when animations disabled
      animatedHeading.value = heading;
      previousHeading.current = heading;
      return;
    }

    // Calculate the shortest path considering 0/360 wraparound
    const delta = shortestRotation(previousHeading.current, heading);
    const targetHeading = animatedHeading.value + delta;

    animatedHeading.value = withTiming(targetHeading, {
      duration,
      easing: Easing.out(Easing.cubic),
    });

    previousHeading.current = heading;
  }, [heading, animated, reduceMotion, duration, animatedHeading]);

  return animatedHeading;
}

/**
 * Calculate the shortest rotation between two angles.
 * Returns a delta that can be added to the current angle.
 *
 * @param from - Starting angle in degrees
 * @param to - Target angle in degrees
 * @returns Delta in degrees (-180 to 180)
 */
function shortestRotation(from: number, to: number): number {
  // Normalize angles to 0-360 range
  const normalizedFrom = ((from % 360) + 360) % 360;
  const normalizedTo = ((to % 360) + 360) % 360;

  // Calculate direct delta
  let delta = normalizedTo - normalizedFrom;

  // Adjust for shortest path
  if (delta > 180) {
    delta -= 360;
  } else if (delta < -180) {
    delta += 360;
  }

  return delta;
}
