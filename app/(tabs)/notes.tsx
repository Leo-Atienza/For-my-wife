import { View, FlatList, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotesStore } from '@/stores/useNotesStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatRelativeTime, formatDate } from '@/lib/dates';
import { truncateText } from '@/lib/utils';
import type { LoveNote } from '@/lib/types';

const NoteCard = ({ note, onPress }: { note: LoveNote; onPress: () => void }) => {
  const theme = useTheme();

  return (
    <Card onPress={onPress}>
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {note.mood && <Text style={{ fontSize: 18 }}>{note.mood}</Text>}
            {!note.isRead && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.primary,
                }}
              />
            )}
          </View>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
            }}
          >
            {formatRelativeTime(note.createdAt)}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'Inter_400Regular',
            color: theme.textPrimary,
            lineHeight: 22,
          }}
        >
          {truncateText(note.content, 120)}
        </Text>
      </View>
    </Card>
  );
};

export default function NotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const notes = useNotesStore((state) => state.notes);

  if (notes.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <PageHeader title="Love Notes" />
        <EmptyState
          emoji={'\u2709\ufe0f'}
          title="No notes yet"
          subtitle="Leave your first love note for your special person."
          actionLabel="Write a Note"
          onAction={() => router.push('/notes/new')}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader
        title="Love Notes"
        rightElement={
          <Pressable
            onPress={() => router.push('/notes/new')}
            style={{
              backgroundColor: theme.primary,
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            accessibilityRole="button"
            accessibilityLabel="Write a new note"
          >
            <Plus size={20} color="#FFFFFF" />
          </Pressable>
        }
      />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => router.push(`/notes/${item.id}`)}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          gap: 12,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
