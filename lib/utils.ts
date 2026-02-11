import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => uuidv4();

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '\u2026';
};

/**
 * Returns true if the remote record is newer than the local record.
 * Used for last-write-wins conflict resolution.
 */
export const isNewerRecord = (
  local: { updatedAt?: string; createdAt?: string },
  remote: { updatedAt?: string; createdAt?: string }
): boolean => {
  const localTime = local.updatedAt ?? local.createdAt ?? '';
  const remoteTime = remote.updatedAt ?? remote.createdAt ?? '';
  if (!remoteTime) return true; // No timestamp on remote — accept it
  if (!localTime) return true; // No timestamp on local — accept remote
  return new Date(remoteTime).getTime() >= new Date(localTime).getTime();
};
