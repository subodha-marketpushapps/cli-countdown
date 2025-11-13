import React, { useState } from 'react';
import { IconButton } from '@wix/design-system';
import * as Icons from '@wix/wix-ui-icons-common';
import { TimerConfig } from './types';
import CountDownTemplate, { TemplateLayout } from '../components/WidgetCountDown/CountDownTemplate';

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

  // Helper function to get startDate from config with fallback
  const getStartDate = (): Date => {
    if (config.timerConfig?.startDate) {
      return new Date(config.timerConfig.startDate);
    }
    // Default fallback: today
    return new Date();
  };

  // Helper function to format startTime Date to "HH:mm:ss" string
  const getStartTimeString = (): string => {
    if (config.timerConfig?.startTime) {
      const time = new Date(config.timerConfig.startTime);
      const hours = String(time.getHours()).padStart(2, '0');
      const minutes = String(time.getMinutes()).padStart(2, '0');
      const seconds = String(time.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
    // Default fallback: start of day
    return "00:00:00";
  };

  // Helper function to convert Date to time string
  const getEndTimeString = (): string => {
    if (endTime) {
      const time = new Date(endTime);
      const hours = String(time.getHours()).padStart(2, '0');
      const minutes = String(time.getMinutes()).padStart(2, '0');
      const seconds = String(time.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
    // Default fallback: end of day
    return "23:59:59";
  };

  // Clock Style to properties mapping (same as PanelAppearance)
  const clockStyleMap: Record<string, {
    numberStyle: 'fillEachDigit' | 'outlineEachDigit' | 'filled' | 'outline' | 'none';
    backgroundColor: string;
    textColor: string;
    labelPosition: 'top' | 'bottom';
  }> = {
    '1': {
      numberStyle: 'fillEachDigit',
      backgroundColor: '#2563eb',
      textColor: '#ffffff',
      labelPosition: 'top',
    },
    '2': {
      numberStyle: 'outlineEachDigit',
      backgroundColor: '#2563eb',
      textColor: '#2563eb',
      labelPosition: 'bottom',
    },
    '3': {
      numberStyle: 'filled',
      backgroundColor: '#10b981',
      textColor: '#ffffff',
      labelPosition: 'bottom',
    },
    '4': {
      numberStyle: 'outline',
      backgroundColor: '#f59e0b',
      textColor: '#f59e0b',
      labelPosition: 'bottom',
    },
    '5': {
      numberStyle: 'none',
      backgroundColor: '#6366f1',
      textColor: '#6366f1',
      labelPosition: 'bottom',
    },
  };

  // Template layout definitions (same as PanelAppearance)
  const templateLayoutMap: Record<string, TemplateLayout> = {
    'template-1': 'title-subtitle-timer-button',
    'template-2': 'title-timer-button',
    'template-3': 'timer-title-subtitle-button',
    'template-4': 'title-subtitle-button-timer',
    'template-5': 'title-timer-subtitle-button',
    'template-6': 'vertical-title-timer-button',
    'template-7': 'title-subtitle-timer-button',
    'template-8': 'timer-title-subtitle-button',
  };

  // Get theme config
  const themeConfig = config.themeConfig || {};

  // Get selected clock style config
  const getSelectedClockConfig = () => {
    const selectedClockStyle = config.selectedClockStyle || '1';
    const clockStyleProps = clockStyleMap[selectedClockStyle];
    if (clockStyleProps) {
      return {
        labelPosition: clockStyleProps.labelPosition,
        numberStyle: clockStyleProps.numberStyle,
        backgroundColor: themeConfig.countdownBoxBackgroundColor || clockStyleProps.backgroundColor,
        textColor: themeConfig.countdownBoxTextColor || clockStyleProps.textColor,
      };
    }
    return {
      labelPosition: config.labelPosition || 'bottom',
      numberStyle: config.numberStyle || 'filled',
      backgroundColor: themeConfig.countdownBoxBackgroundColor || '#2563eb',
      textColor: themeConfig.countdownBoxTextColor || '#ffffff',
    };
  };

  const selectedClockConfig = getSelectedClockConfig();
  const selectedLayout = templateLayoutMap[config.selectedTemplate || 'template-1'] || 'title-subtitle-timer-button';

  // Get positioning styles based on placement
  const getPlacementStyles = (): React.CSSProperties => {
    const bannerStyle: React.CSSProperties = {
      width: '100%',
      backgroundColor: themeConfig.backgroundImageUrl
        ? 'transparent'
        : (themeConfig.backgroundColor || '#FFFFFF'),
      backgroundImage: themeConfig.backgroundImageUrl
        ? `url(${themeConfig.backgroundImageUrl})`
        : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'row',
      gap: '16px',
      minHeight: '180px',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px',
      boxSizing: 'border-box',
      position: 'relative',
    };

    switch (config.placement) {
      case 'centered_overlay':
        return {
          ...bannerStyle,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: backgroundMode === 'website' ? 10005 : 10001,
          maxWidth: '900px',
          width: '95%',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        };
      case 'static_top':
        return {
          ...bannerStyle,
          position: backgroundMode === 'website' ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          maxWidth: '100%',
          transform: 'none',
          borderRadius: '0',
          zIndex: backgroundMode === 'website' ? 10005 : undefined,
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
          maxWidth: '100%',
          transform: 'none',
          borderRadius: '0',
          zIndex: backgroundMode === 'website' ? 10005 : 9999,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        };
      case 'floating_bottom':
        return {
          ...bannerStyle,
          position: 'absolute',
          bottom: 0,
          top: 'auto',
          left: 0,
          right: 0,
          width: '100%',
          maxWidth: '100%',
          transform: 'none',
          borderRadius: '0',
          zIndex: backgroundMode === 'website' ? 10005 : 9999,
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
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    };

    if (viewType === 'mobileView') {
      return {
        ...baseStyle,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: backgroundMode === 'clean' ? '#F5F5F5' : 'transparent',
      };
    }

    return {
      ...baseStyle,
      backgroundColor: backgroundMode === 'clean' ? '#F5F5F5' : 'transparent',
    };
  };

  // Get preview wrapper styles for mobile view
  const getPreviewWrapperStyles = (): React.CSSProperties => {
    if (viewType === 'mobileView') {
      return {
        width: '375px',
        height: '667px',
        backgroundColor: backgroundMode === 'website' ? 'transparent' : '#FFFFFF',
        boxShadow: backgroundMode === 'website' ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.15)',
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
      flex: 1,
      minWidth: 0,
    };
  };

  // Don't render banner if overlay is closed
  if (config.placement === 'centered_overlay' && isOverlayClosed) {
    return (
      <div
        style={{
          ...getContainerStyles(),
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={getPreviewWrapperStyles()}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              padding: '20px',
              minHeight: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#6B7280', fontSize: '14px' }}>Overlay closed. Change placement to show preview.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...getContainerStyles(),
        width: '100%',
        minWidth: 0,
        flex: 1,
      }}
    >
      {renderOverlayBackdrop()}
      <div
        style={{
          ...getPreviewWrapperStyles(),
          width: '100%',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            padding: backgroundMode === 'website' ? '0' : (config.placement === 'centered_overlay' ? '0' : '20px'),
            minHeight: '100%',
            overflow: config.placement === 'static_top' || config.placement === 'centered_overlay' ? 'visible' : 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {/* Countdown Timer Preview */}
          <div key={config.placement} style={getPlacementStyles()}>
            {/* Close button for centered overlay - positioned relative to the countdown timer */}
            {config.placement === 'centered_overlay' && !isOverlayClosed && (
              <IconButton
                skin="dark"
                priority="tertiary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOverlayClosed(true);
                }}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  zIndex: 10010,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  minWidth: '32px',
                  width: '32px',
                  height: '32px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                }}
              >
                <Icons.X />
              </IconButton>
            )}
            {/* Background image opacity overlay */}
            {themeConfig.backgroundImageUrl && themeConfig.imageOpacity && themeConfig.imageOpacity < 100 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: themeConfig.imageOpacityColor || '#000000',
                  opacity: (100 - (themeConfig.imageOpacity || 100)) / 100,
                  borderRadius: config.placement === 'centered_overlay' ? '12px' : '0',
                }}
              />
            )}

            <div style={{ position: 'relative', width: '100%', zIndex: 1 }}>
              <CountDownTemplate
                clockConfig={{
                  labelPosition: selectedClockConfig.labelPosition,
                  numberStyle: selectedClockConfig.numberStyle,
                  startDate: config.timerMode === 'start-to-finish-timer' ? getStartDate() : undefined,
                  startTime: config.timerMode === 'start-to-finish-timer' ? getStartTimeString() : undefined,
                  endDate: config.timerMode === 'start-to-finish-timer' ? (endDate || new Date()) : undefined,
                  endTime: config.timerMode === 'start-to-finish-timer' ? getEndTimeString() : undefined,
                  backgroundColor: selectedClockConfig.backgroundColor,
                  textColor: selectedClockConfig.textColor,
                  timerMode: config.timerMode,
                  remainingTimePeriod: config.timerConfig?.remainingTimePeriod,
                  remainingTimePeriodUnit: config.timerConfig?.remainingTimePeriodUnit,
                  countFrom: config.timerConfig?.countPeriodStart ?? config.timerConfig?.countFrom,
                  countTo: config.timerConfig?.countTo,
                  countFrequency: config.timerConfig?.countFrequency,
                  countDirection: config.timerConfig?.countDirection || (config.timerMode === 'number-counter' ? 'ascending' : 'descending'),
                  displayOptions: config.timerConfig?.displayOptions,
                }}
                layout={selectedLayout}
                title={config.title || "Flash Sale"}
                subTitle={config.subtitle || config.message || "Limited Stock"}
                buttonText={config.buttonText || "Shop Now"}
                buttonLink={config.buttonLink || "https://example.com/shop"}
                showButton={config.showButton ?? true}
                scale={1}
                titleColor={themeConfig.titleColor}
                titleOpacity={themeConfig.titleOpacity}
                subtitleColor={themeConfig.subtitleColor}
                subtitleOpacity={themeConfig.subtitleOpacity}
                countdownBoxBackgroundColor={themeConfig.countdownBoxBackgroundColor}
                countdownBoxBackgroundOpacity={themeConfig.countdownBoxBackgroundOpacity}
                countdownBoxTextColor={themeConfig.countdownBoxTextColor}
                countdownBoxTextOpacity={themeConfig.countdownBoxTextOpacity}
                buttonBackgroundColor={themeConfig.buttonBackgroundColor}
                buttonBackgroundOpacity={themeConfig.buttonBackgroundOpacity}
                buttonTextColor={themeConfig.buttonTextColor}
                buttonTextOpacity={themeConfig.buttonTextOpacity}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewArea;

