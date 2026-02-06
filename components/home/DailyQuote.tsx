import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { LOVE_QUOTES } from '@/lib/constants';
import { getDailyQuoteIndex } from '@/lib/dates';

export const DailyQuote = () => {
  const theme = useTheme();
  const index = getDailyQuoteIndex() % LOVE_QUOTES.length;
  const quote = LOVE_QUOTES[index];

  return (
    <View
      style={{
        backgroundColor: theme.primarySoft,
        borderRadius: 16,
        padding: 20,
        gap: 8,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontFamily: 'Inter_400Regular',
          color: theme.textPrimary,
          fontStyle: 'italic',
          lineHeight: 22,
          textAlign: 'center',
        }}
      >
        &ldquo;{quote.text}&rdquo;
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Inter_500Medium',
          color: theme.textMuted,
          textAlign: 'center',
        }}
      >
        &mdash; {quote.author}
      </Text>
    </View>
  );
};
