import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export const PageHeader = ({
  title,
  showBack = false,
  rightElement,
}: PageHeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.background,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={{ padding: 10 }}
          >
            <ChevronLeft size={24} color={theme.textPrimary} />
          </Pressable>
        )}
        <Text
          style={{
            fontSize: 24,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: theme.textPrimary,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
      {rightElement && <View>{rightElement}</View>}
    </View>
  );
};
