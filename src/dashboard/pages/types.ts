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
  placement: 'centered_overlay' | 'static_top' | 'floating_top' | 'floating_bottom';
  title: string;
  message: string;
  // Appearance settings
  selectedTemplate?: string;
  selectedClockStyle?: string;
  selectedTheme?: string;
  labelPosition?: 'top' | 'bottom';
  numberStyle?: 'fillEachDigit' | 'outlineEachDigit' | 'filled' | 'outline' | 'none';
  backgroundColor?: string;
  textColor?: string;
  // Action after timer finishes
  actionConfig?: {
    action?: 'hide' | 'show-message' | 'redirect';
    message?: string;
    showCountries?: boolean;
    showButton?: boolean;
    redirectUrl?: string;
  };
}

