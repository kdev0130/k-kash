"use client";

import { useMemo, useState } from "react";
import { Sheet } from "@/components/layout/Sheet";
import { Icon } from "@/components/ui/Icon";
import { useWallet } from "@/hooks/useWallet";
import { formatAmount } from "@/lib/utils";

interface KashOutSheetProps {
  onClose: () => void;
}

type Merchant = {
  id: string;
  name: string;
  rate: string;
  success: string;
  eta: string;
  accent: string;
  icon: string;
};

const MERCHANTS: Merchant[] = [
  { id: "trusted", name: "Trusted Coin Desk", rate: "1 KOLI = P1 PHP", success: "99.0%", eta: "11 min", accent: "#A855F7", icon: "?" },
  { id: "manila", name: "Manila Coin Traders", rate: "1 KOLI = P1 PHP", success: "98.4%", eta: "14 min", accent: "#F59E0B", icon: "B" },
  { id: "koincash", name: "KoinCash Direct", rate: "1 KOLI = P1 PHP", success: "99.8%", eta: "6 min", accent: "#EF4444", icon: "K" },
  { id: "bayani", name: "Bayani Exchange", rate: "1 KOLI = P1 PHP", success: "97.9%", eta: "18 min", accent: "#10B981", icon: "B" },
  { id: "balanga", name: "Balanga Money Hub", rate: "1 KOLI = P1 PHP", success: "98.1%", eta: "15 min", accent: "#0EA5E9", icon: "M" },
  { id: "cityline", name: "Cityline Crypto Buyer", rate: "1 KOLI = P1 PHP", success: "98.7%", eta: "12 min", accent: "#6366F1", icon: "C" },
  { id: "cloud", name: "Cloud9 Cash Desk", rate: "1 KOLI = P1 PHP", success: "99.2%", eta: "9 min", accent: "#22C55E", icon: "C" },
  { id: "diamond", name: "Diamond Peso Traders", rate: "1 KOLI = P1 PHP", success: "98.9%", eta: "10 min", accent: "#E11D48", icon: "D" },
  { id: "ever", name: "EverTrust Remit", rate: "1 KOLI = P1 PHP", success: "97.6%", eta: "20 min", accent: "#14B8A6", icon: "E" },
  { id: "fino", name: "FinoSwap Counter", rate: "1 KOLI = P1 PHP", success: "98.5%", eta: "13 min", accent: "#F97316", icon: "F" },
  { id: "galleon", name: "Galleon Pay Center", rate: "1 KOLI = P1 PHP", success: "99.1%", eta: "8 min", accent: "#8B5CF6", icon: "G" },
  { id: "harbor", name: "Harbor Cashline", rate: "1 KOLI = P1 PHP", success: "97.8%", eta: "17 min", accent: "#06B6D4", icon: "H" },
  { id: "isla", name: "Isla Crypto Desk", rate: "1 KOLI = P1 PHP", success: "98.6%", eta: "11 min", accent: "#F43F5E", icon: "I" },
  { id: "jade", name: "Jade Peso Exchange", rate: "1 KOLI = P1 PHP", success: "99.3%", eta: "7 min", accent: "#22C55E", icon: "J" },
  { id: "kubo", name: "Kubo Money Station", rate: "1 KOLI = P1 PHP", success: "98.0%", eta: "16 min", accent: "#2563EB", icon: "K" },
  { id: "luna", name: "Luna Cashlane", rate: "1 KOLI = P1 PHP", success: "98.8%", eta: "10 min", accent: "#A855F7", icon: "L" },
  { id: "metro", name: "Metro Peso Hub", rate: "1 KOLI = P1 PHP", success: "97.7%", eta: "19 min", accent: "#0EA5E9", icon: "M" },
  { id: "north", name: "NorthStar Traders", rate: "1 KOLI = P1 PHP", success: "98.3%", eta: "14 min", accent: "#F59E0B", icon: "N" },
  { id: "orca", name: "Orca Remit", rate: "1 KOLI = P1 PHP", success: "99.4%", eta: "6 min", accent: "#6366F1", icon: "O" },
  { id: "prime", name: "PrimeCoin Buyers", rate: "1 KOLI = P1 PHP", success: "98.2%", eta: "15 min", accent: "#10B981", icon: "P" },
  { id: "quartz", name: "Quartz Pay Desk", rate: "1 KOLI = P1 PHP", success: "98.9%", eta: "9 min", accent: "#E11D48", icon: "Q" },
];

const shuffleMerchants = (items: Merchant[]) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const PAYOUT_CHANNELS = [
  { id: "gcash", label: "GCash", type: "E-Wallet" },
  { id: "maya", label: "Maya", type: "E-Wallet" },
  { id: "gotyme", label: "GoTyme", type: "E-Wallet" },
  { id: "grabpay", label: "GrabPay", type: "E-Wallet" },
  { id: "shopeepay", label: "ShopeePay", type: "E-Wallet" },
  { id: "bpi", label: "BPI", type: "Bank" },
  { id: "bdo", label: "BDO", type: "Bank" },
  { id: "unionbank", label: "UnionBank", type: "Bank" },
  { id: "metrobank", label: "Metrobank", type: "Bank" },
  { id: "landbank", label: "LandBank", type: "Bank" },
  { id: "rcbc", label: "RCBC", type: "Bank" },
  { id: "pnb", label: "PNB", type: "Bank" },
];

