import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useThinkingStore } from '@/stores/useThinkingStore';
import { useTheme } from '@/hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ThinkingOfYouReceiver = () => {
  const theme = useTheme();
  const lastReceivedAt = useThinkingStore((s) => s.lastReceivedAt);
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-50)).current;
  const prevReceivedAt = useRef<string | null>(null);

  useEffect(() => {
    if (!lastReceivedAt || lastReceivedAt === prevReceivedAt.current) return;
    prevReceivedAt.current = lastReceivedAt;

    setVisible(true);
    opacity.setValue(0);
    translateY.setValue(-50);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -50,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => setVisible(false));
      }, 3000);
    });
  }, [lastReceivedAt, opacity, translateY]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
        opacity,
        transform: [{ translateY }],
      }}
      pointerEvents="none"
    >
      <View
        style={{
          backgroundColor: theme.primary,
          borderRadius: 24,
          paddingVertical: 12,
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          maxWidth: SCREEN_WIDTH - 48,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'Inter_600SemiBold',
            color: '#FFFFFF',
          }}
        >
          Your partner is thinking of you
        </Text>
      </View>
    </Animated.View>
  );
};
