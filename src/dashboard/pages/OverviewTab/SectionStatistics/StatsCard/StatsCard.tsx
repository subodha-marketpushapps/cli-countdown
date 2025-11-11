import {
  Box,
  Text,
  InfoIcon,
  SkeletonGroup,
  SkeletonLine,
  SkeletonRectangle,
} from "@wix/design-system";

import React from "react";
import classes from "./StatsCard.module.scss";

export interface StateCardProps {
  label: string;
  tooltip: string;
  value: number | string;
  isLoading?: boolean;
  cardSize?: "small" | "medium";
}

const StateCard = ({
  label = "No Label",
  tooltip = "-",
  value = "-",
  isLoading = false,
  cardSize = "small",
}: StateCardProps) => {
  if (isLoading) {
    return (
      <div className={cardSize == "small" ? classes.card : undefined}>
        <SkeletonGroup>
          <Box direction="vertical" gap={1} minHeight="36.5px" marginTop="4px">
            <SkeletonLine width={cardSize == "small" ? "180px" : "80%"} />
            {cardSize != "small" && (
              <SkeletonRectangle width="80px" height="24px" />
            )}
            {cardSize == "small" && <SkeletonLine width="80px" />}
          </Box>
        </SkeletonGroup>
      </div>
    );
  }
  return (
    <div className={cardSize == "small" ? classes.card : undefined}>
      <Box direction="vertical">
        <Box verticalAlign="middle" gap={0.5}>
          <Text size="tiny">{label}</Text>
          <InfoIcon size="small" content={tooltip} />
        </Box>
        <Text
          size="medium"
          weight="bold"
          className={
            classes[cardSize == "small" ? "medium-plus" : "large-font"]
          }
        >
          {value}
        </Text>
      </Box>
    </div>
  );
};
export default StateCard;
