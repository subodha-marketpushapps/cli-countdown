import React from "react";
import {
  Box,
  Text,
  FormField,
  SidePanel,
  Layout,
  ToggleSwitch,
  Dropdown,
  DatePicker,
  Input,
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

const PanelTimer: React.FC<Props> = ({
  onCloseButtonClick,
  config,
  onChange,
}) => {
  const handleCloseSidePanel = () => {
    onCloseButtonClick();
  };

  const formatOptions = [
    { id: 0, value: 'Full' },
    { id: 1, value: 'Compact' },
    { id: 2, value: 'Minimal' },
  ];

  const sizeOptions = [
    { id: 0, value: 'Small' },
    { id: 1, value: 'Medium' },
    { id: 2, value: 'Large' },
  ];

  const handleFormatChange = (option: any) => {
    const formats: ('full' | 'compact' | 'minimal')[] = ['full', 'compact', 'minimal'];
    const id = typeof option.id === 'number' ? option.id : parseInt(String(option.id), 10);
    if (id >= 0 && id < formats.length) {
      onChange({ ...config, format: formats[id] });
    }
  };

  const handleSizeChange = (option: any) => {
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const id = typeof option.id === 'number' ? option.id : parseInt(String(option.id), 10);
    if (id >= 0 && id < sizes.length) {
      onChange({ ...config, size: sizes[id] });
    }
  };

  return (
    <SidePanel
      onCloseButtonClick={handleCloseSidePanel}
      width={DEFAULT_PANEL_WIDTH}
    >
      <SidePanel.Header title="Timer" showDivider={true} />
      <SidePanel.Content noPadding>
        <SidePanel.Section title={renderSectionTitle("Target Date", "Set the date and time when the countdown should end.")}>
          <SidePanel.Field>
            <FormField>
              <DatePicker
                value={config.targetDate || undefined}
                onChange={(date) => onChange({ ...config, targetDate: date || undefined })}
                width="100%"
                size="small"
                excludePastDates
              />
            </FormField>
          </SidePanel.Field>
        </SidePanel.Section>

        <SidePanel.Section title={renderSectionTitle("Display Format", "Choose how the countdown timer is displayed.")}>
          <SidePanel.Field>
            <FormField>
              <Dropdown
                size="small"
                options={formatOptions}
                selectedId={config.format === 'full' ? 0 : config.format === 'compact' ? 1 : 2}
                onSelect={handleFormatChange}
              />
            </FormField>
          </SidePanel.Field>
        </SidePanel.Section>

        <SidePanel.Section title={renderSectionTitle("Size", "Adjust the size of the countdown timer.")}>
          <SidePanel.Field>
            <FormField>
              <Dropdown
                size="small"
                options={sizeOptions}
                selectedId={config.size === 'small' ? 0 : config.size === 'medium' ? 1 : 2}
                onSelect={handleSizeChange}
              />
            </FormField>
          </SidePanel.Field>
        </SidePanel.Section>

        <SidePanel.Section title={renderSectionTitle("Display Options")}>
          <SidePanel.Field divider={false}>
            <FormField>
              <Box direction="horizontal" style={{ justifyContent: "space-between" }}>
                <Text secondary size="small">Show Labels</Text>
                <ToggleSwitch
                  size="small"
                  checked={config.showLabels}
                  onChange={(e) => onChange({ ...config, showLabels: e.target.checked })}
                />
              </Box>
            </FormField>
          </SidePanel.Field>
        </SidePanel.Section>
      </SidePanel.Content>
    </SidePanel>
  );
};

export default PanelTimer;