export function KashOutSheet({ onClose }: KashOutSheetProps) {
  const { koliBalance } = useWallet();
  const available = koliBalance?.amount ?? 0;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const merchants = useMemo(() => shuffleMerchants(MERCHANTS), []);

  const amountValue = useMemo(() => {
    const parsed = Number(amount.replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }, [amount]);

  const canProceedToDetails = Boolean(selectedMerchant);
  const canReview = amountValue > 0 && accountNumber.trim().length > 4 && Boolean(selectedChannel);

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
            padding: "22px 0 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--txt-1)" }}>
              Kash Out
            </span>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 8px",
                borderRadius: 999,
                background: "var(--bg-input)",
                fontSize: 11,
                color: "var(--txt-2)",
                fontWeight: 600,
              }}
            >
              <img src="/partners/odhex-logo.png" alt="ODHex" style={{ width: 14, height: 14, borderRadius: 4 }} />
              ODHex Partner
            </div>
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

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: step >= n ? "linear-gradient(135deg, #A855F7, #EC4899)" : "var(--bg-input)",
                  color: step >= n ? "#fff" : "var(--txt-3)",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {n}
              </div>
              {n !== 3 && (
                <div
                  style={{
                    width: 26,
                    height: 2,
                    borderRadius: 999,
                    background: step > n ? "#EC4899" : "var(--sep)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                padding: 6,
                background: "var(--bg-input)",
                borderRadius: 14,
              }}
            >
              <button
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, rgba(168,85,247,0.28), rgba(236,72,153,0.3))",
                  border: "1px solid rgba(236,72,153,0.4)",
                  color: "var(--txt-1)",
                  fontWeight: 600,
                }}
              >
                Sell KOLI
              </button>
              <button
                disabled
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "var(--bg-2)",
                  border: "1px solid var(--sep)",
                  color: "var(--txt-3)",
                  fontWeight: 600,
                  opacity: 0.6,
                }}
              >
                Buy (Soon)
              </button>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))",
                borderRadius: 16,
                padding: "16px",
                border: "1px solid rgba(236,72,153,0.35)",
              }}
            >
              <div style={{ fontSize: 12, color: "var(--txt-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Merchant Rate
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--txt-1)", marginTop: 6 }}>
                1 KOLI = P1 PHP
              </div>
              <div style={{ fontSize: 12, color: "var(--txt-2)", marginTop: 8 }}>
                Available: {formatAmount(available)} KOLI
              </div>
            </div>

            <button className="btn-primary" onClick={() => setStep(2)}>
              Choose Merchant
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--txt-1)" }}>Select Merchant Buyer</div>
              <div style={{ fontSize: 12, color: "var(--txt-3)", marginTop: 4 }}>
                {merchants.length} active merchants are available to buy your KOLI.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {merchants.map((merchant) => (
                <button
                  key={merchant.id}
                  onClick={() => setSelectedMerchant(merchant)}
                  style={{
                    width: "100%",
                    background: "var(--bg-2)",
                    borderRadius: 16,
                    padding: "14px",
                    border: selectedMerchant?.id === merchant.id ? "1px solid rgba(236,72,153,0.5)" : "1px solid var(--sep)",
                    boxShadow: "var(--sh-sm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--txt-1)" }}>
                        {merchant.name}
                      </div>
                      <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--txt-3)", marginTop: 4 }}>
                        <span>{merchant.rate}</span>
                        <span>•</span>
                        <span>{merchant.success}</span>
                        <span>•</span>
                        <span>{merchant.eta}</span>
                      </div>
                    </div>
                  </div>
                  <Icon name="chevron_r" size={14} color="var(--txt-3)" strokeWidth={2} />
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-ghost" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn-primary" disabled={!canProceedToDetails} onClick={() => setStep(3)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--txt-1)" }}>
              Sell to {selectedMerchant?.name ?? "Merchant"}
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(236,72,153,0.18))",
                borderRadius: 14,
                padding: "14px",
                border: "1px solid rgba(236,72,153,0.35)",
              }}
            >
              <div style={{ fontSize: 12, color: "var(--txt-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Merchant Rate
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--txt-1)", marginTop: 6 }}>
                1 KOLI = P1 PHP
              </div>
            </div>

            <div style={{ fontSize: 12, color: "var(--txt-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Choose Payout Channel (available for all merchants)
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 10,
              }}
            >
              {PAYOUT_CHANNELS.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  style={{
                    padding: "12px 10px",
                    borderRadius: 12,
                    border: selectedChannel === channel.id ? "1px solid rgba(236,72,153,0.5)" : "1px solid var(--sep)",
                    background: "var(--bg-2)",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--txt-1)" }}>{channel.label}</div>
                  <div style={{ fontSize: 11, color: "var(--txt-3)", marginTop: 2 }}>{channel.type}</div>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 12, color: "var(--txt-3)" }}>Amount to Sell (KOLI)</label>
              <input
                className="k-input"
                placeholder="e.g. 5000"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
              <div style={{ fontSize: 12, color: "var(--txt-3)" }}>
                Available: {formatAmount(available)} KOLI — You receive P{formatAmount(amountValue)} PHP
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 12, color: "var(--txt-3)" }}>Account Number</label>
              <input
                className="k-input"
                placeholder="Account number"
                inputMode="numeric"
                value={accountNumber}
                onChange={(event) => setAccountNumber(event.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-ghost" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn-primary" disabled={!canReview}>
                Review
              </button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
