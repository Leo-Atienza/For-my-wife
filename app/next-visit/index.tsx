import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Animated,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Plane,
  Plus,
  MapPin,
  Calendar,
  CheckCircle2,
  Circle,
  Package,
  Trash2,
  ChevronDown,
  ChevronUp,
  Camera,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useNextVisitStore } from '@/stores/useNextVisitStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatRelativeDate } from '@/lib/dates';
import type { NextVisit, PartnerRole } from '@/lib/types';

const VisitCard = ({ visit }: { visit: NextVisit }) => {
  const theme = useTheme();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [newPackingItem, setNewPackingItem] = useState('');
  const expandAnim = useRef(new Animated.Value(0)).current;

  const {
    toggleActivity,
    removeActivity,
    addActivity,
    addPackingItem,
    togglePackingItem,
    removePackingItem,
    removeVisit,
  } = useNextVisitStore.getState();

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [expanded, expandAnim]);

  const daysUntil = Math.ceil(
    (new Date(visit.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isPast = daysUntil < 0;

  const completedActivities = visit.activities.filter((a) => a.isCompleted).length;
  const packedItems = visit.packingItems.filter((p) => p.isPacked).length;

  const handleAddActivity = () => {
    if (!newActivity.trim()) return;
    addActivity(visit.id, newActivity.trim());
    setNewActivity('');
  };

  const handleAddPackingItem = () => {
    if (!newPackingItem.trim()) return;
    addPackingItem(visit.id, newPackingItem.trim(), 'partner1' as PartnerRole);
    setNewPackingItem('');
  };

  const handleDelete = () => {
    Alert.alert('Delete Visit', `Remove "${visit.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeVisit(visit.id),
      },
    ]);
  };

  return (
    <View
      style={{
        backgroundColor: theme.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.accent,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      {/* Header */}
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'PlayfairDisplay_700Bold',
                  color: theme.textPrimary,
                }}
              >
                {visit.title}
              </Text>
              {visit.location ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                  <MapPin size={14} color={theme.textMuted} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Inter_400Regular',
                      color: theme.textMuted,
                    }}
                  >
                    {visit.location}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={{ alignItems: 'center' }}>
              {isPast ? (
                <View
                  style={{
                    backgroundColor: theme.success + '20',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: theme.success }}>
                    Visited
                  </Text>
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 28,
                      fontFamily: 'PlayfairDisplay_700Bold',
                      color: theme.primary,
                    }}
                  >
                    {daysUntil}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'Inter_500Medium',
                      color: theme.textMuted,
                    }}
                  >
                    {daysUntil === 1 ? 'day' : 'days'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Stats row */}
          <View style={{ flexDirection: 'row', marginTop: 12, gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Calendar size={14} color={theme.textMuted} />
              <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                {formatRelativeDate(visit.startDate)}
                {visit.endDate ? ` - ${formatRelativeDate(visit.endDate)}` : ''}
              </Text>
            </View>
          </View>

          {/* Progress bars */}
          {(visit.activities.length > 0 || visit.packingItems.length > 0) && (
            <View style={{ flexDirection: 'row', marginTop: 12, gap: 16 }}>
              {visit.activities.length > 0 && (
                <Text style={{ fontSize: 12, fontFamily: 'Inter_500Medium', color: theme.textMuted }}>
                  {completedActivities}/{visit.activities.length} activities
                </Text>
              )}
              {visit.packingItems.length > 0 && (
                <Text style={{ fontSize: 12, fontFamily: 'Inter_500Medium', color: theme.textMuted }}>
                  {packedItems}/{visit.packingItems.length} packed
                </Text>
              )}
            </View>
          )}

          <View style={{ position: 'absolute', right: 20, bottom: 20 }}>
            {expanded ? (
              <ChevronUp size={18} color={theme.textMuted} />
            ) : (
              <ChevronDown size={18} color={theme.textMuted} />
            )}
          </View>
        </View>
      </Pressable>

      {/* Expanded content */}
      {expanded && (
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          {/* Notes */}
          {visit.notes ? (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontFamily: 'Inter_400Regular', color: theme.textMuted, fontStyle: 'italic' }}>
                {visit.notes}
              </Text>
            </View>
          ) : null}

          {/* Activities */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Inter_600SemiBold',
                color: theme.textPrimary,
                marginBottom: 8,
              }}
            >
              Activities & Plans
            </Text>

            {visit.activities.map((activity) => (
              <Pressable
                key={activity.id}
                onPress={() => toggleActivity(visit.id, activity.id)}
                onLongPress={() => {
                  Alert.alert('Remove Activity', `Remove "${activity.title}"?`, [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Remove',
                      style: 'destructive',
                      onPress: () => removeActivity(visit.id, activity.id),
                    },
                  ]);
                }}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 }}>
                  {activity.isCompleted ? (
                    <CheckCircle2 size={20} color={theme.success} />
                  ) : (
                    <Circle size={20} color={theme.accent} />
                  )}
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontFamily: 'Inter_400Regular',
                      color: activity.isCompleted ? theme.textMuted : theme.textPrimary,
                      textDecorationLine: activity.isCompleted ? 'line-through' : 'none',
                    }}
                  >
                    {activity.title}
                  </Text>
                </View>
              </Pressable>
            ))}

            {/* Add activity input */}
            <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Input
                  value={newActivity}
                  onChangeText={setNewActivity}
                  placeholder="Add an activity..."
                  onSubmitEditing={handleAddActivity}
                  returnKeyType="done"
                />
              </View>
              <Pressable
                onPress={handleAddActivity}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: theme.primarySoft,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Plus size={20} color={theme.primary} />
                </View>
              </Pressable>
            </View>
          </View>

          {/* Packing list */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Inter_600SemiBold',
                color: theme.textPrimary,
                marginBottom: 8,
              }}
            >
              Packing List
            </Text>

            {visit.packingItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => togglePackingItem(visit.id, item.id)}
                onLongPress={() => {
                  Alert.alert('Remove Item', `Remove "${item.item}"?`, [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Remove',
                      style: 'destructive',
                      onPress: () => removePackingItem(visit.id, item.id),
                    },
                  ]);
                }}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 }}>
                  {item.isPacked ? (
                    <Package size={20} color={theme.success} />
                  ) : (
                    <Circle size={20} color={theme.accent} />
                  )}
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontFamily: 'Inter_400Regular',
                      color: item.isPacked ? theme.textMuted : theme.textPrimary,
                      textDecorationLine: item.isPacked ? 'line-through' : 'none',
                    }}
                  >
                    {item.item}
                  </Text>
                </View>
              </Pressable>
            ))}

            {/* Add packing item input */}
            <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Input
                  value={newPackingItem}
                  onChangeText={setNewPackingItem}
                  placeholder="Add packing item..."
                  onSubmitEditing={handleAddPackingItem}
                  returnKeyType="done"
                />
              </View>
              <Pressable
                onPress={handleAddPackingItem}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: theme.primarySoft,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Plus size={20} color={theme.primary} />
                </View>
              </Pressable>
            </View>
          </View>

          {/* Post-visit photo prompt for past visits */}
          {isPast && (
            <Pressable
              onPress={() => router.push('/memories/new')}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: theme.primarySoft,
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: theme.accent,
                  borderStyle: 'dashed',
                }}
              >
                <Camera size={20} color={theme.primary} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Inter_600SemiBold',
                      color: theme.primary,
                    }}
                  >
                    Add photos from this visit
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'Inter_400Regular',
                      color: theme.textMuted,
                      marginTop: 2,
                    }}
                  >
                    Save your favorite moments to the Memory Wall
                  </Text>
                </View>
              </View>
            </Pressable>
          )}

          {/* Delete button */}
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                paddingVertical: 10,
              }}
            >
              <Trash2 size={16} color={theme.danger} />
              <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: theme.danger }}>
                Delete Visit
              </Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default function NextVisitScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const visits = useNextVisitStore((state) => state.visits);
  const addVisit = useNextVisitStore((state) => state.addVisit);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');

  // Sort: upcoming first (by startDate), then past visits
  const sortedVisits = [...visits].sort((a, b) => {
    const aDate = new Date(a.startDate).getTime();
    const bDate = new Date(b.startDate).getTime();
    const now = Date.now();
    const aIsPast = aDate < now;
    const bIsPast = bDate < now;
    if (aIsPast !== bIsPast) return aIsPast ? 1 : -1;
    return aDate - bDate;
  });

  const handleAdd = () => {
    if (!title.trim() || !startDate.trim()) return;
    addVisit(
      title.trim(),
      startDate.trim(),
      endDate.trim() || undefined,
      location.trim() || undefined
    );
    setTitle('');
    setStartDate('');
    setEndDate('');
    setLocation('');
    setShowForm(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Next Visit" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 90,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Add new visit form */}
        {showForm ? (
          <View
            style={{
              backgroundColor: theme.surface,
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: theme.accent,
              gap: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'PlayfairDisplay_700Bold',
                color: theme.textPrimary,
              }}
            >
              Plan a Visit
            </Text>
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="Visit title (e.g., Spring Trip)"
            />
            <Input
              value={startDate}
              onChangeText={setStartDate}
              placeholder="Start date (YYYY-MM-DD)"
            />
            <Input
              value={endDate}
              onChangeText={setEndDate}
              placeholder="End date (optional, YYYY-MM-DD)"
            />
            <Input
              value={location}
              onChangeText={setLocation}
              placeholder="Location (optional)"
            />
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
              <View style={{ flex: 1 }}>
                <Button title="Cancel" variant="secondary" onPress={() => setShowForm(false)} />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Create" onPress={handleAdd} />
              </View>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => setShowForm(true)}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <View
              style={{
                backgroundColor: theme.primarySoft,
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: theme.accent,
                borderStyle: 'dashed',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Plane size={20} color={theme.primary} />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Inter_600SemiBold',
                  color: theme.primary,
                }}
              >
                Plan a New Visit
              </Text>
            </View>
          </Pressable>
        )}

        {/* Visit list */}
        {sortedVisits.length === 0 && !showForm ? (
          <EmptyState
            emoji={'\u2708\ufe0f'}
            title="No visits planned yet"
            subtitle="Plan your next time together"
          />
        ) : (
          sortedVisits.map((visit) => (
            <VisitCard key={visit.id} visit={visit} />
          ))
        )}
      </ScrollView>
    </View>
  );
}
