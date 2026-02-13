import { Pressable, Text, View } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useSleepWakeStore } from '@/stores/useSleepWakeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';

export const SleepWakeToggle = () => {
  const theme = useTheme();
  const myRole = useAuthStore((s) => s.myRole);
  const getLatestStatus = useSleepWakeStore((s) => s.getLatestStatus);
  const setStatus = useSleepWakeStore((s) => s.setStatus);

  const partnerRole = myRole ?? 'partner1';
  const currentStatus = getLatestStatus(partnerRole);
  const isSleeping = currentStatus === 'sleeping';

  const handleToggle = () => {
    setStatus(partnerRole, isSleeping ? 'awake' : 'sleeping');
  };

  return (
    <Pressable
      onPress={handleToggle}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: theme.surface,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: isSleeping ? theme.primary : theme.accent,
        opacity: pressed ? 0.9 : 1,
      })}
      accessibilityLabel={isSleeping ? 'Mark as awake' : 'Mark as sleeping'}
      accessibilityRole="button"
    >
      {isSleeping ? (
        <Moon size={22} color={theme.primary} />
      ) : (
        <Sun size={22} color="#F59E0B" />
      )}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter_600SemiBold',
            color: theme.textPrimary,
          }}
        >
          {isSleeping ? 'Going to sleep...' : 'Good morning!'}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
          }}
        >
          Tap to change your status
        </Text>
      </View>
    </Pressable>
  );
};
