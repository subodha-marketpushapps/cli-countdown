import React from "react";
import {
  Box,
  Text,
  FormField,
  SidePanel,
  Input,
} from "@wix/design-system";
import { DEFAULT_PANEL_WIDTH } from "../SidePanelContainer";
import { renderSectionTitle } from "../utils/renderSectionTitle";
import { TimerConfig } from "../../types";

interface Props {
  config: TimerConfig;
  onChange: (config: TimerConfig) => void;
  onCloseButtonClick: () => void;
}

const PanelContent: React.FC<Props> = ({
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
    >
      <SidePanel.Header title="Content" showDivider={true} />
      <SidePanel.Content noPadding>
        <SidePanel.Section title={renderSectionTitle("Widget Title", "Enter a title for your countdown timer widget.")}>
          <SidePanel.Field>
            <FormField>
              <Input
                value={config.title}
                onChange={(e) => onChange({ ...config, title: e.target.value })}
                placeholder="Enter widget title"
                size="small"
              />
            </FormField>
          </SidePanel.Field>
        </SidePanel.Section>

        <SidePanel.Section title={renderSectionTitle("Message", "Add a message to display above or below the countdown timer.")}>
          <SidePanel.Field>
            <FormField>
              <Input
                value={config.message}
                onChange={(e) => onChange({ ...config, message: e.target.value })}
                placeholder="Enter message"
                size="small"
              />
            </FormField>
          </SidePanel.Field>
        </SidePanel.Section>
      </SidePanel.Content>
    </SidePanel>
  );
};

export default PanelContent;

