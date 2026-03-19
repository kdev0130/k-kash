"use client";

import { Icon } from "@/components/ui/Icon";
import type { TabId, SheetType } from "@/types/ui";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "home",     label: "Home",     icon: "home"     },
  { id: "activity", label: "Activity", icon: "activity" },
  { id: "kash",     label: "Kash",     icon: "kash_tab" },
  { id: "settings", label: "Settings", icon: "settings" },
];

interface TabBarProps {
  tab: TabId;
  setTab: (t: TabId) => void;
  openSheet: (s: NonNullable<SheetType>) => void;
}

export function TabBar({ tab, setTab, openSheet }: TabBarProps) {
  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        display: "flex",
        alignItems: "flex-start",
        paddingTop: 9,
        zIndex: 100,
        borderTop: "1px solid var(--sep)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        background: "var(--tab-bg)",
      }}
    >
      {TABS.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            aria-label={t.label}
            aria-current={active ? "page" : undefined}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
              WebkitTapHighlightColor: "transparent",
              transition: "transform 0.12s ease",
            }}
          >
            <div style={active ? {
              background: "var(--gold-faint)",
              border: "1px solid var(--gold-line)",
              borderRadius: 12,
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            } : { padding: "4px 10px" }}>
              <Icon
                name={t.icon as any}
                size={24}
                color={active ? "var(--gold)" : "var(--txt-3)"}
                strokeWidth={active ? 2.1 : 1.6}
              />
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 600 : 400,
                color: active ? "var(--gold)" : "var(--txt-3)",
                letterSpacing: "-0.01em",
              }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
