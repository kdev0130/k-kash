import { Icon } from "@/components/ui/Icon";
import { StatusDot } from "@/components/ui/StatusDot";
import type { Transaction } from "@/types/wallet";

interface TransactionRowProps {
  tx: Transaction;
  onClick?: (tx: Transaction) => void;
}

export function TransactionRow({ tx, onClick }: TransactionRowProps) {
  const isReceive = tx.type === "receive";

  return (
    <div
      onClick={() => onClick?.(tx)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 13,
        padding: "13px 0",
        borderBottom: "1px solid var(--sep)",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 13,
          flexShrink: 0,
          background: isReceive
            ? "rgba(48,209,88,0.10)"
            : "rgba(198,168,79,0.09)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          name={isReceive ? "down" : "up"}
          size={17}
          color={isReceive ? "#30D158" : "var(--gold)"}
          strokeWidth={2.2}
        />
      </div>

      {/* Label + subtext */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: "var(--txt-1)",
          }}
        >
          {tx.label}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--txt-3)",
            marginTop: 2,
            fontFamily: "var(--mono)",
            letterSpacing: "0.03em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {tx.sub}
        </div>
      </div>

      {/* Amount + status */}
      <div
        style={{
          textAlign: "right",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: isReceive ? "#30D158" : "var(--txt-1)",
          }}
        >
          {tx.amt}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <StatusDot status={tx.stat} />
          <span style={{ fontSize: 11, color: "var(--txt-3)" }}>{tx.time}</span>
        </div>
      </div>
    </div>
  );
}
