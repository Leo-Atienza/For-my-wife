import { View, Text } from 'react-native';
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
      <Text style={{ fontSize: 48 }}>{emoji}</Text>
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
