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
import { TimerConfig } from "../../types";
import ColorControl from "../../components/ColorControl";

interface CustomizeThemeProps {
    config: TimerConfig;
    onChange: (config: TimerConfig) => void;
    onClose: () => void;
    onBack: () => void;
}

const CustomizeTheme: React.FC<CustomizeThemeProps> = ({
    config,
    onChange,
    onClose,
    onBack,
}) => {
    const [backgroundType, setBackgroundType] = useState<'color' | 'image'>('image');
    const [imageUrl, setImageUrl] = useState<string | undefined>(config.themeConfig?.backgroundImageUrl);

    // Sync imageUrl with config changes
    useEffect(() => {
        setImageUrl(config.themeConfig?.backgroundImageUrl);
    }, [config.themeConfig?.backgroundImageUrl]);

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
                                        onClick={(_, value: string) => setBackgroundType(value as 'color' | 'image')}
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
                                        <ColorControl
                                            label="Image Opacity"
                                            color={config.themeConfig?.imageOpacityColor || '#000000'}
                                            opacity={config.themeConfig?.imageOpacity || 100}
                                            onColorChange={(color) => {
                                                onChange({
                                                    ...config,
                                                    themeConfig: {
                                                        ...config.themeConfig,
                                                        imageOpacityColor: color,
                                                    },
                                                });
                                            }}
                                            onOpacityChange={(opacity) => {
                                                onChange({
                                                    ...config,
                                                    themeConfig: {
                                                        ...config.themeConfig,
                                                        imageOpacity: opacity,
                                                    },
                                                });
                                            }}
                                        />
                                    </>
                                )}

                                {/* Background Color */}
                                <ColorControl
                                    label={backgroundType === 'image' ? "Background Color" : "Solid Color"}
                                    color={config.themeConfig?.backgroundColor || '#000000'}
                                    opacity={config.themeConfig?.backgroundOpacity || 100}
                                    onColorChange={(color) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                backgroundColor: color,
                                            },
                                        });
                                    }}
                                    onOpacityChange={(opacity) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
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
                    <SidePanel.Field divider={false}>
                        <FormField>
                            <Box direction="vertical" gap="16px">
                                <ColorControl
                                    label="Title Color"
                                    color={config.themeConfig?.titleColor || '#FFD700'}
                                    opacity={config.themeConfig?.titleOpacity || 100}
                                    onColorChange={(color) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                titleColor: color,
                                            },
                                        });
                                    }}
                                    onOpacityChange={(opacity) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                titleOpacity: opacity,
                                            },
                                        });
                                    }}
                                />
                                <ColorControl
                                    label="Subtitle Color"
                                    color={config.themeConfig?.subtitleColor || '#FFD700'}
                                    opacity={config.themeConfig?.subtitleOpacity || 100}
                                    onColorChange={(color) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                subtitleColor: color,
                                            },
                                        });
                                    }}
                                    onOpacityChange={(opacity) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                subtitleOpacity: opacity,
                                            },
                                        });
                                    }}
                                />
                            </Box>
                        </FormField>
                    </SidePanel.Field>
                </SidePanel.Section>

                {/* Timer Colors Section */}
                <SidePanel.Section title={renderSectionTitle("Timer Colors")}>
                    <SidePanel.Field divider={false}>
                        <FormField>
                            <Box direction="vertical" gap="16px">
                                <ColorControl
                                    label="Countdown Label Text"
                                    color={config.themeConfig?.countdownLabelColor || '#FFD700'}
                                    opacity={config.themeConfig?.countdownLabelOpacity || 100}
                                    onColorChange={(color) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                countdownLabelColor: color,
                                            },
                                        });
                                    }}
                                    onOpacityChange={(opacity) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                countdownLabelOpacity: opacity,
                                            },
                                        });
                                    }}
                                />
                                <ColorControl
                                    label="Countdown Box Background"
                                    color={config.themeConfig?.countdownBoxBackgroundColor || '#FFD700'}
                                    opacity={config.themeConfig?.countdownBoxBackgroundOpacity || 100}
                                    onColorChange={(color) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                countdownBoxBackgroundColor: color,
                                            },
                                        });
                                    }}
                                    onOpacityChange={(opacity) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                countdownBoxBackgroundOpacity: opacity,
                                            },
                                        });
                                    }}
                                />
                                <ColorControl
                                    label="Countdown Box Text"
                                    color={config.themeConfig?.countdownBoxTextColor || '#000000'}
                                    opacity={config.themeConfig?.countdownBoxTextOpacity || 100}
                                    onColorChange={(color) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                countdownBoxTextColor: color,
                                            },
                                        });
                                    }}
                                    onOpacityChange={(opacity) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                countdownBoxTextOpacity: opacity,
                                            },
                                        });
                                    }}
                                />
                            </Box>
                        </FormField>
                    </SidePanel.Field>
                </SidePanel.Section>

                {/* Button Colors Section */}
                <SidePanel.Section title={renderSectionTitle("Button Colors")}>
                    <SidePanel.Field divider={false}>
                        <FormField>
                            <Box direction="vertical" gap="16px">
                                <ColorControl
                                    label="Button Background"
                                    color={config.themeConfig?.buttonBackgroundColor || '#FFD700'}
                                    opacity={config.themeConfig?.buttonBackgroundOpacity || 100}
                                    onColorChange={(color) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                buttonBackgroundColor: color,
                                            },
                                        });
                                    }}
                                    onOpacityChange={(opacity) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                buttonBackgroundOpacity: opacity,
                                            },
                                        });
                                    }}
                                />
                                <ColorControl
                                    label="Button Text Color"
                                    color={config.themeConfig?.buttonTextColor || '#000000'}
                                    opacity={config.themeConfig?.buttonTextOpacity || 100}
                                    onColorChange={(color) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                buttonTextColor: color,
                                            },
                                        });
                                    }}
                                    onOpacityChange={(opacity) => {
                                        onChange({
                                            ...config,
                                            themeConfig: {
                                                ...config.themeConfig,
                                                buttonTextOpacity: opacity,
                                            },
                                        });
                                    }}
                                />
                            </Box>
                        </FormField>
                    </SidePanel.Field>
                </SidePanel.Section>
            </SidePanel.Content>
        </SidePanel>
    );
};

export default CustomizeTheme;

