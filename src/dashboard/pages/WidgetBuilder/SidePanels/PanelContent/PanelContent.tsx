import React from "react";
import {
  Box,
  Text,
  FormField,
  SidePanel,
  Input,
  Layout,
  ToggleSwitch,
} from "@wix/design-system";
import { DEFAULT_PANEL_WIDTH } from "../SidePanelContainer";
import { renderSectionTitle } from "../utils/renderSectionTitle";
import { TimerConfig } from "../../../types";

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
        <SidePanel.Section title={renderSectionTitle("Timer Mode", "Set the title and subtitle text that will appear inside your countdown bar.")}>
          <SidePanel.Field divider={false}>
            <FormField>
              <Box direction="vertical" gap="8px">
                <Text secondary size="small">Title</Text>
                <Layout cols={1} gap="12px">
                  <Input 
                    size="small" 
                    placeholder="Limited Time Offer"
                    value={config.title || ""}
                    onChange={(e) => onChange({ ...config, title: e.target.value })}
                  />
                </Layout>
              </Box>
            </FormField>
          </SidePanel.Field>
          <SidePanel.Field divider={false}>
            <FormField>
              <Box direction="vertical" gap="8px">
                <Text secondary size="small">Subtitle</Text>
                <Layout cols={1} gap="12px">
                  <Input 
                    size="small" 
                    placeholder="Up to 50% Off"
                    value={config.subtitle || ""}
                    onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
                  />
                </Layout>
              </Box>
            </FormField>
          </SidePanel.Field>
        </SidePanel.Section>

        <SidePanel.Section title={renderSectionTitle("Button")}>
          <SidePanel.Field divider={false}>
            <FormField>
              <Box direction="horizontal" style={{ justifyContent: "space-between" }}>
                <Text secondary size="small">Show Button</Text>
                <ToggleSwitch 
                  size="small" 
                  checked={config.showButton ?? true}
                  onChange={(e) => onChange({ ...config, showButton: e.target.checked })}
                />
              </Box>
            </FormField>
          </SidePanel.Field>
          {config.showButton !== false && (
            <>
              <SidePanel.Field divider={false}>
                <FormField>
                  <Box direction="vertical" gap="8px">
                    <Text secondary size="small">Button Text</Text>
                    <Layout cols={1} gap="12px">
                      <Input 
                        size="small" 
                        placeholder="Shop Now"
                        value={config.buttonText || ""}
                        onChange={(e) => onChange({ ...config, buttonText: e.target.value })}
                      />
                    </Layout>
                  </Box>
                </FormField>
              </SidePanel.Field>
              <SidePanel.Field divider={false}>
                <FormField>
                  <Box direction="vertical" gap="8px">
                    <Text secondary size="small">Button Link</Text>
                    <Layout cols={1} gap="12px">
                      <Input 
                        size="small" 
                        placeholder="https://example.com/shop"
                        value={config.buttonLink || ""}
                        onChange={(e) => onChange({ ...config, buttonLink: e.target.value })}
                      />
                    </Layout>
                  </Box>
                </FormField>
              </SidePanel.Field>

              <SidePanel.Field divider={false}>
                <Box direction="vertical" gap="8px">
                  <FormField>
                    <Box direction="horizontal" style={{ justifyContent: "space-between" }}>
                      <Text secondary size="small">Make the entire timer clickable</Text>
                      <ToggleSwitch 
                        size="small" 
                        checked={config.makeEntireTimerClickable ?? false}
                        onChange={(e) => onChange({ ...config, makeEntireTimerClickable: e.target.checked })}
                      />
                    </Box>
                  </FormField>
                  <FormField>
                    <Box direction="horizontal" style={{ justifyContent: "space-between" }}>
                      <Text secondary size="small">Open in New Tab</Text>
                      <ToggleSwitch 
                        size="small" 
                        checked={config.openInNewTab ?? true}
                        onChange={(e) => onChange({ ...config, openInNewTab: e.target.checked })}
                      />
                    </Box>
                  </FormField>
                </Box>
              </SidePanel.Field>
            </>
          )}
        </SidePanel.Section>

        <SidePanel.Section title={renderSectionTitle("Close Button")}>
          <SidePanel.Field divider={false}>
            <FormField>
              <Box direction="horizontal" style={{ justifyContent: "space-between" }}>
                <Text secondary size="small">Show Close Button</Text>
                <ToggleSwitch 
                  size="small" 
                  checked={config.showCloseButton ?? true}
                  onChange={(e) => onChange({ ...config, showCloseButton: e.target.checked })}
                />
              </Box>
            </FormField>
          </SidePanel.Field>
        </SidePanel.Section>
      </SidePanel.Content>
    </SidePanel>
  );
};

export default PanelContent;

