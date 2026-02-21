import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Trash2 } from 'lucide-react-native';
import { usePartnerNotesStore } from '@/stores/usePartnerNotesStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/components/partner-notes/CategoryPicker';
import { format, isValid } from 'date-fns';

const safeFormatDate = (dateStr: string | undefined, pattern: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return isValid(date) ? format(date, pattern) : '';
};

export default function PartnerNoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const getNoteById = usePartnerNotesStore((state) => state.getNoteById);
  const discoverNote = usePartnerNotesStore((state) => state.discoverNote);
  const removeNote = usePartnerNotesStore((state) => state.removeNote);
  const myRole = useAuthStore((state) => state.myRole);

  const note = getNoteById(id ?? '');
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (note && note.aboutPartner === myRole && !note.isDiscovered) {
      // Auto-discover after a short delay for the reveal effect
      const timer = setTimeout(() => {
        discoverNote(note.id);
        setIsRevealed(true);
      }, 800);
      return () => clearTimeout(timer);
    }
    if (note?.isDiscovered) {
      setIsRevealed(true);
    }
  }, [note, myRole, discoverNote]);

  if (!note) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <PageHeader title="Note" showBack />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
            }}
          >
            Note not found
          </Text>
        </View>
      </View>
    );
  }

  const isAboutMe = note.aboutPartner === myRole;
  const isMyNote = note.author === myRole;
  const Icon = CATEGORY_ICONS[note.category];
  const categoryLabel = CATEGORY_LABELS[note.category];
  const showContent = !isAboutMe || isRevealed || note.isDiscovered;

  const handleDelete = () => {
    removeNote(note.id);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader
        title="Partner Note"
        showBack
        rightElement={
          isMyNote ? (
            <Pressable onPress={handleDelete} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <View style={{ padding: 8 }}>
                <Trash2 size={20} color={theme.danger} />
              </View>
            </Pressable>
          ) : undefined
        }
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: insets.bottom + 20,
          gap: 20,
        }}
      >
        {/* Category badge */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: theme.primarySoft,
            alignSelf: 'flex-start',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 8,
          }}
        >
          <Icon size={16} color={theme.primary} />
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Inter_600SemiBold',
              color: theme.primary,
            }}
          >
            {categoryLabel}
          </Text>
        </View>

        {/* Content */}
        {showContent ? (
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Inter_400Regular',
              color: theme.textPrimary,
              lineHeight: 28,
            }}
          >
            {note.content}
          </Text>
        ) : (
          <View
            style={{
              alignItems: 'center',
              paddingVertical: 40,
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 48 }}>{'\ud83d\udc8c'}</Text>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'DancingScript_400Regular',
                color: theme.primary,
                textAlign: 'center',
              }}
            >
              Revealing your note...
            </Text>
          </View>
        )}

        {/* Date */}
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
          }}
        >
          Written on {safeFormatDate(note.createdAt, 'MMMM d, yyyy')}
          {note.discoveredAt &&
            ` \u2022 Discovered on ${safeFormatDate(note.discoveredAt, 'MMMM d, yyyy')}`}
        </Text>
      </ScrollView>
    </View>
  );
}
