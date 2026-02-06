import { View, Text, ScrollView, Pressable, Linking, FlatList } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Music, ExternalLink, Plus } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSongStore } from '@/stores/useSongStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime } from '@/lib/dates';
import type { PartnerRole } from '@/lib/types';

export default function SongsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const songs = useSongStore((state) => state.songs);
  const addSong = useSongStore((state) => state.addSong);
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);

  const [showForm, setShowForm] = useState(false);
  const [dedicatedBy, setDedicatedBy] = useState<PartnerRole>('partner1');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !artist.trim()) return;
    addSong(
      dedicatedBy,
      title.trim(),
      artist.trim(),
      url.trim() || undefined,
      message.trim() || undefined
    );
    setTitle('');
    setArtist('');
    setUrl('');
    setMessage('');
    setShowForm(false);
  };

  const handleOpenUrl = (songUrl: string) => {
    Linking.openURL(songUrl).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader
        title="Song Dedications"
        showBack
        rightElement={
          <Pressable
            onPress={() => setShowForm(!showForm)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Dedicate a song"
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: theme.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Plus size={20} color="#FFFFFF" />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Latest song highlight */}
        {songs.length > 0 && !showForm && (
          <Card style={{ borderColor: theme.primary, borderWidth: 2 }}>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 12, fontFamily: 'Inter_500Medium', color: theme.primary }}>
                NOW PLAYING
              </Text>
              <Music size={28} color={theme.primary} />
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'PlayfairDisplay_700Bold',
                  color: theme.textPrimary,
                  textAlign: 'center',
                }}
              >
                {songs[0].title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Inter_400Regular',
                  color: theme.textMuted,
                }}
              >
                by {songs[0].artist}
              </Text>
              {songs[0].message && (
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'DancingScript_400Regular',
                    color: theme.primary,
                    textAlign: 'center',
                    marginTop: 4,
                  }}
                >
                  "{songs[0].message}"
                </Text>
              )}
              <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: theme.textMuted }}>
                Dedicated by{' '}
                {songs[0].dedicatedBy === 'partner1'
                  ? partner1?.name ?? 'Partner 1'
                  : partner2?.name ?? 'Partner 2'}
              </Text>
              {songs[0].url && (
                <Pressable
                  onPress={() => handleOpenUrl(songs[0].url!)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 4,
                  }}
                >
                  <ExternalLink size={14} color={theme.primary} />
                  <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: theme.primary }}>
                    Listen
                  </Text>
                </Pressable>
              )}
            </View>
          </Card>
        )}

        {/* Dedicate form */}
        {showForm && (
          <Card>
            <View style={{ gap: 14 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'PlayfairDisplay_700Bold',
                  color: theme.textPrimary,
                }}
              >
                Dedicate a Song
              </Text>

              {/* Who is dedicating */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable
                  onPress={() => setDedicatedBy('partner1')}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor:
                      dedicatedBy === 'partner1' ? theme.primary : theme.primarySoft,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Inter_600SemiBold',
                      color: dedicatedBy === 'partner1' ? '#FFFFFF' : theme.textPrimary,
                    }}
                  >
                    {partner1?.name ?? 'Me'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setDedicatedBy('partner2')}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor:
                      dedicatedBy === 'partner2' ? theme.primary : theme.primarySoft,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Inter_600SemiBold',
                      color: dedicatedBy === 'partner2' ? '#FFFFFF' : theme.textPrimary,
                    }}
                  >
                    {partner2?.name ?? 'Partner'}
                  </Text>
                </Pressable>
              </View>

              <Input
                label="Song Title"
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Perfect"
                maxLength={100}
              />
              <Input
                label="Artist"
                value={artist}
                onChangeText={setArtist}
                placeholder="e.g., Ed Sheeran"
                maxLength={100}
              />
              <Input
                label="Link (optional)"
                value={url}
                onChangeText={setUrl}
                placeholder="Spotify or YouTube URL"
                maxLength={300}
              />
              <Input
                label="Message (optional)"
                value={message}
                onChangeText={setMessage}
                placeholder="This song reminds me of..."
                multiline
                numberOfLines={2}
                maxLength={200}
              />
              <Button
                title="Dedicate Song"
                onPress={handleSubmit}
                disabled={!title.trim() || !artist.trim()}
              />
            </View>
          </Card>
        )}

        {/* Song history */}
        {songs.length > 0 && (
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'PlayfairDisplay_700Bold',
                color: theme.textPrimary,
              }}
            >
              Our Playlist ({songs.length} songs)
            </Text>
            {songs.map((song) => {
              const authorName =
                song.dedicatedBy === 'partner1'
                  ? partner1?.name ?? 'Partner 1'
                  : partner2?.name ?? 'Partner 2';
              return (
                <Pressable
                  key={song.id}
                  onPress={song.url ? () => handleOpenUrl(song.url!) : undefined}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    backgroundColor: theme.surface,
                    borderRadius: 12,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: theme.accent,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: theme.primarySoft,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Music size={18} color={theme.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: 'Inter_600SemiBold',
                        color: theme.textPrimary,
                      }}
                      numberOfLines={1}
                    >
                      {song.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: 'Inter_400Regular',
                        color: theme.textMuted,
                      }}
                    >
                      {song.artist} {'\u2022'} by {authorName}
                    </Text>
                    {song.message && (
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'Inter_400Regular',
                          color: theme.textMuted,
                          fontStyle: 'italic',
                          marginTop: 2,
                        }}
                        numberOfLines={1}
                      >
                        "{song.message}"
                      </Text>
                    )}
                  </View>
                  {song.url && <ExternalLink size={16} color={theme.textMuted} />}
                </Pressable>
              );
            })}
          </View>
        )}

        {songs.length === 0 && !showForm && (
          <EmptyState
            emoji={'\ud83c\udfb5'}
            title="Build your soundtrack"
            subtitle="Dedicate songs to each other and build a shared playlist over time."
            actionLabel="Dedicate a Song"
            onAction={() => setShowForm(true)}
          />
        )}
      </ScrollView>
    </View>
  );
}
