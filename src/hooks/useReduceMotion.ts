import { useState, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Hook to detect system reduce motion preference.
 * Use this to disable or simplify animations for accessibility.
 *
 * @returns boolean - true if user prefers reduced motion
 *
 * @example
 * const reduceMotion = useReduceMotion();
 * // Use instant values instead of animations when reduceMotion is true
 * scale.value = reduceMotion ? 0.97 : withSpring(0.97, springConfigs.snappy);
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const checkReduceMotion = async () => {
      const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      setReduceMotion(isEnabled);
    };
    checkReduceMotion();

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled) => setReduceMotion(isEnabled)
    );

    return () => subscription.remove();
  }, []);

  return reduceMotion;
}
