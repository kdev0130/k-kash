"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Sheet } from "@/components/layout/Sheet";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/hooks/useToast";
import { formatAmount } from "@/lib/utils";
import { auth } from "@/lib/firebase";

interface WithdrawSheetProps {
  onClose: () => void;
}

export function WithdrawSheet({ onClose }: WithdrawSheetProps) {
  const { addToast } = useToast();
  const [available, setAvailable] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const tokenServiceUrl =
    process.env.NEXT_PUBLIC_TOKEN_SERVICE_URL ?? "http://localhost:4000";

  useEffect(() => {
    const load = async () => {
      try {
        const token = await auth.currentUser?.getIdToken(true);
        if (!token) throw new Error("Missing auth token");
        const res = await fetch(`${tokenServiceUrl}/kash/withdrawable`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to load withdrawable balance");
        }
        const data = await res.json();
        setAvailable(Number(data.totalAvailable) || 0);
      } catch (err: any) {
        addToast(err.message || "Unable to load withdrawable balance", "error");
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 250);
      }
    };
    load();
  }, [addToast, tokenServiceUrl]);

  const amountValue = useMemo(() => {
    const cleaned = amount.replace(/[^0-9.]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [amount]);

  const handleWithdraw = async () => {
    if (amountValue <= 0) {
      addToast("Enter a valid amount", "error");
      return;
    }
    if (amountValue > available) {
      addToast("Amount exceeds available balance", "error");
      return;
    }
    setSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken(true);
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(`${tokenServiceUrl}/kash/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amountValue }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Withdrawal failed");
      }
      addToast("Withdrawal sent to your wallet", "success");
      onClose();
    } catch (err: any) {
      addToast(err.message || "Withdrawal failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet onClose={onClose}>
      <div style={{ padding: "0 20px 36px", animation: "scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 0 16px" }}>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--txt-1)" }}>
            Withdraw from Pool
          </div>
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

        <div style={{ background: "var(--bg-group)", borderRadius: 16, padding: "14px 16px", marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: "var(--txt-3)" }}>Available to withdraw</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--txt-1)", marginTop: 6 }}>
            {loading ? "—" : formatAmount(available)}{" "}
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)" }}>KOLI</span>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "10px 0 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.]?[0-9]*"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-label="Withdraw amount"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "clamp(42px,12vw,62px)",
                fontWeight: 700,
                letterSpacing: "-0.035em",
                color: "var(--txt-1)",
                minWidth: 120,
                textAlign: "right",
                caretColor: "var(--gold)",
                fontFamily: "var(--font)",
              }}
            />
            <span style={{ fontSize: 17, fontWeight: 600, color: "var(--gold)", letterSpacing: "0.02em" }}>
              KOLI
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--txt-3)", marginTop: 6 }}>
            Max: {formatAmount(available)} KOLI
            <button
              onClick={() => setAmount(String(available))}
              style={{
                marginLeft: 10,
                color: "var(--gold)",
                fontWeight: 600,
                fontSize: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              MAX
            </button>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={handleWithdraw}
          disabled={submitting || loading}
          style={{ opacity: submitting || loading ? 0.7 : 1 }}
        >
          {submitting ? "Sending…" : "Withdraw Now"}
        </button>
      </div>
    </Sheet>
  );
}
