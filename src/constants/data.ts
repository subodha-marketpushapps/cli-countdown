import { TimerConfig } from '../dashboard/pages/types';

/**
 * Creates a default TimerConfig with initial values
 * This function returns a new object each time to ensure Date objects are fresh
 */
export const createDefaultTimerConfig = (): TimerConfig => {
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0);

  const endTime = new Date();
  endTime.setHours(23, 59, 59, 0);

  return {
    timerMode: 'start-to-finish-timer',
    timerConfig: {
      startDate: now,
      startTime,
      endDate,
      endTime,
      timeZone: 'UTC',
      displayOptions: {
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
      },
    },
    placement: 'static_top',
    title: 'Countdown Timer',
    message: 'Time remaining until the event',
    selectedTemplate: 'template-1',
    selectedClockStyle: '1',
    selectedTheme: 'theme-1',
    labelPosition: 'top',
    numberStyle: 'fillEachDigit',
    backgroundColor: '#2563eb',
    textColor: '#ffffff',
  };
};

/**
 * Default TimerConfig constant
 * Note: Use createDefaultTimerConfig() if you need fresh Date objects
 */
export const DEFAULT_TIMER_CONFIG: TimerConfig = createDefaultTimerConfig();

