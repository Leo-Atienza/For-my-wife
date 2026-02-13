import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const PARTICLE_COUNT = 12;
const COLORS = ['#E11D48', '#F59E0B', '#7C3AED', '#10B981', '#3B82F6', '#EC4899'];

interface Particle {
  translateX: Animated.Value;
  translateY: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  rotate: Animated.Value;
  color: string;
  angle: number;
}

interface ConfettiBurstProps {
  active: boolean;
  onComplete?: () => void;
}

export const ConfettiBurst = ({ active, onComplete }: ConfettiBurstProps) => {
  const particles = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
      rotate: new Animated.Value(0),
      color: COLORS[i % COLORS.length],
      angle: (i / PARTICLE_COUNT) * Math.PI * 2,
    }))
  ).current;

  useEffect(() => {
    if (!active) return;

    // Reset all particles
    particles.forEach((p) => {
      p.translateX.setValue(0);
      p.translateY.setValue(0);
      p.opacity.setValue(1);
      p.scale.setValue(1);
      p.rotate.setValue(0);
    });

    const animations = particles.map((p) => {
      const distance = 50 + Math.random() * 40;
      const targetX = Math.cos(p.angle) * distance;
      const targetY = Math.sin(p.angle) * distance - 20; // Bias upward

      return Animated.parallel([
        Animated.timing(p.translateX, {
          toValue: targetX,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(p.translateY, {
          toValue: targetY + 30, // Gravity effect
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(p.scale, {
          toValue: 0.2,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(p.rotate, {
          toValue: Math.random() * 4 - 2,
          duration: 700,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => {
      onComplete?.();
    });
  }, [active, particles, onComplete]);

  if (!active) return null;

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
      {particles.map((p, i) => {
        const spin = p.rotate.interpolate({
          inputRange: [-2, 2],
          outputRange: ['-360deg', '360deg'],
        });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: i % 3 === 0 ? 8 : 6,
              height: i % 3 === 0 ? 8 : i % 2 === 0 ? 10 : 6,
              borderRadius: i % 3 === 0 ? 4 : 1,
              backgroundColor: p.color,
              transform: [
                { translateX: p.translateX },
                { translateY: p.translateY },
                { scale: p.scale },
                { rotate: spin },
              ],
              opacity: p.opacity,
            }}
          />
        );
      })}
    </View>
  );
};
