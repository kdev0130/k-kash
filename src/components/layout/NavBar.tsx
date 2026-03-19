"use client";

import { Icon } from "@/components/ui/Icon";

interface NavBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function NavBar({ title, showBack, onBack, right }: NavBarProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "16px 20px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--nav-bg)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
      }}
    >
      {/* Left */}
      <div style={{ width: 34, display: "flex", alignItems: "center" }}>
        {showBack && (
          <button
            onClick={onBack}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--bg-input)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="chevron_l" size={16} color="var(--txt-2)" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Center */}
      {title && (
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--txt-1)",
          }}
        >
          {title}
        </span>
      )}

      {/* Right */}
      <div style={{ width: 34, display: "flex", justifyContent: "flex-end" }}>
        {right}
      </div>
    </div>
  );
}
