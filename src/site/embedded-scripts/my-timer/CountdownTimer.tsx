import React, { useState, useEffect, useRef } from 'react';
import './countdown-styles.css';

interface TimerConfig {
  targetDate: string;
  format: 'full' | 'compact' | 'minimal';
  showLabels: boolean;
  size: 'small' | 'medium' | 'large';
  placement: 'top' | 'center' | 'bottom';
  title: string;
  message: string;
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
  const [isClosed, setIsClosed] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    // Check if overlay was closed in session storage
    if (config.placement === 'center' && sessionStorage.getItem('countdown-timer-closed') === 'true') {
      setIsClosed(true);
    }
  }, [config.placement]);

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

  const closeOverlay = () => {
    setIsClosed(true);
    sessionStorage.setItem('countdown-timer-closed', 'true');
  };

  const getSizeClass = (): string => {
    return `countdown-size-${config.size}`;
  };

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
        <div className="countdown-expired">Countdown Expired!</div>
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
          {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
        </div>
      );
    }

    if (config.format === 'compact') {
      return (
        <div className="countdown-compact">
          <div className="countdown-unit">
            <span className="countdown-number">{formatNumber(timeRemaining.days)}</span>
            {config.showLabels && <span className="countdown-label">Days</span>}
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-unit">
            <span className="countdown-number">{formatNumber(timeRemaining.hours)}</span>
            {config.showLabels && <span className="countdown-label">Hours</span>}
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-unit">
            <span className="countdown-number">{formatNumber(timeRemaining.minutes)}</span>
            {config.showLabels && <span className="countdown-label">Minutes</span>}
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-unit">
            <span className="countdown-number">{formatNumber(timeRemaining.seconds)}</span>
            {config.showLabels && <span className="countdown-label">Seconds</span>}
          </div>
        </div>
      );
    }

    // Full format
    return (
      <div className="countdown-full">
        <div className="countdown-box">
          <span className="countdown-number">{formatNumber(timeRemaining.days)}</span>
          {config.showLabels && <span className="countdown-label">Days</span>}
        </div>
        <div className="countdown-box">
          <span className="countdown-number">{formatNumber(timeRemaining.hours)}</span>
          {config.showLabels && <span className="countdown-label">Hours</span>}
        </div>
        <div className="countdown-box">
          <span className="countdown-number">{formatNumber(timeRemaining.minutes)}</span>
          {config.showLabels && <span className="countdown-label">Minutes</span>}
        </div>
        <div className="countdown-box">
          <span className="countdown-number">{formatNumber(timeRemaining.seconds)}</span>
          {config.showLabels && <span className="countdown-label">Seconds</span>}
        </div>
      </div>
    );
  };

  const timerContent = (
    <div className={`countdown-timer ${getSizeClass()}`}>
      {config.title && <h3 className="countdown-title">{config.title}</h3>}
      {config.message && <p className="countdown-message">{config.message}</p>}
      <div className={`countdown-display countdown-${config.format}`}>
        {renderTimerContent()}
      </div>
    </div>
  );

  // Handle placement
  if (config.placement === 'center' && !isClosed) {
    return (
      <div className="countdown-overlay" ref={overlayRef} onClick={(e) => {
        if (e.target === overlayRef.current) {
          closeOverlay();
        }
      }}>
        <div className="countdown-timer-wrapper">
          <button
            className="countdown-close-button"
            onClick={closeOverlay}
            aria-label="Close countdown timer"
          >
            ×
          </button>
          {timerContent}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`countdown-container countdown-${config.placement}`}
    >
      {timerContent}
    </div>
  );
};

export default CountdownTimer;

