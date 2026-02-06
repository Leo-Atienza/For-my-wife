import { View, Text, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageCircle, Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useQuestionsStore } from '@/stores/useQuestionsStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { PartnerRole } from '@/lib/types';

export default function QuestionsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const createTodayEntry = useQuestionsStore((state) => state.createTodayEntry);
  const answerQuestion = useQuestionsStore((state) => state.answerQuestion);
  const entries = useQuestionsStore((state) => state.entries);
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);

  const [selectedPartner, setSelectedPartner] = useState<PartnerRole>('partner1');
  const [answer, setAnswer] = useState('');
  const [showAnswers, setShowAnswers] = useState(false);

  const todayEntry = createTodayEntry();

  const myAnswer =
    selectedPartner === 'partner1'
      ? todayEntry.partner1Answer
      : todayEntry.partner2Answer;

  const partnerAnswer =
    selectedPartner === 'partner1'
      ? todayEntry.partner2Answer
      : todayEntry.partner1Answer;

  const bothAnswered = !!todayEntry.partner1Answer && !!todayEntry.partner2Answer;

  const handleSubmit = () => {
    if (!answer.trim()) return;
    answerQuestion(todayEntry.id, selectedPartner, answer.trim());
    setAnswer('');
  };

  const pastEntries = entries.filter((e) => e.dateKey !== todayEntry.dateKey).slice(0, 10);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Daily Questions" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Partner selector */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => setSelectedPartner('partner1')}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
              backgroundColor:
                selectedPartner === 'partner1' ? theme.primary : theme.primarySoft,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_600SemiBold',
                color: selectedPartner === 'partner1' ? '#FFFFFF' : theme.textPrimary,
              }}
            >
              {partner1?.name ?? 'Me'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedPartner('partner2')}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
              backgroundColor:
                selectedPartner === 'partner2' ? theme.primary : theme.primarySoft,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_600SemiBold',
                color: selectedPartner === 'partner2' ? '#FFFFFF' : theme.textPrimary,
              }}
            >
              {partner2?.name ?? 'Partner'}
            </Text>
          </Pressable>
        </View>

        {/* Today's question */}
        <Card style={{ borderColor: theme.primary, borderWidth: 2 }}>
          <View style={{ alignItems: 'center', gap: 8 }}>
            <View
              style={{
                backgroundColor: theme.primarySoft,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'Inter_600SemiBold',
                  color: theme.primary,
                  textTransform: 'uppercase',
                }}
              >
                {todayEntry.category === 'would-you-rather'
                  ? 'Would You Rather'
                  : "Today's Question"}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'PlayfairDisplay_700Bold',
                color: theme.textPrimary,
                textAlign: 'center',
                lineHeight: 26,
              }}
            >
              {todayEntry.question}
            </Text>
          </View>
        </Card>

        {/* Answer section */}
        {myAnswer ? (
          <Card>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.primary }}>
                Your answer:
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Inter_400Regular',
                  color: theme.textPrimary,
                  lineHeight: 22,
                }}
              >
                {myAnswer}
              </Text>
            </View>
          </Card>
        ) : (
          <View style={{ gap: 12 }}>
            <Input
              value={answer}
              onChangeText={setAnswer}
              placeholder="Type your answer..."
              multiline
              numberOfLines={3}
              maxLength={500}
            />
            <Button
              title="Submit Answer"
              onPress={handleSubmit}
              disabled={!answer.trim()}
            />
          </View>
        )}

        {/* Partner's answer (revealed only when both answer) */}
        {myAnswer && (
          <View style={{ gap: 8 }}>
            <Pressable
              onPress={() => setShowAnswers(!showAnswers)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              {bothAnswered ? (
                showAnswers ? (
                  <EyeOff size={18} color={theme.primary} />
                ) : (
                  <Eye size={18} color={theme.primary} />
                )
              ) : (
                <EyeOff size={18} color={theme.textMuted} />
              )}
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Inter_600SemiBold',
                  color: bothAnswered ? theme.primary : theme.textMuted,
                }}
              >
                {bothAnswered
                  ? showAnswers
                    ? 'Hide partner\'s answer'
                    : 'Reveal partner\'s answer'
                  : 'Waiting for partner to answer...'}
              </Text>
            </Pressable>

            {bothAnswered && showAnswers && partnerAnswer && (
              <Card>
                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.primary }}>
                    {selectedPartner === 'partner1'
                      ? partner2?.name ?? 'Partner'
                      : partner1?.name ?? 'Me'}
                    's answer:
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Inter_400Regular',
                      color: theme.textPrimary,
                      lineHeight: 22,
                    }}
                  >
                    {partnerAnswer}
                  </Text>
                </View>
              </Card>
            )}
          </View>
        )}

        {/* Past questions */}
        {pastEntries.length > 0 && (
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'PlayfairDisplay_700Bold',
                color: theme.textPrimary,
              }}
            >
              Previous Questions
            </Text>
            {pastEntries.map((entry) => (
              <Card key={entry.id}>
                <View style={{ gap: 6 }}>
                  <Text style={{ fontSize: 11, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                    {entry.dateKey}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Inter_600SemiBold',
                      color: theme.textPrimary,
                    }}
                  >
                    {entry.question}
                  </Text>
                  {entry.partner1Answer && (
                    <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                      {partner1?.name}: {entry.partner1Answer}
                    </Text>
                  )}
                  {entry.partner2Answer && (
                    <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                      {partner2?.name}: {entry.partner2Answer}
                    </Text>
                  )}
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
