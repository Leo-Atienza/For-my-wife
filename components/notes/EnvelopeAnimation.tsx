import { useEffect, useRef, useState } from 'react';
import { Animated, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface EnvelopeAnimationProps {
  onComplete: () => void;
  mood?: string;
}

export const EnvelopeAnimation = ({ onComplete, mood }: EnvelopeAnimationProps) => {
  const theme = useTheme();
  const flapRotate = useRef(new Animated.Value(0)).current;
  const noteSlide = useRef(new Animated.Value(0)).current;
  const envelopeOpacity = useRef(new Animated.Value(1)).current;
  const noteScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      // Brief pause before opening
      Animated.delay(300),
      // Flap opens upward
      Animated.timing(flapRotate, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Note slides up out of envelope
      Animated.parallel([
        Animated.timing(noteSlide, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(noteScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Envelope fades away
      Animated.timing(envelopeOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onComplete());
  }, [flapRotate, noteSlide, envelopeOpacity, noteScale, onComplete]);

  const flapAngle = flapRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  const slideUp = noteSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
      {/* Note paper that slides up */}
      <Animated.View
        style={{
          position: 'absolute',
          width: 200,
          height: 140,
          backgroundColor: theme.surface,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.accent,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ translateY: slideUp }, { scale: noteScale }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {mood && <Text style={{ fontSize: 28 }}>{mood}</Text>}
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'DancingScript_400Regular',
            color: theme.primary,
            marginTop: 8,
          }}
        >
          A note for you...
        </Text>
      </Animated.View>

      {/* Envelope body */}
      <Animated.View
        style={{
          width: 220,
          height: 130,
          backgroundColor: theme.primarySoft,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: theme.primary,
          opacity: envelopeOpacity,
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        {/* Envelope interior */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 20 }}>{'\ud83d\udc8c'}</Text>
        </View>
      </Animated.View>

      {/* Envelope flap (triangle) */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 60,
          width: 0,
          height: 0,
          borderLeftWidth: 110,
          borderRightWidth: 110,
          borderTopWidth: 65,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: theme.primary,
          opacity: envelopeOpacity,
          zIndex: 3,
          transform: [
            { perspective: 800 },
            { rotateX: flapAngle },
          ],
        }}
      />
    </View>
  );
};
