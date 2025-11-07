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
  format: 'full' | 'compact' | 'minimal';
  showLabels: boolean;
  size: 'small' | 'medium' | 'large';
  placement: 'top' | 'center' | 'bottom';
  title: string;
  message: string;
}

