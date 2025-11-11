import React from "react";
import { Box, Text, InfoIcon, TextButton } from "@wix/design-system";
import { IconProps } from "@wix/wix-ui-icons-common";

export interface RenderSectionTitleProps {
  title: string;
  infoContent?: string;
}

/**
 * Renders a section title with optional info icon for SidePanel.Section components.
 */
export const renderSectionTitle = (
  title: string,
  infoContent?: string,
  actionBtnText?: string,
  actionBtnIcon?: React.ReactElement,
  actionBtnCallback?: () => void
): React.ReactElement => {
  return (
    <Box direction="horizontal" verticalAlign="middle" gap={0.5} width="100%" style={{ justifyContent: 'space-between' }}>
      <Box direction="horizontal" verticalAlign="middle" gap={0.5}>
        <Text size="small">{title}</Text>
        {infoContent && (
          <Box inline>
            <InfoIcon content={infoContent} size="small" />
          </Box>
        )}
      </Box>
      {actionBtnText && (
        <Box inline style={{  marginRight: '0px' }}>
          <TextButton 
            priority="primary" 
            onClick={actionBtnCallback}
            prefixIcon={actionBtnIcon}
          >
            {actionBtnText}
          </TextButton>
        </Box>
      )}
    </Box>
  );
};

