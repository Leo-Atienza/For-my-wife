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
