import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ChevronLeft, ChevronRight, Camera, Check } from 'lucide-react-native';
import { useCoupleStore } from '@/stores/useCoupleStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useNicknameStore } from '@/stores/useNicknameStore';
import { useCountdownsStore } from '@/stores/useCountdownsStore';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { generateId } from '@/lib/utils';
import { THEMES, ONBOARDING_STEPS } from '@/lib/constants';
import type { ThemeName, OnboardingData } from '@/lib/types';

const TOTAL_STEPS = ONBOARDING_STEPS.length;

export default function SetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const setProfile = useCoupleStore((state) => state.setProfile);
  const setPartner = useProfileStore((state) => state.setPartner);
  const addNickname = useNicknameStore((state) => state.addNickname);
  const addCountdown = useCountdownsStore((state) => state.addCountdown);

  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    yourName: '',
    partnerName: '',
    partnerNickname: '',
    anniversaryDate: '',
    relationshipType: 'local',
    theme: 'rose',
    couplePhoto: undefined,
  });

  const currentStep = ONBOARDING_STEPS[step];
  const isLastStep = step === TOTAL_STEPS - 1;

  const canAdvance = (): boolean => {
    switch (step) {
      case 0: return data.yourName.trim().length > 0;
      case 1: return data.partnerName.trim().length > 0;
      case 2: return data.partnerNickname.trim().length > 0;
      case 3: return data.anniversaryDate.trim().length > 0;
      case 4: return true;
      case 5: return true;
      case 6: return true; // Photo is optional
      default: return false;
    }
  };

  const goNext = () => {
    if (isLastStep) {
      finishSetup();
    } else {
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setData((d) => ({ ...d, couplePhoto: result.assets[0].uri }));
    }
  };

  const finishSetup = () => {
    // Create couple profile
    setProfile({
      couplePhoto: data.couplePhoto,
      anniversaryDate: data.anniversaryDate,
      relationshipType: data.relationshipType,
      theme: data.theme,
      createdAt: new Date().toISOString(),
    });

    // Create partner profiles
    setPartner('partner1', {
      id: generateId(),
      role: 'partner1',
      name: data.yourName.trim(),
      funFacts: [],
      createdAt: new Date().toISOString(),
    });

    setPartner('partner2', {
      id: generateId(),
      role: 'partner2',
      name: data.partnerName.trim(),
      funFacts: [],
      createdAt: new Date().toISOString(),
    });

    // Set the nickname
    addNickname('partner2', 'partner1', data.partnerNickname.trim());

    // Auto-create anniversary countdown
    const nextAnniversary = getNextAnniversary(data.anniversaryDate);
    addCountdown('Anniversary', nextAnniversary, '\u2764\ufe0f', true);

    router.replace('/');
  };

  const getNextAnniversary = (dateStr: string): string => {
    const anniversary = new Date(dateStr);
    const now = new Date();
    const thisYear = new Date(now.getFullYear(), anniversary.getMonth(), anniversary.getDate());

    if (thisYear > now) {
      return thisYear.toISOString();
    }
    return new Date(now.getFullYear() + 1, anniversary.getMonth(), anniversary.getDate()).toISOString();
  };

  const renderStepContent = () => {
    switch (step) {
      case 0: // Your name
        return (
          <Input
            value={data.yourName}
            onChangeText={(text) => setData((d) => ({ ...d, yourName: text }))}
            placeholder="Your name"
            autoFocus
            maxLength={30}
          />
        );

      case 1: // Partner's name
        return (
          <Input
            value={data.partnerName}
            onChangeText={(text) => setData((d) => ({ ...d, partnerName: text }))}
            placeholder="Their name"
            autoFocus
            maxLength={30}
          />
        );

      case 2: // Nickname
        return (
          <Input
            value={data.partnerNickname}
            onChangeText={(text) => setData((d) => ({ ...d, partnerNickname: text }))}
            placeholder="e.g., Sunshine, Babe, My Love"
            autoFocus
            maxLength={30}
          />
        );

      case 3: // Anniversary date
        return (
          <Input
            value={data.anniversaryDate}
            onChangeText={(text) => setData((d) => ({ ...d, anniversaryDate: text }))}
            placeholder="YYYY-MM-DD"
            maxLength={10}
          />
        );

      case 4: // Relationship type
        return (
          <View style={{ gap: 12 }}>
            <Pressable
              onPress={() => setData((d) => ({ ...d, relationshipType: 'local' }))}
              style={{
                backgroundColor: data.relationshipType === 'local' ? theme.primarySoft : theme.surface,
                borderRadius: 16,
                padding: 20,
                borderWidth: 2,
                borderColor: data.relationshipType === 'local' ? theme.primary : theme.accent,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 28 }}>{'\ud83c\udfe0'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: theme.textPrimary }}>
                  Same City
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                  We live close to each other
                </Text>
              </View>
              {data.relationshipType === 'local' && <Check size={22} color={theme.primary} />}
            </Pressable>

            <Pressable
              onPress={() => setData((d) => ({ ...d, relationshipType: 'ldr' }))}
              style={{
                backgroundColor: data.relationshipType === 'ldr' ? theme.primarySoft : theme.surface,
                borderRadius: 16,
                padding: 20,
                borderWidth: 2,
                borderColor: data.relationshipType === 'ldr' ? theme.primary : theme.accent,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 28 }}>{'\u2708\ufe0f'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: theme.textPrimary }}>
                  Long Distance
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                  We&apos;re far apart but close at heart
                </Text>
              </View>
              {data.relationshipType === 'ldr' && <Check size={22} color={theme.primary} />}
            </Pressable>
          </View>
        );

      case 5: // Theme
        return (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {(Object.keys(THEMES) as ThemeName[]).map((themeName) => {
              const themeColors = THEMES[themeName];
              const isSelected = data.theme === themeName;
              return (
                <Pressable
                  key={themeName}
                  onPress={() => setData((d) => ({ ...d, theme: themeName }))}
                  style={{
                    width: '47%',
                    backgroundColor: themeColors.primarySoft,
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 2,
                    borderColor: isSelected ? themeColors.primary : themeColors.accent,
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: themeColors.primary,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Inter_600SemiBold',
                      color: themeColors.primary,
                      textTransform: 'capitalize',
                    }}
                  >
                    {themeName}
                  </Text>
                  {isSelected && <Check size={18} color={themeColors.primary} />}
                </Pressable>
              );
            })}
          </View>
        );

      case 6: // Photo
        return (
          <View style={{ alignItems: 'center', gap: 20 }}>
            {data.couplePhoto ? (
              <Pressable onPress={pickPhoto}>
                <Image
                  source={{ uri: data.couplePhoto }}
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: 90,
                    borderWidth: 3,
                    borderColor: theme.accent,
                  }}
                />
              </Pressable>
            ) : (
              <Pressable
                onPress={pickPhoto}
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: 90,
                  backgroundColor: theme.primarySoft,
                  borderWidth: 2,
                  borderColor: theme.accent,
                  borderStyle: 'dashed',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Camera size={36} color={theme.primary} />
                <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: theme.primary }}>
                  Add Photo
                </Text>
              </Pressable>
            )}
            <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
              Tap to {data.couplePhoto ? 'change' : 'add'} your couple photo
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress bar */}
        <View style={{ flexDirection: 'row', gap: 4, marginBottom: 40 }}>
          {ONBOARDING_STEPS.map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                backgroundColor: i <= step ? theme.primary : theme.accent,
              }}
            />
          ))}
        </View>

        {/* Step header */}
        <View style={{ marginBottom: 32, gap: 8 }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: theme.textPrimary,
            }}
          >
            {currentStep.title}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              lineHeight: 22,
            }}
          >
            {currentStep.subtitle}
          </Text>
        </View>

        {/* Step content */}
        <View style={{ flex: 1 }}>
          {renderStepContent()}
        </View>

        {/* Navigation buttons */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 32,
          }}
        >
          {step > 0 ? (
            <Pressable
              onPress={goBack}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                padding: 8,
              }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ChevronLeft size={20} color={theme.textMuted} />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Inter_500Medium',
                  color: theme.textMuted,
                }}
              >
                Back
              </Text>
            </Pressable>
          ) : (
            <View />
          )}

          <Button
            title={isLastStep ? 'Start Our Journey' : 'Continue'}
            onPress={goNext}
            disabled={!canAdvance()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
