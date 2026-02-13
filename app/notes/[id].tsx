import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotesStore } from '@/stores/useNotesStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { EnvelopeAnimation } from '@/components/notes/EnvelopeAnimation';
import { formatDate } from '@/lib/dates';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const getNoteById = useNotesStore((state) => state.getNoteById);
  const markAsRead = useNotesStore((state) => state.markAsRead);

  const note = id ? getNoteById(id) : undefined;
  const wasUnread = useRef(note ? !note.isRead : false);
  const [showEnvelope, setShowEnvelope] = useState(wasUnread.current);

  useEffect(() => {
    if (note && !note.isRead) {
      markAsRead(note.id);
    }
  }, [note, markAsRead]);

  const handleEnvelopeComplete = useCallback(() => {
    setShowEnvelope(false);
  }, []);

  if (!note) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <PageHeader title="Love Note" showBack />
        <EmptyState title="Note not found" subtitle="This note may have been removed." />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Love Note" showBack />

      {showEnvelope ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <EnvelopeAnimation onComplete={handleEnvelopeComplete} mood={note.mood} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: insets.bottom + 20,
            gap: 16,
          }}
        >
          {/* Mood and date */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {note.mood && <Text style={{ fontSize: 36 }}>{note.mood}</Text>}
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Inter_400Regular',
                color: theme.textMuted,
              }}
            >
              {formatDate(note.createdAt)}
            </Text>
          </View>

          {/* Note content */}
          <View
            style={{
              backgroundColor: theme.surface,
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: theme.accent,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontFamily: 'Inter_400Regular',
                color: theme.textPrimary,
                lineHeight: 28,
              }}
            >
              {note.content}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
