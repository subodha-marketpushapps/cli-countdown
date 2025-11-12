import { TimerConfig } from '../dashboard/pages/types';
import { WidgetContent, WidgetStyles, WidgetVisibilityData } from '../interfaces/custom/countdown-widget-interfaces';
import { WixSiteData } from '../interfaces/common/wix-site-data.interface';
import { Settings } from '../interfaces/common/settings.interface';
import { Stats } from '../interfaces/custom/stats-interface';

/**
 * Creates a default TimerConfig with initial values
 * This function returns a new object each time to ensure Date objects are fresh
 */
export const createDefaultTimerConfig = (): TimerConfig => {
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0);

  const endTime = new Date();
  endTime.setHours(23, 59, 59, 0);

  return {
    timerMode: 'start-to-finish-timer',
    timerConfig: {
      startDate: now,
      startTime,
      endDate,
      endTime,
      timeZone: 'UTC',
      displayOptions: {
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
      },
    },
    placement: 'static_top',
    title: 'Countdown Timer',
    message: 'Time remaining until the event',
    selectedTemplate: 'template-1',
    selectedClockStyle: '1',
    selectedTheme: 'theme-1',
    labelPosition: 'top',
    numberStyle: 'fillEachDigit',
    backgroundColor: '#2563eb',
    textColor: '#ffffff',
  };
};

/**
 * Default TimerConfig constant
 * Note: Use createDefaultTimerConfig() if you need fresh Date objects
 */
export const DEFAULT_TIMER_CONFIG: TimerConfig = createDefaultTimerConfig();

// Widget Content Defaults - Minimal defaults for widget state management
export const DEFAULT_WIDGET_CONTENT: WidgetContent = {
  headerTitle: "",
  headerSubtitle: "",
  members: [],
  footerText: "",
  badgeText: "",
  badgeIcon: 1,
  badgeIndicatorEnabled: false,
  badgeIndicatorMode: "smart",
  badgeIndicatorResetKey: "default",
  mainBehavior: "single-chat",
  chatInputMode: "input",
  chatButtonLabel: "Chat",
  welcomeContentType: "agent",
  unavailableAgentBehavior: "show",
  showWelcomePopup: false,
  welcomeMessage: "",
  welcomePopupRepeatMode: "perReload",
  welcomePopupSoundEnabled: false,
  welcomePopupSoundType: "pop",
  welcomePopupSoundVolume: 0.5,
};

// Widget Visibility Defaults
export const DEFAULT_VISIBILITY_DATA: WidgetVisibilityData = {
  visibilityOption: "all-pages",
  visibilityPagePaths: [],
};

// Widget Styles Defaults - Minimal defaults
export const DEFAULT_WIDGET_STYLES: WidgetStyles = {
  D_Avatar_IndicatorActiveColor: "#24D366",
  D_Avatar_IndicatorDisabledColor: "#ACAFC4",
  D_Text_HighEmphasisColor: "#272727",
  D_Text_LowEmphasisColor: "#6A6C6C",
  D_Text_DisabledColor: "#929494",
  D_Btn_BackgroundColor: "#2563eb",
  D_Btn_TextColor: "#FFFFFF",
  D_Card_BackgroundColor: "#FFFFFF",
  D_Header_BackgroundColor: "#2563eb",
  D_Header_Text_HighEmphasisColor: "#FFFFFF",
  D_Header_Text_LowEmphasisColor: "#E6E6E6",
  D_Content_BackgroundColor: "#F5F5F5",
  D_Content_BorderColor: "#E2E2E2",
  D_Content_BackgroundImage: "",
  D_Footer_BackgroundColor: "#F8F9FA",
  D_Badge_IndicatorColor: "#FF3B30",
  L_Widget_FontFamily: "Arial, sans-serif",
  L_Widget_CornerRounding: 8,
  L_Widget_FontSize: 14,
  L_Widget_MaxWidth: 400,
  L_Widget_PositionAlign: "right",
  L_Widget_Position: {
    bottom: 24,
    left: 20,
    right: 20,
  },
  L_Widget_Position_Mobile: {
    bottom: 24,
    left: 20,
    right: 20,
  },
  L_Widget_PositionAlign_Mobile: "right",
  L_Widget_ElementGap: 12,
  L_Widget_ZIndex: 100000,
  D_Badge_BackgroundColor: "#2563eb",
  D_Badge_TextColor: "#FFFFFF",
  L_Badge_Size: 1.8,
  L_Badge_Size_Mobile: 1.8,
  L_Badge_CornerRounding: {
    topLeft: 28,
    topRight: 28,
    bottomLeft: 28,
    bottomRight: 28,
    linked: true,
  },
  L_Badge_CornerRounding_Mobile: {
    topLeft: 28,
    topRight: 28,
    bottomLeft: 28,
    bottomRight: 28,
    linked: true,
  },
  D_Widget_Theme: "",
};

// Default Site Data
export const DEFAULT_WIX_SITE_DATA: WixSiteData = {
  instanceId: "",
  currency: "USD",
  locale: "en-US",
  email: "",
  siteDisplayName: "",
  siteUrl: "",
  subscriptionPlan: "Free",
  appVersion: "unknown",
};

// Default Statistics - Empty stats object for fallback when no analytics data is available
export const DEFAULT_STATISTICS: Stats = {
  totalChats: 0,
  totalClicks: 0,
  conversionRate: 0,
  topAgents: [],
  chartData: [],
  deviceBreakdown: {
    mobile: 0,
    desktop: 0,
  },
  timeBreakdown: {
    morning: 0,
    afternoon: 0,
    evening: 0,
  },
};

// Default Settings
export const DEFAULT_SETTINGS: Settings = {
  firstName: null,
  lastName: null,
  email: null,
  timezoneId: null,
  businessName: null,
  businessPhoneNumber: null,
  installPopupShow: false,
  country: null,
  isUserReviewed: false,
  isAutoSaveEnabled: true,
};
