import React from 'react';
import { Box } from '@wix/design-system';

interface ClockStyleImageProps {
    svgPath: string;
    alt: string;
    fillColor?: string;
    backgroundColor?: string;
    width?: string;
    height?: string;
}

const ClockStyleImage: React.FC<ClockStyleImageProps> = ({
    svgPath,
    alt,
    fillColor = '#2563eb', // Primary button color
    backgroundColor = 'transparent',
    width = '90%',
    height = 'auto',
}) => {
    const [svgContent, setSvgContent] = React.useState<string>('');

    React.useEffect(() => {
        const loadAndModifySvg = async () => {
            try {
                let svgText = '';
                
                // Check if it's a data URI
                if (svgPath.startsWith('data:image/svg+xml')) {
                    // Decode data URI
                    const base64Match = svgPath.match(/data:image\/svg\+xml[^,]*,(.+)/);
                    if (base64Match) {
                        if (svgPath.includes('base64')) {
                            svgText = atob(base64Match[1]);
                        } else {
                            svgText = decodeURIComponent(base64Match[1]);
                        }
                    }
                } else {
                    // Fetch the SVG file
                    const response = await fetch(svgPath);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch SVG: ${response.statusText}`);
                    }
                    svgText = await response.text();
                }
                
                // Replace fill colors with the primary button color
                // Replace white fills with the primary color
                let modifiedSvg = svgText.replace(/fill="white"/gi, `fill="${fillColor}"`);
                // Replace black fills with white (for contrast on colored background)
                modifiedSvg = modifiedSvg.replace(/fill="black"/gi, 'fill="white"');
                // Replace any hex color fills (except the ones we just set) with the primary color
                // This handles any other colored elements
                modifiedSvg = modifiedSvg.replace(/fill="#[0-9A-Fa-f]{3,8}"/gi, (match) => {
                    // Skip if it's already white or black (we've handled those)
                    if (match.toLowerCase().includes('white') || match.toLowerCase().includes('black')) {
                        return match;
                    }
                    return `fill="${fillColor}"`;
                });
                setSvgContent(modifiedSvg);
            } catch (error) {
                console.error('Error loading SVG:', error);
                // Fallback: use the path directly as an image
                setSvgContent('');
            }
        };
        
        loadAndModifySvg();
    }, [svgPath, fillColor]);

    // If SVG content is loaded, render it inline
    if (svgContent) {
        return (
            <Box
                width={width}
                align="center"
                padding="16px"
                backgroundColor={backgroundColor}
                style={{ 
                    borderRadius: "0",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        width: width,
                        maxWidth: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                />
            </Box>
        );
    }

    // Fallback: render as regular image while loading
    return (
        <Box
            width={width}
            align="center"
            backgroundColor={backgroundColor}
            style={{ borderRadius: "0" }}
        >
            <img
                src={svgPath}
                alt={alt}
                style={{
                    width: width || '100%',
                    maxWidth: '100%',
                    height: height || 'auto',
                }}
            />
        </Box>
    );
};

export default ClockStyleImage;

