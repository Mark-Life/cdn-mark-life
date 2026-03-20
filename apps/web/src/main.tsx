import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import { StrictMode, useCallback, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app";
import "@workspace/ui/globals.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function useConvexAuth() {
  const { isLoading, user, getAccessToken } = useAuth();
  const fetchAccessToken = useCallback(
    async (_args: { forceRefreshToken: boolean }) => {
      const token = await getAccessToken();
      return token ?? null;
    },
    [getAccessToken]
  );
  return useMemo(
    () => ({
      isLoading,
      isAuthenticated: !isLoading && !!user,
      fetchAccessToken,
    }),
    [isLoading, user, fetchAccessToken]
  );
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <AuthKitProvider
      clientId={import.meta.env.VITE_WORKOS_CLIENT_ID}
      redirectUri={import.meta.env.VITE_WORKOS_REDIRECT_URI}
    >
      <ConvexProviderWithAuth client={convex} useAuth={useConvexAuth}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </ConvexProviderWithAuth>
    </AuthKitProvider>
  </StrictMode>
);
