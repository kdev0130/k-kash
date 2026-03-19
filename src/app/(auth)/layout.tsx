"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { InstallGate } from "@/components/pwa/InstallGate";

function AuthShell({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 430,
        minHeight: "100dvh",
        margin: "0 auto",
        background: "var(--bg)",
        fontFamily: "var(--font)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <InstallGate>
            <AuthShell>{children}</AuthShell>
          </InstallGate>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
