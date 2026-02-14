import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Play,
  Pause,
  Plus,
  Film,
  UtensilsCrossed,
  Sparkles,
  Clock,
  Trash2,
  X,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useWatchPartyStore } from '@/stores/useWatchPartyStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { WatchPartySession } from '@/lib/types';

const TYPE_CONFIG = {
  movie: { icon: Film, label: 'Movie Night', emoji: '\u{1F3AC}' },
  dinner: { icon: UtensilsCrossed, label: 'Dinner Date', emoji: '\u{1F37D}\ufe0f' },
  activity: { icon: Sparkles, label: 'Activity', emoji: '\u2728' },
};

const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ActiveTimer = ({ session }: { session: WatchPartySession }) => {
  const theme = useTheme();
  const [elapsed, setElapsed] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const stopSession = useWatchPartyStore((state) => state.stopSession);

  useEffect(() => {
    if (!session.startedAt) return;
    const startTime = new Date(session.startedAt).getTime();

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [session.startedAt]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const config = TYPE_CONFIG[session.type];
  const isCountdown = session.duration && session.duration > 0;
  const remaining = isCountdown ? Math.max(0, session.duration - elapsed) : elapsed;
  const isFinished = isCountdown && remaining === 0;

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <View
        style={{
          backgroundColor: theme.primary,
          borderRadius: 24,
          padding: 32,
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Text style={{ fontSize: 48 }}>{config.emoji}</Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'DancingScript_400Regular',
            color: '#fff',
          }}
        >
          {session.title}
        </Text>
        <Text
          style={{
            fontSize: 56,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: '#fff',
          }}
        >
          {isFinished ? 'Done!' : formatTime(remaining)}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter_400Regular',
            color: '#ffffff99',
          }}
        >
          {isCountdown
            ? isFinished
              ? 'Time\u2019s up!'
              : 'Time remaining'
            : 'Elapsed time'}
        </Text>
        <Pressable
          onPress={() => stopSession(session.id)}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#ffffff30',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 30,
            }}
          >
            <Pause size={18} color="#fff" />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter_600SemiBold',
                color: '#fff',
              }}
            >
              End Session
            </Text>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const SessionCard = ({ session }: { session: WatchPartySession }) => {
  const theme = useTheme();
  const { startSession, removeSession } = useWatchPartyStore.getState();
  const config = TYPE_CONFIG[session.type];
  const Icon = config.icon;

  return (
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
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
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
          <Icon size={22} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: theme.textPrimary }}>
            {session.title}
          </Text>
          <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
            {config.label}
            {session.duration ? ` \u2022 ${formatTime(session.duration)} timer` : ' \u2022 Stopwatch'}
          </Text>
        </View>
        <Pressable
          onPress={() => removeSession(session.id)}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Trash2 size={18} color={theme.textMuted} />
        </Pressable>
      </View>
      <Button
        title="Start"
        onPress={() => startSession(session.id)}
      />
    </View>
  );
};

export default function WatchPartyScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const sessions = useWatchPartyStore((state) => state.sessions);
  const createSession = useWatchPartyStore((state) => state.createSession);
  const getActiveSession = useWatchPartyStore((state) => state.getActiveSession);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<'movie' | 'dinner' | 'activity'>('movie');
  const [timerMinutes, setTimerMinutes] = useState('');

  const activeSession = getActiveSession();
  const inactiveSessions = sessions.filter((s) => !s.isActive);

  const handleCreate = () => {
    if (!title.trim()) return;
    const duration = timerMinutes ? parseInt(timerMinutes, 10) * 60 : undefined;
    createSession(title.trim(), selectedType, 'partner1', duration);
    setTitle('');
    setTimerMinutes('');
    setShowForm(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Watch Party" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 90,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Active session */}
        {activeSession && <ActiveTimer session={activeSession} />}

        {/* Create form */}
        {showForm && !activeSession ? (
          <View
            style={{
              backgroundColor: theme.surface,
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: theme.accent,
              gap: 16,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay_700Bold', color: theme.textPrimary }}>
                New Session
              </Text>
              <Pressable onPress={() => setShowForm(false)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                <X size={20} color={theme.textMuted} />
              </Pressable>
            </View>

            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="What are you doing? (e.g., Movie night!)"
            />

            {/* Type selector */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(Object.keys(TYPE_CONFIG) as Array<'movie' | 'dinner' | 'activity'>).map((type) => {
                const config = TYPE_CONFIG[type];
                const isSelected = type === selectedType;
                return (
                  <Pressable
                    key={type}
                    onPress={() => setSelectedType(type)}
                    style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.8 : 1 })}
                  >
                    <View
                      style={{
                        backgroundColor: isSelected ? theme.primary : theme.primarySoft,
                        borderRadius: 14,
                        padding: 12,
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Text style={{ fontSize: 24 }}>{config.emoji}</Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontFamily: 'Inter_500Medium',
                          color: isSelected ? '#fff' : theme.textMuted,
                        }}
                      >
                        {config.label}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Timer */}
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.textMuted }}>
                Timer (optional — leave blank for stopwatch mode)
              </Text>
              <Input
                value={timerMinutes}
                onChangeText={setTimerMinutes}
                placeholder="Minutes (e.g., 120 for a 2h movie)"
                keyboardType="numeric"
              />
            </View>

            <Button title="Create Session" onPress={handleCreate} />
          </View>
        ) : null}

        {/* Create button */}
        {!showForm && !activeSession && (
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
              <Plus size={20} color={theme.primary} />
              <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: theme.primary }}>
                Start a Watch Party
              </Text>
            </View>
          </Pressable>
        )}

        {/* Saved sessions */}
        {inactiveSessions.length > 0 && (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: theme.textPrimary, marginLeft: 4 }}>
              Saved Sessions
            </Text>
            {inactiveSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </View>
        )}

        {/* Empty state */}
        {sessions.length === 0 && !showForm && (
          <EmptyState
            emoji={'\u{1F3AC}'}
            title="No watch parties yet"
            subtitle="Start a shared timer for movie nights, dinner dates, or activities"
          />
        )}
      </ScrollView>
    </View>
  );
}
