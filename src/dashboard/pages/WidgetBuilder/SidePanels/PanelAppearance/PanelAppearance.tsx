import React, { useState } from "react";
import { Layout, FormField, SidePanel, Input, Box, Text, ToggleSwitch, Image } from "@wix/design-system";
import { Edit as EditIcon } from "@wix/wix-ui-icons-common";
import { TimerConfig } from "../../../types";
import { renderSectionTitle } from "../utils/renderSectionTitle";
import { DEFAULT_PANEL_WIDTH } from "../SidePanelContainer";
import CountDownTemplate, { CountdownBannerProps, TemplateLayout } from "../../../../components/WidgetCountDown/CountDownTemplate";
import Carousel, { CarouselItem } from "../../../../components/common/Carousel";
import CustomizeTheme from "./CostomizeTheme";

// Import template background images
import blackFridayImage from "../../../../../assets/images/template-background/black _friday.png";
import christmasImage from "../../../../../assets/images/template-background/christmas.png";
import cyberMonday2Image from "../../../../../assets/images/template-background/cyber_monday_2.png";
import cyberMondayImage from "../../../../../assets/images/template-background/cyber_monday.png";
import easterImage from "../../../../../assets/images/template-background/easter.png";
import flashOfferImage from "../../../../../assets/images/template-background/flash_offer.png";
import goldenHourDealsImage from "../../../../../assets/images/template-background/golden_hour_deals.png";
import halloweenImage from "../../../../../assets/images/template-background/halloween.png";
import limitedTimeOfferImage from "../../../../../assets/images/template-background/limited_time_offer.png";
import newYearCountdownImage from "../../../../../assets/images/template-background/new_year_countdown.png";
import summerSplashImage from "../../../../../assets/images/template-background/summer_splash.png";

