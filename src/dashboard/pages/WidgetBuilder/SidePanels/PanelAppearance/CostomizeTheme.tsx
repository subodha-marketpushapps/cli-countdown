import React, { useState, useEffect } from "react";
import {
    Box,
    Text,
    FormField,
    SidePanel,
    Layout,
    SegmentedToggle,
    IconButton,
    TextButton,
    Image,
} from "@wix/design-system";
import * as Icons from "@wix/wix-ui-icons-common";
import { DEFAULT_PANEL_WIDTH } from "../SidePanelContainer";
import { renderSectionTitle } from "../utils/renderSectionTitle";
import { TimerConfig } from "../../../types";
import { InputColorOpacity } from "../../../../components/FormInputs";

interface CustomizeThemeProps {
    config: TimerConfig;
    onChange: (config: TimerConfig) => void;
    onClose: () => void;
    onBack: () => void;
}

// Helper function to combine color and opacity into #RRGGBBAA format
const combineColorAndOpacity = (color: string, opacity: number): string => {
    const baseColor = color.slice(0, 7).toUpperCase();
    const alphaHex = Math.round((opacity / 100) * 255)
        .toString(16)
        .padStart(2, "0")
        .toUpperCase();
    return `#${baseColor.replace("#", "")}${alphaHex}`;
};

// Helper function to parse #RRGGBBAA format to color and opacity
const parseColorAndOpacity = (value: string): { color: string; opacity: number } => {
    if (value.length === 9) {
        const color = value.slice(0, 7);
        const opacityHex = value.slice(7, 9);
        const opacityValue = parseInt(opacityHex, 16);
        const opacity = isNaN(opacityValue) ? 100 : Math.round((opacityValue / 255) * 100);
        return { color, opacity };
    }
    return { color: value, opacity: 100 };
};

