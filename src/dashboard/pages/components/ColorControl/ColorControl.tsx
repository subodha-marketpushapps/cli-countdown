import React from "react";
import { Box, Text, Input } from "@wix/design-system";

export interface ColorControlProps {
  label: string;
  color: string | undefined;
  opacity: number | undefined;
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
}

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

const ColorControl: React.FC<ColorControlProps> = ({
  label,
  color,
  opacity = 100,
  onColorChange,
  onOpacityChange,
}) => {
  const hexColor = getHexColor(color);
  const currentOpacity = opacity || getOpacity(color);

  return (
    <Box direction="vertical" gap="8px">
      <Text secondary size="small">{label}</Text>
      <Box direction="horizontal" verticalAlign="middle" gap="12px" style={{ alignItems: 'center', width: '100%' }}>
        {/* Color Swatch */}
        <div
          style={{
            width: '24px',
            height: '24px',
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
                width: '144px',
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
                margin-top: -18px;
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
                margin-top: -18px;
              }
              input[type="range"]::-moz-range-track {
                background: transparent;
                height: 4px;
              }
            `}</style>
          </div>
        </Box>

        {/* Opacity Input - Reduced width */}
        <div style={{ width: '64px', flexShrink: 0 }}>
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
        </div>
      </Box>
    </Box>
  );
};

export default ColorControl;

