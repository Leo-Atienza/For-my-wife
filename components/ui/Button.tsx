import { Pressable, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) => {
  const theme = useTheme();

  const getBackgroundColor = () => {
    if (disabled) {
      switch (variant) {
        case 'primary':
          return theme.primary; // Keep primary color, opacity handles the "disabled" look
        case 'secondary':
          return theme.primarySoft;
        case 'ghost':
          return 'transparent';
      }
    }
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.primarySoft;
      case 'ghost':
        return 'transparent';
    }
  };

  const getTextColor = () => {
    if (disabled) {
      switch (variant) {
        case 'primary':
          return '#FFFFFF'; // White text on accent bg for visibility
        case 'secondary':
          return theme.accent;
        case 'ghost':
          return theme.accent;
      }
    }
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return theme.primary;
      case 'ghost':
        return theme.primary;
    }
  };

  const getBorderStyle = () => {
    if (disabled && variant === 'ghost') {
      return { borderWidth: 1, borderColor: theme.accent };
    }
    if (variant === 'secondary') {
      return { borderWidth: 1, borderColor: theme.accent };
    }
    return {};
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: getBackgroundColor(),
        opacity: pressed ? 0.9 : disabled ? 0.6 : 1,
        borderRadius: 9999,
        paddingHorizontal: 24,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        minHeight: 48,
        ...getBorderStyle(),
      })}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={{
            color: getTextColor(),
            fontSize: 16,
            fontFamily: 'Inter_600SemiBold',
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};
