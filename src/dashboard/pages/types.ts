export interface TimerConfig {
  timerMode: 'start-to-finish-timer' | 'personal-countdown' | 'number-counter';
  timerConfig?: {
    startDate?: Date;
    startTime?: Date;
    endDate?: Date;
    endTime?: Date;
    timeZone?: string;
    displayOptions?: {
      showDays?: boolean;
      showHours?: boolean;
      showMinutes?: boolean;
      showSeconds?: boolean;
    };
  };
  showLabels: boolean;
  placement: 'top' | 'center' | 'bottom';
  title: string;
  message: string;
  // Appearance settings
  selectedTemplate?: string;
  selectedClockStyle?: string;
  selectedTheme?: string;
}

