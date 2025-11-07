import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CountdownTimer from './CountdownTimer';

interface TimerConfig {
  targetDate: string;
  format: 'full' | 'compact' | 'minimal';
  showLabels: boolean;
  size: 'small' | 'medium' | 'large';
  placement: 'top' | 'center' | 'bottom';
  title: string;
  message: string;
  containerId: string;
}

// Storage key for saved settings
const STORAGE_KEY = 'wix-countdown-timer-config';

// Function to save config to localStorage
function saveConfigToStorage(config: TimerConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.warn('Could not save config to localStorage:', error);
  }
}

// Function to load config from localStorage
function loadConfigFromStorage(): TimerConfig | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const config = JSON.parse(saved) as TimerConfig;
      if (config.targetDate) {
        return config;
      }
    }
  } catch (error) {
    console.warn('Could not load config from localStorage:', error);
  }
  return null;
}

// Function to read config from data attributes
function getConfigFromAttributes(container: HTMLElement): TimerConfig | null {
  const targetDate = container.getAttribute('data-target-date');
  if (!targetDate) {
    return null;
  }

  return {
    targetDate: targetDate,
    format: (container.getAttribute('data-format') as 'full' | 'compact' | 'minimal') || 'full',
    showLabels: container.getAttribute('data-show-labels') !== 'false',
    size: (container.getAttribute('data-size') as 'small' | 'medium' | 'large') || 'medium',
    placement: (container.getAttribute('data-placement') as 'top' | 'center' | 'bottom') || 'top',
    title: container.getAttribute('data-title') || 'Countdown Timer',
    message: container.getAttribute('data-message') || '',
    containerId: 'wix-countdown-timer',
  };
}

// Function to get config with fallback to localStorage
function getConfig(container: HTMLElement): TimerConfig | null {
  // First, try to get config from data attributes (this is the source of truth from Wix)
  let config = getConfigFromAttributes(container);
  
  if (config && config.targetDate) {
    // If we have valid config from attributes, save it to localStorage for future use
    saveConfigToStorage(config);
    return config;
  }
  
  // If data attributes are missing or incomplete, try to load from localStorage
  const savedConfig = loadConfigFromStorage();
  if (savedConfig && savedConfig.targetDate) {
    // Update the container's data attributes with saved config so they're in sync
    container.setAttribute('data-target-date', savedConfig.targetDate);
    container.setAttribute('data-format', savedConfig.format);
    container.setAttribute('data-show-labels', savedConfig.showLabels.toString());
    container.setAttribute('data-size', savedConfig.size);
    container.setAttribute('data-placement', savedConfig.placement);
    container.setAttribute('data-title', savedConfig.title);
    container.setAttribute('data-message', savedConfig.message);
    return savedConfig;
  }
  
  return null;
}

// Initialize React component
function initCountdownTimer(): void {
  const container = document.getElementById('wix-countdown-timer');
  if (!container) {
    console.error('Countdown timer container not found');
    return;
  }

  // Get config with fallback to saved settings
  const config = getConfig(container);
  if (!config) {
    container.innerHTML = '<p>Please configure the countdown timer target date.</p>';
    return;
  }

  // Clear container for React mounting
  container.innerHTML = '';

  // Create a root div for React
  const rootDiv = document.createElement('div');
  rootDiv.id = 'countdown-timer-root';
  container.appendChild(rootDiv);

  // Render React component
  // Note: Using ReactDOM.render for React 16 (React 18+ would use createRoot)
  ReactDOM.render(
    React.createElement(CountdownTimer, { config }),
    rootDiv
  );

  // Save config to localStorage
  saveConfigToStorage(config);
}

// Watch for attribute changes to re-initialize timer when parameters update
function setupAttributeObserver(): void {
  const container = document.getElementById('wix-countdown-timer');
  if (!container) {
    // If container doesn't exist yet, check again after a short delay
    setTimeout(() => {
      const retryContainer = document.getElementById('wix-countdown-timer');
      if (retryContainer) {
        initCountdownTimer();
        setupAttributeObserver();
      }
    }, 500);
    return;
  }

  // Create a MutationObserver to watch for attribute changes on the container
  const containerObserver = new MutationObserver((mutations) => {
    let shouldReinit = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        const attrName = mutation.attributeName;
        // Re-initialize if any of our data attributes change
        if (attrName && attrName.startsWith('data-')) {
          shouldReinit = true;
        }
      }
    });

    if (shouldReinit) {
      // Debounce re-initialization to avoid multiple rapid updates
      clearTimeout((window as any).countdownTimerReinitTimeout);
      (window as any).countdownTimerReinitTimeout = setTimeout(() => {
        initCountdownTimer();
        // Re-setup observer in case container was replaced
        setupAttributeObserver();
      }, 100);
    }
  });

  // Observe attribute changes on the container
  containerObserver.observe(container, {
    attributes: true,
    attributeFilter: [
      'data-target-date',
      'data-format',
      'data-show-labels',
      'data-size',
      'data-placement',
      'data-title',
      'data-message',
    ],
  });

  // Also watch the document body for when the container element itself is replaced
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // Check if our container was added or if it still exists
        const currentContainer = document.getElementById('wix-countdown-timer');
        if (currentContainer && currentContainer !== container) {
          // Container was replaced, re-initialize
          clearTimeout((window as any).countdownTimerReinitTimeout);
          (window as any).countdownTimerReinitTimeout = setTimeout(() => {
            initCountdownTimer();
            setupAttributeObserver();
          }, 100);
        } else if (!currentContainer) {
          // Container was removed, wait a bit and check again
          setTimeout(() => {
            const retryContainer = document.getElementById('wix-countdown-timer');
            if (retryContainer) {
              initCountdownTimer();
              setupAttributeObserver();
            }
          }, 500);
        }
      }
    });
  });

  // Observe the document body for container element changes
  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Initialize when DOM is ready
function initialize(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initCountdownTimer();
      setupAttributeObserver();
    });
  } else {
    initCountdownTimer();
    setupAttributeObserver();
  }
}

initialize();

