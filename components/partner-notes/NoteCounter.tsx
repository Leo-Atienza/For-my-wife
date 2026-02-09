import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface NoteCounterProps {
  count: number;
}

export const NoteCounter = ({ count }: NoteCounterProps) => {
  const theme = useTheme();

  if (count === 0) return null;

  return (
    <View
      style={{
        backgroundColor: theme.primary,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        minWidth: 24,
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Inter_600SemiBold',
          color: '#FFFFFF',
        }}
      >
        {count}
      </Text>
    </View>
  );
};
