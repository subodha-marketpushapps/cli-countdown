import React from "react";
import {
  Box,
  FormField,
  SidePanel,
  RadioGroup,
} from "@wix/design-system";
import { DEFAULT_PANEL_WIDTH } from "../SidePanelContainer";
import { renderSectionTitle } from "../utils/renderSectionTitle";

interface TimerConfig {
  targetDate: Date | undefined;
  format: 'full' | 'compact' | 'minimal';
  showLabels: boolean;
  size: 'small' | 'medium' | 'large';
  placement: 'top' | 'center' | 'bottom';
  title: string;
  message: string;
}

interface Props {
  config: TimerConfig;
  onChange: (config: TimerConfig) => void;
  onCloseButtonClick: () => void;
}

const PanelPosition: React.FC<Props> = ({
  onCloseButtonClick,
  config,
  onChange,
}) => {
  const handleCloseSidePanel = () => {
    onCloseButtonClick();
  };

  return (
    <SidePanel
      onCloseButtonClick={handleCloseSidePanel}
      width={DEFAULT_PANEL_WIDTH}
      maxHeight="100%"
    >
      <SidePanel.Header title="Position" showDivider={false} />
      <SidePanel.Section title={renderSectionTitle("Position", "Choose where the countdown timer appears on your site.")}>
        <SidePanel.Field divider={false}>
          <FormField>
            <RadioGroup
              value={config.placement}
              onChange={(value) => onChange({ ...config, placement: value as 'top' | 'center' | 'bottom' })}
              display="vertical"
            >
              <RadioGroup.Radio value="top">
                Top (After Header)
              </RadioGroup.Radio>
              <RadioGroup.Radio value="center">
                Center Overlay
              </RadioGroup.Radio>
              <RadioGroup.Radio value="bottom">
                Bottom
              </RadioGroup.Radio>
            </RadioGroup>
          </FormField>
        </SidePanel.Field>
      </SidePanel.Section>
    </SidePanel>
  );
};

export default PanelPosition;

