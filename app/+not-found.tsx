import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export default function NotFoundScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  // Auto-redirect to home after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 48 }}>{'\u2764\ufe0f'}</Text>
      <Text
        style={{
          fontSize: 18,
          fontFamily: 'Inter_500Medium',
          color: theme.textPrimary,
          textAlign: 'center',
        }}
      >
        Redirecting...
      </Text>
    </View>
  );
}
