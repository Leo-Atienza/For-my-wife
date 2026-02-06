import { useState } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCountdownsStore } from '@/stores/useCountdownsStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const COUNTDOWN_EMOJIS = [
  '\u2764\ufe0f', '\ud83c\udf89', '\u2708\ufe0f', '\ud83c\udf82', '\ud83d\udc8d',
  '\ud83c\udf85', '\ud83c\udf1f', '\ud83c\udf39', '\ud83c\udfd6\ufe0f', '\ud83c\udfb5',
];

export default function NewCountdownScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const addCountdown = useCountdownsStore((state) => state.addCountdown);

  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [emoji, setEmoji] = useState<string | undefined>(undefined);

  const handleSave = () => {
    if (!title.trim() || !targetDate.trim()) return;
    addCountdown(title.trim(), new Date(targetDate).toISOString(), emoji);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <PageHeader title="New Countdown" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          gap: 20,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Our trip to Paris"
          label="What are you counting down to?"
          autoFocus
          maxLength={50}
        />

        <Input
          value={targetDate}
          onChangeText={setTargetDate}
          placeholder="YYYY-MM-DD"
          label="Target Date"
          maxLength={10}
        />

        {/* Emoji picker */}
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Inter_500Medium',
              color: theme.textMuted,
            }}
          >
            Pick an emoji (optional)
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {COUNTDOWN_EMOJIS.map((e) => (
              <Pressable
                key={e}
                onPress={() => setEmoji(emoji === e ? undefined : e)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: emoji === e ? theme.primarySoft : theme.surface,
                  borderWidth: 1,
                  borderColor: emoji === e ? theme.primary : theme.accent,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 24 }}>{e}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 'auto', paddingTop: 16 }}>
          <Button
            title="Start Countdown"
            onPress={handleSave}
            disabled={!title.trim() || !targetDate.trim()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
