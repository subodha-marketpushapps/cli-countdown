import React, { useState } from "react";
import {
  Box,
  Text,
  FormField,
  SidePanel,
  Input,
  Layout,
  SegmentedToggle,
  IconButton,
  TextButton,
} from "@wix/design-system";
import * as Icons from "@wix/wix-ui-icons-common";
import { DEFAULT_PANEL_WIDTH } from "../SidePanelContainer";
import { renderSectionTitle } from "../utils/renderSectionTitle";
import { TimerConfig } from "../../types";

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
  
  // Helper function to convert hex color to rgba with opacity
  const hexToRgba = (hex: string, opacity: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  // Helper function to extract hex from rgba or return hex
  const getHexColor = (color: string | undefined): string => {
    if (!color) return '#000000';
    if (color.startsWith('#')) return color;
    if (color.startsWith('rgba')) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
    }
    return '#000000';
  };

  // Helper function to extract opacity from rgba or return 100
  const getOpacity = (color: string | undefined): number => {
    if (!color) return 100;
    if (color.startsWith('rgba')) {
      const match = color.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      if (match) {
        return Math.round(parseFloat(match[1]) * 100);
      }
    }
    return 100;
  };

  // Color control component
  const ColorControl: React.FC<{
    label: string;
    color: string | undefined;
    opacity: number | undefined;
    onColorChange: (color: string) => void;
    onOpacityChange: (opacity: number) => void;
  }> = ({ label, color, opacity = 100, onColorChange, onOpacityChange }) => {
    const hexColor = getHexColor(color);
    const currentOpacity = opacity || getOpacity(color);

    return (
      <Box direction="vertical" gap="8px">
        <Text secondary size="small">{label}</Text>
        <Box direction="horizontal" verticalAlign="middle" gap="12px" style={{ alignItems: 'center', width: '100%' }}>
          {/* Color Swatch */}
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: hexColor,
              border: '1px solid #E0E0E0',
              borderRadius: '4px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'color';
              input.value = hexColor;
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                onColorChange(target.value);
              };
              input.click();
            }}
          />
          
          {/* Opacity Slider - Increased width */}
          <Box style={{ flex: 1, minWidth: 0, position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              {/* Checkered background for transparency */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundImage: `
                    linear-gradient(45deg, #E0E0E0 25%, transparent 25%),
                    linear-gradient(-45deg, #E0E0E0 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #E0E0E0 75%),
                    linear-gradient(-45deg, transparent 75%, #E0E0E0 75%)
                  `,
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                  borderRadius: '2px',
                }}
              />
              {/* Color gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(to right, ${hexToRgba(hexColor, 0)} 0%, ${hexToRgba(hexColor, 100)} 100%)`,
                  borderRadius: '2px',
                }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={currentOpacity}
                onChange={(e) => onOpacityChange(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '4px',
                  position: 'relative',
                  zIndex: 1,
                  background: 'transparent',
                  outline: 'none',
                  WebkitAppearance: 'none',
                  cursor: 'pointer',
                }}
              />
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: #FFFFFF;
                  border: 2px solid #0073E6;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  position: relative;
                  z-index: 2;
                }
                input[type="range"]::-moz-range-thumb {
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: #FFFFFF;
                  border: 2px solid #0073E6;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  position: relative;
                  z-index: 2;
                }
                input[type="range"]::-moz-range-track {
                  background: transparent;
                  height: 4px;
                }
              `}</style>
            </div>
          </Box>

          {/* Opacity Input - Reduced width */}
          <Box style={{ width: '45px', flexShrink: 0 }}>
            <Input
              size="small"
              value={`${currentOpacity} %`}
              onChange={(e) => {
                const value = parseInt(e.target.value.replace(/\s*%\s*/g, ''));
                if (!isNaN(value) && value >= 0 && value <= 100) {
                  onOpacityChange(value);
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    );
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
                <SegmentedToggle
                  selected={backgroundType}
                  onClick={(_, value: string) => setBackgroundType(value as 'color' | 'image')}
                >
                  <SegmentedToggle.Icon value="color" tooltipText="Solid Color">
                    <Box
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#000000',
                        border: '1px solid #E0E0E0',
                      }}
                    />
                  </SegmentedToggle.Icon>
                  <SegmentedToggle.Icon value="image" tooltipText="Image">
                    <Icons.Image />
                  </SegmentedToggle.Icon>
                </SegmentedToggle>

                {backgroundType === 'image' && (
                  <>
                    {/* Image Placeholder */}
                    <Box
                      style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: '#E3F2FD',
                        border: '1px solid #E0E0E0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Simple mountain and sun illustration */}
                      <svg width="100%" height="100%" viewBox="0 0 200 150" style={{ position: 'absolute' }}>
                        {/* Sun */}
                        <circle cx="160" cy="40" r="25" fill="#FFD700" />
                        {/* Mountains */}
                        <path d="M0,150 L60,80 L120,120 L200,60 L200,150 Z" fill="#81C784" />
                        <path d="M40,150 L100,70 L160,110 L200,50 L200,150 Z" fill="#66BB6A" />
                      </svg>
                      <Text size="small" weight="normal" style={{ position: 'relative', zIndex: 1, color: '#666' }}>
                        Image
                      </Text>
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
                  label="Background Color"
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

