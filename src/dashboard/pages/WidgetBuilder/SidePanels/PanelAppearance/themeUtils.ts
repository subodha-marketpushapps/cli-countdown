import { TimerConfig } from '../../../types';
import blackFridayImage from '../../../../../assets/images/template-background/black _friday.png';

/**
 * Helper function to convert file name to theme ID
 */
export const getThemeIdFromFileName = (fileName: string): string => {
  const nameWithoutExt = fileName.replace(/\.(png|jpg|jpeg)$/i, '');
  return `theme-${nameWithoutExt.replace(/[ _]+/g, '-').toLowerCase().replace(/^-+|-+$/g, '')}`;
};

/**
 * Get the first theme ID (Black Friday theme)
 */
export const getFirstThemeId = (): string => {
  return getThemeIdFromFileName('black _friday.png');
};

/**
 * Get the first theme configuration
 */
export const getFirstThemeConfig = (): TimerConfig['themeConfig'] => {
  return {
    backgroundType: 'image',
    backgroundColor: '#000000',
    backgroundOpacity: 100,
    backgroundImageUrl: blackFridayImage,
    titleColor: '#FFFFFF',
    titleOpacity: 100,
    subtitleColor: '#FFD700',
    subtitleOpacity: 100,
    countdownLabelColor: '#FFFFFF',
    countdownLabelOpacity: 100,
    countdownBoxBackgroundColor: '#FF0000',
    countdownBoxBackgroundOpacity: 100,
    countdownBoxTextColor: '#FFFFFF',
    countdownBoxTextOpacity: 100,
    buttonBackgroundColor: '#FFD700',
    buttonBackgroundOpacity: 100,
    buttonTextColor: '#000000',
    buttonTextOpacity: 100,
  };
};

