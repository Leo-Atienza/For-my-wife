import { View, Text, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { formatDate } from '@/lib/dates';
import type { Milestone } from '@/lib/types';

interface TimelineItemProps {
  milestone: Milestone;
  isFirst: boolean;
  isLast: boolean;
}

export const TimelineItem = ({ milestone, isFirst, isLast }: TimelineItemProps) => {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', minHeight: 100 }}>
      {/* Timeline line + dot */}
      <View style={{ alignItems: 'center', width: 40 }}>
        {!isFirst && (
          <View
            style={{
              width: 2,
              height: 16,
              backgroundColor: theme.accent,
            }}
          />
        )}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.primarySoft,
            borderWidth: 2,
            borderColor: theme.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16 }}>
            {milestone.icon ?? '\u2764\ufe0f'}
          </Text>
        </View>
        {!isLast && (
          <View
            style={{
              width: 2,
              flex: 1,
              backgroundColor: theme.accent,
            }}
          />
        )}
      </View>

      {/* Content card */}
      <View
        style={{
          flex: 1,
          marginLeft: 12,
          marginBottom: 16,
          backgroundColor: theme.surface,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: theme.accent,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Inter_500Medium',
            color: theme.primary,
            marginBottom: 4,
          }}
        >
          {formatDate(milestone.date)}
        </Text>
        <Text
          style={{
            fontSize: 17,
            fontFamily: 'Inter_600SemiBold',
            color: theme.textPrimary,
            marginBottom: milestone.description ? 6 : 0,
          }}
        >
          {milestone.title}
        </Text>
        {milestone.description ? (
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              lineHeight: 20,
            }}
          >
            {milestone.description}
          </Text>
        ) : null}
        {milestone.imageUri ? (
          <Image
            source={{ uri: milestone.imageUri }}
            style={{
              width: '100%',
              height: 150,
              borderRadius: 12,
              marginTop: 10,
            }}
            resizeMode="cover"
          />
        ) : null}
      </View>
    </View>
  );
};
