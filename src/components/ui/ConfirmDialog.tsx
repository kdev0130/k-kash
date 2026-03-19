"use client";

import { Icon } from "@/components/ui/Icon";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    /* Backdrop */
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 900,
        background: "rgba(0,0,0,0.50)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        animation: "fadeIn 0.18s ease both",
      }}
    >
      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 430,
          background: "var(--bg-sheet)",
          borderRadius: "22px 22px 0 0",
          padding: "28px 24px 40px",
          animation: "slideUp 0.28s cubic-bezier(0.16,1,0.3,1) both",
          border: "1px solid var(--sep)",
          borderBottom: "none",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: danger ? "rgba(255,59,48,0.10)" : "rgba(198,168,79,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Icon
            name={danger ? "disconnect" : "info"}
            size={24}
            color={danger ? "#FF3B30" : "var(--gold)"}
            strokeWidth={1.8}
          />
        </div>

        {/* Text */}
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--txt-1)",
            textAlign: "center",
            margin: "0 0 8px",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--txt-2)",
            textAlign: "center",
            lineHeight: 1.5,
            margin: "0 0 28px",
            letterSpacing: "-0.01em",
          }}
        >
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={onConfirm}
            style={{
              width: "100%",
              padding: "15px",
              background: danger ? "#FF3B30" : "var(--gold)",
              border: "none",
              borderRadius: 16,
              color: "#fff",
              fontFamily: "var(--font)",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              cursor: "pointer",
              transition: "filter 0.12s ease, transform 0.12s ease",
            }}
            onMouseDown={(e) => { (e.currentTarget.style.filter = "brightness(0.92)"); (e.currentTarget.style.transform = "scale(0.98)"); }}
            onMouseUp={(e) => { (e.currentTarget.style.filter = ""); (e.currentTarget.style.transform = ""); }}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="btn-ghost"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
