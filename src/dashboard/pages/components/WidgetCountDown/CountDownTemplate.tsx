import React from 'react';
import { Box, Text, Button } from '@wix/design-system';
import Clock, { ClockProps } from './Clock';
import './CountDownTemplate.css';

export interface CountdownBannerProps {
  clockConfig: ClockProps;
  title: string;
  subTitle: string;
  buttonText: string;
  buttonLink: string;
  scale?: number;
}

const CountDownTemplate: React.FC<CountdownBannerProps> = ({
  clockConfig,
  title,
  subTitle,
  buttonText,
  buttonLink,
  scale = 1,
}) => {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: clockConfig.backgroundColor,
    padding: `${20 * scale}px`,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: `${16 * scale}px`,
    boxSizing: 'border-box',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    marginBottom: scale < 1 ? `${(1 - scale) * 100}%` : '0',
  };

  const textContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${8 * scale}px`,
    flex: '1',
    minWidth: 0,
  };

  const titleStyle: React.CSSProperties = {
    color: clockConfig.textColor,
    fontSize: `${18 * scale}px`,
    fontWeight: 'bold',
    margin: 0,
  };

  const subTitleStyle: React.CSSProperties = {
    color: clockConfig.textColor,
    fontSize: `${14 * scale}px`,
    opacity: 0.9,
    margin: 0,
  };

  const buttonStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    fontSize: `${14 * scale}px`,
    padding: `${8 * scale}px ${16 * scale}px`,
  };

  return (
    <Box style={containerStyle}>
      <Box style={textContainerStyle}>
        <Text weight="bold" style={titleStyle}>
          {title}
        </Text>
        <Text size="small" style={subTitleStyle}>
          {subTitle}
        </Text>
      </Box>
      <Box style={{ flexShrink: 0 }}>
        <Clock {...clockConfig} />
      </Box>
      <Box style={{ flexShrink: 0 }}>
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
      </Box>
    </Box>
  );
};

export default CountDownTemplate;

