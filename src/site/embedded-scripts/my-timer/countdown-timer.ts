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

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

class CountdownTimer {
  private config: TimerConfig;
  private intervalId: number | null = null;
  private container: HTMLElement | null = null;
  private overlay: HTMLElement | null = null;
  private isClosed: boolean = false;

  constructor(config: TimerConfig) {
    this.config = config;
    this.init();
  }

  private init(): void {
    this.container = document.getElementById(this.config.containerId);
    if (!this.container) {
      console.error(`Container with id "${this.config.containerId}" not found`);
      return;
    }

    this.setupPlacement();
    this.render();
    this.start();
  }

  private setupPlacement(): void {
    if (!this.container) return;

    // Remove any existing placement classes
    this.container.classList.remove('countdown-top', 'countdown-center', 'countdown-bottom');

    if (this.config.placement === 'center') {
      this.container.classList.add('countdown-center');
      this.createOverlay();
    } else if (this.config.placement === 'top') {
      this.container.classList.add('countdown-top');
    } else if (this.config.placement === 'bottom') {
      this.container.classList.add('countdown-bottom');
    }
  }

  private createOverlay(): void {
    if (!this.container || this.config.placement !== 'center') return;

    // Check if already closed in this session
    if (sessionStorage.getItem('countdown-timer-closed') === 'true') {
      return;
    }

    // Create overlay backdrop
    this.overlay = document.createElement('div');
    this.overlay.className = 'countdown-overlay';
    this.overlay.id = 'countdown-overlay';
    
    // Close on backdrop click
    this.overlay.onclick = (e) => {
      if (e.target === this.overlay) {
        this.closeOverlay();
      }
    };

    // Create wrapper for the timer content
    const timerWrapper = document.createElement('div');
    timerWrapper.className = 'countdown-timer-wrapper';
    
    // Move container content to wrapper
    while (this.container.firstChild) {
      timerWrapper.appendChild(this.container.firstChild);
    }

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'countdown-close-button';
    closeButton.innerHTML = '×';
    closeButton.setAttribute('aria-label', 'Close countdown timer');
    closeButton.onclick = (e) => {
      e.stopPropagation();
      this.closeOverlay();
    };

    // Add close button and wrapper to container
    this.container.appendChild(closeButton);
    this.container.appendChild(timerWrapper);

    // Insert overlay into body
    document.body.appendChild(this.overlay);
    this.overlay.appendChild(this.container);
  }

  private closeOverlay(): void {
    if (this.overlay) {
      this.isClosed = true;
      this.overlay.style.display = 'none';
      // Store in sessionStorage to remember closed state
      sessionStorage.setItem('countdown-timer-closed', 'true');
    }
  }

