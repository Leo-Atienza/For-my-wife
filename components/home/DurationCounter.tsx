import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRelationshipDuration } from '@/hooks/useRelationshipDuration';
import { Card } from '@/components/ui/Card';
import { FlipNumber } from '@/components/countdowns/FlipNumber';

interface DurationCounterProps {
  anniversaryDate: string;
}

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

  // Show friendly fallback if duration is invalid (all zeros from invalid date)
  if (isNaN(duration.days) || (duration.days === 0 && duration.hours === 0 && duration.minutes === 0 && duration.seconds === 0)) {
    return (
      <Card>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 28 }}>{'\ud83d\udc95'}</Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'DancingScript_400Regular',
              color: theme.textMuted,
              textAlign: 'center',
            }}
          >
            Set your anniversary date in settings
          </Text>
        </View>
      </Card>
    );
  }

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
        <FlipNumber value={duration.days} fontSize={30} label="days" />
        <Separator />
        <FlipNumber value={duration.hours} fontSize={30} label="hrs" />
        <Separator />
        <FlipNumber value={duration.minutes} fontSize={30} label="min" />
        <Separator />
        <FlipNumber value={duration.seconds} fontSize={30} label="sec" />
      </View>
    </Card>
  );
};
