import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface CheckmarkDrawProps {
  active: boolean;
  size?: number;
  color?: string;
}

/**
 * Animated checkmark that "draws" itself with a satisfying
 * scale-in + rotate effect when `active` becomes true.
 * Renders a simple checkmark shape using bordered Views.
 */
export function CheckmarkDraw({ active, size = 16, color = '#FFFFFF' }: CheckmarkDrawProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);

      Animated.sequence([
        // Brief pause so the circle fill is visible first
        Animated.delay(100),
        // Draw checkmark with a pop
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 120,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      scaleAnim.setValue(1);
      rotateAnim.setValue(1);
    }
  }, [active, scaleAnim, rotateAnim]);

  if (!active) {
    return null;
  }

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-45deg', '0deg'],
  });

  // Checkmark built from two bordered View "legs"
  const longLeg = size * 0.65;
  const shortLeg = size * 0.35;
  const thickness = Math.max(2, size * 0.15);

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [
          { scale: scaleAnim },
          { rotate },
        ],
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: shortLeg,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness / 2,
          bottom: size * 0.35,
          left: size * 0.1,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: longLeg,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness / 2,
          bottom: size * 0.38,
          right: size * 0.08,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </Animated.View>
  );
}
