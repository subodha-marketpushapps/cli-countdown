import React from "react";
import {
  Box,
  Card,
  Text,
  Badge,
  SkeletonGroup,
  SkeletonLine,
  SkeletonCircle,
  EmptyState,
  TextButton,
} from "@wix/design-system";
import * as Icons from "@wix/wix-ui-icons-common";
import { Stats } from "../../../../interfaces";

interface TopAgentsSectionProps {
  stats: Stats;
  isLoading?: boolean;
  error?: string | null;
  onRefreshStats?: () => void;
}

const TopAgentsSection: React.FC<TopAgentsSectionProps> = ({
  stats,
  isLoading = false,
  error = null,
  onRefreshStats,
}) => {
  const AgentCard: React.FC<{
    agent: { name: string; chats: number; rating: number };
    rank: number;
  }> = ({ agent, rank }) => (
    <Box align="space-between" verticalAlign="middle" padding={2}>
      <Box gap={2} verticalAlign="middle">
        <Badge size="small" skin="standard">
          {rank}
        </Badge>
        <Box direction="vertical" gap={0}>
          <Text size="small" weight="bold">
            {agent.name}
          </Text>
          <Text size="tiny" secondary>
            {agent.chats} chats
          </Text>
        </Box>
      </Box>
      <Box gap={1} verticalAlign="middle">
        <Icons.Star />
        <Text size="small">{agent.rating}</Text>
      </Box>
    </Box>
  );

  // Handle error state
  if (error) {
    return (
      <Card>
        <Card.Header
          title="Top Performing Agents"
          subtitle="Based on chat volume and ratings"
        />
        <Card.Divider />
        <Card.Content>
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
          title="Top Performing Agents"
          subtitle="Based on chat volume and ratings"
        />
        <Card.Divider />
        <Card.Content>
          <SkeletonGroup skin="light">
            <Box direction="vertical">
              {/* Generate skeleton for 3 agent cards */}
              {[1, 2, 3].map((index) => (
                <React.Fragment key={index}>
                  <Box align="space-between" verticalAlign="middle" padding={2}>
                    <Box gap={2} verticalAlign="middle">
                      <SkeletonCircle diameter="24px" />
                      <Box direction="vertical" gap={1}>
                        <SkeletonLine width="80px" marginBottom="3px" />
                        <SkeletonLine width="60px" />
                      </Box>
                    </Box>
                    <Box gap={1} verticalAlign="middle">
                      <SkeletonCircle diameter="16px" />
                      <SkeletonLine width="30px" />
                    </Box>
                  </Box>
                  {index < 3 && <Card.Divider />}
                </React.Fragment>
              ))}
            </Box>
          </SkeletonGroup>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header
        title="Top Performing Agents"
        subtitle="Based on chat volume and ratings"
      />
      <Card.Divider />
      <Card.Content>
        <Box direction="vertical">
          {stats.topAgents.map((agent, index) => (
            <React.Fragment key={agent.name}>
              <AgentCard agent={agent} rank={index + 1} />
              {index < stats.topAgents.length - 1 && <Card.Divider />}
            </React.Fragment>
          ))}
        </Box>
      </Card.Content>
    </Card>
  );
};

export default TopAgentsSection;
