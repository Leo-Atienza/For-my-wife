import { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Dimensions, Animated, PanResponder } from 'react-native';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/lib/supabase';
import { HeartBloom } from './HeartBloom';
import type { RealtimeChannel } from '@supabase/supabase-js';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 80;
const CANVAS_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - 100;

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface HeartPosition {
  id: string;
  x: number;
  y: number;
}

export const TouchCanvas = () => {
  const theme = useTheme();
  const myRole = useAuthStore((s) => s.myRole);
  const spaceId = useAuthStore((s) => s.spaceId);

  const [myTouch, setMyTouch] = useState<TouchPoint | null>(null);
  const [partnerTouch, setPartnerTouch] = useState<TouchPoint | null>(null);
  const [hearts, setHearts] = useState<HeartPosition[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const myTouchOpacity = useRef(new Animated.Value(0)).current;
  const partnerTouchOpacity = useRef(new Animated.Value(0)).current;

  // Check for overlap between touches
  const checkOverlap = useCallback(
    (p1: TouchPoint, p2: TouchPoint) => {
      const distance = Math.sqrt(
        Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
      );
      if (distance < 60) {
        const heartId = `${Date.now()}-${Math.random()}`;
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        setHearts((prev) => [...prev.slice(-10), { id: heartId, x: midX, y: midY }]);
      }
    },
    []
  );

  // Set up broadcast channel
  useEffect(() => {
    if (!spaceId) return;

    const channel = supabase.channel(`touch-${spaceId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on('broadcast', { event: 'touch' }, ({ payload }) => {
        if (payload.partner !== myRole) {
          const point: TouchPoint = {
            x: payload.x,
            y: payload.y,
            timestamp: Date.now(),
          };
          setPartnerTouch(point);

          Animated.timing(partnerTouchOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }).start();

          // Check overlap with current touch
          setMyTouch((current) => {
            if (current) checkOverlap(current, point);
            return current;
          });
        }
      })
      .on('broadcast', { event: 'touch-end' }, ({ payload }) => {
        if (payload.partner !== myRole) {
          Animated.timing(partnerTouchOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setPartnerTouch(null));
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [spaceId, myRole, partnerTouchOpacity, checkOverlap]);

  // Send touch events throttled
  const lastSendRef = useRef(0);
  const sendTouch = useCallback(
    (x: number, y: number) => {
      const now = Date.now();
      if (now - lastSendRef.current < 66) return; // ~15fps
      lastSendRef.current = now;

      channelRef.current?.send({
        type: 'broadcast',
        event: 'touch',
        payload: { partner: myRole, x, y },
      });
    },
    [myRole]
  );

  const sendTouchEnd = useCallback(() => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'touch-end',
      payload: { partner: myRole },
    });
  }, [myRole]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const point = { x: locationX, y: locationY, timestamp: Date.now() };
        setMyTouch(point);
        Animated.timing(myTouchOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start();
        sendTouch(locationX, locationY);

        if (partnerTouch) checkOverlap(point, partnerTouch);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const point = { x: locationX, y: locationY, timestamp: Date.now() };
        setMyTouch(point);
        sendTouch(locationX, locationY);

        if (partnerTouch) checkOverlap(point, partnerTouch);
      },
      onPanResponderRelease: () => {
        Animated.timing(myTouchOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setMyTouch(null));
        sendTouchEnd();
      },
    })
  ).current;

  const removeHeart = useCallback((id: string) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  }, []);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Canvas area */}
      <View
        style={{
          flex: 1,
          backgroundColor: theme.surface,
          margin: 16,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: theme.accent,
          overflow: 'hidden',
        }}
        {...panResponder.panHandlers}
      >
        {/* Instructions */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.5,
          }}
          pointerEvents="none"
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
              textAlign: 'center',
            }}
          >
            Touch the screen{'\n'}and find your partner
          </Text>
        </View>

        {/* My touch indicator */}
        {myTouch && (
          <Animated.View
            style={{
              position: 'absolute',
              left: myTouch.x - 30,
              top: myTouch.y - 30,
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: theme.primary,
              opacity: myTouchOpacity,
            }}
            pointerEvents="none"
          />
        )}

        {/* Partner's touch indicator */}
        {partnerTouch && (
          <Animated.View
            style={{
              position: 'absolute',
              left: partnerTouch.x - 30,
              top: partnerTouch.y - 30,
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#A78BFA',
              opacity: partnerTouchOpacity,
            }}
            pointerEvents="none"
          />
        )}

        {/* Heart blooms at overlap points */}
        {hearts.map((heart) => (
          <HeartBloom
            key={heart.id}
            x={heart.x}
            y={heart.y}
            onComplete={() => removeHeart(heart.id)}
          />
        ))}
      </View>

      {/* Legend */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 24,
          paddingBottom: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: theme.primary,
            }}
          />
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
            }}
          >
            You
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#A78BFA',
            }}
          />
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Inter_400Regular',
              color: theme.textMuted,
            }}
          >
            Partner
          </Text>
        </View>
      </View>
    </View>
  );
};
