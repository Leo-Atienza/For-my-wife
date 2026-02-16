import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Share, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { Copy, Check, Share2, UserCheck, Users, RefreshCw } from 'lucide-react-native';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { supabase } from '@/lib/supabase';

export default function InvitePartnerScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const inviteCode = useAuthStore((state) => state.inviteCode);
  const spaceId = useAuthStore((state) => state.spaceId);
  const myRole = useAuthStore((state) => state.myRole);
  const partner1 = useProfileStore((state) => state.partner1);
  const partner2 = useProfileStore((state) => state.partner2);

  const [copied, setCopied] = useState(false);
  const [partnerCount, setPartnerCount] = useState<number | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const checkPartnerStatus = useCallback(async () => {
    if (!spaceId) return;
    setIsCheckingStatus(true);
    try {
      const { count, error } = await supabase
        .from('space_members')
        .select('*', { count: 'exact', head: true })
        .eq('space_id', spaceId);

      if (!error && count !== null) {
        setPartnerCount(count);
      }
    } catch {
      // Silently fail — we'll show the invite code anyway
    } finally {
      setIsCheckingStatus(false);
    }
  }, [spaceId]);

  useEffect(() => {
    checkPartnerStatus();
  }, [checkPartnerStatus]);

  const isPartnerConnected = partnerCount !== null && partnerCount >= 2;

  const handleCopyCode = async () => {
    if (!inviteCode) return;
    await Clipboard.setStringAsync(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareCode = async () => {
    if (!inviteCode) return;
    try {
      await Share.share({
        message: `Join me on Us! 💖\n\nUse this invite code to connect with me:\n\n${inviteCode}\n\nDownload the app and enter this code to join our private space.`,
      });
    } catch {
      // User cancelled sharing
    }
  };

  const partnerName = myRole === 'partner1'
    ? partner2?.name
    : partner1?.name;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <PageHeader title="Invite Partner" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 40,
          gap: 28,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Connection Status Card */}
        <View
          style={{
            backgroundColor: isPartnerConnected ? theme.primarySoft : theme.surface,
            borderRadius: 24,
            padding: 28,
            alignItems: 'center',
            gap: 16,
            borderWidth: 1.5,
            borderColor: isPartnerConnected ? theme.primary + '40' : theme.accent,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          {isPartnerConnected ? (
            <>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: theme.primary + '15',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <UserCheck size={36} color={theme.primary} />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'PlayfairDisplay_700Bold',
                  color: theme.primary,
                  textAlign: 'center',
                }}
              >
                {'💖'} Connected!
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Inter_400Regular',
                  color: theme.textMuted,
                  textAlign: 'center',
                  lineHeight: 22,
                }}
              >
                {partnerName
                  ? `You and ${partnerName} are connected in your private space.`
                  : 'You and your partner are connected in your private space.'}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: theme.success + '15',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 9999,
                }}
              >
                <Users size={16} color={theme.success} />
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Inter_600SemiBold',
                    color: theme.success,
                  }}
                >
                  2 of 2 partners joined
                </Text>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: theme.primarySoft,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 40 }}>{'💌'}</Text>
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'PlayfairDisplay_700Bold',
                  color: theme.textPrimary,
                  textAlign: 'center',
                }}
              >
                Waiting for your partner
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Inter_400Regular',
                  color: theme.textMuted,
                  textAlign: 'center',
                  lineHeight: 22,
                }}
              >
                Share the invite code below so your partner can join your private space.
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: theme.accent + '30',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 9999,
                }}
              >
                <Users size={16} color={theme.textMuted} />
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Inter_600SemiBold',
                    color: theme.textMuted,
                  }}
                >
                  1 of 2 partners joined
                </Text>
              </View>
            </>
          )}

          {/* Refresh button */}
          <Pressable
            onPress={checkPartnerStatus}
            disabled={isCheckingStatus}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
            accessibilityRole="button"
            accessibilityLabel="Refresh connection status"
          >
            {isCheckingStatus ? (
              <ActivityIndicator size="small" color={theme.textMuted} />
            ) : (
              <RefreshCw size={14} color={theme.textMuted} />
            )}
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Inter_400Regular',
                color: theme.textMuted,
              }}
            >
              {isCheckingStatus ? 'Checking...' : 'Refresh status'}
            </Text>
          </Pressable>
        </View>

        {/* Invite Code Section */}
        {inviteCode ? (
          <View style={{ gap: 16 }}>
            <Text
              style={{
                fontSize: 17,
                fontFamily: 'PlayfairDisplay_700Bold',
                color: theme.textPrimary,
                textAlign: 'center',
              }}
            >
              {'🔑'} Your Invite Code
            </Text>

            {/* Code display */}
            <View
              style={{
                backgroundColor: theme.primarySoft,
                borderRadius: 20,
                paddingHorizontal: 28,
                paddingVertical: 24,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: theme.accent,
                borderStyle: 'dashed',
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  fontFamily: 'Inter_600SemiBold',
                  color: theme.primary,
                  letterSpacing: 10,
                }}
              >
                {inviteCode}
              </Text>
            </View>

            {/* Action buttons */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={handleCopyCode}
                style={({ pressed }) => ({
                  flex: 1,
                  opacity: pressed ? 0.85 : 1,
                })}
                accessibilityRole="button"
                accessibilityLabel="Copy invite code"
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    paddingVertical: 14,
                    borderRadius: 16,
                    backgroundColor: copied ? theme.success + '15' : theme.surface,
                    borderWidth: 1.5,
                    borderColor: copied ? theme.success : theme.accent,
                  }}
                >
                  {copied ? (
                    <Check size={18} color={theme.success} />
                  ) : (
                    <Copy size={18} color={theme.primary} />
                  )}
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Inter_600SemiBold',
                      color: copied ? theme.success : theme.primary,
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleShareCode}
                style={({ pressed }) => ({
                  flex: 1,
                  opacity: pressed ? 0.85 : 1,
                })}
                accessibilityRole="button"
                accessibilityLabel="Share invite code"
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    paddingVertical: 14,
                    borderRadius: 16,
                    backgroundColor: theme.primary,
                  }}
                >
                  <Share2 size={18} color="#FFFFFF" />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Inter_600SemiBold',
                      color: '#FFFFFF',
                    }}
                  >
                    Share
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: theme.surface,
              borderRadius: 20,
              padding: 24,
              alignItems: 'center',
              gap: 12,
              borderWidth: 1,
              borderColor: theme.accent,
            }}
          >
            <Text style={{ fontSize: 32 }}>{'🤔'}</Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Inter_500Medium',
                color: theme.textPrimary,
                textAlign: 'center',
              }}
            >
              No invite code available
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Inter_400Regular',
                color: theme.textMuted,
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              The invite code is generated when you create a space. If you joined via an invite code, ask your partner for theirs.
            </Text>
          </View>
        )}

        {/* How it works */}
        <View
          style={{
            backgroundColor: theme.surface,
            borderRadius: 20,
            padding: 24,
            gap: 16,
            borderWidth: 1,
            borderColor: theme.accent,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Inter_600SemiBold',
              color: theme.textPrimary,
            }}
          >
            {'💡'} How it works
          </Text>
          {[
            { step: '1', text: 'Share the invite code with your partner' },
            { step: '2', text: 'They download the app and create an account' },
            { step: '3', text: 'They tap "Join Partner\'s Space" and enter the code' },
            { step: '4', text: 'You\'re connected! Everything syncs automatically' },
          ].map((item) => (
            <View
              key={item.step}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: theme.primarySoft,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Inter_600SemiBold',
                    color: theme.primary,
                  }}
                >
                  {item.step}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Inter_400Regular',
                  color: theme.textMuted,
                  lineHeight: 20,
                  flex: 1,
                  paddingTop: 3,
                }}
              >
                {item.text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
