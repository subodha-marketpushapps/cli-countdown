import React, { useState, useEffect, useCallback } from 'react';
import { dashboard } from '@wix/dashboard';
import { embeddedScripts } from '@wix/app-management';
import {
  WixDesignSystemProvider,
  Box,
  Layout,
  Cell,
  ComposerSidebar,
  Loader,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import * as Icons from '@wix/wix-ui-icons-common';
import SidePanelContainer from './SidePanels/SidePanelContainer';
import { PanelTimer, PanelContent, PanelPosition, PanelBehavior, PanelAppearance } from './SidePanels';
import WidgetEditorHeader from './WidgetEditorHeader';
import WidgetBuilderBackground from './WidgetBuilderBackground';
import PreviewArea from '../PreviewArea';
import { TimerConfig } from '../types';
import { createDefaultTimerConfig } from '../../../constants';
import { getFirstThemeId, getFirstThemeConfig } from './SidePanels/PanelAppearance/themeUtils';
import { objectToBase64 } from '../../utils/base64-utils';

// Component ID from embedded.json
const EMBEDDED_SCRIPT_COMPONENT_ID = '3a1cc044-7e31-4f0c-aefb-1113d572f101';

const toDate = (value?: Date | string | null): Date | undefined => {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? undefined : value;
  }

  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? undefined : parsed;
};

const combineDateAndTime = (date?: Date | string | null, time?: Date | string | null): Date | undefined => {
  const baseDate = toDate(date);
  if (!baseDate) {
    return undefined;
  }

  if (time) {
    const timeDate = toDate(time);
    if (timeDate) {
      baseDate.setHours(
        timeDate.getHours(),
        timeDate.getMinutes(),
        timeDate.getSeconds(),
        timeDate.getMilliseconds()
      );
      return baseDate;
    }
  }

  // Default to end of day if no time is provided
  baseDate.setHours(23, 59, 59, 0);
  return baseDate;
};

const computeTargetDateISO = (config: TimerConfig): string | undefined => {
  const timerCfg = config.timerConfig;
  if (!timerCfg) {
    return undefined;
  }

  switch (config.timerMode) {
    case 'start-to-finish-timer': {
      const endDate = combineDateAndTime(timerCfg.endDate, timerCfg.endTime);
      return endDate?.toISOString();
    }
    case 'personal-countdown': {
      const amount = timerCfg.remainingTimePeriod ?? 0;
      const unit = timerCfg.remainingTimePeriodUnit ?? 'minutes';
      const unitToMs: Record<'minutes' | 'hours' | 'days', number> = {
        minutes: 60 * 1000,
        hours: 60 * 60 * 1000,
        days: 24 * 60 * 60 * 1000,
      };
      const duration = amount * (unitToMs[unit] || unitToMs.minutes);
      return new Date(Date.now() + duration).toISOString();
    }
    default:
      return undefined;
  }
};

interface WidgetBuilderProps {
  onBackClicked?: () => void;
}

