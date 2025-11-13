import React from "react";
import { FormField, SidePanel, Box, Text,  Image } from "@wix/design-system";
import { TimerConfig } from "../../../types";
import { renderSectionTitle } from "../utils/renderSectionTitle";
import { ClockProps } from "../../../../components/WidgetCountDown/Clock";
import verticalBackgroundImage from "../../../../../assets/images/clock-styles//vertical.png";
import horizontalBackgroundImage from "../../../../../assets/images/clock-styles//horizontal.png";

interface MobileAppearanceProps {
    config: TimerConfig;
    onChange: (config: TimerConfig) => void;
    clockConfig: ClockProps;
    themeConfig: {
        titleColor?: string;
        titleOpacity?: number;
        subtitleColor?: string;
        subtitleOpacity?: number;
        countdownBoxBackgroundColor?: string;
        countdownBoxBackgroundOpacity?: number;
        countdownBoxTextColor?: string;
        countdownBoxTextOpacity?: number;
        buttonBackgroundColor?: string;
        buttonBackgroundOpacity?: number;
        buttonTextColor?: string;
        buttonTextOpacity?: number;
    };
}

const textContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: "8px",
    minWidth: 0,
    justifyContent: 'space-between',
    alignItems: 'center'
};

const MobileAppearance: React.FC<MobileAppearanceProps> = ({
    config,
    onChange,
    clockConfig,
    themeConfig,
}) => {
    return (
        <SidePanel.Section title={renderSectionTitle("Layout", "Choose how your countdown timer is displayed on mobile devices.")}>
            <SidePanel.Field divider={false}>
                <FormField>
                    <Box width="100%" direction="vertical" gap="16px" padding="0px">
                        <Box width="100%" direction="vertical" gap="16px">
                            {/* Vertical Layout Option */}
                            <div
                                style={{
                                    flex: 1,
                                    border: config.mobileLayout === 'vertical' ? '2px solid #3899EC' : '1px solid #E0E0E0',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: config.mobileLayout === 'vertical' ? '#F0F8FF' : '#FFFFFF',
                                }}
                                onClick={() => onChange({ ...config, mobileLayout: 'vertical' })}
                            >
                                <Box
                                >
                                    <Box direction="vertical" gap="8px">
                                        <Image src={verticalBackgroundImage} />

                                        <Box direction="vertical" gap="8px" align="center">
                                            <Text weight="normal" size="small"  color={config.mobileLayout === 'vertical' ? '#1A60F8FF' : '#333333'} style={{ textAlign: 'center', width: '100%' }}>Vertical</Text>
                                        </Box>
                                    </Box>

                                </Box>

                            </div>

                            {/* Horizontal Layout Option */}
                            <div
                                style={{
                                    flex: 1,
                                    border: config.mobileLayout === 'horizontal' ? '2px solid #3899EC' : '1px solid #E0E0E0',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    cursor: 'pointer',
                                    backgroundColor: config.mobileLayout === 'horizontal' ? '#F0F8FF' : '#FFFFFF',
                                }}
                                onClick={() => onChange({ ...config, mobileLayout: 'horizontal' })}
                            >
                                <Box
                                >
                                    <Box direction="vertical" gap="8px">
                                        {/* <img src={verticalBackgroundImage} alt="Background" />
                                     */}
                                        <Image src={horizontalBackgroundImage} />

                                        <Box direction="vertical" gap="8px" align="center">
                                            <Text weight="normal" size="small" color={config.mobileLayout === 'horizontal' ? '#1A60F8FF' : '#333333'} style={{ textAlign: 'center', width: '100%' }}>Horizontal</Text>
                                        </Box>
                                    </Box>

                                </Box>
                            </div>
                        </Box>
                    </Box>
                </FormField>
            </SidePanel.Field>
        </SidePanel.Section>
    );
};

export default MobileAppearance;

