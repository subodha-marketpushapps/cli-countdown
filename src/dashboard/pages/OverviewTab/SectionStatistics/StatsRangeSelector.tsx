import { Box, Text, PopoverMenu, TextButton } from "@wix/design-system";
import React from "react";

import * as Icons from "@wix/wix-ui-icons-common";

export const TIME_RANGE_OPTIONS = [
  { id: 0, value: "Last 7 days", date: "7" },
  {
    id: 1,
    value: "Last 30 days",
    date: "30",
  },
  {
    id: 2,
    value: "Last 90 days",
    date: "90",
  },
  {
    id: 3,
    value: "All time",
    date: "ALL",
  },
];

const StatsRangeSelector: React.FC<{
  onClick: (id: number) => void;
  selectedFilterId: number;
  disabled?: boolean;
}> = (props) => {
  const handleOnChange = (id: string | number) => {
    props.onClick(+id);
  };
  return (
    <Box align="center" verticalAlign="middle" gap={1}>
      <Text>Time Period: </Text>

      <PopoverMenu
        triggerElement={
          <TextButton suffixIcon={<Icons.ChevronDownSmall />}>
            {TIME_RANGE_OPTIONS.find(
              (option) => option.id === props.selectedFilterId
            )?.value ?? "All time"}
          </TextButton>
        }
      >
        {TIME_RANGE_OPTIONS.map((option) => (
          <PopoverMenu.MenuItem
            key={option.id}
            text={option.value}
            onClick={() => handleOnChange(option.id)}
            disabled={props.disabled}
          />
        ))}
      </PopoverMenu>
    </Box>
  );
};
export default StatsRangeSelector;
