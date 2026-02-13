import { Stack } from 'expo-router';
import { ScreenErrorBoundary } from '@/components/ErrorBoundary';

export default function SetupLayout() {
  return (
    <ScreenErrorBoundary>
      <Stack screenOptions={{ headerShown: false }} />
    </ScreenErrorBoundary>
  );
}
