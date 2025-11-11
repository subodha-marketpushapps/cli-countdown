import React from "react";
import {
  Box,
  FormField,
  SidePanel,
  RadioGroup,
} from "@wix/design-system";
import { DEFAULT_PANEL_WIDTH } from "../SidePanelContainer";
import { renderSectionTitle } from "../utils/renderSectionTitle";
import { TimerConfig } from "../../../types";

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
              onChange={(value) => onChange({ ...config, placement: value as 'centered_overlay' | 'static_top' | 'floating_top' | 'floating_bottom' })}
              display="vertical"
            >
              <RadioGroup.Radio value="centered_overlay">
                Centered Overlay Banner
              </RadioGroup.Radio>
              <RadioGroup.Radio value="static_top">
                Static Top Banner
              </RadioGroup.Radio>
              <RadioGroup.Radio value="floating_top">
                Floating Top Banner
              </RadioGroup.Radio>
              <RadioGroup.Radio value="floating_bottom">
                Floating Bottom Banner
              </RadioGroup.Radio>
            </RadioGroup>
          </FormField>
        </SidePanel.Field>
      </SidePanel.Section>
    </SidePanel>
  );
};

export default PanelPosition;

