import { TextInput, View, Text } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  autoFocus?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send' | 'default';
}

export const Input = ({
  value,
  onChangeText,
  placeholder,
  label,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  autoFocus = false,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize,
  error,
  onSubmitEditing,
  returnKeyType,
}: InputProps) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ gap: 6 }}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            color: theme.textMuted,
            fontFamily: 'Inter_500Medium',
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        autoFocus={autoFocus}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          backgroundColor: theme.primarySoft,
          borderWidth: 1,
          borderColor: error ? theme.danger : isFocused ? theme.primary : theme.accent,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          fontSize: 16,
          color: theme.textPrimary,
          fontFamily: 'Inter_400Regular',
          minHeight: multiline ? 100 : 48,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
        accessibilityLabel={label ?? placeholder}
      />
      {error && (
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Inter_400Regular',
            color: theme.danger,
            marginTop: 2,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
