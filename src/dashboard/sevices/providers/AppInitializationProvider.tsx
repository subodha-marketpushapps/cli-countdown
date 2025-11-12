import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { Settings, WixSiteData } from "../../../interfaces";
import {
  useAppInitialization as useAppInit,
  InitializationStep,
} from "../../hooks/useAppInitialization";
import LoadingScreen from "../../components/common/LoadingScreen";
import { EmptyStateError } from "../../components/ui/PageLoadingStatus";
import { debugLogger } from "../../utils/debug-logger";
import { shouldSkipInitialization } from "../../../constants/dev-modes";

interface InitializationError {
  step: InitializationStep;
  title: string;
  subtitle: string;
  retry?: () => void;
}

interface AppInitializationContextProps {
  isInitialized: boolean;
  currentStep: InitializationStep;
  error: InitializationError | null;
  wixSiteData: WixSiteData | null;
  settings: Settings | null;
  retryInitialization: () => void;
}

const AppInitializationContext = createContext<
  AppInitializationContextProps | undefined
>(undefined);

export const useAppInitialization = () => {
  const context = useContext(AppInitializationContext);

  // If provider is not available (skipped in dev modes), return mock data
  if (context === undefined) {
    // Use mock data in development mode
    if (shouldSkipInitialization()) {
      // Mock initialization data for development
      return {
        isInitialized: true,
        currentStep: "completed" as InitializationStep,
        error: null,
        wixSiteData: null,
        settings: null,
        retryInitialization: () => {},
      };
    }
    // Only throw error in full mode
    throw new Error(
      "useAppInitialization must be used within an AppInitializationProvider"
    );
  }
  return context;
};

interface AppInitializationProviderProps {
  children: ReactNode;
}

export const AppInitializationProvider: React.FC<
  AppInitializationProviderProps
> = ({ children }) => {
  // Use our consolidated initialization hook
  const {
    currentStep,
    error,
    isInitialized,
    wixSiteData,
    settings,
    retryInitialization,
  } = useAppInit();

  // Debug logging
  useEffect(() => {
    debugLogger.info("initialization", `Step changed to: ${currentStep}`);
  }, [currentStep]);

  // Map initialization steps to progress numbers
  const getStepProgress = (
    step: InitializationStep
  ): { current: number; total: number } => {
    const stepMapping = {
      "loading-wix-data": 1,
      "updating-instance": 2,
      "loading-settings": 3,
      "initializing-analytics": 4,
      completed: 4,
      error: 1,
    };

    return {
      current: stepMapping[step] || 1,
      total: 4,
    };
  };

  // Show loading screen during initialization
  if (!isInitialized && currentStep !== "error") {
    const { current, total } = getStepProgress(currentStep);

    return (
      <LoadingScreen
        isOpen={true}
        showCloseButton={false}
        currentStep={current}
        totalSteps={total}
      />
    );
  }

  // Show error screen if initialization failed
  if (error) {
    return (
      <EmptyStateError
        title={error.title}
        subtitle={error.subtitle}
        refreshActions={error.retry}
      />
    );
  }

  return (
    <AppInitializationContext.Provider
      value={{
        isInitialized,
        currentStep,
        error,
        wixSiteData,
        settings,
        retryInitialization,
      }}
    >
      {children}
    </AppInitializationContext.Provider>
  );
};
