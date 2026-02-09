import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePartnerNotesStore } from '@/stores/usePartnerNotesStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CategoryPicker } from '@/components/partner-notes/CategoryPicker';
import type { PartnerNoteCategory } from '@/lib/types';

export default function NewPartnerNoteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const addNote = usePartnerNotesStore((state) => state.addNote);
  const myRole = useAuthStore((state) => state.myRole);

  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PartnerNoteCategory | null>(null);

  const canSave = content.trim().length > 0 && category !== null;

  const handleSave = () => {
    if (!canSave || !myRole || !category) return;
    addNote(myRole, content.trim(), category);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <PageHeader title="Write About Them" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          gap: 20,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Category picker */}
        <CategoryPicker selected={category} onSelect={setCategory} />

        {/* Note content */}
        <Input
          value={content}
          onChangeText={setContent}
          placeholder="What do you love about your partner today?"
          multiline
          numberOfLines={8}
          autoFocus
        />

        {/* Save button */}
        <View style={{ marginTop: 'auto', paddingTop: 16 }}>
          <Button
            title="Save Note"
            onPress={handleSave}
            disabled={!canSave}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
