import { View, Text, FlatList, Pressable, Alert, Animated } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Check, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBucketStore } from '@/stores/useBucketStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { ConfettiBurst } from '@/components/bucket/ConfettiBurst';
import { CheckmarkDraw } from '@/components/bucket/CheckmarkDraw';
import { AddBucketItemModal } from '@/components/bucket/AddBucketItemModal';
import { BUCKET_CATEGORIES } from '@/lib/constants';
import { formatDate } from '@/lib/dates';
import type { BucketItem, BucketCategory } from '@/lib/types';

export default function BucketListScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const items = useBucketStore((state) => state.items);
  const toggleComplete = useBucketStore((state) => state.toggleComplete);
  const removeItem = useBucketStore((state) => state.removeItem);
  const addItem = useBucketStore((state) => state.addItem);

  const [selectedCategory, setSelectedCategory] = useState<BucketCategory | 'all' | 'completed'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const [showConfettiFor, setShowConfettiFor] = useState<string | null>(null);
  const circleFillAnim = useRef(new Animated.Value(0)).current;

  const filteredItems =
    selectedCategory === 'all'
      ? items.filter((i) => !i.isCompleted)
      : selectedCategory === 'completed'
      ? items.filter((i) => i.isCompleted)
      : items.filter((i) => i.category === selectedCategory && !i.isCompleted);

  const handleToggle = (id: string, wasCompleted: boolean) => {
    toggleComplete(id);
    if (!wasCompleted) {
      setJustCompleted(id);
      setShowConfettiFor(null);

      // Animate circle fill
      circleFillAnim.setValue(0);
      Animated.timing(circleFillAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();

      // Delay confetti until after checkmark draws (500ms)
      setTimeout(() => setShowConfettiFor(id), 500);
      setTimeout(() => {
        setJustCompleted(null);
        setShowConfettiFor(null);
      }, 2000);
    }
  };

  const handleAdd = (title: string, category: BucketCategory) => {
    addItem(title, category);
    setShowAdd(false);
  };

  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;

  const filters: { key: BucketCategory | 'all' | 'completed'; label: string }[] = [
    { key: 'all', label: 'All' },
    ...BUCKET_CATEGORIES.map((c) => ({ key: c.key, label: `${c.emoji} ${c.label}` })),
    { key: 'completed', label: `\u2705 Done (${completedCount})` },
  ];

  const renderItem = ({ item }: { item: BucketItem }) => {
    const isJustDone = justCompleted === item.id;
    const cat = BUCKET_CATEGORIES.find((c) => c.key === item.category);

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: theme.surface,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: isJustDone ? theme.success : theme.accent,
          marginBottom: 10,
        }}
      >
        <Pressable
          onPress={() => handleToggle(item.id, item.isCompleted)}
          accessibilityLabel={item.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            borderWidth: 2,
            borderColor: item.isCompleted ? theme.success : theme.accent,
            backgroundColor: item.isCompleted
              ? isJustDone
                ? undefined
                : theme.success
              : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {isJustDone && (
            <Animated.View
              style={{
                position: 'absolute',
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: theme.success,
                transform: [{ scale: circleFillAnim }],
              }}
            />
          )}
          {item.isCompleted && (
            isJustDone
              ? <CheckmarkDraw active size={16} color="#FFFFFF" />
              : <Check size={16} color="#FFFFFF" />
          )}
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Inter_500Medium',
              color: item.isCompleted ? theme.textMuted : theme.textPrimary,
              textDecorationLine: item.isCompleted ? 'line-through' : 'none',
            }}
          >
            {item.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <Text style={{ fontSize: 11, color: theme.textMuted, fontFamily: 'Inter_400Regular' }}>
              {cat?.emoji} {cat?.label}
            </Text>
            {item.completedDate && (
              <Text style={{ fontSize: 11, color: theme.success, fontFamily: 'Inter_400Regular' }}>
                {'\u2022'} {formatDate(item.completedDate)}
              </Text>
            )}
          </View>
        </View>

        <ConfettiBurst active={showConfettiFor === item.id} />

        <Pressable
          onPress={() =>
            Alert.alert(
              'Remove this dream?',
              `"${item.title}" will be removed from your bucket list.`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => removeItem(item.id) },
              ]
            )
          }
          hitSlop={8}
          accessibilityLabel="Delete item"
          style={{ padding: 4 }}
        >
          <Trash2 size={18} color={theme.textMuted} />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader
        title="Bucket List"
        showBack
        rightElement={
          <Pressable
            onPress={() => setShowAdd(true)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Add bucket list item"
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

      {/* Progress */}
      {totalCount > 0 && (
        <View style={{ paddingHorizontal: 24, marginBottom: 12 }}>
          <Card>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: theme.textMuted }}>
                {completedCount} of {totalCount} completed
              </Text>
              <View
                style={{
                  width: '100%',
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.primarySoft,
                }}
              >
                <View
                  style={{
                    width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.primary,
                  }}
                />
              </View>
            </View>
          </Card>
        </View>
      )}

      {/* Category filters */}
      <View style={{ paddingHorizontal: 24, marginBottom: 8 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item: cat }) => (
            <Pressable
              onPress={() => setSelectedCategory(cat.key)}
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

      {items.length === 0 ? (
        <EmptyState
          emoji={'\u2728'}
          title="Dream together"
          subtitle="Add things you want to do as a couple — big or small."
          actionLabel="Add First Item"
          onAction={() => setShowAdd(true)}
        />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: insets.bottom + 20,
            paddingTop: 8,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ paddingTop: 40, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                {selectedCategory === 'completed'
                  ? 'Nothing completed yet. You got this!'
                  : 'No items in this category.'}
              </Text>
            </View>
          }
        />
      )}

      <AddBucketItemModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAdd}
      />
    </View>
  );
}
