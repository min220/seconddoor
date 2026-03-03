// src/lib/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { appParams } from "@/lib/app-params";
import { createAxiosClient } from "@base44/sdk/dist/utils/axios-client";

const AuthContext = createContext(null);

const USE_BASE44 = import.meta.env.VITE_USE_BASE44 === "true";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);

  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // { id, public_settings }

  const checkUserAuth = useCallback(async () => {
    if (!USE_BASE44 || !base44?.auth) {
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("User auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);

      if (error?.status === 401 || error?.status === 403) {
        setAuthError({
          type: "auth_required",
          message: "Authentication required",
        });
      }
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const checkAppState = useCallback(async () => {
    // If you do not want Base44 in dev/prod, this must never block rendering.
    if (!USE_BASE44) {
      setAppPublicSettings(null);
      setAuthError(null);
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      // Base44 app params missing often show up as "null" in URLs.
      if (!appParams?.appId) {
        setAuthError({
          type: "base44_not_configured",
          message: "Base44 appId is missing",
        });
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
        return;
      }

      // Check public settings (this is what was calling /api/apps/.../null)
      const appClient = createAxiosClient({
        baseURL: `/api/apps/public`,
        headers: { "X-App-Id": appParams.appId },
        token: appParams.token,
        interceptResponses: true,
      });

      const publicSettings = await appClient.get(
        `/prod/public-settings/by-id/${appParams.appId}`
      );

      setAppPublicSettings(publicSettings);

      // If token exists, try auth. If not, mark unauthenticated.
      if (appParams.token) {
        await checkUserAuth();
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoadingAuth(false);
      }
    } catch (appError) {
      console.error("App state check failed:", appError);

      if (appError?.status === 403 && appError?.data?.extra_data?.reason) {
        const reason = appError.data.extra_data.reason;

        if (reason === "auth_required") {
          setAuthError({ type: "auth_required", message: "Authentication required" });
        } else if (reason === "user_not_registered") {
          setAuthError({ type: "user_not_registered", message: "User not registered for this app" });
        } else {
          setAuthError({ type: reason, message: appError.message });
        }
      } else {
        setAuthError({
          type: "unknown",
          message: appError?.message || "Failed to load app",
        });
      }

      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  }, [checkUserAuth]);

  useEffect(() => {
    // Always run once.
    // If Base44 is disabled, this just flips loading off and renders the app.
    checkAppState();
  }, [checkAppState]);

  const logout = useCallback((shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);

    if (!USE_BASE44 || !base44?.auth) return;

    if (shouldRedirect) {
      base44.auth.logout(window.location.href);
    } else {
      base44.auth.logout();
    }
  }, []);

  const navigateToLogin = useCallback(() => {
    if (!USE_BASE44 || !base44?.auth) return;
    base44.auth.redirectToLogin(window.location.href);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        logout,
        navigateToLogin,
        checkAppState,
        // handy for debugging
        useBase44: USE_BASE44,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};