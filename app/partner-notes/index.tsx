import { useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { usePartnerNotesStore } from '@/stores/usePartnerNotesStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { PartnerNoteCard } from '@/components/partner-notes/PartnerNoteCard';
import { NoteCounter } from '@/components/partner-notes/NoteCounter';
import { EmptyState } from '@/components/ui/EmptyState';

type TabKey = 'written' | 'about-me';

export default function PartnerNotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const myRole = useAuthStore((state) => state.myRole);
  const notes = usePartnerNotesStore((state) => state.notes);
  const getUndiscoveredNotes = usePartnerNotesStore((state) => state.getUndiscoveredNotes);

  const [activeTab, setActiveTab] = useState<TabKey>('written');

  const partnerRole = myRole ?? 'partner1';
  const undiscoveredCount = getUndiscoveredNotes(partnerRole).length;

  const writtenNotes = notes.filter((n) => n.author === partnerRole);
  const aboutMeNotes = notes.filter((n) => n.aboutPartner === partnerRole);

  const displayedNotes = activeTab === 'written' ? writtenNotes : aboutMeNotes;

  const renderTab = (key: TabKey, label: string, count?: number) => {
    const isActive = activeTab === key;
    return (
      <Pressable
        onPress={() => setActiveTab(key)}
        style={{
          flex: 1,
          paddingVertical: 12,
          alignItems: 'center',
          borderBottomWidth: 2,
          borderBottomColor: isActive ? theme.primary : 'transparent',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: isActive ? 'Inter_600SemiBold' : 'Inter_400Regular',
            color: isActive ? theme.primary : theme.textMuted,
          }}
        >
          {label}
        </Text>
        {count !== undefined && count > 0 && <NoteCounter count={count} />}
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader
        title="Partner Notes"
        showBack
        rightElement={
          <Pressable
            onPress={() => router.push('/partner-notes/new')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            accessibilityLabel="Write a new note"
          >
            <Plus size={20} color="#FFFFFF" />
          </Pressable>
        }
      />

      {/* Tabs */}
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 24,
          borderBottomWidth: 1,
          borderBottomColor: theme.accent,
        }}
      >
        {renderTab('written', 'My Notes About Them')}
        {renderTab('about-me', 'About Me', undiscoveredCount)}
      </View>

      {/* Notes list */}
      {displayedNotes.length === 0 ? (
        <EmptyState
          title={
            activeTab === 'written'
              ? 'Write something special about your partner'
              : 'No notes about you yet'
          }
          emoji={activeTab === 'written' ? '\u270D\uFE0F' : '\uD83D\uDC8C'}
        />
      ) : (
        <FlatList
          data={displayedNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PartnerNoteCard
              note={item}
              isAboutMe={activeTab === 'about-me'}
              onPress={() => router.push(`/partner-notes/${item.id}`)}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: insets.bottom + 20,
            gap: 12,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
