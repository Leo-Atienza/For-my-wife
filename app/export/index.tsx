import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { BookOpen, Download, Share2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useCoupleStore } from '@/stores/useCoupleStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useNotesStore } from '@/stores/useNotesStore';
import { useMemoriesStore } from '@/stores/useMemoriesStore';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { useBucketStore } from '@/stores/useBucketStore';
import { useSongStore } from '@/stores/useSongStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { generateYearbookHtml } from '@/lib/yearbook';

export default function ExportScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const profile = useCoupleStore((state) => state.profile);
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);
  const notesCount = useNotesStore((state) => state.notes.length);
  const memoriesCount = useMemoriesStore((state) => state.memories.length);
  const milestonesCount = useTimelineStore((state) => state.milestones.length);
  const bucketDone = useBucketStore(
    (state) => state.items.filter((b) => b.isCompleted).length
  );
  const songsCount = useSongStore((state) => state.songs.length);

  const name1 = partner1?.name ?? 'Partner 1';
  const name2 = partner2?.name ?? 'Partner 2';
  const totalItems = notesCount + memoriesCount + milestonesCount + bucketDone + songsCount;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const html = generateYearbookHtml();
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      setLastGenerated(uri);

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `${name1} & ${name2} - Our Yearbook`,
          UTI: 'com.adobe.pdf',
        });
      }
    } catch (err) {
      console.error('Failed to generate yearbook:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Export Yearbook" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Preview header */}
        <View style={{ alignItems: 'center', gap: 12, paddingVertical: 20 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: theme.primarySoft,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: theme.accent,
            }}
          >
            <BookOpen size={32} color={theme.primary} />
          </View>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
              textAlign: 'center',
            }}
          >
            Our Yearbook
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'DancingScript_400Regular',
              color: theme.primary,
            }}
          >
            {name1} & {name2}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            Generate a beautiful PDF of your relationship journey — notes, memories, timeline,
            songs, and more.
          </Text>
        </View>

        {/* What's included */}
        <Card>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter_600SemiBold',
              color: theme.textPrimary,
              marginBottom: 14,
            }}
          >
            What's included
          </Text>
          <View style={{ gap: 10 }}>
            <StatRow emoji={'\u{1F4D6}'} label="Timeline milestones" count={milestonesCount} theme={theme} />
            <StatRow emoji={'\u{1F48C}'} label="Love notes" count={notesCount} theme={theme} />
            <StatRow emoji={'\u{1F4F8}'} label="Memories" count={memoriesCount} theme={theme} />
            <StatRow emoji={'\u{1F3B5}'} label="Song dedications" count={songsCount} theme={theme} />
            <StatRow emoji={'\u2728'} label="Bucket list completed" count={bucketDone} theme={theme} />
          </View>
          <View
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTopWidth: 1,
              borderTopColor: theme.accent + '60',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_600SemiBold',
                color: theme.textPrimary,
              }}
            >
              Total entries
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_600SemiBold',
                color: theme.primary,
              }}
            >
              {totalItems}
            </Text>
          </View>
        </Card>

        {/* Generate button */}
        <View style={{ gap: 12 }}>
          {isGenerating ? (
            <View
              style={{
                backgroundColor: theme.primarySoft,
                borderRadius: 16,
                padding: 24,
                alignItems: 'center',
                gap: 12,
              }}
            >
              <ActivityIndicator size="small" color={theme.primary} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Inter_500Medium',
                  color: theme.primary,
                }}
              >
                Creating your yearbook...
              </Text>
            </View>
          ) : (
            <Button
              title="Generate & Share PDF"
              onPress={handleGenerate}
            />
          )}
        </View>

        {totalItems === 0 && (
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            Start adding notes, memories, and milestones to make your yearbook richer!
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const StatRow = ({
  emoji,
  label,
  count,
  theme,
}: {
  emoji: string;
  label: string;
  count: number;
  theme: { textPrimary: string; textMuted: string; primary: string };
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
    <Text style={{ fontSize: 18 }}>{emoji}</Text>
    <Text
      style={{
        flex: 1,
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: theme.textPrimary,
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
        color: count > 0 ? theme.primary : theme.textMuted,
      }}
    >
      {count}
    </Text>
  </View>
);
