import type { ToastPayload } from "@/types/ui";
import { Icon } from "@/components/ui/Icon";

const VARIANTS: Record<string, { bg: string; border: string; iconColor: string; icon: string }> = {
  info:    { bg: "rgba(30,30,32,0.92)",   border: "rgba(255,255,255,0.10)", iconColor: "#8E8E93", icon: "info"    },
  success: { bg: "rgba(14,68,28,0.95)",   border: "rgba(48,209,88,0.30)",  iconColor: "#30D158", icon: "check"   },
  warn:    { bg: "rgba(80,50,0,0.95)",    border: "rgba(255,159,10,0.30)", iconColor: "#FF9F0A", icon: "info"    },
  error:   { bg: "rgba(80,10,8,0.95)",    border: "rgba(255,59,48,0.30)",  iconColor: "#FF3B30", icon: "close"   },
};

export function Toast({ msg, type }: ToastPayload) {
  const v = VARIANTS[type ?? "info"];
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 92,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 16px 10px 12px",
        borderRadius: 40,
        background: v.bg,
        border: `1px solid ${v.border}`,
        color: "#fff",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "-0.01em",
        zIndex: 999,
        whiteSpace: "nowrap",
        animation: "toastIn 0.28s cubic-bezier(0.16,1,0.3,1) both",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Icon name={v.icon as any} size={14} color={v.iconColor} strokeWidth={2.5} />
      {msg}
    </div>
  );
}
