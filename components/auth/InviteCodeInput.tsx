import { View, TextInput, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface InviteCodeInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const InviteCodeInput = ({ value, onChangeText }: InviteCodeInputProps) => {
  const theme = useTheme();

  const handleChange = (text: string) => {
    // Only allow alphanumeric, auto-uppercase, max 6 chars
    const cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
    onChangeText(cleaned);
  };

  return (
    <View style={{ alignItems: 'center', gap: 12 }}>
      <Text
        style={{
          fontSize: 14,
          fontFamily: 'Inter_500Medium',
          color: theme.textMuted,
          textAlign: 'center',
        }}
      >
        Enter the 6-character code from your partner
      </Text>

      <TextInput
        value={value}
        onChangeText={handleChange}
        placeholder="ABC123"
        placeholderTextColor={theme.textMuted}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={6}
        style={{
          fontSize: 32,
          fontFamily: 'Inter_600SemiBold',
          color: theme.primary,
          letterSpacing: 8,
          textAlign: 'center',
          backgroundColor: theme.primarySoft,
          borderWidth: 2,
          borderColor: value.length === 6 ? theme.primary : theme.accent,
          borderRadius: 16,
          paddingHorizontal: 24,
          paddingVertical: 16,
          width: '100%',
        }}
        accessibilityLabel="Invite code"
      />
    </View>
  );
};
