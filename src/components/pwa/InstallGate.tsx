"use client";

import { ReactNode, useEffect, useState } from "react";
import { InstallScreen } from "./InstallScreen";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    __kashDeferredInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

type InstallGateStatus = {
  ready: boolean;
  isMobile: boolean;
  isStandalone: boolean;
};

export function InstallGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<InstallGateStatus>({
    ready: false,
    isMobile: false,
    isStandalone: false,
  });

  useEffect(() => {
    window.__kashDeferredInstallPrompt = window.__kashDeferredInstallPrompt ?? null;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      window.__kashDeferredInstallPrompt = event as BeforeInstallPromptEvent;
      window.dispatchEvent(new CustomEvent("kash:installprompt-ready"));
    };

    const handleAppInstalled = () => {
      window.__kashDeferredInstallPrompt = null;
      window.dispatchEvent(new CustomEvent("kash:app-installed"));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const checkInstallContext = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://") ||
        window.matchMedia("(display-mode: fullscreen)").matches;

      const userAgent = window.navigator.userAgent.toLowerCase();
      const isMobile = /android|iphone|ipad|ipod/.test(userAgent);

      setStatus({
        ready: true,
        isMobile,
        isStandalone,
      });
    };

    checkInstallContext();
    const timer = setTimeout(checkInstallContext, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!status.ready) return null;

  if (status.isMobile && !status.isStandalone) {
    return <InstallScreen />;
  }

  return <>{children}</>;
}
