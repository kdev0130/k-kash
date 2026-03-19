"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    __kashDeferredInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

type InstallState =
  | "detecting"
  | "android-ready"
  | "android-installing"
  | "ios-preparing"
  | "ios-instructions"
  | "in-app-browser"
  | "already-installed"
  | "unsupported";

export function InstallScreen() {
  const [installState, setInstallState] = useState<InstallState>("detecting");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    detectPlatformAndState();

    const syncDeferredPrompt = () => {
      const promptEvent = window.__kashDeferredInstallPrompt ?? null;
      setDeferredPrompt(promptEvent);
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.__kashDeferredInstallPrompt = e as BeforeInstallPromptEvent;
      syncDeferredPrompt();
      setInstallState("android-ready");
    };

    const handleAppInstalled = () => {
      window.__kashDeferredInstallPrompt = null;
      setDeferredPrompt(null);
      setInstallState("already-installed");
    };

    const handlePromptReady = () => {
      syncDeferredPrompt();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("kash:installprompt-ready", handlePromptReady);
    window.addEventListener("kash:app-installed", handleAppInstalled);

    syncDeferredPrompt();

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("kash:installprompt-ready", handlePromptReady);
      window.removeEventListener("kash:app-installed", handleAppInstalled);
    };
  }, []);

  const detectPlatformAndState = () => {
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setInstallState("already-installed");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);

    const isInAppBrowser = /fbav|fban|instagram|linkedin|twitter|tiktok|snapchat/.test(userAgent);

    if (isInAppBrowser) {
      setInstallState("in-app-browser");
      return;
    }

    if (isIOS && isSafari) {
      setInstallState("ios-preparing");
      setTimeout(() => {
        setInstallState("ios-instructions");
      }, 1200);
      return;
    }

    if (isAndroid) {
      setInstallState("android-ready");
      return;
    }

    setInstallState("unsupported");
  };

  const handleAndroidInstall = async () => {
    const promptEvent = deferredPrompt || window.__kashDeferredInstallPrompt || null;

    if (!promptEvent) {
      setInstallState("android-ready");
      return;
    }

    setInstallState("android-installing");

    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") {
        setTimeout(() => {
          window.location.href = "/login";
        }, 800);
      } else {
        setInstallState("android-ready");
      }
    } catch (error) {
      console.error("Install error:", error);
      setInstallState("android-ready");
    } finally {
      window.__kashDeferredInstallPrompt = null;
      setDeferredPrompt(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px 64px",
        background: "radial-gradient(circle at 20% 10%, rgba(94, 155, 138, 0.18), transparent 50%), var(--bg)",
        color: "var(--txt-1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {installState === "detecting" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "3px solid var(--sep)",
                borderTopColor: "var(--gold)",
                margin: "0 auto 16px",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ fontSize: 14, color: "var(--txt-3)" }}>Preparing installation...</p>
          </div>
        )}

        {installState === "already-installed" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "var(--gold-faint)",
                border: "1px solid var(--gold-line)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              <Icon name="check" size={28} color="var(--gold)" strokeWidth={2.2} />
            </div>
            <h2 style={{ fontSize: 22, margin: "0 0 6px" }}>K-Kash is installed</h2>
            <p style={{ fontSize: 14, color: "var(--txt-3)", margin: 0 }}>Opening your wallet...</p>
          </div>
        )}

        {installState === "android-ready" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <img
                src="/icons/koli-logo.png"
                alt="K-Kash"
                style={{ width: 84, height: 84, borderRadius: 24, margin: "0 auto 12px", display: "block" }}
              />
              <h1 style={{ fontSize: 26, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Install K-Kash</h1>
              <p style={{ fontSize: 14, color: "var(--txt-3)", margin: 0 }}>
                Add the wallet to your home screen for instant access.
              </p>
            </div>

            <div
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--sep)",
                borderRadius: 18,
                padding: 18,
                boxShadow: "var(--sh-sm)",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "grid", gap: 14 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 10,
                      background: "var(--gold-faint)",
                      border: "1px solid var(--gold-line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="check" size={14} color="var(--gold)" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Secure wallet access</div>
                    <div style={{ fontSize: 12, color: "var(--txt-3)" }}>Open instantly without the browser bar.</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 10,
                      background: "var(--gold-faint)",
                      border: "1px solid var(--gold-line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="check" size={14} color="var(--gold)" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Full screen experience</div>
                    <div style={{ fontSize: 12, color: "var(--txt-3)" }}>Looks and feels like a native app.</div>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn-primary" onClick={handleAndroidInstall}>
              Install K-Kash
            </button>
            <p style={{ fontSize: 12, color: "var(--txt-3)", marginTop: 12, textAlign: "center" }}>
              Tap install to open the native prompt.
            </p>
          </div>
        )}

        {installState === "android-installing" && (
          <div style={{ textAlign: "center" }}>
            <img
              src="/icons/koli-logo.png"
              alt="K-Kash"
              style={{ width: 72, height: 72, borderRadius: 20, margin: "0 auto 16px", display: "block" }}
            />
            <div
              style={{
                height: 6,
                width: 200,
                background: "var(--bg-group)",
                borderRadius: 999,
                margin: "0 auto 16px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  background: "var(--gold)",
                  animation: "loadBar 1.6s ease-in-out infinite",
                }}
              />
            </div>
            <h2 style={{ fontSize: 20, margin: "0 0 6px" }}>Installing K-Kash</h2>
            <p style={{ fontSize: 14, color: "var(--txt-3)", margin: 0 }}>Please wait...</p>
          </div>
        )}

        {installState === "ios-preparing" && (
          <div style={{ textAlign: "center" }}>
            <img
              src="/icons/koli-logo.png"
              alt="K-Kash"
              style={{ width: 72, height: 72, borderRadius: 20, margin: "0 auto 16px", display: "block" }}
            />
            <h2 style={{ fontSize: 20, margin: "0 0 6px" }}>Preparing install</h2>
            <p style={{ fontSize: 14, color: "var(--txt-3)", margin: 0 }}>Setting things up...</p>
          </div>
        )}

        {installState === "ios-instructions" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <img
                src="/icons/koli-logo.png"
                alt="K-Kash"
                style={{ width: 72, height: 72, borderRadius: 20, margin: "0 auto 12px", display: "block" }}
              />
              <h1 style={{ fontSize: 22, margin: "0 0 6px" }}>Add K-Kash to Home Screen</h1>
              <p style={{ fontSize: 13, color: "var(--txt-3)", margin: 0 }}>Follow these quick steps in Safari.</p>
            </div>

            <div
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--sep)",
                borderRadius: 18,
                padding: 18,
                boxShadow: "var(--sh-sm)",
                display: "grid",
                gap: 14,
              }}
            >
              <StepRow step={1} title="Tap the Share button" detail="It looks like a square with an up arrow." icon="share" />
              <Divider />
              <StepRow step={2} title="Choose Add to Home Screen" detail="Scroll if you do not see it." />
              <Divider />
              <StepRow step={3} title="Confirm Add" detail="K-Kash will appear on your home screen." />
            </div>
          </div>
        )}

        {installState === "in-app-browser" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: "var(--gold-faint)",
                  border: "1px solid var(--gold-line)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <Icon name="info" size={28} color="var(--gold)" strokeWidth={2} />
              </div>
              <h2 style={{ fontSize: 20, margin: "0 0 6px" }}>Open in Safari</h2>
              <p style={{ fontSize: 14, color: "var(--txt-3)", margin: 0 }}>
                In-app browsers cannot install K-Kash.
              </p>
            </div>

            <div
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--sep)",
                borderRadius: 18,
                padding: 18,
                boxShadow: "var(--sh-sm)",
                display: "grid",
                gap: 12,
              }}
            >
              <StepRow step={1} title="Tap the menu" detail="Look for the three dots or share icon." />
              <Divider />
              <StepRow step={2} title="Open in Safari" detail="Then return here to install." />
            </div>
          </div>
        )}

        {installState === "unsupported" && (
          <div style={{ textAlign: "center" }}>
            <img
              src="/icons/koli-logo.png"
              alt="K-Kash"
              style={{ width: 72, height: 72, borderRadius: 20, margin: "0 auto 16px", display: "block" }}
            />
            <h2 style={{ fontSize: 20, margin: "0 0 6px" }}>Desktop mode</h2>
            <p style={{ fontSize: 14, color: "var(--txt-3)", margin: "0 0 16px" }}>
              K-Kash works best on mobile. You can continue on the web.
            </p>
            <button className="btn-ghost" onClick={() => (window.location.href = "/login")}>
              Continue to web
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepRow({
  step,
  title,
  detail,
  icon,
}: {
  step: number;
  title: string;
  detail: string;
  icon?: "share";
}) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 10,
          background: "var(--bg-group)",
          color: "var(--txt-1)",
          fontSize: 13,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon ? <Icon name={icon} size={16} color="var(--txt-1)" strokeWidth={1.8} /> : step}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--txt-3)", marginTop: 2 }}>{detail}</div>
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, width: "100%", background: "var(--sep)" }} />;
}
