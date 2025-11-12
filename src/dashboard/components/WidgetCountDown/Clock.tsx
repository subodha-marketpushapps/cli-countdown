import React, { useState, useEffect } from 'react';
import { Box, Text } from '@wix/design-system';
import './Clock.css';

export interface ClockProps {
  labelPosition: 'top' | 'bottom';
  numberStyle: 'fillEachDigit' | 'outlineEachDigit' | 'filled' | 'outline' | 'none';
  backgroundColor: string;
  textColor: string;
  // Start-to-finish timer mode
  endDate?: Date;
  endTime?: string; // Format: "HH:mm:ss"
  // Personal countdown mode
  remainingTimePeriod?: number;
  remainingTimePeriodUnit?: 'minutes' | 'hours' | 'days';
  // Number counter mode
  countFrom?: number;
  countTo?: number;
  countFrequency?: number; // Frequency in seconds
  // Timer mode
  timerMode?: 'start-to-finish-timer' | 'personal-countdown' | 'number-counter';
  // Display options
  displayOptions?: {
    showDays?: boolean;
    showHours?: boolean;
    showMinutes?: boolean;
    showSeconds?: boolean;
  };
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Clock: React.FC<ClockProps> = ({
  labelPosition,
  numberStyle,
  endDate,
  endTime,
  backgroundColor,
  textColor,
  timerMode = 'start-to-finish-timer',
  remainingTimePeriod,
  remainingTimePeriodUnit = 'minutes',
  countFrom = 0,
  countTo = 100,
  countFrequency = 1,
  displayOptions,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [counterValue, setCounterValue] = useState<number>(countFrom);

  // Initialize counter value when countFrom changes
  useEffect(() => {
    if (timerMode === 'number-counter') {
      setCounterValue(countFrom);
    }
  }, [timerMode, countFrom]);

  // Start-to-finish timer mode
  useEffect(() => {
    if (timerMode !== 'start-to-finish-timer' || !endDate || !endTime) return;

    const calculateTimeRemaining = () => {
      const targetDate = new Date(endDate);
      const [hours, minutes, seconds] = endTime.split(':').map(Number);
      targetDate.setHours(hours, minutes, seconds || 0, 0);

      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const showDays = displayOptions?.showDays !== false;
      const showHours = displayOptions?.showHours !== false;
      const showMinutes = displayOptions?.showMinutes !== false;
      const showSeconds = displayOptions?.showSeconds !== false;

      setTimeRemaining({
        days: showDays ? Math.floor(difference / (1000 * 60 * 60 * 24)) : 0,
        hours: showHours ? Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : 0,
        minutes: showMinutes ? Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)) : 0,
        seconds: showSeconds ? Math.floor((difference % (1000 * 60)) / 1000) : 0,
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [endDate, endTime, timerMode, displayOptions]);

  // Personal countdown mode
  useEffect(() => {
    if (timerMode !== 'personal-countdown' || !remainingTimePeriod) return;

    const calculatePersonalCountdown = () => {
      // For personal countdown, we'll use localStorage to track per-visitor time
      const storageKey = 'countdown-timer-personal-start';
      let startTime = localStorage.getItem(storageKey);
      
      if (!startTime) {
        startTime = new Date().getTime().toString();
        localStorage.setItem(storageKey, startTime);
      }

      const start = parseInt(startTime, 10);
      const now = new Date().getTime();
      const elapsed = now - start;

      // Convert remaining time period to milliseconds
      let periodMs = 0;
      switch (remainingTimePeriodUnit) {
        case 'minutes':
          periodMs = remainingTimePeriod * 60 * 1000;
          break;
        case 'hours':
          periodMs = remainingTimePeriod * 60 * 60 * 1000;
          break;
        case 'days':
          periodMs = remainingTimePeriod * 24 * 60 * 60 * 1000;
          break;
      }

      const remaining = periodMs - elapsed;

      if (remaining <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const showDays = displayOptions?.showDays !== false;
      const showHours = displayOptions?.showHours !== false;
      const showMinutes = displayOptions?.showMinutes !== false;
      const showSeconds = displayOptions?.showSeconds !== false;

      setTimeRemaining({
        days: showDays ? Math.floor(remaining / (1000 * 60 * 60 * 24)) : 0,
        hours: showHours ? Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : 0,
        minutes: showMinutes ? Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)) : 0,
        seconds: showSeconds ? Math.floor((remaining % (1000 * 60)) / 1000) : 0,
      });
    };

    calculatePersonalCountdown();
    const interval = setInterval(calculatePersonalCountdown, 1000);

    return () => clearInterval(interval);
  }, [timerMode, remainingTimePeriod, remainingTimePeriodUnit, displayOptions]);

  // Number counter mode
  useEffect(() => {
    if (timerMode !== 'number-counter') return;

    const interval = setInterval(() => {
      setCounterValue((prev) => {
        if (prev >= countTo) {
          return countFrom; // Reset to start
        }
        return prev + 1;
      });
    }, countFrequency * 1000);

    return () => clearInterval(interval);
  }, [timerMode, countFrom, countTo, countFrequency]);

  const formatNumber = (num: number): string => {
    return String(num).padStart(2, '0');
  };

  const renderDigit = (value: string, label: string) => {
    const digitBoxStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '60px',
      margin: '0 4px',
    };

    const numberStyleMap: Record<string, React.CSSProperties> = {
      fillEachDigit: {
        backgroundColor: backgroundColor,
        color: textColor,
        padding: '8px 12px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '18px',
        border: 'none',
      },
      outlineEachDigit: {
        backgroundColor: 'transparent',
        color: textColor,
        padding: '8px 12px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '18px',
        border: `2px solid ${textColor}`,
      },
      filled: {
        backgroundColor: backgroundColor,
        color: textColor,
        padding: '12px 16px',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '20px',
        border: 'none',
      },
      outline: {
        backgroundColor: 'transparent',
        color: textColor,
        padding: '12px 16px',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '20px',
        border: `2px solid ${textColor}`,
      },
      none: {
        backgroundColor: 'transparent',
        color: textColor,
        padding: '8px',
        borderRadius: '0',
        fontWeight: 'bold',
        fontSize: '18px',
        border: 'none',
      },
    };

    const labelStyle: React.CSSProperties = {
      fontSize: '12px',
      color: textColor,
      marginTop: labelPosition === 'bottom' ? '4px' : '0',
      marginBottom: labelPosition === 'top' ? '4px' : '0',
      opacity: 0.8,
    };

    return (
      <Box style={digitBoxStyle}>
        {labelPosition === 'top' && (
          <Text size="tiny" style={labelStyle}>
            {label}
          </Text>
        )}
        <Box style={numberStyleMap[numberStyle]}>
          <Text weight="bold" style={{ color: numberStyleMap[numberStyle].color }}>
            {value}
          </Text>
        </Box>
        {labelPosition === 'bottom' && (
          <Text size="tiny" style={labelStyle}>
            {label}
          </Text>
        )}
      </Box>
    );
  };

  // Render number counter mode
  if (timerMode === 'number-counter') {
    return (
      <Box
        direction="horizontal"
        align="center"
        gap="SP1"
        style={{
          padding: '8px',
          justifyContent: 'center',
        }}
      >
        {renderDigit(formatNumber(counterValue), 'Count')}
      </Box>
    );
  }

  // Render countdown modes
  const showDays = displayOptions?.showDays !== false;
  const showHours = displayOptions?.showHours !== false;
  const showMinutes = displayOptions?.showMinutes !== false;
  const showSeconds = displayOptions?.showSeconds !== false;

  return (
    <Box
      direction="horizontal"
      align="center"
      gap="SP1"
      style={{
        padding: '8px',
        justifyContent: 'center',
      }}
    >
      {showDays && renderDigit(formatNumber(timeRemaining.days), 'Days')}
      {showHours && renderDigit(formatNumber(timeRemaining.hours), 'Hours')}
      {showMinutes && renderDigit(formatNumber(timeRemaining.minutes), 'Minutes')}
      {showSeconds && renderDigit(formatNumber(timeRemaining.seconds), 'Seconds')}
    </Box>
  );
};

export default Clock;

