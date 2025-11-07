import React, { type FC, useState, useEffect, useCallback } from 'react';
import { dashboard } from '@wix/dashboard';
import { embeddedScripts } from '@wix/app-management';
import {
  WixDesignSystemProvider,
  Card,
  Box,
  Layout,
  Cell,
  Text,
  ComposerSidebar,
  Loader,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import * as Icons from '@wix/wix-ui-icons-common';
import SidePanelContainer from './SidePanels/SidePanelContainer';
import { PanelTimer, PanelContent, PanelPosition } from './SidePanels';
import WidgetEditorHeader from './WidgetEditorHeader';
import PreviewArea from './PreviewArea';

// Component ID from embedded.json
const EMBEDDED_SCRIPT_COMPONENT_ID = '3a1cc044-7e31-4f0c-aefb-1113d572f101';

import { TimerConfig } from './types';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountDownTimer: FC<{
  endDate: Date | undefined;
  endTime: Date | undefined;
  format: 'full' | 'compact' | 'minimal';
  showLabels: boolean;
  size: 'small' | 'medium' | 'large';
}> = ({ endDate, endTime, format, showLabels, size }) => {
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

  const textSize: 'tiny' | 'small' | 'medium' = size === 'large' ? 'medium' : size === 'medium' ? 'medium' : 'small';
  const numberSize: 'tiny' | 'small' | 'medium' = size === 'large' ? 'medium' : size === 'medium' ? 'medium' : 'small';

  if (format === 'minimal') {
    return (
      <Box align="center" verticalAlign="middle" padding="SP6">
        <Text weight="bold" size={numberSize}>
          {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
        </Text>
      </Box>
    );
  }

  if (format === 'compact') {
    return (
      <Box align="center" verticalAlign="middle" padding="SP6" gap="SP2">
        <Box direction="horizontal" gap="SP4" align="center">
          <Box align="center">
            <Text weight="bold" size={numberSize}>
              {String(timeRemaining.days).padStart(2, '0')}
            </Text>
            {showLabels && <Text size={textSize} secondary>Days</Text>}
          </Box>
          <Text size={numberSize}>:</Text>
          <Box align="center">
            <Text weight="bold" size={numberSize}>
              {String(timeRemaining.hours).padStart(2, '0')}
            </Text>
            {showLabels && <Text size={textSize} secondary>Hours</Text>}
          </Box>
          <Text size={numberSize}>:</Text>
          <Box align="center">
            <Text weight="bold" size={numberSize}>
              {String(timeRemaining.minutes).padStart(2, '0')}
            </Text>
            {showLabels && <Text size={textSize} secondary>Minutes</Text>}
          </Box>
          <Text size={numberSize}>:</Text>
          <Box align="center">
            <Text weight="bold" size={numberSize}>
              {String(timeRemaining.seconds).padStart(2, '0')}
            </Text>
            {showLabels && <Text size={textSize} secondary>Seconds</Text>}
          </Box>
        </Box>
      </Box>
    );
  }

  // Full format
  return (
    <Box align="center" verticalAlign="middle" padding="SP6" gap="SP4">
      <Layout cols={4} gap="SP3">
        <Cell>
          <Box align="center" padding="SP4" backgroundColor="D80" borderRadius="4px">
            <Text weight="bold" size={numberSize}>
              {String(timeRemaining.days).padStart(2, '0')}
            </Text>
            {showLabels && (
              <Text size={textSize} secondary weight="normal" marginTop="SP1">
                Days
              </Text>
            )}
          </Box>
        </Cell>
        <Cell>
          <Box align="center" padding="SP4" backgroundColor="D80" borderRadius="4px">
            <Text weight="bold" size={numberSize}>
              {String(timeRemaining.hours).padStart(2, '0')}
            </Text>
            {showLabels && (
              <Text size={textSize} secondary weight="normal" marginTop="SP1">
                Hours
              </Text>
            )}
          </Box>
        </Cell>
        <Cell>
          <Box align="center" padding="SP4" backgroundColor="D80" borderRadius="4px">
            <Text weight="bold" size={numberSize}>
              {String(timeRemaining.minutes).padStart(2, '0')}
            </Text>
            {showLabels && (
              <Text size={textSize} secondary weight="normal" marginTop="SP1">
                Minutes
              </Text>
            )}
          </Box>
        </Cell>
        <Cell>
          <Box align="center" padding="SP4" backgroundColor="D80" borderRadius="4px">
            <Text weight="bold" size={numberSize}>
              {String(timeRemaining.seconds).padStart(2, '0')}
            </Text>
            {showLabels && (
              <Text size={textSize} secondary weight="normal" marginTop="SP1">
                Seconds
              </Text>
            )}
          </Box>
        </Cell>
      </Layout>
    </Box>
  );
};

const Index: FC = () => {
  const [selectedSidebar, setSelectedSidebar] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [config, setConfig] = useState<TimerConfig>({
    timerMode: 'start-to-finish-timer',
    timerConfig: {
      startDate: new Date(),
      startTime: (() => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      })(),
      endDate: (() => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
      })(),
      endTime: (() => {
        const date = new Date();
        date.setHours(23, 59, 59, 0);
        return date;
      })(),
      timeZone: 'UTC',
      displayOptions: {
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
      },
    },
    format: 'full',
    showLabels: true,
    size: 'medium',
    placement: 'top',
    title: 'Countdown Timer',
    message: 'Time remaining until the event',
  });

  // Sidebar items
  const sidebarItems = [
    { id: 0, label: "Timer", icon: <Icons.Timer /> },
    { id: 1, label: "Content", icon: <Icons.SiteContent /> },
    { id: 2, label: "Position", icon: <Icons.Pin /> },
  ];

  const handleConfigChange = useCallback((newConfig: TimerConfig) => {
    setConfig(newConfig);
  }, []);

  // Load saved settings when component mounts
  useEffect(() => {
    const loadSavedSettings = async () => {
      try {
        const existingScript = await embeddedScripts.getEmbeddedScript({
          componentId: EMBEDDED_SCRIPT_COMPONENT_ID,
        });

        if (existingScript && existingScript.parameters) {
          const params = existingScript.parameters;

          // Load all settings into config
          const loadedConfig: TimerConfig = { ...config };

          // Load timer mode
          if (params.timerMode && ['start-to-finish-timer', 'personal-countdown', 'number-counter'].includes(params.timerMode as string)) {
            loadedConfig.timerMode = params.timerMode as 'start-to-finish-timer' | 'personal-countdown' | 'number-counter';
          }

          // Load timer config if available
          if (params.timerConfig && typeof params.timerConfig === 'object') {
            const timerConfig = params.timerConfig as any;
            loadedConfig.timerConfig = {
              startDate: timerConfig.startDate ? new Date(timerConfig.startDate) : undefined,
              endDate: timerConfig.endDate ? new Date(timerConfig.endDate) : undefined,
              startTime: timerConfig.startTime ? new Date(timerConfig.startTime) : (() => {
                const date = new Date();
                date.setHours(0, 0, 0, 0);
                return date;
              })(),
              endTime: timerConfig.endTime ? new Date(timerConfig.endTime) : (() => {
                const date = new Date();
                date.setHours(23, 59, 59, 0);
                return date;
              })(),
              timeZone: timerConfig.timeZone || 'UTC',
              displayOptions: timerConfig.displayOptions || {
                showDays: true,
                showHours: true,
                showMinutes: true,
                showSeconds: true,
              },
            };
          }

          // Legacy support: if targetDate exists but no timerConfig.endDate, use targetDate as endDate
          if (params.targetDate && !loadedConfig.timerConfig?.endDate) {
            const targetDate = new Date(params.targetDate as string);
            if (!isNaN(targetDate.getTime())) {
              if (!loadedConfig.timerConfig) {
                loadedConfig.timerConfig = {};
              }
              loadedConfig.timerConfig.endDate = targetDate;
              if (!loadedConfig.timerConfig.endTime) {
                const endTime = new Date();
                endTime.setHours(23, 59, 59, 0);
                loadedConfig.timerConfig.endTime = endTime;
              }
            }
          }

          // Load format
          if (params.format && ['full', 'compact', 'minimal'].includes(params.format as string)) {
            loadedConfig.format = params.format as 'full' | 'compact' | 'minimal';
          }

          // Load show labels
          if (params.showLabels !== undefined) {
            const showLabelsValue = params.showLabels;
            if (typeof showLabelsValue === 'boolean') {
              loadedConfig.showLabels = showLabelsValue;
            } else if (typeof showLabelsValue === 'string') {
              loadedConfig.showLabels = showLabelsValue === 'true' || showLabelsValue.toLowerCase() === 'true';
            }
          }

          // Load size
          if (params.size && ['small', 'medium', 'large'].includes(params.size as string)) {
            loadedConfig.size = params.size as 'small' | 'medium' | 'large';
          }

          // Load placement
          if (params.placement && ['top', 'center', 'bottom'].includes(params.placement as string)) {
            loadedConfig.placement = params.placement as 'top' | 'center' | 'bottom';
          }

          // Load title
          if (params.title) {
            loadedConfig.title = params.title as string;
          }

          // Load message
          if (params.message !== undefined) {
            loadedConfig.message = params.message as string;
          }

          setConfig(loadedConfig);
        }
      } catch (error: any) {
        // Script not found or error loading - use defaults
        // This is expected if the script hasn't been embedded yet
        console.log('No saved settings found or error loading settings:', error);
      }
    };

    loadSavedSettings();
  }, []);

  const handleSave = useCallback(async () => {
    try {
      if (!config.timerConfig?.endDate) {
        dashboard.showToast({
          message: 'Please select an end date',
          type: 'error',
        });
        return;
      }

      setIsSaving(true);
      const scriptParameters: any = {
        timerMode: config.timerMode,
        format: config.format,
        showLabels: config.showLabels.toString(),
        size: config.size,
        placement: config.placement,
        title: config.title || 'Countdown Timer',
        message: config.message || '',
      };

      // Include timerConfig if it exists
      if (config.timerConfig) {
        scriptParameters.timerConfig = {
          startDate: config.timerConfig.startDate ? config.timerConfig.startDate.toISOString() : undefined,
          endDate: config.timerConfig.endDate ? config.timerConfig.endDate.toISOString() : undefined,
          startTime: config.timerConfig.startTime ? config.timerConfig.startTime.toISOString() : undefined,
          endTime: config.timerConfig.endTime ? config.timerConfig.endTime.toISOString() : undefined,
          timeZone: config.timerConfig.timeZone,
          displayOptions: config.timerConfig.displayOptions,
        };
      }

      // Check if script is already embedded
      let isAlreadyEmbedded = false;
      try {
        const existingScript = await embeddedScripts.getEmbeddedScript({
          componentId: EMBEDDED_SCRIPT_COMPONENT_ID,
        });
        isAlreadyEmbedded = !!existingScript;
      } catch (getError: any) {
        console.log('Script not found or error checking existing script, will embed:', getError);
        isAlreadyEmbedded = false;
      }

      // Embed or update the script
      await embeddedScripts.embedScript(
        {
          parameters: scriptParameters,
          disabled: false,
        },
        {
          componentId: EMBEDDED_SCRIPT_COMPONENT_ID,
        }
      );

      dashboard.showToast({
        message: isAlreadyEmbedded
          ? 'Countdown timer widget settings have been updated on your site!'
          : 'Countdown timer widget has been embedded on your site!',
        type: 'success',
      });
    } catch (error: any) {
      console.error('Error embedding script:', error);

      let errorMessage = 'Failed to embed countdown timer.';

      if (error?.status === 403 || error?.statusCode === 403 || error?.response?.status === 403) {
        errorMessage = 'Permission denied (403). The app needs APPS.MANAGE_EMBEDDED_SCRIPT permission.';
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }

      dashboard.showToast({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }, [config]);

  const handlePublish = useCallback(async () => {
    // For now, publish is the same as save
    await handleSave();
  }, [handleSave]);

  const handlePreview = useCallback(() => {
    // Open preview in new window or show preview modal
    dashboard.showToast({
      message: 'Preview functionality - open your site to see the countdown timer',
      type: 'standard',
    });
  }, []);

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Layout gap={0}>
        <Cell>
          <WidgetEditorHeader
            onSave={handleSave}
            onPublish={handlePublish}
            onPreview={handlePreview}
            isSaving={isSaving}
            isPublishing={isPublishing}
            isDataLoaded={!isLoading}
          />
        </Cell>
        <Cell>
          {isLoading ? (
            <Box
              align="center"
              verticalAlign="middle"
              height="calc(100dvh - 100px)"
              width="100vw"
            >
              <Loader text="Loading settings..." size="large" />
            </Box>
          ) : (
            <Box gap="0" height="calc(100dvh - 66px)" direction="horizontal">
              <ComposerSidebar
                labelPlacement="bottom"
                items={sidebarItems}
                selectedId={selectedSidebar}
                // @ts-ignore
                onClick={(_, data) => setSelectedSidebar(Number(data.id))}
                zIndex={100000000}
              />
              <SidePanelContainer isShowing={selectedSidebar !== -1}>
                <div style={{ backgroundColor: "#FFFFFF", border: "2px solid #fff" }}>
                  {selectedSidebar === 0 && (
                    <PanelTimer
                      config={config}
                      onChange={handleConfigChange}
                      onCloseButtonClick={() => setSelectedSidebar(-1)}
                    />
                  )}
                  {selectedSidebar === 1 && (
                    <PanelContent
                      config={config}
                      onChange={handleConfigChange}
                      onCloseButtonClick={() => setSelectedSidebar(-1)}
                    />
                  )}
                  {selectedSidebar === 2 && (
                    <PanelPosition
                      config={config}
                      onChange={handleConfigChange}
                      onCloseButtonClick={() => setSelectedSidebar(-1)}
                    />
                  )}
                </div>
              </SidePanelContainer>

              {/* Preview Area */}
              <div style={{ width: '100%', height: '100%', margin: '16px' }}>
                <PreviewArea
                  config={config}
                  CountDownTimer={CountDownTimer}
                  endDate={config.timerConfig?.endDate}
                  endTime={config.timerConfig?.endTime}
                />
              </div>

            </Box>
          )}
        </Cell>
      </Layout>
    </WixDesignSystemProvider>
  );
};

export default Index;

