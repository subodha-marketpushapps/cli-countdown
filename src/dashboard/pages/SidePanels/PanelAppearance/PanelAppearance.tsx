import React, { useState } from "react";
import { Layout, FormField, SidePanel, Input, Box, Text, ToggleSwitch, Image } from "@wix/design-system";
import { Edit as EditIcon } from "@wix/wix-ui-icons-common";
import { TimerConfig } from "../../types";
import { renderSectionTitle } from "../utils/renderSectionTitle";
import { DEFAULT_PANEL_WIDTH } from "../SidePanelContainer";
import Clock from "../../components/WidgetCountDown/Clock";
import CountDownTemplate, { CountdownBannerProps } from "../../components/WidgetCountDown/CountDownTemplate";
import Carousel, { CarouselItem } from "../../components/common/Carousel";
import CustomizeTheme from "./CostomizeTheme";

// Import template background images
import blackFridayImage from "../../../../assets/images/template-background/black_friday.png";
import halloweenImage from "../../../../assets/images/template-background/halloween.png";
import limitedTimeOfferImage from "../../../../assets/images/template-background/limited_time_offer.png";
import christmas1Image from "../../../../assets/images/template-background/templat_christmas_1.png";
import christmas2Image from "../../../../assets/images/template-background/templat_christmas_2.png";

interface Props {
    config: TimerConfig;
    onChange: (config: TimerConfig) => void;
    onCloseButtonClick: () => void;
    previewControl?: any; // Preview control from parent
}

