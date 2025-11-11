import React from "react";
import {
  Box,
  Card,
  Text,
  BarChart,
  StackedBarChart,
  TextButton,
  Layout,
  Cell,
  SkeletonGroup,
  SkeletonLine,
  SkeletonRectangle,
  EmptyState,
} from "@wix/design-system";
import * as Icons from "@wix/wix-ui-icons-common";
import { Stats } from "../../../../interfaces";

interface AnalyticsDashboardProps {
  stats: Stats;
  isLoading?: boolean;
  error?: string | null;
  onRefreshStats?: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  stats,
  isLoading = false,
  error = null,
  onRefreshStats,
}) => {
  // Handle error state
  if (error) {
    return (
      <Card>
        <Card.Header
          title="Daily Activity"
          subtitle="Chats and interactions over the past week"
        />
        <Card.Divider />
        <Card.Content size="medium">
          <Box padding="24px" width="100%" align="center">
            <EmptyState
              title="Oops! Something went wrong"
              subtitle="Looks like there was a technical issue on our end. Wait a few minutes and try again."
            >
              {onRefreshStats && (
                <TextButton
                  prefixIcon={<Icons.Refresh />}
                  onClick={onRefreshStats}
                >
                  Try Again
                </TextButton>
              )}
            </EmptyState>
          </Box>
        </Card.Content>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <Card.Header
          title="Daily Activity"
          subtitle="Chats and interactions over the past week"
        />
        <Card.Divider />
        <Card.Content size="medium">
          <SkeletonGroup>
            <Layout>
              {/* Left side skeleton */}
              <Cell span={8}>
                <Box padding={3} direction="vertical" gap={3}>
                  <SkeletonRectangle height="300px" width="100%" />
                </Box>
              </Cell>

              {/* Right side skeleton */}
              <Cell span={4}>
                <Box direction="vertical" gap={3} padding={3}>
                  {/* Activity by Time skeleton */}
                  <Box direction="vertical" gap={2}>
                    <SkeletonLine width="60%" marginBottom="10px" />
                    <Box direction="vertical" gap={1}>
                      <SkeletonLine marginBottom="5px" />
                      <SkeletonLine marginBottom="5px" />
                      <SkeletonLine marginBottom="5px" />
                    </Box>
                  </Box>

                  <Card.Divider />

                  {/* Device Usage skeleton */}
                  <Box direction="vertical" gap={2}>
                    <SkeletonLine width="50%" marginBottom="10px" />
                    <SkeletonRectangle height="80px" />
                  </Box>
                </Box>
              </Cell>
            </Layout>
          </SkeletonGroup>
        </Card.Content>
      </Card>
    );
  }

  // Transform chartData for StackedBarChart
  const chartData = stats.chartData.map((item) => ({
    label: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    values: [item.chats, item.clicks], // chats and clicks as stacked values
  }));

  return (
    <Card>
      <Card.Header
        title="Daily Activity"
        subtitle="Chats and interactions over the past week"
      />
      <Card.Divider />
      <Card.Content size="medium">
        <Layout>
          {/* Left side (60%) - Main Chart */}
          <Cell span={8}>
            <Box overflow="hidden" padding={3}>
              <StackedBarChart
                data={chartData}
                tooltipTemplate={({ label, values }) => (
                  <Box direction="vertical" gap={1}>
                    <Text size="small" weight="bold" light>
                      {label}
                    </Text>
                    <Text size="small" light>
                      Chats: {values[0]}
                    </Text>
                    <Text size="small" light>
                      Clicks: {values[1]}
                    </Text>
                    <Text size="small" secondary light>
                      Total interactions: {values[0] + values[1]}
                    </Text>
                  </Box>
                )}
                margin={{ top: 20, left: 50, bottom: 40, right: 20 }}
                height={300}
              />
            </Box>
          </Cell>

          {/* Right side (40%) - Activity by Time and Device Usage */}
          <Cell span={4}>
            <Box direction="vertical" gap={3} padding={3}>
              {/* Activity by Time */}
              <Box direction="vertical" gap={2}>
                <Text size="small" weight="bold">
                  Activity by Time
                </Text>
                <Box direction="vertical" gap={1}>
                  <Box align="space-between">
                    <Text size="tiny">Morning</Text>
                    <Text size="tiny" weight="bold">
                      {stats.timeBreakdown.morning}%
                    </Text>
                  </Box>
                  <Box align="space-between">
                    <Text size="tiny">Afternoon</Text>
                    <Text size="tiny" weight="bold">
                      {stats.timeBreakdown.afternoon}%
                    </Text>
                  </Box>
                  <Box align="space-between">
                    <Text size="tiny">Evening</Text>
                    <Text size="tiny" weight="bold">
                      {stats.timeBreakdown.evening}%
                    </Text>
                  </Box>
                </Box>
              </Box>

              <Card.Divider />

              {/* Device Usage */}
              <Box direction="vertical" gap={2}>
                <Text size="small" weight="bold">
                  Device Usage
                </Text>
                <BarChart
                  total={
                    stats.deviceBreakdown.mobile + stats.deviceBreakdown.desktop
                  }
                  items={[
                    {
                      value: stats.deviceBreakdown.mobile,
                      description: "Mobile",
                      descriptionInfo: `${stats.deviceBreakdown.mobile}% of users visiting from mobile devices`,
                    },
                    {
                      value: stats.deviceBreakdown.desktop,
                      description: "Desktop",
                      descriptionInfo: `${stats.deviceBreakdown.desktop}% of users visiting from desktop devices`,
                    },
                  ]}
                />
              </Box>
            </Box>
          </Cell>
        </Layout>
      </Card.Content>
    </Card>
  );
};

export default AnalyticsDashboard;