const WidgetBuilder: React.FC<WidgetBuilderProps> = ({ onBackClicked }) => {
  const [selectedSidebar, setSelectedSidebar] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [viewType, setViewType] = useState<'desktopView' | 'mobileView'>('desktopView');
  const [backgroundMode, setBackgroundMode] = useState<'clean' | 'website'>('website');

  const [config, setConfig] = useState<TimerConfig>(createDefaultTimerConfig());

  // Sidebar items
  const sidebarItems = [
    { id: 0, label: "Timer", icon: <Icons.Timer /> },
    { id: 1, label: "Content", icon: <Icons.SiteContent /> },
    { id: 2, label: "Appearance", icon: <Icons.Template /> },
    { id: 3, label: "Behavior", icon: <Icons.Rule /> },
    { id: 4, label: "Position", icon: <Icons.Pin /> },
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
          if (params.timerConfig) {
            let timerConfigData: any = null;
            if (typeof params.timerConfig === 'string') {
              try {
                timerConfigData = JSON.parse(params.timerConfig);
              } catch (error) {
                console.warn('Failed to parse timerConfig string:', error);
              }
            } else if (typeof params.timerConfig === 'object') {
              timerConfigData = params.timerConfig;
            }

            if (timerConfigData) {
              loadedConfig.timerConfig = {
                startDate: timerConfigData.startDate ? new Date(timerConfigData.startDate) : undefined,
                endDate: timerConfigData.endDate ? new Date(timerConfigData.endDate) : undefined,
                startTime: timerConfigData.startTime ? new Date(timerConfigData.startTime) : (() => {
                  const date = new Date();
                  date.setHours(0, 0, 0, 0);
                  return date;
                })(),
                endTime: timerConfigData.endTime ? new Date(timerConfigData.endTime) : (() => {
                  const date = new Date();
                  date.setHours(23, 59, 59, 0);
                  return date;
                })(),
                timeZone: timerConfigData.timeZone || 'UTC',
                displayOptions: timerConfigData.displayOptions || {
                  showDays: true,
                  showHours: true,
                  showMinutes: true,
                  showSeconds: true,
                },
              };
            }
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
          if (params.mobileLayout && ['vertical', 'horizontal'].includes(params.mobileLayout as string)) {
            loadedConfig.mobileLayout = params.mobileLayout as 'vertical' | 'horizontal';
          }
          if (params.selectedClockStyle) {
            loadedConfig.selectedClockStyle = params.selectedClockStyle as string;
          }
          if (params.selectedTheme) {
            loadedConfig.selectedTheme = params.selectedTheme as string;
          } else {
            // Apply first theme if no theme is selected
            loadedConfig.selectedTheme = getFirstThemeId();
            loadedConfig.themeConfig = getFirstThemeConfig();
          }

          // Apply first theme config if theme is selected but themeConfig is missing
          if (loadedConfig.selectedTheme && !loadedConfig.themeConfig) {
            // If the selected theme is the first theme, apply its config
            if (loadedConfig.selectedTheme === getFirstThemeId()) {
              loadedConfig.themeConfig = getFirstThemeConfig();
            }
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

          // Load behaviorConfig if available (handle both object and stringified JSON)
          if (params.behaviorConfig) {
            let behaviorConfig: any;
            if (typeof params.behaviorConfig === 'string') {
              try {
                behaviorConfig = JSON.parse(params.behaviorConfig);
              } catch (e) {
                console.warn('Failed to parse behaviorConfig string:', e);
                behaviorConfig = null;
              }
            } else if (typeof params.behaviorConfig === 'object') {
              behaviorConfig = params.behaviorConfig;
            }

            if (behaviorConfig) {
              loadedConfig.behaviorConfig = behaviorConfig;
            }
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

          // Load themeConfig if available (handle both object and stringified JSON)
          if (params.themeConfig) {
            let themeConfig: any;
            if (typeof params.themeConfig === 'string') {
              try {
                themeConfig = JSON.parse(params.themeConfig);
              } catch (e) {
                console.warn('Failed to parse themeConfig string:', e);
                themeConfig = null;
              }
            } else if (typeof params.themeConfig === 'object') {
              themeConfig = params.themeConfig;
            }

            if (themeConfig) {
              loadedConfig.themeConfig = themeConfig;
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
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
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
        mobileLayout: config.mobileLayout || 'vertical',
        selectedClockStyle: config.selectedClockStyle || '1',
        selectedTheme: config.selectedTheme || getFirstThemeId(),
        labelPosition: config.labelPosition || 'bottom',
        numberStyle: config.numberStyle || 'filled',
        backgroundColor: config.backgroundColor || '#f0f0f0',
        textColor: config.textColor || '#000000',
      };

      const targetDateISO = computeTargetDateISO(config);
      if (targetDateISO) {
        scriptParameters.targetDate = targetDateISO;
      }

      // Include timerConfig if it exists (stringify it for template rendering)
      if (config.timerConfig) {
        const startDate = toDate(config.timerConfig.startDate);
        const endDate = toDate(config.timerConfig.endDate);
        const startTime = toDate(config.timerConfig.startTime);
        const endTime = toDate(config.timerConfig.endTime);

        const timerConfigObj = {
          startDate: startDate ? startDate.toISOString() : undefined,
          endDate: endDate ? endDate.toISOString() : undefined,
          startTime: startTime ? startTime.toISOString() : undefined,
          endTime: endTime ? endTime.toISOString() : undefined,
          timeZone: config.timerConfig.timeZone,
          displayOptions: config.timerConfig.displayOptions,
        };
        // Stringify for template rendering - Wix will render this as a string in the data attribute
        scriptParameters.timerConfig = timerConfigObj;
      }

      // Include themeConfig if it exists
      if (config.themeConfig) {
        scriptParameters.themeConfig = config.themeConfig;
      }

      // Include actionConfig if it exists
      if (config.actionConfig) {
        scriptParameters.actionConfig = config.actionConfig;
      }

      if (config.behaviorConfig) {
        scriptParameters.behaviorConfig = config.behaviorConfig;
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

      console.log('scriptParameters', objectToBase64(scriptParameters));
      // Embed or update the script

      const scriptParameters = {
        widgetState: objectToBase64(scriptParameters),
        draftWidgetState: objectToBase64(scriptParameters),
        timestamp: (new Date()).getTime().toString(),
        version: '1.0.0',
        lastModified: (new Date()).getTime().toString(),
        hasUnsavedChanges: "false"
      }
      await embeddedScripts.embedScript(
        {
          // parameters: scriptParameters,
          // disabled: false,
          parameters: scriptParameters
        },
        // {
        //   componentId: EMBEDDED_SCRIPT_COMPONENT_ID,
        // }
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
            onBackClicked={onBackClicked}
            onSave={handleSave}
            onPublish={handlePublish}
            onPreview={handlePreview}
            isSaving={isSaving}
            isPublishing={isPublishing}
            isDataLoaded={!isLoading}
            viewType={viewType}
            backgroundMode={backgroundMode}
            onViewTypeChange={setViewType}
            onBackgroundModeChange={setBackgroundMode}
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
                      currentViewType={viewType}
                      onViewModeChange={setViewType}
                    />
                  )}
                  {selectedSidebar === 3 && (
                    <PanelBehavior
                      config={config}
                      onChange={handleConfigChange}
                      onCloseButtonClick={() => setSelectedSidebar(-1)}
                    />
                  )}
                  {selectedSidebar === 4 && (
                    <PanelPosition
                      config={config}
                      onChange={handleConfigChange}
                      onCloseButtonClick={() => setSelectedSidebar(-1)}
                    />
                  )}
                </div>
              </SidePanelContainer>

              {/* Preview Area */}
              <Box
                flex="1"
                style={{
                  marginLeft: selectedSidebar !== -1 ? '16px' : '0',
                  transition: 'margin-left 0.2s ease',
                }}
                margin="16px"
              >
                <WidgetBuilderBackground
                  backgroundMode={backgroundMode}
                  viewType={viewType}
                >
                  <Box
                    flex="1"
                    style={{
                      width: '100%',
                      height: '100%',
                      minWidth: 0,
                      position: 'relative',
                      padding: backgroundMode === 'website' ? '0' : '16px',
                    }}
                  >
                    <PreviewArea
                      config={config}
                      endDate={config.timerConfig?.endDate}
                      endTime={config.timerConfig?.endTime}
                      viewType={viewType}
                      backgroundMode={backgroundMode}
                    />
                  </Box>
                </WidgetBuilderBackground>
              </Box>
            </Box>
          )}
        </Cell>
      </Layout>
    </WixDesignSystemProvider>
  );
};

export default WidgetBuilder;

