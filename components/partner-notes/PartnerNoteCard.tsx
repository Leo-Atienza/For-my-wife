import { View, Text, Pressable } from 'react-native';
import { Lock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { truncateText } from '@/lib/utils';
import { CATEGORY_LABELS, CATEGORY_ICONS } from './CategoryPicker';
import type { PartnerNote } from '@/lib/types';
import { format } from 'date-fns';

interface PartnerNoteCardProps {
  note: PartnerNote;
  isAboutMe: boolean;
  onPress: () => void;
}

export const PartnerNoteCard = ({ note, isAboutMe, onPress }: PartnerNoteCardProps) => {
  const theme = useTheme();
  const isSealed = isAboutMe && !note.isDiscovered;
  const Icon = CATEGORY_ICONS[note.category];
  const categoryLabel = CATEGORY_LABELS[note.category];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: isSealed ? theme.primarySoft : theme.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: isSealed ? theme.primary : theme.accent,
        gap: 10,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      })}
      accessibilityLabel={isSealed ? 'Sealed note - tap to discover' : categoryLabel}
    >
      {/* Category row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon size={14} color={isSealed ? theme.primary : theme.textMuted} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Inter_500Medium',
              color: isSealed ? theme.primary : theme.textMuted,
            }}
          >
            {categoryLabel}
          </Text>
        </View>
        {isSealed && <Lock size={14} color={theme.primary} />}
      </View>

      {/* Content */}
      {isSealed ? (
        <View style={{ alignItems: 'center', paddingVertical: 8, gap: 4 }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'DancingScript_400Regular',
              color: theme.primary,
              textAlign: 'center',
            }}
          >
            A note waiting to be discovered...
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
            }}
          >
            Tap to reveal
          </Text>
        </View>
      ) : (
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'Inter_400Regular',
            color: theme.textPrimary,
            lineHeight: 22,
          }}
        >
          {truncateText(note.content, 120)}
        </Text>
      )}

      {/* Date */}
      <Text
        style={{
          fontSize: 11,
          fontFamily: 'Inter_400Regular',
          color: theme.textMuted,
        }}
      >
        {format(new Date(note.createdAt), 'MMM d, yyyy')}
      </Text>
    </Pressable>
  );
};
