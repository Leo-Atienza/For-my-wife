import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useTheme } from '@/hooks/useTheme';

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

  const statusText = !isConnected
    ? `Offline \u2014 ${pendingCount > 0 ? `${pendingCount} change${pendingCount > 1 ? 's' : ''} queued` : 'changes will sync when online'}`
    : `Syncing ${pendingCount} change${pendingCount > 1 ? 's' : ''}...`;

  const statusColor = !isConnected ? theme.textMuted : theme.primary;
  const bgColor = !isConnected ? '#FEF3C7' : theme.primarySoft;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: bgColor,
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
          backgroundColor: !isConnected ? '#F59E0B' : theme.primary,
        }}
      />
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Inter_500Medium',
          color: statusColor,
          flex: 1,
        }}
      >
        {statusText}
      </Text>
    </View>
  );
}
