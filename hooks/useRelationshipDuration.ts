import { useState, useEffect, useRef } from 'react';
import { getRelationshipDuration } from '@/lib/dates';
import type { DurationBreakdown } from '@/lib/dates';

export const useRelationshipDuration = (anniversaryDate: string | undefined): DurationBreakdown | null => {
  const [duration, setDuration] = useState<DurationBreakdown | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!anniversaryDate) return;

    const update = () => {
      setDuration(getRelationshipDuration(anniversaryDate));
    };

    update();
    intervalRef.current = setInterval(update, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [anniversaryDate]);

  return duration;
};
