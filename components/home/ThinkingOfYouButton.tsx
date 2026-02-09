import { useState, useRef, useEffect } from 'react';
import { Pressable, Text, View, Animated } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useThinkingStore } from '@/stores/useThinkingStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';

export const ThinkingOfYouButton = () => {
  const theme = useTheme();
  const myRole = useAuthStore((s) => s.myRole);
  const sendTap = useThinkingStore((s) => s.sendTap);
  const getTodayCount = useThinkingStore((s) => s.getTodayCount);

  const [justSent, setJustSent] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const partnerRole = myRole ?? 'partner1';
  const todayCount = getTodayCount(partnerRole);

  const handlePress = () => {
    if (justSent) return;
    sendTap(partnerRole);
    setJustSent(true);

    // Heartbeat animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => setJustSent(false), 2000);
  };

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <Pressable
        onPress={handlePress}
        style={{
          backgroundColor: justSent ? theme.primary : theme.primarySoft,
          width: 64,
          height: 64,
          borderRadius: 32,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: theme.primary,
        }}
        accessibilityLabel="Thinking of you"
        accessibilityRole="button"
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Heart
            size={28}
            color={justSent ? '#FFFFFF' : theme.primary}
            fill={justSent ? '#FFFFFF' : 'transparent'}
          />
        </Animated.View>
      </Pressable>
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Inter_500Medium',
          color: justSent ? theme.primary : theme.textMuted,
        }}
      >
        {justSent ? 'Sent!' : 'Thinking of You'}
      </Text>
      {todayCount > 0 && (
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
          }}
        >
          {todayCount} today
        </Text>
      )}
    </View>
  );
};
