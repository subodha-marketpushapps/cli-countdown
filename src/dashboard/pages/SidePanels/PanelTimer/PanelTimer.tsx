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
  TimeInput,
  Checkbox
} from "@wix/design-system";
import { DEFAULT_PANEL_WIDTH } from "../SidePanelContainer";
import { renderSectionTitle } from "../utils/renderSectionTitle";
import { TimerConfig } from "../../types";

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
        <SidePanel.Section title={renderSectionTitle("Timer Mode", "Choose how the timer works: run between fixed dates, show a unique countdown per visitor, or display a number-based counter.")}>
          <SidePanel.Field>
            <FormField>
              <Layout cols={1} gap="12px">
                <Dropdown
                  size="small"
                  selectedId={config.timerMode || "start-to-finish-timer"}
                  onSelect={(option) => {
                    const timerModes: ('start-to-finish-timer' | 'personal-countdown' | 'number-counter')[] = ['start-to-finish-timer', 'personal-countdown', 'number-counter'];
                    const selectedMode = option?.id as string;
                    if (timerModes.includes(selectedMode as any)) {
                      onChange({ ...config, timerMode: selectedMode as 'start-to-finish-timer' | 'personal-countdown' | 'number-counter' });
                    }
                  }}
                  options={[
                    { id: 'start-to-finish-timer', value: 'Start to Finish Timer' },
                    { id: 'personal-countdown', value: 'Personal Countdown' },
                    { id: 'number-counter', value: 'Number Counter' },
                  ]}
                />
              </Layout>
            </FormField>
          </SidePanel.Field>
        </SidePanel.Section>


        <SidePanel.Section title={renderSectionTitle("Set Timer", "Define the start and end time for your countdown timer.")}>
          <SidePanel.Field divider={false}>
            <Box direction="vertical" gap="16px">
              <FormField>
                <Box direction="vertical" gap="8px">
                  <Text secondary size="small">Start Date</Text>
                  <Box direction="horizontal">
                    <Box style={{ flex: 2 }}>
                      <DatePicker
                        size="small"
                        value={config.timerConfig?.startDate || new Date()}
                        onChange={(date) => onChange({
                          ...config,
                          timerConfig: {
                            ...config.timerConfig,
                            startDate: (date as any)?.date || date || new Date()
                          }
                        })}
                      />
                    </Box>
                    <Box style={{ flex: 1 }}>
                      <TimeInput
                        size="small"
                        value={config.timerConfig?.startTime || (() => {
                          const date = new Date();
                          date.setHours(0, 0, 0, 0);
                          return date;
                        })()}
                        onChange={(e) => onChange({
                          ...config,
                          timerConfig: {
                            ...config.timerConfig,
                            startTime: e.date || new Date()
                          }
                        })}
                      />
                    </Box>
                  </Box>
                </Box>
              </FormField>

              <FormField>
                <Box direction="vertical" gap="8px">
                  <Text secondary size="small">End Date</Text>
                  <Box direction="horizontal">
                    <Box style={{ flex: 2 }}>
                      <DatePicker
                        size="small"
                        value={config.timerConfig?.endDate || (() => {
                          const date = new Date();
                          date.setDate(date.getDate() + 7);
                          return date;
                        })()}
                        onChange={(date) => onChange({
                          ...config,
                          timerConfig: {
                            ...config.timerConfig,
                            endDate: (date as any)?.date || date || new Date()
                          }
                        })}
                      />
                    </Box>
                    <Box style={{ flex: 1 }}>
                      <TimeInput
                        size="small"
                        value={config.timerConfig?.endTime || (() => {
                          const date = new Date();
                          date.setHours(23, 59, 59, 0);
                          return date;
                        })()}
                        onChange={(e) => onChange({
                          ...config,
                          timerConfig: {
                            ...config.timerConfig,
                            endTime: e.date || new Date()
                          }
                        })}
                      />
                    </Box>
                  </Box>
                </Box>
              </FormField>
            </Box>
          </SidePanel.Field>
          <SidePanel.Field divider={false}>
            <FormField>
              <Box direction="vertical" gap="8px">
                <Text secondary size="small">Time Zone</Text>
                <Layout cols={1} gap="12px">
                  <Dropdown
                    size="small"
                    placeholder="Select Time Zone"
                    selectedId={config.timerConfig?.timeZone || "UTC"}
                    onSelect={(option) => onChange({
                      ...config,
                      timerConfig: {
                        ...config.timerConfig,
                        timeZone: option?.id as string || "UTC"
                      }
                    })}
                    options={[
                      { id: 'UTC', value: 'UTC' },
                      { id: 'America/New_York', value: 'America/New_York (EST)' },
                      { id: 'America/Los_Angeles', value: 'America/Los_Angeles (PST)' },
                      { id: 'Europe/London', value: 'Europe/London (GMT)' },
                      { id: 'Asia/Tokyo', value: 'Asia/Tokyo (JST)' },
                    ]}
                  />
                </Layout>
              </Box>
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
          <SidePanel.Field>
            <FormField>
              <Layout cols={1} gap="12px">
                <Checkbox
                  checked={config.timerConfig?.displayOptions?.showDays ?? true}
                  onChange={(e) => onChange({
                    ...config,
                    timerConfig: {
                      ...config.timerConfig,
                      displayOptions: {
                        ...config.timerConfig?.displayOptions,
                        showDays: e.target.checked
                      }
                    }
                  })}
                >
                  Days
                </Checkbox>
                <Checkbox
                  checked={config.timerConfig?.displayOptions?.showHours ?? true}
                  onChange={(e) => onChange({
                    ...config,
                    timerConfig: {
                      ...config.timerConfig,
                      displayOptions: {
                        ...config.timerConfig?.displayOptions,
                        showHours: e.target.checked
                      }
                    }
                  })}
                >
                  Hours
                </Checkbox>
                <Checkbox
                  checked={config.timerConfig?.displayOptions?.showMinutes ?? true}
                  onChange={(e) => onChange({
                    ...config,
                    timerConfig: {
                      ...config.timerConfig,
                      displayOptions: {
                        ...config.timerConfig?.displayOptions,
                        showMinutes: e.target.checked
                      }
                    }
                  })}
                >
                  Minutes
                </Checkbox>
                <Checkbox
                  checked={config.timerConfig?.displayOptions?.showSeconds ?? true}
                  onChange={(e) => onChange({
                    ...config,
                    timerConfig: {
                      ...config.timerConfig,
                      displayOptions: {
                        ...config.timerConfig?.displayOptions,
                        showSeconds: e.target.checked
                      }
                    }
                  })}
                >
                  Seconds
                </Checkbox>
              </Layout>
            </FormField>
          </SidePanel.Field>
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

