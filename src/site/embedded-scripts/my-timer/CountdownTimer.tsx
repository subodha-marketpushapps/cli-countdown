import React, { useState, useEffect, useRef } from 'react';
import './countdown-styles.css';

type BannerAnimation = 'slideIn' | 'fadeIn' | 'popIn' | 'bounce';
type CounterAnimation = 'smoothIncrement' | 'popTransition' | 'flipClock' | 'fadeBetweenDigits';

interface BehaviorConfig {
  behaviorBannerAnimation?: BannerAnimation;
  behaviorCounterNumberAnimation?: CounterAnimation;
  frequency?: 'perSession' | 'everyXMinutes';
  minutesInterval?: number;
  targeting?: 'allPages' | 'specificPages';
  specificPages?: string[];
  allowManualClose?: boolean;
}

interface TimerConfig {
  targetDate: string;
  format: 'full' | 'compact' | 'minimal';
  showLabels: boolean;
  size: 'small' | 'medium' | 'large';
  placement: 'top' | 'center' | 'bottom';
  title: string;
  message: string;
  containerId?: string;
  behaviorConfig?: BehaviorConfig;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  config: TimerConfig;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ config }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldDisplay, setShouldDisplay] = useState(true);
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);

  const behaviorConfig = config.behaviorConfig || {};
  const allowManualClose = behaviorConfig.allowManualClose !== false;
  const numberAnimationClass = behaviorConfig.behaviorCounterNumberAnimation
    ? `countdown-number-anim-${behaviorConfig.behaviorCounterNumberAnimation}`
    : '';
  const bannerAnimationClass = behaviorConfig.behaviorBannerAnimation
    ? `countdown-banner-anim-${behaviorConfig.behaviorBannerAnimation}`
    : 'countdown-banner-anim-slideIn';
  const behaviorConfigKey = JSON.stringify(behaviorConfig || {});
  const sessionKey = `${config.containerId || 'wix-countdown-timer'}-session-shown`;
  const lastClosedKey = `${config.containerId || 'wix-countdown-timer'}-last-closed`;

  const passesTargetingRules = (): boolean => {
    if (!behaviorConfig || behaviorConfig.targeting !== 'specificPages') {
      return true;
    }

    const pages = behaviorConfig.specificPages || [];
    if (!pages.length) {
      return false;
    }

    if (typeof window === 'undefined') {
      return true;
    }

    const normalizePath = (path: string) => {
      if (!path) {
        return '/';
      }
      const trimmed = path.trim();
      return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    };

    const currentPath = (window.location?.pathname || '/').toLowerCase();
    return pages.some((page) => currentPath.startsWith(normalizePath(page).toLowerCase()));
  };

  const passesFrequencyRules = (): boolean => {
    try {
      if (behaviorConfig.frequency === 'perSession') {
        if (typeof sessionStorage === 'undefined') {
          return true;
        }
        return sessionStorage.getItem(sessionKey) !== 'true';
      }

      if (behaviorConfig.frequency === 'everyXMinutes') {
        if (typeof localStorage === 'undefined') {
          return true;
        }
        const lastClosed = localStorage.getItem(lastClosedKey);
        if (!lastClosed) {
          return true;
        }
        const intervalMinutes = Math.max(behaviorConfig.minutesInterval || 2, 1);
        const diff = Date.now() - Number(lastClosed);
        return diff >= intervalMinutes * 60 * 1000;
      }
    } catch (error) {
      console.warn('Could not evaluate frequency rules:', error);
      return true;
    }

    return true;
  };

  useEffect(() => {
    const canDisplay = passesTargetingRules() && passesFrequencyRules();
    setShouldDisplay(canDisplay);
    setIsManuallyClosed(false);

    if (canDisplay && behaviorConfig.frequency === 'perSession') {
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(sessionKey, 'true');
        }
      } catch (error) {
        console.warn('Could not persist session state:', error);
      }
    }
  }, [behaviorConfigKey, config.targetDate, sessionKey, lastClosedKey]);

  const calculateTimeRemaining = (): TimeRemaining | null => {
    const target = new Date(config.targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };

  useEffect(() => {
    const updateTimer = () => {
      const remaining = calculateTimeRemaining();
      if (!remaining) {
        setIsExpired(true);
        setTimeRemaining(null);
        return;
      }
      setIsExpired(false);
      setTimeRemaining(remaining);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [config.targetDate]);

  const formatNumber = (num: number): string => {
    return String(num).padStart(2, '0');
  };

  const getSizeClass = (): string => {
    return `countdown-size-${config.size}`;
  };

  if (!shouldDisplay || isManuallyClosed) {
    return null;
  }

  if (!timeRemaining && !isExpired) {
    return (
      <div className="countdown-timer">
        <p>Loading countdown timer...</p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className={`countdown-timer expired ${getSizeClass()}`}>
        {config.title && <h3 className="countdown-title">{config.title}</h3>}
        {/* <div className="countdown-expired">Countdown Expired!</div> */}
      </div>
    );
  }

  if (!timeRemaining) {
    return null;
  }

  const renderTimerContent = () => {
    if (config.format === 'minimal') {
      return (
        <div className="countdown-minimal">
          <span className={`countdown-number ${numberAnimationClass}`}>{timeRemaining.days}d</span>{' '}
          <span className={`countdown-number ${numberAnimationClass}`}>{timeRemaining.hours}h</span>{' '}
          <span className={`countdown-number ${numberAnimationClass}`}>{timeRemaining.minutes}m</span>{' '}
          <span className={`countdown-number ${numberAnimationClass}`}>{timeRemaining.seconds}s</span>
        </div>
      );
    }

    if (config.format === 'compact') {
      return (
        <div className="countdown-compact">
          <div className="countdown-unit">
            <span className={`countdown-number ${numberAnimationClass}`}>{formatNumber(timeRemaining.days)}</span>
            {config.showLabels && <span className="countdown-label">Days</span>}
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-unit">
            <span className={`countdown-number ${numberAnimationClass}`}>{formatNumber(timeRemaining.hours)}</span>
            {config.showLabels && <span className="countdown-label">Hours</span>}
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-unit">
            <span className={`countdown-number ${numberAnimationClass}`}>{formatNumber(timeRemaining.minutes)}</span>
            {config.showLabels && <span className="countdown-label">Minutes</span>}
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-unit">
            <span className={`countdown-number ${numberAnimationClass}`}>{formatNumber(timeRemaining.seconds)}</span>
            {config.showLabels && <span className="countdown-label">Seconds</span>}
          </div>
        </div>
      );
    }

    // Full format
    return (
      <div className="countdown-full">
        <div className="countdown-box">
          <span className={`countdown-number ${numberAnimationClass}`}>{formatNumber(timeRemaining.days)}</span>
          {config.showLabels && <span className="countdown-label">Days</span>}
        </div>
        <div className="countdown-box">
          <span className={`countdown-number ${numberAnimationClass}`}>{formatNumber(timeRemaining.hours)}</span>
          {config.showLabels && <span className="countdown-label">Hours</span>}
        </div>
        <div className="countdown-box">
          <span className={`countdown-number ${numberAnimationClass}`}>{formatNumber(timeRemaining.minutes)}</span>
          {config.showLabels && <span className="countdown-label">Minutes</span>}
        </div>
        <div className="countdown-box">
          <span className={`countdown-number ${numberAnimationClass}`}>{formatNumber(timeRemaining.seconds)}</span>
          {config.showLabels && <span className="countdown-label">Seconds</span>}
        </div>
      </div>
    );
  };

  const handleManualClose = () => {
    if (!allowManualClose) {
      return;
    }
    setIsManuallyClosed(true);

    try {
      if (behaviorConfig.frequency === 'perSession' && typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(sessionKey, 'true');
      }
      if (behaviorConfig.frequency === 'everyXMinutes' && typeof localStorage !== 'undefined') {
        localStorage.setItem(lastClosedKey, Date.now().toString());
      }
    } catch (error) {
      console.warn('Could not persist dismissal state:', error);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`countdown-container countdown-${config.placement} ${bannerAnimationClass}`}
    >
      {allowManualClose && (
        <button
          className="countdown-close-button"
          onClick={handleManualClose}
          aria-label="Close countdown timer"
        >
          ×
        </button>
      )}
      <div className={`countdown-timer ${getSizeClass()}`}>
        {config.title && <h3 className="countdown-title">{config.title}</h3>}
        {config.message && <p className="countdown-message">{config.message}</p>}
        <div className={`countdown-display countdown-${config.format}`}>
          {renderTimerContent()}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;

