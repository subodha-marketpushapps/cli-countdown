import React from "react";

import { Box, Card, Divider, EmptyState, TextButton } from "@wix/design-system";
import * as Icons from "@wix/wix-ui-icons-common";

import StateMiniCard, { StateCardProps } from "./StatsCard/StatsCard";
import StatsRefreshButton from "./StatsRefreshButton";

import classes from "./SectionStatistics.module.scss";
import { Stats } from "../../../../interfaces";
import { formatNumber } from "../../../utils/formatters";

const DEFAULT_STATS: StateCardProps[] = [
  {
    label: `Conversion Rate`,
    value: 0,
    tooltip:
      "Percentage of users who clicked the chat button and opened a chat",
    cardSize: "medium",
  },
  {
    label: "Total Clicks",
    value: 0,
    tooltip: "How many times users clicked on the chat button",
  },
  {
    label: "Total Chats",
    value: 0,
    tooltip: "How many chats were opened in total by the app users",
  },
];

const SectionStatistics: React.FC<{
  stats: Stats | null;
  isLoading: boolean;
  error: string | null;
  onRefreshStats: () => void;
}> = (props) => {
  const { stats, isLoading } = props;

  const { conversionRate, totalClicks, totalChats } = stats || {};

  const formattedConversionRate =
    (conversionRate || 0) > 0 ? `${formatNumber(conversionRate ?? 0)}%` : "-";

  DEFAULT_STATS[0].value = formattedConversionRate ?? 0;
  DEFAULT_STATS[1].value = totalClicks ?? 0;
  DEFAULT_STATS[2].value = totalChats ?? 0;

  const _renderStatsCard = (statsElement: StateCardProps) => (
    <StateMiniCard
      label={statsElement.label}
      tooltip={statsElement.tooltip}
      value={statsElement.value}
      isLoading={isLoading}
      cardSize={statsElement.cardSize}
    />
  );

  const _renderErrorState = () => (
    <Box padding="12px" width="100%" align="center">
      <EmptyState
        title="Oops! Something went wrong"
        subtitle="Looks like there was a technical issue on our end. Wait a few minutes and try again."
        className={classes["empty-state"]}
      >
        <TextButton
          prefixIcon={<Icons.Refresh />}
          onClick={props.onRefreshStats}
        >
          Try Again
        </TextButton>
      </EmptyState>
    </Box>
  );

  return (
    <Box padding={2} width="100%" height="100%">
      {props.error && _renderErrorState()}
      {!props.error && (
        <Box
          direction="vertical"
          gap={3}
          width="100%"
          height="100%"
          verticalAlign="space-between"
        >
          <Box gap={3} direction="vertical">
            <Box
              direction="vertical"
              verticalAlign="space-between"
              flex={1}
              className={classes["highted-context"]}
            >
              {_renderStatsCard(DEFAULT_STATS[0])}
            </Box>

            <div className={classes["card-group"]}>
              {_renderStatsCard(DEFAULT_STATS[1])}
              <Divider skin="light" className={classes["hr-low-light"]} />
              {_renderStatsCard(DEFAULT_STATS[2])}
            </div>
          </Box>
          {!isLoading && <StatsRefreshButton onClick={props.onRefreshStats} />}
        </Box>
      )}
    </Box>
  );
};
export default SectionStatistics;
