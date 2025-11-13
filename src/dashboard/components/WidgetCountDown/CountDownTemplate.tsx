import React, { useState, useEffect, useMemo } from 'react';
import { Box, Text, Button } from '@wix/design-system';
import Clock, { ClockProps } from './Clock';
import './CountDownTemplate.css';

export type TemplateLayout = 
  | 'title-timer-button'      // Title | Timer | Button (horizontal)
  | 'title-subtitle-timer-button' // Title/Subtitle | Timer | Button (horizontal)
  | 'title-timer-subtitle-button' // Title | Timer | Subtitle/Button (horizontal)
  | 'vertical-title-timer-button' // Title, Timer, Button (vertical)
  | 'timer-title-subtitle-button' // Timer | Title/Subtitle | Button (horizontal)
  | 'title-subtitle-button-timer'; // Title/Subtitle | Button | Timer (horizontal)

export interface CountdownBannerProps {
  clockConfig: ClockProps;
  title: string;
  subTitle: string;
  buttonText: string;
  buttonLink: string;
  showButton?: boolean;
  scale?: number;
  layout?: TemplateLayout;
  // Optional theme config colors
  titleColor?: string;
  titleOpacity?: number;
  subtitleColor?: string;
  subtitleOpacity?: number;
  countdownBoxBackgroundColor?: string;
  countdownBoxBackgroundOpacity?: number;
  countdownBoxTextColor?: string;
  countdownBoxTextOpacity?: number;
  buttonBackgroundColor?: string;
  buttonBackgroundOpacity?: number;
  buttonTextColor?: string;
  buttonTextOpacity?: number;
}

