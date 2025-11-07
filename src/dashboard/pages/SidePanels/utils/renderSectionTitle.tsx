import React from "react";
import { Box, Text, InfoIcon } from "@wix/design-system";

export interface RenderSectionTitleProps {
  title: string;
  infoContent?: string;
}

/**
 * Renders a section title with optional info icon for SidePanel.Section components.
 */
export const renderSectionTitle = (
  title: string,
  infoContent?: string
): React.ReactElement => {
  return (
    <Box direction="horizontal" verticalAlign="middle" gap={0.5}>
      <Text size="small">{title}</Text>
      {infoContent && (
        <Box inline>
          <InfoIcon content={infoContent} size="small" />
        </Box>
      )}
    </Box>
  );
};

