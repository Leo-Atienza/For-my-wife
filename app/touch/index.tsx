import { View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { TouchCanvas } from '@/components/touch/TouchCanvas';

export default function TouchScreen() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Touch" showBack />
      <TouchCanvas />
    </View>
  );
}
