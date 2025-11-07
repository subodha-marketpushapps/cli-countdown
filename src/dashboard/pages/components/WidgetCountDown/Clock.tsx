import React, { useState, useEffect } from 'react';
import { Box, Text } from '@wix/design-system';
import './Clock.css';

export interface ClockProps {
  labelPosition: 'top' | 'bottom';
  numberStyle: 'fillEachDigit' | 'outlineEachDigit' | 'filled' | 'outline' | 'none';
  endDate: Date;
  endTime: string; // Format: "HH:mm:ss"
  backgroundColor: string;
  textColor: string;
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
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
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
      {renderDigit(formatNumber(timeRemaining.days), 'Days')}
      {renderDigit(formatNumber(timeRemaining.hours), 'Hours')}
      {renderDigit(formatNumber(timeRemaining.minutes), 'Minutes')}
      {renderDigit(formatNumber(timeRemaining.seconds), 'Seconds')}
    </Box>
  );
};

export default Clock;

