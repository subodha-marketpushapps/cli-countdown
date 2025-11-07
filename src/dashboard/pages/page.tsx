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
import { PanelTimer, PanelContent, PanelPosition, PanelAppearance } from './SidePanels';
import WidgetEditorHeader from './WidgetEditorHeader';
import PreviewArea from './PreviewArea';
import CountDownTimer from './components/CountDownTimer';

// Component ID from embedded.json
const EMBEDDED_SCRIPT_COMPONENT_ID = '3a1cc044-7e31-4f0c-aefb-1113d572f101';

import { TimerConfig } from './types';

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
    placement: 'static_top',
    title: 'Countdown Timer',
    message: 'Time remaining until the event',
    selectedTemplate: 'template-1',
    selectedClockStyle: '1',
    selectedTheme: 'theme-1',
    labelPosition: 'top',
    numberStyle: 'fillEachDigit',
    backgroundColor: '#2563eb',
    textColor: '#ffffff',
  });

  // Sidebar items
  const sidebarItems = [
    { id: 0, label: "Timer", icon: <Icons.Timer /> },
    { id: 1, label: "Content", icon: <Icons.SiteContent /> },
    { id: 2, label: "Appearance", icon: <Icons.Template /> },
    { id: 3, label: "Position", icon: <Icons.Pin /> },
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

          // Load appearance settings
          if (params.selectedTemplate) {
            loadedConfig.selectedTemplate = params.selectedTemplate as string;
          }
          if (params.selectedClockStyle) {
            loadedConfig.selectedClockStyle = params.selectedClockStyle as string;
          }
          if (params.selectedTheme) {
            loadedConfig.selectedTheme = params.selectedTheme as string;
          }
          if (params.labelPosition && ['top', 'bottom'].includes(params.labelPosition as string)) {
            loadedConfig.labelPosition = params.labelPosition as 'top' | 'bottom';
          }
          if (params.numberStyle && ['fillEachDigit', 'outlineEachDigit', 'filled', 'outline', 'none'].includes(params.numberStyle as string)) {
            loadedConfig.numberStyle = params.numberStyle as 'fillEachDigit' | 'outlineEachDigit' | 'filled' | 'outline' | 'none';
          }
          if (params.backgroundColor) {
            loadedConfig.backgroundColor = params.backgroundColor as string;
          }
          if (params.textColor) {
            loadedConfig.textColor = params.textColor as string;
          }

          // Load placement
          if (params.placement && ['centered_overlay', 'static_top', 'floating_top', 'floating_bottom'].includes(params.placement as string)) {
            loadedConfig.placement = params.placement as 'centered_overlay' | 'static_top' | 'floating_top' | 'floating_bottom';
          }

          // Load title
          if (params.title) {
            loadedConfig.title = params.title as string;
          }

          // Load message
          if (params.message !== undefined) {
            loadedConfig.message = params.message as string;
          }

          // Load content settings
          if (params.subtitle !== undefined) {
            loadedConfig.subtitle = params.subtitle as string;
          }
          if (params.showButton !== undefined) {
            const showButtonValue = params.showButton;
            if (typeof showButtonValue === 'boolean') {
              loadedConfig.showButton = showButtonValue;
            } else if (typeof showButtonValue === 'string') {
              loadedConfig.showButton = showButtonValue === 'true' || showButtonValue.toLowerCase() === 'true';
            }
          }
          if (params.buttonText !== undefined) {
            loadedConfig.buttonText = params.buttonText as string;
          }
          if (params.buttonLink !== undefined) {
            loadedConfig.buttonLink = params.buttonLink as string;
          }
          if (params.makeEntireTimerClickable !== undefined) {
            const makeEntireTimerClickableValue = params.makeEntireTimerClickable;
            if (typeof makeEntireTimerClickableValue === 'boolean') {
              loadedConfig.makeEntireTimerClickable = makeEntireTimerClickableValue;
            } else if (typeof makeEntireTimerClickableValue === 'string') {
              loadedConfig.makeEntireTimerClickable = makeEntireTimerClickableValue === 'true' || makeEntireTimerClickableValue.toLowerCase() === 'true';
            }
          }
          if (params.openInNewTab !== undefined) {
            const openInNewTabValue = params.openInNewTab;
            if (typeof openInNewTabValue === 'boolean') {
              loadedConfig.openInNewTab = openInNewTabValue;
            } else if (typeof openInNewTabValue === 'string') {
              loadedConfig.openInNewTab = openInNewTabValue === 'true' || openInNewTabValue.toLowerCase() === 'true';
            }
          }
          if (params.showCloseButton !== undefined) {
            const showCloseButtonValue = params.showCloseButton;
            if (typeof showCloseButtonValue === 'boolean') {
              loadedConfig.showCloseButton = showCloseButtonValue;
            } else if (typeof showCloseButtonValue === 'string') {
              loadedConfig.showCloseButton = showCloseButtonValue === 'true' || showCloseButtonValue.toLowerCase() === 'true';
            }
          }

          // Load actionConfig if available (handle both object and stringified JSON)
          if (params.actionConfig) {
            let actionConfig: any;
            if (typeof params.actionConfig === 'string') {
              try {
                actionConfig = JSON.parse(params.actionConfig);
              } catch (e) {
                console.warn('Failed to parse actionConfig string:', e);
                actionConfig = null;
              }
            } else if (typeof params.actionConfig === 'object') {
              actionConfig = params.actionConfig;
            }

            if (actionConfig) {
              loadedConfig.actionConfig = {
                action: actionConfig.action,
                message: actionConfig.message,
                showCountries: actionConfig.showCountries,
                showButton: actionConfig.showButton,
                redirectUrl: actionConfig.redirectUrl,
              };
            }
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
        placement: config.placement,
        title: config.title || 'Countdown Timer',
        message: config.message || '',
        subtitle: config.subtitle || '',
        showButton: config.showButton ?? true,
        buttonText: config.buttonText || '',
        buttonLink: config.buttonLink || '',
        makeEntireTimerClickable: config.makeEntireTimerClickable ?? false,
        openInNewTab: config.openInNewTab ?? true,
        showCloseButton: config.showCloseButton ?? true,
        selectedTemplate: config.selectedTemplate || 'template-1',
        selectedClockStyle: config.selectedClockStyle || '1',
        selectedTheme: config.selectedTheme || 'theme-1',
        labelPosition: config.labelPosition || 'bottom',
        numberStyle: config.numberStyle || 'filled',
        backgroundColor: config.backgroundColor || '#f0f0f0',
        textColor: config.textColor || '#000000',
      };

      // Include timerConfig if it exists (stringify it for template rendering)
      if (config.timerConfig) {
        const timerConfigObj = {
          startDate: config.timerConfig.startDate ? config.timerConfig.startDate.toISOString() : undefined,
          endDate: config.timerConfig.endDate ? config.timerConfig.endDate.toISOString() : undefined,
          startTime: config.timerConfig.startTime ? config.timerConfig.startTime.toISOString() : undefined,
          endTime: config.timerConfig.endTime ? config.timerConfig.endTime.toISOString() : undefined,
          timeZone: config.timerConfig.timeZone,
          displayOptions: config.timerConfig.displayOptions,
        };
        // Stringify for template rendering - Wix will render this as a string in the data attribute
        scriptParameters.timerConfig = JSON.stringify(timerConfigObj);
      }

      // Include actionConfig if it exists
      if (config.actionConfig) {
        scriptParameters.actionConfig = JSON.stringify(config.actionConfig);
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
                    <PanelAppearance
                      config={config}
                      onChange={handleConfigChange}
                      onCloseButtonClick={() => setSelectedSidebar(-1)}
                    />
                  )}
                  {selectedSidebar === 3 && (
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

