import React, { useState } from "react";
import {
    Box,
    FormField,
    SidePanel,
    RadioGroup,
    Dropdown,
    Text,
    NumberInput,
    Input,
    ToggleSwitch,
    Tag,
    InfoIcon,
} from "@wix/design-system";
import { DEFAULT_PANEL_WIDTH } from "../SidePanelContainer";
import { renderSectionTitle } from "../utils/renderSectionTitle";
import { TimerConfig, BehaviorBannerAnimation, BehaviorCounterNumberAnimation } from "../../../types";

interface Props {
    config: TimerConfig;
    onChange: (config: TimerConfig) => void;
    onCloseButtonClick: () => void;
}

const PanelBehavior: React.FC<Props> = ({
    onCloseButtonClick,
    config,
    onChange,
}) => {
    const handleCloseSidePanel = () => {
        onCloseButtonClick();
    };

    const behaviorConfig = config.behaviorConfig || {};
    const [pageInputValue, setPageInputValue] = useState("");

    const handleFrequencyChange = (value: string) => {
        onChange({
            ...config,
            behaviorConfig: {
                ...behaviorConfig,
                frequency: value as 'perSession' | 'everyXMinutes',
            },
        });
    };

    const handleMinutesIntervalChange = (value: number | null) => {
        onChange({
            ...config,
            behaviorConfig: {
                ...behaviorConfig,
                minutesInterval: value || 2,
            },
        });
    };

    const handleTargetingChange = (value: string) => {
        onChange({
            ...config,
            behaviorConfig: {
                ...behaviorConfig,
                targeting: value as 'allPages' | 'specificPages',
            },
        });
    };

    const handleAddPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && pageInputValue.trim()) {
            const newPage = pageInputValue.trim();
            const currentPages = behaviorConfig.specificPages || [];

            // Validate page path (should start with /)
            const validPage = newPage.startsWith('/') ? newPage : `/${newPage}`;

            // Check if page already exists and limit to 10
            if (!currentPages.includes(validPage) && currentPages.length < 10) {
                onChange({
                    ...config,
                    behaviorConfig: {
                        ...behaviorConfig,
                        specificPages: [...currentPages, validPage],
                    },
                });
                setPageInputValue("");
            }
        }
    };

    const handleRemovePage = (pageToRemove: string) => {
        const currentPages = behaviorConfig.specificPages || [];
        onChange({
            ...config,
            behaviorConfig: {
                ...behaviorConfig,
                specificPages: currentPages.filter(page => page !== pageToRemove),
            },
        });
    };

    const handleAllowManualCloseChange = (checked: boolean) => {
        onChange({
            ...config,
            behaviorConfig: {
                ...behaviorConfig,
                allowManualClose: checked,
            },
        });
    };

    const specificPages = behaviorConfig.specificPages || [];
    const maxPages = 10;

    return (
        <SidePanel
            onCloseButtonClick={handleCloseSidePanel}
            width={DEFAULT_PANEL_WIDTH}
            maxHeight="100%"
        >
            <SidePanel.Header title="Behavior" showDivider={false} />

            {/* Animations Section */}
            <SidePanel.Section title={renderSectionTitle("Animations")}>
                <SidePanel.Field>
                    <FormField label="Banner Animation" infoContent="Choose how the banner appears">
                        <Dropdown
                            size="small"
                            selectedId={behaviorConfig.behaviorBannerAnimation || "slideIn"}
                            onSelect={(option) => onChange({
                                ...config,
                                behaviorConfig: {
                                    ...behaviorConfig,
                                    behaviorBannerAnimation: option?.id as BehaviorBannerAnimation,
                                },
                            })}
                            options={[
                                { id: "slideIn", value: "Slide In" },
                                { id: "fadeIn", value: "Fade In" },
                                { id: "popIn", value: "Pop In" },
                                { id: "bounce", value: "Bounce In" },
                            ]}
                        />
                    </FormField>
                </SidePanel.Field>

                <SidePanel.Field>
                    <FormField label="Counter Number Animation" infoContent="Choose how numbers animate">
                        <Dropdown
                            size="small"
                            selectedId={behaviorConfig.behaviorCounterNumberAnimation || "smoothIncrement"}
                            onSelect={(option) => onChange({
                                ...config,
                                behaviorConfig: {
                                    ...behaviorConfig,
                                    behaviorCounterNumberAnimation: option?.id as BehaviorCounterNumberAnimation,
                                },
                            })}
                            options={[
                                { id: "smoothIncrement", value: "Smooth Increment" },
                                { id: "popTransition", value: "Pop Transition" },
                                { id: "flipClock", value: "Flip Clock" },
                                { id: "fadeBetweenDigits", value: "Fade Between Digits" },
                            ]}
                        />
                    </FormField>
                </SidePanel.Field>
            </SidePanel.Section>

            {/* Display Rules Section */}
            <SidePanel.Section title={renderSectionTitle("Display Rules")}>
                <SidePanel.Field>
                    <FormField label="Frequency">
                        <RadioGroup
                            display="vertical"
                            value={behaviorConfig.frequency || "perSession"}
                            onChange={(value) => handleFrequencyChange(value as string)}
                        >
                            <RadioGroup.Radio value="perSession">
                                <Box direction="horizontal" gap="4px" align="center">
                                    <Text>Show once per session</Text>
                                    <InfoIcon content="The banner will appear only once for each visitor during their browser session." />
                                </Box>
                            </RadioGroup.Radio>
                            <RadioGroup.Radio value="everyXMinutes">
                                <Box direction="vertical" gap="8px">
                                    <Box direction="horizontal" gap="4px" align="center">
                                        <Text>Show every X minutes</Text>
                                        <InfoIcon content="Reappears after the visitor closes the banner and the set interval has passed." />
                                    </Box>
                                </Box>
                            </RadioGroup.Radio>
                        </RadioGroup>
                        {behaviorConfig.frequency === 'everyXMinutes' && (
                            <Box direction="horizontal" gap="8px" align="center" marginTop="8px">
                                <NumberInput
                                    size="small"
                                    value={behaviorConfig.minutesInterval || 2}
                                    min={1}
                                    max={60}
                                    onChange={(value) => handleMinutesIntervalChange(value)}
                                    suffix={<Input.Affix>Minutes</Input.Affix>}
                                />
                            </Box>
                        )}
                    </FormField>
                </SidePanel.Field>

                <SidePanel.Field>
                    <FormField label="Pages to Display On">
                        <RadioGroup
                            display="vertical"
                            value={behaviorConfig.targeting || "allPages"}
                            onChange={(value) => handleTargetingChange(value as string)}
                        >
                            <RadioGroup.Radio value="allPages">
                                Display on all pages
                            </RadioGroup.Radio>
                            <RadioGroup.Radio value="specificPages">
                                Display on specific page(s)
                            </RadioGroup.Radio>
                        </RadioGroup>
                    </FormField>
                </SidePanel.Field>

                {behaviorConfig.targeting === 'specificPages' && (
                    <SidePanel.Field>
                        <FormField
                            label={
                                <Box direction="horizontal" gap="4px" align="center">
                                    <Text>Specific Pages</Text>
                                    <InfoIcon content="Add up to 10 page paths where the banner should appear" />
                                    <Text secondary size="tiny">{specificPages.length}/{maxPages}</Text>
                                </Box>
                            }
                        >
                            <Box direction="vertical" gap="8px">
                                {specificPages.length > 0 && (
                                    <Box direction="horizontal" gap="4px" style={{ flexWrap: 'wrap' }}>
                                        {specificPages.map((page) => (
                                            <Tag
                                                key={page}
                                                id={page}
                                                removable
                                                onRemove={() => handleRemovePage(page)}
                                                size="small"
                                            >
                                                {page}
                                            </Tag>
                                        ))}
                                    </Box>
                                )}
                                <Input
                                    size="small"
                                    placeholder="Enter page path (e.g., /about)"
                                    value={pageInputValue}
                                    onChange={(e) => setPageInputValue(e.target.value)}
                                    onKeyDown={handleAddPage}
                                    disabled={specificPages.length >= maxPages}
                                />
                                <Text secondary size="tiny">
                                    Press Enter to add. Supports nested paths like /blog/posts.
                                </Text>
                            </Box>
                        </FormField>
                    </SidePanel.Field>
                )}
            </SidePanel.Section>

            {/* Dismissal Section */}
            <SidePanel.Section title={renderSectionTitle("Dismissal")}>
                <SidePanel.Field>
                    <FormField>
                        <Box direction="horizontal" gap="8px" style={{ justifyContent: "space-between" }}>
                            <Text secondary size="small">Allow manual close</Text>
                            <ToggleSwitch
                                checked={behaviorConfig.allowManualClose !== false}
                                onChange={(e) => handleAllowManualCloseChange(e.target.checked)}
                                size="small"
                            />
                        </Box>
                    </FormField>
                </SidePanel.Field>
            </SidePanel.Section>
        </SidePanel>
    );
};

export default PanelBehavior;
