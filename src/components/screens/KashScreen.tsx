"use client";

import { Icon } from "@/components/ui/Icon";
import { useWallet } from "@/hooks/useWallet";
import { formatAmount } from "@/lib/utils";
import type { SheetType } from "@/types/ui";

interface KashScreenProps {
  openSheet: (s: NonNullable<SheetType>) => void;
}

export function KashScreen({ openSheet }: KashScreenProps) {
  const { koliBalance } = useWallet();

  const balance = koliBalance?.amount ?? 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch" as any,
        paddingBottom: 24,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px 20px 0",
          animation: "fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--txt-1)" }}>
          Kash
        </div>
        <div style={{ fontSize: 14, color: "var(--txt-3)", marginTop: 3, letterSpacing: "-0.01em" }}>
          Cash in & out of your KOLI balance
        </div>
      </div>

      {/* Balance pill */}
      <div
        style={{
          margin: "18px 20px 24px",
          background: "var(--bg-group)",
          borderRadius: 16,
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          animation: "fadeUp 0.35s 0.04s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "var(--gold-faint)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="wallet" size={18} color="var(--gold)" strokeWidth={1.8} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "var(--txt-3)", marginBottom: 2 }}>Available Balance</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--txt-1)", letterSpacing: "-0.02em" }}>
            {formatAmount(balance)}{" "}
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--gold)" }}>KOLI</span>
          </div>
        </div>
      </div>

      {/* Cards wrapper */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ─── Kash Out card ─── */}
        <div
          style={{
            background: "var(--bg-2)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "var(--sh-sm)",
            animation: "fadeUp 0.35s 0.08s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "18px 20px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid var(--sep)",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "var(--gold-faint)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="kash_out" size={19} color="var(--gold)" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--txt-1)", letterSpacing: "-0.02em" }}>
                Kash Out
              </div>
              <div style={{ fontSize: 12, color: "var(--txt-3)", marginTop: 1 }}>
                Kash Out
              </div>
            </div>
          </div>

          {/* Details */}
          <div style={{ padding: "14px 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            <InfoRow label="Status" value="Available" />

            <button
              onClick={() => openSheet("kash_out")}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "15px",
                background: "var(--bg-input)",
                border: "1px solid var(--sep)",
                borderRadius: 16,
                color: "var(--txt-2)",
                fontFamily: "var(--font)",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
              }}
              onMouseDown={(e) => { (e.currentTarget.style.transform = "scale(0.98)"); }}
              onMouseUp={(e) => { (e.currentTarget.style.transform = ""); }}
              onTouchStart={(e) => { (e.currentTarget.style.transform = "scale(0.98)"); }}
              onTouchEnd={(e) => { (e.currentTarget.style.transform = ""); }}
            >
              <Icon name="kash_out" size={17} color="var(--gold)" strokeWidth={2.3} />
              Cash Out
            </button>
          </div>
        </div>

        {/* ─── Kash In card ─── */}
        <div
          style={{
            background: "var(--bg-2)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "var(--sh-sm)",
            opacity: 0.72,
            animation: "fadeUp 0.35s 0.13s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "18px 20px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid var(--sep)",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(99,102,241,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="kash_in" size={19} color="#818CF8" strokeWidth={2.2} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--txt-1)", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
                Kash In
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#818CF8",
                    background: "rgba(99,102,241,0.12)",
                    borderRadius: 6,
                    padding: "2px 7px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Soon
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--txt-3)", marginTop: 1 }}>
                Kash In
              </div>
            </div>
          </div>

          {/* Placeholder content */}
          <div style={{ padding: "14px 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            <InfoRow label="Status" value="Coming Soon" />
            <InfoRow label="Network" value="Solana" />

            <button
              disabled
              style={{
                marginTop: 4,
                width: "100%",
                padding: "15px",
                background: "var(--bg-input)",
                border: "1px dashed var(--sep)",
                borderRadius: 16,
                color: "var(--txt-3)",
                fontFamily: "var(--font)",
                fontSize: 15,
                fontWeight: 500,
                cursor: "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Icon name="kash_in" size={17} color="var(--txt-3)" strokeWidth={2.3} />
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 13, color: "var(--txt-3)" }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          color: "var(--txt-2)",
          fontFamily: mono ? "var(--mono)" : undefined,
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}
