import React from 'react';
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

  const titleStyle: React.CSSProperties = {
    color: applyOpacity(finalTitleColor, titleOpacity),
    fontSize: `${18 * scale}px`,
    fontWeight: 'bold',
    margin: 0,
  };

  const subTitleStyle: React.CSSProperties = {
    color: applyOpacity(finalSubtitleColor, subtitleOpacity),
    fontSize: `${14 * scale}px`,
    opacity: subtitleOpacity !== undefined ? subtitleOpacity / 100 : 0.9,
    margin: 0,
  };

  const buttonStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    fontSize: `${14 * scale}px`,
    padding: `${8 * scale}px ${16 * scale}px`,
    backgroundColor: buttonBackgroundColor ? applyOpacity(buttonBackgroundColor, buttonBackgroundOpacity) : undefined,
    color: buttonTextColor ? applyOpacity(buttonTextColor, buttonTextOpacity) : undefined,
  };

  // Update clockConfig with themeConfig colors if provided
  const finalClockConfig: ClockProps = {
    ...clockConfig,
    backgroundColor: finalCountdownBgColor,
    textColor: finalCountdownTextColor,
  };

  // Render based on layout
  const renderContent = () => {
    const titleEl = <Text weight="bold" style={titleStyle}>{title}</Text>;
    const subtitleEl = <Text size="small" style={subTitleStyle}>{subTitle}</Text>;
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

