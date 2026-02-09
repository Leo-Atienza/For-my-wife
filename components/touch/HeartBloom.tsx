import { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';

interface HeartBloomProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export const HeartBloom = ({ x, y, onComplete }: HeartBloomProps) => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 2,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -40,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(onComplete);
  }, [scale, opacity, translateY, onComplete]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x - 15,
        top: y - 15,
        opacity,
        transform: [{ scale }, { translateY }],
      }}
      pointerEvents="none"
    >
      <Text style={{ fontSize: 30 }}>{'\u2764\ufe0f'}</Text>
    </Animated.View>
  );
};
