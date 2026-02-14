import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Settings, Heart } from 'lucide-react-native';
import { useLocationStore } from '@/stores/useLocationStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/useTheme';
import { openLocationSettings, type LocationPermissionStatus } from '@/hooks/useLocationTracking';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { calculateDistanceKm, formatDistance } from '@/lib/distance';

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface LocationData {
  latitude: number;
  longitude: number;
  cityName?: string;
  updatedAt: string;
}

const MAP_WIDTH = 280;
const MAP_HEIGHT = 180;
const DOT_SIZE = 16;
const PULSE_SIZE = 40;

const VisualMap = ({
  loc1,
  loc2,
  partner1Name,
  partner2Name,
}: {
  loc1: LocationData;
  loc2: LocationData;
  partner1Name: string;
  partner2Name: string;
}) => {
  const theme = useTheme();
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim1 = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse1, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulse1, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    const anim2 = Animated.loop(
      Animated.sequence([
        Animated.delay(750),
        Animated.timing(pulse2, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulse2, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    anim1.start();
    anim2.start();
    return () => {
      anim1.stop();
      anim2.stop();
    };
  }, [pulse1, pulse2]);

  // Normalize lat/lng to positions within the map canvas
  const minLat = Math.min(loc1.latitude, loc2.latitude);
  const maxLat = Math.max(loc1.latitude, loc2.latitude);
  const minLng = Math.min(loc1.longitude, loc2.longitude);
  const maxLng = Math.max(loc1.longitude, loc2.longitude);

  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;

  // Add padding so dots aren't at edges
  const pad = 40;
  const usableW = MAP_WIDTH - pad * 2;
  const usableH = MAP_HEIGHT - pad * 2;

  const x1 = pad + ((loc1.longitude - minLng) / lngRange) * usableW;
  const y1 = pad + ((maxLat - loc1.latitude) / latRange) * usableH; // Flip Y since lat goes up
  const x2 = pad + ((loc2.longitude - minLng) / lngRange) * usableW;
  const y2 = pad + ((maxLat - loc2.latitude) / latRange) * usableH;

  // Calculate line between dots
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <Card>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'DancingScript_400Regular',
            color: theme.textMuted,
          }}
        >
          Your map
        </Text>
        <View
          style={{
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
            backgroundColor: theme.primarySoft,
            borderRadius: 16,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Dashed line between dots */}
          <View
            style={{
              position: 'absolute',
              left: Math.min(x1, x2),
              top: Math.min(y1, y2),
              width: Math.abs(x2 - x1) || 1,
              height: Math.abs(y2 - y1) || 1,
              borderWidth: 1,
              borderColor: theme.accent,
              borderStyle: 'dashed',
            }}
          />

          {/* Heart at midpoint */}
          <View
            style={{
              position: 'absolute',
              left: midX - 10,
              top: midY - 10,
            }}
          >
            <Heart size={20} color={theme.primary + '60'} fill={theme.primary + '30'} />
          </View>

          {/* Partner 1 pulse */}
          <Animated.View
            style={{
              position: 'absolute',
              left: x1 - PULSE_SIZE / 2,
              top: y1 - PULSE_SIZE / 2,
              width: PULSE_SIZE,
              height: PULSE_SIZE,
              borderRadius: PULSE_SIZE / 2,
              backgroundColor: theme.primary + '30',
              opacity: pulse1.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 0],
              }),
              transform: [
                {
                  scale: pulse1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.5],
                  }),
                },
              ],
            }}
          />

          {/* Partner 1 dot */}
          <View
            style={{
              position: 'absolute',
              left: x1 - DOT_SIZE / 2,
              top: y1 - DOT_SIZE / 2,
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: DOT_SIZE / 2,
              backgroundColor: theme.primary,
              borderWidth: 3,
              borderColor: '#fff',
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          />

          {/* Partner 1 label */}
          <Text
            style={{
              position: 'absolute',
              left: x1 - 30,
              top: y1 + DOT_SIZE / 2 + 4,
              width: 60,
              textAlign: 'center',
              fontSize: 10,
              fontFamily: 'Inter_600SemiBold',
              color: theme.textPrimary,
            }}
            numberOfLines={1}
          >
            {loc1.cityName ?? partner1Name}
          </Text>

          {/* Partner 2 pulse */}
          <Animated.View
            style={{
              position: 'absolute',
              left: x2 - PULSE_SIZE / 2,
              top: y2 - PULSE_SIZE / 2,
              width: PULSE_SIZE,
              height: PULSE_SIZE,
              borderRadius: PULSE_SIZE / 2,
              backgroundColor: theme.accent + '50',
              opacity: pulse2.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 0],
              }),
              transform: [
                {
                  scale: pulse2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.5],
                  }),
                },
              ],
            }}
          />

          {/* Partner 2 dot */}
          <View
            style={{
              position: 'absolute',
              left: x2 - DOT_SIZE / 2,
              top: y2 - DOT_SIZE / 2,
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: DOT_SIZE / 2,
              backgroundColor: theme.accent,
              borderWidth: 3,
              borderColor: '#fff',
              shadowColor: theme.accent,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          />

          {/* Partner 2 label */}
          <Text
            style={{
              position: 'absolute',
              left: x2 - 30,
              top: y2 + DOT_SIZE / 2 + 4,
              width: 60,
              textAlign: 'center',
              fontSize: 10,
              fontFamily: 'Inter_600SemiBold',
              color: theme.textPrimary,
            }}
            numberOfLines={1}
          >
            {loc2.cityName ?? partner2Name}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default function DistanceScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const myRole = useAuthStore((state) => state.myRole);
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);
  const locations = useLocationStore((state) => state.locations);
  const setLocation = useLocationStore((state) => state.setLocation);

  const [city1, setCity1] = useState(locations.partner1?.cityName ?? '');
  const [lat1, setLat1] = useState(locations.partner1?.latitude.toString() ?? '');
  const [lng1, setLng1] = useState(locations.partner1?.longitude.toString() ?? '');
  const [city2, setCity2] = useState(locations.partner2?.cityName ?? '');
  const [lat2, setLat2] = useState(locations.partner2?.latitude.toString() ?? '');
  const [lng2, setLng2] = useState(locations.partner2?.longitude.toString() ?? '');

  const handleSave = () => {
    const parsedLat1 = parseFloat(lat1);
    const parsedLng1 = parseFloat(lng1);
    const parsedLat2 = parseFloat(lat2);
    const parsedLng2 = parseFloat(lng2);

    if (!isNaN(parsedLat1) && !isNaN(parsedLng1)) {
      setLocation('partner1', parsedLat1, parsedLng1, city1 || undefined);
    }
    if (!isNaN(parsedLat2) && !isNaN(parsedLng2)) {
      setLocation('partner2', parsedLat2, parsedLng2, city2 || undefined);
    }
  };

  const loc1 = locations.partner1;
  const loc2 = locations.partner2;
  const hasDistance = loc1 && loc2;
  const distanceKm = hasDistance
    ? calculateDistanceKm(loc1.latitude, loc1.longitude, loc2.latitude, loc2.longitude)
    : null;

  const myLoc = myRole === 'partner1' ? loc1 : loc2;
  const isGpsActive = !!myLoc;

  // Determine the most recent location update timestamp
  const lastUpdated = (() => {
    const timestamps = [loc1?.updatedAt, loc2?.updatedAt].filter(Boolean) as string[];
    if (timestamps.length === 0) return null;
    return timestamps.sort().pop()!;
  })();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Distance" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          gap: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* GPS Status */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: isGpsActive ? theme.primarySoft : theme.surface,
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: theme.accent,
          }}
        >
          <MapPin size={18} color={isGpsActive ? theme.primary : theme.textMuted} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Inter_500Medium',
                color: isGpsActive ? theme.primary : theme.textMuted,
              }}
            >
              {isGpsActive
                ? `GPS active \u2022 ${myLoc.cityName ?? 'Tracking...'}`
                : 'GPS permission needed for live tracking'}
            </Text>
            {lastUpdated && (
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'Inter_400Regular',
                  color: theme.textMuted,
                  marginTop: 2,
                }}
              >
                Updated {formatTimeAgo(lastUpdated)}
              </Text>
            )}
          </View>
          {!isGpsActive && (
            <Pressable
              onPress={openLocationSettings}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: theme.primary,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Settings size={14} color="#fff" />
              <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#fff' }}>
                Enable GPS
              </Text>
            </Pressable>
          )}
        </View>

        {/* Distance display */}
        {distanceKm !== null && loc1 && loc2 && (
          <Card>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 14, fontFamily: 'DancingScript_400Regular', color: theme.textMuted }}>
                The distance between you
              </Text>
              <Text style={{ fontSize: 32, fontFamily: 'PlayfairDisplay_700Bold', color: theme.primary }}>
                {formatDistance(distanceKm)}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.primary }} />
                <View style={{ flex: 1, height: 2, backgroundColor: theme.accent, borderStyle: 'dashed' }} />
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.primary }} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                  {loc1.cityName ?? partner1?.name ?? 'You'}
                </Text>
                <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                  {loc2.cityName ?? partner2?.name ?? 'Partner'}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Visual Map */}
        {hasDistance && loc1 && loc2 && <VisualMap loc1={loc1} loc2={loc2} partner1Name={partner1?.name ?? 'You'} partner2Name={partner2?.name ?? 'Partner'} />}

        {/* Manual location inputs (fallback) */}
        <Text style={{ fontSize: 16, fontFamily: 'DancingScript_400Regular', color: theme.primary, marginTop: 8 }}>
          Where are you both?
        </Text>

        <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: theme.textPrimary }}>
          {partner1?.name ?? 'Your'} Location
        </Text>
        <Input value={city1} onChangeText={setCity1} placeholder="City name" label="City" />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input value={lat1} onChangeText={setLat1} placeholder="Latitude" label="Lat" keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <Input value={lng1} onChangeText={setLng1} placeholder="Longitude" label="Lng" keyboardType="numeric" />
          </View>
        </View>

        <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: theme.textPrimary }}>
          {partner2?.name ?? 'Partner'} Location
        </Text>
        <Input value={city2} onChangeText={setCity2} placeholder="City name" label="City" />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input value={lat2} onChangeText={setLat2} placeholder="Latitude" label="Lat" keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <Input value={lng2} onChangeText={setLng2} placeholder="Longitude" label="Lng" keyboardType="numeric" />
          </View>
        </View>

        <Button title="Update Distance" onPress={handleSave} />
      </ScrollView>
    </View>
  );
}
