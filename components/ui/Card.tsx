import { Pressable, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: object;
}

export const Card = ({ children, onPress, style }: CardProps) => {
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

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          ...cardStyle,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};
