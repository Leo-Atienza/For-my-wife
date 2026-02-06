import { useState } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotesStore } from '@/stores/useNotesStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MOOD_EMOJIS } from '@/lib/constants';

export default function NewNoteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const addNote = useNotesStore((state) => state.addNote);

  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | undefined>(undefined);

  const handleSave = () => {
    if (content.trim().length === 0) return;
    addNote('partner1', content.trim(), selectedMood);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <PageHeader title="Write a Note" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          gap: 20,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Mood picker */}
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Inter_500Medium',
              color: theme.textMuted,
            }}
          >
            How are you feeling?
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {MOOD_EMOJIS.map(({ emoji, label }) => (
              <Pressable
                key={emoji}
                onPress={() => setSelectedMood(selectedMood === emoji ? undefined : emoji)}
                style={{
                  backgroundColor: selectedMood === emoji ? theme.primarySoft : theme.surface,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: selectedMood === emoji ? theme.primary : theme.accent,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
                accessibilityLabel={label}
              >
                <Text style={{ fontSize: 20 }}>{emoji}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Inter_400Regular',
                    color: theme.textMuted,
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Note content */}
        <Input
          value={content}
          onChangeText={setContent}
          placeholder="Write your love note..."
          multiline
          numberOfLines={8}
          autoFocus
        />

        {/* Save button */}
        <View style={{ marginTop: 'auto', paddingTop: 16 }}>
          <Button
            title="Send Note"
            onPress={handleSave}
            disabled={content.trim().length === 0}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
