import { Link, Stack } from 'expo-router';
import { Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertCircle } from 'lucide-react-native';
import { colors } from '@/src/constants/theme';
import { styles } from '@/src/styles/screens/not-found.styles';

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
