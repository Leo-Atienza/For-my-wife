import { View, Text } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocationStore } from '@/stores/useLocationStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { calculateDistanceKm, formatDistance } from '@/lib/distance';

export default function DistanceScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Distance" showBack />
      <View style={{ paddingHorizontal: 24, gap: 20, paddingBottom: insets.bottom + 20 }}>
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

        {/* Manual location inputs */}
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
      </View>
    </View>
  );
}
