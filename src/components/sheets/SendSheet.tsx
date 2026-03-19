"use client";

import { useState, useRef, useEffect } from "react";
import { Sheet } from "@/components/layout/Sheet";
import { Icon } from "@/components/ui/Icon";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { QRScanner } from "@/components/ui/QRScanner";
import { useToast } from "@/hooks/useToast";
import { useWallet } from "@/hooks/useWallet";
import { formatAmount, shorten } from "@/lib/utils";

interface SendSheetProps {
  onClose: () => void;
}

export function SendSheet({ onClose }: SendSheetProps) {
  const { addToast } = useToast();
  const { koliBalance } = useWallet();

  const [step, setStep] = useState<1 | 2>(1);
  const [to,   setTo]   = useState("");
  const [amt,  setAmt]  = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const amtInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (step === 1) setTimeout(() => amtInputRef.current?.focus(), 380);
  }, [step]);

  const handleContinue = () => {
    if (!to.trim()) { addToast("Enter a recipient address", "error"); return; }
    if (!amt || Number(amt) <= 0) { addToast("Enter an amount", "error"); return; }
    const max = koliBalance?.amount ?? 0;
    if (Number(amt) > max) { addToast("Insufficient balance", "error"); return; }
    setStep(2);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onClose();
    addToast("Transaction submitted", "info");
  };

  const handleAmountChange = (rawValue: string) => {
    const cleaned = rawValue.replace(/[^\d.]/g, "");
    const dotIndex = cleaned.indexOf(".");
    if (dotIndex === -1) {
      setAmt(cleaned);
      return;
    }
    const integerPart = cleaned.slice(0, dotIndex + 1);
    const decimalPart = cleaned.slice(dotIndex + 1).replace(/\./g, "");
    setAmt(`${integerPart}${decimalPart}`);
  };

  const max = koliBalance?.amount ?? 0;

  return (
    <Sheet onClose={onClose}>
      {showScanner && (
        <QRScanner
          onScan={(address) => { setTo(address); setShowScanner(false); addToast("Address scanned", "success"); }}
          onClose={() => setShowScanner(false)}
        />
      )}
      {showConfirm && (
        <ConfirmDialog
          title="Send KOLI"
          message={`Send ${formatAmount(Number(amt))} KOLI to ${shorten(to)}? This cannot be undone.`}
          confirmLabel="Yes, Send"
          danger
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {step === 1 ? (
        <div
          style={{ padding: "0 20px 44px", animation: "scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <Header title="Send KOLI" onClose={onClose} />

          {/* Big amount input */}
          <div style={{ textAlign: "center", padding: "4px 0 28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <input
                ref={amtInputRef}
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]*"
                placeholder="0"
                value={amt}
                onChange={(e) => handleAmountChange(e.target.value)}
                aria-label="Send amount"
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "clamp(52px,13vw,68px)",
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  color: "var(--txt-1)",
                  minWidth: 150,
                  maxWidth: 320,
                  width: `${Math.max(150, amt.length * 32)}px`,
                  textAlign: "right",
                  caretColor: "var(--gold)",
                  fontFamily: "var(--font)",
                  overflow: "visible",
                  transition: "width 0.2s",
                }}
              />
              <span
                style={{
                  fontSize: 19,
                  fontWeight: 600,
                  color: "var(--gold)",
                  letterSpacing: "0.02em",
                  paddingTop: 2,
                }}
              >
                KOLI
              </span>
            </div>
            <div style={{ fontSize: 13, color: "var(--txt-3)", marginTop: 5 }}>
              Balance:{" "}
              <span style={{ color: "var(--txt-2)", fontWeight: 500 }}>
                {formatAmount(max)} KOLI
              </span>
              <button
                onClick={() => setAmt(String(max))}
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

          {/* Recipient */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ position: "relative" }}>
              <input
                className="k-input"
                placeholder="Recipient address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                aria-label="Recipient address"
                style={{ paddingRight: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                aria-label="Scan QR code"
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                  borderRadius: 8,
                  color: "var(--gold)",
                }}
              >
                <Icon name="scan" size={19} color="var(--gold)" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* Fee */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 4px 22px",
              fontSize: 13,
              color: "var(--txt-3)",
            }}
          >
            <span>Network fee</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--txt-2)" }}>
              ~0.000005 SOL
            </span>
          </div>

          <button className="btn-primary" onClick={handleContinue}>
            Continue
          </button>
        </div>
      ) : (
        <div
          style={{ padding: "0 20px 44px", animation: "scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "22px 0 16px",
            }}
          >
            <button
              onClick={() => setStep(1)}
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
              <Icon name="chevron_l" size={14} color="var(--txt-2)" strokeWidth={2.5} />
            </button>
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em" }}>
              Confirm Send
            </span>
          </div>

          {/* Confirm amount */}
          <div style={{ textAlign: "center", padding: "24px 0 28px" }}>
            <div
              style={{
                fontSize: "clamp(44px,11vw,58px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--txt-1)",
                animation: "numUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              {formatAmount(Number(amt))}
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 500,
                color: "var(--gold)",
                marginTop: 5,
                letterSpacing: "0.03em",
              }}
            >
              KOLI
            </div>
          </div>

          {/* Details */}
          <div
            style={{
              background: "var(--bg-group)",
              borderRadius: 16,
              marginBottom: 22,
              overflow: "hidden",
            }}
          >
            {[
              ["To",      to.length > 10 ? shorten(to) : to || "—"],
              ["Network", "Devnet"],
              ["Fee",     "~0.000005 SOL"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "13px 16px",
                  borderBottom: k !== "Fee" ? "1px solid var(--sep)" : "none",
                  background: "var(--bg-group)",
                }}
              >
                <span style={{ flex: 1, fontSize: 14, color: "var(--txt-2)" }}>{k}</span>
                <span
                  style={{
                    fontSize: 14,
                    color: "var(--txt-1)",
                    fontFamily: k === "Fee" ? "var(--mono)" : undefined,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={() => setShowConfirm(true)} style={{ marginBottom: 10 }}>
            Confirm
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      )}
    </Sheet>
  );
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 0 20px",
      }}
    >
      <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--txt-1)" }}>{title}</span>
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
  );
}
