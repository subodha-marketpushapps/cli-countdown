import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box } from "@wix/design-system";
import { dashboard } from "@wix/dashboard";
import { WIDGET_KEY, PREVIEW_ACTIONS } from "../../../../constants";

interface WidgetBuilderBackgroundProps {
  children: React.ReactNode;
  backgroundMode: 'clean' | 'website';
  viewType: 'desktopView' | 'mobileView';
}

type WebsiteLoadStatus = 'idle' | 'loading' | 'loaded' | 'failed';

const WidgetBuilderBackground: React.FC<WidgetBuilderBackgroundProps> = ({
  children,
  backgroundMode,
  viewType,
}) => {
  const [websiteIframeRef, setWebsiteIframeRef] = useState<HTMLIFrameElement | null>(null);
  const [websiteLoadStatus, setWebsiteLoadStatus] = useState<WebsiteLoadStatus>('idle');
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const websiteTimeoutRef = useRef<number | null>(null);

  // Get site URL from dashboard
  useEffect(() => {
    const fetchSiteUrl = async () => {
      try {
        // Try to get site URL from dashboard API
        // The dashboard API may provide site info in different ways
        let url: string | undefined;
        
        // Method 1: Try dashboard.getSiteInfo if available
        if (typeof dashboard.getSiteInfo === 'function') {
          const siteInfo = await dashboard.getSiteInfo();
          url = siteInfo?.siteUrl;
        }
        
        // Method 2: Try to get from window.location (for development)
        if (!url && typeof window !== 'undefined') {
          // In Wix dashboard, we might be able to infer from context
          // For now, we'll check if there's a way to get it from the environment
          const hostname = window.location.hostname;
          if (hostname && !hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
            // This is a fallback - in production, the dashboard API should provide this
            url = `https://${hostname}`;
          }
        }
        
        if (url) {
          setSiteUrl(url);
        } else {
          console.warn('Site URL not available. Website background will not work until site is published.');
        }
      } catch (error) {
        console.warn('Failed to get site URL:', error);
      }
    };

    fetchSiteUrl();
  }, []);

  // Handle website iframe load success
  const handleWebsiteLoad = useCallback(() => {
    // Clear any existing timeout
    if (websiteTimeoutRef.current) {
      clearTimeout(websiteTimeoutRef.current);
      websiteTimeoutRef.current = null;
    }
    setWebsiteLoadStatus('loaded');
  }, []);

  // Handle website iframe load error
  const handleWebsiteError = useCallback(() => {
    // Clear any existing timeout
    if (websiteTimeoutRef.current) {
      clearTimeout(websiteTimeoutRef.current);
      websiteTimeoutRef.current = null;
    }
    setWebsiteLoadStatus('failed');
  }, []);

  // Initialize website loading when component mounts or conditions change
  useEffect(() => {
    // Run website loading logic when we're in website mode and have a site URL
    if (
      backgroundMode === "website" &&
      siteUrl &&
      siteUrl !== "" &&
      siteUrl !== "https://example.com" &&
      websiteLoadStatus !== "loaded"
    ) {
      setWebsiteLoadStatus('loading');

      // Set a timeout to mark as failed if it takes too long
      const timeout = window.setTimeout(() => {
        setWebsiteLoadStatus('failed');
      }, 15000); // 15 seconds timeout

      websiteTimeoutRef.current = timeout;

      return () => {
        clearTimeout(timeout);
        websiteTimeoutRef.current = null;
      };
    } else if (backgroundMode !== "website") {
      // Reset status when not in website mode
      if (websiteLoadStatus === "loading") {
        setWebsiteLoadStatus('idle');
      }
    }
  }, [siteUrl, backgroundMode, websiteLoadStatus]);

  // Send message to iframe to hide widgets when in preview mode
  useEffect(() => {
    const sendHideWidgetMessage = () => {
      if (
        websiteIframeRef?.contentWindow &&
        websiteLoadStatus === "loaded" &&
        backgroundMode === "website"
      ) {
        try {
          websiteIframeRef.contentWindow.postMessage(
            {
              action: PREVIEW_ACTIONS.HIDE,
              widgetKey: WIDGET_KEY,
              source: "widget-builder-preview",
            },
            "*"
          );
        } catch (error) {
          console.warn("Failed to send message to iframe:", error);
        }
      }
    };

    // Send message when iframe loads
    if (websiteLoadStatus === "loaded" && backgroundMode === "website") {
      // Send message immediately
      sendHideWidgetMessage();

      // Send again after delays to ensure widget scripts have loaded
      const delayedMessageTimeout = setTimeout(sendHideWidgetMessage, 1000);
      const secondDelayedMessageTimeout = setTimeout(sendHideWidgetMessage, 3000);

      return () => {
        clearTimeout(delayedMessageTimeout);
        clearTimeout(secondDelayedMessageTimeout);

        // On cleanup, attempt to show widgets back
        try {
          websiteIframeRef?.contentWindow?.postMessage(
            {
              action: PREVIEW_ACTIONS.SHOW,
              widgetKey: WIDGET_KEY,
              source: "widget-builder-preview:cleanup",
            },
            "*"
          );
        } catch (_) {}
      };
    }
  }, [websiteIframeRef, websiteLoadStatus, backgroundMode]);

  // Ensure widget is shown again when leaving website background
  useEffect(() => {
    const isWebsiteActive =
      backgroundMode === "website" &&
      websiteLoadStatus === "loaded";

    if (!isWebsiteActive && websiteIframeRef?.contentWindow) {
      try {
        websiteIframeRef.contentWindow.postMessage(
          {
            action: PREVIEW_ACTIONS.SHOW,
            widgetKey: WIDGET_KEY,
            source: "widget-builder-preview:mode-change",
          },
          "*"
        );
      } catch (_) {}
    }
  }, [websiteIframeRef, backgroundMode, viewType, websiteLoadStatus]);

  // On component unmount, try to SHOW the widget back
  useEffect(() => {
    return () => {
      try {
        websiteIframeRef?.contentWindow?.postMessage(
          {
            action: PREVIEW_ACTIONS.SHOW,
            widgetKey: WIDGET_KEY,
            source: "widget-builder-preview:unmount",
          },
          "*"
        );
      } catch (_) {}
    };
  }, [websiteIframeRef]);

  // Determine if website background should be visible
  const isWebsiteBackgroundVisible =
    backgroundMode === "website" &&
    websiteLoadStatus === "loaded" &&
    siteUrl !== null;

  // Determine if clean background should be visible (default)
  const isCleanBackgroundVisible =
    backgroundMode === "clean" ||
    websiteLoadStatus !== "loaded" ||
    !siteUrl;

  return (
    <Box
      backgroundColor="D70"
      width="100%"
      height="100%"
      position="relative"
      overflow="hidden"
    >
      {/* Website background iframe - render in both desktop and mobile views */}
      {siteUrl && (
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
            src={siteUrl}
            width="100%"
            height="100%"
            style={{
              border: "none",
              opacity: isWebsiteBackgroundVisible ? 1 : 0,
              pointerEvents: isWebsiteBackgroundVisible ? "auto" : "none",
              transition: "opacity 0.3s ease-in-out",
            }}
            onLoad={handleWebsiteLoad}
            onError={handleWebsiteError}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            referrerPolicy="no-referrer-when-downgrade"
            title="Website Background Preview"
          />

          {/* Soft inner shadows overlay - only in desktop view */}
          {viewType === "desktopView" && (
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              style={{
                pointerEvents: "none",
                opacity: isWebsiteBackgroundVisible ? 1 : 0,
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
          )}
        </Box>
      )}

      {/* Clean Background Layer */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        style={{
          backgroundColor: isCleanBackgroundVisible ? "#f1f1f5" : "transparent",
          transition: "background-color 0.3s ease-in-out",
        }}
        zIndex={3}
      />

      {/* Content Layer */}
      <Box
        position="relative"
        width="100%"
        height="100%"
        zIndex={4}
      >
        {children}
      </Box>
    </Box>
  );
};

export default WidgetBuilderBackground;

