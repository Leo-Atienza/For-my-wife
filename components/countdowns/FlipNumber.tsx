import { useEffect, useRef } from 'react';
import { Animated, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface FlipNumberProps {
  value: number;
  fontSize?: number;
  label: string;
}

export const FlipNumber = ({ value, fontSize = 22, label }: FlipNumberProps) => {
  const theme = useTheme();
  const flipAnim = useRef(new Animated.Value(0)).current;
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      flipAnim.setValue(1);
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [value, flipAnim]);

  const translateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const opacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.4, 0],
  });

  const displayValue = typeof value === 'number' && value >= 1000
    ? value.toLocaleString()
    : String(value);

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          backgroundColor: theme.surface,
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 4,
          minWidth: 40,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: theme.accent,
          overflow: 'hidden',
        }}
      >
        <Animated.Text
          style={{
            fontSize,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: theme.primary,
            transform: [{ translateY }],
            opacity,
          }}
        >
          {displayValue}
        </Animated.Text>
      </View>
      <Text
        style={{
          fontSize: 11,
          fontFamily: 'Inter_400Regular',
          color: theme.textMuted,
          marginTop: 4,
        }}
      >
        {label}
      </Text>
    </View>
  );
};
