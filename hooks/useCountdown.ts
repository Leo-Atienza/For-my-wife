import { useState, useEffect, useRef } from 'react';
import { differenceInSeconds } from 'date-fns';

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const useCountdown = (targetDate: string): CountdownValues => {
  const [values, setValues] = useState<CountdownValues>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => {
      const target = new Date(targetDate);
      const now = new Date();
      const totalSeconds = differenceInSeconds(target, now);

      if (totalSeconds <= 0) {
        setValues({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setValues({ days, hours, minutes, seconds, isExpired: false });
    };

    update();
    intervalRef.current = setInterval(update, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetDate]);

  return values;
};
