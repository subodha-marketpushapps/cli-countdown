import React, { useState, useEffect } from "react";
import * as Icons from "@wix/wix-ui-icons-common";
import {
  Box,
  Button,
  MarketingPageLayoutContent,
  FormField,
  RadioGroup,
  Slider,
  Collapse,
  Layout,
  Cell,
  Thumbnail,
  Loader,
  Text,
} from "@wix/design-system";
import { useRecoilState, useRecoilValue } from "recoil";

import ImageThumb1 from "../../../assets/images/image_thumb-theme-01.png";
import ImageThumb2 from "../../../assets/images/image_thumb-theme-02.png";
import ImageThumb3 from "../../../assets/images/image_thumb-theme-03.png";
import ImageThumb4 from "../../../assets/images/image_thumb-theme-04.png";

import { DEFAULT_WHATSAPP_AGENTS } from "../../../constants";
import * as THEMES_DATA from "../WidgetBuilder/SidePanels/PanelDesign/widgetThemes.js";

import WidgetController from "../../../components/WidgetWhatsappChat/WidgetController";

import { draftWidgetState, wixSiteDataState } from "../../services/state";
import { useEmbeds } from "../../hooks/wix-embeds";
import { objectToBase64 } from "../../utils/base64-utils";

import { useStatusToast } from "../../services/providers/StatusToastProvider";
import { useWidgetPreviewControl } from "../../hooks/useWidgetPreviewControl";
import { InputMobileNumber } from "../../components/ui/FormInputs";

interface WidgetOnboardingProps {
  onBuildClicked?: () => Promise<void>;
}

