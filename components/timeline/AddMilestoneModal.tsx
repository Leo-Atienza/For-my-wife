import { View, Text, Modal, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TIMELINE_ICONS } from '@/lib/constants';

interface AddMilestoneModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string, date: string, description?: string, icon?: string) => void;
}

export const AddMilestoneModal = ({ visible, onClose, onAdd }: AddMilestoneModalProps) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('\u2764\ufe0f');

  const handleSubmit = () => {
    if (!title.trim() || !date.trim()) return;
    onAdd(title.trim(), date.trim(), description.trim() || undefined, selectedIcon);
    setTitle('');
    setDate('');
    setDescription('');
    setSelectedIcon('\u2764\ufe0f');
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
              maxHeight: '85%',
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
                Add Milestone
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
                  placeholder="e.g., First date"
                  maxLength={100}
                />

                <Input
                  label="Date (YYYY-MM-DD)"
                  value={date}
                  onChangeText={setDate}
                  placeholder="2024-01-15"
                  maxLength={10}
                />

                <Input
                  label="Description (optional)"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="What made this special?"
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
                    Icon
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {TIMELINE_ICONS.map((item) => (
                      <Pressable
                        key={item.label}
                        onPress={() => setSelectedIcon(item.emoji)}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor:
                            selectedIcon === item.emoji
                              ? theme.primarySoft
                              : theme.surface,
                          borderWidth: 2,
                          borderColor:
                            selectedIcon === item.emoji
                              ? theme.primary
                              : theme.accent,
                        }}
                        accessibilityLabel={item.label}
                      >
                        <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={{ marginTop: 8 }}>
                  <Button
                    title="Add Milestone"
                    onPress={handleSubmit}
                    disabled={!title.trim() || !date.trim()}
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
