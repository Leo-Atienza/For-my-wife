import { View, Text, Modal, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { DateIdeaCategory } from '@/lib/types';

interface AddDateIdeaModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string, category: DateIdeaCategory) => void;
}

const CATEGORIES: { key: DateIdeaCategory; label: string; emoji: string }[] = [
  { key: 'at-home', label: 'At Home', emoji: '\ud83c\udfe0' },
  { key: 'outdoor', label: 'Outdoor', emoji: '\ud83c\udf33' },
  { key: 'fancy', label: 'Fancy', emoji: '\u2728' },
  { key: 'adventure', label: 'Adventure', emoji: '\ud83c\udfd4\ufe0f' },
];

export const AddDateIdeaModal = ({ visible, onClose, onAdd }: AddDateIdeaModalProps) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DateIdeaCategory>('at-home');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim(), category);
    setTitle('');
    setDescription('');
    setCategory('at-home');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: theme.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 40,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'PlayfairDisplay_700Bold',
                  color: theme.textPrimary,
                }}
              >
                Add Date Idea
              </Text>
              <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
                <X size={24} color={theme.textMuted} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ gap: 16 }}>
                <Input
                  label="Title"
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g., Sunset kayaking"
                  maxLength={100}
                />

                <Input
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="What makes this date special?"
                  multiline
                  numberOfLines={3}
                  maxLength={300}
                />

                <View style={{ gap: 6 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme.textMuted,
                      fontFamily: 'Inter_500Medium',
                    }}
                  >
                    Category
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {CATEGORIES.map((cat) => (
                      <Pressable
                        key={cat.key}
                        onPress={() => setCategory(cat.key)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                          paddingHorizontal: 14,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor:
                            category === cat.key ? theme.primarySoft : theme.surface,
                          borderWidth: 2,
                          borderColor:
                            category === cat.key ? theme.primary : theme.accent,
                        }}
                        accessibilityLabel={cat.label}
                      >
                        <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Inter_500Medium',
                            color: category === cat.key ? theme.primary : theme.textPrimary,
                          }}
                        >
                          {cat.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={{ marginTop: 8 }}>
                  <Button
                    title="Add Idea"
                    onPress={handleSubmit}
                    disabled={!title.trim()}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
