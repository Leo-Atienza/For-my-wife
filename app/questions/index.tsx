import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { MessageCircle, Eye, EyeOff, Camera } from 'lucide-react-native';
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
  const submitPhoto = useQuestionsStore((state) => state.submitPhoto);
  const entries = useQuestionsStore((state) => state.entries);
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);

  const [selectedPartner, setSelectedPartner] = useState<PartnerRole>('partner1');
  const [answer, setAnswer] = useState('');
  const [showAnswers, setShowAnswers] = useState(false);

  const todayEntry = createTodayEntry();
  const isPhotoChallenge = todayEntry.category === 'photo-challenge';

  const myAnswer =
    selectedPartner === 'partner1'
      ? todayEntry.partner1Answer
      : todayEntry.partner2Answer;

  const partnerAnswer =
    selectedPartner === 'partner1'
      ? todayEntry.partner2Answer
      : todayEntry.partner1Answer;

  const myPhoto =
    selectedPartner === 'partner1'
      ? todayEntry.partner1Photo
      : todayEntry.partner2Photo;

  const partnerPhoto =
    selectedPartner === 'partner1'
      ? todayEntry.partner2Photo
      : todayEntry.partner1Photo;

  const bothAnswered = isPhotoChallenge
    ? !!todayEntry.partner1Photo && !!todayEntry.partner2Photo
    : !!todayEntry.partner1Answer && !!todayEntry.partner2Answer;

  const hasMyResponse = isPhotoChallenge ? !!myPhoto : !!myAnswer;

  const handleSubmit = () => {
    if (!answer.trim()) return;
    answerQuestion(todayEntry.id, selectedPartner, answer.trim());
    setAnswer('');
  };

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      submitPhoto(todayEntry.id, selectedPartner, result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      submitPhoto(todayEntry.id, selectedPartner, result.assets[0].uri);
    }
  };

  const pastEntries = entries.filter((e) => e.dateKey !== todayEntry.dateKey).slice(0, 10);

  const getCategoryLabel = (category: string) => {
    if (category === 'would-you-rather') return 'Would You Rather';
    if (category === 'photo-challenge') return 'Photo Challenge';
    return "Today's Question";
  };

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
                backgroundColor: isPhotoChallenge ? theme.accent + '30' : theme.primarySoft,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {isPhotoChallenge && <Camera size={12} color={theme.primary} />}
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'Inter_600SemiBold',
                  color: theme.primary,
                  textTransform: 'uppercase',
                }}
              >
                {getCategoryLabel(todayEntry.category)}
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

        {/* Answer / Photo section */}
        {hasMyResponse ? (
          <Card>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.primary }}>
                {isPhotoChallenge ? 'Your photo:' : 'Your answer:'}
              </Text>
              {isPhotoChallenge && myPhoto ? (
                <Image
                  source={{ uri: myPhoto }}
                  style={{
                    width: '100%',
                    height: 200,
                    borderRadius: 12,
                  }}
                  resizeMode="cover"
                />
              ) : (
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
              )}
            </View>
          </Card>
        ) : isPhotoChallenge ? (
          <View style={{ gap: 12 }}>
            <Button
              title="Take a Photo"
              onPress={handleTakePhoto}
            />
            <Button
              title="Choose from Gallery"
              onPress={handlePickPhoto}
              variant="secondary"
            />
          </View>
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
        {hasMyResponse && (
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
                    ? isPhotoChallenge ? "Hide partner's photo" : "Hide partner's answer"
                    : isPhotoChallenge ? "Reveal partner's photo" : "Reveal partner's answer"
                  : isPhotoChallenge ? 'Waiting for partner to share...' : 'Waiting for partner to answer...'}
              </Text>
            </Pressable>

            {bothAnswered && showAnswers && (
              <Card>
                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.primary }}>
                    {selectedPartner === 'partner1'
                      ? partner2?.name ?? 'Partner'
                      : partner1?.name ?? 'Me'}
                    {isPhotoChallenge ? "'s photo:" : "'s answer:"}
                  </Text>
                  {isPhotoChallenge && partnerPhoto ? (
                    <Image
                      source={{ uri: partnerPhoto }}
                      style={{
                        width: '100%',
                        height: 200,
                        borderRadius: 12,
                      }}
                      resizeMode="cover"
                    />
                  ) : partnerAnswer ? (
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
                  ) : null}
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
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 11, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                      {entry.dateKey}
                    </Text>
                    {entry.category === 'photo-challenge' && (
                      <View
                        style={{
                          backgroundColor: theme.accent + '30',
                          paddingHorizontal: 6,
                          paddingVertical: 1,
                          borderRadius: 4,
                        }}
                      >
                        <Text style={{ fontSize: 9, fontFamily: 'Inter_600SemiBold', color: theme.primary }}>
                          PHOTO
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Inter_600SemiBold',
                      color: theme.textPrimary,
                    }}
                  >
                    {entry.question}
                  </Text>
                  {entry.category === 'photo-challenge' ? (
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {entry.partner1Photo && (
                        <Image
                          source={{ uri: entry.partner1Photo }}
                          style={{ width: 80, height: 80, borderRadius: 8 }}
                          resizeMode="cover"
                        />
                      )}
                      {entry.partner2Photo && (
                        <Image
                          source={{ uri: entry.partner2Photo }}
                          style={{ width: 80, height: 80, borderRadius: 8 }}
                          resizeMode="cover"
                        />
                      )}
                    </View>
                  ) : (
                    <>
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
                    </>
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
