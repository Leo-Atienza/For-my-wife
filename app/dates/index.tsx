import { View, Text, FlatList, Pressable } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Shuffle, Plus } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useDateIdeasStore } from '@/stores/useDateIdeasStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AddDateIdeaModal } from '@/components/dates/AddDateIdeaModal';
import type { DateIdea, DateIdeaCategory } from '@/lib/types';

const CATEGORY_LABELS: Record<DateIdeaCategory, { label: string; emoji: string }> = {
  'at-home': { label: 'At Home', emoji: '\ud83c\udfe0' },
  'outdoor': { label: 'Outdoor', emoji: '\ud83c\udf33' },
  'fancy': { label: 'Fancy', emoji: '\u2728' },
  'adventure': { label: 'Adventure', emoji: '\ud83c\udfd4\ufe0f' },
};

export default function DateIdeasScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const getAllIdeas = useDateIdeasStore((state) => state.getAllIdeas);
  const toggleFavorite = useDateIdeasStore((state) => state.toggleFavorite);
  const addCustomIdea = useDateIdeasStore((state) => state.addCustomIdea);

  const [selectedCategory, setSelectedCategory] = useState<DateIdeaCategory | 'favorites' | 'all'>('all');
  const [surpriseIdea, setSurpriseIdea] = useState<DateIdea | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const listRef = useRef<FlatList>(null);

  const allIdeas = getAllIdeas();

  const filteredIdeas = selectedCategory === 'all'
    ? allIdeas
    : selectedCategory === 'favorites'
    ? allIdeas.filter((i) => i.isFavorite)
    : allIdeas.filter((i) => i.category === selectedCategory);

  const handleSurpriseMe = useCallback(() => {
    const pool = selectedCategory === 'all' ? allIdeas : filteredIdeas;
    if (pool.length === 0) return;
    const randomIdx = Math.floor(Math.random() * pool.length);
    setSurpriseIdea(pool[randomIdx]);
  }, [allIdeas, filteredIdeas, selectedCategory]);

  const handleAddCustom = (title: string, description: string, category: DateIdeaCategory) => {
    addCustomIdea(title, description, category);
    setShowAdd(false);
  };

  const categories: { key: DateIdeaCategory | 'favorites' | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'at-home', label: '\ud83c\udfe0 Home' },
    { key: 'outdoor', label: '\ud83c\udf33 Outdoor' },
    { key: 'fancy', label: '\u2728 Fancy' },
    { key: 'adventure', label: '\ud83c\udfd4\ufe0f Adventure' },
    { key: 'favorites', label: '\u2764\ufe0f Favorites' },
  ];

  const renderIdea = ({ item }: { item: DateIdea }) => {
    const cat = CATEGORY_LABELS[item.category];
    return (
      <Card style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Text style={{ fontSize: 12 }}>{cat.emoji}</Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'Inter_500Medium',
                  color: theme.primary,
                  textTransform: 'uppercase',
                }}
              >
                {cat.label}
              </Text>
              {item.isCustom && (
                <View
                  style={{
                    backgroundColor: theme.primarySoft,
                    borderRadius: 4,
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                  }}
                >
                  <Text style={{ fontSize: 10, fontFamily: 'Inter_500Medium', color: theme.primary }}>
                    Custom
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter_600SemiBold',
                color: theme.textPrimary,
                marginBottom: 4,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Inter_400Regular',
                color: theme.textMuted,
                lineHeight: 19,
              }}
            >
              {item.description}
            </Text>
          </View>
          <Pressable
            onPress={() => toggleFavorite(item.id)}
            hitSlop={10}
            accessibilityLabel={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            style={{ padding: 4 }}
          >
            <Heart
              size={22}
              color={item.isFavorite ? theme.primary : theme.textMuted}
              fill={item.isFavorite ? theme.primary : 'none'}
            />
          </Pressable>
        </View>
      </Card>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader
        title="Date Ideas"
        showBack
        rightElement={
          <Pressable
            onPress={() => setShowAdd(true)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Add custom date idea"
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: theme.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Plus size={20} color="#FFFFFF" />
          </Pressable>
        }
      />

      {/* Category filters */}
      <View style={{ paddingHorizontal: 24, marginBottom: 8 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item: cat }) => (
            <Pressable
              onPress={() => {
                setSelectedCategory(cat.key);
                setSurpriseIdea(null);
              }}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor:
                  selectedCategory === cat.key ? theme.primary : theme.primarySoft,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Inter_500Medium',
                  color: selectedCategory === cat.key ? '#FFFFFF' : theme.textPrimary,
                }}
              >
                {cat.label}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Surprise Me button */}
      <View style={{ paddingHorizontal: 24, marginBottom: 12 }}>
        <Pressable
          onPress={handleSurpriseMe}
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
          })}
          accessibilityLabel="Surprise me with a random date idea"
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: theme.primarySoft,
              borderRadius: 12,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: theme.accent,
            }}
          >
            <Shuffle size={18} color={theme.primary} />
            <Text style={{ fontSize: 15, fontFamily: 'Inter_600SemiBold', color: theme.primary }}>
              Surprise Me!
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Surprise result */}
      {surpriseIdea && (
        <View style={{ paddingHorizontal: 24, marginBottom: 12 }}>
          <Card style={{ borderColor: theme.primary, borderWidth: 2 }}>
            <View style={{ alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 12, fontFamily: 'Inter_500Medium', color: theme.primary }}>
                YOUR DATE IDEA
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'PlayfairDisplay_700Bold',
                  color: theme.textPrimary,
                  textAlign: 'center',
                }}
              >
                {surpriseIdea.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Inter_400Regular',
                  color: theme.textMuted,
                  textAlign: 'center',
                }}
              >
                {surpriseIdea.description}
              </Text>
            </View>
          </Card>
        </View>
      )}

      {/* Ideas list */}
      <FlatList
        ref={listRef}
        data={filteredIdeas}
        keyExtractor={(item) => item.id}
        renderItem={renderIdea}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ paddingTop: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 36, marginBottom: 12 }}>
              {selectedCategory === 'favorites' ? '\u2764\ufe0f' : '\ud83c\udf1f'}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter_500Medium',
                color: theme.textMuted,
                textAlign: 'center',
              }}
            >
              {selectedCategory === 'favorites'
                ? 'No favorites yet. Tap the heart to save ideas!'
                : 'No ideas in this category yet.'}
            </Text>
          </View>
        }
      />

      <AddDateIdeaModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAddCustom}
      />
    </View>
  );
}