const CustomizeTheme: React.FC<CustomizeThemeProps> = ({
    config,
    onChange,
    onClose,
    onBack,
}) => {
    const [backgroundType, setBackgroundType] = useState<'color' | 'image'>(
        config.themeConfig?.backgroundType || (config.themeConfig?.backgroundImageUrl ? 'image' : 'color')
    );
    const [imageUrl, setImageUrl] = useState<string | undefined>(config.themeConfig?.backgroundImageUrl);

    // Sync imageUrl and backgroundType with config changes
    useEffect(() => {
        setImageUrl(config.themeConfig?.backgroundImageUrl);
        if (config.themeConfig?.backgroundType) {
            setBackgroundType(config.themeConfig.backgroundType);
        } else if (config.themeConfig?.backgroundImageUrl) {
            setBackgroundType('image');
        }
    }, [config.themeConfig?.backgroundImageUrl, config.themeConfig?.backgroundType]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImageUrl(result);
                onChange({
                    ...config,
                    themeConfig: {
                        ...config.themeConfig,
                        backgroundImageUrl: result,
                    },
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            handleImageUpload(e as any);
        };
        input.click();
    };

    return (
        <SidePanel
            onCloseButtonClick={onClose}
            width={DEFAULT_PANEL_WIDTH}
        >
            <SidePanel.Header
                title={
                    <Box direction="vertical" verticalAlign="middle" gap={2} style={{ width: '100%' }}>
                        <Text size="medium" weight="bold" style={{ flex: 1, textAlign: 'center' }}>
                            Customize Theme
                        </Text>
                        <TextButton
                            priority="secondary"
                            size="small"
                            onClick={onBack}
                            prefixIcon={<Icons.ChevronLeft />}
                        >
                            Back
                        </TextButton>
                    </Box>
                }

                showDivider={true}
            />

            <SidePanel.Content noPadding>
                {/* Background Section */}
                <SidePanel.Section title={renderSectionTitle("Background")}>
                    <SidePanel.Field divider={false}>
                        <FormField>
                            <Box direction="vertical" gap="12px">
                                {/* Background Type Toggle */}
                                <Box gap="18px" verticalAlign="middle">
                                    <SegmentedToggle
                                        selected={backgroundType}
                                        onClick={(_, value: string) => {
                                            const newType = value as 'color' | 'image';
                                            setBackgroundType(newType);
                                            onChange({
                                                ...config,
                                                themeConfig: {
                                                    ...config.themeConfig,
                                                    backgroundType: newType,
                                                },
                                            });
                                        }}
                                    >
                                        <SegmentedToggle.Icon value="color" tooltipText="Solid Color">
                                            <Icons.LayoutFull />
                                        </SegmentedToggle.Icon>
                                        <SegmentedToggle.Icon value="image" tooltipText="Image">
                                            <Icons.Image />
                                        </SegmentedToggle.Icon>
                                    </SegmentedToggle>
                                </Box>

                                {backgroundType === 'image' && (
                                    <>
                                        {/* Image Placeholder */}
                                        <Box direction="vertical" gap="8px">
                                            <Text size="small" weight="normal" secondary>Image</Text>
                                            <div
                                                style={{
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                }}
                                                onClick={handleImageClick}
                                            >
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt="Background"
                                                        style={{
                                                            width: '100%',
                                                            height: '160px',
                                                            objectFit: 'cover',
                                                            border: '1px solid #E0E0E0',
                                                            borderRadius: '8px',
                                                        }}
                                                    />
                                                ) : (
                                                    <Image showBorder height="160px" />
                                                )}
                                                <Box
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        pointerEvents: 'none',
                                                        opacity: imageUrl ? 0.7 : 1,
                                                    }}
                                                >
                                                    <Text size="small" secondary>
                                                        {imageUrl ? 'Click to change image' : 'Click to upload image'}
                                                    </Text>
                                                </Box>
                                            </div>
                                        </Box>


                                        {/* Image Opacity */}
                                        <InputColorOpacity
                                            label="Image Opacity"
                                            infoContent=""
                                            value={combineColorAndOpacity(
                                                config.themeConfig?.imageOpacityColor || '#000000',
                                                config.themeConfig?.imageOpacity || 100
                                            )}
                                            onChange={(value) => {
                                                const { color, opacity } = parseColorAndOpacity(value as string);
                                                onChange({
                                                    ...config,
                                                    themeConfig: {
                                                        ...config.themeConfig,
                                                        imageOpacityColor: color,
                                                        imageOpacity: opacity,
                                                    },
                                                });
                                            }}
                                        />
                                    </>
                                )}

                                {/* Background Color */}
                                <InputColorOpacity
                                    label={backgroundType === 'image' ? "Background Color" : "Solid Color"}
                                    infoContent=""
                                    value={combineColorAndOpacity(
                                        config.themeConfig?.backgroundColor || '#000000',
                                        config.themeConfig?.backgroundOpacity || 100
                                    )}
                                    onChange={(value) => {
                                        const { color, opacity } = parseColorAndOpacity(value as string);
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                backgroundColor: color,
                                                backgroundOpacity: opacity,
                                            },
                                        });
                                    }}
                                />
                            </Box>
                        </FormField>
                    </SidePanel.Field>
                </SidePanel.Section>

                {/* Text Colors Section */}
                <SidePanel.Section title={renderSectionTitle("Text Colors")}>
                    <Box direction="vertical" gap="16px">
                        <InputColorOpacity
                            label="Title Color"
                            infoContent=""
                            value={combineColorAndOpacity(
                                config.themeConfig?.titleColor || '#FFD700',
                                config.themeConfig?.titleOpacity || 100
                            )}
                            onChange={(value) => {
                                const { color, opacity } = parseColorAndOpacity(value as string);
                                onChange({
                                    ...config,
                                    themeConfig: {
                                        ...config.themeConfig,
                                        titleColor: color,
                                        titleOpacity: opacity,
                                    },
                                });
                            }}
                        />
                        <InputColorOpacity
                            label="Subtitle Color"
                            infoContent=""
                            value={combineColorAndOpacity(
                                config.themeConfig?.subtitleColor || '#FFD700',
                                config.themeConfig?.subtitleOpacity || 100
                            )}
                            onChange={(value) => {
                                const { color, opacity } = parseColorAndOpacity(value as string);
                                onChange({
                                    ...config,
                                    themeConfig: {
                                        ...config.themeConfig,
                                        subtitleColor: color,
                                        subtitleOpacity: opacity,
                                    },
                                });
                            }}
                        />
                    </Box>
                </SidePanel.Section>

                {/* Timer Colors Section */}
                <SidePanel.Section title={renderSectionTitle("Timer Colors")}>
                    <Box direction="vertical" gap="16px">
                        <InputColorOpacity
                            label="Countdown Label Text"
                            infoContent=""
                            value={combineColorAndOpacity(
                                config.themeConfig?.countdownLabelColor || '#FFD700',
                                config.themeConfig?.countdownLabelOpacity || 100
                            )}
                            onChange={(value) => {
                                const { color, opacity } = parseColorAndOpacity(value as string);
                                onChange({
                                    ...config,
                                    themeConfig: {
                                        ...config.themeConfig,
                                        countdownLabelColor: color,
                                        countdownLabelOpacity: opacity,
                                    },
                                });
                            }}
                        />
                        <InputColorOpacity
                            label="Countdown Box Background"
                            infoContent=""
                            value={combineColorAndOpacity(
                                config.themeConfig?.countdownBoxBackgroundColor || '#FFD700',
                                config.themeConfig?.countdownBoxBackgroundOpacity || 100
                            )}
                            onChange={(value) => {
                                const { color, opacity } = parseColorAndOpacity(value as string);
                                onChange({
                                    ...config,
                                    themeConfig: {
                                        ...config.themeConfig,
                                        countdownBoxBackgroundColor: color,
                                        countdownBoxBackgroundOpacity: opacity,
                                    },
                                });
                            }}
                        />
                        <InputColorOpacity
                            label="Countdown Box Text"
                            infoContent=""
                            value={combineColorAndOpacity(
                                config.themeConfig?.countdownBoxTextColor || '#000000',
                                config.themeConfig?.countdownBoxTextOpacity || 100
                            )}
                            onChange={(value) => {
                                const { color, opacity } = parseColorAndOpacity(value as string);
                                onChange({
                                    ...config,
                                    themeConfig: {
                                        ...config.themeConfig,
                                        countdownBoxTextColor: color,
                                        countdownBoxTextOpacity: opacity,
                                    },
                                });
                            }}
                        />
                    </Box>
                </SidePanel.Section>

                {/* Button Colors Section */}
                <SidePanel.Section title={renderSectionTitle("Button Colors")}>
                    <Box direction="vertical" gap="16px">
                        <InputColorOpacity
                            label="Button Background"
                            infoContent=""
                            value={combineColorAndOpacity(
                                config.themeConfig?.buttonBackgroundColor || '#FFD700',
                                config.themeConfig?.buttonBackgroundOpacity || 100
                            )}
                            onChange={(value) => {
                                const { color, opacity } = parseColorAndOpacity(value as string);
                                onChange({
                                    ...config,
                                    themeConfig: {
                                        ...config.themeConfig,
                                        buttonBackgroundColor: color,
                                        buttonBackgroundOpacity: opacity,
                                    },
                                });
                            }}
                        />
                        <InputColorOpacity
                            label="Button Text Color"
                            infoContent=""
                            value={combineColorAndOpacity(
                                config.themeConfig?.buttonTextColor || '#000000',
                                config.themeConfig?.buttonTextOpacity || 100
                            )}
                            onChange={(value) => {
                                const { color, opacity } = parseColorAndOpacity(value as string);
                                onChange({
                                    ...config,
                                    themeConfig: {
                                        ...config.themeConfig,
                                        buttonTextColor: color,
                                        buttonTextOpacity: opacity,
                                    },
                                });
                            }}
                        />
                    </Box>
                </SidePanel.Section>
            </SidePanel.Content>
        </SidePanel>
    );
};

export default CustomizeTheme;

