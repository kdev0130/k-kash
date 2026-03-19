import type { TransactionStatus } from "@/types/wallet";

const config: Record<TransactionStatus, { bg: string; animate: boolean }> = {
  success: { bg: "#30D158", animate: false },
  pending: { bg: "#FF9F0A", animate: true  },
  failed:  { bg: "#FF3B30", animate: false },
};

interface StatusDotProps {
  status: TransactionStatus;
}

export function StatusDot({ status }: StatusDotProps) {
  const { bg, animate } = config[status];
  return (
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: bg,
        display: "inline-block",
        flexShrink: 0,
        animation: animate ? "pulseDot 1.6s ease infinite" : undefined,
      }}
    />
  );
}
