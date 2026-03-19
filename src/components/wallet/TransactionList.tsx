import { TransactionRow } from "./TransactionRow";
import type { Transaction } from "@/types/wallet";

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
  label?: string;
  onSelect?: (tx: Transaction) => void;
}

export function TransactionList({
  transactions,
  limit,
  label = "Recent",
  onSelect,
}: TransactionListProps) {
  const items = limit ? transactions.slice(0, limit) : transactions;

  if (items.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "32px 0",
          fontSize: 14,
          color: "var(--txt-3)",
        }}
      >
        No transactions yet
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "0 20px",
        animation: "fadeIn 0.4s 0.12s ease both",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--txt-3)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {label}
      </div>

      <div
        style={{
          background: "var(--bg-2)",
          borderRadius: 16,
          boxShadow: "var(--sh-sm)",
          overflow: "hidden",
          padding: "0 14px",
        }}
      >
        {items.map((tx, i) => (
          <TransactionRow
            key={tx.id}
            tx={tx}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
