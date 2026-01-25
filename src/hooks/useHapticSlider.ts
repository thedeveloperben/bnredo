import { useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface UseHapticSliderOptions {
  /** Interval at which to trigger haptics (default: 5) */
  interval?: number;
  /** Whether haptics are enabled (default: true) */
  enabled?: boolean;
}

/**
 * Hook that provides haptic feedback at regular intervals during slider changes.
 * Triggers Haptics.selectionAsync() every `interval` units of change.
 *
 * @example
 * const { onValueChange } = useHapticSlider({ interval: 5 });
 * <Slider onValueChange={(v) => { onValueChange(v); setTargetYardage(v); }} />
 */
export function useHapticSlider(options: UseHapticSliderOptions = {}) {
  const { interval = 5, enabled = true } = options;
  const lastBucketRef = useRef<number | null>(null);

  const triggerHaptic = useCallback(() => {
    if (Platform.OS === 'web') return;
    Haptics.selectionAsync();
  }, []);

  const onValueChange = useCallback(
    (value: number) => {
      if (!enabled) return;

      const currentBucket = Math.floor(value / interval);

      if (lastBucketRef.current !== null && currentBucket !== lastBucketRef.current) {
        triggerHaptic();
      }

      lastBucketRef.current = currentBucket;
    },
    [enabled, interval, triggerHaptic]
  );

  const reset = useCallback(() => {
    lastBucketRef.current = null;
  }, []);

  return {
    /** Call this with the slider value on each change */
    onValueChange,
    /** Reset the bucket tracking (e.g., when slider is released) */
    reset,
    /** Manually trigger a haptic */
    triggerHaptic,
  };
}
