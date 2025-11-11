import React from "react";
import {
  Page,
  Box,
  IconButton,
  Tooltip,
  Layout,
  Cell,
  Button,
} from "@wix/design-system";
import * as Icons from "@wix/wix-ui-icons-common";
import { HELP_CENTER_URL } from "../../../constants";
import PageLayout from "../../components/common/PageLayout";
import WidgetSection from "./WidgetSection";
import { useWidgetPreviewControl } from "../../hooks/useWidgetPreviewControl";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useWidgetStateManager } from "../../hooks/useWidgetStateManager";
import MarketingSection from "./MarketingSection";

interface OverviewTabProps {
  onEditWidget?: () => Promise<void>;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onEditWidget }) => {
  // Load embedded widget data same as widget builder
  const {
    draftState,
    publishedState,
    isLoading: isLoadingWidget,
  } = useWidgetStateManager({
    autoSave: false, // Read-only mode for overview
    enableValidation: false, // No validation needed for preview
  });

  const { navigateToWidgetBuilderFromOverview, isNavigating } =
    useAppNavigation();

  // Initialize preview control for widget (use published state for overview to show actual live widget)
  const previewControl = useWidgetPreviewControl(
    publishedState.content,
    publishedState.styles
  );

  const handleEditWidget = async () => {
    try {
      if (onEditWidget) {
        await onEditWidget();
      } else {
        await navigateToWidgetBuilderFromOverview();
      }
    } catch (error) {
      console.error("Failed to navigate to widget builder:", error);
    }
  };

  function openHelpCenter() {
    window.open(HELP_CENTER_URL, "_blank", "noopener");
  }

  function handleExploreMore() {
    window.open("https://www.wix.com/app-market/developer/marketpushapps", "_blank", "noopener");
  }
  return (
    <PageLayout
      title="WhatsApp Chat"
      subtitle="Manage your WhatsApp chat widget from here."
      actionBar={
        <Box gap={2}>
          <Button
            prefixIcon={<Icons.Edit />}
            onClick={handleEditWidget}
            disabled={isNavigating || isLoadingWidget}
          >
            {isNavigating ? "Navigating..." : "Edit Widget"}
          </Button>
          <Tooltip content="Open support center">
            <IconButton skin="inverted" onClick={openHelpCenter}>
              <Icons.Help />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      <Page.Content>
        <Layout>
          {/* Widget Preview Section */}
          <Cell>
            <WidgetSection
              onEditWidget={handleEditWidget}
              isNavigating={isNavigating}
              isLoadingWidget={isLoadingWidget}
              publishedState={publishedState}
              previewControl={previewControl}
            />
          </Cell>
          <Cell>


            <Page.Section
              title="Recommended Apps for Your Business"
              subtitle="Discover powerful apps to grow your online presence."
              actionsBar={
                <Box>
                  <Button priority="secondary" suffixIcon={<Icons.ExternalLink />} onClick={handleExploreMore}>Explore More</Button>
                </Box>
              }
            />


          </Cell>
          <Cell>
            <MarketingSection />
          </Cell>
        </Layout>
      </Page.Content>
    </PageLayout>
  );
};

export default OverviewTab;
