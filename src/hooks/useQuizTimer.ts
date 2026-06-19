import { useState, useEffect, useCallback } from 'react';
import { QuizTimerState } from '@/types/quiz';

export const useQuizTimer = (timeLimitMinutes: number | null): QuizTimerState => {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [timeStarted, setTimeStarted] = useState(false);

  // Initialize timer when time limit is provided
  useEffect(() => {
    if (timeLimitMinutes && !timeStarted) {
      setTimeStarted(true);
      setRemainingTime(timeLimitMinutes * 60); // Convert to seconds
    }
  }, [timeLimitMinutes, timeStarted]);

  // Countdown timer
  useEffect(() => {
    if (!timeLimitMinutes || remainingTime === null || remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev === null || prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimitMinutes, remainingTime]);

  // Format time as MM:SS
  const formattedTime = useCallback(() => {
    if (remainingTime === null) return '--:--';

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [remainingTime])();

  return {
    remainingTime,
    isTimeUp: remainingTime === 0,
    timeStarted,
    formattedTime,
  };
};
