import React from "react";
import {
  Box,
  Text,
  FormField,
  SidePanel,
  Layout,
  Dropdown,
  DatePicker,
  TimeInput,
  Checkbox,
  Input,
  ToggleSwitch,
  NumberInput
} from "@wix/design-system";
import { DEFAULT_PANEL_WIDTH } from "../SidePanelContainer";
import { renderSectionTitle } from "../utils/renderSectionTitle";
import { TimerConfig } from "../../../types";

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

        {config.timerMode === 'start-to-finish-timer' && (
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
            <SidePanel.Field divider={false}>
              <FormField>
                <Box direction="vertical" gap="8px">
                  <Text secondary size="small">Count Direction</Text>
                  <Dropdown
                    size="small"
                    selectedId={config.timerConfig?.countDirection || "descending"}
                    onSelect={(option) => onChange({
                      ...config,
                      timerConfig: { 
                        ...config.timerConfig, 
                        countDirection: option?.id as 'ascending' | 'descending' || 'descending'
                      }
                    })}
                    options={[
                      { id: 'descending', value: 'Descending (Count Down)' },
                      { id: 'ascending', value: 'Ascending (Count Up)' },
                    ]}
                  />
                </Box>
              </FormField>
            </SidePanel.Field>
          </SidePanel.Section>
        )}

        {config.timerMode === 'personal-countdown' && (
          <SidePanel.Section title={renderSectionTitle("Remaining Time Period", "Set hot long the countdown lasts for each visitor.")}>
            <SidePanel.Field>
              <FormField>
                <Box direction="horizontal" gap="8px">
                  <NumberInput
                    size="small"
                    value={config.timerConfig?.remainingTimePeriod || 10}
                    min={1}
                    max={100}
                    onChange={(value) => onChange({
                      ...config,
                      timerConfig: { ...config.timerConfig, remainingTimePeriod: value ?? 10 }
                    })}
                  />
                  <Dropdown
                    size="small"
                    selectedId={config.timerConfig?.remainingTimePeriodUnit || "minutes"}
                    options={[
                      { id: 'minutes', value: 'Minutes' },
                      { id: 'hours', value: 'Hours' },
                      { id: 'days', value: 'Days' },
                    ]}
                    onSelect={(option) => onChange({
                      ...config,
                      timerConfig: { ...config.timerConfig, remainingTimePeriodUnit: option?.id as 'minutes' | 'hours' | 'days' }
                    })}
                  />
                </Box>
              </FormField>
            </SidePanel.Field>
            <SidePanel.Field divider={false}>
              <FormField>
                <Box direction="vertical" gap="8px">
                  <Text secondary size="small">Count Direction</Text>
                  <Dropdown
                    size="small"
                    selectedId={config.timerConfig?.countDirection || "descending"}
                    onSelect={(option) => onChange({
                      ...config,
                      timerConfig: { 
                        ...config.timerConfig, 
                        countDirection: option?.id as 'ascending' | 'descending' || 'descending'
                      }
                    })}
                    options={[
                      { id: 'descending', value: 'Descending (Count Down)' },
                      { id: 'ascending', value: 'Ascending (Count Up)' },
                    ]}
                  />
                </Box>
              </FormField>
            </SidePanel.Field>
          </SidePanel.Section>
        )}

        {config.timerMode === 'number-counter' && (
          <>
            <SidePanel.Section title={renderSectionTitle("Count Period", "Set the range of numbers you want the counter to display.")}>
              <SidePanel.Field>
                <Box direction="horizontal" gap="8px">
                  <FormField>
                    <Box direction="vertical" gap="8px">
                      <Text secondary size="small">Count From</Text>
                      <NumberInput
                        size="small"
                        value={config.timerConfig?.countPeriodStart ?? config.timerConfig?.countFrom ?? 0}
                        min={0}
                        max={100}
                        onChange={(value) => onChange({
                          ...config,
                          timerConfig: { 
                            ...config.timerConfig, 
                            countPeriodStart: value ?? 0,
                            countFrom: value ?? 0 // Keep both for backward compatibility
                          }
                        })}
                      />
                    </Box>
                  </FormField>
                  <FormField>
                    <Box direction="vertical" gap="8px">
                      <Text secondary size="small">Count To</Text>
                      <NumberInput
                        size="small"
                        value={config.timerConfig?.countTo || 100}
                        min={0}
                        max={100}
                        onChange={(value) => onChange({
                          ...config,
                          timerConfig: { ...config.timerConfig, countTo: value ?? 100 }
                        })}
                      />
                    </Box>
                  </FormField>
                </Box>
              </SidePanel.Field>
            </SidePanel.Section>

            <SidePanel.Section title={renderSectionTitle("Count Direction", "Choose whether the counter counts up (ascending) or down (descending).")}>
              <SidePanel.Field>
                <FormField>
                  <Dropdown
                    size="small"
                    selectedId={config.timerConfig?.countDirection || "ascending"}
                    onSelect={(option) => onChange({
                      ...config,
                      timerConfig: { 
                        ...config.timerConfig, 
                        countDirection: option?.id as 'ascending' | 'descending' || 'ascending'
                      }
                    })}
                    options={[
                      { id: 'ascending', value: 'Ascending (Count Up)' },
                      { id: 'descending', value: 'Descending (Count Down)' },
                    ]}
                  />
                </FormField>
              </SidePanel.Field>
            </SidePanel.Section>

            <SidePanel.Section title={renderSectionTitle("Countdown Frequency", "Choose how often the counter should update.")}>
              <SidePanel.Field>
                <FormField>
                  <Box direction="vertical" gap="8px">
                    <NumberInput
                      size="small"
                      value={config.timerConfig?.countFrequency || 1}
                      min={1}
                      max={100}
                      onChange={(value) => onChange({
                        ...config,
                        timerConfig: { ...config.timerConfig, countFrequency: value ?? 1 }
                      })}
                      suffix={<Input.Affix>Sec</Input.Affix>}
                    />
                  </Box>
                </FormField>
              </SidePanel.Field>
            </SidePanel.Section>
          </>
        )}

        {config.timerMode !== 'number-counter' && (

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
          </SidePanel.Section>
        )}

        <SidePanel.Section title={renderSectionTitle("Action After Timer Finishes", "Decide what happens when the timer reaches 0: hide the timer, show a message or redirect")}>
          <SidePanel.Field divider={false}>
            <FormField>
              <Box direction="vertical" gap="8px">
                <Text secondary size="small">Select Action</Text>
                <Layout cols={1} gap="12px">
                  <Dropdown
                    size="small"
                    selectedId={config.actionConfig?.action || "hide"}
                    onSelect={(option) => onChange({
                      ...config,
                      actionConfig: {
                        ...config.actionConfig,
                        action: (option?.id as 'hide' | 'show-message' | 'redirect') || "show-message"
                      }
                    })}
                    options={[
                      { id: 'hide', value: 'Hide Timer' },
                      { id: 'show-message', value: 'Show Message' },
                      { id: 'redirect', value: 'Redirect to URL' },
                    ]}
                  />
                </Layout>
              </Box>
            </FormField>
          </SidePanel.Field>

          {config.actionConfig?.action === "show-message" && (
            <>
              <SidePanel.Field divider={false}>
                <FormField>
                  <Box direction="vertical" gap="8px">
                    <Text secondary size="small">Message</Text>
                    <Layout cols={1} gap="12px">
                      <Input
                        size="small"
                        placeholder="The sale has ended. Thank you for your interest!"
                        value={config.actionConfig?.message || ""}
                        onChange={(e) => onChange({
                          ...config,
                          actionConfig: {
                            ...config.actionConfig,
                            message: e.target.value
                          }
                        })}
                      />
                    </Layout>
                  </Box>
                </FormField>
              </SidePanel.Field>

              <SidePanel.Field divider={false}>
                <Box direction="vertical" gap="8px">
                  <FormField>
                    <Box direction="horizontal" style={{ justifyContent: "space-between" }}>
                      <Text secondary size="small">Show Countries</Text>
                      <ToggleSwitch
                        size="small"
                        checked={config.actionConfig?.showCountries ?? false}
                        onChange={(e) => onChange({
                          ...config,
                          actionConfig: {
                            ...config.actionConfig,
                            showCountries: e.target.checked
                          }
                        })}
                      />
                    </Box>
                  </FormField>
                  <FormField>
                    <Box direction="horizontal" style={{ justifyContent: "space-between" }}>
                      <Text secondary size="small">Show Button</Text>
                      <ToggleSwitch
                        size="small"
                        checked={config.actionConfig?.showButton ?? false}
                        onChange={(e) => onChange({
                          ...config,
                          actionConfig: {
                            ...config.actionConfig,
                            showButton: e.target.checked
                          }
                        })}
                      />
                    </Box>
                  </FormField>
                </Box>
              </SidePanel.Field>
            </>
          )}

          {config.actionConfig?.action === "redirect" && (
            <SidePanel.Field divider={false}>
              <FormField>
                <Box direction="vertical" gap="8px">
                  <Text secondary size="small">URL to Redirect</Text>
                  <Layout cols={1} gap="12px">
                    <Input
                      size="small"
                      placeholder="https://example.com"
                      value={config.actionConfig?.redirectUrl || ""}
                      onChange={(e) => onChange({
                        ...config,
                        actionConfig: {
                          ...config.actionConfig,
                          redirectUrl: e.target.value
                        }
                      })}
                    />
                  </Layout>
                </Box>
              </FormField>
            </SidePanel.Field>
          )}
        </SidePanel.Section>
      </SidePanel.Content>
    </SidePanel >
  );
};

export default PanelTimer;

