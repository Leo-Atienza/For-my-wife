import { useEffect, useRef } from 'react';
import { Animated, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

const HEART_COUNT = 5;
const HEARTS = ['\u2764\ufe0f', '\ud83d\udc95', '\ud83d\udc96', '\ud83d\udc97', '\u2763\ufe0f'];

interface FloatingHeart {
  translateY: Animated.Value;
  translateX: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
}

export const FloatingHearts = () => {
  const theme = useTheme();
  const hearts = useRef<FloatingHeart[]>(
    Array.from({ length: HEART_COUNT }, () => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.5),
    }))
  ).current;

  useEffect(() => {
    hearts.forEach((heart, i) => {
      const startAnimation = () => {
        // Reset values
        heart.translateY.setValue(0);
        heart.translateX.setValue((Math.random() - 0.5) * 40);
        heart.opacity.setValue(0);
        heart.scale.setValue(0.4 + Math.random() * 0.3);

        Animated.sequence([
          Animated.delay(i * 1200 + Math.random() * 800),
          Animated.parallel([
            Animated.timing(heart.translateY, {
              toValue: -60 - Math.random() * 30,
              duration: 2500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(heart.translateX, {
              toValue: (Math.random() - 0.5) * 60,
              duration: 2500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(heart.opacity, {
                toValue: 0.6,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.delay(1200),
              Animated.timing(heart.opacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]).start(() => startAnimation());
      };

      startAnimation();
    });
  }, [hearts]);

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {hearts.map((heart, i) => (
        <Animated.Text
          key={i}
          style={{
            position: 'absolute',
            fontSize: 14 + (i % 3) * 4,
            transform: [
              { translateY: heart.translateY },
              { translateX: heart.translateX },
              { scale: heart.scale },
            ],
            opacity: heart.opacity,
          }}
        >
          {HEARTS[i % HEARTS.length]}
        </Animated.Text>
      ))}
    </View>
  );
};
