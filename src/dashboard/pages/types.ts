export interface TimerConfig {
  timerMode: 'start-to-finish-timer' | 'personal-countdown' | 'number-counter';
  timerConfig?: {
    startDate?: Date;
    startTime?: Date;
    endDate?: Date;
    endTime?: Date;
    timeZone?: string;
    // Personal countdown mode
    remainingTimePeriod?: number;
    remainingTimePeriodUnit?: 'minutes' | 'hours' | 'days';
    // Number counter mode
    countFrom?: number;
    countPeriodStart?: number; // Alias for countFrom
    countTo?: number;
    countFrequency?: number; // Frequency in seconds
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
  behaviorConfig?: {
    behaviorBannerAnimation?: BehaviorBannerAnimation;
    behaviorCounterNumberAnimation?: BehaviorCounterNumberAnimation;
    frequency?: 'perSession' | 'everyXMinutes';
    minutesInterval?: number;
    targeting?: 'allPages' | 'specificPages';
    specificPages?: string[];
    allowManualClose?: boolean;
  };
}

export type BehaviorBannerAnimation = 'slideIn' | 'fadeIn' | 'popIn' | 'bounce';
export type BehaviorCounterNumberAnimation = 'smoothIncrement' | 'popTransition' | 'flipClock' | 'fadeBetweenDigits';


