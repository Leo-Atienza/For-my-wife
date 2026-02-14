import { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, RotateCcw, Lightbulb } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useLoveLanguageStore } from '@/stores/useLoveLanguageStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import {
  LOVE_LANGUAGE_QUESTIONS,
  LOVE_LANGUAGE_LABELS,
  LOVE_LANGUAGE_EMOJIS,
  LOVE_LANGUAGE_DESCRIPTIONS,
  LOVE_LANGUAGE_TIPS,
} from '@/lib/love-languages';
import type { LoveLanguageType, PartnerRole } from '@/lib/types';

const INITIAL_SCORES: Record<LoveLanguageType, number> = {
  'words-of-affirmation': 0,
  'quality-time': 0,
  'receiving-gifts': 0,
  'acts-of-service': 0,
  'physical-touch': 0,
};

const ResultsView = ({ partner }: { partner: PartnerRole }) => {
  const theme = useTheme();
  const result = useLoveLanguageStore((state) => state.getResult(partner));
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);
  const name = partner === 'partner1' ? partner1?.name : partner2?.name;

  if (!result) return null;

  const sortedLanguages = (Object.entries(result.scores) as [LoveLanguageType, number][])
    .sort((a, b) => b[1] - a[1]);
  const maxScore = sortedLanguages[0][1];
  const tips = LOVE_LANGUAGE_TIPS[result.primary];

  return (
    <View style={{ gap: 20 }}>
      {/* Primary result */}
      <View
        style={{
          backgroundColor: theme.primarySoft,
          borderRadius: 20,
          padding: 24,
          alignItems: 'center',
          gap: 12,
          borderWidth: 1,
          borderColor: theme.accent,
        }}
      >
        <Text style={{ fontSize: 48 }}>
          {LOVE_LANGUAGE_EMOJIS[result.primary]}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter_500Medium',
            color: theme.textMuted,
          }}
        >
          {name ? `${name}'s` : 'Your'} primary love language is
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: theme.primary,
            textAlign: 'center',
          }}
        >
          {LOVE_LANGUAGE_LABELS[result.primary]}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
          {LOVE_LANGUAGE_DESCRIPTIONS[result.primary]}
        </Text>
      </View>

      {/* Score breakdown */}
      <View
        style={{
          backgroundColor: theme.surface,
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: theme.accent,
          gap: 14,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Inter_600SemiBold',
            color: theme.textPrimary,
          }}
        >
          Score Breakdown
        </Text>
        {sortedLanguages.map(([language, score]) => (
          <View key={language} style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.textPrimary }}>
                {LOVE_LANGUAGE_EMOJIS[language]} {LOVE_LANGUAGE_LABELS[language]}
              </Text>
              <Text style={{ fontSize: 13, fontFamily: 'Inter_600SemiBold', color: theme.primary }}>
                {score}
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: theme.primarySoft,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: maxScore > 0 ? `${(score / maxScore) * 100}%` : '0%',
                  backgroundColor: theme.primary,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Tips */}
      <View
        style={{
          backgroundColor: theme.surface,
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: theme.accent,
          gap: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Lightbulb size={18} color={theme.primary} />
          <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: theme.textPrimary }}>
            Tips for This Language
          </Text>
        </View>
        {tips.map((tip, index) => (
          <View key={index} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 14, color: theme.primary }}>{'\u2022'}</Text>
            <Text style={{ flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', color: theme.textMuted, lineHeight: 20 }}>
              {tip}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function LoveLanguageScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const saveResult = useLoveLanguageStore((state) => state.saveResult);
  const result1 = useLoveLanguageStore((state) => state.getResult('partner1'));
  const result2 = useLoveLanguageStore((state) => state.getResult('partner2'));
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);

  const [isQuizzing, setIsQuizzing] = useState(false);
  const [quizPartner, setQuizPartner] = useState<PartnerRole>('partner1');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<LoveLanguageType, number>>({ ...INITIAL_SCORES });

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleStartQuiz = (partner: PartnerRole) => {
    setQuizPartner(partner);
    setCurrentIndex(0);
    setScores({ ...INITIAL_SCORES });
    setIsQuizzing(true);
  };

  const handleAnswer = (language: LoveLanguageType) => {
    const newScores = { ...scores, [language]: scores[language] + 1 };
    setScores(newScores);

    if (currentIndex < LOVE_LANGUAGE_QUESTIONS.length - 1) {
      // Animate transition
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz complete
      saveResult(quizPartner, newScores);
      setIsQuizzing(false);
    }
  };

  // Quiz view
  if (isQuizzing) {
    const question = LOVE_LANGUAGE_QUESTIONS[currentIndex];
    const progress = (currentIndex + 1) / LOVE_LANGUAGE_QUESTIONS.length;
    const name = quizPartner === 'partner1' ? partner1?.name : partner2?.name;

    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <PageHeader title="Love Language Quiz" />
        <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 32 }}>
          {/* Progress */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.textMuted, textAlign: 'center' }}>
              {name ? `${name}'s Quiz` : 'Quiz'} — Question {currentIndex + 1} of {LOVE_LANGUAGE_QUESTIONS.length}
            </Text>
            <View
              style={{
                height: 6,
                backgroundColor: theme.primarySoft,
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${progress * 100}%`,
                  backgroundColor: theme.primary,
                  borderRadius: 3,
                }}
              />
            </View>
          </View>

          {/* Question */}
          <Animated.View style={{ opacity: fadeAnim, gap: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'PlayfairDisplay_700Bold',
                color: theme.textPrimary,
                textAlign: 'center',
              }}
            >
              Which makes you feel more loved?
            </Text>

            {/* Option A */}
            <Pressable
              onPress={() => handleAnswer(question.optionA.language)}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <View
                style={{
                  backgroundColor: theme.surface,
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: theme.accent,
                }}
              >
                <Text style={{ fontSize: 16, fontFamily: 'Inter_500Medium', color: theme.textPrimary, lineHeight: 24 }}>
                  {question.optionA.text}
                </Text>
              </View>
            </Pressable>

            {/* Divider */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_600SemiBold',
                color: theme.textMuted,
                textAlign: 'center',
              }}
            >
              or
            </Text>

            {/* Option B */}
            <Pressable
              onPress={() => handleAnswer(question.optionB.language)}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <View
                style={{
                  backgroundColor: theme.surface,
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: theme.accent,
                }}
              >
                <Text style={{ fontSize: 16, fontFamily: 'Inter_500Medium', color: theme.textPrimary, lineHeight: 24 }}>
                  {question.optionB.text}
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    );
  }

  // Results / Start view
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Love Languages" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 90,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <View style={{ alignItems: 'center', gap: 8, paddingVertical: 8 }}>
          <Text style={{ fontSize: 36 }}>{'\u2764\ufe0f'}</Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              textAlign: 'center',
              lineHeight: 20,
              maxWidth: 300,
            }}
          >
            Discover how you and your partner feel most loved. Take the quiz to find your love language!
          </Text>
        </View>

        {/* Partner 1 */}
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay_700Bold', color: theme.textPrimary }}>
              {partner1?.name ?? 'Partner 1'}
            </Text>
            <Pressable
              onPress={() => handleStartQuiz('partner1')}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {result1 ? <RotateCcw size={14} color={theme.primary} /> : <Heart size={14} color={theme.primary} />}
                <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: theme.primary }}>
                  {result1 ? 'Retake' : 'Take Quiz'}
                </Text>
              </View>
            </Pressable>
          </View>
          {result1 ? (
            <ResultsView partner="partner1" />
          ) : (
            <View
              style={{
                backgroundColor: theme.primarySoft,
                borderRadius: 20,
                padding: 24,
                alignItems: 'center',
                gap: 8,
                borderWidth: 1,
                borderColor: theme.accent,
                borderStyle: 'dashed',
              }}
            >
              <Text style={{ fontSize: 32 }}>{'\u2753'}</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                Quiz not taken yet
              </Text>
              <Button title="Start Quiz" onPress={() => handleStartQuiz('partner1')} />
            </View>
          )}
        </View>

        {/* Partner 2 */}
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay_700Bold', color: theme.textPrimary }}>
              {partner2?.name ?? 'Partner 2'}
            </Text>
            <Pressable
              onPress={() => handleStartQuiz('partner2')}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {result2 ? <RotateCcw size={14} color={theme.primary} /> : <Heart size={14} color={theme.primary} />}
                <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: theme.primary }}>
                  {result2 ? 'Retake' : 'Take Quiz'}
                </Text>
              </View>
            </Pressable>
          </View>
          {result2 ? (
            <ResultsView partner="partner2" />
          ) : (
            <View
              style={{
                backgroundColor: theme.primarySoft,
                borderRadius: 20,
                padding: 24,
                alignItems: 'center',
                gap: 8,
                borderWidth: 1,
                borderColor: theme.accent,
                borderStyle: 'dashed',
              }}
            >
              <Text style={{ fontSize: 32 }}>{'\u2753'}</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                Quiz not taken yet
              </Text>
              <Button title="Start Quiz" onPress={() => handleStartQuiz('partner2')} />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
