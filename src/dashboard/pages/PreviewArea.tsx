import React from 'react';
import { Box, Card, Text, InfoIcon, Button } from '@wix/design-system';

interface TimerConfig {
  targetDate: Date | undefined;
  format: 'full' | 'compact' | 'minimal';
  showLabels: boolean;
  size: 'small' | 'medium' | 'large';
  placement: 'top' | 'center' | 'bottom';
  title: string;
  message: string;
}

interface PreviewAreaProps {
  config: TimerConfig;
  CountDownTimer: React.FC<{
    targetDate: Date | undefined;
    format: 'full' | 'compact' | 'minimal';
    showLabels: boolean;
    size: 'small' | 'medium' | 'large';
  }>;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ config, CountDownTimer }) => {
  return (
    <Box
      flex="1"
      height="100%"
      width="100%"
      backgroundColor="#FFFFFF96"
      position="relative"
      style={{
        overflow: "auto",
      }}
      borderRadius="0px"    
    >
      <Box
        width="100%"
        height="100%"
        position="relative"
        style={{
          padding: "20px",
          minHeight: "100%",
        }}
      >
        {/* Countdown Timer Preview */}
        <div style={{ width: '100%', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'row', gap: '16px', height: '180px', alignItems: 'center', justifyContent: 'space-between', padding: '24px'}}>
            {config.message && (
              <Box direction="vertical" gap="SP2">
                <Text size="medium" weight="bold" secondary>
                  {config.title}
                </Text>
                <Text size="small" secondary>
                  {config.message}
                </Text>
              </Box>
            )}
            <CountDownTimer
              targetDate={config.targetDate}
              format={config.format}
              showLabels={config.showLabels}
              size={config.size}
            />
            <Box>
                <Button priority="primary" >Shop Now</Button>
            </Box>
        </div>


      </Box>
    </Box>
  );
};

export default PreviewArea;

