import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useTheme } from '@/hooks/useTheme';
import { SEMANTIC_COLORS } from '@/lib/constants';

const PENDING_OPS_KEY = 'sync-pending-operations';

export function SyncStatusIndicator() {
  const theme = useTheme();
  const isConnected = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const checkPending = async () => {
      const raw = await AsyncStorage.getItem(PENDING_OPS_KEY);
      const ops = raw ? JSON.parse(raw) : [];
      setPendingCount(ops.length);
    };

    checkPending();
    const interval = setInterval(checkPending, 5000);
    return () => clearInterval(interval);
  }, []);

  // Don't show anything if all is well
  if (isConnected && pendingCount === 0) {
    return null;
  }

  // When online but syncing — show subtle inline text
  if (isConnected && pendingCount > 0) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.primary }} />
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'Inter_400Regular',
            color: theme.textMuted,
          }}
        >
          Syncing {pendingCount} change{pendingCount > 1 ? 's' : ''}...
        </Text>
      </View>
    );
  }

  // Offline — show more prominent warning
  const statusText = pendingCount > 0
    ? `Offline \u2014 ${pendingCount} change${pendingCount > 1 ? 's' : ''} queued`
    : 'Offline \u2014 changes will sync when online';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: SEMANTIC_COLORS.warningBg,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: SEMANTIC_COLORS.warning,
        }}
      />
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Inter_500Medium',
          color: theme.textMuted,
          flex: 1,
        }}
      >
        {statusText}
      </Text>
    </View>
  );
}
