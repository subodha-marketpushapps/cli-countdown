import React, { useState } from 'react';
import { Box, Card, Text, InfoIcon, Button, IconButton } from '@wix/design-system';
import * as Icons from '@wix/wix-ui-icons-common';
import { TimerConfig } from './types';
import CountDownTimer from './components/CountDownTimer';

interface PreviewAreaProps {
  config: TimerConfig;
  endDate: Date | undefined;
  endTime: Date | undefined;
  viewType?: 'desktopView' | 'mobileView';
  backgroundMode?: 'clean' | 'website';
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ 
  config, 
  endDate, 
  endTime, 
  viewType = 'desktopView',
  backgroundMode = 'website'
}) => {
  const [isOverlayClosed, setIsOverlayClosed] = useState(false);

  // Get positioning styles based on placement
  const getPlacementStyles = (): React.CSSProperties => {
    const bannerStyle: React.CSSProperties = {
      width: '100%',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'row',
      gap: '16px',
      height: '180px',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px',
      boxSizing: 'border-box',
    };

    switch (config.placement) {
      case 'centered_overlay':
        return {
          ...bannerStyle,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10001,
          maxWidth: '900px',
          width: '95%',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        };
      case 'static_top':
        return {
          ...bannerStyle,
          position: 'relative',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        };
      case 'floating_top':
        return {
          ...bannerStyle,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        };
      case 'floating_bottom':
        return {
          ...bannerStyle,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 9999,
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
        };
      default:
        return bannerStyle;
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    // Ensure fixed positioning is relative to viewport, not container
    transform: 'none',
  };

  // For centered overlay, add a backdrop
  const renderOverlayBackdrop = () => {
    if (config.placement === 'centered_overlay' && !isOverlayClosed) {
      return (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 10000,
          }}
        />
      );
    }
    return null;
  };

  // Reset overlay closed state when placement changes
  React.useEffect(() => {
    setIsOverlayClosed(false);
  }, [config.placement]);

  // Get container styles based on view type and background mode
  const getContainerStyles = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      transform: 'none',
    };

    if (viewType === 'mobileView') {
      return {
        ...baseStyle,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: backgroundMode === 'clean' ? '#F5F5F5' : '#FFFFFF96',
      };
    }

    return {
      ...baseStyle,
      backgroundColor: backgroundMode === 'clean' ? '#F5F5F5' : '#FFFFFF96',
    };
  };

  // Get preview wrapper styles for mobile view
  const getPreviewWrapperStyles = (): React.CSSProperties => {
    if (viewType === 'mobileView') {
      return {
        width: '375px',
        height: '667px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        transform: 'scale(0.8)',
        transformOrigin: 'center',
      };
    }

    return {
      width: '100%',
      height: '100%',
      position: 'relative',
      flex: '1',
    };
  };

  // Don't render banner if overlay is closed
  if (config.placement === 'centered_overlay' && isOverlayClosed) {
    return (
      <Box
        flex="1"
        height="100%"
        width="100%"
        position="relative"
        style={getContainerStyles()}
        borderRadius="0px"
      >
        <Box
          style={getPreviewWrapperStyles()}
        >
          <Box
            width="100%"
            height="100%"
            position="relative"
            style={{
              padding: '20px',
              minHeight: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text secondary>Overlay closed. Change placement to show preview.</Text>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      flex="1"
      height="100%"
      width="100%"
      position="relative"
      style={{
        ...getContainerStyles(),
        minWidth: 0,
      }}
      borderRadius="0px"    
    >
      {renderOverlayBackdrop()}
      <Box
        style={getPreviewWrapperStyles()}
      >
        <Box
          width="100%"
          height="100%"
          position="relative"
          style={{
            padding: config.placement === 'centered_overlay' ? '0' : '20px',
            minHeight: '100%',
          }}
        >
        {config.placement === 'centered_overlay' && (
              <IconButton
                skin="dark"
                priority="tertiary"
                onClick={() => setIsOverlayClosed(true)}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  zIndex: 10002,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  minWidth: '32px',
                  width: '32px',
                  height: '32px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Icons.X />
              </IconButton>
            )}
        {/* Countdown Timer Preview */}
        <div style={getPlacementStyles()}>
          
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            
            {config.message && (
              <Box direction="vertical" gap="SP2" style={{ flex: '1', minWidth: 0 }}>
                <Text size="medium" weight="bold" secondary>
                  {config.title}
                </Text>
                <Text size="small" secondary>
                  {config.message}
                </Text>
              </Box>
            )}
          <CountDownTimer
            endDate={endDate}
            endTime={endTime}
            selectedClockStyle={config.selectedClockStyle}
              labelPosition={config.labelPosition}
              numberStyle={config.numberStyle}
              backgroundColor={config.backgroundColor}
              textColor={config.textColor}
            />
            {config.showButton !== false && (
              <Box style={{ flexShrink: 0, flex:1, justifyContent: 'flex-end' }}>
                <Button priority="primary">{config.buttonText || 'Shop Now'}</Button>
              </Box>
            )}
          </div>
        </div>
        </Box>
      </Box>
    </Box>
  );
};

export default PreviewArea;