// Import clock style images
import timer1Image from "../../../../../assets/images/clock-styles/Timer_1.svg";
import timer2Image from "../../../../../assets/images/clock-styles/Timer_2.svg";
import timer3Image from "../../../../../assets/images/clock-styles/Timer_3.svg";
import timer4Image from "../../../../../assets/images/clock-styles/Timer_4.svg";
import timer5Image from "../../../../../assets/images/clock-styles/Timer_5.svg";

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

    // Helper function to get startDate from config with fallback
    const getStartDate = (): Date => {
        if (config.timerConfig?.startDate) {
            return new Date(config.timerConfig.startDate);
        }
        // Default fallback: today
        return new Date();
    };

    // Helper function to format startTime Date to "HH:mm:ss" string
    const getStartTimeString = (): string => {
        if (config.timerConfig?.startTime) {
            const time = new Date(config.timerConfig.startTime);
            const hours = String(time.getHours()).padStart(2, '0');
            const minutes = String(time.getMinutes()).padStart(2, '0');
            const seconds = String(time.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }
        // Default fallback: start of day
        return "00:00:00";
    };

    // Helper function to get endDate from config with fallback
    const getEndDate = (): Date => {
        if (config.timerConfig?.endDate) {
            return new Date(config.timerConfig.endDate);
        }
        // Default fallback: 7 days from now
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
    };

    // Helper function to format endTime Date to "HH:mm:ss" string
    const getEndTimeString = (): string => {
        if (config.timerConfig?.endTime) {
            const time = new Date(config.timerConfig.endTime);
            const hours = String(time.getHours()).padStart(2, '0');
            const minutes = String(time.getMinutes()).padStart(2, '0');
            const seconds = String(time.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }
        // Default fallback: end of day
        return "23:59:59";
    };

    // Get date and time from config
    const startDate = getStartDate();
    const startTime = getStartTimeString();
    const endDate = getEndDate();
    const endTime = getEndTimeString();

    // Helper function to get themeConfig values with fallbacks
    const getThemeConfig = () => {
        const themeConfig = config.themeConfig || {};
        return {
            titleColor: themeConfig.titleColor,
            titleOpacity: themeConfig.titleOpacity,
            subtitleColor: themeConfig.subtitleColor,
            subtitleOpacity: themeConfig.subtitleOpacity,
            countdownBoxBackgroundColor: themeConfig.countdownBoxBackgroundColor,
            countdownBoxBackgroundOpacity: themeConfig.countdownBoxBackgroundOpacity,
            countdownBoxTextColor: themeConfig.countdownBoxTextColor,
            countdownBoxTextOpacity: themeConfig.countdownBoxTextOpacity,
            buttonBackgroundColor: themeConfig.buttonBackgroundColor,
            buttonBackgroundOpacity: themeConfig.buttonBackgroundOpacity,
            buttonTextColor: themeConfig.buttonTextColor,
            buttonTextOpacity: themeConfig.buttonTextOpacity,
        };
    };

    const themeConfig = getThemeConfig();

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

    // Get selected clock style config
    const getSelectedClockConfig = () => {
        const selectedClockStyle = config.selectedClockStyle || '1';
        const clockStyleProps = clockStyleMap[selectedClockStyle];
        if (clockStyleProps) {
            return {
                labelPosition: clockStyleProps.labelPosition,
                numberStyle: clockStyleProps.numberStyle,
                backgroundColor: themeConfig.countdownBoxBackgroundColor || clockStyleProps.backgroundColor,
                textColor: themeConfig.countdownBoxTextColor || clockStyleProps.textColor,
            };
        }
        return {
            labelPosition: config.labelPosition || 'bottom',
            numberStyle: config.numberStyle || 'filled',
            backgroundColor: themeConfig.countdownBoxBackgroundColor || '#2563eb',
            textColor: themeConfig.countdownBoxTextColor || '#ffffff',
        };
    };

    const selectedClockConfig = getSelectedClockConfig();

    // Helper function to get complete clock config with endDate and endTime
    const getClockConfig = () => {
        return {
            ...selectedClockConfig,
            startDate: config.timerMode === 'start-to-finish-timer' ? startDate : undefined,
            startTime: config.timerMode === 'start-to-finish-timer' ? startTime : undefined,
            endDate: config.timerMode === 'start-to-finish-timer' ? endDate : undefined,
            endTime: config.timerMode === 'start-to-finish-timer' ? endTime : undefined,
            timerMode: config.timerMode,
            remainingTimePeriod: config.timerConfig?.remainingTimePeriod,
            remainingTimePeriodUnit: config.timerConfig?.remainingTimePeriodUnit,
            countFrom: config.timerConfig?.countPeriodStart ?? config.timerConfig?.countFrom,
            countTo: config.timerConfig?.countTo,
            countFrequency: config.timerConfig?.countFrequency,
            countDirection: config.timerConfig?.countDirection || (config.timerMode === 'number-counter' ? 'ascending' : 'descending'),
            displayOptions: config.timerConfig?.displayOptions,
        };
    };

    // Template layout definitions - each template has a different layout for Title, Subtitle, Timer, and Button positions
    const templateLayoutMap: Record<string, TemplateLayout> = {
        'template-1': 'title-subtitle-timer-button',  // Title/Subtitle | Timer | Button
        'template-2': 'title-timer-button',            // Title | Timer | Button
        'template-3': 'timer-title-subtitle-button',   // Timer | Title/Subtitle | Button
        'template-4': 'title-subtitle-button-timer',   // Title/Subtitle | Button | Timer
        'template-5': 'title-timer-subtitle-button',   // Title | Timer | Subtitle/Button
        'template-6': 'vertical-title-timer-button',   // Vertical: Title/Subtitle, Timer, Button
        'template-7': 'title-subtitle-timer-button',   // Title/Subtitle | Timer | Button (different scale)
        'template-8': 'timer-title-subtitle-button',   // Timer | Title/Subtitle | Button (different scale)
    };

    // Template configurations for the carousel
    const templateItems: CarouselItem[] = [
        {
            id: "template-1",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={getClockConfig()}
                        layout={templateLayoutMap['template-1']}
                        title={config.title || "Flash Sale"}
                        subTitle={config.subtitle || "Limited Stock"}
                        buttonText={config.buttonText || "Shop Now"}
                        buttonLink={config.buttonLink || "https://example.com/shop"}
                        showButton={config.showButton ?? true}
                        scale={0.65}
                        titleColor={themeConfig.titleColor}
                        titleOpacity={themeConfig.titleOpacity}
                        subtitleColor={themeConfig.subtitleColor}
                        subtitleOpacity={themeConfig.subtitleOpacity}
                        countdownBoxBackgroundColor={themeConfig.countdownBoxBackgroundColor}
                        countdownBoxBackgroundOpacity={themeConfig.countdownBoxBackgroundOpacity}
                        countdownBoxTextColor={themeConfig.countdownBoxTextColor}
                        countdownBoxTextOpacity={themeConfig.countdownBoxTextOpacity}
                        buttonBackgroundColor={themeConfig.buttonBackgroundColor}
                        buttonBackgroundOpacity={themeConfig.buttonBackgroundOpacity}
                        buttonTextColor={themeConfig.buttonTextColor}
                        buttonTextOpacity={themeConfig.buttonTextOpacity}
                    />
                </div>
            ),
        },
        {
            id: "template-2",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={getClockConfig()}
                        layout={templateLayoutMap['template-2']}
                        title={config.title || "Flash Sale"}
                        subTitle={config.subtitle || "Limited Stock"}
                        buttonText={config.buttonText || "View Deals"}
                        buttonLink={config.buttonLink || "https://example.com/deals"}
                        showButton={config.showButton ?? true}
                        scale={0.65}
                        titleColor={themeConfig.titleColor}
                        titleOpacity={themeConfig.titleOpacity}
                        subtitleColor={themeConfig.subtitleColor}
                        subtitleOpacity={themeConfig.subtitleOpacity}
                        countdownBoxBackgroundColor={themeConfig.countdownBoxBackgroundColor}
                        countdownBoxBackgroundOpacity={themeConfig.countdownBoxBackgroundOpacity}
                        countdownBoxTextColor={themeConfig.countdownBoxTextColor}
                        countdownBoxTextOpacity={themeConfig.countdownBoxTextOpacity}
                        buttonBackgroundColor={themeConfig.buttonBackgroundColor}
                        buttonBackgroundOpacity={themeConfig.buttonBackgroundOpacity}
                        buttonTextColor={themeConfig.buttonTextColor}
                        buttonTextOpacity={themeConfig.buttonTextOpacity}
                    />
                </div>
            ),
        },
        {
            id: "template-3",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={getClockConfig()}
                        layout={templateLayoutMap['template-3']}
                        title={config.title || "Flash Sale"}
                        subTitle={config.subtitle || "Limited Stock"}
                        buttonText={config.buttonText || "Buy Now"}
                        buttonLink={config.buttonLink || "https://example.com/buy"}
                        showButton={config.showButton ?? true}
                        scale={0.65}
                        titleColor={themeConfig.titleColor}
                        titleOpacity={themeConfig.titleOpacity}
                        subtitleColor={themeConfig.subtitleColor}
                        subtitleOpacity={themeConfig.subtitleOpacity}
                        countdownBoxBackgroundColor={themeConfig.countdownBoxBackgroundColor}
                        countdownBoxBackgroundOpacity={themeConfig.countdownBoxBackgroundOpacity}
                        countdownBoxTextColor={themeConfig.countdownBoxTextColor}
                        countdownBoxTextOpacity={themeConfig.countdownBoxTextOpacity}
                        buttonBackgroundColor={themeConfig.buttonBackgroundColor}
                        buttonBackgroundOpacity={themeConfig.buttonBackgroundOpacity}
                        buttonTextColor={themeConfig.buttonTextColor}
                        buttonTextOpacity={themeConfig.buttonTextOpacity}
                    />
                </div>
            ),
        },
        {
            id: "template-4",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={getClockConfig()}
                        layout={templateLayoutMap['template-4']}
                        title={config.title || "Flash Sale"}
                        subTitle={config.subtitle || "Limited Stock"}
                        buttonText={config.buttonText || "Buy Now"}
                        buttonLink={config.buttonLink || "https://example.com/buy"}
                        showButton={config.showButton ?? true}
                        scale={0.65}
                        titleColor={themeConfig.titleColor}
                        titleOpacity={themeConfig.titleOpacity}
                        subtitleColor={themeConfig.subtitleColor}
                        subtitleOpacity={themeConfig.subtitleOpacity}
                        countdownBoxBackgroundColor={themeConfig.countdownBoxBackgroundColor}
                        countdownBoxBackgroundOpacity={themeConfig.countdownBoxBackgroundOpacity}
                        countdownBoxTextColor={themeConfig.countdownBoxTextColor}
                        countdownBoxTextOpacity={themeConfig.countdownBoxTextOpacity}
                        buttonBackgroundColor={themeConfig.buttonBackgroundColor}
                        buttonBackgroundOpacity={themeConfig.buttonBackgroundOpacity}
                        buttonTextColor={themeConfig.buttonTextColor}
                        buttonTextOpacity={themeConfig.buttonTextOpacity}
                    />
                </div>
            ),
        },
        {
            id: "template-5",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={getClockConfig()}
                        layout={templateLayoutMap['template-5']}
                        title={config.title || "Flash Sale"}
                        subTitle={config.subtitle || "Limited Stock"}
                        buttonText={config.buttonText || "Shop Now"}
                        buttonLink={config.buttonLink || "https://example.com/shop"}
                        showButton={config.showButton ?? true}
                        scale={0.65}
                        titleColor={themeConfig.titleColor}
                        titleOpacity={themeConfig.titleOpacity}
                        subtitleColor={themeConfig.subtitleColor}
                        subtitleOpacity={themeConfig.subtitleOpacity}
                        countdownBoxBackgroundColor={themeConfig.countdownBoxBackgroundColor}
                        countdownBoxBackgroundOpacity={themeConfig.countdownBoxBackgroundOpacity}
                        countdownBoxTextColor={themeConfig.countdownBoxTextColor}
                        countdownBoxTextOpacity={themeConfig.countdownBoxTextOpacity}
                        buttonBackgroundColor={themeConfig.buttonBackgroundColor}
                        buttonBackgroundOpacity={themeConfig.buttonBackgroundOpacity}
                        buttonTextColor={themeConfig.buttonTextColor}
                        buttonTextOpacity={themeConfig.buttonTextOpacity}
                    />
                </div>
            ),
        },
        {
            id: "template-6",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={getClockConfig()}
                        layout={templateLayoutMap['template-6']}
                        title={config.title || "Flash Sale"}
                        subTitle={config.subtitle || "Limited Stock"}
                        buttonText={config.buttonText || "View Deals"}
                        buttonLink={config.buttonLink || "https://example.com/deals"}
                        showButton={config.showButton ?? true}
                        scale={0.65}
                        titleColor={themeConfig.titleColor}
                        titleOpacity={themeConfig.titleOpacity}
                        subtitleColor={themeConfig.subtitleColor}
                        subtitleOpacity={themeConfig.subtitleOpacity}
                        countdownBoxBackgroundColor={themeConfig.countdownBoxBackgroundColor}
                        countdownBoxBackgroundOpacity={themeConfig.countdownBoxBackgroundOpacity}
                        countdownBoxTextColor={themeConfig.countdownBoxTextColor}
                        countdownBoxTextOpacity={themeConfig.countdownBoxTextOpacity}
                        buttonBackgroundColor={themeConfig.buttonBackgroundColor}
                        buttonBackgroundOpacity={themeConfig.buttonBackgroundOpacity}
                        buttonTextColor={themeConfig.buttonTextColor}
                        buttonTextOpacity={themeConfig.buttonTextOpacity}
                    />
                </div>
            ),
        },
        {
            id: "template-7",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={getClockConfig()}
                        layout={templateLayoutMap['template-7']}
                        title={config.title || "Flash Sale"}
                        subTitle={config.subtitle || "Limited Stock"}
                        buttonText={config.buttonText || "Buy Now"}
                        buttonLink={config.buttonLink || "https://example.com/buy"}
                        showButton={config.showButton ?? true}
                        scale={0.5}
                        titleColor={themeConfig.titleColor}
                        titleOpacity={themeConfig.titleOpacity}
                        subtitleColor={themeConfig.subtitleColor}
                        subtitleOpacity={themeConfig.subtitleOpacity}
                        countdownBoxBackgroundColor={themeConfig.countdownBoxBackgroundColor}
                        countdownBoxBackgroundOpacity={themeConfig.countdownBoxBackgroundOpacity}
                        countdownBoxTextColor={themeConfig.countdownBoxTextColor}
                        countdownBoxTextOpacity={themeConfig.countdownBoxTextOpacity}
                        buttonBackgroundColor={themeConfig.buttonBackgroundColor}
                        buttonBackgroundOpacity={themeConfig.buttonBackgroundOpacity}
                        buttonTextColor={themeConfig.buttonTextColor}
                        buttonTextOpacity={themeConfig.buttonTextOpacity}
                    />
                </div>
            ),
        },
        {
            id: "template-8",
            content: (
                <div style={{backgroundColor: "#C4DCFFFF"}}>
                    <CountDownTemplate
                        clockConfig={getClockConfig()}
                        layout={templateLayoutMap['template-8']}
                        title={config.title || "Flash Sale"}
                        subTitle={config.subtitle || "Limited Stock"}
                        buttonText={config.buttonText || "Buy Now"}
                        buttonLink={config.buttonLink || "https://example.com/buy"}
                        showButton={config.showButton ?? true}
                        scale={0.5}
                        titleColor={themeConfig.titleColor}
                        titleOpacity={themeConfig.titleOpacity}
                        subtitleColor={themeConfig.subtitleColor}
                        subtitleOpacity={themeConfig.subtitleOpacity}
                        countdownBoxBackgroundColor={themeConfig.countdownBoxBackgroundColor}
                        countdownBoxBackgroundOpacity={themeConfig.countdownBoxBackgroundOpacity}
                        countdownBoxTextColor={themeConfig.countdownBoxTextColor}
                        countdownBoxTextOpacity={themeConfig.countdownBoxTextOpacity}
                        buttonBackgroundColor={themeConfig.buttonBackgroundColor}
                        buttonBackgroundOpacity={themeConfig.buttonBackgroundOpacity}
                        buttonTextColor={themeConfig.buttonTextColor}
                        buttonTextOpacity={themeConfig.buttonTextOpacity}
                    />
                </div>
            ),
        },
    ];

    // Clock configurations for the carousel
    const clockItems: CarouselItem[] = [
        {
            id: "1",
            label: "Fill Each Digit",
            content: (
                <Box width="100%" align="center" padding="24px" backgroundColor="#C4DCFFFF" style={{ borderRadius: "0" }}>
                    <Image
                        src={timer1Image}
                        alt="Fill Each Digit"
                        width="100%"
                        height="auto"
                        borderRadius={'0px'}
                        style={{ maxWidth: "100%", borderRadius: "0" }}
                    />
                </Box>
            ),
        },
        {
            id: "2",
            label: "Outline Each Digit",
            content: (
                <Box width="100%" align="center" style={{ padding: "10px", borderRadius: "0" }}>
                    <Image
                        src={timer2Image}
                        alt="Outline Each Digit"
                        width="100%"
                        height="auto"
                        borderRadius={'0px'}
                        style={{ maxWidth: "100%", borderRadius: "0" }}
                    />
                </Box>
            ),
        },
        {
            id: "3",
            label: "Filled Box",
            content: (
                <Box width="100%" align="center" style={{ padding: "10px", borderRadius: "0" }}>
                    <Image
                        src={timer3Image}
                        alt="Filled Box"
                        width="100%"
                        height="auto"
                        borderRadius={'0px'}
                        style={{ maxWidth: "100%", borderRadius: "0" }}
                    />
                </Box>
            ),
        },
        {
            id: "4",
            label: "Outline Box",
            content: (
                <Box width="100%" align="center" style={{ padding: "10px", borderRadius: "0" }}>
                    <Image
                        src={timer4Image}
                        alt="Outline Box"
                        width="100%"
                        height="auto"
                        borderRadius={'0px'}
                        style={{ maxWidth: "100%", borderRadius: "0" }}
                    />
                </Box>
            ),
        },
        {
            id: "5",
            label: "Minimal Style",
            content: (
                <Box width="100%" align="center" style={{ padding: "10px", borderRadius: "0" }}>
                    <Image
                        src={timer5Image}
                        alt="Minimal Style"
                        width="100%"
                        height="auto"
                        borderRadius={'0px'}
                        style={{ maxWidth: "100%", borderRadius: "0" }}
                    />
                </Box>
            ),
        },
    ];

    // Helper function to convert file name to theme ID and label
    const getThemeIdAndLabel = (fileName: string): { id: string; label: string } => {
        // Remove extension and convert to theme ID format
        const nameWithoutExt = fileName.replace(/\.(png|jpg|jpeg)$/i, '');
        // Convert to kebab-case and create theme ID (replace spaces and underscores with dashes)
        const id = `theme-${nameWithoutExt.replace(/[ _]+/g, '-').toLowerCase().replace(/^-+|-+$/g, '')}`;
        // Convert to readable label (replace underscores/dashes with spaces, trim, and capitalize words)
        const label = nameWithoutExt
            .replace(/[_-]+/g, ' ')
            .trim()
            .replace(/\b\w/g, (char) => char.toUpperCase());
        return { id, label };
    };

    // Theme definitions with their images and default colors
    const themeDefinitions = [
        { image: blackFridayImage, fileName: 'black _friday.png', colors: { bg: '#000000', title: '#FFFFFF', subtitle: '#FFD700', box: '#FF0000', button: '#FFD700', buttonText: '#000000' } },
        { image: christmasImage, fileName: 'christmas.png', colors: { bg: '#C8102E', title: '#FFFFFF', subtitle: '#228B22', box: '#C8102E', button: '#228B22', buttonText: '#FFFFFF' } },
        { image: cyberMonday2Image, fileName: 'cyber_monday_2.png', colors: { bg: '#1a1a1a', title: '#00FF00', subtitle: '#00FFFF', box: '#1a1a1a', button: '#00FF00', buttonText: '#000000' } },
        { image: cyberMondayImage, fileName: 'cyber_monday.png', colors: { bg: '#0D5D56', title: '#FFFFFF', subtitle: '#FFD700', box: '#0D5D56', button: '#FFD700', buttonText: '#000000' } },
        { image: easterImage, fileName: 'easter.png', colors: { bg: '#FFB6C1', title: '#FFFFFF', subtitle: '#FF69B4', box: '#FFB6C1', button: '#FF69B4', buttonText: '#FFFFFF' } },
        { image: flashOfferImage, fileName: 'flash_offer.png', colors: { bg: '#FF4500', title: '#FFFFFF', subtitle: '#FFD700', box: '#FF4500', button: '#FFD700', buttonText: '#000000' } },
        { image: goldenHourDealsImage, fileName: 'golden_hour_deals.png', colors: { bg: '#FFD700', title: '#000000', subtitle: '#FF8C00', box: '#FFD700', button: '#FF8C00', buttonText: '#FFFFFF' } },
        { image: halloweenImage, fileName: 'halloween.png', colors: { bg: '#1a1a1a', title: '#FF6B35', subtitle: '#FFA500', box: '#FF6B35', button: '#FFA500', buttonText: '#000000' } },
        { image: limitedTimeOfferImage, fileName: 'limited_time_offer.png', colors: { bg: '#0066CC', title: '#FFFFFF', subtitle: '#FFD700', box: '#0066CC', button: '#FFD700', buttonText: '#000000' } },
        { image: newYearCountdownImage, fileName: 'new_year_countdown.png', colors: { bg: '#000033', title: '#FFFFFF', subtitle: '#FFD700', box: '#000033', button: '#FFD700', buttonText: '#000000' } },
        { image: summerSplashImage, fileName: 'summer_splash.png', colors: { bg: '#00CED1', title: '#FFFFFF', subtitle: '#FFD700', box: '#00CED1', button: '#FFD700', buttonText: '#000000' } },
    ];

    // Generate theme background images mapping
    const themeBackgroundImageMap: Record<string, string> = {};
    themeDefinitions.forEach(({ image, fileName }) => {
        const { id } = getThemeIdAndLabel(fileName);
        themeBackgroundImageMap[id] = image;
    });

    // Generate theme configuration mapping
    const themeConfigMap: Record<string, TimerConfig['themeConfig']> = {};
    themeDefinitions.forEach(({ image, fileName, colors }) => {
        const { id } = getThemeIdAndLabel(fileName);
        themeConfigMap[id] = {
            backgroundType: 'image',
            backgroundColor: colors.bg,
            backgroundOpacity: 100,
            backgroundImageUrl: image,
            titleColor: colors.title,
            titleOpacity: 100,
            subtitleColor: colors.subtitle,
            subtitleOpacity: 100,
            countdownLabelColor: '#FFFFFF',
            countdownLabelOpacity: 100,
            countdownBoxBackgroundColor: colors.box,
            countdownBoxBackgroundOpacity: 100,
            countdownBoxTextColor: '#FFFFFF',
            countdownBoxTextOpacity: 100,
            buttonBackgroundColor: colors.button,
            buttonBackgroundOpacity: 100,
            buttonTextColor: colors.buttonText,
            buttonTextOpacity: 100,
        };
    });

    // Generate theme items for carousel with preview inside
    const themeItems: CarouselItem[] = themeDefinitions.map(({ image, fileName, colors }) => {
        const { id, label } = getThemeIdAndLabel(fileName);
        const themeConfigForPreview = themeConfigMap[id];
        
        return {
            id,
            label,
            content: (
                <Box 
                    width="100%" 
                    align="center" 
                    style={{ 
                        padding: "10px", 
                        borderRadius: "8px",
                        backgroundColor: themeConfigForPreview?.backgroundImageUrl 
                            ? 'transparent' 
                            : (themeConfigForPreview?.backgroundColor || "#F5F5F5"),
                        backgroundImage: themeConfigForPreview?.backgroundImageUrl 
                            ? `url(${themeConfigForPreview.backgroundImageUrl})` 
                            : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        minHeight: '140px',
                        border: "1px solid #E0E0E0",
                    }}
                >
                    {themeConfigForPreview?.backgroundImageUrl && themeConfigForPreview?.imageOpacity && themeConfigForPreview.imageOpacity < 100 && (
                        <Box
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: themeConfigForPreview.imageOpacityColor || '#000000',
                                opacity: (100 - (themeConfigForPreview.imageOpacity || 100)) / 100,
                                borderRadius: "8px",
                            }}
                        />
                    )}
                    <Box width="100%" style={{ maxWidth: "100%", overflow: "hidden", position: 'relative', zIndex: 1 }}>
                        <CountDownTemplate
                            clockConfig={{
                                ...getClockConfig(),
                                backgroundColor: themeConfigForPreview?.countdownBoxBackgroundColor || selectedClockConfig.backgroundColor,
                                textColor: themeConfigForPreview?.countdownBoxTextColor || selectedClockConfig.textColor,
                            }}
                            layout={templateLayoutMap[config.selectedTemplate || 'template-1'] || 'title-subtitle-timer-button'}
                            title={config.title || "Flash Sale"}
                            subTitle={config.subtitle || "Limited Stock"}
                            buttonText={config.buttonText || "Shop Now"}
                            buttonLink={config.buttonLink || "https://example.com/shop"}
                            showButton={config.showButton ?? true}
                            scale={0.5}
                            titleColor={themeConfigForPreview?.titleColor}
                            titleOpacity={themeConfigForPreview?.titleOpacity}
                            subtitleColor={themeConfigForPreview?.subtitleColor}
                            subtitleOpacity={themeConfigForPreview?.subtitleOpacity}
                            countdownBoxBackgroundColor={themeConfigForPreview?.countdownBoxBackgroundColor}
                            countdownBoxBackgroundOpacity={themeConfigForPreview?.countdownBoxBackgroundOpacity}
                            countdownBoxTextColor={themeConfigForPreview?.countdownBoxTextColor}
                            countdownBoxTextOpacity={themeConfigForPreview?.countdownBoxTextOpacity}
                            buttonBackgroundColor={themeConfigForPreview?.buttonBackgroundColor}
                            buttonBackgroundOpacity={themeConfigForPreview?.buttonBackgroundOpacity}
                            buttonTextColor={themeConfigForPreview?.buttonTextColor}
                            buttonTextOpacity={themeConfigForPreview?.buttonTextOpacity}
                        />
                    </Box>
                </Box>
            ),
        };
    });

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
        // Load selected theme config if a theme is selected
        if (config.selectedTheme) {
            const selectedThemeConfig = themeConfigMap[config.selectedTheme];
            if (selectedThemeConfig) {
                // Merge the selected theme config with existing config
                onChange({
                    ...config,
                    themeConfig: {
                        ...config.themeConfig,
                        ...selectedThemeConfig,
                    },
                });
            }
        }
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
                <SidePanel.Section title={renderSectionTitle("Template", "Choose a layout style for your countdown bar. Each template changes how the Title, Subtitle, Timer, and Button are positioned. Positions are pre-defined and not editable.")}>
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

                <SidePanel.Section title={renderSectionTitle("Theme", "Includes background image or color, title color, subtitle color, countdown box colors, and button colors.", "Customize", (<EditIcon />), handleShowCustomizeThemeModal)}>
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
            </SidePanel.Content>

        </SidePanel>
    );
};

export default PanelAppearance;
