import React from "react";
import { FormField, SidePanel, Box } from "@wix/design-system";
import { Edit as EditIcon } from "@wix/wix-ui-icons-common";
import { TimerConfig } from "../../../types";
import { renderSectionTitle } from "../utils/renderSectionTitle";
import Carousel, { CarouselItem } from "../../../../components/common/Carousel";


interface DesktopAppearanceProps {
    config: TimerConfig;
    onChange: (config: TimerConfig) => void;
    templateItems: CarouselItem[];
    clockItems: CarouselItem[];
    themeItems: CarouselItem[];
    clockStyleMap: Record<string, {
        numberStyle: 'fillEachDigit' | 'outlineEachDigit' | 'filled' | 'outline' | 'none';
        backgroundColor: string;
        textColor: string;
        labelPosition: 'top' | 'bottom';
    }>;
    themeConfigMap: Record<string, TimerConfig['themeConfig']>;
    onShowCustomizeTheme: () => void;
}

const DesktopAppearance: React.FC<DesktopAppearanceProps> = ({
    config,
    onChange,
    templateItems,
    clockItems,
    themeItems,
    clockStyleMap,
    themeConfigMap,
    onShowCustomizeTheme,
}) => {
    const getTemplateIndex = () => {
        const index = templateItems.findIndex(item => item.id === config.selectedTemplate);
        return index >= 0 ? index : 0;
    };

    const getClockStyleIndex = () => {
        const index = clockItems.findIndex(item => item.id === config.selectedClockStyle);
        return index >= 0 ? index : 0;
    };

    const getThemeIndex = () => {
        const index = themeItems.findIndex(item => item.id === config.selectedTheme);
        return index >= 0 ? index : 0;
    };

    return (
        <>
            <SidePanel.Section title={renderSectionTitle("Template", "Choose a layout style for your countdown bar. Each template changes how the Title, Subtitle, Timer, and Button are positioned. Positions are pre-defined and not editable.")}>
                <SidePanel.Field divider={false}>
                    <FormField>
                        <div style={{ margin: "8px" }}>
                            <Carousel
                                items={templateItems}
                                autoSlide={false}
                                showNavigation={true}
                                showDots={true}
                                navigationPosition="bottom"
                                initialIndex={getTemplateIndex()}
                                onSlideChange={(index: number) => {
                                    const selectedTemplate = templateItems[index]?.id;
                                    if (selectedTemplate) {
                                        onChange({
                                            ...config,
                                            selectedTemplate,
                                        });
                                    }
                                }}
                            />
                        </div>
                    </FormField>
                </SidePanel.Field>
            </SidePanel.Section>

            <SidePanel.Section title={renderSectionTitle("Clock Style", "Configure the clock number styles (Filled, Outlined, Filled Each Number, Outline Each Number, None) and label position (Top, Bottom).")}>
                <SidePanel.Field divider={false}>
                    <FormField>
                        <Box width="100%" direction="vertical" style={{ padding: "16px 0" }}>
                            <Carousel
                                items={clockItems}
                                autoSlide={false}
                                showNavigation={true}
                                showDots={true}
                                navigationPosition="bottom"
                                initialIndex={getClockStyleIndex()}
                                onSlideChange={(index: number) => {
                                    const selectedClockStyle = clockItems[index]?.id;
                                    if (selectedClockStyle) {
                                        const clockStyleProps = clockStyleMap[selectedClockStyle];
                                        if (clockStyleProps) {
                                            onChange({
                                                ...config,
                                                selectedClockStyle,
                                                numberStyle: clockStyleProps.numberStyle,
                                                backgroundColor: clockStyleProps.backgroundColor,
                                                textColor: clockStyleProps.textColor,
                                                labelPosition: clockStyleProps.labelPosition,
                                            });
                                        } else {
                                            onChange({ ...config, selectedClockStyle });
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </FormField>
                </SidePanel.Field>
            </SidePanel.Section>

            <SidePanel.Section title={renderSectionTitle("Theme", "Includes background image or color, title color, subtitle color, countdown box colors, and button colors.", "Customize", (<EditIcon />), onShowCustomizeTheme)}>
                <SidePanel.Field divider={false}>
                    <FormField>
                        <Box width="100%" direction="vertical" style={{ padding: "16px 0" }}>
                            <Carousel
                                items={themeItems}
                                autoSlide={false}
                                showNavigation={true}
                                showDots={true}
                                navigationPosition="bottom"
                                initialIndex={getThemeIndex()}
                                onSlideChange={(index: number) => {
                                    const selectedTheme = themeItems[index]?.id;
                                    if (selectedTheme) {
                                        const themeConfig = themeConfigMap[selectedTheme];
                                        onChange({
                                            ...config,
                                            selectedTheme,
                                            themeConfig: themeConfig ? {
                                                ...config.themeConfig,
                                                ...themeConfig,
                                            } : config.themeConfig,
                                        });
                                    }
                                }}
                            />
                        </Box>
                    </FormField>
                </SidePanel.Field>
            </SidePanel.Section>

            {/* <SidePanel.Section title={renderSectionTitle("Font", "Chose the font style for your countdown text to align with your website's branding")}>
                <SidePanel.Field divider={false}>
                    <FormField>

                    </FormField>
                </SidePanel.Field>
            </SidePanel.Section> */}
        </>
    );
};

export default DesktopAppearance;

