import { Stack } from 'expo-router';

export default function CountdownsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="new" />
    </Stack>
  );
}
