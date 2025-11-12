export const SLIDER_CONFIG = {
  SLIDE_INTERVAL: 4000, // 4 seconds
  TRANSITION_DURATION: 500, // 0.5 seconds
  AUTO_SLIDE: true,
} as const;

// Default feature slides for the loading screen
// Note: FeatureSlide type is defined in LoadingScreen/slider-types.ts
export const FEATURE_SLIDES = [
  {
    id: 1,
    description: "Create beautiful **countdown timers** for your website to drive urgency and conversions.",
    imagePath: "https://mkp-prod.nyc3.cdn.digitaloceanspaces.com/countdown-timer/assets/feature-1.png",
    imageAlt: "Countdown Timer Feature",
  },
  {
    id: 2,
    description: "Customize **templates, styles, and themes** to match your brand perfectly.",
    imagePath: "https://mkp-prod.nyc3.cdn.digitaloceanspaces.com/countdown-timer/assets/feature-2.png",
    imageAlt: "Customization Feature",
  },
  {
    id: 3,
    description: "Place timers **anywhere on your site** - top, bottom, or as an overlay popup.",
    imagePath: "https://mkp-prod.nyc3.cdn.digitaloceanspaces.com/countdown-timer/assets/feature-3.png",
    imageAlt: "Placement Options Feature",
  },
];
