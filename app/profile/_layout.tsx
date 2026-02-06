import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="couple" />
      <Stack.Screen name="[partner]" />
      <Stack.Screen name="nicknames" />
    </Stack>
  );
}
