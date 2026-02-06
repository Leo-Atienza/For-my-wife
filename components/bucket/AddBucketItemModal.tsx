import { View, Text, Modal, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BUCKET_CATEGORIES } from '@/lib/constants';
import type { BucketCategory } from '@/lib/types';

interface AddBucketItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string, category: BucketCategory) => void;
}

export const AddBucketItemModal = ({ visible, onClose, onAdd }: AddBucketItemModalProps) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BucketCategory>('someday');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), category);
    setTitle('');
    setCategory('someday');
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
                Add to Bucket List
              </Text>
              <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
                <X size={24} color={theme.textMuted} />
              </Pressable>
            </View>

            <View style={{ gap: 16 }}>
              <Input
                label="What do you want to do?"
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Watch the northern lights"
                maxLength={150}
                autoFocus
              />

              <View style={{ gap: 6 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.textMuted,
                    fontFamily: 'Inter_500Medium',
                  }}
                >
                  When?
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {BUCKET_CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat.key}
                      onPress={() => setCategory(cat.key)}
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        gap: 4,
                        paddingVertical: 12,
                        borderRadius: 12,
                        backgroundColor:
                          category === cat.key ? theme.primarySoft : theme.surface,
                        borderWidth: 2,
                        borderColor:
                          category === cat.key ? theme.primary : theme.accent,
                      }}
                      accessibilityLabel={cat.label}
                    >
                      <Text style={{ fontSize: 18 }}>{cat.emoji}</Text>
                      <Text
                        style={{
                          fontSize: 12,
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
                  title="Add Item"
                  onPress={handleSubmit}
                  disabled={!title.trim()}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
