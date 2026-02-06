import { View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

export default function TimelineScreen() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Timeline" showBack />
      <EmptyState
        emoji={'\ud83d\udcd6'}
        title="Every love story has a beginning"
        subtitle="Add your first milestone to start your relationship timeline."
        actionLabel="Add Milestone"
        onAction={() => {}}
      />
    </View>
  );
}
