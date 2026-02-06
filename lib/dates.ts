import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format, parseISO } from 'date-fns';

export interface DurationBreakdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

export const getRelationshipDuration = (anniversaryDate: string): DurationBreakdown => {
  const start = parseISO(anniversaryDate);
  const now = new Date();

  const totalDays = differenceInDays(now, start);
  const totalHours = differenceInHours(now, start);
  const totalMinutes = differenceInMinutes(now, start);
  const totalSeconds = differenceInSeconds(now, start);

  return {
    days: totalDays,
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60,
    totalDays,
  };
};

export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d, yyyy');
};

export const formatDateShort = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d');
};

export const formatRelativeTime = (dateString: string): string => {
  const date = parseISO(dateString);
  const now = new Date();
  const daysDiff = differenceInDays(now, date);

  if (daysDiff === 0) return 'Today';
  if (daysDiff === 1) return 'Yesterday';
  if (daysDiff < 7) return `${daysDiff} days ago`;
  return format(date, 'MMM d');
};

export const getDailyQuoteIndex = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear;
};