  private calculateTimeRemaining(): TimeRemaining | null {
    const target = new Date(this.config.targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }

  private formatNumber(num: number): string {
    return String(num).padStart(2, '0');
  }

  private getSizeClass(): string {
    return `countdown-size-${this.config.size}`;
  }

  private render(): void {
    if (!this.container) return;

    // Check if overlay was closed
    if (this.config.placement === 'center' && sessionStorage.getItem('countdown-timer-closed') === 'true') {
      if (this.overlay) {
        this.overlay.style.display = 'none';
      }
      return;
    }

    // Find the timer wrapper if it exists (for overlay mode)
    const timerWrapper = this.container.querySelector('.countdown-timer-wrapper');
    const renderTarget = timerWrapper || this.container;

    const timeRemaining = this.calculateTimeRemaining();

    if (!timeRemaining) {
      const expiredHTML = `
        <div class="countdown-timer expired">
          <h3 class="countdown-title">${this.config.title || 'Countdown Timer'}</h3>
          <div class="countdown-expired">Countdown Expired!</div>
        </div>
      `;
      
      if (timerWrapper) {
        timerWrapper.innerHTML = expiredHTML;
      } else {
        // Remove close button if exists before setting innerHTML
        const closeBtn = this.container.querySelector('.countdown-close-button');
        this.container.innerHTML = expiredHTML;
        if (closeBtn && this.config.placement === 'center') {
          this.container.appendChild(closeBtn);
        }
      }
      return;
    }

    let timerHTML = `
      <div class="countdown-timer ${this.getSizeClass()}">
        ${this.config.title ? `<h3 class="countdown-title">${this.config.title}</h3>` : ''}
        ${this.config.message ? `<p class="countdown-message">${this.config.message}</p>` : ''}
        <div class="countdown-display countdown-${this.config.format}">
    `;

    if (this.config.format === 'minimal') {
      timerHTML += `
        <div class="countdown-minimal">
          ${timeRemaining.days}d ${timeRemaining.hours}h ${timeRemaining.minutes}m ${timeRemaining.seconds}s
        </div>
      `;
    } else if (this.config.format === 'compact') {
      timerHTML += `
        <div class="countdown-compact">
          <div class="countdown-unit">
            <span class="countdown-number">${this.formatNumber(timeRemaining.days)}</span>
            ${this.config.showLabels ? '<span class="countdown-label">Days</span>' : ''}
          </div>
          <span class="countdown-separator">:</span>
          <div class="countdown-unit">
            <span class="countdown-number">${this.formatNumber(timeRemaining.hours)}</span>
            ${this.config.showLabels ? '<span class="countdown-label">Hours</span>' : ''}
          </div>
          <span class="countdown-separator">:</span>
          <div class="countdown-unit">
            <span class="countdown-number">${this.formatNumber(timeRemaining.minutes)}</span>
            ${this.config.showLabels ? '<span class="countdown-label">Minutes</span>' : ''}
          </div>
          <span class="countdown-separator">:</span>
          <div class="countdown-unit">
            <span class="countdown-number">${this.formatNumber(timeRemaining.seconds)}</span>
            ${this.config.showLabels ? '<span class="countdown-label">Seconds</span>' : ''}
          </div>
        </div>
      `;
    } else {
      // Full format
      timerHTML += `
        <div class="countdown-full">
          <div class="countdown-box">
            <span class="countdown-number">${this.formatNumber(timeRemaining.days)}</span>
            ${this.config.showLabels ? '<span class="countdown-label">Days</span>' : ''}
          </div>
          <div class="countdown-box">
            <span class="countdown-number">${this.formatNumber(timeRemaining.hours)}</span>
            ${this.config.showLabels ? '<span class="countdown-label">Hours</span>' : ''}
          </div>
          <div class="countdown-box">
            <span class="countdown-number">${this.formatNumber(timeRemaining.minutes)}</span>
            ${this.config.showLabels ? '<span class="countdown-label">Minutes</span>' : ''}
          </div>
          <div class="countdown-box">
            <span class="countdown-number">${this.formatNumber(timeRemaining.seconds)}</span>
            ${this.config.showLabels ? '<span class="countdown-label">Seconds</span>' : ''}
          </div>
        </div>
      `;
    }

    timerHTML += `
        </div>
      </div>
    `;

    if (timerWrapper) {
      timerWrapper.innerHTML = timerHTML;
    } else {
      // Preserve close button if it exists
      const closeBtn = this.container.querySelector('.countdown-close-button');
      this.container.innerHTML = timerHTML;
      if (closeBtn && this.config.placement === 'center') {
        this.container.appendChild(closeBtn);
      }
    }
  }

  private start(): void {
    this.intervalId = window.setInterval(() => {
      this.render();
      const timeRemaining = this.calculateTimeRemaining();
      if (!timeRemaining) {
        this.stop();
      }
    }, 1000);
  }

  private stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public destroy(): void {
    this.stop();
    
    // Remove overlay if it exists
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    
    // Clear container content but preserve the container element itself
    if (this.container) {
      this.container.innerHTML = '';
      // Remove placement classes
      this.container.classList.remove('countdown-top', 'countdown-center', 'countdown-bottom');
    }
  }
}

// Global reference to the timer instance
let timerInstance: CountdownTimer | null = null;

// Storage key for saved settings
const STORAGE_KEY = 'wix-countdown-timer-config';

// Function to save config to localStorage
function saveConfigToStorage(config: TimerConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    // localStorage might not be available (e.g., in private browsing)
    console.warn('Could not save config to localStorage:', error);
  }
}

// Function to load config from localStorage
function loadConfigFromStorage(): TimerConfig | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const config = JSON.parse(saved) as TimerConfig;
      // Validate that we have at least a targetDate
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

// Initialize or update timer
function initCountdownTimer(): void {
  // Get configuration from data attributes or localStorage
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

  // Destroy existing timer if it exists
  if (timerInstance) {
    timerInstance.destroy();
    timerInstance = null;
  }

  // Clear any existing overlay
  const existingOverlay = document.getElementById('countdown-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Reset session storage for overlay if placement changed
  // (This allows overlay to show again if placement changes back to center)
  const previousPlacement = container.getAttribute('data-previous-placement');
  if (previousPlacement !== config.placement) {
    container.setAttribute('data-previous-placement', config.placement);
    if (config.placement !== 'center') {
      sessionStorage.removeItem('countdown-timer-closed');
    }
  }

  // Create new timer instance
  timerInstance = new CountdownTimer(config);
  
  // Save the config to localStorage for persistence
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
  // This handles cases where Wix replaces the entire element rather than just updating attributes
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

