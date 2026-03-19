"use client";

import { Icon } from "./Icon";

interface InstallBannerProps {
  onDismiss: () => void;
}

export function InstallBanner({ onDismiss }: InstallBannerProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 300,
        background: "var(--bg-sheet)",
        borderBottom: "1px solid var(--sep)",
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "var(--sh-sm)",
        animation: "bannerIn 0.4s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      {/* App icon */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 11,
          background: "var(--gold-faint)",
          border: "1px solid var(--gold-line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: "var(--gold)",
            fontFamily: "var(--font)",
          }}
        >
          K
        </span>
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "var(--txt-1)",
          }}
        >
          Add to Home Screen
        </div>
        <div style={{ fontSize: 11, color: "var(--txt-3)", marginTop: 1 }}>
          For the best experience
        </div>
      </div>

      <button
        onClick={onDismiss}
        aria-label="Dismiss install banner"
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "var(--bg-input)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="close" size={12} color="var(--txt-3)" strokeWidth={2.5} />
      </button>
    </div>
  );
}