const CountDownTemplate: React.FC<CountdownBannerProps> = ({
  clockConfig,
  title,
  subTitle,
  buttonText,
  buttonLink,
  showButton = true,
  scale = 1,
  layout = 'title-subtitle-timer-button',
  titleColor,
  titleOpacity,
  subtitleColor,
  subtitleOpacity,
  countdownBoxBackgroundColor,
  countdownBoxBackgroundOpacity,
  countdownBoxTextColor,
  countdownBoxTextOpacity,
  buttonBackgroundColor,
  buttonBackgroundOpacity,
  buttonTextColor,
  buttonTextOpacity,
  
}) => {
  const isVertical = layout === 'vertical-title-timer-button';
  
  // Track window width for responsive font sizing
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);
  
  useEffect(() => {
    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
    }
    
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // Calculate responsive font sizes based on screen width
  const getResponsiveFontSize = (baseSize: number, scale: number): number => {
    let multiplier = 1;
    
    if (windowWidth < 480) {
      // Mobile small (< 480px)
      multiplier = 0.75;
    } else if (windowWidth < 768) {
      // Mobile (480px - 768px)
      multiplier = 0.85;
    } else if (windowWidth < 1024) {
      // Tablet (768px - 1024px)
      multiplier = 0.95;
    } else if (windowWidth < 1440) {
      // Desktop small (1024px - 1440px)
      multiplier = 1;
    } else {
      // Desktop large (>= 1440px)
      multiplier = 1.1;
    }
    
    return Math.round(baseSize * scale * multiplier * 10) / 10; // Round to 1 decimal place
  };
  
  // Calculate responsive font sizes - recalculate when windowWidth or scale changes
  const titleFontSize = useMemo(() => getResponsiveFontSize(24, scale), [windowWidth, scale]);
  const subtitleFontSize = useMemo(() => getResponsiveFontSize(18, scale), [windowWidth, scale]);
  const buttonFontSize = useMemo(() => getResponsiveFontSize(16, scale), [windowWidth, scale]);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    padding: `${20 * scale}px`,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: `${16 * scale}px`,
    boxSizing: 'border-box',
    transform: `scale(${scale})`,
    transformOrigin: 'center',
    margin: scale < 1 ? `${(1 - scale) * 50}% auto` : '0 auto',
    // CSS custom properties for responsive font sizes
    ['--title-font-size' as any]: `${titleFontSize}px`,
    ['--subtitle-font-size' as any]: `${subtitleFontSize}px`,
    ['--button-font-size' as any]: `${buttonFontSize}px`,
  };

  const textContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${8 * scale}px`,
    minWidth: 0,
    justifyContent: 'space-between',
  };

  const numberContainerStyle: React.CSSProperties = {
    backgroundColor: clockConfig.backgroundColor,
  };

  // Helper function to apply opacity to color
  const applyOpacity = (color: string, opacity?: number): string => {
    if (!opacity || opacity === 100) return color;
    // Convert hex to rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  // Use themeConfig colors if provided, otherwise fall back to clockConfig
  const finalTitleColor = titleColor || clockConfig.textColor;
  const finalSubtitleColor = subtitleColor || clockConfig.textColor;
  const finalCountdownBgColor = countdownBoxBackgroundColor || clockConfig.backgroundColor;
  const finalCountdownTextColor = countdownBoxTextColor || clockConfig.textColor;

  // Memoize styles to recalculate when windowWidth changes
  const titleStyle: React.CSSProperties = useMemo(() => ({
    color: applyOpacity(finalTitleColor, titleOpacity),
    fontSize: `${titleFontSize}px`,
    fontWeight: 'bold',
    margin: 0,
    display: 'block',
  }), [finalTitleColor, titleOpacity, titleFontSize]);

  const subTitleStyle: React.CSSProperties = useMemo(() => ({
    color: applyOpacity(finalSubtitleColor, subtitleOpacity),
    fontSize: `${subtitleFontSize}px`,
    opacity: subtitleOpacity !== undefined ? subtitleOpacity / 100 : 0.9,
    margin: 0,
    display: 'block',
  }), [finalSubtitleColor, subtitleOpacity, subtitleFontSize]);

  const buttonStyle: React.CSSProperties = useMemo(() => ({
    whiteSpace: 'nowrap',
    fontSize: `${buttonFontSize}px`,
    padding: `${8 * scale}px ${16 * scale}px`,
    backgroundColor: buttonBackgroundColor ? applyOpacity(buttonBackgroundColor, buttonBackgroundOpacity) : undefined,
    color: buttonTextColor ? applyOpacity(buttonTextColor, buttonTextOpacity) : undefined,
  }), [buttonBackgroundColor, buttonBackgroundOpacity, buttonTextColor, buttonTextOpacity, buttonFontSize, scale]);

  // Update clockConfig with themeConfig colors if provided
  const finalClockConfig: ClockProps = {
    ...clockConfig,
    backgroundColor: finalCountdownBgColor,
    textColor: finalCountdownTextColor,
  };

  // Render based on layout
  const renderContent = () => {
    const titleEl = (
      <span style={titleStyle}>
        {title}
      </span>
    );
    const subtitleEl = (
      <span style={subTitleStyle}>
        {subTitle}
      </span>
    );
    const timerEl = <Clock {...finalClockConfig} />;
    const buttonEl = showButton ? (
      <Button
        priority="primary"
        onClick={() => {
          if (buttonLink) {
            window.open(buttonLink, '_blank');
          }
        }}
        style={buttonStyle}
      >
        {buttonText}
      </Button>
    ) : null;

    switch (layout) {
      case 'title-timer-button':
        return (
          <>
            <Box style={textContainerStyle}>{titleEl}</Box>
            <Box style={{ flexShrink: 0 }}>{timerEl}</Box>
            {showButton && <Box style={{ flexShrink: 0 }}>{buttonEl}</Box>}
          </>
        );
      
      case 'title-subtitle-timer-button':
        return (
          <>
            <Box style={textContainerStyle}>
              {titleEl}
              {subtitleEl}
            </Box>
            <Box style={{ flexShrink: 0 }}>{timerEl}</Box>
            {showButton && <Box style={{ flexShrink: 0 }}>{buttonEl}</Box>}
          </>
        );
      
      case 'title-timer-subtitle-button':
        return (
          <>
            <Box style={textContainerStyle}>{titleEl}</Box>
            <Box style={{ flexShrink: 0 }}>{timerEl}</Box>
            <Box style={textContainerStyle}>
              {subtitleEl}
              {showButton && buttonEl}
            </Box>
          </>
        );
      
      case 'vertical-title-timer-button':
        return (
          <>
            <Box style={{ width: '100%', textAlign: 'center' }}>
              {titleEl}
              {subtitleEl}
            </Box>
            <Box style={{ flexShrink: 0 }}>{timerEl}</Box>
            {showButton && <Box style={{ flexShrink: 0 }}>{buttonEl}</Box>}
          </>
        );
      
      case 'timer-title-subtitle-button':
        return (
          <>
            <Box style={{ flexShrink: 0 }}>{timerEl}</Box>
            <Box style={textContainerStyle}>
              {titleEl}
              {subtitleEl}
            </Box>
            {showButton && <Box style={{ flexShrink: 0 }}>{buttonEl}</Box>}
          </>
        );
      
      case 'title-subtitle-button-timer':
        return (
          <>
            <Box style={textContainerStyle}>
              {titleEl}
              {subtitleEl}
            </Box>
            {showButton && <Box style={{ flexShrink: 0 }}>{buttonEl}</Box>}
            <Box style={{ flexShrink: 0 }}>{timerEl}</Box>
          </>
        );
      
      default:
        return (
          <>
            <Box style={textContainerStyle}>
              {titleEl}
              {subtitleEl}
            </Box>
            <Box style={{ flexShrink: 0 }}>{timerEl}</Box>
            {showButton && <Box style={{ flexShrink: 0 }}>{buttonEl}</Box>}
          </>
        );
    }
  };

  return (
    <Box style={containerStyle}>
      {renderContent()}
    </Box>
  );
};

export default CountDownTemplate;

