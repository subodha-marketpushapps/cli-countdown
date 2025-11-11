import React, { useState, useEffect } from "react";
import { Box, Text, TextButton, InfoIcon } from "@wix/design-system";

const StatsRefreshButton: React.FC<{ onClick: () => void }> = (props) => {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [timeSinceRefresh, setTimeSinceRefresh] = useState<string>("now");

  useEffect(() => {
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    if (!lastRefresh) return;

    const interval = setInterval(() => {
      updateTimeSinceRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [lastRefresh]);

  const handleRefresh = () => {
    setLastRefresh(new Date());
    props.onClick();
  };

  const [isHover, setIsHover] = useState(false);

  const updateTimeSinceRefresh = () => {
    if (!lastRefresh) return;

    const now = new Date();
    const secondsAgo = Math.floor(
      (now.getTime() - lastRefresh.getTime()) / 1000
    );

    if (secondsAgo < 60) {
      setTimeSinceRefresh(
        `${secondsAgo} second${secondsAgo !== 1 ? "s" : ""} ago`
      );
    } else if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      setTimeSinceRefresh(
        `${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`
      );
    } else {
      const hoursAgo = Math.floor(secondsAgo / 3600);
      setTimeSinceRefresh(`${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`);
    }
  };

  return (
    <Box verticalAlign="middle" gap={0.5}>
      <Text size="tiny">Updated {timeSinceRefresh}</Text>
      <TextButton
        size="tiny"
        onClick={handleRefresh}
        suffixIcon={
          isHover ? (
            <InfoIcon
              size="small"
              content="There might be a slight delay in updating the statistics."
            />
          ) : undefined
        }
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        Refresh
      </TextButton>
    </Box>
  );
};

export default StatsRefreshButton;
