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
  viewType?: 'desktopView' | 'mobileView';
  backgroundMode?: 'clean' | 'website';
  onViewTypeChange?: (viewType: 'desktopView' | 'mobileView') => void;
  onBackgroundModeChange?: (backgroundMode: 'clean' | 'website') => void;
}

const WidgetEditorHeader: React.FC<WidgetEditorHeaderProps> = ({
  onBackClicked,
  onPublish,
  onSave,
  onPreview,
  isSaving,
  isPublishing,
  isDataLoaded,
  viewType: externalViewType,
  backgroundMode: externalBackgroundMode,
  onViewTypeChange,
  onBackgroundModeChange,
}) => {
  const [internalViewType, setInternalViewType] = useState<"desktopView" | "mobileView">("desktopView");
  const [internalBackgroundMode, setInternalBackgroundMode] = useState<"clean" | "website">("website");

  // Use external state if provided, otherwise use internal state
  const viewType = externalViewType ?? internalViewType;
  const backgroundMode = externalBackgroundMode ?? internalBackgroundMode;

  const changeViewType = (value: string) => {
    const newViewType = value as "desktopView" | "mobileView";
    if (onViewTypeChange) {
      onViewTypeChange(newViewType);
    } else {
      setInternalViewType(newViewType);
    }
    if (value === "mobileView") {
      const newBackgroundMode = "clean" as "clean" | "website";
      if (onBackgroundModeChange) {
        onBackgroundModeChange(newBackgroundMode);
      } else {
        setInternalBackgroundMode(newBackgroundMode);
      }
    }
  };

  const changeBackgroundMode = (value: string) => {
    const newBackgroundMode = value as "clean" | "website";
    if (onBackgroundModeChange) {
      onBackgroundModeChange(newBackgroundMode);
    } else {
      setInternalBackgroundMode(newBackgroundMode);
    }
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

