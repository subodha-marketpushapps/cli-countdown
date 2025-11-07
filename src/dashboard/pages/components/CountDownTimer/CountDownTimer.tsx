import React, { useState, useEffect, FC } from 'react';
import { Box, Text } from '@wix/design-system';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CountDownTimerProps {
  endDate: Date | undefined;
  endTime: Date | undefined;
  showLabels: boolean;
  selectedClockStyle?: string;
  labelPosition?: 'top' | 'bottom';
  numberStyle?: 'fillEachDigit' | 'outlineEachDigit' | 'filled' | 'outline' | 'none';
  backgroundColor?: string;
  textColor?: string;
}

const CountDownTimer: FC<CountDownTimerProps> = ({ 
  endDate, 
  endTime, 
  showLabels, 
  selectedClockStyle, 
  labelPosition = 'bottom',
  numberStyle = 'filled',
  backgroundColor = '#f0f0f0',
  textColor = '#000000',
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!endDate) {
      return;
    }

    const calculateTimeRemaining = () => {
      // Combine endDate and endTime to get the target datetime
      const targetDate = new Date(endDate);
      if (endTime) {
        targetDate.setHours(endTime.getHours());
        targetDate.setMinutes(endTime.getMinutes());
        targetDate.setSeconds(endTime.getSeconds());
        targetDate.setMilliseconds(endTime.getMilliseconds());
      } else {
        // Default to end of day if no endTime specified
        targetDate.setHours(23, 59, 59, 0);
      }

      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setIsExpired(false);
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
  }, [endDate, endTime]);

  if (!endDate) {
    return (
      <Box align="center" verticalAlign="middle" padding="SP6">
        <Text secondary>Please select an end date to start the countdown</Text>
      </Box>
    );
  }

  if (isExpired) {
    return (
      <Box align="center" verticalAlign="middle" padding="SP6">
        <Text weight="bold" size="medium">
          Countdown Expired!
        </Text>
      </Box>
    );
  }

  // Default to medium size
  const textSize: 'tiny' | 'small' | 'medium' = 'small';
  const numberSize: 'tiny' | 'small' | 'medium' = 'medium';

  // Get styles based on numberStyle
  const getNumberBoxStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      minWidth: '60px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
    };

    switch (numberStyle) {
      case 'fillEachDigit':
        return {
          ...baseStyle,
          backgroundColor: backgroundColor,
          color: textColor,
          padding: '8px 12px',
          borderRadius: '4px',
          border: 'none',
        };
      case 'outlineEachDigit':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: textColor,
          padding: '8px 12px',
          borderRadius: '4px',
          border: `2px solid ${textColor}`,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: backgroundColor,
          color: textColor,
          padding: '12px 16px',
          borderRadius: '6px',
          border: 'none',
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: textColor,
          padding: '12px 16px',
          borderRadius: '6px',
          border: `2px solid ${textColor}`,
        };
      case 'none':
      default:
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: textColor,
          padding: '8px',
          borderRadius: '0',
          border: 'none',
        };
    }
  };

  const renderTimeUnit = (value: string, label: string) => {
    const boxStyle = getNumberBoxStyle();
    const { color, ...restStyle } = boxStyle;
    
    return (
      <Box 
        align="center" 
        direction="vertical"
        gap="SP1"
      >
        {labelPosition === 'top' && showLabels && (
          <Text size={textSize} weight="normal" style={{ color: color, opacity: 0.8 }}>
            {label}
          </Text>
        )}
        <div style={restStyle}>
        <Text weight="bold" size={numberSize} style={{ color: color }}>
          {value}
        </Text>
        </div>
        {labelPosition === 'bottom' && showLabels && (
          <Text size={textSize} weight="normal" style={{ color: color, opacity: 0.8 }}>
            {label}
          </Text>
        )}
      </Box>
    );
  };

  return (
    <Box 
      direction="horizontal" 
      align="center" 
      verticalAlign="middle" 
      padding="SP6" 
      gap="SP3"
      style={{ justifyContent: 'center', flex:1 }}
    >
      {renderTimeUnit(String(timeRemaining.days).padStart(2, '0'), 'Days')}

      {renderTimeUnit(String(timeRemaining.hours).padStart(2, '0'), 'Hours')}

      {renderTimeUnit(String(timeRemaining.minutes).padStart(2, '0'), 'Minutes')}

      {renderTimeUnit(String(timeRemaining.seconds).padStart(2, '0'), 'Seconds')}
    </Box>
  );
};

export default CountDownTimer;

