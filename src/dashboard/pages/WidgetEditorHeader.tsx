import React, { useState } from "react";
import {
  ComposerHeader,
  Button,
  Box,
  Divider,
  Loader,
  SegmentedToggle,
  TextButton,
  IconButton,
  Text,
} from "@wix/design-system";
import * as Icons from "@wix/wix-ui-icons-common";

interface WidgetEditorHeaderProps {
  onBackClicked?: () => void;
  onPublish: () => void;
  onSave: () => void;
  onPreview?: () => void;
  isSaving: boolean;
  isPublishing: boolean;
  isDataLoaded: boolean;
}

const WidgetEditorHeader: React.FC<WidgetEditorHeaderProps> = ({
  onBackClicked,
  onPublish,
  onSave,
  onPreview,
  isSaving,
  isPublishing,
  isDataLoaded,
}) => {
  const [viewType, setViewType] = useState<"desktopView" | "mobileView">("desktopView");
  const [backgroundMode, setBackgroundMode] = useState<"clean" | "website">("website");

  const changeViewType = (value: string) => {
    setViewType(value as "desktopView" | "mobileView");
    if (value === "mobileView") {
      setBackgroundMode("clean");
    }
  };

  const changeBackgroundMode = (value: string) => {
    setBackgroundMode(value as "clean" | "website");
  };

  return (
    <ComposerHeader
      backButtonValue="Back to Overview"
      onBackClick={onBackClicked}
    >
      <ComposerHeader.Actions>
        <Box verticalAlign="middle">
          <SegmentedToggle
            selected={viewType}
            onClick={(_, value: string) => changeViewType(value)}
          >
            <SegmentedToggle.Icon value={"desktopView"} tooltipText="Desktop">
              <Icons.Desktop />
            </SegmentedToggle.Icon>
            <SegmentedToggle.Icon value={"mobileView"} tooltipText="Mobile">
              <Icons.Mobile />
            </SegmentedToggle.Icon>
          </SegmentedToggle>

          {/* Only show background toggle in desktop view */}
          {viewType === "desktopView" && (
            <>
              <Box height={24} align="center" marginLeft={4} marginRight={4}>
                <Divider direction="vertical" />
              </Box>
              <SegmentedToggle
                selected={backgroundMode}
                onClick={(_, value: string) => changeBackgroundMode(value)}
              >
                <SegmentedToggle.Icon
                  value={"clean"}
                  tooltipText="Clean Background"
                >
                  <Icons.CircleLarge />
                </SegmentedToggle.Icon>
                <SegmentedToggle.Icon
                  value={"website"}
                  tooltipText="Website Background"
                >
                  <Icons.Languages />
                </SegmentedToggle.Icon>
              </SegmentedToggle>
            </>
          )}
        </Box>
      </ComposerHeader.Actions>
      <ComposerHeader.Actions justifyContent="center">
        {isSaving && (
          <Box verticalAlign="middle" gap={2}>
            <Text size="small" secondary>
              Saving...
            </Text>
            <Loader size="tiny" />
          </Box>
        )}
      </ComposerHeader.Actions>
      <ComposerHeader.Actions justifyContent="flex-end">
        {isDataLoaded && (
          <>
            <IconButton priority="secondary" size="small">
              <Icons.Undo />
            </IconButton>
            <IconButton priority="secondary" size="small">
              <Icons.Redo />
            </IconButton>
            <Box height={24} align="center" marginLeft={4} marginRight={4}>
              <Divider direction="vertical" />
            </Box>
          </>
        )}
      </ComposerHeader.Actions>
      <ComposerHeader.MainActions>
        <Box gap={4} verticalAlign="middle">
          <TextButton onClick={onPreview || (() => {})}>Preview</TextButton>
          <Box gap={3}>
            <Button
              onClick={onPublish}
              priority="primary"
              fullWidth
              disabled={!isDataLoaded || isSaving || isPublishing}
            >
              {isPublishing ? <Loader size="tiny" /> : "Publish"}
            </Button>
          </Box>
        </Box>
      </ComposerHeader.MainActions>
    </ComposerHeader>
  );
};

export default WidgetEditorHeader;

