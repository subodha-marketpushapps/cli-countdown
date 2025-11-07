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
  // Content settings
  subtitle?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  makeEntireTimerClickable?: boolean;
  openInNewTab?: boolean;
  showCloseButton?: boolean;
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
  // Theme customization
  themeConfig?: {
    backgroundType?: 'color' | 'image';
    backgroundColor?: string;
    backgroundOpacity?: number;
    backgroundImageUrl?: string;
    imageOpacityColor?: string;
    imageOpacity?: number;
    titleColor?: string;
    titleOpacity?: number;
    subtitleColor?: string;
    subtitleOpacity?: number;
    countdownLabelColor?: string;
    countdownLabelOpacity?: number;
    countdownBoxBackgroundColor?: string;
    countdownBoxBackgroundOpacity?: number;
    countdownBoxTextColor?: string;
    countdownBoxTextOpacity?: number;
    buttonBackgroundColor?: string;
    buttonBackgroundOpacity?: number;
    buttonTextColor?: string;
    buttonTextOpacity?: number;
  };
}

