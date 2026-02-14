import { useState } from 'react';
import { View, Text, Image, ScrollView, Dimensions, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Calendar, Maximize2 } from 'lucide-react-native';
import { useMemoriesStore } from '@/stores/useMemoriesStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { PhotoViewer } from '@/components/memories/PhotoViewer';
import { formatDate } from '@/lib/dates';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MemoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const memories = useMemoriesStore((state) => state.memories);
  const getMemoryById = useMemoriesStore((state) => state.getMemoryById);
  const memory = id ? getMemoryById(id) : undefined;
  const [showViewer, setShowViewer] = useState(false);

  if (!memory) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <PageHeader title="Memory" showBack />
        <EmptyState title="Memory not found" subtitle="This memory may have been removed." />
      </View>
    );
  }

  const memoryIndex = memories.findIndex((m) => m.id === memory.id);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Memory" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
      >
        <Pressable onPress={() => setShowViewer(true)}>
          <Image
            source={{ uri: memory.imageUri }}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH * 0.75,
            }}
            resizeMode="cover"
          />
          {/* Full-screen hint */}
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 8,
              padding: 6,
            }}
          >
            <Maximize2 size={18} color="#fff" />
          </View>
        </Pressable>
        <View style={{ paddingHorizontal: 24, paddingTop: 20, gap: 12 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
              lineHeight: 26,
            }}
          >
            {memory.caption}
          </Text>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Calendar size={14} color={theme.textMuted} />
              <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                {formatDate(memory.date)}
              </Text>
            </View>
            {memory.location && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MapPin size={14} color={theme.textMuted} />
                <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                  {memory.location}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Full-screen photo viewer with pinch-to-zoom and swipe navigation */}
      <PhotoViewer
        visible={showViewer}
        memories={memories}
        initialIndex={memoryIndex >= 0 ? memoryIndex : 0}
        onClose={() => setShowViewer(false)}
      />
    </View>
  );
}
