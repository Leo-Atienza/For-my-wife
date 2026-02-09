import { ScrollView, Pressable, Text } from 'react-native';
import { Heart, Eye, Star, Gift, BookHeart } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import type { PartnerNoteCategory } from '@/lib/types';

interface CategoryPickerProps {
  selected: PartnerNoteCategory | null;
  onSelect: (category: PartnerNoteCategory) => void;
}

const CATEGORIES: { key: PartnerNoteCategory; label: string; Icon: typeof Heart }[] = [
  { key: 'things-i-love', label: 'Things I Love', Icon: Heart },
  { key: 'noticed-today', label: 'Noticed Today', Icon: Eye },
  { key: 'why-amazing', label: 'Why Amazing', Icon: Star },
  { key: 'gratitude', label: 'Gratitude', Icon: Gift },
  { key: 'memories-of-us', label: 'Memories of Us', Icon: BookHeart },
];

export const CategoryPicker = ({ selected, onSelect }: CategoryPickerProps) => {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
    >
      {CATEGORIES.map(({ key, label, Icon }) => {
        const isSelected = selected === key;
        return (
          <Pressable
            key={key}
            onPress={() => onSelect(key)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: isSelected ? theme.primarySoft : theme.surface,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: isSelected ? theme.primary : theme.accent,
            }}
            accessibilityLabel={label}
          >
            <Icon size={16} color={isSelected ? theme.primary : theme.textMuted} />
            <Text
              style={{
                fontSize: 13,
                fontFamily: isSelected ? 'Inter_600SemiBold' : 'Inter_400Regular',
                color: isSelected ? theme.primary : theme.textMuted,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export const CATEGORY_LABELS: Record<PartnerNoteCategory, string> = {
  'things-i-love': 'Things I Love About You',
  'noticed-today': 'What I Noticed Today',
  'why-amazing': 'Why You\'re Amazing',
  'gratitude': 'I\'m Grateful For...',
  'memories-of-us': 'Memories of Us',
};

export const CATEGORY_ICONS: Record<PartnerNoteCategory, typeof Heart> = {
  'things-i-love': Heart,
  'noticed-today': Eye,
  'why-amazing': Star,
  'gratitude': Gift,
  'memories-of-us': BookHeart,
};
