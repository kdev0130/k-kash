"use client";

import { NavBar } from "@/components/layout/NavBar";
import { Toggle } from "@/components/ui/Toggle";
import { Icon } from "@/components/ui/Icon";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";

export function SettingsScreen() {
  const { dark, toggle } = useTheme();
  const { user } = useAuth();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch" as any,
        paddingBottom: 90,
      }}
    >
      <NavBar title="Settings" />

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Profile card */}
        <div
          style={{
            background: "var(--bg-2)",
            borderRadius: 18,
            padding: "16px 18px",
            boxShadow: "var(--sh-sm)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            animation: "fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <div
            style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "var(--gold-faint)", border: "1.5px solid var(--gold-line)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: 20, fontWeight: 700, color: "var(--gold)",
            }}
          >
            {user?.avatarInitial ?? "?"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--txt-1)" }}>
              {user?.name ?? "My Wallet"}
            </div>
            <div style={{ fontSize: 12, color: "var(--txt-3)", marginTop: 3 }}>
              {user?.email ?? ""}
            </div>
          </div>
        </div>

        {/* Appearance */}
        <Section label="Appearance" delay={0.05}>
          <Row icon="sun" iconBg="rgba(255,200,60,0.15)" iconColor="#F59E0B" noBorder>
            <span style={{ flex: 1, fontSize: 15, color: "var(--txt-1)" }}>Dark Mode</span>
            <Toggle on={dark} onChange={toggle} label="Toggle dark mode" />
          </Row>
        </Section>

        {/* About */}
        <Section label="About" delay={0.10}>
          {[
            ["K-Kash", "v1.0.0-beta"],
            ["KOLI Rate", "₱1.00 / KOLI"],
          ].map(([k, v], i, arr) => (
            <div
              key={k}
              style={{
                display: "flex", alignItems: "center",
                padding: "13px 16px",
                borderBottom: i < arr.length - 1 ? "1px solid var(--sep)" : "none",
                background: "var(--bg-group)",
              }}
            >
              <span style={{ flex: 1, fontSize: 15, color: "var(--txt-1)" }}>{k}</span>
              <span style={{ fontSize: 14, color: "var(--txt-3)" }}>{v}</span>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}

/* ── Helpers ── */
function Section({ label, delay, children }: { label: string; delay?: number; children: React.ReactNode }) {
  return (
    <div style={{ animation: `fadeUp 0.35s ${delay ?? 0}s cubic-bezier(0.16,1,0.3,1) both` }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--txt-3)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ background: "var(--bg-group)", borderRadius: 16, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ icon, iconBg, iconColor, children, onClick, noBorder }: {
  icon: string; iconBg: string; iconColor: string;
  children: React.ReactNode; onClick?: () => void; noBorder?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 13,
        padding: "13px 16px",
        borderBottom: noBorder ? "none" : "1px solid var(--sep)",
        background: "var(--bg-group)",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div style={{ width: 30, height: 30, borderRadius: 9, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon as any} size={16} color={iconColor} strokeWidth={1.8} />
      </div>
      {children}
    </div>
  );
}
