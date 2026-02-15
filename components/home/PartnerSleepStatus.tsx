import { View, Text } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useSleepWakeStore } from '@/stores/useSleepWakeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useTheme } from '@/hooks/useTheme';

export const PartnerSleepStatus = () => {
  const theme = useTheme();
  const myRole = useAuthStore((s) => s.myRole);
  const getLatestStatus = useSleepWakeStore((s) => s.getLatestStatus);

  const partnerRole = myRole === 'partner1' ? 'partner2' : 'partner1';
  const partnerProfile = useProfileStore((s) => s[partnerRole]);
  const partnerStatus = getLatestStatus(partnerRole);

  if (!partnerStatus) return null;

  const isSleeping = partnerStatus === 'sleeping';
  const partnerName = partnerProfile?.name ?? 'Your partner';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: theme.primarySoft,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}
    >
      {isSleeping ? (
        <Moon size={16} color={theme.primary} />
      ) : (
        <Sun size={16} color={theme.accent} />
      )}
      <Text
        style={{
          fontSize: 13,
          fontFamily: 'Inter_500Medium',
          color: theme.textPrimary,
        }}
      >
        {partnerName} is {isSleeping ? 'sleeping' : 'awake'}
      </Text>
    </View>
  );
};
