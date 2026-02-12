import { ActivityIndicator, Pressable, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: object;
  loading?: boolean;
}

export const Card = ({ children, onPress, style, loading = false }: CardProps) => {
  const theme = useTheme();

  const cardStyle = {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    ...style,
  };

  const content = loading ? (
    <>
      <View style={{ opacity: 0.3 }}>{children}</View>
      <ActivityIndicator
        size="small"
        color={theme.primary}
        style={{ position: 'absolute', alignSelf: 'center' }}
      />
    </>
  ) : children;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={loading}
        style={({ pressed }) => ({
          ...cardStyle,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{content}</View>;
};
