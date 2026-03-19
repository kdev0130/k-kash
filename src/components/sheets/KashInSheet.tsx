"use client";

import { Sheet } from "@/components/layout/Sheet";
import { Icon } from "@/components/ui/Icon";

interface KashInSheetProps {
  onClose: () => void;
}

export function KashInSheet({ onClose }: KashInSheetProps) {
  return (
    <Sheet onClose={onClose}>
      <div
        style={{
          padding: "0 24px 44px",
          animation: "scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 0 20px",
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--txt-1)" }}>
            Kash In
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--bg-input)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="close" size={13} color="var(--txt-2)" strokeWidth={2.5} />
          </button>
        </div>

        <div
          style={{
            background: "var(--bg-group)",
            borderRadius: 16,
            padding: "20px 16px",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--txt-1)", marginBottom: 8 }}>
            Kash In — Coming Soon
          </div>
          <div style={{ fontSize: 14, color: "var(--txt-2)", lineHeight: 1.6 }}>
            Kash In is not functional yet. This feature will be available in a future update.
          </div>
        </div>

        <button className="btn-ghost" disabled style={{ opacity: 0.65, cursor: "not-allowed" }}>
          Coming Soon
        </button>
      </div>
    </Sheet>
  );
}
