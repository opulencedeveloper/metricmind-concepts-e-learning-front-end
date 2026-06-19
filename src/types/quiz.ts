export interface QuizTimerState {
  remainingTime: number | null;
  isTimeUp: boolean;
  timeStarted: boolean;
  formattedTime: string;
}
