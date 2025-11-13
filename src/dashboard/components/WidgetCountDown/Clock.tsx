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
  countDirection?: 'ascending' | 'descending'; // Count up or down
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
  countDirection = 'ascending',
  displayOptions,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [counterValue, setCounterValue] = useState<number>(countFrom);

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

      // Always calculate the full time difference, regardless of display options
      setTimeRemaining({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [endDate, endTime, timerMode]);

  // Personal countdown mode
  useEffect(() => {
    if (timerMode !== 'personal-countdown' || !remainingTimePeriod) {
      return;
    }

    // Reset start time when period or unit changes - each time this effect runs, start a new countdown
    const startTime = new Date().getTime();

    const calculatePersonalCountdown = () => {
      const now = new Date().getTime();
      const elapsed = now - startTime;

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

      // Always calculate the full time difference, regardless of display options
      setTimeRemaining({
        days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
        hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((remaining % (1000 * 60)) / 1000),
      });
    };

    // Calculate immediately
    calculatePersonalCountdown();
    
    // Then update every second
    const interval = setInterval(calculatePersonalCountdown, 1000);

    return () => clearInterval(interval);
  }, [timerMode, remainingTimePeriod, remainingTimePeriodUnit]);

  // Number counter mode
  useEffect(() => {
    if (timerMode !== 'number-counter') {
      setCounterValue(countFrom);
      return;
    }

    // Initialize counter value based on direction
    const initialValue = countDirection === 'descending' ? countTo : countFrom;
    setCounterValue(initialValue);

    // Set up interval to increment or decrement counter
    const interval = setInterval(() => {
      setCounterValue((prev) => {
        if (countDirection === 'descending') {
          // Count down
          if (prev <= countFrom) {
            return countTo; // Reset to end when reaching countFrom
          }
          return prev - 1;
        } else {
          // Count up (ascending)
          if (prev >= countTo) {
            return countFrom; // Reset to start when reaching countTo
          }
          return prev + 1;
        }
      });
    }, (countFrequency || 1) * 1000);

    return () => clearInterval(interval);
  }, [timerMode, countFrom, countTo, countFrequency, countDirection]);

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
    // Format counter value - pad to at least 2 digits for consistency
    const counterDisplay = counterValue.toString().padStart(2, '0');
    
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
        {renderDigit(counterDisplay, 'Count')}
      </Box>
    );
  }

  // Render countdown modes
  const showDays = displayOptions?.showDays !== false;
  const showHours = displayOptions?.showHours !== false;
  const showMinutes = displayOptions?.showMinutes !== false;
  const showSeconds = displayOptions?.showSeconds !== false;

  // Calculate display values with conversions when higher units are hidden
  let displayDays = timeRemaining.days;
  let displayHours = timeRemaining.hours;
  let displayMinutes = timeRemaining.minutes;
  let displaySeconds = timeRemaining.seconds;

  // If Days is not selected, add days to hours (days * 24)
  if (!showDays && showHours) {
    displayHours = timeRemaining.hours + (timeRemaining.days * 24);
  }

  // If Hours is not selected, add hours to minutes (hours * 60)
  if (!showHours && showMinutes) {
    displayMinutes = timeRemaining.minutes + (timeRemaining.hours * 60);
    // Also add days to minutes if days are not shown
    if (!showDays) {
      displayMinutes = timeRemaining.minutes + (timeRemaining.hours * 60) + (timeRemaining.days * 24 * 60);
    }
  }

  // If Minutes is not selected, add minutes to seconds (minutes * 60)
  if (!showMinutes && showSeconds) {
    displaySeconds = timeRemaining.seconds + (timeRemaining.minutes * 60);
    // Also add hours to seconds if hours are not shown
    if (!showHours) {
      displaySeconds = timeRemaining.seconds + (timeRemaining.minutes * 60) + (timeRemaining.hours * 60 * 60);
      // Also add days to seconds if days are not shown
      if (!showDays) {
        displaySeconds = timeRemaining.seconds + (timeRemaining.minutes * 60) + (timeRemaining.hours * 60 * 60) + (timeRemaining.days * 24 * 60 * 60);
      }
    }
  }

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
      {showDays && renderDigit(formatNumber(displayDays), 'Days')}
      {showHours && renderDigit(formatNumber(displayHours), 'Hours')}
      {showMinutes && renderDigit(formatNumber(displayMinutes), 'Minutes')}
      {showSeconds && renderDigit(formatNumber(displaySeconds), 'Seconds')}
    </Box>
  );
};

export default Clock;