const PanelAppearance: React.FC<Props> = ({
    config,
    onChange,
    onCloseButtonClick,
    previewControl,
}) => {
    const [showCustomizeTheme, setShowCustomizeTheme] = useState(false);

    // Template to labelPosition mapping
    const templateLabelPositionMap: Record<string, 'top' | 'bottom'> = {
        'template-1': 'bottom',
        'template-2': 'top',
        'template-3': 'bottom',
    };

    const timeNumberBackgroundColor = "#2563eb";

    // Template configurations for the carousel
    const templateItems: CarouselItem[] = [
        {
            id: "template-1",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={{
                            labelPosition: "top",
                            numberStyle: "filled",
                            endDate: new Date("2025-12-31"),
                            endTime: "23:59:59",
                            backgroundColor: timeNumberBackgroundColor,
                            textColor: "#ffffff",
                        }}
                        title="Flash Sale"
                        subTitle="Limited Stock"
                        buttonText="Shop Now"
                        buttonLink="https://example.com/shop"
                        scale={0.65}
                    />
                </div>
            ),
        },
        {
            id: "template-2",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={{
                            labelPosition: "top",
                            numberStyle: "outline",
                            endDate: new Date("2025-12-31"),
                            endTime: "23:59:59",
                            backgroundColor: timeNumberBackgroundColor,
                            textColor: "#10b981",
                        }}
                        title="Flash Sale"
                        subTitle="Limited Stock"
                        buttonText="View Deals"
                        buttonLink="https://example.com/deals"
                        scale={0.65}
                    />
                </div>
            ),
        },
        {
            id: "template-3",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={{
                            labelPosition: "top",
                            numberStyle: "fillEachDigit",
                            endDate: new Date("2025-12-31"),
                            endTime: "23:59:59",
                            backgroundColor: timeNumberBackgroundColor,
                            textColor: "#ffffff",
                        }}
                        title="Flash Sale"
                        subTitle="Limited Stock"
                        buttonText="Buy Now"
                        buttonLink="https://example.com/buy"
                        scale={0.5}
                    />
                </div>
            ),
        },
        {
            id: "template-4",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={{
                            labelPosition: "top",
                            numberStyle: "outlineEachDigit",
                            endDate: new Date("2025-12-31"),
                            endTime: "23:59:59",
                            backgroundColor: timeNumberBackgroundColor,
                            textColor: "#ffffff",
                        }}
                        title="Flash Sale"
                        subTitle="Limited Stock"
                        buttonText="Buy Now"
                        buttonLink="https://example.com/buy"
                        scale={0.5}
                    />
                </div>
            ),
        },
        {
            id: "template-5",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={{
                            labelPosition: "bottom",
                            numberStyle: "filled",
                            endDate: new Date("2025-12-31"),
                            endTime: "23:59:59",
                            backgroundColor: timeNumberBackgroundColor,
                            textColor: "#ffffff",
                        }}
                        title="Flash Sale"
                        subTitle="Limited Stock"
                        buttonText="Shop Now"
                        buttonLink="https://example.com/shop"
                        scale={0.65}
                    />
                </div>
            ),
        },
        {
            id: "template-6",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={{
                            labelPosition: "bottom",
                            numberStyle: "outline",
                            endDate: new Date("2025-12-31"),
                            endTime: "23:59:59",
                            backgroundColor: timeNumberBackgroundColor,
                            textColor: "#10b981",
                        }}
                        title="Flash Sale"
                        subTitle="Limited Stock"
                        buttonText="View Deals"
                        buttonLink="https://example.com/deals"
                        scale={0.65}
                    />
                </div>
            ),
        },
        {
            id: "template-7",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={{
                            labelPosition: "bottom",
                            numberStyle: "fillEachDigit",
                            endDate: new Date("2025-12-31"),
                            endTime: "23:59:59",
                            backgroundColor: timeNumberBackgroundColor,
                            textColor: "#ffffff",
                        }}
                        title="Flash Sale"
                        subTitle="Limited Stock"
                        buttonText="Buy Now"
                        buttonLink="https://example.com/buy"
                        scale={0.5}
                    />
                </div>
            ),
        },
        {
            id: "template-8",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={{
                            labelPosition: "bottom",
                            numberStyle: "outlineEachDigit",
                            endDate: new Date("2025-12-31"),
                            endTime: "23:59:59",
                            backgroundColor: timeNumberBackgroundColor,
                            textColor: "#ffffff",
                        }}
                        title="Flash Sale"
                        subTitle="Limited Stock"
                        buttonText="Buy Now"
                        buttonLink="https://example.com/buy"
                        scale={0.5}
                    />
                </div>
            ),
        },
    ];

    // Clock Style to properties mapping
    const clockStyleMap: Record<string, {
        numberStyle: 'fillEachDigit' | 'outlineEachDigit' | 'filled' | 'outline' | 'none';
        backgroundColor: string;
        textColor: string;
        labelPosition: 'top' | 'bottom';
    }> = {
        '1': {
            numberStyle: 'fillEachDigit',
            backgroundColor: '#2563eb',
            textColor: '#ffffff',
            labelPosition: 'top',
        },
        '2': {
            numberStyle: 'outlineEachDigit',
            backgroundColor: '#2563eb',
            textColor: '#2563eb',
            labelPosition: 'bottom',
        },
        '3': {
            numberStyle: 'filled',
            backgroundColor: '#10b981',
            textColor: '#ffffff',
            labelPosition: 'bottom',
        },
        '4': {
            numberStyle: 'outline',
            backgroundColor: '#f59e0b',
            textColor: '#f59e0b',
            labelPosition: 'bottom',
        },
        '5': {
            numberStyle: 'none',
            backgroundColor: '#6366f1',
            textColor: '#6366f1',
            labelPosition: 'bottom',
        },
    };

    // Clock configurations for the carousel
    const clockItems: CarouselItem[] = [
        {
            id: "1",
            label: "Fill Each Digit",
            content: (
                <Clock
                    labelPosition="top"
                    numberStyle="fillEachDigit"
                    endDate={new Date("2025-12-31")}
                    endTime="23:59:59"
                    backgroundColor="#2563eb"
                    textColor="#ffffff"
                />
            ),
        },
        {
            id: "2",
            label: "Outline Each Digit",
            content: (
                <Clock
                    labelPosition="bottom"
                    numberStyle="outlineEachDigit"
                    endDate={new Date("2025-12-31")}
                    endTime="23:59:59"
                    backgroundColor="#2563eb"
                    textColor="#2563eb"
                />
            ),
        },
        {
            id: "3",
            label: "Filled Box",
            content: (
                <Clock
                    labelPosition="bottom"
                    numberStyle="filled"
                    endDate={new Date("2025-12-31")}
                    endTime="23:59:59"
                    backgroundColor="#10b981"
                    textColor="#ffffff"
                />
            ),
        },
        {
            id: "4",
            label: "Outline Box",
            content: (
                <Clock
                    labelPosition="bottom"
                    numberStyle="outline"
                    endDate={new Date("2025-12-31")}
                    endTime="23:59:59"
                    backgroundColor="#f59e0b"
                    textColor="#f59e0b"
                />
            ),
        },
        {
            id: "5",
            label: "Minimal Style",
            content: (
                <Clock
                    labelPosition="bottom"
                    numberStyle="none"
                    endDate={new Date("2025-12-31")}
                    endTime="23:59:59"
                    backgroundColor="#6366f1"
                    textColor="#6366f1"
                />
            ),
        },
    ];

    // Theme background images for the carousel
    const themeItems: CarouselItem[] = [
        {
            id: "theme-1",
            label: "Black Friday",
            content: (
                <Box width="100%" align="center" style={{ padding: "10px", borderRadius: "0" }}>
                    <Image
                        src={blackFridayImage}
                        alt="Black Friday Theme"
                        width="100%"
                        height="auto"
                        borderRadius={'0px'}
                        style={{ maxWidth: "100%", borderRadius: "0" }}
                    />
                </Box>
            ),
        },
        {
            id: "theme-2",
            label: "Halloween",
            content: (
                <Box width="100%" align="center" style={{ padding: "10px", borderRadius: "0" }}>
                    <Image
                        src={halloweenImage}
                        alt="Halloween Theme"
                        width="100%"
                        height="auto"
                        borderRadius={'0px'}
                        style={{ maxWidth: "100%", borderRadius: "0" }}
                    />
                </Box>
            ),
        },
        {
            id: "theme-3",
            label: "Limited Time Offer",
            content: (
                <Box width="100%" align="center" style={{ padding: "10px" }}>
                    <Image
                        src={limitedTimeOfferImage}
                        alt="Limited Time Offer Theme"
                        width="100%"
                        height="auto"
                        borderRadius={'0px'}
                        style={{ maxWidth: "100%", borderRadius: "0" }}
                    />
                </Box>
            ),
        },
        {
            id: "theme-4",
            label: "Christmas 1",
            content: (
                <Box width="100%" align="center" style={{ padding: "10px" }}>
                    <Image
                        src={christmas1Image}
                        alt="Christmas Theme 1"
                        width="100%"
                        height="auto"
                        borderRadius={'0px'}
                        style={{ maxWidth: "100%", borderRadius: "0" }}
                    />
                </Box>
            ),
        },
        {
            id: "theme-5",
            label: "Christmas 2",
            content: (
                <Box width="100%" align="center" style={{ padding: "10px" }}>
                    <Image
                        src={christmas2Image}
                        alt="Christmas Theme 2"
                        width="100%"
                        height="auto"
                        borderRadius={'0px'}
                        style={{ maxWidth: "100%", borderRadius: "0" }}
                    />
                </Box>
            ),
        },
    ];

    // Get initial carousel indices based on selected values
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


    const handleCloseSidePanel = () => {
        onCloseButtonClick();
    };

    const handleShowCustomizeThemeModal = () => {
        setShowCustomizeTheme(true);
    };

    const handleCloseCustomizeTheme = () => {
        setShowCustomizeTheme(false);
    };

    const handleBackFromCustomizeTheme = () => {
        setShowCustomizeTheme(false);
    };

    // Show CustomizeTheme panel if requested
    if (showCustomizeTheme) {
        return (
            <CustomizeTheme
                config={config}
                onChange={onChange}
                onClose={handleCloseCustomizeTheme}
                onBack={handleBackFromCustomizeTheme}
            />
        );
    }

    return (
        <SidePanel
            onCloseButtonClick={handleCloseSidePanel}
            width={DEFAULT_PANEL_WIDTH}
        >
            <SidePanel.Header title="Appearance" showDivider={true}></SidePanel.Header>

            <SidePanel.Content noPadding>
                <SidePanel.Section title={renderSectionTitle("Template", "Chose a layout style for your countdown bar. each template changes how the text, timer and button are arranged.")}>
                    <SidePanel.Field divider={false}>
                        <FormField>
                            <div style={{margin: "8px"}}>
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
                                            // Get labelPosition from mapping
                                            const labelPosition = templateLabelPositionMap[selectedTemplate] || 'bottom';
                                            onChange({ 
                                                ...config, 
                                                selectedTemplate,
                                                labelPosition 
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </FormField>
                    </SidePanel.Field>
                </SidePanel.Section>

                <SidePanel.Section title={renderSectionTitle("Clock Style", "Select the visual style of your countdown (Ex: box style, minimal, inline). Only the timer design changes.")}>
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

                <SidePanel.Section title={renderSectionTitle("Theme", "Select the visual style of your countdown (Ex: box style, minimal, inline). Only the timer design changes.", "Customize", (<EditIcon />), handleShowCustomizeThemeModal)}>
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
                                            onChange({ ...config, selectedTheme });
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
            </SidePanel.Content>

        </SidePanel>
    );
};

export default PanelAppearance;
