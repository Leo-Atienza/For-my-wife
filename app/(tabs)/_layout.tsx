import { Tabs } from 'expo-router';
import { Heart, PenLine, Camera, Clock, Menu } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.accent,
          borderTopWidth: 1,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter_500Medium',
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color, size }) => (
            <PenLine size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="memories"
        options={{
          title: 'Memories',
          tabBarIcon: ({ color, size }) => (
            <Camera size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="countdowns"
        options={{
          title: 'Countdowns',
          tabBarIcon: ({ color, size }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => (
            <Menu size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
