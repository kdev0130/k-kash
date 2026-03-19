"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider, useToast } from "@/context/ToastContext";
import { WalletProvider } from "@/context/WalletContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { TabBar } from "@/components/layout/TabBar";
import { SendSheet } from "@/components/sheets/SendSheet";
import { ReceiveSheet } from "@/components/sheets/ReceiveSheet";
import { KashOutSheet } from "@/components/sheets/KashOutSheet";
import { KashInSheet } from "@/components/sheets/KashInSheet";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { ActivityScreen } from "@/components/screens/ActivityScreen";
import { KashScreen } from "@/components/screens/KashScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { Toast } from "@/components/ui/Toast";
import { InstallGate } from "@/components/pwa/InstallGate";
import { useSheet } from "@/hooks/useSheet";
import type { TabId } from "@/types/ui";
import { SplashGate } from "@/components/ui/SplashGate";

/**
 * Inner shell — needs access to ToastContext so must be a child of ToastProvider.
 */
function AppShell({ children }: { children: ReactNode }) {
  const [tab, setTab]       = useState<TabId>("home");
  const { toast }           = useToast();
  const { sheet, open, close } = useSheet();
  const { user, loading }   = useAuth();
  const router              = useRouter();

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 430,
        height: "100dvh",
        margin: "0 auto",
        overflow: "hidden",
        background: "var(--bg)",
        fontFamily: "var(--font)",
      }}
    >
      {/* Page content area */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          top: 0,
          bottom: 80,
          overflow: "hidden",
        }}
      >
        {/* Render the correct screen based on tab state */}
        {tab === "home"     && <HomeScreen openSheet={open} onNavigate={(screen) => setTab(screen as TabId)} />}
        {tab === "activity" && <ActivityScreen />}
        {tab === "kash"     && <KashScreen openSheet={open} />}
        {tab === "settings" && <SettingsScreen />}
        {tab === "profile"  && <ProfileScreen onBack={() => setTab("home")} />}
        {/* children is null (page.tsx returns null) — rendered here to satisfy Next.js RSC tree */}
        <div style={{ display: "none" }}>{children}</div>
      </div>

      {/* Slide-up sheets */}
      {sheet === "send"    && <SendSheet    onClose={close} />}
      {sheet === "receive" && <ReceiveSheet onClose={close} />}
      {sheet === "kash_out" && <KashOutSheet onClose={close} />}
      {sheet === "kash_in" && <KashInSheet onClose={close} />}

      {/* Bottom tab bar */}
      <TabBar tab={tab} setTab={setTab} openSheet={open} />

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WalletProvider>
          <ToastProvider>
            <SplashGate>
              <InstallGate>
                <AppShell>{children}</AppShell>
              </InstallGate>
            </SplashGate>
          </ToastProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
