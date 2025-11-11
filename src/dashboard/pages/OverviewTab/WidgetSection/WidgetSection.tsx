import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  Loader,
  Layout,
  Cell,
  IconButton,
  Tooltip,
  Badge,
} from "@wix/design-system";
import * as Icons from "@wix/wix-ui-icons-common";
import { useRecoilValue } from "recoil";
import { wixSiteDataState } from "../../../services/state";
import { WIDGET_KEY, PREVIEW_ACTIONS } from "../../../../constants";
import WidgetController from "../../../../components/WidgetWhatsappChat/WidgetController";

interface WidgetSectionProps {
  onEditWidget: () => void;
  isNavigating: boolean;
  isLoadingWidget: boolean;
  publishedState: any;
  previewControl: any;
}

const WidgetSection: React.FC<WidgetSectionProps> = ({
  onEditWidget,
  isNavigating,
  isLoadingWidget,
  publishedState,
  previewControl,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);
  const wixSiteData = useRecoilValue(wixSiteDataState);
  const [websiteIframeRef, setWebsiteIframeRef] =
    useState<HTMLIFrameElement | null>(null);
  const [websiteLoaded, setWebsiteLoaded] = useState(false);

  // Handle website iframe load
  const handleWebsiteLoad = useCallback(() => {
    setWebsiteLoaded(true);
  }, []);

  // Send message to iframe to hide the live widget when preview loads
  useEffect(() => {
    const sendHideWidgetMessage = () => {
      if (websiteIframeRef?.contentWindow && websiteLoaded) {
        try {
          websiteIframeRef.contentWindow.postMessage(
            {
              action: PREVIEW_ACTIONS.HIDE,
              widgetKey: WIDGET_KEY,
              source: "overview-widget-preview",
            },
            "*"
          );
        } catch (error) {
          console.warn("Failed to send message to iframe:", error);
        }
      }
    };

    if (websiteLoaded) {
      // Send message immediately
      sendHideWidgetMessage();

      // Send again after delays to ensure widget scripts have loaded
      const timeout1 = setTimeout(sendHideWidgetMessage, 1000);
      const timeout2 = setTimeout(sendHideWidgetMessage, 3000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [websiteIframeRef, websiteLoaded]);

  // Cleanup: show widget back when component unmounts
  useEffect(() => {
    return () => {
      try {
        websiteIframeRef?.contentWindow?.postMessage(
          {
            action: PREVIEW_ACTIONS.SHOW,
            widgetKey: WIDGET_KEY,
            source: "overview-widget-preview:cleanup",
          },
          "*"
        );
      } catch (_) {}
    };
  }, [websiteIframeRef]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        borderRadius={8}
        padding={0.5}
        backgroundColor="D80"
        display="grid"
        minHeight="max(60vh, 680px)"
      >
        <Layout>
          <Cell span={12}>
            <Box
              borderRadius="8px"
              position="relative"
              display="grid"
              height="100%"
              width="100%"
              overflow="hidden"
            >
              {/* Website Background iframe */}
              {wixSiteData?.siteUrl && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  zIndex={1}
                >
                  <iframe
                    ref={setWebsiteIframeRef}
                    src={wixSiteData.siteUrl}
                    width="100%"
                    height="100%"
                    style={{
                      border: "none",
                      opacity: websiteLoaded ? 1 : 0,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                    onLoad={handleWebsiteLoad}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    title="Website Background Preview"
                  />

                  {/* Soft inner shadows overlay */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    style={{
                      pointerEvents: "none",
                      opacity: websiteLoaded ? 1 : 0,
                      transition: "opacity 0.3s ease-in-out",
                      boxShadow: `
                        inset 0 0 60px rgba(0, 0, 0, 0.04),
                        inset 0 0 120px rgba(0, 0, 0, 0.02),
                        inset 0 0 200px rgba(0, 0, 0, 0.01),
                        inset 0 4px 20px rgba(0, 0, 0, 0.03),
                        inset 4px 0 20px rgba(0, 0, 0, 0.03),
                        inset -4px 0 20px rgba(0, 0, 0, 0.03),
                        inset 0 -4px 20px rgba(0, 0, 0, 0.03)
                      `,
                    }}
                    zIndex={2}
                  />
                </Box>
              )}

              {/* Fallback gradient background */}
              <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                style={{
                  backgroundImage:
                    "linear-gradient(307deg,#d4e5f2 10%,#eee8e5)",
                  opacity: websiteLoaded ? 0 : 1,
                  transition: "opacity 0.3s ease-in-out",
                }}
                zIndex={0}
              />

              {/* Content Layer */}
              <Box position="relative" width="100%" height="100%" zIndex={3}>
                <Box
                  position="absolute"
                  top="16px"
                  right="16px"
                  zIndex={1}
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered
                      ? "translateY(0px)"
                      : "translateY(-8px)",
                    transition: "all 0.2s ease-in-out",
                    pointerEvents: isHovered ? "auto" : "none",
                  }}
                >
                  <Tooltip content="Edit Widget">
                    <IconButton
                      size="small"
                      onClick={onEditWidget}
                      disabled={isNavigating || isLoadingWidget}
                      priority="secondary"
                    >
                      <Icons.Edit />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Widget Status Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    zIndex: 1,
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setIsBadgeHovered(true)}
                  onMouseLeave={() => setIsBadgeHovered(false)}
                  onClick={onEditWidget}
                >
                  {publishedState?.isVisible ? (
                    <Tooltip content="Widget is live on your site. Click to edit settings.">
                      <Badge
                        skin="success"
                        suffixIcon={
                          isBadgeHovered ? (
                            <Icons.ChevronRightSmall />
                          ) : undefined
                        }
                      >
                        Live
                      </Badge>
                    </Tooltip>
                  ) : (
                    <Tooltip content="Widget is hidden from your site. Click to publish.">
                      <Badge
                        skin="warning"
                        suffixIcon={
                          isBadgeHovered ? (
                            <Icons.ChevronRightSmall />
                          ) : undefined
                        }
                      >
                        Hidden
                      </Badge>
                    </Tooltip>
                  )}
                </div>

                {isLoadingWidget ? (
                  <Box
                    position="absolute"
                    width="100%"
                    height="100%"
                    align="center"
                    verticalAlign="middle"
                    gap={1}
                    direction="vertical"
                  >
                    <Loader size="small" />
                    <Text>Loading your widget...</Text>
                  </Box>
                ) : (
                  <WidgetController
                    styles={publishedState.styles}
                    widgetContent={publishedState.content}
                    isDevMode={true}
                    manualMobile={false}
                    forceModalState={previewControl.state.forceModalOpen}
                    forceSelectedAgent={previewControl.state.forceSelectedAgent}
                    previewMode={previewControl.state.previewMode}
                    forceStep={previewControl.state.forceStep}
                    previewAgent={previewControl.state.previewAgent}
                    onStateChange={(state) => {
                      console.log("Widget state changed:", state);
                    }}
                  />
                )}
              </Box>
            </Box>
          </Cell>
        </Layout>
      </Box>
    </div>
  );
};

export default WidgetSection;
