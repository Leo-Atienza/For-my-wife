import { View, Text, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface InviteCodeDisplayProps {
  code: string;
}

export const InviteCodeDisplay = ({ code }: InviteCodeDisplayProps) => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={{ alignItems: 'center', gap: 16 }}>
      <Text
        style={{
          fontSize: 14,
          fontFamily: 'Inter_500Medium',
          color: theme.textMuted,
          textAlign: 'center',
        }}
      >
        Share this code with your partner
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: theme.primarySoft,
          borderRadius: 16,
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderWidth: 2,
          borderColor: theme.accent,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontFamily: 'Inter_600SemiBold',
            color: theme.primary,
            letterSpacing: 8,
          }}
        >
          {code}
        </Text>
      </View>

      <Pressable
        onPress={handleCopy}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 9999,
            backgroundColor: copied ? theme.success + '20' : theme.surface,
            borderWidth: 1,
            borderColor: copied ? theme.success : theme.accent,
          }}
        >
          {copied ? (
            <Check size={16} color={theme.success} />
          ) : (
            <Copy size={16} color={theme.primary} />
          )}
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Inter_500Medium',
              color: copied ? theme.success : theme.primary,
            }}
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
