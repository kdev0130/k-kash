"use client";

import { Icon } from "@/components/ui/Icon";
import type { SheetType } from "@/types/ui";

interface ActionButtonsProps {
  onAction: (type: NonNullable<SheetType>) => void;
}

type ActionDef = {
  label: string;
  icon: string;
  sheet: NonNullable<SheetType>;
  accent?: string;
};

const ROW1: ActionDef[] = [
  { label: "Send",    icon: "up",   sheet: "send"    },
  { label: "Receive", icon: "down", sheet: "receive" },
];

const ROW2: ActionDef[] = [
  { label: "Kash Out", icon: "kash_out", sheet: "kash_out", accent: "var(--gold)" },
  { label: "Kash In",  icon: "kash_in",  sheet: "kash_in",  accent: "var(--gold)" },
];

function ActionBtn({ label, icon, sheet, accent, onAction }: ActionDef & { onAction: ActionButtonsProps["onAction"] }) {
  return (
    <button
      aria-label={label}
      onClick={() => onAction(sheet)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 7,
        background: "none",
        border: "none",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        minWidth: 72,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: "var(--gold-faint)",
          border: "1px solid var(--gold-line)",
          boxShadow: "var(--sh-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.12s ease, box-shadow 0.12s ease",
        }}
        onMouseDown={(e) => { (e.currentTarget.style.transform = "scale(0.93)"); }}
        onMouseUp={(e) => { (e.currentTarget.style.transform = ""); }}
        onTouchStart={(e) => { (e.currentTarget.style.transform = "scale(0.93)"); }}
        onTouchEnd={(e) => { (e.currentTarget.style.transform = ""); }}
      >
        <Icon name={icon as any} size={21} color={accent ?? "var(--gold)"} strokeWidth={2.1} />
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "var(--txt-2)",
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </span>
    </button>
  );
}

export function ActionButtons({ onAction }: ActionButtonsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        padding: "0 32px 32px",
        animation: "fadeUp 0.4s 0.08s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      {/* Row 1: Send / Receive */}
      <div style={{ display: "flex", gap: 36 }}>
        {ROW1.map((a) => (
          <ActionBtn key={a.label} {...a} onAction={onAction} />
        ))}
      </div>

      {/* Row 2: Kash Out / Kash In */}
      <div style={{ display: "flex", gap: 36 }}>
        {ROW2.map((a) => (
          <ActionBtn key={a.label} {...a} onAction={onAction} />
        ))}
      </div>
    </div>
  );
}
