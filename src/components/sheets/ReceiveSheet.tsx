"use client";

import { Sheet } from "@/components/layout/Sheet";
import { Icon } from "@/components/ui/Icon";
import { QRCode } from "@/components/ui/QRCode";
import { DevBadge } from "@/components/ui/DevBadge";
import { useToast } from "@/hooks/useToast";
import { useWallet } from "@/hooks/useWallet";

interface ReceiveSheetProps {
  onClose: () => void;
}

export function ReceiveSheet({ onClose }: ReceiveSheetProps) {
  const { addToast } = useToast();
  const { address } = useWallet();

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      addToast("Copied to clipboard", "info");
    } catch {
      addToast("Copy failed", "error");
    }
  };

  const handleShare = async () => {
    if (navigator.share && address) {
      try {
        await navigator.share({ title: "My K-Kash", text: address });
      } catch {
        // user cancelled
      }
    } else {
      addToast("Share link ready", "info");
    }
  };

  return (
    <Sheet onClose={onClose}>
      <div
        style={{
          padding: "0 24px 48px",
          animation: "scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 0 28px",
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Receive KOLI
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <DevBadge />
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
        </div>

        {/* QR code */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 28,
            animation: "scaleIn 0.35s 0.08s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <div
            style={{
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "var(--sh-md)",
            }}
          >
            <QRCode value={address ?? ""} size={188} />
          </div>
        </div>

        {/* Address */}
        <div
          style={{
            background: "var(--bg-input)",
            borderRadius: 13,
            padding: "14px 16px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 12,
              color: "var(--txt-2)",
              letterSpacing: "0.045em",
              wordBreak: "break-all",
              lineHeight: 1.8,
              textAlign: "center",
            }}
          >
            {address}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn-primary"
            onClick={handleCopy}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Icon name="copy" size={16} color="#fff" strokeWidth={2} />
            Copy
          </button>
          <button
            className="btn-ghost"
            onClick={handleShare}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Icon name="share" size={16} color="var(--txt-1)" strokeWidth={2} />
            Share
          </button>
        </div>
      </div>
    </Sheet>
  );
}
