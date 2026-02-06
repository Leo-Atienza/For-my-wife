import { View, Text, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useProfileStore } from '@/stores/useProfileStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MOOD_EMOJIS } from '@/lib/constants';
import type { PartnerRole } from '@/lib/types';

export default function StatusScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);
  const updatePartner = useProfileStore((state) => state.updatePartner);

  const [editingPartner, setEditingPartner] = useState<PartnerRole | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [statusText, setStatusText] = useState('');

  const handleEdit = (partner: PartnerRole) => {
    const profile = partner === 'partner1' ? partner1 : partner2;
    setEditingPartner(partner);
    setSelectedEmoji(profile?.currentStatus?.emoji ?? '');
    setStatusText(profile?.currentStatus?.text ?? '');
  };

  const handleSave = () => {
    if (!editingPartner || !selectedEmoji) return;
    updatePartner(editingPartner, {
      currentStatus: {
        emoji: selectedEmoji,
        text: statusText.trim(),
        updatedAt: new Date().toISOString(),
      },
    });
    setEditingPartner(null);
    setSelectedEmoji('');
    setStatusText('');
  };

  const renderStatusCard = (partner: PartnerRole) => {
    const profile = partner === 'partner1' ? partner1 : partner2;
    const status = profile?.currentStatus;
    const name = profile?.name ?? (partner === 'partner1' ? 'Me' : 'Partner');

    return (
      <Card key={partner}>
        <View style={{ gap: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'DancingScript_400Regular',
              color: theme.primary,
            }}
          >
            {name}
          </Text>
          {status ? (
            <View style={{ alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 40 }}>{status.emoji}</Text>
              {status.text ? (
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Inter_400Regular',
                    color: theme.textPrimary,
                    textAlign: 'center',
                  }}
                >
                  {status.text}
                </Text>
              ) : null}
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'Inter_400Regular',
                  color: theme.textMuted,
                }}
              >
                Updated{' '}
                {new Date(status.updatedAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ) : (
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_400Regular',
                color: theme.textMuted,
                textAlign: 'center',
              }}
            >
              No status set yet
            </Text>
          )}
          <Pressable
            onPress={() => handleEdit(partner)}
            style={{
              alignSelf: 'center',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: theme.primarySoft,
            }}
          >
            <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.primary }}>
              {status ? 'Update' : 'Set Status'}
            </Text>
          </Pressable>
        </View>
      </Card>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="How We're Feeling" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
            textAlign: 'center',
          }}
        >
          Share how you're feeling right now. Your partner will always see your latest status.
        </Text>

        {/* Status cards */}
        {renderStatusCard('partner1')}
        {renderStatusCard('partner2')}

        {/* Edit mode */}
        {editingPartner && (
          <Card style={{ borderColor: theme.primary, borderWidth: 2 }}>
            <View style={{ gap: 14 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'PlayfairDisplay_700Bold',
                  color: theme.textPrimary,
                }}
              >
                Update Status
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {MOOD_EMOJIS.map((item) => (
                  <Pressable
                    key={item.label}
                    onPress={() => setSelectedEmoji(item.emoji)}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor:
                        selectedEmoji === item.emoji ? theme.primarySoft : theme.surface,
                      borderWidth: 2,
                      borderColor:
                        selectedEmoji === item.emoji ? theme.primary : theme.accent,
                    }}
                    accessibilityLabel={item.label}
                  >
                    <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                  </Pressable>
                ))}
              </View>

              <Input
                label="Status message (optional)"
                value={statusText}
                onChangeText={setStatusText}
                placeholder="e.g., Thinking of you..."
                maxLength={100}
              />

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Cancel"
                    variant="secondary"
                    onPress={() => setEditingPartner(null)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Save"
                    onPress={handleSave}
                    disabled={!selectedEmoji}
                  />
                </View>
              </View>
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}
