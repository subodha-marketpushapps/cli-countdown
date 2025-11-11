import React from "react";
import { Box, ClickableCard, Text, Image, Divider } from "@wix/design-system";

interface MarketingCardProps {
  /** Main image for the card */
  image: string;
  /** App icon/logo */
  icon: string;
  /** App name/title */
  title: string;
  /** App description */
  description: string;
  /** Pricing text (e.g., "Free to install", "$9.99/month") */
  pricing?: string;
  /** Click handler for the card */
  onClick?: () => void;
  /** Alt text for images */
  imageAlt?: string;
  iconAlt?: string;
}

const MarketingCard: React.FC<MarketingCardProps> = ({
  image,
  icon,
  title,
  description,
  pricing,
  onClick,
  imageAlt = "",
  iconAlt = "",
}) => {
  return (
    <ClickableCard skin="shadow" onClick={onClick} hasPadding={false}>
      <Box direction="vertical" gap={0}>
        {/* Image Section with Icon Overlay */}
        <Box position="relative">
          <Box
            style={{
              aspectRatio: "3/2",
              overflow: "hidden",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <Image
              src={image}
              alt={imageAlt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
              }}
              borderRadius={"8px 8px 0 0 "}
            />
          </Box>

          {/* App Icon Overlay */}
          <Box
            style={{
              position: "absolute",
              bottom: "-15px",
              left: "15px",
              width: "42px",
              height: "42px",
              backgroundColor: "white",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={icon}
              alt={iconAlt}
              style={{
                width: "52px",
                height: "52px",
                objectFit: "cover",
                objectPosition: "center center",
                border: "2px solid white",
              }}
            />
          </Box>
        </Box>

        <Divider />

        {/* Content Section */}
        <Box padding={3} gap={2} direction="vertical">
          {/* Title and Description */}
          <Box direction="vertical" gap={0} style={{ minHeight: "84px" }}>
            <Text size="medium" weight="bold" skin="standard">
              {title}
            </Text>
            <Text size="small" weight="thin" skin="standard">
              {description}
            </Text>
          </Box>

          {/* Pricing Badge */}
          {pricing && (
            <Box direction="horizontal" gap="6px">
              <Text size="tiny" secondary weight="thin">
                {pricing}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </ClickableCard>
  );
};

export default MarketingCard;
