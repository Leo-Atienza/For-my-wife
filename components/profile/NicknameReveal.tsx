import { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, Pressable, Easing, Modal } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface NicknameRevealProps {
  nickname: string;
  givenBy: string;
  visible: boolean;
  onDismiss: () => void;
}

export const NicknameReveal = ({ nickname, givenBy, visible, onDismiss }: NicknameRevealProps) => {
  const theme = useTheme();
  const flipAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.8)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (visible) {
      // Reset
      flipAnim.setValue(0);
      overlayOpacity.setValue(0);
      cardScale.setValue(0.8);
      setIsFlipped(false);

      // Fade in overlay + scale card entrance
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, flipAnim, overlayOpacity, cardScale]);

  const handleFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true);

    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  };

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  // Front face: 0deg → 90deg (visible first half)
  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '90deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5],
    outputRange: [1, 1, 0],
  });

  // Back face: -90deg → 0deg (visible second half)
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-90deg', '-90deg', '0deg'],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.51],
    outputRange: [0, 0, 1],
  });

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={handleDismiss}>
      <Animated.View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: overlayOpacity,
        }}
      >
        <Animated.View style={{ transform: [{ scale: cardScale }] }}>
          <Pressable onPress={isFlipped ? handleDismiss : handleFlip}>
            <View style={{ width: 280, height: 360 }}>
              {/* Front face */}
              <Animated.View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: theme.primary,
                  borderRadius: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 24,
                  backfaceVisibility: 'hidden',
                  transform: [{ perspective: 1000 }, { rotateY: frontRotate }],
                  opacity: frontOpacity,
                }}
              >
                <Text style={{ fontSize: 48, marginBottom: 16 }}>{'\u2764\ufe0f'}</Text>
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: 'PlayfairDisplay_700Bold',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    marginBottom: 8,
                  }}
                >
                  New Nickname!
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Inter_400Regular',
                    color: 'rgba(255,255,255,0.8)',
                    textAlign: 'center',
                  }}
                >
                  {givenBy} gave you a new name
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Inter_500Medium',
                    color: 'rgba(255,255,255,0.6)',
                    marginTop: 24,
                  }}
                >
                  Tap to reveal
                </Text>
              </Animated.View>

              {/* Back face */}
              <Animated.View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: theme.surface,
                  borderRadius: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 24,
                  borderWidth: 2,
                  borderColor: theme.accent,
                  backfaceVisibility: 'hidden',
                  transform: [{ perspective: 1000 }, { rotateY: backRotate }],
                  opacity: backOpacity,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Inter_500Medium',
                    color: theme.textMuted,
                    marginBottom: 8,
                  }}
                >
                  Your new nickname is
                </Text>
                <Text
                  style={{
                    fontSize: 36,
                    fontFamily: 'DancingScript_400Regular',
                    color: theme.primary,
                    textAlign: 'center',
                    lineHeight: 44,
                  }}
                >
                  {nickname}
                </Text>
                <View
                  style={{
                    width: 40,
                    height: 2,
                    backgroundColor: theme.accent,
                    borderRadius: 1,
                    marginVertical: 16,
                  }}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Inter_400Regular',
                    color: theme.textMuted,
                  }}
                >
                  with love from {givenBy}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Inter_400Regular',
                    color: theme.textMuted,
                    marginTop: 24,
                    opacity: 0.6,
                  }}
                >
                  Tap to close
                </Text>
              </Animated.View>
            </View>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
