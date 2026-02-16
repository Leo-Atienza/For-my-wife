import { View, FlatList, Image, Text, Pressable, Dimensions, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemoriesStore } from '@/stores/useMemoriesStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { PhotoViewer } from '@/components/memories/PhotoViewer';
import type { Memory } from '@/lib/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 4;
const COLUMN_COUNT = 3;
const ITEM_SIZE = (SCREEN_WIDTH - 48 - GRID_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

const MemoryThumbnail = ({ memory, onPress, onLongPress }: { memory: Memory; onPress: () => void; onLongPress: () => void }) => {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <Image
          source={{ uri: memory.imageUri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
    </Pressable>
  );
};

export default function MemoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const memories = useMemoriesStore((state) => state.memories);
  const [refreshing, setRefreshing] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(-1);
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  if (memories.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <PageHeader title="Memories" />
        <EmptyState
          emoji={'\ud83d\udcf8'}
          title="Your story starts here"
          subtitle="Add your first memory together."
          actionLabel="Add Memory"
          onAction={() => router.push('/memories/new')}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader
        title="Memories"
        rightElement={
          <Pressable
            onPress={() => router.push('/memories/new')}
            style={{
              backgroundColor: theme.primary,
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            accessibilityRole="button"
            accessibilityLabel="Add a new memory"
          >
            <Plus size={20} color="#FFFFFF" />
          </Pressable>
        }
      />
      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        renderItem={({ item, index }) => (
          <MemoryThumbnail
            memory={item}
            onPress={() => router.push(`/memories/${item.id}`)}
            onLongPress={() => setViewerIndex(index)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          gap: GRID_GAP,
          paddingBottom: insets.bottom + 80,
        }}
        columnWrapperStyle={{ gap: GRID_GAP }}
        showsVerticalScrollIndicator={false}
      />

      {/* Full-screen photo viewer — long-press a thumbnail to open */}
      <PhotoViewer
        visible={viewerIndex >= 0}
        memories={memories}
        initialIndex={viewerIndex >= 0 ? viewerIndex : 0}
        onClose={() => setViewerIndex(-1)}
      />
    </View>
  );
}
