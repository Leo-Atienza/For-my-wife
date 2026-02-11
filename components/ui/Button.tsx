import { TouchableOpacity, Text, ActivityIndicator, Platform } from 'react-native';
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
  const isDisabled = disabled || loading;

  // --- colors ---
  let bg = theme.primary;
  let fg = '#FFFFFF';

  if (variant === 'primary') {
    bg = isDisabled ? '#F9A8B8' : theme.primary;
    fg = '#FFFFFF';
  } else if (variant === 'secondary') {
    bg = '#FFFFFF';
    fg = isDisabled ? theme.textMuted : theme.primary;
  } else {
    bg = 'transparent';
    fg = isDisabled ? theme.textMuted : theme.primary;
  }

  // --- shadow (primary only) ---
  const shadow =
    variant === 'primary' && !isDisabled
      ? Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
          },
          android: {
            elevation: 4,
          },
        })
      : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={{
        backgroundColor: bg,
        borderRadius: 14,
        paddingHorizontal: 24,
        paddingVertical: 16,
        minHeight: 54,
        alignItems: 'center',
        justifyContent: 'center',
        ...(variant === 'secondary'
          ? { borderWidth: 1.5, borderColor: isDisabled ? theme.accent : theme.primary }
          : {}),
        ...shadow,
      }}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <Text
          style={{
            color: fg,
            fontSize: 17,
            fontFamily: 'Inter_600SemiBold',
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
