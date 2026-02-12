import { View, Text, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './Button';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  emoji = '\u2764\ufe0f',
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  const theme = useTheme();
  const bobAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, { toValue: -8, duration: 1500, useNativeDriver: true }),
        Animated.timing(bobAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, [bobAnim]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        gap: 16,
      }}
    >
      <Animated.Text style={{ fontSize: 48, transform: [{ translateY: bobAnim }] }}>{emoji}</Animated.Text>
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'PlayfairDisplay_700Bold',
          color: theme.textPrimary,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
            textAlign: 'center',
            lineHeight: 21,
          }}
        >
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <View style={{ marginTop: 8 }}>
          <Button title={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
};
