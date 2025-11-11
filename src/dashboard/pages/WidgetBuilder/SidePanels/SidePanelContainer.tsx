import React from "react";
import { Box } from "@wix/design-system";

interface SidePanelContainerProps {
  children: React.ReactNode;
  isShowing: boolean;
}

export const DEFAULT_PANEL_WIDTH = 300;

const SidePanelContainer: React.FC<SidePanelContainerProps> = ({
  children,
  isShowing,
}) => {
  if (!isShowing) {
    return null;
  }
  return (
    <Box width={`${DEFAULT_PANEL_WIDTH}px`} height="100%" backgroundColor="D80">
      {children}
    </Box>
  );
};

export default SidePanelContainer;

