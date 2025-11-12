import React, { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WixDesignSystemProvider } from "@wix/design-system";
import { RecoilRoot } from "recoil";

import { i18n } from "@wix/essentials";
import {
  _DEV,
  APP_NAME,
  INTERCOM_APP_ID,
  // LOGROCKET_APP_ID,
  APP_VERSION,
} from "../constants";
import { shouldSkipInitialization } from "../constants/dev-modes";

// import { BaseModalProvider } from "./services/providers/BaseModalProvider";
import StatusToastProvider from "./services/providers/StatusToastProvider";
import { AppInitializationProvider } from "./services/providers/AppInitializationProvider";
import DebugObserver from "./services/state/debug-observer";

import { IntercomProvider } from "react-use-intercom";
import * as LogRocket from "logrocket";

// TanStack Query v4 configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time for all queries
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Don't refetch on window focus by default (can be overridden per query)
      refetchOnWindowFocus: false,
      // Reduce retries by default since we handle retries in API client
      retry: false,
      // Cache for a reasonable time
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      // Disable retries for mutations by default (handled in API client)
      retry: false,
    },
  },
});

// Initialize LogRocket
// if (_DEV === false && LOGROCKET_APP_ID) {
//   LogRocket.init(LOGROCKET_APP_ID);
// }

export function withProviders<P extends {} = {}>(Component: React.FC<P>) {
  console.log(`[${APP_NAME}] App version: v${APP_VERSION}`);
  return function DashboardProviders(props: P) {
    const locale = i18n.getLocale();

    // Force remount of initialization provider on hot reload in dev mode
    // Use timestamp-based key to ensure unique key on actual hot reload
    const [providerKey] = useState(() => (_DEV ? Date.now() : 0));

    // Create a conditional wrapper for AppInitializationProvider
    const ConditionalInitializationWrapper: React.FC<{
      children: React.ReactNode;
    }> = ({ children }) => {
      if (shouldSkipInitialization()) {
        return <>{children}</>;
      }
      return (
        <AppInitializationProvider key={_DEV ? providerKey : undefined}>
          {children}
        </AppInitializationProvider>
      );
    };

    return (
      <WixDesignSystemProvider
        locale={locale}
        features={{ newColorsBranding: true }}
      >
        <RecoilRoot>
          {_DEV && <DebugObserver />}
          <IntercomProvider appId={INTERCOM_APP_ID}>
            {/* <BaseModalProvider> */}
              <StatusToastProvider>
                {/* <QueryClientProvider client={queryClient}> */}
                  <ConditionalInitializationWrapper>
                    <Component {...props} />
                  </ConditionalInitializationWrapper>
                {/* </QueryClientProvider> */}
              </StatusToastProvider>
            {/* </BaseModalProvider> */}
          </IntercomProvider>
        </RecoilRoot>
      </WixDesignSystemProvider>
    );
  };
}
