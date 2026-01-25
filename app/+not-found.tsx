import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertCircle } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography, touchTargets } from '@/src/constants/theme';

export default function NotFoundScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View
          style={styles.iconContainer}
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel="Error icon"
        >
          <AlertCircle color={colors.warning} size={64} strokeWidth={1.5} />
        </View>

        <Text
          style={styles.title}
          accessibilityRole="header"
        >
          Page Not Found
        </Text>

        <Text style={styles.description}>
          This screen does not exist. It may have been moved or removed.
        </Text>

        <Link href="/" asChild>
          <TouchableOpacity
            style={styles.button}
            accessibilityRole="button"
            accessibilityLabel="Go to home screen"
            accessibilityHint="Double tap to navigate to the home screen"
          >
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.warning,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 200,
    minHeight: touchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
