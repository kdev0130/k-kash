"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NavBar } from "@/components/layout/NavBar";
import { TransactionRow } from "@/components/wallet/TransactionRow";
import type { Transaction } from "@/types/wallet";

function getUserId(): string | null {
  try {
    const raw = localStorage.getItem("koli_auth_user");
    if (raw) return JSON.parse(raw).id ?? null;
  } catch {}
  return null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function groupKey(dateStr: string): "Today" | "Yesterday" | "Earlier" {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const txDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (txDay.getTime() === today.getTime()) return "Today";
  if (txDay.getTime() === yesterday.getTime()) return "Yesterday";
  return "Earlier";
}

export function ActivityScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) { setLoading(false); return; }

    let contracts: Transaction[] = [];
    let payouts: Transaction[] = [];
    let loaded = 0;
    const merge = () => {
      loaded++;
      if (loaded < 2) return;
      const all = [...contracts, ...payouts].sort((a, b) => {
        // Embedded date in sub field — sort by time string isn't viable, keep original order
        return 0;
      });
      // Re-sort by embedded date stored in the raw field
      setTransactions(all);
      setLoading(false);
    };

    // Donations → "receive"
    const q1 = query(collection(db, "donationContracts"), where("userId", "==", userId));
    const unsub1 = onSnapshot(q1, (snap) => {
      contracts = snap.docs.map((doc) => {
        const d = doc.data();
        const date = d.createdAt ?? d.donationStartDate ?? "";
        return {
          id: doc.id,
          type: "receive" as const,
          label: d.contractType === "monthly_12_no_principal" ? "Monthly Deposit" : "Lock-in Deposit",
          sub: `₱${Number(d.donationAmount).toLocaleString()} • ${d.paymentMethod?.replace("bank:", "") ?? ""}`,
          amt: `+${Number(d.donationAmount).toLocaleString()}`,
          stat: (d.status === "approved" ? "success" : d.status === "pending" ? "pending" : "failed") as Transaction["stat"],
          time: date ? timeAgo(date) : "",
          signature: doc.id,
          _date: date,
        } as Transaction & { _date: string };
      });
      merge();
    });

    // Payouts → "send"
    const q2 = query(collection(db, "payout_queue"), where("userId", "==", userId));
    const unsub2 = onSnapshot(q2, (snap) => {
      payouts = snap.docs.map((doc) => {
        const d = doc.data();
        const date = d.requestedAt ?? "";
        return {
          id: doc.id,
          type: "send" as const,
          label: d.withdrawalType === "MANA_REWARDS" ? "Reward Withdrawal" : "Contract Withdrawal",
          sub: `₱${Number(d.amount).toLocaleString()} • ${d.userEmail ?? ""}`,
          amt: `−${Number(d.amount).toLocaleString()}`,
          stat: (d.status === "completed" || d.status === "approved" ? "success" : d.status === "pending" || d.status === "processing" ? "pending" : "failed") as Transaction["stat"],
          time: date ? timeAgo(date) : "",
          signature: doc.id,
          _date: date,
        } as Transaction & { _date: string };
      });
      merge();
    });

    return () => { unsub1(); unsub2(); };
  }, []);

  // Sort and group
  const sorted = [...transactions].sort((a, b) => {
    const da = (a as any)._date ?? "";
    const db_ = (b as any)._date ?? "";
    return da < db_ ? 1 : da > db_ ? -1 : 0;
  });

  const groups: Record<string, Transaction[]> = {};
  sorted.forEach((tx) => {
    const key = groupKey((tx as any)._date ?? "");
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  });

  const groupOrder = ["Today", "Yesterday", "Earlier"] as const;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch" as any,
        paddingBottom: 90,
      }}
    >
      <NavBar title="Activity" />

      <div style={{ padding: "16px 20px 24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "var(--txt-3)", padding: "48px 0", fontSize: 14 }}>
            Loading transactions…
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--txt-3)", padding: "48px 0", fontSize: 14 }}>
            No transactions yet
          </div>
        ) : (
          groupOrder.filter((g) => groups[g]?.length).map((g, gi) => (
            <div
              key={g}
              style={{
                marginBottom: 26,
                animation: `fadeUp 0.35s ${gi * 0.07}s cubic-bezier(0.16,1,0.3,1) both`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--txt-3)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {g}
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
                {groups[g].map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