const WidgetOnboarding: React.FC<WidgetOnboardingProps> = ({
  onBuildClicked,
}) => {
  const [draft, setDraft] = useRecoilState(draftWidgetState);
  const wixSiteData = useRecoilValue(wixSiteDataState);
  const { embedScript } = useEmbeds();
  const { addToast, clearToasts } = useStatusToast();

  // Initialize preview control for widget
  const previewControl = useWidgetPreviewControl(draft.content, draft.styles);

  const [behavior, setBehavior] = useState("single-chat");
  const [theme, setTheme] = useState(1);
  const [teamSize, setTeamSize] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [samplePhoneNumber, setSamplePhoneNumber] = useState<string | null>(
    null
  );
  const [samplePhoneStatus, setSamplePhoneStatus] = useState<
    "unknown" | "valid" | "invalid"
  >("unknown");

  // Initialize preview for default behavior
  useEffect(() => {
    // Show initial preview for single-chat behavior
    const timer = setTimeout(() => {
      previewControl.showFullWidget();
      previewControl.openModal();
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    if (behavior === "multi-chat") {
      setDraft((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          members: DEFAULT_WHATSAPP_AGENTS.slice(0, teamSize).map((a) => ({
            ...a,
            phoneNumber: samplePhoneNumber ?? a.phoneNumber,
          })),
        },
      }));
    }
  }, [teamSize, behavior, samplePhoneNumber, setDraft]);

  // Update the header subtitle with real site owner email when available
  useEffect(() => {
    if (wixSiteData.email) {
      setDraft((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          headerSubtitle: `We are happy to help you with any questions you might have. Please click one of our representatives below to send a message or email us at ${wixSiteData.email}.`,
        },
      }));
    }
  }, [wixSiteData.email, setDraft]);

  const handleStartClick = async () => {
    // Block continue when phone number is required and invalid/not validated
    const isTeam = behavior === "multi-chat";
    if (samplePhoneStatus === "invalid") {
      clearToasts("onboarding-toast");
      addToast({
        content:
          "Invalid mobile number. Please correct it or leave the field empty.",
        status: "warning",
        customId: "onboarding-toast",
      });
      return;
    }

    setIsLoading(true);
    // Save draft only, do not publish
    embedScript.mutate(
      {
        widgetState: objectToBase64(draft),
        draftWidgetState: objectToBase64(draft),
      },
      {
        onSuccess: async () => {
          clearToasts("onboarding-toast");
          addToast({
            content: "Draft saved successfully",
            status: "success",
            customId: "onboarding-toast",
          });

          try {
            if (onBuildClicked) {
              await onBuildClicked();
            }
          } catch (error) {
            console.error("Navigation error:", error);
            clearToasts("onboarding-toast");
            addToast({
              content: "Navigation failed. Please try again.",
              status: "error",
              customId: "onboarding-toast",
            });
          } finally {
            setIsLoading(false);
          }
        },
        onError: (error: unknown) => {
          setIsLoading(false);
          clearToasts("onboarding-toast");
          addToast({
            content: "Failed to save draft. Please try again.",
            status: "error",
            customId: "onboarding-toast",
          });
          console.error("Failed to save draft:", error);
        },
      }
    );
  };

  // Handler for radio group change
  const handleBehaviorChange = (
    behavior: "direct" | "single-chat" | "multi-chat"
  ) => {
    if (typeof behavior === "string") {
      setBehavior(behavior);
      setDraft((prev) => {
        let updatedContent = {
          ...prev.content,
          mainBehavior: behavior as "direct" | "single-chat" | "multi-chat",
        };
        if (behavior === "single-chat") {
          updatedContent = {
            ...updatedContent,
            members: [
              {
                ...DEFAULT_WHATSAPP_AGENTS[0],
                phoneNumber:
                  samplePhoneNumber ?? DEFAULT_WHATSAPP_AGENTS[0].phoneNumber,
              },
            ],
          };
        }
        return {
          ...prev,
          content: updatedContent,
        };
      });

      // Auto-adjust preview based on behavior change
      previewControl.simulateBehaviorChange(behavior);

      // Show the modal briefly for single-chat and multi-chat, then revert to auto mode
      if (behavior === "single-chat" || behavior === "multi-chat") {
        setTimeout(() => {
          // Open modal to show user the difference
          previewControl.openModal();

          // Then revert to auto mode after a brief moment so user can interact naturally
          setTimeout(() => {
            previewControl.autoModal();
          }, 1000); // Show for 1 second, then back to auto
        }, 50);
      } else if (behavior === "direct") {
        // For direct mode, just ensure modal is closed and stay in auto mode
        setTimeout(() => {
          previewControl.autoModal();
        }, 50);
      }
    }
  };

  // Handler for team size slider change
  const handleTeamSizeChange = (value: number | number[]) => {
    if (typeof value === "number") setTeamSize(value);
    else if (Array.isArray(value) && typeof value[0] === "number")
      setTeamSize(value[0]);

    // Automatically refresh the preview when team size changes
    if (behavior === "multi-chat") {
      setTimeout(() => {
        previewControl.openModal();
      }, 300);
    }
  };

  const themeOptions = [
    {
      id: 2,
      name: "Pure Light",
      image: ImageThumb1,
      themeStyles: THEMES_DATA.themeLight,
    },
    {
      id: 1,
      name: "Default Green",
      image: ImageThumb2,
      themeStyles: THEMES_DATA.themeDefaultGreen,
    },
    {
      id: 3,
      name: "Dark Green",
      image: ImageThumb3,
      themeStyles: THEMES_DATA.themeDarkGreen,
    },
    {
      id: 4,
      name: "Dark",
      image: ImageThumb4,
      themeStyles: THEMES_DATA.themeDark,
    },
  ];

  const handleThemeSelect = (option: (typeof themeOptions)[0]) => {
    setTheme(option.id);
    setDraft((prev) => ({
      ...prev,
      styles: {
        ...prev.styles,
        ...option.themeStyles,
        D_Widget_Theme: option.name,
      },
    }));

    // Automatically refresh preview when theme changes
    setTimeout(() => {
      if (behavior === "single-chat" || behavior === "multi-chat") {
        previewControl.openModal();
      }
    }, 300);
  };

  // When user provides a sample phone number, feed it into current sample agent(s)
  const handleSamplePhoneValid = (formattedNumber: string) => {
    setSamplePhoneNumber(formattedNumber);
    setSamplePhoneStatus("valid");
    setDraft((prev) => {
      const members = prev.content.members || [];
      // Apply number to all current members so the sample widget works out of the box
      const updatedMembers = members.map((m, idx) => ({
        ...m,
        phoneNumber: formattedNumber,
      }));

      return {
        ...prev,
        content: {
          ...prev.content,
          members:
            behavior === "single-chat" || behavior === "direct"
              ? [
                  updatedMembers[0]
                    ? { ...updatedMembers[0] }
                    : {
                        ...DEFAULT_WHATSAPP_AGENTS[0],
                        phoneNumber: formattedNumber,
                      },
                ]
              : updatedMembers.length
              ? updatedMembers
              : DEFAULT_WHATSAPP_AGENTS.slice(0, teamSize).map((a) => ({
                  ...a,
                  phoneNumber: formattedNumber,
                })),
        },
      };
    });

    // Lightly refresh preview to reflect the new number
    setTimeout(() => {
      if (behavior === "single-chat" || behavior === "multi-chat") {
        previewControl.openModal();
      } else {
        previewControl.autoModal();
      }
    }, 200);
  };

  return (
    <Box
      backgroundColor="D80"
      width={"100vw"}
      height="100vh"
      padding={20}
      align="center"
      verticalAlign="middle"
    >
      {isLoading ? (
        <Box align="center" verticalAlign="middle" height="100%" width="100%">
          <Loader text="Saving your setup..." size="large" />
        </Box>
      ) : (
        <Box
          height="612px"
          width="100%"
          maxWidth="1280px"
          verticalAlign="middle"
          align="center"
          gap={6}
        >
          <Box
            width="100%"
            verticalAlign="top"
            maxWidth={700}
            paddingInline={48}
            marginTop={-16}
            minHeight="600px"
          >
            <MarketingPageLayoutContent
              title="Get closer to your customers with WhatsApp Chat"
              overline="Initial setup"
              size="large"
              content={
                <Layout>
                  <Cell>
                    <FormField label="Will your customers chat with one person or do you have a team?">
                      <RadioGroup
                        value={behavior}
                        onChange={(value) =>
                          handleBehaviorChange(
                            value as "direct" | "single-chat" | "multi-chat"
                          )
                        }
                      >
                        <RadioGroup.Radio value="single-chat">
                          Just me (or one agent)
                        </RadioGroup.Radio>
                        <RadioGroup.Radio value="multi-chat">
                          I have a team
                        </RadioGroup.Radio>
                        <RadioGroup.Radio value="direct">
                          I just want a simple link to WhatsApp
                        </RadioGroup.Radio>
                      </RadioGroup>
                    </FormField>
                  </Cell>

                  {behavior === "multi-chat" && (
                    <Cell>
                      <Collapse open={behavior === "multi-chat"}>
                        <FormField label="How many team members should we add?">
                          <Slider
                            min={1}
                            max={10}
                            value={teamSize}
                            onChange={handleTeamSizeChange}
                          />
                        </FormField>
                      </Collapse>
                    </Cell>
                  )}
                  <Cell>
                    <FormField label="What theme do you want to use?">
                      <Box gap="12px">
                        {themeOptions.map((option) => (
                          <Thumbnail
                            key={option.id}
                            backgroundImage={option.image}
                            width={48}
                            height={48}
                            selected={theme === option.id}
                            onClick={() => handleThemeSelect(option)}
                          />
                        ))}
                      </Box>
                    </FormField>
                  </Cell>
                  <Cell>
                    <Box maxWidth={400} direction="vertical" gap={1}>
                      <InputMobileNumber
                        onValidNumber={handleSamplePhoneValid}
                        phoneLabel={
                          behavior === "multi-chat"
                            ? "Initial team WhatsApp number (optional)"
                            : "WhatsApp number"
                        }
                        infoContent={
                          behavior === "multi-chat"
                            ? "We’ll apply this number to all team members for now. You can set different numbers for each member later."
                            : "Your WhatsApp number will be used to connect with customers."
                        }
                        onError={(hasError) => {
                          setSamplePhoneStatus(
                            hasError ? "invalid" : "unknown"
                          );
                        }}
                      />
                      {behavior === "multi-chat" && samplePhoneNumber && (
                        <Text size="small" secondary>
                          Note: This number will be used for all{" "}
                          {draft.content.members.length} team members. You can
                          customize each member's number in the next step.
                        </Text>
                      )}
                    </Box>
                  </Cell>
                </Layout>
              }
              actions={
                <Button
                  onClick={handleStartClick}
                  suffixIcon={
                    isLoading ? <Loader size="tiny" /> : <Icons.ArrowRight />
                  }
                  size="large"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Start Building"}
                </Button>
              }
            />
          </Box>

          <Box
            width="calc(100% - 700px)"
            height="800px"
            position="relative"
            transform="translateY(-100px)"
          >
            <WidgetController
              styles={draft.styles}
              widgetContent={draft.content}
              isDevMode={true}
              manualMobile={false}
              forceModalState={previewControl.state.forceModalOpen}
              forceSelectedAgent={previewControl.state.forceSelectedAgent}
              previewMode={previewControl.state.previewMode}
              forceStep={previewControl.state.forceStep}
              previewAgent={previewControl.state.previewAgent}
              onStateChange={(state) => {
                // Handle widget state changes if needed
                console.log("Widget state changed:", state);
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default WidgetOnboarding;
