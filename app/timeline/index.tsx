import { View, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { Plus } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { useCoupleStore } from '@/stores/useCoupleStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { TimelineItem } from '@/components/timeline/TimelineItem';
import { AddMilestoneModal } from '@/components/timeline/AddMilestoneModal';

export default function TimelineScreen() {
  const theme = useTheme();
  const milestones = useTimelineStore((state) => state.milestones);
  const addMilestone = useTimelineStore((state) => state.addMilestone);
  const anniversaryDate = useCoupleStore((state) => state.profile?.anniversaryDate);
  const [showAdd, setShowAdd] = useState(false);

  const allMilestones = milestones.length === 0 && anniversaryDate
    ? [{ id: 'anniversary-auto', title: 'Our Anniversary', date: anniversaryDate, icon: '\u2764\ufe0f' }]
    : milestones;

  const handleAdd = (title: string, date: string, description?: string, icon?: string) => {
    addMilestone(title, date, description, icon);
    setShowAdd(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader
        title="Timeline"
        showBack
        rightElement={
          <Pressable
            onPress={() => setShowAdd(true)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Add milestone"
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

      {allMilestones.length === 0 ? (
        <EmptyState
          emoji={'\ud83d\udcd6'}
          title="Every love story has a beginning"
          subtitle="Add your first milestone to start your relationship timeline."
          actionLabel="Add Milestone"
          onAction={() => setShowAdd(true)}
        />
      ) : (
        <FlatList
          data={allMilestones}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TimelineItem
              milestone={item}
              isFirst={index === 0}
              isLast={index === allMilestones.length - 1}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddMilestoneModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAdd}
      />
    </View>
  );
}
