import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRelationshipDuration } from '@/hooks/useRelationshipDuration';
import { Card } from '@/components/ui/Card';

interface DurationCounterProps {
  anniversaryDate: string;
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => {
  const theme = useTheme();
  return (
    <View style={{ alignItems: 'center' }}>
      <Text
        style={{
          fontSize: 30,
          fontFamily: 'PlayfairDisplay_700Bold',
          color: theme.primary,
        }}
      >
        {value.toLocaleString()}
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Inter_400Regular',
          color: theme.textMuted,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const Separator = () => {
  const theme = useTheme();
  return (
    <Text
      style={{
        fontSize: 24,
        color: theme.accent,
        marginTop: -4,
      }}
    >
      :
    </Text>
  );
};

export const DurationCounter = ({ anniversaryDate }: DurationCounterProps) => {
  const duration = useRelationshipDuration(anniversaryDate);
  const theme = useTheme();

  if (!duration) return null;

  return (
    <Card>
      <Text
        style={{
          fontSize: 14,
          fontFamily: 'DancingScript_400Regular',
          color: theme.textMuted,
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        Together for
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <TimeUnit value={duration.days} label="days" />
        <Separator />
        <TimeUnit value={duration.hours} label="hrs" />
        <Separator />
        <TimeUnit value={duration.minutes} label="min" />
        <Separator />
        <TimeUnit value={duration.seconds} label="sec" />
      </View>
    </Card>
  );
};
