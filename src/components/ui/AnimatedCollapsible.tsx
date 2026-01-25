import * as React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useReduceMotion } from '@/src/hooks/useReduceMotion';
import { animation } from '@/src/constants/theme';

interface AnimatedCollapsibleProps {
  /** Whether the content is expanded */
  expanded: boolean;
  /** Content to show/hide */
  children: React.ReactNode;
  /** Duration of animation in ms */
  duration?: number;
  /** Additional styles for the container */
  style?: StyleProp<ViewStyle>;
}

/**
 * Animated collapsible container with height animation.
 * Respects reduce motion preference.
 *
 * @example
 * const [expanded, setExpanded] = useState(false);
 *
 * <TouchableOpacity onPress={() => setExpanded(!expanded)}>
 *   <Text>Toggle</Text>
 * </TouchableOpacity>
 * <AnimatedCollapsible expanded={expanded}>
 *   <Text>Hidden content</Text>
 * </AnimatedCollapsible>
 */
export function AnimatedCollapsible({
  expanded,
  children,
  duration = animation.duration.normal,
  style,
}: AnimatedCollapsibleProps) {
  const reduceMotion = useReduceMotion();
  const heightProgress = useSharedValue(expanded ? 1 : 0);
  const [measuredHeight, setMeasuredHeight] = React.useState(0);
  const [shouldRender, setShouldRender] = React.useState(expanded);

  // Measure content height
  const onLayout = React.useCallback((event: { nativeEvent: { layout: { height: number } } }) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && height !== measuredHeight) {
      setMeasuredHeight(height);
    }
  }, [measuredHeight]);

  React.useEffect(() => {
    if (expanded) {
      setShouldRender(true);
    }

    const animationDuration = reduceMotion ? 0 : duration;

    heightProgress.value = withTiming(
      expanded ? 1 : 0,
      {
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished && !expanded) {
          runOnJS(setShouldRender)(false);
        }
      }
    );
  }, [expanded, reduceMotion, duration, heightProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: measuredHeight > 0 ? heightProgress.value * measuredHeight : undefined,
      opacity: heightProgress.value,
      overflow: 'hidden',
    };
  });

  if (!shouldRender && !expanded) {
    return null;
  }

  return (
    <Animated.View style={[style, animatedStyle]}>
      <Animated.View
        style={styles.content}
        onLayout={onLayout}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: {
    // Position absolute for measuring while collapsed
  },
});
