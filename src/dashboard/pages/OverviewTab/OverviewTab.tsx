import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Text,
  Layout,
  Cell,
  Card,
  ToggleSwitch,
  Loader,
  Page,
  Heading,
} from "@wix/design-system";
import * as Icons from "@wix/wix-ui-icons-common";
import { useRecoilValue, useRecoilState } from "recoil";
import { useEmbeds } from "../../hooks/wix-embeds";
import { base64ToObject, objectToBase64 } from "../../utils/base64-utils";
import { publishedWidgetState, statisticsState, wixSiteDataState } from "../../services/state";
import { TimerConfig } from "../types";
import { createDefaultTimerConfig } from "../../../constants";
import PreviewArea from "../PreviewArea";
import MarketingSection from "./MarketingSection";
import { useStatusToast } from "../../services/providers/StatusToastProvider";
import StateMiniCard, { StateCardProps } from "./SectionStatistics/StatsCard/StatsCard";

interface OverviewTabProps {
  onEditWidget: () => Promise<void>;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onEditWidget }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoadingWidget, setIsLoadingWidget] = useState(true);
  const [config, setConfig] = useState<TimerConfig>(createDefaultTimerConfig());
  const [isVisible, setIsVisible] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [timePeriod, setTimePeriod] = useState<string>("All days");
  
  const { getEmbeddedScript, embedScript } = useEmbeds<{
    widgetState?: string;
    draftWidgetState?: string;
  }>();
  const [publishedState, setPublishedState] = useRecoilState(publishedWidgetState);
  const stats = useRecoilValue(statisticsState);
  const wixSiteData = useRecoilValue(wixSiteDataState);
  const { addToast, clearToasts } = useStatusToast();

  // Load widget state from embedded script
  useEffect(() => {
    const loadWidgetState = async () => {
      try {
        setIsLoadingWidget(true);
        const embeddedParams = getEmbeddedScript.data;
        
        if (embeddedParams?.widgetState) {
          try {
            const widgetStateObj = base64ToObject(embeddedParams.widgetState);
            // Convert widget state to TimerConfig
            if (widgetStateObj) {
              // If it's already a TimerConfig, use it directly
              if (widgetStateObj.timerMode) {
                setConfig(widgetStateObj as TimerConfig);
                setIsVisible(widgetStateObj.isVisible ?? false);
              } else {
                // Otherwise, it might be in the old format
                setConfig(createDefaultTimerConfig());
                setIsVisible(widgetStateObj.isVisible ?? false);
              }
              setPublishedState({
                styles: widgetStateObj.styles || {},
                content: widgetStateObj.content || {},
                isVisible: widgetStateObj.isVisible ?? false,
                visibilityData: widgetStateObj.visibilityData || {},
              });
            }
          } catch (error) {
            console.error("Failed to parse widget state:", error);
            // Use default config if parsing fails
            setConfig(createDefaultTimerConfig());
          }
        } else {
          // No widget state found, use default
          setConfig(createDefaultTimerConfig());
        }
      } catch (error) {
        console.error("Failed to load widget state:", error);
      } finally {
        setIsLoadingWidget(false);
      }
    };

    if (getEmbeddedScript.data || getEmbeddedScript.isError) {
      loadWidgetState();
    }
  }, [getEmbeddedScript.data, getEmbeddedScript.isError, setPublishedState]);

  // Handle edit widget navigation
  const handleEditWidget = useCallback(async () => {
    setIsNavigating(true);
    try {
      await onEditWidget();
    } catch (error) {
      console.error("Navigation error:", error);
      addToast({
        content: "Failed to navigate to widget builder. Please try again.",
        status: "error",
      });
    } finally {
      setIsNavigating(false);
    }
  }, [onEditWidget, addToast]);

  // Handle visibility toggle
  const handleVisibilityToggle = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    try {
      setIsVisible(checked);
      // Update published state
      setPublishedState((prev) => ({
        ...prev,
        isVisible: checked,
      }));

      // Save to embedded script
      const widgetStateObj = {
        ...config,
        isVisible: checked,
      };

      await embedScript.mutateAsync({
        widgetState: objectToBase64(widgetStateObj),
        draftWidgetState: objectToBase64(widgetStateObj),
      } as any);

      addToast({
        content: checked
          ? "Countdown timer is now visible on your site"
          : "Countdown timer is now hidden from your site",
        status: "success",
      });
    } catch (error) {
      console.error("Failed to update visibility:", error);
      setIsVisible(!checked); // Revert on error
      addToast({
        content: "Failed to update visibility. Please try again.",
        status: "error",
      });
    }
  }, [config, embedScript, setPublishedState, addToast]);

  // Handle refresh stats
  const handleRefreshStats = useCallback(() => {
    setLastRefreshTime(new Date());
    // In a real implementation, you would refetch statistics here
    addToast({
      content: "Statistics refreshed",
      status: "success",
    });
  }, [addToast]);

  // Calculate end date and time for preview
  const getEndDate = (): Date | undefined => {
    if (config.timerConfig?.endDate) {
      return new Date(config.timerConfig.endDate);
    }
    return undefined;
  };

  const getEndTime = (): Date | undefined => {
    if (config.timerConfig?.endTime) {
      return new Date(config.timerConfig.endTime);
    }
    return undefined;
  };

  // Format last refresh time
  const formatLastRefresh = () => {
    const secondsAgo = Math.floor((new Date().getTime() - lastRefreshTime.getTime()) / 1000);
    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
    }
    const minutesAgo = Math.floor(secondsAgo / 60);
    return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
  };

  // Countdown timer specific stats
  const countdownStats: StateCardProps[] = [
    {
      label: "Countdown Reach Rate",
      value: "20.5%",
      tooltip: "Percentage of visitors who saw the countdown timer",
      cardSize: "medium",
    },
    {
      label: "Store Impressions",
      value: 1547,
      tooltip: "Total number of page views on your store",
    },
    {
      label: "Countdown timer bar Shown",
      value: 147,
      tooltip: "Number of times the countdown timer was displayed",
    },
  ];

  return (
    <Page>
      <Page.Header
        title="Countdown Timer Bar"
        subtitle="Drive urgency and boost sales with real-time countdown promotions."
      />
      <Box padding={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          prefixIcon={<Icons.Edit />}
          onClick={handleEditWidget}
          disabled={isNavigating || isLoadingWidget}
        >
          Edit Widget
        </Button>
      </Box>

      <Page.Content>
        <Layout>
          {/* Statistics Section */}
          <Cell span={4}>
            <Card>
              <Card.Header
                title="Statistics"
                subtitle="Real-time performance overview"
                suffix={
                  <Box align="center" gap={1}>
                    <Text size="tiny" secondary>
                      Time Period:
                    </Text>
                    <Text size="tiny" weight="bold">
                      {timePeriod}
                    </Text>
                  </Box>
                }
              />
              <Card.Divider />
              <Card.Content>
                <Box padding={2} width="100%" height="100%">
                  <Box direction="vertical" gap={3} width="100%" height="100%">
                    <Box direction="vertical" gap={3}>
                      <Box direction="vertical" verticalAlign="space-between" flex={1}>
                        <StateMiniCard
                          label={countdownStats[0].label}
                          tooltip={countdownStats[0].tooltip}
                          value={countdownStats[0].value}
                          isLoading={false}
                          cardSize={countdownStats[0].cardSize}
                        />
                      </Box>
                      <Box direction="horizontal" gap={2} align="space-between">
                        <StateMiniCard
                          label={countdownStats[1].label}
                          tooltip={countdownStats[1].tooltip}
                          value={countdownStats[1].value}
                          isLoading={false}
                        />
                        <StateMiniCard
                          label={countdownStats[2].label}
                          tooltip={countdownStats[2].tooltip}
                          value={countdownStats[2].value}
                          isLoading={false}
                        />
                      </Box>
                    </Box>
                    <Box marginTop={2} align="center" gap={1}>
                      <Text size="tiny" secondary>
                        Updated {formatLastRefresh()}
                      </Text>
                      <Text
                        size="tiny"
                        weight="normal"
                        skin="premium"
                        style={{ cursor: "pointer" }}
                        onClick={handleRefreshStats}
                      >
                        Refresh
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Card.Content>
            </Card>
          </Cell>

          {/* Widget Preview Section */}
          <Cell span={8}>
            <Card>
              <Card.Header
                title="Widget Preview"
                suffix={
                  <Box align="center" gap={2}>
                    <Text size="small">Set widget visibility on your Site</Text>
                    <ToggleSwitch
                      checked={isVisible}
                      onChange={handleVisibilityToggle}
                    />
                  </Box>
                }
              />
              <Card.Divider />
              <Card.Content>
                {isLoadingWidget ? (
                  <Box
                    align="center"
                    verticalAlign="middle"
                    height="400px"
                    direction="vertical"
                    gap={2}
                  >
                    <Loader size="medium" />
                    <Text>Loading widget preview...</Text>
                  </Box>
                ) : (
                  <Box
                    borderRadius={8}
                    padding={2}
                    backgroundColor="D80"
                    minHeight="400px"
                    position="relative"
                  >
                    <PreviewArea
                      config={config}
                      endDate={getEndDate()}
                      endTime={getEndTime()}
                      viewType="desktopView"
                      backgroundMode="clean"
                    />
                    <Box
                      position="absolute"
                      bottom={16}
                      right={16}
                    >
                      <Button
                        size="small"
                        prefixIcon={<Icons.Edit />}
                        onClick={handleEditWidget}
                        disabled={isNavigating}
                      >
                        Edit Widget
                      </Button>
                    </Box>
                  </Box>
                )}
              </Card.Content>
            </Card>
          </Cell>

          {/* Marketing Section */}
          <Cell span={12}>
            <Box marginTop={4}>
              <Heading size="medium" marginBottom={3}>
                Discover More Tools by MarketPushApps
              </Heading>
              <MarketingSection />
            </Box>
          </Cell>
        </Layout>
      </Page.Content>
    </Page>
  );
};

export default OverviewTab;

